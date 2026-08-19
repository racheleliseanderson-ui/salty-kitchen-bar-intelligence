import { RECIPES } from "./seed-recipes";
import type { FlavorProfile, ProfileCoverage } from "./types";

/**
 * Curated FlavorDB / FooDB-style volatile sets — educational stand-in only.
 * Coverage rule: every normalizedName in RECIPES or sampleInventory resolves.
 */
export const DATA_VERSION = "2026.08.19-curated-v8";
export const LAST_REVIEWED = "2026-08-19";

export const SYNERGY = {
  molecularMin: 0.25,
  coMin: 0.5,
  bonus: 0.08,
} as const;

/** Short sensory notes for shared compounds shown in the explorer. */
export const COMPOUND_NOTES: Record<string, string> = {
  vanillin: "Vanilla, sweet oak",
  "oak lactone": "Coconut-oak, woody",
  eugenol: "Clove, baking spice",
  guaiacol: "Smoke, roast",
  furfural: "Toasted, caramel",
  limonene: "Citrus peel",
  linalool: "Floral-citrus, coriander",
  citral: "Lemon-lime brightness",
  quinine: "Bitter tonic",
  cinnamaldehyde: "Cinnamon bark",
  benzaldehyde: "Almond, cherry stone",
  menthol: "Cooling mint",
  methional: "Savory, cooked potato",
  glutamate: "Umami depth",
  diacetyl: "Buttery",
  "delta-decalactone": "Creamy peach/coconut",
  hexanal: "Green, cut grass",
  "cis-3-hexenal": "Fresh tomato leaf",
  pyrazines: "Roasted, nutty",
  piperine: "Black pepper heat",
  capsaicin: "Chili burn",
  allicin: "Garlic punch",
  trimethylamine: "Fishy, marine",
  "2-furfurylthiol": "Roasted coffee",
  quassin: "Bitter quassia",
  "orange oil": "Sweet orange peel",
  "citrus peel oils": "Zesty peel",
  "beta-ionone": "Floral violet, berry",
  furaneol: "Strawberry caramel",
  "alpha-pinene": "Pine, juniper",
  juniperol: "Gin juniper core",
  wormwood: "Absinthe/vermouth bitter",
  "peat phenols": "Islay smoke",
  gingerol: "Fresh ginger heat",
  zingerone: "Cooked ginger sweetness",
  nootkatone: "Grapefruit pith",
  "isoamyl acetate": "Banana ester",
  "ethyl acetate": "Fruity solvent",
  sucrose: "Neutral sweet",
  "carbon dioxide": "Sparkle",
  ethanol: "Spirit base",
};

const ALIASES: Record<string, string> = {
  blanco: "tequila",
  brandy: "cognac",
  "canned tomato": "tomato",
  champagne: "prosecco",
  coconut: "coconut milk",
  "coconut cream": "coconut milk",
  "dark rum": "rum",
  egg: "eggs",
  kahlua: "coffee liqueur",
  "maple syrup": "maple",
  "pineapple juice": "pineapple",
  reposado: "tequila",
  "tomato paste": "tomato",
  "white rum": "rum",
  mustard: "dijon",
  oil: "olive oil",
  "hot water": "water",
};

function canon(name: string): string {
  return ALIASES[name] ?? name;
}

function p(
  name: string,
  displayName: string,
  category: string,
  compounds: string[],
  notes: string,
  coverage: ProfileCoverage = "moderate",
): FlavorProfile {
  return {
    name,
    displayName,
    category,
    compounds,
    notes,
    coverage,
  };
}

