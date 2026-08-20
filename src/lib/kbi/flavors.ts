import { RECIPES } from "./seed-recipes";
import type { FlavorProfile, ProfileCoverage } from "./types";

export const DATA_VERSION = "2026.08.19-curated-v10-npmi";
export const LAST_REVIEWED = "2026-08-19";

export const SYNERGY = { molecularMin: 0.25, coMin: 0.5, bonus: 0.08 } as const;

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
  caryophyllene: "Woody pepper",
  "ethyl butyrate": "Pineapple-strawberry ester",
  "tetramethylpyrazine": "Cocoa roast",
  "butyric acid": "Sharp dairy / cheese",
  "acetic acid": "Bright vinegar",
  "2-heptanone": "Blue-cheese / dairy ketone",
  "methyl ketone": "Aged cheese pungency",
  "5-acetoxymethylfurfural": "Balsamic caramel",
  phenol: "Smoky phenolic",
  syringol: "Sweet smoke",
};

const ALIASES: Record<string, string> = {
  blanco: "tequila", brandy: "cognac", "canned tomato": "tomato", champagne: "prosecco",
  coconut: "coconut milk", "coconut cream": "coconut milk", "dark rum": "rum", egg: "eggs",
  kahlua: "coffee liqueur", "maple syrup": "maple", "pineapple juice": "pineapple",
  reposado: "tequila", "tomato paste": "tomato", "white rum": "rum", mustard: "dijon",
  oil: "olive oil", "hot water": "water",
  "balsamic vinegar": "balsamic",
  "smoked sea salt": "smoked salt",
  gorgonzola: "blue cheese",
  roquefort: "blue cheese",
  stilton: "blue cheese",
};

function canon(name: string): string { return ALIASES[name] ?? name; }

function p(name: string, displayName: string, category: string, compounds: string[], notes: string, coverage: ProfileCoverage = "moderate"): FlavorProfile {
  return { name, displayName, category, compounds, notes, coverage };
}

