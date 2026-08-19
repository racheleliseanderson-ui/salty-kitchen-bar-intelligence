import { daysUntil } from "@/lib/utils";
import { RECIPES } from "./catalog";
import { inventoryHarmony, pairScore } from "./flavors";
import { covers } from "./hierarchy";
import type {
  InventoryItem,
  MatchHit,
  RankBreakdown,
  RankFactor,
  Recipe,
  SmartBuy,
} from "./types";

export function expiryUrgency(iso: string | null): number {
  const days = daysUntil(iso);
  if (days === null) return 0;
  if (days < 0) return 1;
  if (days <= 2) return 0.9;
  if (days <= 6) return 0.55;
  if (days <= 14) return 0.25;
  return 0;
}

export function urgencyLabel(iso: string | null): "high" | "medium" | "low" | "none" {
  const n = expiryUrgency(iso);
  if (n >= 0.8) return "high";
  if (n >= 0.4) return "medium";
  if (n > 0) return "low";
  return "none";
}

function haveSet(items: InventoryItem[]): Set<string> {
  return new Set(items.map((i) => i.normalizedName));
}

function recipeFlavor(recipe: Recipe, have: string[]): number {
  const names = [...recipe.required, ...recipe.optional].filter((n) => have.includes(n));
  if (names.length >= 2) return inventoryHarmony(names);
  if (names.length === 1) {
    const other = recipe.required.find((n) => n !== names[0]);
    return other ? pairScore(names[0]!, other).composite : 0.5;
  }
  return 0.45;
}

/** Strongest on-hand pair for this recipe (for explainability). */
function topFlavorPair(
  recipe: Recipe,
  have: string[],
): { a: string; b: string; score: number } | null {
  const names = [...new Set([...recipe.required, ...recipe.optional].filter((n) => have.includes(n)))];
  if (names.length < 2) return null;
  let best: { a: string; b: string; score: number } | null = null;
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const score = pairScore(names[i]!, names[j]!).composite;
      if (!best || score > best.score) best = { a: names[i]!, b: names[j]!, score };
    }
  }
  return best;
}

export function scoreRecipe(recipe: Recipe, items: InventoryItem[]): MatchHit {
  const names = haveSet(items);
  const have: string[] = [];
  const missing: string[] = [];
  const substituted: { needed: string; used: string }[] = [];

  for (const needed of recipe.required) {
    const cover = covers(names, needed);
    if (cover.kind === "exact" && cover.used) {
      have.push(needed);
    } else if (cover.kind && cover.used) {
      have.push(needed);
      substituted.push({ needed, used: cover.used });
    } else {
      missing.push(needed);
    }
  }

  const matchPct = recipe.required.length === 0 ? 1 : have.length / recipe.required.length;
  const urgent = items
    .filter((i) => have.includes(i.normalizedName) || substituted.some((s) => s.used === i.normalizedName))
    .reduce((max, i) => Math.max(max, expiryUrgency(i.expiry)), 0);
  const flavorScore = recipeFlavor(recipe, [...names]);
  const subPenalty = substituted.length * 0.04;
  const timeBias = recipe.minutes <= 15 ? 0.04 : recipe.minutes <= 25 ? 0.02 : 0;
  const composite =
    matchPct * (1 + 0.28 * urgent) * (0.72 + 0.28 * flavorScore) * (1 - subPenalty) + timeBias;

  return {
    recipe,
    have,
    missing,
    substituted,
    matchPct,
    expiryBoost: urgent,
    flavorScore,
    composite: Number(composite.toFixed(3)),
    tier: missing.length === 0 ? "now" : "almost",
  };
}

/** Human-readable one-liner (kept for compact surfaces). */
export function explainRank(hit: MatchHit): string {
  return buildBreakdown(hit, []).summary;
}

