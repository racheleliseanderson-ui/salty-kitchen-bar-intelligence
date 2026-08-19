/** Ingredient families used for hierarchical matching and substitutions. */
export const FAMILIES: Record<string, string[]> = {
  whiskey: ["bourbon", "rye", "scotch", "irish whiskey", "whiskey"],
  citrus: ["lemon", "lime", "orange", "grapefruit", "citrus"],
  allium: ["onion", "garlic", "shallot", "scallion", "allium"],
  dairy: ["milk", "cream", "butter", "yogurt", "sour cream", "dairy"],
  cheese: ["parmesan", "cheddar", "feta", "mozzarella", "cheese"],
  tequila: ["tequila", "blanco", "reposado"],
  rum: ["rum", "white rum", "dark rum"],
  brandy: ["cognac", "brandy", "armagnac"],
  sparkling: ["prosecco", "champagne", "cava", "sparkling wine"],
  sweetener: ["simple syrup", "sugar", "honey", "agave", "maple"],
  bitter: ["angostura", "orange bitters", "bitters"],
  aperitif: ["campari", "aperol"],
  vermouth: ["sweet vermouth", "dry vermouth", "vermouth"],
  green: ["kale", "spinach", "lettuce", "greens"],
  tomato: ["tomato", "canned tomato", "tomato paste"],
  egg: ["eggs", "egg"],
  coffee_liqueur: ["coffee liqueur", "kahlua"],
  vinegar: ["red wine vinegar", "rice vinegar", "vinegar"],
  berry: ["berries", "strawberry", "blueberry"],
  coconut: ["coconut milk", "coconut cream", "coconut"],
  grain: ["pasta", "rice", "grain", "oats"],
  bean: ["black beans", "chickpeas", "lentils", "beans"],
  mustard: ["dijon", "mustard"],
  oil: ["olive oil", "sesame oil", "oil"],
  chili: ["chili flakes", "jalapeno", "hot sauce", "chili"],
  nut: ["peanut butter", "peanuts", "almonds", "nuts"],
  herb: ["basil", "parsley", "cilantro", "mint", "herb"],
  fish: ["tuna", "anchovies", "fish"],
};

export function familyOf(name: string): string | null {
  const n = name.toLowerCase();
  for (const [family, members] of Object.entries(FAMILIES)) {
    if (family === n || members.includes(n)) return family;
  }
  return null;
}

export type CoverKind = "exact" | "family" | "sibling" | null;

export function covers(have: Set<string>, needed: string): { kind: CoverKind; used?: string } {
  const n = needed.toLowerCase();
  if (have.has(n)) return { kind: "exact", used: n };

  const fam = familyOf(n);
  if (!fam) return { kind: null };

  const members = FAMILIES[fam] ?? [];
  for (const member of members) {
    if (!have.has(member)) continue;
    if (member === fam || n === fam) return { kind: "family", used: member };
    return { kind: "sibling", used: member };
  }
  return { kind: null };
}