export const PROFILES: FlavorProfile[] = [
  p("amaro", "Amaro", "spirit", ["quinine", "eugenol", "citrus peel oils", "vanillin"], "Bitter-herbal.", "moderate"),
  p("angostura", "Angostura", "mixer", ["eugenol", "cinnamaldehyde", "quassin", "vanillin"], "Baking-spice bitters.", "rich"),
  p("aperol", "Aperol", "spirit", ["limonene", "linalool", "orange oil", "quinine"], "Softer bitter orange.", "moderate"),
  p("apple", "Apple", "produce", ["hexanal", "linalool"], "Fresh fruit.", "moderate"),
  p("bacon", "Bacon", "protein", ["guaiacol", "pyrazines", "furfural"], "Smoke and fat.", "moderate"),
  p("basil", "Basil", "herb", ["linalool", "eugenol"], "Herb essential-oil core.", "moderate"),
  p("berries", "Berries", "produce", ["furaneol", "linalool", "ethyl butyrate"], "Frozen summer.", "moderate"),
  p("black pepper", "Black pepper", "condiment", ["piperine", "caryophyllene"], "Pungent spice.", "sparse"),
  p("bourbon", "Bourbon", "spirit", ["vanillin", "oak lactone", "eugenol", "guaiacol", "furfural"], "Oak, vanilla, baking spice.", "rich"),
  p("butter", "Butter", "dairy", ["diacetyl", "delta-decalactone", "butyric acid"], "Dairy fat.", "moderate"),
  p("campari", "Campari", "spirit", ["limonene", "linalool", "quinine", "citrus peel oils"], "Bitter orange peel.", "moderate"),
  p("chartreuse", "Chartreuse", "spirit", ["linalool", "eugenol", "limonene"], "Herbal liqueur.", "moderate"),
  p("cheddar", "Cheddar", "dairy", ["butyric acid", "methional"], "Aged cheese.", "moderate"),
  p("cherry", "Cherry", "produce", ["benzaldehyde", "ethyl acetate"], "Stone fruit.", "sparse"),
  p("chili flakes", "Chili flakes", "condiment", ["capsaicin", "hexanal"], "Dried heat.", "sparse"),
  p("chocolate", "Chocolate", "pantry", ["vanillin", "guaiacol", "pyrazines", "tetramethylpyrazine"], "Cocoa.", "moderate"),
  p("cilantro", "Cilantro", "herb", ["linalool"], "Citrus leaf.", "moderate"),
  p("cinnamon", "Cinnamon", "pantry", ["cinnamaldehyde", "eugenol"], "Warm bark.", "sparse"),
  p("coconut milk", "Coconut milk", "pantry", ["delta-decalactone"], "Lactone fat.", "moderate"),
  p("coffee", "Coffee", "pantry", ["2-furfurylthiol", "guaiacol", "pyrazines"], "Roast.", "moderate"),
  p("coffee liqueur", "Coffee liqueur", "spirit", ["2-furfurylthiol", "vanillin", "ethanol"], "Sweet coffee spirit.", "sparse"),
  p("cognac", "Cognac", "spirit", ["vanillin", "oak lactone", "furfural"], "Grape brandy + oak.", "moderate"),
  p("cointreau", "Cointreau", "spirit", ["limonene", "linalool", "citral"], "Orange liqueur.", "moderate"),
  p("cucumber", "Cucumber", "produce", ["cis-3-hexenal", "hexanal"], "Green water.", "sparse"),
  p("gin", "Gin", "spirit", ["juniperol", "alpha-pinene", "limonene", "linalool"], "Juniper core.", "rich"),
  p("ginger", "Ginger", "produce", ["gingerol", "zingerone"], "Fresh heat.", "moderate"),
  p("grapefruit", "Grapefruit", "produce", ["nootkatone", "limonene", "citral"], "Bitter citrus pith.", "moderate"),
  p("honey", "Honey", "pantry", ["furfural", "vanillin"], "Floral sweet.", "sparse"),
  p("jalapeno", "Jalapeño", "produce", ["capsaicin", "hexanal"], "Fresh heat.", "sparse"),
  p("lemon", "Lemon", "produce", ["limonene", "citral", "linalool"], "Bright citrus.", "moderate"),
  p("lime", "Lime", "produce", ["limonene", "citral"], "Sharp citrus.", "sparse"),
  p("maple", "Maple", "pantry", ["vanillin", "furfural"], "Wood sugar.", "sparse"),
  p("mezcal", "Mezcal", "spirit", ["guaiacol", "furfural", "vanillin"], "Agave smoke.", "moderate"),
  p("mint", "Mint", "herb", ["menthol"], "Cooling herb.", "sparse"),
  p("miso", "Miso", "condiment", ["methional", "glutamate"], "Fermented umami.", "sparse"),
  p("orange", "Orange", "produce", ["limonene", "linalool", "orange oil"], "Sweet peel.", "moderate"),
  p("pineapple", "Pineapple", "produce", ["ethyl butyrate", "isoamyl acetate", "furaneol"], "Tropical ester.", "moderate"),
  p("rum", "Rum", "spirit", ["vanillin", "ethyl acetate", "furfural", "isoamyl acetate"], "Molasses and ester.", "moderate"),
  p("scotch", "Scotch", "spirit", ["peat phenols", "vanillin", "guaiacol", "oak lactone"], "Malt and smoke.", "rich"),
  p("soy sauce", "Soy sauce", "condiment", ["methional", "glutamate"], "Umami salt.", "sparse"),
  p("tequila", "Tequila", "spirit", ["limonene", "linalool", "beta-ionone", "guaiacol"], "Agave and citrus.", "moderate"),
  p("tomato", "Tomato", "produce", ["cis-3-hexenal", "beta-ionone", "furaneol", "furfural"], "Fresh or cooked tomato.", "moderate"),
  p("tonic", "Tonic", "mixer", ["quinine", "limonene"], "Bitter sparkle.", "sparse"),
  p("vanilla", "Vanilla", "pantry", ["vanillin", "guaiacol"], "Sweet oak vanilla.", "moderate"),
  p("vodka", "Vodka", "spirit", ["ethanol"], "Neutral spirit.", "sparse"),
  p("yogurt", "Yogurt", "dairy", ["diacetyl", "acetic acid"], "Tangy dairy.", "moderate"),
  p("anchovies", "Anchovies", "condiment", ["trimethylamine", "glutamate", "methional"], "Salt-forward fish.", "moderate"),
  p("prosecco", "Prosecco", "mixer", ["ethyl acetate", "isoamyl acetate"], "Sparkling wine.", "sparse"),
  p("sweet vermouth", "Sweet vermouth", "mixer", ["vanillin", "cinnamaldehyde", "quinine"], "Sweet fortified wine.", "moderate"),
  p("dry vermouth", "Dry vermouth", "mixer", ["linalool", "wormwood"], "Dry fortified wine.", "sparse"),
  p("smoked salt", "Smoked salt", "condiment", ["guaiacol", "phenol", "syringol"], "Salt with phenolic smoke.", "moderate"),
  p("balsamic", "Balsamic vinegar", "condiment", ["acetic acid", "furfural", "5-acetoxymethylfurfural"], "Aged sweet-sour vinegar.", "moderate"),
  p("blue cheese", "Blue cheese", "dairy", ["butyric acid", "2-heptanone", "methyl ketone"], "Pungent aged blue.", "moderate"),
  p("smoked paprika", "Smoked paprika", "condiment", ["guaiacol", "pyrazines", "phenol"], "Sweet smoke chile.", "sparse"),
].sort((a, b) => a.displayName.localeCompare(b.displayName));

