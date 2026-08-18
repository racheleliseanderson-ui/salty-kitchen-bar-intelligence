import type { FlavorProfile } from "./types";

/** Curated FlavorDB-style volatile sets — educational, not a lab assay. */
export const PROFILES: FlavorProfile[] = [
  {
    name: "bourbon",
    displayName: "Bourbon",
    category: "spirit",
    compounds: ["vanillin", "oak lactone", "eugenol", "guaiacol", "furfural"],
    notes: "Oak, vanilla, baking spice. Covers most whiskey builds.",
  },
  {
    name: "gin",
    displayName: "Gin",
    category: "spirit",
    compounds: ["alpha-pinene", "limonene", "linalool", "juniperol", "geraniol"],
    notes: "Juniper and citrus terpenes. Bright with tonic, vermouth, or cucumber.",
  },
  {
    name: "campari",
    displayName: "Campari",
    category: "spirit",
    compounds: ["limonene", "linalool", "quinine", "citrus peel oils"],
    notes: "Bitter orange peel. High overlap with gin and sweet vermouth.",
  },
  {
    name: "sweet vermouth",
    displayName: "Sweet vermouth",
    category: "mixer",
    compounds: ["vanillin", "cinnamon aldehyde", "orange oil", "wormwood"],
    notes: "Fortified wine + botanicals. Bridges whiskey and bitter aperitifs.",
  },
  {
    name: "lemon",
    displayName: "Lemon",
    category: "produce",
    compounds: ["citral", "limonene", "linalool", "beta-pinene", "geraniol"],
    notes: "Shared terpenes with gin, lime, and many herbs.",
  },
  {
    name: "lime",
    displayName: "Lime",
    category: "produce",
    compounds: ["limonene", "citral", "gamma-terpinene", "linalool"],
    notes: "Sibling to lemon. Preferred in highballs and Daiquiri-family drinks.",
  },
  {
    name: "garlic",
    displayName: "Garlic",
    category: "produce",
    compounds: ["allicin", "diallyl disulfide", "diallyl trisulfide"],
    notes: "Sulfur volatiles. Pairs with tomato, olive oil, and roasted protein.",
  },
  {
    name: "tomato",
    displayName: "Tomato",
    category: "pantry",
    compounds: ["cis-3-hexenal", "beta-ionone", "furaneol", "linalool"],
    notes: "Green-leaf + ripe fruit notes. High co-occurrence with garlic and basil.",
  },
  {
    name: "basil",
    displayName: "Basil",
    category: "herb",
    compounds: ["linalool", "eugenol", "estragole", "1,8-cineole"],
    notes: "Shared eugenol/linalool with bourbon spice and tomato sauces.",
  },
  {
    name: "parmesan",
    displayName: "Parmesan",
    category: "dairy",
    compounds: ["butyric acid", "methional", "2-heptanone", "glutamate"],
    notes: "Savory dairy. Co-occurs with pasta, lemon, and garlic far more than chemistry predicts.",
  },
  {
    name: "butter",
    displayName: "Butter",
    category: "dairy",
    compounds: ["diacetyl", "delta-decalactone", "butyric acid"],
    notes: "Dairy fat. Carries lemon, garlic, and brown-butter nut notes.",
  },
  {
    name: "chicken",
    displayName: "Roast chicken",
    category: "protein",
    compounds: ["methional", "2-acetyl-2-thiazoline", "hexanal"],
    notes: "Roast sulfur-and-lipid notes. Pairs with lemon, Dijon, and greens.",
  },
  {
    name: "kale",
    displayName: "Kale",
    category: "produce",
    compounds: ["cis-3-hexenol", "allyl isothiocyanate", "dimethyl sulfide"],
    notes: "Green and mustardy. Needs fat, acid, or salt to resolve.",
  },
  {
    name: "honey",
    displayName: "Honey",
    category: "pantry",
    compounds: ["phenylacetaldehyde", "furfural", "linalool oxide"],
    notes: "Floral sugar. Bridges bourbon, lemon, and roasted vegetables.",
  },
  {
    name: "coffee",
    displayName: "Coffee",
    category: "pantry",
    compounds: ["2-furfurylthiol", "guaiacol", "2-methylpyrazine"],
    notes: "Shared guaiacol with barrel-aged spirits. Classic with chocolate and orange.",
  },
  {
    name: "chocolate",
    displayName: "Chocolate",
    category: "pantry",
    compounds: ["tetramethylpyrazine", "vanillin", "2-methylbutanal"],
    notes: "Pyrazines + vanillin. High molecular overlap with bourbon.",
  },
  {
    name: "orange",
    displayName: "Orange",
    category: "produce",
    compounds: ["limonene", "linalool", "octanal", "valencene"],
    notes: "Peel oils overlap gin, Campari, and chocolate.",
  },
  {
    name: "olive oil",
    displayName: "Olive oil",
    category: "pantry",
    compounds: ["hexanal", "trans-2-hexenal", "1-penten-3-one"],
    notes: "Green lipid aldehydes. Carries tomato, garlic, and citrus.",
  },
  {
    name: "angostura",
    displayName: "Angostura",
    category: "mixer",
    compounds: ["eugenol", "cinnamaldehyde", "quassin", "vanillin"],
    notes: "Baking-spice bitters. High overlap with bourbon oak spices.",
  },
  {
    name: "tonic",
    displayName: "Tonic",
    category: "mixer",
    compounds: ["quinine", "limonene", "citric acid"],
    notes: "Bitter-citrus mixer. Grounds gin without adding new botanicals.",
  },
];

