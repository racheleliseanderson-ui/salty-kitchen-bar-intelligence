import { RECIPES } from "./seed-recipes";
import type { FlavorProfile } from "./types";

/**
 * Curated FlavorDB / FooDB-style volatile sets — educational stand-in only.
 * Coverage rule: every normalizedName in RECIPES or sampleInventory resolves.
 */
export const DATA_VERSION = "2026.08.19-curated-v6";
export const LAST_REVIEWED = "2026-08-19";

export const SYNERGY = {
  molecularMin: 0.25,
  coMin: 0.5,
  bonus: 0.08,
} as const;

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
  coverage: "rich" | "moderate" | "sparse" = "moderate",
): FlavorProfile {
  return { name, displayName, category, compounds, notes, coverage, sourceNote: "Curated educational stand-in" };
}

export const PROFILES: FlavorProfile[] = [
  p("amaro", "Amaro", "spirit", ["quinine", "eugenol", "citrus peel oils"], "Bitter-herbal.", "moderate"),
  p("amaretto", "Amaretto", "spirit", ["benzaldehyde", "vanillin"], "Almond liqueur.", "sparse"),
  p("anchovies", "Anchovies", "condiment", ["trimethylamine", "methional", "glutamate"], "Salt-forward fish.", "moderate"),
  p("angostura", "Angostura", "mixer", ["eugenol", "cinnamaldehyde", "quassin", "vanillin"], "Baking-spice bitters.", "rich"),
  p("aperol", "Aperol", "spirit", ["limonene", "linalool", "orange oil"], "Softer bitter orange.", "moderate"),
  p("apple", "Apple", "produce", ["ethyl-2-methylbutyrate", "hexanal", "linalool"], "Fresh fruit.", "moderate"),
  p("avocado", "Avocado", "produce", ["hexanal", "trans-2-hexenal"], "Green fat.", "sparse"),
  p("bacon", "Bacon", "protein", ["guaiacol", "2,3-butanedione", "pyrazines"], "Smoke and fat.", "moderate"),
  p("basil", "Basil", "herb", ["linalool", "eugenol", "estragole"], "Herb essential-oil core.", "moderate"),
  p("bell pepper", "Bell pepper", "produce", ["2-isobutyl-3-methoxypyrazine", "beta-ionone"], "Sweet pepper.", "sparse"),
  p("berries", "Berries", "produce", ["furaneol", "linalool", "ethyl butyrate"], "Frozen summer.", "moderate"),
  p("black beans", "Black beans", "pantry", ["methional", "hexanal"], "Earthy pulse.", "sparse"),
  p("black pepper", "Black pepper", "condiment", ["piperine", "caryophyllene"], "Pungent spice.", "sparse"),
  p("bourbon", "Bourbon", "spirit", ["vanillin", "oak lactone", "eugenol", "guaiacol", "furfural"], "Oak, vanilla, baking spice.", "rich"),
  p("bread", "Bread", "pantry", ["2-acetyl-1-pyrroline", "furfural"], "Toasted wheat.", "sparse"),
  p("broccoli", "Broccoli", "produce", ["dimethyl sulfide", "allyl isothiocyanate"], "Brassica green.", "sparse"),
  p("butter", "Butter", "dairy", ["diacetyl", "delta-decalactone", "butyric acid"], "Dairy fat.", "moderate"),
  p("campari", "Campari", "spirit", ["limonene", "linalool", "quinine", "citrus peel oils"], "Bitter orange peel.", "moderate"),
  p("canned tomato", "Canned tomato", "pantry", ["cis-3-hexenal", "beta-ionone", "furaneol"], "Cooked tomato.", "sparse"),
  p("capers", "Capers", "condiment", ["acetic acid", "methyl isothiocyanate"], "Briny bud.", "sparse"),
  p("carrot", "Carrot", "produce", ["terpinolene", "beta-caryophyllene"], "Sweet root.", "sparse"),
  p("celery", "Celery", "produce", ["sedanolide", "limonene"], "Green stalk.", "sparse"),
  p("chartreuse", "Chartreuse", "spirit", ["linalool", "alpha-pinene", "herbal terpenes"], "Herbal liqueur.", "moderate"),
  p("cheddar", "Cheddar", "dairy", ["butyric acid", "methional", "2-heptanone"], "Aged cheese.", "moderate"),
  p("cherry", "Cherry", "produce", ["benzaldehyde", "ethyl acetate"], "Stone fruit.", "sparse"),
  p("chicken", "Chicken", "protein", ["methional", "2-acetyl-2-thiazoline", "hexanal"], "Roast protein.", "sparse"),
  p("chickpeas", "Chickpeas", "pantry", ["hexanal", "2-methoxy-3-isopropylpyrazine"], "Neutral pulse.", "sparse"),
  p("chili flakes", "Chili flakes", "condiment", ["capsaicin", "hexanal"], "Dried heat.", "sparse"),
  p("chocolate", "Chocolate", "pantry", ["tetramethylpyrazine", "vanillin", "2-methylbutanal"], "Cocoa.", "moderate"),
  p("cilantro", "Cilantro", "herb", ["decanal", "(E)-2-decenal", "linalool"], "Soapy-citrus leaf for some.", "moderate"),
  p("cinnamon", "Cinnamon", "pantry", ["cinnamaldehyde", "eugenol"], "Warm bark.", "sparse"),
  p("coconut milk", "Coconut milk", "pantry", ["delta-decalactone", "gamma-nonalactone", "octanoic acid"], "Lactone fat.", "moderate"),
  p("coffee", "Coffee", "pantry", ["2-furfurylthiol", "guaiacol", "2-methylpyrazine"], "Roast.", "moderate"),
  p("coffee liqueur", "Coffee liqueur", "spirit", ["2-furfurylthiol", "vanillin", "ethanol"], "Sweet coffee spirit.", "sparse"),
  p("cognac", "Cognac", "spirit", ["vanillin", "oak lactone", "ethyl octanoate", "furfural"], "Grape brandy + oak.", "moderate"),
  p("cointreau", "Cointreau", "spirit", ["limonene", "linalool", "octanal", "citral"], "Orange liqueur.", "moderate"),
  p("cola", "Cola", "mixer", ["vanillin", "cinnamaldehyde", "citrus oils"], "Sweet spice soda.", "sparse"),
  p("corn", "Corn", "produce", ["dimethyl sulfide", "2-acetyl-1-pyrroline"], "Sweet cereal.", "sparse"),
  p("cranberry", "Cranberry", "produce", ["benzaldehyde", "alpha-terpineol"], "Tart berry.", "sparse"),
  p("cream", "Cream", "dairy", ["delta-decalactone", "diacetyl"], "Rich dairy fat.", "sparse"),
  p("creme de cacao", "Crème de cacao", "spirit", ["vanillin", "tetramethylpyrazine"], "Chocolate liqueur.", "sparse"),
  p("creme de menthe", "Crème de menthe", "spirit", ["menthol", "menthone"], "Mint liqueur.", "sparse"),
  p("cucumber", "Cucumber", "produce", ["cis-3-hexenal", "2,6-nonadienal"], "Green water.", "sparse"),
  p("cumin", "Cumin", "pantry", ["cuminaldehyde", "gamma-terpinene", "p-cymene"], "Warm seed spice.", "moderate"),
  p("dijon", "Dijon", "condiment", ["allyl isothiocyanate"], "Pungent brassica.", "sparse"),
  p("drambuie", "Drambuie", "spirit", ["honey notes", "herbal terpenes", "vanillin"], "Scotch liqueur.", "sparse"),
  p("dry vermouth", "Dry vermouth", "mixer", ["linalool", "alpha-pinene", "wormwood"], "Dry botanical wine.", "sparse"),
  p("eggs", "Eggs", "protein", ["hydrogen sulfide", "methional"], "Cooked egg.", "sparse"),
  p("feta", "Feta", "dairy", ["butyric acid", "acetic acid", "caproic acid"], "Briny cheese.", "moderate"),
  p("fish sauce", "Fish sauce", "condiment", ["trimethylamine", "methional", "glutamate"], "Fermented fish umami.", "moderate"),
  p("flour", "Flour", "pantry", ["hexanal"], "Wheat starch.", "sparse"),
  p("garlic", "Garlic", "produce", ["allicin", "diallyl disulfide"], "Allium sulfur.", "moderate"),
  p("gin", "Gin", "spirit", ["alpha-pinene", "limonene", "linalool", "juniperol"], "Juniper + citrus.", "rich"),
  p("ginger", "Ginger", "produce", ["gingerol", "zingerone", "citral"], "Pungent rhizome.", "moderate"),
  p("ginger beer", "Ginger beer", "mixer", ["gingerol", "citral", "carbon dioxide"], "Spicy soda.", "sparse"),
  p("grapefruit", "Grapefruit", "produce", ["limonene", "nootkatone", "citral"], "Bitter citrus.", "moderate"),
  p("honey", "Honey", "pantry", ["phenylacetaldehyde", "furfural"], "Floral sugar.", "moderate"),
  p("hot sauce", "Hot sauce", "condiment", ["capsaicin", "acetic acid"], "Vinegar heat.", "sparse"),
  p("irish whiskey", "Irish whiskey", "spirit", ["vanillin", "oak lactone", "ester notes"], "Softer whiskey.", "sparse"),
  p("jalapeno", "Jalapeño", "produce", ["capsaicin", "2-isobutyl-3-methoxypyrazine"], "Fresh heat.", "sparse"),
  p("kale", "Kale", "produce", ["cis-3-hexenol", "allyl isothiocyanate"], "Brassica green.", "sparse"),
  p("lemon", "Lemon", "produce", ["citral", "limonene", "linalool"], "Bright citrus.", "rich"),
  p("lentils", "Lentils", "pantry", ["hexanal", "methional"], "Earthy pulse.", "sparse"),
  p("lettuce", "Lettuce", "produce", ["cis-3-hexenol"], "Mild green.", "sparse"),
  p("lillet", "Lillet", "spirit", ["orange oil", "quinine", "wine esters"], "Aperitif wine.", "sparse"),
  p("lime", "Lime", "produce", ["limonene", "citral", "gamma-terpinene"], "Sharp citrus.", "rich"),
  p("maple", "Maple", "pantry", ["maple lactone", "vanillin"], "Wood sugar.", "sparse"),
  p("maraschino", "Maraschino", "spirit", ["benzaldehyde", "ethanol"], "Cherry liqueur.", "sparse"),
  p("mayo", "Mayonnaise", "condiment", ["acetic acid", "egg lipid notes"], "Emulsion fat.", "sparse"),
  p("mezcal", "Mezcal", "spirit", ["guaiacol", "cresol", "smoky phenols"], "Smoked agave.", "moderate"),
  p("milk", "Milk", "dairy", ["delta-decalactone", "dimethyl sulfide"], "Mild dairy.", "sparse"),
  p("mint", "Mint", "herb", ["menthol", "menthone", "limonene"], "Cooling leaf.", "rich"),
  p("miso", "Miso", "condiment", ["methional", "glutamate", "4-ethylguaiacol"], "Fermented soybean.", "moderate"),
  p("mozzarella", "Mozzarella", "dairy", ["butyric acid", "diacetyl"], "Fresh cheese.", "sparse"),
  p("mushrooms", "Mushrooms", "produce", ["1-octen-3-ol", "methional"], "Earthy fungal.", "moderate"),
  p("oats", "Oats", "pantry", ["hexanal", "2-acetyl-1-pyrroline"], "Cereal.", "sparse"),
  p("olive oil", "Olive oil", "pantry", ["hexanal", "trans-2-hexenal"], "Green lipid.", "moderate"),
  p("olives", "Olives", "condiment", ["hexanal", "acetic acid"], "Briny fruit.", "sparse"),
  p("onion", "Onion", "produce", ["propanethial S-oxide", "dipropyl disulfide"], "Allium base.", "moderate"),
  p("orange", "Orange", "produce", ["limonene", "linalool", "octanal"], "Sweet citrus.", "rich"),
  p("orange bitters", "Orange bitters", "mixer", ["limonene", "quassin", "citrus peel"], "Citrus bitters.", "sparse"),
  p("oregano", "Oregano", "herb", ["carvacrol", "thymol"], "Mediterranean herb.", "sparse"),
  p("orgeat", "Orgeat", "mixer", ["benzaldehyde", "almond notes"], "Almond syrup.", "sparse"),
  p("paprika", "Paprika", "condiment", ["beta-ionone", "capsaicin traces"], "Sweet pepper powder.", "sparse"),
  p("parmesan", "Parmesan", "dairy", ["butyric acid", "methional", "glutamate"], "Aged savory cheese.", "moderate"),
  p("parsley", "Parsley", "herb", ["myristicin", "apiol"], "Fresh herb.", "sparse"),
  p("pasta", "Pasta", "pantry", ["2-acetyl-1-pyrroline", "hexanal"], "Wheat starch.", "sparse"),
  p("peanut butter", "Peanut butter", "pantry", ["pyrazines", "2-furylmethanethiol"], "Roasted nut.", "moderate"),
  p("peas", "Peas", "produce", ["methoxypyrazines", "hexanal"], "Sweet green.", "sparse"),
  p("pineapple", "Pineapple", "produce", ["ethyl butyrate", "methyl hexanoate"], "Tropical ester.", "moderate"),
  p("potato", "Potato", "produce", ["methional", "hexanal"], "Starch base.", "sparse"),
  p("prosecco", "Prosecco", "mixer", ["ethyl acetate", "isoamyl acetate"], "Sparkling wine.", "sparse"),
  p("red wine vinegar", "Red wine vinegar", "condiment", ["acetic acid", "ethyl acetate"], "Wine acid.", "sparse"),
  p("rice", "Rice", "pantry", ["2-acetyl-1-pyrroline", "hexanal"], "Starch base.", "sparse"),
  p("rice vinegar", "Rice vinegar", "condiment", ["acetic acid"], "Mild acid.", "sparse"),
  p("rum", "Rum", "spirit", ["ethyl acetate", "vanillin", "furfural", "diacetyl"], "Cane + oak.", "moderate"),
  p("rye", "Rye", "spirit", ["vanillin", "eugenol", "guaiacol", "oak lactone"], "Spicier whiskey.", "moderate"),
  p("scallion", "Scallion", "produce", ["allicin", "dipropyl disulfide"], "Mild allium.", "sparse"),
  p("scotch", "Scotch", "spirit", ["guaiacol", "peat phenols", "vanillin"], "Peated or unpeated whiskey.", "moderate"),
  p("sesame oil", "Sesame oil", "pantry", ["2-furylmethanethiol", "pyrazines"], "Roasted seed oil.", "sparse"),
  p("shallot", "Shallot", "produce", ["dipropyl disulfide", "allicin"], "Milder allium.", "sparse"),
  p("shrimp", "Shrimp", "protein", ["trimethylamine", "methional"], "Shellfish.", "sparse"),
  p("simple syrup", "Simple syrup", "mixer", ["sucrose"], "Neutral sweetener.", "sparse"),
  p("soda", "Soda", "mixer", ["carbon dioxide"], "Sparkling water.", "sparse"),
  p("sour cream", "Sour cream", "dairy", ["diacetyl", "acetic acid"], "Tangy dairy fat.", "sparse"),
  p("soy sauce", "Soy sauce", "condiment", ["methional", "4-ethylguaiacol", "glutamate"], "Fermented umami.", "moderate"),
  p("spinach", "Spinach", "produce", ["cis-3-hexenol", "dimethyl sulfide"], "Mild green.", "sparse"),
  p("stock", "Stock", "pantry", ["methional", "2-acetyl-2-thiazoline"], "Savory base.", "sparse"),
  p("sugar", "Sugar", "pantry", ["sucrose"], "Dry sweetener.", "sparse"),
  p("sumac", "Sumac", "pantry", ["malic acid"], "Tart berry acid.", "sparse"),
  p("suze", "Suze", "spirit", ["gentian", "quinine"], "Bitter aperitif.", "sparse"),
  p("sweet vermouth", "Sweet vermouth", "mixer", ["vanillin", "cinnamon aldehyde", "orange oil", "wormwood"], "Fortified botanical wine.", "moderate"),
  p("tahini", "Tahini", "pantry", ["pyrazines", "sesame thiols"], "Sesame paste.", "moderate"),
  p("tequila", "Tequila", "spirit", ["isoamyl alcohol", "beta-damascenone", "vanillin"], "Agave.", "moderate"),
  p("tofu", "Tofu", "protein", ["hexanal", "beany notes"], "Soy protein.", "sparse"),
  p("tomato", "Tomato", "produce", ["cis-3-hexenal", "beta-ionone", "furaneol"], "Ripe fruit + green.", "moderate"),
  p("tomato paste", "Tomato paste", "pantry", ["furaneol", "methional"], "Concentrated tomato.", "sparse"),
  p("tonic", "Tonic", "mixer", ["quinine", "limonene"], "Bitter citrus mixer.", "sparse"),
  p("tortillas", "Tortillas", "pantry", ["2-acetyl-1-pyrroline", "hexanal"], "Corn/wheat flatbread.", "sparse"),
  p("tuna", "Tuna", "protein", ["trimethylamine", "hexanal", "methional"], "Canned fish.", "moderate"),
  p("turmeric", "Turmeric", "pantry", ["turmerone", "ar-turmerone"], "Earthy rhizome.", "sparse"),
  p("vanilla", "Vanilla", "pantry", ["vanillin", "guaiacol"], "Sweet oak-adjacent.", "sparse"),
  p("vodka", "Vodka", "spirit", ["ethanol", "ethyl acetate"], "Quiet spirit.", "sparse"),
  p("water", "Water", "mixer", [], "Neutral.", "sparse"),
  p("white wine", "White wine", "mixer", ["ethyl acetate", "isoamyl acetate", "linalool"], "Acid and fruit.", "moderate"),
  p("worcestershire", "Worcestershire", "condiment", ["acetic acid", "glutamate"], "Savory acid.", "sparse"),
  p("yogurt", "Yogurt", "dairy", ["acetaldehyde", "diacetyl", "acetic acid"], "Tangy dairy.", "moderate"),
].sort((a, b) => a.displayName.localeCompare(b.displayName));