export function profileFor(name: string): FlavorProfile | undefined {
  return PROFILES.find((p) => p.name === canon(name));
}

const CURATED: Record<string, Record<string, number>> = {};
(() => {
  const pairs: [string, string, number][] = [
    ["bourbon", "angostura", 0.94], ["bourbon", "sweet vermouth", 0.9], ["bourbon", "maple", 0.78],
    ["bourbon", "honey", 0.76], ["bourbon", "mint", 0.74], ["bourbon", "orange", 0.72],
    ["bourbon", "lemon", 0.7], ["bourbon", "chocolate", 0.68], ["bourbon", "coffee", 0.65],
    ["gin", "tonic", 0.93], ["gin", "dry vermouth", 0.9], ["gin", "lemon", 0.8],
    ["gin", "lime", 0.78], ["gin", "cucumber", 0.72], ["gin", "chartreuse", 0.74],
    ["campari", "sweet vermouth", 0.9], ["campari", "orange", 0.82], ["aperol", "prosecco", 0.92],
    ["tequila", "lime", 0.94], ["tequila", "cointreau", 0.88], ["tequila", "grapefruit", 0.8],
    ["rum", "lime", 0.94], ["rum", "mint", 0.86], ["rum", "pineapple", 0.88],
    ["mezcal", "lime", 0.78], ["mezcal", "honey", 0.72], ["scotch", "honey", 0.7],
    ["coffee", "chocolate", 0.8], ["chocolate", "orange", 0.72], ["tomato", "basil", 0.82],
    ["lime", "cilantro", 0.94], ["coconut milk", "lime", 0.8], ["coconut milk", "ginger", 0.78],
    ["anchovies", "lemon", 0.72], ["miso", "ginger", 0.7],
    ["coffee", "black pepper", 0.32], ["chocolate", "chili flakes", 0.34], ["chocolate", "black pepper", 0.3],
    ["bourbon", "tomato", 0.28], ["coffee", "orange", 0.36], ["coffee", "grapefruit", 0.3],
    ["vanilla", "black pepper", 0.28], ["mezcal", "pineapple", 0.36], ["mezcal", "coconut milk", 0.34],
    ["mezcal", "chocolate", 0.32], ["gin", "grapefruit", 0.38], ["scotch", "chocolate", 0.3],
    ["bacon", "maple", 0.38], ["bacon", "coffee", 0.28], ["berries", "black pepper", 0.3],
    ["berries", "basil", 0.32], ["bourbon", "ginger", 0.34], ["rum", "coffee", 0.36],
    ["miso", "butter", 0.34], ["miso", "bourbon", 0.26], ["cucumber", "mint", 0.36],
    ["pineapple", "jalapeno", 0.34], ["apple", "cheddar", 0.36], ["coconut milk", "chili flakes", 0.3],
    ["ginger", "chocolate", 0.28], ["lime", "ginger", 0.38], ["orange", "vanilla", 0.36],
    ["gin", "basil", 0.34], ["bourbon", "chili flakes", 0.26], ["tomato", "coffee", 0.24],
    ["smoked salt", "chocolate", 0.28],
    ["smoked salt", "bourbon", 0.30],
    ["smoked salt", "maple", 0.34],
    ["smoked salt", "scotch", 0.36],
    ["smoked salt", "bacon", 0.38],
    ["balsamic", "berries", 0.38],
    ["balsamic", "black pepper", 0.30],
    ["balsamic", "tomato", 0.42],
    ["balsamic", "cherry", 0.34],
    ["balsamic", "orange", 0.28],
    ["balsamic", "honey", 0.32],
    ["blue cheese", "honey", 0.36],
    ["blue cheese", "apple", 0.34],
    ["blue cheese", "bourbon", 0.26],
    ["blue cheese", "butter", 0.30],
    ["smoked paprika", "chocolate", 0.28],
    ["smoked paprika", "tomato", 0.36],
    ["smoked paprika", "lime", 0.30],
    ["smoked paprika", "orange", 0.28],
    ["smoked paprika", "bourbon", 0.26],
  ];
  for (const [a, b, v] of pairs) {
    (CURATED[a] ??= {})[b] = v;
    (CURATED[b] ??= {})[a] = v;
  }
})();

