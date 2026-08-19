import { daysUntil } from "@/lib/utils";
import { RECIPES } from "./catalog";
import { inventoryHarmony, pairScore } from "./flavors";
import { covers } from "./hierarchy";
import type { InventoryItem, MatchHit, Recipe, SmartBuy } from "./types";

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

/** Human-readable reason this hit ranked where it did. */
export function explainRank(hit: MatchHit): string {
  const parts: string[] = [];
  if (hit.expiryBoost >= 0.8) parts.push("Uses something near expiry");
  else if (hit.expiryBoost >= 0.4) parts.push("Uses something due this week");
  if (hit.substituted.length) {
    parts.push(
      `Hierarchy: ${hit.substituted.map((s) => `${s.used} covers ${s.needed}`).join(", ")}`,
    );
  }
  if (hit.flavorScore >= 0.7) parts.push("Strong flavor harmony");
  else if (hit.flavorScore >= 0.55) parts.push("Solid flavor fit");
  if (hit.recipe.minutes <= 15) parts.push("Quick");
  if (hit.missing.length === 1) parts.push(`Only needs ${hit.missing[0]}`);
  else if (hit.missing.length === 2) parts.push(`Needs ${hit.missing.join(" + ")}`);
  if (!parts.length) {
    return hit.tier === "now" ? "Everything required is on hand" : "Close — one or two ingredients away";
  }
  return parts.join(" · ");
}

/** Inventory items that are powering the expiry boost on this hit. */
export function urgentForHit(hit: MatchHit, items: InventoryItem[]): InventoryItem[] {
  const names = new Set([
    ...hit.have,
    ...hit.substituted.map((s) => s.used),
  ]);
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
