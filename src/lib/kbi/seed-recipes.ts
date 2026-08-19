import type { Recipe } from "./types";
import { FOOD_RECIPES } from "./seed-recipes-food";
import { COCKTAIL_RECIPES } from "./seed-recipes-cocktail";

/**
 * Curated recipe corpus for hierarchical match + Smart Buy.
 * Educational stand-in only — not generated menus and not allergen-safe claims.
 * SEED_VERSION 6 — denser food + cocktail set so Now / Almost / Smart Buy actually work.
 */
export const RECIPES: Recipe[] = [...FOOD_RECIPES, ...COCKTAIL_RECIPES];

export const RECIPE_COUNT = RECIPES.length;
export const FOOD_COUNT = FOOD_RECIPES.length;
export const COCKTAIL_COUNT = COCKTAIL_RECIPES.length;
