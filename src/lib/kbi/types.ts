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

export interface SmartBuy {
  ingredient: string;
  unlocks: string[];
}

export interface AvailabilityItem {
  normalizedName: string;
  displayName: string;
  category: Category;
  quantity?: Quantity;
  expiry?: string | null;
  location?: Location;
  confidence?: number;
  userIntent?: UserIntent;
}

export interface AvailabilityPacket {
  version: typeof PACKET_VERSION;
  appId: typeof APP_ID;
  generatedAt: string;
  items: AvailabilityItem[];
  notes?: string;
}
