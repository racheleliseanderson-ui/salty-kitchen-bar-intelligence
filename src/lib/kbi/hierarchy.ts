/** Ingredient families used for hierarchical matching and substitutions. */
export const FAMILIES: Record<string, string[]> = {
  whiskey: ["bourbon", "rye", "scotch", "irish whiskey", "whiskey"],
  citrus: ["lemon", "lime", "orange", "grapefruit", "citrus"],
  allium: ["onion", "garlic", "shallot", "allium"],
  dairy: ["milk", "cream", "butter", "parmesan", "dairy"],
  tequila: ["tequila", "blanco", "reposado"],
  rum: ["rum", "white rum", "dark rum"],
  sweetener: ["simple syrup", "sugar", "honey", "agave"],
  bitter: ["angostura", "campari", "bitters"],
  vermouth: ["sweet vermouth", "dry vermouth", "vermouth"],
  green: ["kale", "spinach", "lettuce", "herb"],
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
