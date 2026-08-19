import { daysUntil } from "@/lib/utils";
import { RECIPES } from "./catalog";
import { MATCH_FLAVOR, recipeHarmony } from "./flavors";
import { covers } from "./hierarchy";
import type {
  ContrastDelta,
  ContrastExplanation,
  CounterfactualPreview,
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

function recipeFlavor(recipe: Recipe, have: string[]) {
  const requiredHave = recipe.required.filter((n) => have.includes(n));
  const optionalHave = recipe.optional.filter((n) => have.includes(n));
  return recipeHarmony(requiredHave, optionalHave);
}

/** Strongest on-hand pair for this recipe (for explainability). */
function topFlavorPair(recipe: Recipe, have: string[]) {
  return recipeFlavor(recipe, have).topPair;
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
  const flavor = recipeFlavor(recipe, [...names]);
  const flavorScore = flavor.score;
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
  if (hit.flavorScore >= 0.7) flavorLabel = "Strong co-occurrence among on-hand ingredients";
  else if (hit.flavorScore >= 0.55) flavorLabel = "Solid recipe co-occurrence (35/65 molecular/corpus)";
  else if (hit.flavorScore < 0.45) flavorLabel = "Sparse flavor signal — ranking leans on coverage";
  if (topPair) {
    flavorLabel += ` · best pair ${topPair.a} + ${topPair.b} (co ${topPair.cooccurrence.toFixed(2)} · mol ${topPair.molecular.toFixed(2)})`;
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

  const formula = `match ${Math.round(hit.matchPct * 100)}% × (1 + 0.28·expiry ${hit.expiryBoost.toFixed(2)}) × (0.72 + 0.28·flavor ${hit.flavorScore.toFixed(2)} @ ${MATCH_FLAVOR.cooccurrence}/${MATCH_FLAVOR.molecular} co/mol) × (1 − hierarchy ${hierarchyPenalty.toFixed(2)}) + time ${timeBias.toFixed(2)} → ${hit.composite}`;

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

/** Synthetic inventory row used only for counterfactual previews. */
function virtualItem(normalizedName: string): InventoryItem {
  return {
    id: `cf-${normalizedName}`,
    normalizedName,
    displayName: normalizedName.replace(/-/g, " "),
    category: "pantry",
    quantity: { value: 1, unit: "count" },
    expiry: null,
    location: "pantry",
    source: "manual",
    confidence: 1,
    lastUpdated: new Date().toISOString(),
    tags: ["counterfactual"],
    userNotes: "",
  };
}

function timeBiasOf(hit: MatchHit): number {
  return hit.recipe.minutes <= 15 ? 0.04 : hit.recipe.minutes <= 25 ? 0.02 : 0;
}

function hierarchyPenaltyOf(hit: MatchHit): number {
  return hit.substituted.length * 0.04;
}

/**
 * Contrastive explanation: why `preferred` ranks above `other`.
 * Caller should pass the higher-ranked hit first when order is known;
 * if composites disagree, the function re-labels winner/loser from scores.
 */
export function contrastHits(
  preferred: MatchHit,
  other: MatchHit,
  items: InventoryItem[] = [],
): ContrastExplanation {
  const aWins =
    preferred.tier !== other.tier
      ? preferred.tier === "now"
      : preferred.composite >= other.composite;
  const winner = aWins ? preferred : other;
  const loser = aWins ? other : preferred;

  const deltas: ContrastDelta[] = [];

  // Tier
  if (winner.tier !== loser.tier) {
    deltas.push({
      key: "tier",
      label: "Tier",
      winnerValue: winner.tier === "now" ? "Can make now" : "Almost",
      loserValue: loser.tier === "now" ? "Can make now" : "Almost",
      advantage: "winner",
      detail:
        winner.tier === "now"
          ? "Full coverage beats any Almost gap"
          : "Both are Almost — score decides",
    });
  }

  // Coverage
  const covAdv =
    winner.matchPct === loser.matchPct
      ? "tie"
      : winner.matchPct > loser.matchPct
        ? "winner"
        : "loser";
  deltas.push({
    key: "coverage",
    label: "Coverage",
    winnerValue: `${Math.round(winner.matchPct * 100)}% (${winner.have.length}/${winner.recipe.required.length})`,
    loserValue: `${Math.round(loser.matchPct * 100)}% (${loser.have.length}/${loser.recipe.required.length})`,
    advantage: covAdv,
    detail:
      covAdv === "tie"
        ? "Same required coverage"
        : covAdv === "winner"
          ? "More of the required list is on hand"
          : "The lower card actually has stronger coverage — other factors overrode it",
  });

  // Expiry
  const expAdv =
    Math.abs(winner.expiryBoost - loser.expiryBoost) < 0.05
      ? "tie"
      : winner.expiryBoost > loser.expiryBoost
        ? "winner"
        : "loser";
  const winUrgent = urgentForHit(winner, items)
    .map((i) => i.displayName)
    .slice(0, 2);
  const loseUrgent = urgentForHit(loser, items)
    .map((i) => i.displayName)
    .slice(0, 2);
  deltas.push({
    key: "expiry",
    label: "Expiry",
    winnerValue: winner.expiryBoost.toFixed(2) + (winUrgent.length ? ` · ${winUrgent.join(", ")}` : ""),
    loserValue: loser.expiryBoost.toFixed(2) + (loseUrgent.length ? ` · ${loseUrgent.join(", ")}` : ""),
    advantage: expAdv,
    detail:
      expAdv === "winner"
        ? "Uses more near-expiry inventory"
        : expAdv === "loser"
          ? "The lower card uses ingredients that are more urgent"
          : "Similar expiry signal",
  });

  // Flavor
  const flAdv =
    Math.abs(winner.flavorScore - loser.flavorScore) < 0.04
      ? "tie"
      : winner.flavorScore > loser.flavorScore
        ? "winner"
        : "loser";
  const winPair = topFlavorPair(winner.recipe, [
    ...winner.have,
    ...winner.substituted.map((s) => s.used),
  ]);
  const losePair = topFlavorPair(loser.recipe, [
    ...loser.have,
    ...loser.substituted.map((s) => s.used),
  ]);
  deltas.push({
    key: "flavor",
    label: "Flavor",
    winnerValue:
      winner.flavorScore.toFixed(2) +
      (winPair ? ` · ${winPair.a}+${winPair.b}` : ""),
    loserValue:
      loser.flavorScore.toFixed(2) +
      (losePair ? ` · ${losePair.a}+${losePair.b}` : ""),
    advantage: flAdv,
    detail:
      flAdv === "winner"
        ? "Stronger on-hand co-occurrence / molecular fit"
        : flAdv === "loser"
          ? "The lower card has a stronger flavor pair"
          : "Comparable flavor harmony",
  });

  // Hierarchy
  const wPen = hierarchyPenaltyOf(winner);
  const lPen = hierarchyPenaltyOf(loser);
  const hAdv =
    Math.abs(wPen - lPen) < 0.01 ? "tie" : wPen < lPen ? "winner" : "loser";
  deltas.push({
    key: "hierarchy",
    label: "Hierarchy",
    winnerValue:
      winner.substituted.length === 0
        ? "exact only"
        : `${winner.substituted.length} swap (−${(wPen * 100).toFixed(0)}%)`,
    loserValue:
      loser.substituted.length === 0
        ? "exact only"
        : `${loser.substituted.length} swap (−${(lPen * 100).toFixed(0)}%)`,
    advantage: hAdv,
    detail:
      hAdv === "winner"
        ? "Fewer hierarchy swaps — exact matches preferred"
        : hAdv === "loser"
          ? "The lower card needed fewer substitutions"
          : "Same hierarchy cost",
  });

  // Time
  const wTime = timeBiasOf(winner);
  const lTime = timeBiasOf(loser);
  const tAdv =
    Math.abs(wTime - lTime) < 0.005 ? "tie" : wTime > lTime ? "winner" : "loser";
  deltas.push({
    key: "time",
    label: "Time",
    winnerValue: `${winner.recipe.minutes} min`,
    loserValue: `${loser.recipe.minutes} min`,
    advantage: tAdv,
    detail:
      tAdv === "winner"
        ? "Faster option gets a small speed bias"
        : tAdv === "loser"
          ? "The lower card is quicker"
          : "Similar cook/pour time",
  });

  // Gap (almost only)
  if (winner.missing.length > 0 || loser.missing.length > 0) {
    const gAdv =
      winner.missing.length === loser.missing.length
        ? "tie"
        : winner.missing.length < loser.missing.length
          ? "winner"
          : "loser";
    deltas.push({
      key: "gap",
      label: "Gap",
      winnerValue: winner.missing.length ? winner.missing.join(" + ") : "none",
      loserValue: loser.missing.length ? loser.missing.join(" + ") : "none",
      advantage: gAdv,
      detail:
        gAdv === "winner"
          ? "Fewer missing ingredients"
          : gAdv === "loser"
            ? "The lower card is closer on missing count"
            : "Same gap size",
    });
  }

  const decisive = deltas.filter((d) => d.advantage === "winner");
  const summaryParts: string[] = [];
  if (winner.tier === "now" && loser.tier === "almost") {
    summaryParts.push("full coverage vs a gap");
  }
  for (const d of decisive.slice(0, 3)) {
    if (d.key === "tier") continue;
    if (d.key === "expiry") summaryParts.push("stronger expiry boost");
    else if (d.key === "flavor") summaryParts.push("better flavor fit");
    else if (d.key === "coverage") summaryParts.push("higher coverage");
    else if (d.key === "hierarchy") summaryParts.push("fewer hierarchy swaps");
    else if (d.key === "time") summaryParts.push("quicker");
    else if (d.key === "gap") summaryParts.push("smaller gap");
  }
  const summary =
    summaryParts.length > 0
      ? `${winner.recipe.name} ranks above ${loser.recipe.name} because of ${summaryParts.join(", ")}.`
      : `${winner.recipe.name} edges ${loser.recipe.name} on composite (${winner.composite} vs ${loser.composite}).`;

  return {
    winnerId: winner.recipe.id,
    loserId: loser.recipe.id,
    winnerName: winner.recipe.name,
    loserName: loser.recipe.name,
    compositeDelta: Number((winner.composite - loser.composite).toFixed(3)),
    summary,
    deltas,
  };
}

/**
 * Counterfactual preview: re-rank as if `ingredient` were already in inventory.
 * Shows how many recipes would move into Now and which names flip.
 */
export function previewAddIngredient(
  items: InventoryItem[],
  ingredient: string,
  opts?: {
    kind?: "food" | "cocktail" | "all";
    maxMissing?: number;
  },
): CounterfactualPreview {
  const kind = opts?.kind ?? "all";
  const maxMissing = opts?.maxMissing ?? 2;
  const normalized = ingredient.trim().toLowerCase();

  const currentHits = rankRecipes(items, { kind, maxMissing });
  const currentNowIds = new Set(
    currentHits.filter((h) => h.tier === "now").map((h) => h.recipe.id),
  );
  const currentAlmost = currentHits.filter((h) => h.tier === "almost").length;
  const currentNow = currentNowIds.size;

  // Skip if already on hand
  if (haveSet(items).has(normalized)) {
    return {
      ingredient: normalized,
      currentNow,
      projectedNow: currentNow,
      deltaNow: 0,
      currentAlmost,
      projectedAlmost: currentAlmost,
      newlyNow: [],
      stillAlmost: [],
      summary: `${normalized} is already in inventory — no ranking change.`,
    };
  }

  const projectedItems = [...items, virtualItem(normalized)];
  const projectedHits = rankRecipes(projectedItems, { kind, maxMissing });
  const projectedNowHits = projectedHits.filter((h) => h.tier === "now");
  const projectedAlmostHits = projectedHits.filter((h) => h.tier === "almost");
  const projectedNow = projectedNowHits.length;

  const newlyNow = projectedNowHits
    .filter((h) => !currentNowIds.has(h.recipe.id))
    .map((h) => h.recipe.name)
    .sort((a, b) => a.localeCompare(b));

  const stillAlmost = projectedAlmostHits
    .filter((h) => h.missing.includes(normalized) === false)
    .map((h) => h.recipe.name)
    .slice(0, 8);

  const deltaNow = projectedNow - currentNow;
  const summary =
    deltaNow > 0
      ? `Add ${normalized} → +${deltaNow} Now (${newlyNow.slice(0, 3).join(", ")}${newlyNow.length > 3 ? ` +${newlyNow.length - 3} more` : ""}).`
      : deltaNow === 0
        ? `Add ${normalized} → no new Now recipes under current filters (may still shrink Almost gaps).`
        : `Add ${normalized} → ranking shifts, but Now count does not rise under current filters.`;

  return {
    ingredient: normalized,
    currentNow,
    projectedNow,
    deltaNow,
    currentAlmost,
    projectedAlmost: projectedAlmostHits.length,
    newlyNow,
    stillAlmost,
    summary,
  };
}