/** Full structured explanation for the match card "Why this rank" panel. */
export function buildBreakdown(hit: MatchHit, items: InventoryItem[]): RankBreakdown {
  const required = hit.recipe.required.length;
  const haveCount = hit.have.length;
  const coverageLabel =
    required === 0
      ? "No required ingredients"
      : `${haveCount} of ${required} required on hand${hit.substituted.length ? ` (${hit.substituted.length} via hierarchy)` : ""}`;

  const urgentItems = urgentForHit(hit, items).map((i) => ({
    displayName: i.displayName,
    normalizedName: i.normalizedName,
    days: daysUntil(i.expiry),
  }));

  let expiryLabel = "No near-expiry boost";
  if (hit.expiryBoost >= 0.8) {
    expiryLabel =
      urgentItems.length > 0
        ? `Strong boost — ${urgentItems.map((u) => u.displayName).join(", ")} due soon or past`
        : "Strong near-expiry boost";
  } else if (hit.expiryBoost >= 0.4) {
    expiryLabel =
      urgentItems.length > 0
        ? `Moderate boost — ${urgentItems.map((u) => u.displayName).join(", ")} due this week`
        : "Moderate near-expiry boost";
  } else if (hit.expiryBoost > 0) {
    expiryLabel = "Light expiry signal";
  }

  const topPair = topFlavorPair(hit.recipe, [
    ...hit.have,
    ...hit.substituted.map((s) => s.used),
  ]);
  let flavorLabel = "Baseline flavor fit";
  if (hit.flavorScore >= 0.7) flavorLabel = "Strong flavor harmony among on-hand ingredients";
  else if (hit.flavorScore >= 0.55) flavorLabel = "Solid flavor co-occurrence";
  else if (hit.flavorScore < 0.45) flavorLabel = "Sparse flavor signal — ranking leans on coverage";
  if (topPair) {
    flavorLabel += ` · best pair ${topPair.a} + ${topPair.b} (${topPair.score.toFixed(2)})`;
  }

  const hierarchyPenalty = hit.substituted.length * 0.04;
  const hierarchyLabel =
    hit.substituted.length === 0
      ? "Exact matches only — no hierarchy swaps"
      : hit.substituted.map((s) => `${s.used} covers ${s.needed}`).join("; ") +
        ` (−${(hierarchyPenalty * 100).toFixed(0)}% hierarchy penalty)`;

  const timeBias = hit.recipe.minutes <= 15 ? 0.04 : hit.recipe.minutes <= 25 ? 0.02 : 0;
  const timeLabel =
    timeBias > 0
      ? `${hit.recipe.minutes} min — small speed bonus`
      : `${hit.recipe.minutes} min — no speed bonus`;

  const factors: RankFactor[] = [
    {
      key: "coverage",
      label: "Coverage",
      detail: coverageLabel,
      strength: hit.matchPct,
      impact: hit.matchPct >= 1 ? "up" : hit.matchPct >= 0.66 ? "neutral" : "down",
    },
    {
      key: "expiry",
      label: "Expiry",
      detail: expiryLabel,
      strength: Math.min(1, hit.expiryBoost),
      impact: hit.expiryBoost >= 0.4 ? "up" : "neutral",
    },
    {
      key: "flavor",
      label: "Flavor",
      detail: flavorLabel,
      strength: Math.min(1, hit.flavorScore),
      impact: hit.flavorScore >= 0.55 ? "up" : "neutral",
    },
    {
      key: "hierarchy",
      label: "Hierarchy",
      detail: hierarchyLabel,
      strength: hit.substituted.length === 0 ? 1 : Math.max(0.2, 1 - hierarchyPenalty * 4),
      impact: hit.substituted.length === 0 ? "neutral" : "down",
    },
    {
      key: "time",
      label: "Time",
      detail: timeLabel,
      strength: timeBias > 0 ? 0.6 + timeBias * 5 : 0.25,
      impact: timeBias > 0 ? "up" : "neutral",
    },
  ];

  if (hit.missing.length > 0) {
    factors.push({
      key: "gap",
      label: "Gap",
      detail:
        hit.missing.length === 1
          ? `Only needs ${hit.missing[0]}`
          : `Needs ${hit.missing.join(" + ")}`,
      strength: 1 - hit.missing.length / Math.max(1, required),
      impact: "down",
    });
  }

  const summaryParts: string[] = [];
  if (hit.tier === "now" && hit.substituted.length === 0) summaryParts.push("Full exact coverage");
  else if (hit.tier === "now") summaryParts.push("Full coverage via hierarchy");
  if (hit.expiryBoost >= 0.4) summaryParts.push("expiry boost");
  if (hit.flavorScore >= 0.55) summaryParts.push("flavor fit");
  if (hit.missing.length === 1) summaryParts.push(`needs ${hit.missing[0]}`);
  else if (hit.missing.length === 2) summaryParts.push(`needs ${hit.missing.join(" + ")}`);
  if (timeBias > 0) summaryParts.push("quick");
  const summary =
    summaryParts.length > 0
      ? summaryParts.join(" · ")
      : hit.tier === "now"
        ? "Everything required is on hand"
        : "Close — one or two ingredients away";

  const formula = `match ${Math.round(hit.matchPct * 100)}% × (1 + 0.28·expiry ${hit.expiryBoost.toFixed(2)}) × (0.72 + 0.28·flavor ${hit.flavorScore.toFixed(2)}) × (1 − hierarchy ${hierarchyPenalty.toFixed(2)}) + time ${timeBias.toFixed(2)} → ${hit.composite}`;

  return {
    summary,
    formula,
    factors,
    coverage: {
      have: haveCount,
      required,
      pct: hit.matchPct,
      label: coverageLabel,
    },
    expiry: {
      boost: hit.expiryBoost,
      items: urgentItems,
      label: expiryLabel,
    },
    flavor: {
      score: hit.flavorScore,
      label: flavorLabel,
      topPair,
    },
    hierarchy: {
      swaps: hit.substituted,
      penalty: hierarchyPenalty,
      label: hierarchyLabel,
    },
    time: {
      minutes: hit.recipe.minutes,
      bias: timeBias,
      label: timeLabel,
    },
  };
}