/**
 * True NPMI co-occurrence over the curated recipe corpus (food + cocktail ~290 recipes).
 * PMI = log(P(xy) / (P(x)P(y))); NPMI = PMI / -log(P(xy)) ∈ [-1, 1].
 * Mapped to [0, 1] via (NPMI + 1) / 2 so it blends with molecular scores.
 * Pairs that never co-occur stay absent (0) — unexpected bridges rely on that gap.
 */
function fromCorpus(): Record<string, Record<string, number>> {
  const N = RECIPES.length;
  if (N === 0) return {};

  const df = new Map<string, number>();
  const pair = new Map<string, number>();

  for (const recipe of RECIPES) {
    const names = [...new Set([...recipe.required, ...recipe.optional].map(canon))];
    for (const name of names) df.set(name, (df.get(name) ?? 0) + 1);
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const a = names[i]!;
        const b = names[j]!;
        const key = a < b ? `${a}||${b}` : `${b}||${a}`;
        pair.set(key, (pair.get(key) ?? 0) + 1);
      }
    }
  }

  const out: Record<string, Record<string, number>> = {};
  for (const [key, nxy] of pair) {
    const [a, b] = key.split("||") as [string, string];
    const px = (df.get(a) ?? 0) / N;
    const py = (df.get(b) ?? 0) / N;
    const pxy = nxy / N;
    if (px <= 0 || py <= 0 || pxy <= 0) continue;
    const pmi = Math.log(pxy / (px * py));
    const denom = -Math.log(pxy);
    const npmi = denom === 0 ? 0 : pmi / denom;
    const score = Number(Math.max(0, Math.min(1, (npmi + 1) / 2)).toFixed(3));
    if (score <= 0) continue;
    (out[a] ??= {})[b] = score;
    (out[b] ??= {})[a] = score;
  }
  return out;
}

function mergeCo(...tables: Record<string, Record<string, number>>[]): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  for (const table of tables) {
    for (const [a, row] of Object.entries(table)) {
      for (const [b, v] of Object.entries(row)) {
        const cur = out[a]?.[b];
        if (cur === undefined || v > cur) {
          (out[a] ??= {})[b] = v;
          (out[b] ??= {})[a] = v;
        }
      }
    }
  }
  return out;
}

