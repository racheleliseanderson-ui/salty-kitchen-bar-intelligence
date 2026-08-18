export const VISION = {
  verdict: "Feasible for MVP and production. Good UX fully mitigates known limits.",
  bar: {
    title: "Bar / spirits — stronger",
    points: [
      "Home Bar Hero already ships multi-bottle scans of up to 10 bottles, with brand, type, and confidence.",
      "YOLO-family shelf detectors report mAP in the low-to-mid 90s; specialized grocery/liquor sets reach the high 90s.",
      "CLIP-style embeddings plus live search improve robustness on limited editions and partial labels.",
      "Glare, craft lookalikes, low light, and occlusion remain the failure modes — confidence thresholds and confirmation fix them.",
    ],
  },
  pantry: {
    title: "Pantry / fridge / produce — usable, more variable",
    points: [
      "Premium AI fridges claim 210–300+ items and ~98% expiry recognition in controlled hardware.",
      "Phone grocery detectors commonly land 80–90%+; refrigerator-scene papers publish mAP@0.5 around 0.87.",
      "Crowded mixed phone scenes drop to roughly 65–75% in the hardest cases.",
      "Dominant failures: similar produce, unlabeled leftovers, dense stacking. Quantity from vision is still weak.",
    ],
  },
  path: [
    "Start with cloud multimodal vision for multi-item detection + OCR, or a fine-tuned YOLO/RT-DETR on public shelf/food sets plus OpenFoodFacts barcodes.",
    "Always surface candidates with confidence and one-tap corrections. Support multi-photo stitching.",
    "Quantities and expiry come from the user, date OCR, or simple rules — not pure vision.",
    "Offline / on-device options are improving and fit the local-first rule.",
  ],
};

export const PAIRING_SOURCES = [
  { name: "FlavorDB / FlavorDB2", detail: "~25,595 flavor molecules; 2,254 linked to ~936 ingredients across 34 categories. Pairing by shared compounds." },
  { name: "FooDB", detail: "~70k+ food constituents, nutrients, PubChem links. CSV / JSON / MySQL dumps." },
  { name: "Supporting sets", detail: "Flavornet, BitterDB, SuperSweet, Fenaroli, ChemTastesDB, odor thresholds, CompKitchen-style GC-MS extraction." },
  { name: "Recipe co-occurrence", detail: "OpenRecipes, public-domain cookbooks, and CC collections for NPMI-style statistics." },
];

export const METHOD_NOTES = [
  "Rank pairs by molecular overlap (Jaccard or IDF-weighted volatiles) blended ~50/50 with recipe co-occurrence.",
  "Add a synergy bonus when both scores are high.",
  "State sources, formulas, and limits: matrix effects, cooking transformations, sparsity, cultural bias.",
  "Constrain any generative layer with these scores so the model cannot invent chemistry.",
  "Licenses: start conservative. Many sources are research / non-commercial until cleared.",
];
