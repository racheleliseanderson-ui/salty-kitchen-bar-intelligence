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
  {
    name: "FlavorDB / FlavorDB2",
    detail:
      "~25,595 flavor molecules; 2,254 linked to ~936 ingredients across 34 categories. Research / non-commercial baseline. Commercial use requires clearance. KBI uses a curated educational subset only — not a live or licensed extract.",
  },
  {
    name: "FooDB",
    detail:
      "~70k+ food constituents, nutrients, PubChem links. CSV / JSON / MySQL dumps. Curated subset only — not a live pull. Same license boundary as FlavorDB for commercial density.",
  },
  {
    name: "Supporting sets",
    detail:
      "Flavornet, BitterDB, SuperSweet, Fenaroli, ChemTastesDB, odor thresholds, CompKitchen-style GC-MS extraction. Used to ground key odorants in the curated profiles.",
  },
  {
    name: "Recipe co-occurrence",
    detail:
      "OpenRecipes, public-domain cookbooks, and CC collections for NPMI-style statistics. Cultural and regional bias remain — Western and classic bar corpora are still over-represented relative to Levantine, Indian, West African, Mexican, and East Asian practice.",
  },
];

/** Exact hybrid used by the pairing explorer (curated stand-in, not a live database). */
export const METHOD_NOTES = [
  "Score = hybrid of (A) molecular Jaccard and (B) recipe co-occurrence, plus a synergy bonus when both are high.",
  "(A) Molecular: Jaccard on shared volatiles / compounds from the curated FlavorDB/FooDB-style subset.",
  "(B) Co-occurrence: NPMI-style statistics over open recipe collections + curated classic pairs (not proprietary menus).",
  "Default blend is 50/50. Sparse profiles lean 35/65 toward co-occurrence so the explorer stays useful while chemistry density is incomplete.",
  "Synergy bonus: +0.08 only when Molecular Jaccard > 0.25 AND Recipe co-occurrence > 0.5. Never invents chemistry from one side alone.",
  "Coverage labels (rich / moderate / sparse) mark how dense each profile is.",
  "Always state sources, formula, data version, and limits: matrix effects, cooking transformations, sparsity, cultural bias, license constraints.",
  "Any generative layer must be constrained by these scores so the model cannot invent unsupported pairs.",
  "This is a curated, version-pinned stand-in for product exploration. Production density requires cleared licenses and an explicit subset version pin; the scoring formula stays the same.",
];