export const CO_OCCURRENCE = mergeCo(fromCorpus(), CURATED);

function buildCompoundDf(): { N: number; df: Map<string, number> } {
  const df = new Map<string, number>();
  for (const profile of PROFILES) {
    for (const c of new Set(profile.compounds)) df.set(c, (df.get(c) ?? 0) + 1);
  }
  return { N: PROFILES.length, df };
}
const { N: PROFILE_COUNT, df: COMPOUND_DF } = buildCompoundDf();

export function compoundIdf(compound: string): number {
  const df = COMPOUND_DF.get(compound) ?? 0;
  return Math.log((PROFILE_COUNT + 1) / (df + 1)) + 1;
}

export function jaccard(a: string[], b: string[]): number {
  const A = new Set(a), B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function idfJaccard(a: string[], b: string[]): number {
  const A = new Set(a), B = new Set(b);
  if (A.size === 0 && B.size === 0) return 0;
  let interW = 0, unionW = 0;
  const seen = new Set<string>();
  for (const c of A) {
    const w = compoundIdf(c);
    unionW += w; seen.add(c);
    if (B.has(c)) interW += w;
  }
  for (const c of B) {
    if (seen.has(c)) continue;
    unionW += compoundIdf(c);
  }
  return unionW === 0 ? 0 : interW / unionW;
}

export function pairScore(a: string, b: string) {
  const na = canon(a), nb = canon(b);
  const pa = profileFor(na), pb = profileFor(nb);
  const molecular = pa && pb ? idfJaccard(pa.compounds, pb.compounds) : 0;
  const co = CO_OCCURRENCE[na]?.[nb] ?? CO_OCCURRENCE[nb]?.[na] ?? 0;
  const shared = pa && pb ? pa.compounds.filter((c) => pb.compounds.includes(c)) : [];
  const synergyApplied = molecular > SYNERGY.molecularMin && co > SYNERGY.coMin;
  let composite = 0.5 * molecular + 0.5 * co + (synergyApplied ? SYNERGY.bonus : 0);
  if (pa?.coverage === "sparse" || pb?.coverage === "sparse") {
    composite = 0.35 * molecular + 0.65 * co + (synergyApplied ? SYNERGY.bonus : 0);
  }
  return {
    a, b,
    molecular: Number(molecular.toFixed(3)),
    cooccurrence: Number(co.toFixed(3)),
    composite: Number(Math.min(1, composite).toFixed(3)),
    shared, synergyApplied,
    coverageA: pa?.coverage ?? "sparse",
    coverageB: pb?.coverage ?? "sparse",
  };
}

export const MATCH_FLAVOR = { molecular: 0.35, cooccurrence: 0.65 } as const;
export type PairScore = ReturnType<typeof pairScore>;
export type ScoredNeighbor = PairScore & { displayName: string; category: string };

/** Mean 35/65 molecular/co-occurrence across on-hand pairs, plus the strongest pair. */
export function recipeHarmony(requiredHave: string[], optionalHave: string[]) {
  const names = [...new Set([...requiredHave, ...optionalHave].map(canon))];
  if (names.length < 2) {
    return { score: names.length === 0 ? 0.5 : 0.55, topPair: null };
  }
  let best: PairScore | null = null;
  let total = 0;
  let n = 0;
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const s = pairScore(names[i]!, names[j]!);
      total += MATCH_FLAVOR.molecular * s.molecular + MATCH_FLAVOR.cooccurrence * s.cooccurrence;
      n += 1;
      if (!best || s.composite > best.composite) best = s;
    }
  }
  const score = n === 0 ? 0.5 : total / n;
  return {
    score: Number(Math.min(1, score).toFixed(3)),
    topPair: best
      ? {
          a: best.a,
          b: best.b,
          score: best.composite,
          cooccurrence: best.cooccurrence,
          molecular: best.molecular,
        }
      : null,
  };
}

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

export type UnexpectedBridge = PairScore & {
  displayA: string;
  displayB: string;
  gap: number;
  sharedRarity: number;
};

