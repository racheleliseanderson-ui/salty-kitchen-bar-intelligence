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

export function rankRecipes(
  items: InventoryItem[],
  opts?: { kind?: "food" | "cocktail" | "all"; maxMissing?: number },
): MatchHit[] {
  const maxMissing = opts?.maxMissing ?? 2;
  const kind = opts?.kind ?? "all";
  return RECIPES.filter((r) => kind === "all" || r.kind === kind)
    .map((r) => scoreRecipe(r, items))
    .filter((h) => h.missing.length <= maxMissing)
    .sort((a, b) => {
      if (a.tier !== b.tier) return a.tier === "now" ? -1 : 1;
      return b.composite - a.composite;
    });
}

export function smartBuys(items: InventoryItem[], limit = 4): SmartBuy[] {
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