export const CO_OCCURRENCE: Record<string, Record<string, number>> = {
  bourbon: { "sweet vermouth": 0.86, angostura: 0.92, lemon: 0.7, honey: 0.62, chocolate: 0.48, coffee: 0.44, orange: 0.55 },
  gin: { lemon: 0.78, lime: 0.74, tonic: 0.9, campari: 0.84, "sweet vermouth": 0.8, orange: 0.66, basil: 0.4 },
  campari: { gin: 0.84, "sweet vermouth": 0.88, orange: 0.7, bourbon: 0.58 },
  lemon: { gin: 0.78, bourbon: 0.7, butter: 0.72, parmesan: 0.68, chicken: 0.64, kale: 0.58, honey: 0.6 },
  lime: { gin: 0.74, tonic: 0.62, honey: 0.42 },
  garlic: { tomato: 0.94, "olive oil": 0.9, chicken: 0.7, parmesan: 0.66, butter: 0.58 },
  tomato: { garlic: 0.94, basil: 0.88, "olive oil": 0.86, parmesan: 0.7 },
  basil: { tomato: 0.88, garlic: 0.72, lemon: 0.5 },
  parmesan: { lemon: 0.68, garlic: 0.66, butter: 0.64, kale: 0.55 },
  butter: { lemon: 0.72, garlic: 0.58, honey: 0.5, chicken: 0.52 },
  chicken: { lemon: 0.64, garlic: 0.7, kale: 0.5, butter: 0.52 },
  kale: { lemon: 0.58, parmesan: 0.55, garlic: 0.48 },
  honey: { lemon: 0.6, bourbon: 0.62, butter: 0.5 },
  coffee: { chocolate: 0.8, bourbon: 0.44, orange: 0.46 },
  chocolate: { coffee: 0.8, bourbon: 0.48, orange: 0.52 },
  orange: { campari: 0.7, chocolate: 0.52, gin: 0.66 },
  "olive oil": { garlic: 0.9, tomato: 0.86, lemon: 0.54 },
  angostura: { bourbon: 0.92, "sweet vermouth": 0.7 },
  tonic: { gin: 0.9, lime: 0.62 },
  "sweet vermouth": { bourbon: 0.86, campari: 0.88, gin: 0.8, angostura: 0.7 },
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
  const composite = 0.5 * molecular + 0.5 * co + (molecular > 0.25 && co > 0.5 ? 0.08 : 0);
  return {
    a,
    b,
    molecular: Number(molecular.toFixed(3)),
    cooccurrence: Number(co.toFixed(3)),
    composite: Number(Math.min(1, composite).toFixed(3)),
    shared,
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