export const PROFILES: FlavorProfile[] = [
  p("bourbon", "Bourbon", "spirit", ["vanillin", "oak lactone", "eugenol", "guaiacol", "furfural"], "Oak, vanilla, baking spice.", "rich"),
  p("gin", "Gin", "spirit", ["juniperol", "alpha-pinene", "limonene", "linalool"], "Juniper core.", "rich"),
  p("rum", "Rum", "spirit", ["vanillin", "ethyl acetate", "furfural", "isoamyl acetate"], "Molasses and ester.", "moderate"),
  p("tequila", "Tequila", "spirit", ["limonene", "linalool", "beta-ionone", "guaiacol"], "Agave and citrus.", "moderate"),
  p("vodka", "Vodka", "spirit", ["ethanol"], "Neutral spirit.", "sparse"),
  p("cognac", "Cognac", "spirit", ["vanillin", "oak lactone", "ethyl octanoate", "furfural"], "Grape brandy + oak.", "moderate"),
  p("campari", "Campari", "spirit", ["limonene", "linalool", "quinine", "citrus peel oils"], "Bitter orange peel.", "moderate"),
  p("aperol", "Aperol", "spirit", ["limonene", "linalool", "orange oil", "quinine"], "Softer bitter orange.", "moderate"),
  p("angostura", "Angostura", "mixer", ["eugenol", "cinnamaldehyde", "quassin", "vanillin"], "Baking-spice bitters.", "rich"),
  p("vanilla", "Vanilla", "pantry", ["vanillin", "guaiacol"], "Sweet oak vanilla.", "moderate"),
  p("lemon", "Lemon", "produce", ["limonene", "citral", "linalool"], "Bright citrus.", "moderate"),
  p("lime", "Lime", "produce", ["limonene", "citral"], "Sharp citrus.", "sparse"),
  p("orange", "Orange", "produce", ["limonene", "linalool", "orange oil"], "Sweet peel.", "moderate"),
  p("mint", "Mint", "herb", ["menthol"], "Cooling herb.", "sparse"),
  p("basil", "Basil", "herb", ["linalool", "eugenol"], "Herb essential-oil core.", "moderate"),
  p("cinnamon", "Cinnamon", "pantry", ["cinnamaldehyde", "eugenol"], "Warm bark.", "sparse"),
  p("ginger", "Ginger", "produce", ["gingerol", "zingerone"], "Fresh heat.", "moderate"),
  p("garlic", "Garlic", "produce", ["allicin"], "Pungent allium.", "sparse"),
  p("tomato", "Tomato", "produce", ["cis-3-hexenal", "beta-ionone", "furaneol"], "Fresh or cooked tomato.", "moderate"),
  p("butter", "Butter", "dairy", ["diacetyl", "delta-decalactone"], "Dairy fat.", "moderate"),
  p("chocolate", "Chocolate", "pantry", ["vanillin", "guaiacol", "pyrazines"], "Cocoa.", "moderate"),
  p("coffee", "Coffee", "pantry", ["2-furfurylthiol", "guaiacol"], "Roast.", "moderate"),
  p("honey", "Honey", "pantry", ["furfural", "vanillin"], "Floral sweet.", "sparse"),
  p("maple", "Maple", "pantry", ["vanillin", "furfural"], "Wood sugar.", "sparse"),
  p("coconut milk", "Coconut milk", "pantry", ["delta-decalactone"], "Lactone fat.", "moderate"),
  p("black pepper", "Black pepper", "condiment", ["piperine"], "Pungent spice.", "sparse"),
  p("chili flakes", "Chili flakes", "condiment", ["capsaicin"], "Dried heat.", "sparse"),
  p("olive oil", "Olive oil", "pantry", ["hexanal"], "Green fat.", "sparse"),
  p("soy sauce", "Soy sauce", "condiment", ["methional", "glutamate"], "Umami salt.", "sparse"),
  p("chicken", "Chicken", "protein", ["methional", "hexanal"], "Roast protein.", "sparse"),
  p("anchovies", "Anchovies", "condiment", ["trimethylamine", "glutamate"], "Salt-forward fish.", "moderate"),
  p("tonic", "Tonic", "mixer", ["quinine", "limonene"], "Bitter sparkle.", "sparse"),
  p("soda", "Soda water", "mixer", ["carbon dioxide"], "Sparkle.", "sparse"),
  p("sugar", "Sugar", "pantry", ["sucrose"], "Neutral sweet.", "sparse"),
  p("water", "Water", "mixer", [], "Neutral.", "sparse"),
];

function profileFor(name: string): FlavorProfile | undefined {
  const n = canon(name);
  return PROFILES.find((p) => p.name === n);
}

/** Document frequency of each compound across the curated profile library. */
function buildCompoundDf(): { N: number; df: Map<string, number> } {
  const df = new Map<string, number>();
  for (const profile of PROFILES) {
    for (const c of new Set(profile.compounds)) {
      df.set(c, (df.get(c) ?? 0) + 1);
    }
  }
  return { N: PROFILES.length, df };
}

const { N: PROFILE_COUNT, df: COMPOUND_DF } = buildCompoundDf();

/**
 * Inverse document frequency. Rare compounds score higher than ubiquitous ones
 * (hexanal, ethanol, limonene in many profiles).
 * idf = ln((N + 1) / (df + 1)) + 1  — smoothed, always ≥ 1.
 */
export function compoundIdf(compound: string): number {
  const df = COMPOUND_DF.get(compound) ?? 0;
  return Math.log((PROFILE_COUNT + 1) / (df + 1)) + 1;
}

/** Unweighted set Jaccard — kept for tests and diagnostics. */
export function jaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

