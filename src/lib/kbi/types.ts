export const APP_ID = "SC-KBI-001";
export const APP_NAME = "Kitchen & Bar · Salty & Clever";
export const PACKET_VERSION = "1.0";
export const SEED_VERSION = 6;
export const OCCASIONS_URL = "https://occasion.saltnotes.blog";
export const OCCASIONS_ARCHITECTURE_URL = "https://occasion.saltnotes.blog/architecture";
export const SALT_NOTES_URL = "https://saltnotes.blog";

export type Category =
  | "spirit"
  | "produce"
  | "dairy"
  | "pantry"
  | "mixer"
  | "protein"
  | "garnish"
  | "herb"
  | "condiment";

export type Location = "bar_shelf" | "fridge" | "pantry" | "freezer";
export type Source = "vision" | "barcode" | "manual" | "demo";
export type Unit = "bottle" | "g" | "count" | "ml" | "oz" | "bunch";
export type ExpiryUrgency = "high" | "medium" | "low" | "none";
export type UserIntent = "daily_inventory" | "explore" | "candidate_for_occasion";
export type RecipeKind = "food" | "cocktail";
export type Skill = "easy" | "medium" | "involved";

/** How dense the curated volatile list is for this ingredient. */
export type ProfileCoverage = "rich" | "moderate" | "sparse";

export interface Quantity {
  value: number;
  unit: Unit;
}

export interface InventoryItem {
  id: string;
  normalizedName: string;
  displayName: string;
  category: Category;
  quantity: Quantity;
  expiry: string | null;
  location: Location;
  source: Source;
  confidence: number;
  lastUpdated: string;
  tags: string[];
  userNotes: string;
}

export interface Detection {
  id: string;
  label: string;
  normalizedName: string;
  category: Category;
  location: Location;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
  accepted: boolean;
  /** User-owned on Confirm — vision does not infer these. */
  quantity?: Quantity;
  expiry?: string | null;
}

export interface FlavorProfile {
  name: string;
  displayName: string;
  compounds: string[];
  category: string;
  notes: string;
  /** Density of the curated volatile list. Sparse profiles lean harder on co-occurrence. */
  coverage?: ProfileCoverage;
  /** Short provenance note for the profile vectors. */
  sourceNote?: string;
}

export interface Recipe {
  id: string;
  name: string;
  kind: RecipeKind;
  required: string[];
  optional: string[];
  minutes: number;
  skill: Skill;
  notes: string;
}

export interface MatchHit {
  recipe: Recipe;
  have: string[];
  missing: string[];
  substituted: { needed: string; used: string }[];
  matchPct: number;
  expiryBoost: number;
  flavorScore: number;
  composite: number;
  tier: "now" | "almost";
}

/** One scored factor in the ranking explanation. */
export type RankFactorKey =
  | "coverage"
  | "expiry"
  | "flavor"
  | "hierarchy"
  | "time"
  | "gap";

export interface RankFactor {
  key: RankFactorKey;
  label: string;
  detail: string;
  /** Visual strength 0–1 for bar width. */
  strength: number;
  /** Direction of influence on the composite. */
  impact: "up" | "down" | "neutral";
}

/** Structured breakdown so the UI can show why a hit ranked where it did. */
export interface RankBreakdown {
  summary: string;
  /** Short readable formula of the composite. */
  formula: string;
  factors: RankFactor[];
  coverage: {
    have: number;
    required: number;
    pct: number;
    label: string;
  };
  expiry: {
    boost: number;
    items: { displayName: string; normalizedName: string; days: number | null }[];
    label: string;
  };
  flavor: {
    score: number;
    label: string;
    /** Strongest on-hand pair contributing to harmony, if any. */
    topPair: {
      a: string;
      b: string;
      score: number;
      cooccurrence: number;
      molecular: number;
    } | null;
  };
  hierarchy: {
    swaps: { needed: string; used: string }[];
    penalty: number;
    label: string;
  };
  time: {
    minutes: number;
    bias: number;
    label: string;
  };
}

export interface SmartBuy {
  ingredient: string;
  unlocks: string[];
}

/** One factor-level difference when comparing two ranked hits. */
export interface ContrastDelta {
  key: RankFactorKey | "composite" | "tier";
  label: string;
  /** Value on the higher-ranked (winner) side, human-readable. */
  winnerValue: string;
  /** Value on the lower-ranked side. */
  loserValue: string;
  /** Who this factor favors. */
  advantage: "winner" | "loser" | "tie";
  detail: string;
}

/** Contrastive explanation: why recipe A ranks above recipe B. */
export interface ContrastExplanation {
  winnerId: string;
  loserId: string;
  winnerName: string;
  loserName: string;
  compositeDelta: number;
  summary: string;
  deltas: ContrastDelta[];
}

/** Counterfactual: what happens to ranking if one missing ingredient is added. */
export interface CounterfactualPreview {
  ingredient: string;
  currentNow: number;
  projectedNow: number;
  deltaNow: number;
  currentAlmost: number;
  projectedAlmost: number;
  /** Recipe names that flip from Almost → Now after the add. */
  newlyNow: string[];
  /** Recipes that still need something else after the add. */
  stillAlmost: string[];
  summary: string;
}

export interface PacketIngredient {
  normalized_name: string;
  quantity_hint: string;
  expiry_urgency: ExpiryUrgency;
}

export interface AvailabilityPacket {
  contract_version: typeof PACKET_VERSION;
  timestamp: string;
  source: "KitchenBarLayer";
  application_id: typeof APP_ID;
  user_intent: UserIntent;
  available_ingredients: PacketIngredient[];
  hard_user_constraints: string[];
  optional_notes: string[];
  handoff_id: string;
}

export interface Competitor {
  id: string;
  name: string;
  role: string;
  food: boolean;
  bar: boolean;
  vision: boolean;
  chemistry: boolean;
  url: string;
  sourceNote?: string;
  strengths: string[];
  limits: string[];
}
