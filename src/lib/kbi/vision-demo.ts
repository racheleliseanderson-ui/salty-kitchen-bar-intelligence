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


export const SCENES: DemoScene[] = [
  {
    id: "bar",
    title: "Bar shelf",
    location: "bar_shelf",
    blurb: "Multi-bottle photo. Brand + spirit type + confidence, the Home Bar Hero pattern.",
    lighting: "Angled, some glare on glass",
    detections: [
      d("bar-makers", { label: "Maker's Mark", normalizedName: "bourbon", category: "spirit", location: "bar_shelf", confidence: 0.94, box: { x: 6, y: 18, w: 16, h: 62 } }),
      d("bar-tanqueray", { label: "Tanqueray", normalizedName: "gin", category: "spirit", location: "bar_shelf", confidence: 0.91, box: { x: 24, y: 14, w: 14, h: 68 } }),
      d("bar-campari", { label: "Campari", normalizedName: "campari", category: "spirit", location: "bar_shelf", confidence: 0.88, box: { x: 41, y: 22, w: 15, h: 58 } }),
      d("bar-cointreau", { label: "Cointreau", normalizedName: "cointreau", category: "spirit", location: "bar_shelf", confidence: 0.83, box: { x: 58, y: 20, w: 13, h: 60 } }),
      d("bar-angostura", { label: "Angostura?", normalizedName: "angostura", category: "mixer", location: "bar_shelf", confidence: 0.71, box: { x: 74, y: 28, w: 10, h: 46 } }),
      d("bar-unknown", { label: "Unknown craft", normalizedName: "whiskey", category: "spirit", location: "bar_shelf", confidence: 0.54, box: { x: 86, y: 16, w: 12, h: 66 }, accepted: false }),
    ],
  },
  {
    id: "fridge",
    title: "Open fridge",
    location: "fridge",
    blurb: "Packaged goods hold. Produce and leftovers need the review step.",
    lighting: "Mixed interior LED, occlusion on the door shelf",
    detections: [
      d("fridge-eggs", { label: "Eggs", normalizedName: "eggs", category: "protein", location: "fridge", confidence: 0.9, box: { x: 8, y: 12, w: 28, h: 22 } }),
      d("fridge-milk", { label: "Whole milk", normalizedName: "milk", category: "dairy", location: "fridge", confidence: 0.86, box: { x: 40, y: 8, w: 16, h: 36 } }),
      d("fridge-butter", { label: "Butter", normalizedName: "butter", category: "dairy", location: "fridge", confidence: 0.81, box: { x: 60, y: 14, w: 22, h: 16 } }),
      d("fridge-lemons", { label: "Lemons", normalizedName: "lemon", category: "produce", location: "fridge", confidence: 0.77, box: { x: 8, y: 42, w: 20, h: 20 } }),
      d("fridge-kale", { label: "Kale / greens", normalizedName: "kale", category: "produce", location: "fridge", confidence: 0.64, box: { x: 32, y: 44, w: 30, h: 28 } }),
      d("fridge-leftovers", { label: "Leftovers", normalizedName: "chicken", category: "protein", location: "fridge", confidence: 0.48, box: { x: 68, y: 42, w: 26, h: 32 }, accepted: false }),
    ],
  },
  {
    id: "pantry",
    title: "Pantry shelf",
    location: "pantry",
    blurb: "Labels and barcodes do the work. Open bags still want a tap.",
    lighting: "Even overhead, slight shadow on the lower row",
    detections: [
      d("pantry-pasta", { label: "Spaghetti", normalizedName: "pasta", category: "pantry", location: "pantry", confidence: 0.92, box: { x: 6, y: 16, w: 18, h: 58 } }),
      d("pantry-oil", { label: "Olive oil", normalizedName: "olive oil", category: "pantry", location: "pantry", confidence: 0.89, box: { x: 28, y: 20, w: 12, h: 54 } }),
      d("pantry-tomato", { label: "Crushed tomatoes", normalizedName: "tomato", category: "pantry", location: "pantry", confidence: 0.85, box: { x: 44, y: 28, w: 18, h: 40 } }),
      d("pantry-rice", { label: "Jasmine rice", normalizedName: "rice", category: "pantry", location: "pantry", confidence: 0.8, box: { x: 66, y: 22, w: 16, h: 50 } }),
      d("pantry-beans", { label: "Black beans", normalizedName: "black beans", category: "pantry", location: "pantry", confidence: 0.78, box: { x: 84, y: 34, w: 12, h: 32 } }),
    ],
  },
];

export function cloneScene(scene: DemoScene): DemoScene {
  return {
    ...scene,
    detections: scene.detections.map((det) => ({ ...det })),
  };
}
