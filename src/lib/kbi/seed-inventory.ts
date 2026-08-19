import type { Category, InventoryItem, Location, Unit } from "./types";

interface SeedRow {
  displayName: string;
  normalizedName: string;
  category: Category;
  value: number;
  unit: Unit;
  expiry: number | null;
  location: Location;
  tags?: string[];
}

const ROWS: SeedRow[] = [
  // —— bar shelf ——
  { displayName: "Maker's Mark", normalizedName: "bourbon", category: "spirit", value: 0.7, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Rittenhouse Rye", normalizedName: "rye", category: "spirit", value: 0.5, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Tanqueray", normalizedName: "gin", category: "spirit", value: 0.6, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Tito's", normalizedName: "vodka", category: "spirit", value: 0.8, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Espolón Blanco", normalizedName: "tequila", category: "spirit", value: 0.55, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Campari", normalizedName: "campari", category: "spirit", value: 0.5, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Aperol", normalizedName: "aperol", category: "spirit", value: 0.7, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Cointreau", normalizedName: "cointreau", category: "spirit", value: 0.55, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Angostura", normalizedName: "angostura", category: "mixer", value: 0.8, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Regans' Orange Bitters", normalizedName: "orange bitters", category: "mixer", value: 0.7, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Averna", normalizedName: "amaro", category: "spirit", value: 0.45, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Luxardo Maraschino", normalizedName: "maraschino", category: "spirit", value: 0.4, unit: "bottle", expiry: null, location: "bar_shelf" },
  { displayName: "Fever-Tree tonic", normalizedName: "tonic", category: "mixer", value: 4, unit: "count", expiry: 90, location: "bar_shelf" },
  { displayName: "Fever-Tree ginger beer", normalizedName: "ginger beer", category: "mixer", value: 4, unit: "count", expiry: 90, location: "bar_shelf" },
  { displayName: "Club soda", normalizedName: "soda", category: "mixer", value: 6, unit: "count", expiry: 180, location: "bar_shelf" },
  { displayName: "Simple syrup", normalizedName: "simple syrup", category: "mixer", value: 0.3, unit: "bottle", expiry: 60, location: "fridge" },
  { displayName: "Cola", normalizedName: "cola", category: "mixer", value: 4, unit: "count", expiry: 120, location: "pantry" },

  // —— fridge produce / dairy / protein ——
  { displayName: "Lemons", normalizedName: "lemon", category: "produce", value: 4, unit: "count", expiry: 10, location: "fridge" },
  { displayName: "Limes", normalizedName: "lime", category: "produce", value: 5, unit: "count", expiry: 9, location: "fridge" },
  { displayName: "Navel oranges", normalizedName: "orange", category: "produce", value: 3, unit: "count", expiry: 12, location: "fridge" },
  { displayName: "Garlic", normalizedName: "garlic", category: "produce", value: 1, unit: "count", expiry: 25, location: "pantry" },
  { displayName: "Yellow onion", normalizedName: "onion", category: "produce", value: 3, unit: "count", expiry: 20, location: "pantry" },
  { displayName: "Shallots", normalizedName: "shallot", category: "produce", value: 4, unit: "count", expiry: 14, location: "fridge" },
  { displayName: "Fresh ginger", normalizedName: "ginger", category: "produce", value: 1, unit: "count", expiry: 18, location: "fridge" },
  { displayName: "Green onions", normalizedName: "scallion", category: "produce", value: 1, unit: "bunch", expiry: 8, location: "fridge" },
  { displayName: "Kale", normalizedName: "kale", category: "produce", value: 1, unit: "bunch", expiry: 5, location: "fridge", tags: ["near-expiry"] },
  { displayName: "Baby spinach", normalizedName: "spinach", category: "produce", value: 150, unit: "g", expiry: 4, location: "fridge", tags: ["near-expiry"] },
  { displayName: "Romaine", normalizedName: "lettuce", category: "produce", value: 1, unit: "count", expiry: 6, location: "fridge" },
  { displayName: "Cucumber", normalizedName: "cucumber", category: "produce", value: 2, unit: "count", expiry: 7, location: "fridge" },
  { displayName: "Carrots", normalizedName: "carrot", category: "produce", value: 5, unit: "count", expiry: 14, location: "fridge" },
  { displayName: "Celery", normalizedName: "celery", category: "produce", value: 1, unit: "bunch", expiry: 10, location: "fridge" },
  { displayName: "Broccoli", normalizedName: "broccoli", category: "produce", value: 1, unit: "count", expiry: 6, location: "fridge" },
  { displayName: "Bell pepper", normalizedName: "bell pepper", category: "produce", value: 2, unit: "count", expiry: 8, location: "fridge" },
  { displayName: "Jalapeños", normalizedName: "jalapeno", category: "produce", value: 3, unit: "count", expiry: 10, location: "fridge" },
  { displayName: "Cherry tomatoes", normalizedName: "tomato", category: "produce", value: 250, unit: "g", expiry: 5, location: "fridge", tags: ["near-expiry"] },
  { displayName: "Avocado", normalizedName: "avocado", category: "produce", value: 2, unit: "count", expiry: 4, location: "fridge", tags: ["near-expiry"] },
  { displayName: "Apple", normalizedName: "apple", category: "produce", value: 3, unit: "count", expiry: 14, location: "fridge" },
  { displayName: "Fresh mint", normalizedName: "mint", category: "herb", value: 1, unit: "bunch", expiry: 5, location: "fridge", tags: ["near-expiry"] },
  { displayName: "Basil", normalizedName: "basil", category: "herb", value: 1, unit: "bunch", expiry: 4, location: "fridge", tags: ["near-expiry"] },
  { displayName: "Parsley", normalizedName: "parsley", category: "herb", value: 1, unit: "bunch", expiry: 6, location: "fridge" },
  { displayName: "Cilantro", normalizedName: "cilantro", category: "herb", value: 1, unit: "bunch", expiry: 5, location: "fridge" },
  { displayName: "Eggs", normalizedName: "eggs", category: "protein", value: 12, unit: "count", expiry: 18, location: "fridge" },
  { displayName: "Whole milk", normalizedName: "milk", category: "dairy", value: 1, unit: "count", expiry: 7, location: "fridge" },
  { displayName: "Heavy cream", normalizedName: "cream", category: "dairy", value: 0.25, unit: "bottle", expiry: 10, location: "fridge" },
  { displayName: "Butter", normalizedName: "butter", category: "dairy", value: 1, unit: "count", expiry: 30, location: "fridge" },
  { displayName: "Greek yogurt", normalizedName: "yogurt", category: "dairy", value: 500, unit: "g", expiry: 12, location: "fridge" },
  { displayName: "Sour cream", normalizedName: "sour cream", category: "dairy", value: 1, unit: "count", expiry: 14, location: "fridge" },
  { displayName: "Parmesan", normalizedName: "parmesan", category: "dairy", value: 150, unit: "g", expiry: 40, location: "fridge" },
  { displayName: "Cheddar", normalizedName: "cheddar", category: "dairy", value: 200, unit: "g", expiry: 25, location: "fridge" },
  { displayName: "Feta block", normalizedName: "feta", category: "dairy", value: 200, unit: "g", expiry: 12, location: "fridge" },
  { displayName: "Fresh mozzarella", normalizedName: "mozzarella", category: "dairy", value: 200, unit: "g", expiry: 7, location: "fridge" },
  { displayName: "Roast chicken", normalizedName: "chicken", category: "protein", value: 400, unit: "g", expiry: 3, location: "fridge", tags: ["near-expiry"] },
  { displayName: "Bacon", normalizedName: "bacon", category: "protein", value: 200, unit: "g", expiry: 8, location: "fridge" },

  // —— pantry ——
  { displayName: "Spaghetti", normalizedName: "pasta", category: "pantry", value: 500, unit: "g", expiry: null, location: "pantry" },
  { displayName: "Jasmine rice", normalizedName: "rice", category: "pantry", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "Rolled oats", normalizedName: "oats", category: "pantry", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "All-purpose flour", normalizedName: "flour", category: "pantry", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "Black beans", normalizedName: "black beans", category: "pantry", value: 2, unit: "count", expiry: 300, location: "pantry" },
  { displayName: "Chickpeas", normalizedName: "chickpeas", category: "pantry", value: 2, unit: "count", expiry: 300, location: "pantry" },
  { displayName: "Lentils", normalizedName: "lentils", category: "pantry", value: 400, unit: "g", expiry: null, location: "pantry" },
  { displayName: "Canned tomato", normalizedName: "canned tomato", category: "pantry", value: 3, unit: "count", expiry: 400, location: "pantry" },
  { displayName: "Tomato paste", normalizedName: "tomato paste", category: "pantry", value: 1, unit: "count", expiry: 200, location: "pantry" },
  { displayName: "Chicken stock", normalizedName: "stock", category: "pantry", value: 2, unit: "count", expiry: 200, location: "pantry" },
  { displayName: "Olive oil", normalizedName: "olive oil", category: "pantry", value: 0.6, unit: "bottle", expiry: null, location: "pantry" },
  { displayName: "Sesame oil", normalizedName: "sesame oil", category: "pantry", value: 0.3, unit: "bottle", expiry: null, location: "pantry" },
  { displayName: "Soy sauce", normalizedName: "soy sauce", category: "condiment", value: 0.4, unit: "bottle", expiry: 180, location: "pantry" },
  { displayName: "White miso", normalizedName: "miso", category: "condiment", value: 200, unit: "g", expiry: 90, location: "fridge" },
  { displayName: "Dijon mustard", normalizedName: "dijon", category: "condiment", value: 1, unit: "count", expiry: 200, location: "fridge" },
  { displayName: "Honey", normalizedName: "honey", category: "pantry", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "Maple syrup", normalizedName: "maple", category: "pantry", value: 1, unit: "count", expiry: 200, location: "pantry" },
  { displayName: "Sugar", normalizedName: "sugar", category: "pantry", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "Cumin", normalizedName: "cumin", category: "pantry", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "Turmeric", normalizedName: "turmeric", category: "pantry", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "Sumac", normalizedName: "sumac", category: "pantry", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "Chili flakes", normalizedName: "chili flakes", category: "condiment", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "Smoked paprika", normalizedName: "paprika", category: "condiment", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "Black pepper", normalizedName: "black pepper", category: "condiment", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "Red wine vinegar", normalizedName: "red wine vinegar", category: "condiment", value: 1, unit: "bottle", expiry: null, location: "pantry" },
  { displayName: "Rice vinegar", normalizedName: "rice vinegar", category: "condiment", value: 1, unit: "bottle", expiry: null, location: "pantry" },
  { displayName: "Capers", normalizedName: "capers", category: "condiment", value: 1, unit: "count", expiry: 240, location: "pantry" },
  { displayName: "Oil-packed anchovies", normalizedName: "anchovies", category: "condiment", value: 1, unit: "count", expiry: 260, location: "pantry" },
  { displayName: "Olives", normalizedName: "olives", category: "condiment", value: 1, unit: "count", expiry: 180, location: "fridge" },
  { displayName: "Mayonnaise", normalizedName: "mayo", category: "condiment", value: 1, unit: "count", expiry: 60, location: "fridge" },
  { displayName: "Natural peanut butter", normalizedName: "peanut butter", category: "pantry", value: 1, unit: "count", expiry: 90, location: "pantry" },
  { displayName: "Fish sauce", normalizedName: "fish sauce", category: "condiment", value: 1, unit: "bottle", expiry: 400, location: "pantry" },
  { displayName: "Worcestershire", normalizedName: "worcestershire", category: "condiment", value: 1, unit: "bottle", expiry: 500, location: "pantry" },
  { displayName: "Coconut milk", normalizedName: "coconut milk", category: "pantry", value: 2, unit: "count", expiry: 360, location: "pantry" },
  { displayName: "Cholula", normalizedName: "hot sauce", category: "condiment", value: 1, unit: "bottle", expiry: 300, location: "pantry" },
  { displayName: "Vanilla extract", normalizedName: "vanilla", category: "pantry", value: 1, unit: "bottle", expiry: null, location: "pantry" },
  { displayName: "Tahini", normalizedName: "tahini", category: "condiment", value: 1, unit: "bottle", expiry: 180, location: "pantry" },
  { displayName: "White wine (cooking)", normalizedName: "white wine", category: "pantry", value: 0.4, unit: "bottle", expiry: 30, location: "fridge" },
  { displayName: "Open bottle of prosecco", normalizedName: "prosecco", category: "spirit", value: 0.35, unit: "bottle", expiry: 3, location: "fridge", tags: ["near-expiry"] },
  { displayName: "Dark chocolate bar", normalizedName: "chocolate", category: "pantry", value: 1, unit: "count", expiry: 200, location: "pantry" },
  { displayName: "Dried oregano", normalizedName: "oregano", category: "herb", value: 1, unit: "count", expiry: null, location: "pantry" },
  { displayName: "Canned tuna", normalizedName: "tuna", category: "protein", value: 3, unit: "count", expiry: 400, location: "pantry" },
  { displayName: "Corn tortillas", normalizedName: "tortillas", category: "pantry", value: 10, unit: "count", expiry: 14, location: "fridge" },
  { displayName: "Potatoes", normalizedName: "potato", category: "produce", value: 6, unit: "count", expiry: 20, location: "pantry" },
  { displayName: "Pineapple (canned)", normalizedName: "pineapple", category: "pantry", value: 1, unit: "count", expiry: 300, location: "pantry" },
  { displayName: "Ground coffee", normalizedName: "coffee", category: "pantry", value: 1, unit: "count", expiry: 60, location: "pantry" },
  { displayName: "Mushrooms", normalizedName: "mushrooms", category: "produce", value: 200, unit: "g", expiry: 5, location: "fridge" },

  // —— freezer ——
  { displayName: "Frozen peas", normalizedName: "peas", category: "produce", value: 400, unit: "g", expiry: 180, location: "freezer" },
  { displayName: "Sourdough loaf", normalizedName: "bread", category: "pantry", value: 1, unit: "count", expiry: 30, location: "freezer" },
  { displayName: "Frozen shrimp", normalizedName: "shrimp", category: "protein", value: 400, unit: "g", expiry: 90, location: "freezer" },
  { displayName: "Frozen corn", normalizedName: "corn", category: "produce", value: 400, unit: "g", expiry: 180, location: "freezer" },
  { displayName: "Frozen mixed berries", normalizedName: "berries", category: "produce", value: 300, unit: "g", expiry: 200, location: "freezer" },
];

export const HOUSEHOLD_ITEM_COUNT = ROWS.length;

export function sampleInventory(now = new Date()): InventoryItem[] {
  const iso = now.toISOString();
  const day = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };

  return ROWS.map((row) => ({
    id: crypto.randomUUID(),
    displayName: row.displayName,
    normalizedName: row.normalizedName,
    category: row.category,
    quantity: { value: row.value, unit: row.unit },
    expiry: row.expiry === null ? null : day(row.expiry),
    location: row.location,
    source: "demo",
    confidence: 1,
    lastUpdated: iso,
    tags: row.tags ?? [],
    userNotes: "",
  }));
}