export function unexpectedBridges(limit = 16): UnexpectedBridge[] {
  const rows: UnexpectedBridge[] = [];
  for (let i = 0; i < PROFILES.length; i++) {
    const a = PROFILES[i]!;
    if (a.compounds.length < 2) continue;
    for (let j = i + 1; j < PROFILES.length; j++) {
      const b = PROFILES[j]!;
      if (b.compounds.length < 2) continue;
      const s = pairScore(a.name, b.name);
      if (s.molecular < 0.22 || s.cooccurrence >= 0.4 || s.shared.length === 0) continue;
      const sharedRarity = s.shared.reduce((sum, c) => sum + compoundIdf(c), 0);
      rows.push({
        ...s,
        displayA: a.displayName,
        displayB: b.displayName,
        gap: Number((s.molecular - s.cooccurrence).toFixed(3)),
        sharedRarity: Number(sharedRarity.toFixed(3)),
      });
    }
  }
  return rows
    .sort((x, y) => y.gap - x.gap || y.sharedRarity - x.sharedRarity || y.molecular - x.molecular)
    .slice(0, limit);
}

export const FEATURED_BRIDGES = [
  { a: "bourbon", b: "angostura", hook: "Old Fashioned spine — oak, spice, bitters" },
  { a: "gin", b: "tonic", hook: "Highball classic — juniper meets quinine" },
  { a: "tequila", b: "lime", hook: "Margarita core — agave and sharp citrus" },
  { a: "rum", b: "mint", hook: "Mojito path — ester fruit and cooling herb" },
  { a: "aperol", b: "prosecco", hook: "Spritz — bitter orange and sparkle" },
  { a: "coffee", b: "chocolate", hook: "Mocha bridge — roast meets cocoa" },
  { a: "bourbon", b: "maple", hook: "Breakfast Old Fashioned leaning" },
  { a: "mezcal", b: "lime", hook: "Smoke + acid — Oaxaca highball path" },
  { a: "tomato", b: "basil", hook: "Caprese chemistry — green and fruit" },
  { a: "gin", b: "cucumber", hook: "Cool garden martini direction" },
  { a: "balsamic", b: "berries", hook: "Sweet-sour fruit — board or dessert path" },
  { a: "blue cheese", b: "honey", hook: "Pungent dairy + floral sweet" },
  { a: "smoked salt", b: "chocolate", hook: "Phenolic smoke on cocoa" },
] as const;

export function rankInventoryPairs(focal: string, inventoryNames: string[], limit = 10) {
  const unique = [...new Set(inventoryNames.map(canon).filter((n) => n !== canon(focal)))];
  return unique
    .map((name) => {
      const profile = profileFor(name);
      return {
        ...pairScore(focal, name),
        displayName: profile?.displayName ?? name,
        category: profile?.category ?? "unknown",
      };
    })
    .sort((x, y) => y.composite - x.composite)
    .slice(0, limit);
}

export const UNEXPECTED_BRIDGES = unexpectedBridges(16);

export function explainPair(score: PairScore): string {
  const parts: string[] = [];
  if (score.synergyApplied) {
    parts.push("Both molecular overlap and recipe practice are elevated — synergy bonus applied.");
  } else if (score.molecular > 0.3 && score.cooccurrence < 0.4) {
    const rare = score.shared.filter((c) => compoundIdf(c) >= 2.2).slice(0, 3);
    if (rare.length) {
      parts.push(`Chemistry agrees more than the recipe corpus — rare shared notes (${rare.join(", ")}). Worth a deliberate bridge.`);
    } else {
      parts.push("Chemistry agrees more than the recipe corpus; try it as a deliberate bridge.");
    }
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

export function inventoryHarmony(names: string[]): number {
  if (names.length < 2) return 0.5;
  let total = 0, n = 0;
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      total += pairScore(names[i]!, names[j]!).composite;
      n += 1;
    }
  }
  return n === 0 ? 0.5 : total / n;
}

export function missingProfiles(names: string[]): string[] {
  return [...new Set(names)].filter((n) => !profileFor(n));
}
