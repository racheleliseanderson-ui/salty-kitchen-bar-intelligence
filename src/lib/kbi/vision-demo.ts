import type { Detection, Location } from "./types";

export interface DemoScene {
  id: string;
  title: string;
  location: Location;
  blurb: string;
  lighting: string;
  detections: Detection[];
}

function d(
  id: string,
  partial: Omit<Detection, "id" | "accepted"> & { accepted?: boolean },
): Detection {
  return { id, accepted: partial.accepted ?? true, ...partial };
}

/**
 * Review-first vision demos aligned to the denser SEED_VERSION 7 household.
 * Boxes only — no overlay labels in the product UI. Confidence drives the
 * accept/reject step; low-confidence items stay rejected by default.
 */
export const SCENES: DemoScene[] = [
  {
    id: "bar",
    title: "Bar shelf",
    location: "bar_shelf",
    blurb: "Multi-bottle photo. Brand, spirit type, and confidence. Glare and similar shapes still need a human pass.",
    lighting: "Angled, some glare on glass",
    detections: [
      d("bar-makers", { label: "Maker's Mark", normalizedName: "bourbon", category: "spirit", location: "bar_shelf", confidence: 0.94, box: { x: 4, y: 16, w: 12, h: 64 } }),
      d("bar-rittenhouse", { label: "Rittenhouse Rye", normalizedName: "rye", category: "spirit", location: "bar_shelf", confidence: 0.9, box: { x: 17, y: 14, w: 11, h: 66 } }),
      d("bar-tanqueray", { label: "Tanqueray", normalizedName: "gin", category: "spirit", location: "bar_shelf", confidence: 0.91, box: { x: 29, y: 12, w: 11, h: 68 } }),
      d("bar-titos", { label: "Tito's", normalizedName: "vodka", category: "spirit", location: "bar_shelf", confidence: 0.89, box: { x: 41, y: 14, w: 11, h: 66 } }),
      d("bar-espolon", { label: "Espolón Blanco", normalizedName: "tequila", category: "spirit", location: "bar_shelf", confidence: 0.87, box: { x: 53, y: 18, w: 11, h: 62 } }),
      d("bar-campari", { label: "Campari", normalizedName: "campari", category: "spirit", location: "bar_shelf", confidence: 0.88, box: { x: 65, y: 20, w: 10, h: 58 } }),
      d("bar-cointreau", { label: "Cointreau", normalizedName: "cointreau", category: "spirit", location: "bar_shelf", confidence: 0.83, box: { x: 76, y: 18, w: 10, h: 60 } }),
      d("bar-angostura", { label: "Angostura?", normalizedName: "angostura", category: "mixer", location: "bar_shelf", confidence: 0.71, box: { x: 87, y: 28, w: 8, h: 44 } }),
      d("bar-unknown", { label: "Unknown craft", normalizedName: "whiskey", category: "spirit", location: "bar_shelf", confidence: 0.52, box: { x: 92, y: 16, w: 7, h: 64 }, accepted: false }),
      d("bar-rum", { label: "Plantation Rum", normalizedName: "rum", category: "spirit", location: "bar_shelf", confidence: 0.86, box: { x: 5, y: 78, w: 12, h: 18 } }),
      d("bar-mezcal", { label: "Del Maguey?", normalizedName: "mezcal", category: "spirit", location: "bar_shelf", confidence: 0.68, box: { x: 20, y: 78, w: 11, h: 18 } }),
    ],
  },
  {
    id: "fridge",
    title: "Open fridge",
    location: "fridge",
    blurb: "Packaged goods hold. Produce, soft cheese, and leftovers need the review step — confidence drops on occlusion and similar greens.",
    lighting: "Mixed interior LED, occlusion on the door shelf",
    detections: [
      d("fridge-eggs", { label: "Eggs", normalizedName: "eggs", category: "protein", location: "fridge", confidence: 0.91, box: { x: 6, y: 10, w: 22, h: 18 } }),
      d("fridge-milk", { label: "Whole milk", normalizedName: "milk", category: "dairy", location: "fridge", confidence: 0.88, box: { x: 30, y: 6, w: 14, h: 32 } }),
      d("fridge-butter", { label: "Butter", normalizedName: "butter", category: "dairy", location: "fridge", confidence: 0.84, box: { x: 48, y: 12, w: 18, h: 14 } }),
      d("fridge-yogurt", { label: "Greek yogurt", normalizedName: "yogurt", category: "dairy", location: "fridge", confidence: 0.82, box: { x: 70, y: 8, w: 14, h: 20 } }),
      d("fridge-feta", { label: "Feta", normalizedName: "feta", category: "dairy", location: "fridge", confidence: 0.79, box: { x: 6, y: 32, w: 16, h: 14 } }),
      d("fridge-mozz", { label: "Fresh mozzarella", normalizedName: "mozzarella", category: "dairy", location: "fridge", confidence: 0.76, box: { x: 24, y: 32, w: 18, h: 14 } }),
      d("fridge-lemons", { label: "Lemons", normalizedName: "lemon", category: "produce", location: "fridge", confidence: 0.8, box: { x: 48, y: 34, w: 16, h: 16 } }),
      d("fridge-limes", { label: "Limes", normalizedName: "lime", category: "produce", location: "fridge", confidence: 0.78, box: { x: 66, y: 34, w: 14, h: 14 } }),
      d("fridge-kale", { label: "Kale / greens", normalizedName: "kale", category: "produce", location: "fridge", confidence: 0.63, box: { x: 6, y: 52, w: 28, h: 26 } }),
      d("fridge-mint", { label: "Mint?", normalizedName: "mint", category: "herb", location: "fridge", confidence: 0.58, box: { x: 38, y: 54, w: 14, h: 18 } }),
      d("fridge-avocado", { label: "Avocado", normalizedName: "avocado", category: "produce", location: "fridge", confidence: 0.72, box: { x: 56, y: 56, w: 14, h: 16 } }),
      d("fridge-leftovers", { label: "Leftovers", normalizedName: "chicken", category: "protein", location: "fridge", confidence: 0.46, box: { x: 74, y: 52, w: 22, h: 28 }, accepted: false }),
      d("fridge-salmon", { label: "Salmon fillet", normalizedName: "salmon", category: "protein", location: "fridge", confidence: 0.81, box: { x: 4, y: 78, w: 30, h: 16 } }),
      d("fridge-tofu", { label: "Tofu?", normalizedName: "tofu", category: "protein", location: "fridge", confidence: 0.62, box: { x: 40, y: 80, w: 18, h: 14 } }),
    ],
  },
  {
    id: "pantry",
    title: "Pantry shelf",
    location: "pantry",
    blurb: "Labels and barcodes do the work. Open bags and similar cans still want a tap.",
    lighting: "Even overhead, slight shadow on the lower row",
    detections: [
      d("pantry-pasta", { label: "Spaghetti", normalizedName: "pasta", category: "pantry", location: "pantry", confidence: 0.93, box: { x: 4, y: 14, w: 14, h: 56 } }),
      d("pantry-oil", { label: "Olive oil", normalizedName: "olive oil", category: "pantry", location: "pantry", confidence: 0.9, box: { x: 20, y: 18, w: 10, h: 52 } }),
      d("pantry-tomato", { label: "Crushed tomatoes", normalizedName: "tomato", category: "pantry", location: "pantry", confidence: 0.86, box: { x: 32, y: 26, w: 14, h: 38 } }),
      d("pantry-rice", { label: "Jasmine rice", normalizedName: "rice", category: "pantry", location: "pantry", confidence: 0.82, box: { x: 48, y: 20, w: 14, h: 48 } }),
      d("pantry-beans", { label: "Black beans", normalizedName: "black beans", category: "pantry", location: "pantry", confidence: 0.8, box: { x: 64, y: 30, w: 10, h: 30 } }),
      d("pantry-chickpeas", { label: "Chickpeas", normalizedName: "chickpeas", category: "pantry", location: "pantry", confidence: 0.79, box: { x: 76, y: 30, w: 10, h: 30 } }),
      d("pantry-tahini", { label: "Tahini", normalizedName: "tahini", category: "pantry", location: "pantry", confidence: 0.74, box: { x: 88, y: 22, w: 10, h: 42 } }),
      d("pantry-miso", { label: "White miso", normalizedName: "miso", category: "condiment", location: "pantry", confidence: 0.71, box: { x: 4, y: 72, w: 16, h: 18 } }),
      d("pantry-soy", { label: "Soy sauce", normalizedName: "soy sauce", category: "condiment", location: "pantry", confidence: 0.85, box: { x: 24, y: 70, w: 10, h: 22 } }),
      d("pantry-stock", { label: "Chicken stock", normalizedName: "stock", category: "pantry", location: "pantry", confidence: 0.77, box: { x: 38, y: 68, w: 18, h: 22 } }),
    ],
  },
  {
    id: "freezer",
    title: "Freezer drawer",
    location: "freezer",
    blurb: "Frost and opaque bags lower confidence. Labels help when visible; bulk produce is review-first.",
    lighting: "Cold white LED, frost on the bag seals",
    detections: [
      d("freezer-shrimp", { label: "Frozen shrimp", normalizedName: "shrimp", category: "protein", location: "freezer", confidence: 0.81, box: { x: 8, y: 18, w: 28, h: 28 } }),
      d("freezer-peas", { label: "Frozen peas", normalizedName: "peas", category: "produce", location: "freezer", confidence: 0.76, box: { x: 42, y: 16, w: 24, h: 26 } }),
      d("freezer-berries", { label: "Mixed berries", normalizedName: "berries", category: "produce", location: "freezer", confidence: 0.72, box: { x: 70, y: 20, w: 24, h: 24 } }),
      d("freezer-bread", { label: "Sourdough loaf", normalizedName: "bread", category: "pantry", location: "freezer", confidence: 0.68, box: { x: 10, y: 52, w: 36, h: 28 } }),
      d("freezer-corn", { label: "Frozen corn", normalizedName: "corn", category: "produce", location: "freezer", confidence: 0.7, box: { x: 52, y: 54, w: 22, h: 24 } }),
      d("freezer-unknown", { label: "Unlabeled bag", normalizedName: "chicken", category: "protein", location: "freezer", confidence: 0.41, box: { x: 78, y: 52, w: 18, h: 30 }, accepted: false }),
    ],
  },
  {
    id: "produce",
    title: "Counter produce",
    location: "fridge",
    blurb: "Loose produce without packaging. Shape and color do most of the work; soft herbs and similar greens still need confirmation.",
    lighting: "Natural window light from the left",
    detections: [
      d("prod-lemons", { label: "Lemons", normalizedName: "lemon", category: "produce", location: "fridge", confidence: 0.88, box: { x: 10, y: 28, w: 22, h: 24 } }),
      d("prod-limes", { label: "Limes", normalizedName: "lime", category: "produce", location: "fridge", confidence: 0.85, box: { x: 36, y: 32, w: 18, h: 20 } }),
      d("prod-avocado", { label: "Avocado", normalizedName: "avocado", category: "produce", location: "fridge", confidence: 0.8, box: { x: 58, y: 30, w: 16, h: 22 } }),
      d("prod-tomato", { label: "Tomatoes", normalizedName: "tomato", category: "produce", location: "fridge", confidence: 0.83, box: { x: 78, y: 34, w: 16, h: 18 } }),
      d("prod-garlic", { label: "Garlic", normalizedName: "garlic", category: "produce", location: "fridge", confidence: 0.74, box: { x: 12, y: 58, w: 14, h: 14 } }),
      d("prod-onion", { label: "Onion", normalizedName: "onion", category: "produce", location: "fridge", confidence: 0.79, box: { x: 32, y: 56, w: 18, h: 20 } }),
      d("prod-ginger", { label: "Ginger", normalizedName: "ginger", category: "produce", location: "fridge", confidence: 0.7, box: { x: 56, y: 60, w: 14, h: 14 } }),
      d("prod-herbs", { label: "Soft herbs?", normalizedName: "parsley", category: "herb", location: "fridge", confidence: 0.55, box: { x: 76, y: 58, w: 16, h: 20 }, accepted: false }),
    ],
  },
];

export function cloneScene(scene: DemoScene): DemoScene {
  return {
    ...scene,
    detections: scene.detections.map((det) => ({ ...det })),
  };
}
