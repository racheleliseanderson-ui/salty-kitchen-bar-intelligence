import type { FlavorProfile } from "./types";

/**
 * Curated FlavorDB / FooDB-style volatile sets — educational stand-in only.
 * Not a live or licensed extract. Production density requires cleared licenses
 * and a version-pinned dump; the scoring formula stays the same.
 */
export const DATA_VERSION = "2026.08.19-curated-v2";
export const LAST_REVIEWED = "2026-08-19";

/** Exact synergy gate used by pairScore (surfaced in the UI). */
export const SYNERGY = {
  molecularMin: 0.25,
  coMin: 0.5,
  bonus: 0.08,
} as const;

export const PROFILES: FlavorProfile[] = [
  {
    name: "bourbon",
    displayName: "Bourbon",
    category: "spirit",
    compounds: ["vanillin", "oak lactone", "eugenol", "guaiacol", "furfural"],
    notes: "Oak, vanilla, baking spice. Covers most whiskey builds.",
    coverage: "rich",
    sourceNote: "Key barrel-aged spirit odorants",
  },
  {
    name: "gin",
    displayName: "Gin",
    category: "spirit",
    compounds: ["alpha-pinene", "limonene", "linalool", "juniperol", "geraniol"],
    notes: "Juniper and citrus terpenes. Bright with tonic, vermouth, or cucumber.",
    coverage: "rich",
    sourceNote: "Juniper + citrus terpene core",
  },
  {
    name: "campari",
    displayName: "Campari",
    category: "spirit",
    compounds: ["limonene", "linalool", "quinine", "citrus peel oils"],
    notes: "Bitter orange peel. High overlap with gin and sweet vermouth.",
    coverage: "moderate",
    sourceNote: "Bitter orange + quinine markers",
  },
  {
    name: "sweet vermouth",
    displayName: "Sweet vermouth",
    category: "mixer",
    compounds: ["vanillin", "cinnamon aldehyde", "orange oil", "wormwood"],
    notes: "Fortified wine + botanicals. Bridges whiskey and bitter aperitifs.",
    coverage: "moderate",
    sourceNote: "Botanical + fortified-wine markers",
  },
  {
    name: "lemon",
    displayName: "Lemon",
    category: "produce",
    compounds: ["citral", "limonene", "linalool", "beta-pinene", "geraniol"],
    notes: "Shared terpenes with gin, lime, and many herbs.",
    coverage: "rich",
    sourceNote: "Citrus peel + juice odorants",
  },
  {
    name: "lime",
    displayName: "Lime",
    category: "produce",
    compounds: ["limonene", "citral", "gamma-terpinene", "linalool"],
    notes: "Sibling to lemon. Preferred in highballs and Daiquiri-family drinks.",
    coverage: "rich",
    sourceNote: "Citrus peel odorants",
  },
  {
    name: "garlic",
    displayName: "Garlic",
    category: "produce",
    compounds: ["allicin", "diallyl disulfide", "diallyl trisulfide"],
    notes: "Sulfur volatiles. Pairs with tomato, olive oil, and roasted protein.",
    coverage: "moderate",
    sourceNote: "Allium sulfur volatiles (heat-labile)",
  },
  {
    name: "tomato",
    displayName: "Tomato",
    category: "pantry",
    compounds: ["cis-3-hexenal", "beta-ionone", "furaneol", "linalool"],
    notes: "Green-leaf + ripe fruit notes. High co-occurrence with garlic and basil.",
    coverage: "moderate",
    sourceNote: "Green-leaf + ripe-fruit markers",
  },
  {
    name: "basil",
    displayName: "Basil",
    category: "herb",
    compounds: ["linalool", "eugenol", "estragole", "1,8-cineole"],
    notes: "Shared eugenol/linalool with bourbon spice and tomato sauces.",
    coverage: "rich",
    sourceNote: "Herb essential-oil core",
  },
  {
    name: "parmesan",
    displayName: "Parmesan",
    category: "dairy",
    compounds: ["butyric acid", "methional", "2-heptanone", "glutamate"],
    notes: "Savory dairy. Co-occurs with pasta, lemon, and garlic far more than chemistry predicts.",
    coverage: "moderate",
    sourceNote: "Aged dairy + umami markers",
  },
  {
    name: "butter",
    displayName: "Butter",
    category: "dairy",
    compounds: ["diacetyl", "delta-decalactone", "butyric acid"],
    notes: "Dairy fat. Carries lemon, garlic, and brown-butter nut notes.",
    coverage: "moderate",
    sourceNote: "Dairy fat odorants",
  },
  {
    name: "chicken",
    displayName: "Roast chicken",
    category: "protein",
    compounds: ["methional", "2-acetyl-2-thiazoline", "hexanal"],
    notes: "Roast sulfur-and-lipid notes. Pairs with lemon, Dijon, and greens.",
    coverage: "sparse",
    sourceNote: "Key roast markers only",
  },
  {
    name: "kale",
    displayName: "Kale",
    category: "produce",
    compounds: ["cis-3-hexenol", "allyl isothiocyanate", "dimethyl sulfide"],
    notes: "Green and mustardy. Needs fat, acid, or salt to resolve.",
    coverage: "sparse",
    sourceNote: "Green + glucosinolate markers",
  },
  {
    name: "honey",
    displayName: "Honey",
    category: "pantry",
    compounds: ["phenylacetaldehyde", "furfural", "linalool oxide"],
    notes: "Floral sugar. Bridges bourbon, lemon, and roasted vegetables.",
    coverage: "moderate",
    sourceNote: "Floral + Maillard sugar markers",
  },
  {
    name: "coffee",
    displayName: "Coffee",
    category: "pantry",
    compounds: ["2-furfurylthiol", "guaiacol", "2-methylpyrazine"],
    notes: "Shared guaiacol with barrel-aged spirits. Classic with chocolate and orange.",
    coverage: "moderate",
    sourceNote: "Roast pyrazine + thiol markers",
  },
  {
    name: "chocolate",
    displayName: "Chocolate",
    category: "pantry",
    compounds: ["tetramethylpyrazine", "vanillin", "2-methylbutanal"],
    notes: "Pyrazines + vanillin. High molecular overlap with bourbon.",
    coverage: "moderate",
    sourceNote: "Cocoa pyrazine + vanillin markers",
  },
  {
    name: "orange",
    displayName: "Orange",
    category: "produce",
    compounds: ["limonene", "linalool", "octanal", "valencene"],
    notes: "Peel oils overlap gin, Campari, and chocolate.",
    coverage: "rich",
    sourceNote: "Citrus peel odorants",
  },
  {
    name: "olive oil",
    displayName: "Olive oil",
    category: "pantry",
    compounds: ["hexanal", "trans-2-hexenal", "1-penten-3-one"],
    notes: "Green lipid aldehydes. Carries tomato, garlic, and citrus.",
    coverage: "moderate",
    sourceNote: "Green lipid aldehydes",
  },
  {
    name: "angostura",
    displayName: "Angostura",
    category: "mixer",
    compounds: ["eugenol", "cinnamaldehyde", "quassin", "vanillin"],
    notes: "Baking-spice bitters. High overlap with bourbon oak spices.",
    coverage: "moderate",
    sourceNote: "Baking-spice + bitter markers",
  },
  {
    name: "tonic",
    displayName: "Tonic",
    category: "mixer",
    compounds: ["quinine", "limonene", "citric acid"],
    notes: "Bitter-citrus mixer. Grounds gin without adding new botanicals.",
    coverage: "sparse",
    sourceNote: "Quinine + citrus markers",
  },
  // —— deliberate expansion (v2): broader culinary coverage ——
  {
    name: "cumin",
    displayName: "Cumin",
    category: "pantry",
    compounds: ["cuminaldehyde", "gamma-terpinene", "beta-pinene", "p-cymene"],
    notes: "Warm seed spice. Anchors Indian, Mexican, and Levantine builds.",
    coverage: "moderate",
    sourceNote: "Seed-spice aldehyde core",
  },
  {
    name: "coriander",
    displayName: "Coriander seed",
    category: "pantry",
    compounds: ["linalool", "alpha-pinene", "gamma-terpinene", "camphor"],
    notes: "Citrus-floral seed. Bridges gin botanicals and Indian/Levantine spice.",
    coverage: "moderate",
    sourceNote: "Seed terpene core",
  },
  {
    name: "turmeric",
    displayName: "Turmeric",
    category: "pantry",
    compounds: ["turmerone", "ar-turmerone", "zingiberene"],
    notes: "Earthy rhizome. High co-occurrence with cumin, ginger, and coconut.",
    coverage: "sparse",
    sourceNote: "Key rhizome markers only",
  },
  {
    name: "ginger",
    displayName: "Ginger",
    category: "produce",
    compounds: ["gingerol", "zingerone", "citral", "beta-bisabolene"],
    notes: "Pungent-citrus rhizome. Pairs with garlic, soy, lemon, and bourbon.",
    coverage: "moderate",
    sourceNote: "Pungent + citrus markers",
  },
  {
    name: "soy sauce",
    displayName: "Soy sauce",
    category: "condiment",
    compounds: ["methional", "2-methylbutanal", "4-ethylguaiacol", "glutamate"],
    notes: "Fermented umami. Bridges roast protein, garlic, and sesame.",
    coverage: "moderate",
    sourceNote: "Ferment + roast markers",
  },
  {
    name: "sesame",
    displayName: "Sesame",
    category: "pantry",
    compounds: ["2-furylmethanethiol", "pyrazines", "guaiacol"],
    notes: "Roasted seed. High co-occurrence with soy, garlic, and greens.",
    coverage: "sparse",
    sourceNote: "Roast seed markers",
  },
  {
    name: "coconut",
    displayName: "Coconut",
    category: "pantry",
    compounds: ["delta-decalactone", "gamma-nonalactone", "octanoic acid"],
    notes: "Lactone-rich fat. Bridges Caribbean, South-east Asian, and sweet builds.",
    coverage: "moderate",
    sourceNote: "Lactone fat markers",
  },
  {
    name: "chili",
    displayName: "Chili",
    category: "produce",
    compounds: ["capsaicin", "2-isobutyl-3-methoxypyrazine", "hexanal"],
    notes: "Heat + green. Needs fat, acid, or sugar to resolve; pairs with tomato and cumin.",
    coverage: "sparse",
    sourceNote: "Capsaicin + green markers",
  },
  {
    name: "lime leaf",
    displayName: "Makrut lime leaf",
    category: "herb",
    compounds: ["citronellal", "limonene", "nerol", "linalool"],
    notes: "Intense citrus-floral leaf. Anchors South-east Asian aromatics.",
    coverage: "moderate",
    sourceNote: "Leaf citrus-floral core",
  },
  {
    name: "sumac",
    displayName: "Sumac",
    category: "pantry",
    compounds: ["malic acid", "tartaric acid", "anthocyanins"],
    notes: "Tart berry acid. Levantine brightener for protein, onion, and herbs.",
    coverage: "sparse",
    sourceNote: "Acid markers (non-volatile heavy)",
  },
  {
    name: "zaatar",
    displayName: "Za'atar",
    category: "herb",
    compounds: ["thymol", "carvacrol", "p-cymene", "sesame oil notes"],
    notes: "Herb-sesame blend. Levantine bridge for olive oil, lemon, and flatbread.",
    coverage: "sparse",
    sourceNote: "Thyme-family + sesame markers",
  },
  {
    name: "miso",
    displayName: "Miso",
    category: "condiment",
    compounds: ["methional", "2,3-butanedione", "glutamate", "4-ethylguaiacol"],
    notes: "Fermented soybean. Umami depth with butter, garlic, and roast protein.",
    coverage: "moderate",
    sourceNote: "Ferment + umami markers",
  },
  {
    name: "tequila",
    displayName: "Tequila",
    category: "spirit",
    compounds: ["isoamyl alcohol", "beta-damascenone", "vanillin", "guaiacol"],
    notes: "Agave + oak (reposado). High co-occurrence with lime, chili, and orange.",
    coverage: "moderate",
    sourceNote: "Agave + oak markers",
  },
  {
    name: "rum",
    displayName: "Rum",
    category: "spirit",
    compounds: ["ethyl acetate", "vanillin", "furfural", "diacetyl"],
    notes: "Cane + oak. Bridges tropical fruit, lime, coconut, and baking spice.",
    coverage: "moderate",
    sourceNote: "Cane + oak markers",
  },
  {
    name: "mint",
    displayName: "Mint",
    category: "herb",
    compounds: ["menthol", "menthone", "limonene", "1,8-cineole"],
    notes: "Cooling leaf. Classic with lime, rum, and chocolate; also Levantine salads.",
    coverage: "rich",
    sourceNote: "Menthol core",
  },
  {
    name: "yogurt",
    displayName: "Yogurt",
    category: "dairy",
    compounds: ["acetaldehyde", "diacetyl", "lactic acid", "delta-decalactone"],
    notes: "Tangy dairy. High co-occurrence with cumin, mint, cucumber, and honey.",
    coverage: "moderate",
    sourceNote: "Fermented dairy markers",
  },
  {
    name: "cucumber",
    displayName: "Cucumber",
    category: "produce",
    compounds: ["cis-3-hexenal", "2,6-nonadienal", "hexanal"],
    notes: "Green-water. Softens gin, yogurt, and chili heat.",
    coverage: "sparse",
    sourceNote: "Green aldehyde markers",
  },
  {
    name: "pomegranate",
    displayName: "Pomegranate",
    category: "produce",
    compounds: ["hexanal", "ethyl hexanoate", "beta-ionone"],
    notes: "Tart-sweet fruit. Levantine and Persian bridge for protein and herbs.",
    coverage: "sparse",
    sourceNote: "Fruit ester + green markers",
  },
];

