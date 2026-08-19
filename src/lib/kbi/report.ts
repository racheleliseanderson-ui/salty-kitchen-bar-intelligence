export const VISION = {
  verdict:
    "Bar shelves read cleanly. Crowded fridges need your eyes. Confirmation is how inventory stays true.",
  bar: {
    title: "Bar / spirits — stronger",
    points: [
      "Multi-bottle photos return brand, type, and confidence — typically up to about 10 bottles in one frame.",
      "Shelf detectors land in the low-to-mid 90s; liquor-specific sets go higher.",
      "Partial labels and limited editions still benefit from a confirmation pass.",
      "Glare, lookalikes, low light, and occlusion are why nothing becomes inventory until you keep it.",
    ],
  },
  pantry: {
    title: "Pantry / fridge / produce — usable, more variable",
    points: [
      "Packaged grocery typically lands 80–90%+ on a phone photo.",
      "Crowded mixed fridge scenes drop to roughly 65–75% in the hardest cases.",
      "Similar produce, unlabeled leftovers, and dense stacking still need a human pass.",
      "Quantity and expiry are yours — vision does not invent them.",
    ],
  },
  path: [
    "A photo produces candidates with confidence — not inventory.",
    "Keep, skip, or rename before anything is stored.",
    "Quantity and expiry come from you, a date on the package, or a simple rule — never from the image alone.",
    "Low-confidence rows stay skipped until you say otherwise.",
  ],
};

export const PAIRING_SOURCES = [
  {
    name: "FlavorDB / FlavorDB2",
    detail:
      "~25,595 flavor molecules; 2,254 linked to ~936 ingredients across 34 categories. This library uses a curated subset, not a live or licensed extract. Commercial density requires clearance.",
  },
  {
    name: "FooDB",
    detail:
      "~70k+ food constituents, nutrients, PubChem links. CSV / JSON / MySQL dumps. Curated subset only — not a live pull. Same license boundary as FlavorDB for commercial density.",
  },
  {
    name: "Supporting sets",
    detail:
      "Flavornet, BitterDB, SuperSweet, Fenaroli, ChemTastesDB, odor thresholds, and GC-MS literature. Used to ground key odorants in each profile.",
  },
  {
    name: "Recipe co-occurrence",
    detail:
      "OpenRecipes, public-domain cookbooks, and CC collections for NPMI-style statistics. Cultural and regional bias remain — Western and classic bar corpora are still over-represented relative to Levantine, Indian, West African, Mexican, and East Asian practice.",
  },
];

/** Hybrid used by the pairing explorer. */
export const METHOD_NOTES = [
  "Score = hybrid of (A) IDF-weighted molecular Jaccard and (B) recipe co-occurrence, plus a synergy bonus when both are high.",
  "(A) Molecular: IDF-weighted Jaccard on shared volatiles — rare compounds count more than ubiquitous ones (hexanal, ethanol).",
  "(B) Co-occurrence: NPMI-style statistics over open recipe collections and classic pairs (not proprietary menus).",
  "Default blend is 50/50. Sparse profiles lean 35/65 toward co-occurrence so ranking stays useful while chemistry density is incomplete.",
  "Synergy bonus: +0.08 only when IDF molecular > 0.25 AND Recipe co-occurrence > 0.5. Never invents chemistry from one side alone.",
  "Coverage labels (rich / moderate / sparse) mark how dense each profile is.",
  "Sources, formula, data version, and limits are always visible: matrix effects, cooking transformations, sparsity, cultural bias, license constraints.",
  "Any generative suggestion must be constrained by these scores so unsupported pairs cannot be invented.",
  "Match flavorScore uses the same pair table but blends 35% molecular / 65% co-occurrence on required on-hand pairs, so ranking tracks the denser corpus.",
  "Unexpected bridges: high IDF molecular with co-occurrence still below 0.40, ranked by gap then by rarity of shared compounds — chemistry without (yet) a recipe habit. Edge pairs are sensory-plausible experiments, not guarantees.",
];