/** Inventory items that are powering the expiry boost on this hit. */
export function urgentForHit(hit: MatchHit, items: InventoryItem[]): InventoryItem[] {
  const names = new Set([...hit.have, ...hit.substituted.map((s) => s.used)]);
  return items
    .filter((i) => names.has(i.normalizedName) && expiryUrgency(i.expiry) >= 0.4)
    .sort((a, b) => expiryUrgency(b.expiry) - expiryUrgency(a.expiry));
}

export type RankSort = "best" | "quickest" | "expiry";

export function rankRecipes(
  items: InventoryItem[],
  opts?: {
    kind?: "food" | "cocktail" | "all";
    maxMissing?: number;
    maxMinutes?: number | null;
    skill?: "easy" | "medium" | "involved" | "all";
    sort?: RankSort;
  },
): MatchHit[] {
  const kind = opts?.kind ?? "all";
  const maxMissing = opts?.maxMissing ?? 2;
  const maxMinutes = opts?.maxMinutes ?? null;
  const skill = opts?.skill ?? "all";
  const sort = opts?.sort ?? "best";

  let hits = RECIPES.filter((r) => kind === "all" || r.kind === kind)
    .map((r) => scoreRecipe(r, items))
    .filter((h) => h.missing.length <= maxMissing);

  if (maxMinutes != null) hits = hits.filter((h) => h.recipe.minutes <= maxMinutes);
  if (skill !== "all") hits = hits.filter((h) => h.recipe.skill === skill);

  return hits.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier === "now" ? -1 : 1;
    if (sort === "quickest") {
      if (a.recipe.minutes !== b.recipe.minutes) return a.recipe.minutes - b.recipe.minutes;
      return b.composite - a.composite;
    }
    if (sort === "expiry") {
      if (a.expiryBoost !== b.expiryBoost) return b.expiryBoost - a.expiryBoost;
      return b.composite - a.composite;
    }
    return b.composite - a.composite;
  });
}

export function smartBuys(items: InventoryItem[], limit = 8): SmartBuy[] {
  const names = haveSet(items);
  const tallies = new Map<string, Set<string>>();
  for (const recipe of RECIPES) {
    const hit = scoreRecipe(recipe, items);
    if (hit.missing.length !== 1) continue;
    const miss = hit.missing[0]!;
    if (names.has(miss)) continue;
    const set = tallies.get(miss) ?? new Set<string>();
    set.add(recipe.name);
    tallies.set(miss, set);
  }
  return [...tallies.entries()]
    .map(([ingredient, unlocks]) => ({ ingredient, unlocks: [...unlocks] }))
    .sort((a, b) => b.unlocks.length - a.unlocks.length)
    .slice(0, limit);
}

/** Near-expiry inventory that is currently unlocking Now recipes. */
export function useFirstItems(items: InventoryItem[], hits: MatchHit[], limit = 5): InventoryItem[] {
  const nowHits = hits.filter((h) => h.tier === "now" && h.expiryBoost >= 0.4);
  const used = new Set<string>();
  for (const hit of nowHits) {
    for (const name of hit.have) used.add(name);
    for (const s of hit.substituted) used.add(s.used);
  }
  return items
    .filter((i) => used.has(i.normalizedName) && expiryUrgency(i.expiry) >= 0.4)
    .sort((a, b) => expiryUrgency(b.expiry) - expiryUrgency(a.expiry))
    .slice(0, limit);
}