export const CO_OCCURRENCE: Record<string, Record<string, number>> = {
  bourbon: {
    "sweet vermouth": 0.86,
    angostura: 0.92,
    lemon: 0.7,
    honey: 0.62,
    chocolate: 0.48,
    coffee: 0.44,
    orange: 0.55,
    ginger: 0.5,
  },
  gin: {
    lemon: 0.78,
    lime: 0.74,
    tonic: 0.9,
    campari: 0.84,
    "sweet vermouth": 0.8,
    orange: 0.66,
    basil: 0.4,
    cucumber: 0.72,
    mint: 0.55,
    coriander: 0.58,
  },
  campari: { gin: 0.84, "sweet vermouth": 0.88, orange: 0.7, bourbon: 0.58 },
  lemon: {
    gin: 0.78,
    bourbon: 0.7,
    butter: 0.72,
    parmesan: 0.68,
    chicken: 0.64,
    kale: 0.58,
    honey: 0.6,
    yogurt: 0.55,
    sumac: 0.62,
    mint: 0.5,
  },
  lime: {
    gin: 0.74,
    tonic: 0.62,
    honey: 0.42,
    tequila: 0.88,
    rum: 0.7,
    chili: 0.65,
    mint: 0.72,
    "lime leaf": 0.6,
  },
  garlic: {
    tomato: 0.94,
    "olive oil": 0.9,
    chicken: 0.7,
    parmesan: 0.66,
    butter: 0.58,
    "soy sauce": 0.75,
    sesame: 0.7,
    ginger: 0.68,
    miso: 0.72,
  },
  tomato: {
    garlic: 0.94,
    basil: 0.88,
    "olive oil": 0.86,
    parmesan: 0.7,
    chili: 0.7,
    cumin: 0.55,
  },
  basil: { tomato: 0.88, garlic: 0.72, lemon: 0.5 },
  parmesan: { lemon: 0.68, garlic: 0.66, butter: 0.64, kale: 0.55 },
  butter: { lemon: 0.72, garlic: 0.58, honey: 0.5, chicken: 0.52, miso: 0.6 },
  chicken: { lemon: 0.64, garlic: 0.7, kale: 0.5, butter: 0.52, sumac: 0.55 },
  kale: { lemon: 0.58, parmesan: 0.55, garlic: 0.48 },
  honey: { lemon: 0.6, bourbon: 0.62, butter: 0.5, yogurt: 0.58, ginger: 0.48 },
  coffee: { chocolate: 0.8, bourbon: 0.44, orange: 0.46 },
  chocolate: { coffee: 0.8, bourbon: 0.48, orange: 0.52, mint: 0.55 },
  orange: { campari: 0.7, chocolate: 0.52, gin: 0.66, tequila: 0.5 },
  "olive oil": {
    garlic: 0.9,
    tomato: 0.86,
    lemon: 0.54,
    zaatar: 0.8,
    sumac: 0.65,
  },
  angostura: { bourbon: 0.92, "sweet vermouth": 0.7 },
  tonic: { gin: 0.9, lime: 0.62 },
  "sweet vermouth": {
    bourbon: 0.86,
    campari: 0.88,
    gin: 0.8,
    angostura: 0.7,
  },
  // expanded axes
  cumin: {
    coriander: 0.85,
    turmeric: 0.82,
    chili: 0.7,
    yogurt: 0.75,
    tomato: 0.55,
    garlic: 0.6,
  },
  coriander: { cumin: 0.85, gin: 0.58, lemon: 0.5, turmeric: 0.7 },
  turmeric: { cumin: 0.82, ginger: 0.7, coconut: 0.65, coriander: 0.7 },
  ginger: {
    garlic: 0.68,
    "soy sauce": 0.72,
    sesame: 0.6,
    honey: 0.48,
    bourbon: 0.5,
    turmeric: 0.7,
    "lime leaf": 0.55,
  },
  "soy sauce": {
    garlic: 0.75,
    sesame: 0.85,
    ginger: 0.72,
    miso: 0.7,
    chicken: 0.55,
  },
  sesame: { "soy sauce": 0.85, garlic: 0.7, ginger: 0.6, zaatar: 0.5 },
  coconut: { turmeric: 0.65, chili: 0.55, lime: 0.5, rum: 0.6, "lime leaf": 0.58 },
  chili: {
    cumin: 0.7,
    tomato: 0.7,
    lime: 0.65,
    garlic: 0.6,
    tequila: 0.55,
    coconut: 0.55,
  },
  "lime leaf": { lime: 0.6, ginger: 0.55, coconut: 0.58, chili: 0.5 },
  sumac: {
    lemon: 0.62,
    "olive oil": 0.65,
    chicken: 0.55,
    yogurt: 0.5,
    zaatar: 0.7,
    pomegranate: 0.65,
  },
  zaatar: {
    "olive oil": 0.8,
    lemon: 0.55,
    sumac: 0.7,
    sesame: 0.5,
    yogurt: 0.48,
  },
  miso: { butter: 0.6, garlic: 0.72, "soy sauce": 0.7, chicken: 0.5 },
  tequila: { lime: 0.88, orange: 0.5, chili: 0.55, honey: 0.4 },
  rum: { lime: 0.7, mint: 0.75, coconut: 0.6, orange: 0.48, honey: 0.45 },
  mint: {
    lime: 0.72,
    rum: 0.75,
    yogurt: 0.65,
    chocolate: 0.55,
    lemon: 0.5,
    cucumber: 0.6,
  },
  yogurt: {
    cumin: 0.75,
    mint: 0.65,
    cucumber: 0.7,
    honey: 0.58,
    lemon: 0.55,
    garlic: 0.45,
  },
  cucumber: { gin: 0.72, yogurt: 0.7, mint: 0.6, lemon: 0.45 },
  pomegranate: { sumac: 0.65, mint: 0.5, yogurt: 0.48, chicken: 0.42 },
};