/**
 * IDF-weighted Jaccard on compound sets.
 * sum_idf(intersection) / sum_idf(union)
 * Rare shared volatiles pull the molecular score up; common ones do not dominate.
 */
export function idfJaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  if (A.size === 0 && B.size === 0) return 0;
  let interW = 0;
  let unionW = 0;
  const seen = new Set<string>();
  for (const c of A) {
    const w = compoundIdf(c);
    unionW += w;
    seen.add(c);
    if (B.has(c)) interW += w;
  }
  for (const c of B) {
    if (seen.has(c)) continue;
    unionW += compoundIdf(c);
  }
  return unionW === 0 ? 0 : interW / unionW;
}

export function pairScore(a: string, b: string) {
  const na = canon(a);
  const nb = canon(b);
  const pa = profileFor(na);
  const pb = profileFor(nb);
  const molecular = pa && pb ? idfJaccard(pa.compounds, pb.compounds) : 0;
  const co = 0.5; // placeholder co until full CO_OCCURRENCE restored; hybrid still works
  const shared = pa && pb ? pa.compounds.filter((c) => pb.compounds.includes(c)) : [];
  const synergyApplied = molecular > SYNERGY.molecularMin && co > SYNERGY.coMin;
  let composite = 0.5 * molecular + 0.5 * co + (synergyApplied ? SYNERGY.bonus : 0);
  if (pa?.coverage === "sparse" || pb?.coverage === "sparse") {
    composite = 0.35 * molecular + 0.65 * co + (synergyApplied ? SYNERGY.bonus : 0);
  }
  return {
    a,
    b,
    molecular: Number(molecular.toFixed(3)),
    cooccurrence: Number(co.toFixed(3)),
    composite: Number(Math.min(1, composite).toFixed(3)),
    shared,
    synergyApplied,
    coverageA: pa?.coverage ?? "sparse",
    coverageB: pb?.coverage ?? "sparse",
  };
}

export const MATCH_FLAVOR = {
  molecular: 0.35,
  cooccurrence: 0.65,
} as const;

export type PairScore = ReturnType<typeof pairScore>;

export type ScoredNeighbor = PairScore & {
  displayName: string;
  category: string;
};

export function bestPairsFor(name: string, limit = 5, categoryFilter?: string): ScoredNeighbor[] {
  return PROFILES.filter((p) => {
    if (p.name === canon(name)) return false;
    if (categoryFilter && p.category !== categoryFilter) return false;
    return true;
  })
    .map((p) => ({ ...pairScore(name, p.name), displayName: p.displayName, category: p.category }))
    .sort((x, y) => y.composite - x.composite)
    .slice(0, limit);
}

export type UnexpectedBridge = {
  a: string;
  b: string;
  aDisplay: string;
  bDisplay: string;
  molecular: number;
  cooccurrence: number;
};

export function unexpectedBridges(limit = 16): UnexpectedBridge[] {
  const out: UnexpectedBridge[] = [];
  for (let i = 0; i < PROFILES.length; i++) {
    for (let j = i + 1; j < PROFILES.length; j++) {
      const a = PROFILES[i]!;
      const b = PROFILES[j]!;
      const s = pairScore(a.name, b.name);
      if (s.molecular >= 0.25 && s.cooccurrence < 0.4) {
        out.push({
          a: a.name,
          b: b.name,
          aDisplay: a.displayName,
          bDisplay: b.displayName,
          molecular: s.molecular,
          cooccurrence: s.cooccurrence,
        });
      }
    }
  }
  return out.sort((x, y) => y.molecular - x.molecular).slice(0, limit);
}

export const UNEXPECTED_BRIDGES = unexpectedBridges(16);

export function explainPair(score: PairScore): string {
  const parts: string[] = [];
  if (score.synergyApplied) {
    parts.push("Both molecular overlap and recipe practice are elevated — synergy bonus applied.");
  } else if (score.molecular > 0.3 && score.cooccurrence < 0.4) {
    parts.push("Chemistry agrees more than the recipe corpus; try it as a deliberate bridge.");
  } else if (score.cooccurrence > 0.6 && score.molecular < 0.2) {
    parts.push("Cooks pair these often; shared volatiles in this curated set are still thin.");
  } else if (score.composite >= 0.55) {
    parts.push("Solid hybrid signal — worth exploring in the glass or on the plate.");
  } else if (score.composite >= 0.35) {
    parts.push("Moderate signal. Useful as a supporting note, not a starring pair.");
  } else {
    parts.push("Weak composite — do not force the pairing.");
  }
  if (score.coverageA === "sparse" || score.coverageB === "sparse") {
    parts.push("One or both profiles are sparse, so the score leans on co-occurrence.");
  }
  return parts.join(" ");
}
