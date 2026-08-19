import type { Recipe, RecipeKind, Skill } from "./types";

function r(
  id: string,
  name: string,
  kind: RecipeKind,
  required: string[],
  optional: string[],
  minutes: number,
  skill: Skill,
  notes: string,
): Recipe {
  return { id, name, kind, required, optional, minutes, skill, notes };
}

/** Cocktail half of the curated corpus (SEED_VERSION 6). */
export const COCKTAIL_RECIPES: Recipe[] = [
  r("old-fashioned", "Old Fashioned", "cocktail", ["bourbon", "sugar", "angostura"], ["orange"], 4, "easy", "The whiskey already open."),
  r("manhattan", "Manhattan", "cocktail", ["bourbon", "sweet vermouth", "angostura"], [], 3, "easy", "Vermouth is open."),
  r("negroni", "Negroni", "cocktail", ["gin", "campari", "sweet vermouth"], ["orange"], 3, "easy", "Equal parts."),
  r("martini", "Martini", "cocktail", ["gin", "dry vermouth"], ["lemon"], 3, "easy", "Dry."),
  r("gin-tonic", "Gin and tonic", "cocktail", ["gin", "tonic"], ["lime"], 2, "easy", "Highball math."),
  r("whiskey-sour", "Whiskey sour", "cocktail", ["bourbon", "lemon", "simple syrup"], ["angostura"], 4, "easy", "The sour template."),
  r("margarita", "Margarita", "cocktail", ["tequila", "cointreau", "lime"], [], 4, "easy", "Three ingredients."),
  r("paloma", "Paloma", "cocktail", ["tequila", "grapefruit", "soda", "lime"], [], 3, "easy", "Citrus family may cover grapefruit."),
  r("daiquiri", "Daiquiri", "cocktail", ["rum", "lime", "simple syrup"], [], 4, "easy", "Rum is the Smart Buy."),
  r("dark-n-stormy", "Dark and Stormy", "cocktail", ["rum", "ginger beer", "lime"], [], 2, "easy", "Second rum unlock."),
  r("cuba-libre", "Cuba Libre", "cocktail", ["rum", "cola", "lime"], [], 2, "easy", "Third rum unlock."),
  r("sidecar", "Sidecar", "cocktail", ["cognac", "cointreau", "lemon"], [], 4, "easy", "Cognac is the miss."),
  r("aperol-spritz", "Aperol Spritz", "cocktail", ["aperol", "prosecco", "soda"], ["orange"], 2, "easy", "Prosecco already in the demo fridge."),
  r("french-75", "French 75", "cocktail", ["gin", "lemon", "simple syrup", "prosecco"], [], 5, "medium", "Sparkling family."),
  r("espresso-martini", "Espresso martini", "cocktail", ["vodka", "coffee liqueur", "coffee"], [], 6, "medium", "Coffee liqueur is the miss."),
  r("mojito", "Mojito", "cocktail", ["rum", "mint", "lime", "simple syrup"], ["soda"], 6, "medium", "Rum + mint path."),
  r("mint-julep", "Mint julep", "cocktail", ["bourbon", "mint", "sugar"], [], 6, "medium", "Mint is in the demo fridge."),
  r("army-navy", "Army & Navy", "cocktail", ["gin", "orgeat", "lemon"], [], 4, "easy", "Orgeat Smart Buy."),
  r("vesper", "Vesper", "cocktail", ["gin", "vodka", "lillet"], [], 4, "medium", "Lillet is the miss."),
  r("last-word", "Last Word", "cocktail", ["gin", "chartreuse", "maraschino", "lime"], [], 4, "medium", "Chartreuse Smart Buy."),
  r("mezcal-negroni", "Mezcal Negroni", "cocktail", ["mezcal", "campari", "sweet vermouth"], ["orange"], 3, "easy", "Mezcal is the agave miss."),
  r("scotch-old-fashioned", "Scotch Old Fashioned", "cocktail", ["scotch", "sugar", "angostura"], ["orange"], 4, "easy", "Scotch Smart Buy on the whiskey family."),
  r("irish-coffee", "Irish coffee", "cocktail", ["irish whiskey", "coffee", "sugar", "cream"], [], 6, "easy", "Irish unlock."),
  r("cosmopolitan", "Cosmopolitan", "cocktail", ["vodka", "cointreau", "lime", "cranberry"], [], 4, "easy", "Cranberry is the miss."),
  r("white-russian", "White Russian", "cocktail", ["vodka", "coffee liqueur", "cream"], [], 3, "easy", "Coffee liqueur unlock."),
  r("rum-punch", "Simple rum punch", "cocktail", ["rum", "orange", "lemon", "sugar", "angostura"], [], 5, "easy", "Rum density."),
  r("mezcal-mule", "Mezcal mule", "cocktail", ["mezcal", "ginger beer", "lime"], [], 3, "easy", "Mezcal unlock."),
  r("chartreuse-tonic", "Chartreuse and tonic", "cocktail", ["chartreuse", "tonic"], ["lime"], 2, "easy", "Chartreuse highball."),
  r("lillet-tonic", "Lillet and tonic", "cocktail", ["lillet", "tonic"], ["orange"], 2, "easy", "Lillet unlock."),
  r("orgeat-gin-fizz", "Gin orgeat fizz", "cocktail", ["gin", "orgeat", "lemon", "soda"], [], 5, "easy", "Orgeat unlock."),
  r("honey-gin", "Honey gin sour", "cocktail", ["gin", "honey", "lemon"], [], 4, "easy", "Sweetener family."),
  r("ginger-bourbon", "Bourbon ginger", "cocktail", ["bourbon", "ginger beer", "lime"], [], 2, "easy", "Mule bones on whiskey."),
  r("campari-orange", "Campari and orange", "cocktail", ["campari", "orange"], [], 1, "easy", "Simplest bitter highball."),
  r("amaro-coffee", "Amaro coffee", "cocktail", ["amaro", "coffee"], [], 2, "easy", "After-dinner on Averna."),
];