export function profileFor(name: string): FlavorProfile | undefined {
  return PROFILES.find((p) => p.name === name);
}

export function jaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function pairScore(a: string, b: string) {
  const pa = profileFor(a);
  const pb = profileFor(b);
  const molecular = pa && pb ? jaccard(pa.compounds, pb.compounds) : 0;
  const co = CO_OCCURRENCE[a]?.[b] ?? CO_OCCURRENCE[b]?.[a] ?? 0;
  const shared = pa && pb ? pa.compounds.filter((c) => pb.compounds.includes(c)) : [];
  const synergyApplied =
    molecular > SYNERGY.molecularMin && co > SYNERGY.coMin;
  const composite =
    0.5 * molecular + 0.5 * co + (synergyApplied ? SYNERGY.bonus : 0);
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

export function bestPairsFor(name: string, limit = 5) {
  return PROFILES.filter((p) => p.name !== name)
    .map((p) => ({ ...pairScore(name, p.name), displayName: p.displayName }))
    .sort((x, y) => y.composite - x.composite)
    .slice(0, limit);
}

export function inventoryHarmony(names: string[]): number {
  if (names.length < 2) return 0.5;
  let total = 0;
  let n = 0;
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      total += pairScore(names[i]!, names[j]!).composite;
      n += 1;
    }
  }
  return n === 0 ? 0.5 : total / n;
}