const CURATED: Record<string, Record<string, number>> = {};

(() => {
  const pairs: [string, string, number][] = [
    ["aperol", "prosecco", 0.9],
    ["avocado", "lime", 0.85],
    ["bourbon", "angostura", 0.92],
    ["bourbon", "sweet vermouth", 0.86],
    ["campari", "sweet vermouth", 0.88],
    ["chickpeas", "tahini", 0.9],
    ["cilantro", "lime", 0.9],
    ["cognac", "cointreau", 0.82],
    ["fish sauce", "lime", 0.75],
    ["garlic", "olive oil", 0.9],
    ["garlic", "tomato", 0.94],
    ["gin", "campari", 0.84],
    ["gin", "dry vermouth", 0.88],
    ["gin", "tonic", 0.9],
    ["lillet", "gin", 0.75],
    ["maple", "bourbon", 0.7],
    ["mezcal", "lime", 0.7],
    ["mint", "bourbon", 0.7],
    ["mint", "rum", 0.78],
    ["pasta", "parmesan", 0.85],
    ["pineapple", "rum", 0.85],
    ["rum", "lime", 0.92],
    ["soy sauce", "sesame oil", 0.85],
    ["tequila", "cointreau", 0.85],
    ["tequila", "lime", 0.9],
    ["tomato", "basil", 0.88],
    ["vodka", "coffee liqueur", 0.8],
    ["scotch", "angostura", 0.8],
    ["irish whiskey", "coffee", 0.75],
    ["chartreuse", "gin", 0.7],
    ["orgeat", "gin", 0.72],
    ["orgeat", "bourbon", 0.65],
    ["feta", "cucumber", 0.7],
    ["tahini", "lemon", 0.75],
    ["mozzarella", "tomato", 0.85],
    ["mint", "lime", 0.8],
  ];
  for (const [a, b, v] of pairs) {
    (CURATED[a] ??= {})[b] = v;
    (CURATED[b] ??= {})[a] = v;
  }
})();

