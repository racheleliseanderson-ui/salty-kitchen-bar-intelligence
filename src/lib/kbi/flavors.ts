import { RECIPES } from "./seed-recipes";
import type { FlavorProfile, ProfileCoverage } from "./types";

/**
 * Curated FlavorDB / FooDB-style volatile sets — educational stand-in only.
 * Coverage rule: every normalizedName in RECIPES or sampleInventory resolves.
 */
export const DATA_VERSION = "2026.08.19-curated-v7";
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
    sourceNote: "Curated educational stand-in",
  };
}

export const PROFILES: FlavorProfile[] = [
  p("amaro", "Amaro", "spirit", ["quinine", "eugenol", "citrus peel oils", "vanillin"], "Bitter-herbal.", "moderate"),
  p("amaretto", "Amaretto", "spirit", ["benzaldehyde", "vanillin", "ethyl acetate"], "Almond liqueur.", "sparse"),
  p("anchovies", "Anchovies", "condiment", ["trimethylamine", "methional", "glutamate"], "Salt-forward fish.", "moderate"),
  p("angostura", "Angostura", "mixer", ["eugenol", "cinnamaldehyde", "quassin", "vanillin"], "Baking-spice bitters.", "rich"),
  p("aperol", "Aperol", "spirit", ["limonene", "linalool", "orange oil", "quinine"], "Softer bitter orange.", "moderate"),
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
  p("chocolate", "Chocolate", "pantry", ["tetramethylpyrazine", "vanillin", "2-methylbutanal", "guaiacol"], "Cocoa.", "moderate"),
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
  p("honey", "Honey", "pantry", ["phenylacetaldehyde", "furfural", "vanillin"], "Floral sugar.", "moderate"),
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
  p("sweet vermouth", "Sweet vermouth", "mixer", ["vanillin", "cinnamaldehyde", "orange oil", "wormwood"], "Fortified botanical wine.", "moderate"),
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
  // Expanded seed: classic cocktail, food-bar bridges, pantry staples, sparse-fill.
  // Scores are educational stand-ins for NPMI-style co-occurrence, not lab assays.
  const pairs: [string, string, number][] = [
    // Classic bar
    ["aperol", "prosecco", 0.92],
    ["bourbon", "angostura", 0.94],
    ["bourbon", "sweet vermouth", 0.9],
    ["bourbon", "maple", 0.78],
    ["bourbon", "honey", 0.76],
    ["bourbon", "mint", 0.74],
    ["bourbon", "orange", 0.72],
    ["bourbon", "lemon", 0.7],
    ["bourbon", "chocolate", 0.68],
    ["bourbon", "coffee", 0.65],
    ["rye", "sweet vermouth", 0.88],
    ["rye", "angostura", 0.9],
    ["campari", "sweet vermouth", 0.9],
    ["campari", "orange", 0.82],
    ["gin", "campari", 0.86],
    ["gin", "dry vermouth", 0.9],
    ["gin", "tonic", 0.93],
    ["gin", "lemon", 0.8],
    ["gin", "lime", 0.78],
    ["gin", "cucumber", 0.72],
    ["gin", "mint", 0.7],
    ["gin", "chartreuse", 0.74],
    ["gin", "orgeat", 0.7],
    ["lillet", "gin", 0.78],
    ["vodka", "tonic", 0.88],
    ["vodka", "coffee liqueur", 0.84],
    ["vodka", "cranberry", 0.8],
    ["vodka", "lime", 0.75],
    ["tequila", "cointreau", 0.88],
    ["tequila", "lime", 0.94],
    ["tequila", "grapefruit", 0.8],
    ["tequila", "orange", 0.72],
    ["mezcal", "lime", 0.78],
    ["mezcal", "honey", 0.72],
    ["mezcal", "campari", 0.7],
    ["rum", "lime", 0.94],
    ["rum", "mint", 0.86],
    ["rum", "pineapple", 0.88],
    ["rum", "orgeat", 0.8],
    ["rum", "cointreau", 0.76],
    ["cognac", "cointreau", 0.84],
    ["scotch", "angostura", 0.82],
    ["scotch", "honey", 0.7],
    ["irish whiskey", "coffee", 0.8],
    ["amaro", "bourbon", 0.72],
    ["amaro", "lemon", 0.68],
    ["aperol", "bourbon", 0.7],
    ["aperol", "lemon", 0.74],
    ["cointreau", "lemon", 0.78],
    ["cointreau", "lime", 0.8],
    ["orange bitters", "bourbon", 0.76],
    ["orange bitters", "gin", 0.7],
    ["maraschino", "gin", 0.72],
    ["chartreuse", "lemon", 0.68],

    // Food + bar bridges
    ["bourbon", "bacon", 0.7],
    ["bourbon", "maple", 0.78],
    ["gin", "cucumber", 0.72],
    ["gin", "basil", 0.68],
    ["rum", "coconut milk", 0.75],
    ["tequila", "cilantro", 0.72],
    ["mezcal", "chocolate", 0.65],
    ["scotch", "chocolate", 0.68],
    ["coffee", "bourbon", 0.65],
    ["chocolate", "orange", 0.7],
    ["honey", "lemon", 0.8],
    ["mint", "lime", 0.88],
    ["mint", "cucumber", 0.7],

    // Core kitchen
    ["garlic", "olive oil", 0.94],
    ["garlic", "tomato", 0.95],
    ["tomato", "basil", 0.92],
    ["tomato", "oregano", 0.85],
    ["pasta", "parmesan", 0.9],
    ["pasta", "garlic", 0.88],
    ["chickpeas", "tahini", 0.93],
    ["tahini", "lemon", 0.86],
    ["tahini", "garlic", 0.84],
    ["cilantro", "lime", 0.94],
    ["fish sauce", "lime", 0.88],
    ["fish sauce", "garlic", 0.8],
    ["soy sauce", "sesame oil", 0.9],
    ["soy sauce", "ginger", 0.86],
    ["miso", "ginger", 0.78],
    ["miso", "scallion", 0.75],
    ["avocado", "lime", 0.9],
    ["avocado", "cilantro", 0.82],
    ["feta", "cucumber", 0.8],
    ["feta", "lemon", 0.78],
    ["feta", "olive oil", 0.82],
    ["mozzarella", "tomato", 0.9],
    ["mozzarella", "basil", 0.88],
    ["parmesan", "black pepper", 0.75],
    ["bacon", "eggs", 0.85],
    ["butter", "lemon", 0.72],
    ["butter", "garlic", 0.8],
    ["onion", "garlic", 0.9],
    ["carrot", "onion", 0.78],
    ["celery", "onion", 0.8],
    ["ginger", "garlic", 0.88],
    ["ginger", "lime", 0.82],
    ["cumin", "garlic", 0.8],
    ["cumin", "lime", 0.72],
    ["sumac", "lemon", 0.78],
    ["sumac", "olive oil", 0.74],
    ["yogurt", "cucumber", 0.82],
    ["yogurt", "mint", 0.8],
    ["yogurt", "garlic", 0.78],
    ["peanut butter", "lime", 0.7],
    ["peanut butter", "soy sauce", 0.72],
    ["mushroom", "garlic", 0.8],
    ["mushroom", "butter", 0.78],
    ["spinach", "garlic", 0.75],
    ["kale", "garlic", 0.74],
    ["lemon", "olive oil", 0.85],
    ["lime", "cilantro", 0.94],
    ["orange", "cinnamon", 0.7],
    ["berries", "yogurt", 0.75],
    ["chocolate", "coffee", 0.8],
    ["maple", "butter", 0.78],
    ["honey", "yogurt", 0.7],
    ["anchovies", "garlic", 0.82],
    ["anchovies", "olive oil", 0.8],
    ["capers", "lemon", 0.78],
    ["olives", "feta", 0.76],
    ["dijon", "honey", 0.72],
    ["hot sauce", "lime", 0.75],
    ["worcestershire", "garlic", 0.7],
    ["coconut milk", "lime", 0.8],
    ["coconut milk", "ginger", 0.78],
    ["coconut milk", "cilantro", 0.74],
    ["rice", "soy sauce", 0.7],
    ["tortillas", "lime", 0.72],
    ["tortillas", "cilantro", 0.74],
    ["shrimp", "garlic", 0.82],
    ["shrimp", "lime", 0.86],
    ["tuna", "lemon", 0.78],
    ["chicken", "garlic", 0.8],
    ["chicken", "lemon", 0.76],
    ["eggs", "butter", 0.8],
    ["potato", "butter", 0.75],
    ["broccoli", "garlic", 0.72],
    ["bell pepper", "onion", 0.78],
    ["jalapeno", "lime", 0.8],
    ["jalapeno", "cilantro", 0.78],
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
  let composite = 0.5 * molecular + 0.5 * co + (synergyApplied ? SYNERGY.bonus : 0);
  // Sparse profiles lean slightly more on co-occurrence so the explorer stays useful.
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

/** Match ranking leans on the denser co-occurrence table, not 50/50 Jaccard. */
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

/** Rank inventory items against a focal ingredient. */
export function rankInventoryPairs(
  focal: string,
  inventoryNames: string[],
  limit = 8,
) {
  const unique = [...new Set(inventoryNames.map(canon).filter((n) => n !== canon(focal)))];
  return unique
    .map((n) => {
      const score = pairScore(focal, n);
      const prof = profileFor(n);
      return {
        ...score,
        displayName: prof?.displayName ?? n,
        category: prof?.category ?? "pantry",
      };
    })
    .sort((a, b) => b.composite - a.composite)
    .slice(0, limit);
}

export type FlavorPair = {
  a: string;
  b: string;
  score: number;
  cooccurrence: number;
  molecular: number;
};

/**
 * Recipe flavor for Match: required on-hand pairs first, 35/65 molecular/co-occurrence.
 * Optional ingredients only fill in when fewer than two required are present.
 */
export function recipeHarmony(requiredHave: string[], optionalHave: string[] = []) {
  const primary = requiredHave.length >= 2 ? requiredHave : [...requiredHave, ...optionalHave];
  const empty = {
    score: requiredHave.length === 1 ? 0.5 : 0.45,
    coAvg: 0,
    molAvg: 0,
    topPair: null as FlavorPair | null,
  };
  if (primary.length < 2) return empty;

  let co = 0;
  let mol = 0;
  let n = 0;
  let syn = 0;
  let top: FlavorPair | null = null;
  for (let i = 0; i < primary.length; i++) {
    for (let j = i + 1; j < primary.length; j++) {
      const s = pairScore(primary[i]!, primary[j]!);
      co += s.cooccurrence;
      mol += s.molecular;
      if (s.synergyApplied) syn += SYNERGY.bonus;
      n += 1;
      const hybrid =
        MATCH_FLAVOR.molecular * s.molecular + MATCH_FLAVOR.cooccurrence * s.cooccurrence;
      if (!top || hybrid > top.score) {
        top = {
          a: primary[i]!,
          b: primary[j]!,
          score: Number(hybrid.toFixed(3)),
          cooccurrence: s.cooccurrence,
          molecular: s.molecular,
        };
      }
    }
  }
  if (n === 0) return empty;
  const score = Math.min(1, MATCH_FLAVOR.molecular * (mol / n) + MATCH_FLAVOR.cooccurrence * (co / n) + Math.min(SYNERGY.bonus, syn / n));
  return {
    score: Number(score.toFixed(3)),
    coAvg: Number((co / n).toFixed(3)),
    molAvg: Number((mol / n).toFixed(3)),
    topPair: top,
  };
}

/** Hand-picked high-signal bridges for the engagement surface. */
export const FEATURED_BRIDGES: { a: string; b: string; hook: string }[] = [
  { a: "bourbon", b: "angostura", hook: "Oak + baking spice — Old Fashioned bones" },
  { a: "gin", b: "tonic", hook: "Juniper meets quinine — the highball default" },
  { a: "tequila", b: "lime", hook: "Agave + sharp citrus — Margarita core" },
  { a: "rum", b: "mint", hook: "Cane spirit + cooling leaf — Mojito path" },
  { a: "campari", b: "sweet vermouth", hook: "Bitter orange + fortified wine — Negroni third" },
  { a: "chickpeas", b: "tahini", hook: "Pulse + sesame — hummus foundation" },
  { a: "tomato", b: "basil", hook: "Ripe fruit + herb oil — Caprese / sauce" },
  { a: "garlic", b: "olive oil", hook: "Allium + green lipid — almost every savory start" },
  { a: "cilantro", b: "lime", hook: "Citrus leaf + acid — Mexican / SE Asian bridge" },
  { a: "bourbon", b: "chocolate", hook: "Vanilla-oak meets cocoa — dessert cocktail or board" },
  { a: "mezcal", b: "lime", hook: "Smoke + acid — Oaxaca highball path" },
  { a: "miso", b: "ginger", hook: "Fermented umami + rhizome heat" },
];

export type UnexpectedBridge = PairScore & {
  displayA: string;
  displayB: string;
  gap: number;
};

/** Chemistry agrees; the recipe corpus does not (yet). */
export function unexpectedBridges(limit = 16): UnexpectedBridge[] {
  const rows: UnexpectedBridge[] = [];
  for (let i = 0; i < PROFILES.length; i++) {
    const a = PROFILES[i]!;
    if (a.compounds.length < 2) continue;
    for (let j = i + 1; j < PROFILES.length; j++) {
      const b = PROFILES[j]!;
      if (b.compounds.length < 2) continue;
      const s = pairScore(a.name, b.name);
      if (s.molecular < 0.25 || s.cooccurrence >= 0.4 || s.shared.length === 0) continue;
      rows.push({
        ...s,
        displayA: a.displayName,
        displayB: b.displayName,
        gap: Number((s.molecular - s.cooccurrence).toFixed(3)),
      });
    }
  }
  return rows.sort((x, y) => y.gap - x.gap || y.molecular - x.molecular).slice(0, limit);
}

export const UNEXPECTED_BRIDGES = unexpectedBridges(16);

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
    parts.push("Weak composite in this educational subset — do not force the pairing.");
  }
  if (score.coverageA === "sparse" || score.coverageB === "sparse") {
    parts.push("One or both profiles are sparse, so the score leans on co-occurrence.");
  }
  return parts.join(" ");
}