function fromCorpus(): Record<string, Record<string, number>> {
  const counts = new Map<string, number>();
  for (const recipe of RECIPES) {
    const names = [...new Set([...recipe.required, ...recipe.optional].map(canon))];
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const a = names[i]!;
        const b = names[j]!;
        const key = a < b ? `${a}||${b}` : `${b}||${a}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }
  const out: Record<string, Record<string, number>> = {};
  for (const [key, n] of counts) {
    const [a, b] = key.split("||") as [string, string];
    const score = Number(Math.min(0.95, 0.38 + 0.18 * n).toFixed(3));
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
        const cur = out[a]?.[b] ?? 0;
        if (v > cur) {
          (out[a] ??= {})[b] = v;
          (out[b] ??= {})[a] = v;
        }
      }
    }
  }
  return out;
}

export const CO_OCCURRENCE = mergeCo(fromCorpus(), CURATED);

export function profileFor(name: string): FlavorProfile | undefined {
  const n = canon(name);
  return PROFILES.find((p) => p.name === n);
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
  const na = canon(a);
  const nb = canon(b);
  const pa = profileFor(na);
  const pb = profileFor(nb);
  const molecular = pa && pb ? jaccard(pa.compounds, pb.compounds) : 0;
  const co = CO_OCCURRENCE[na]?.[nb] ?? CO_OCCURRENCE[nb]?.[na] ?? 0;
  const shared = pa && pb ? pa.compounds.filter((c) => pb.compounds.includes(c)) : [];
  const synergyApplied = molecular > SYNERGY.molecularMin && co > SYNERGY.coMin;
  const composite = 0.5 * molecular + 0.5 * co + (synergyApplied ? SYNERGY.bonus : 0);
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
  return PROFILES.filter((p) => p.name !== canon(name))
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

export function missingProfiles(names: string[]): string[] {
  return [...new Set(names)].filter((n) => !profileFor(n));
}
