import type { Competitor } from "./types";

export const COMPETITORS: Competitor[] = [
  {
    id: "home-bar-hero",
    name: "Home Bar Hero",
    role: "Strongest bar benchmark",
    food: false,
    bar: true,
    vision: true,
    chemistry: false,
    strengths: [
      "Multi-bottle vision, up to 10 in one frame",
      "Inventory-aware matching with spirit hierarchy",
      "Flavor Lab taste-slider invention",
      "Smart Buy and Party Host Mode",
      "Shared household, generous free tier",
    ],
    limits: [
      "AI credits cap heavy scanning and chat",
      "Classic library is smaller than catalog apps",
      "Poor light still needs confirmation",
      "Food and pantry side is light or absent",
    ],
  },
  {
    id: "chefs-ai",
    name: "Chefs AI",
    role: "Strong food + science benchmark",
    food: true,
    bar: false,
    vision: false,
    chemistry: true,
    strengths: [
      "Live Flavor Harmony Score from a knowledge graph",
      "One-best-addition and expiry-first pantry",
      "Family profiles and dietary conflict warnings",
      "Constrained generation with saved recipes",
    ],
    limits: [
      "Free tier caps recipes",
      "Graph starts small",
      "Little spirits inventory or multi-bottle scanning",
      "Not a unified food + drink product",
    ],
  },
  {
    id: "compkitchen",
    name: "CompKitchen-style",
    role: "Science pure-play",
    food: true,
    bar: false,
    vision: false,
    chemistry: true,
    strengths: [
      "Transparent molecular scoring from papers and databases",
      "High-overlap / low-co-occurrence surprises",
      "Substitute, bridge, and pantry-next-buy tools",
      "Explainable chemistry — brand-fit for Salt Notes",
    ],
    limits: [
      "Smaller ingredient coverage in some builds",
      "Incomplete inventory management",
      "More tool than daily habit",
      "Niche traction",
    ],
  },
  {
    id: "pantry-apps",
    name: "KitchenPal / SuperCook class",
    role: "Leading pantry apps",
    food: true,
    bar: false,
    vision: true,
    chemistry: false,
    strengths: [
      "Barcode and photo entry",
      "Shared lists and basic what-can-I-make",
      "Expiry reminders",
    ],
    limits: [
      "Bad ingredient mapping (ketchup as cheese)",
      "Edits that do not persist",
      "Pantry truth problem — stale inventory",
      "High entry friction, then a paywall",
      "No spirits hierarchy, no chemistry, no cook-down update",
    ],
  },
];

export const GAPS = [
  "Unified food + bar inventory under one system",
  "Vision plus a persistent edit UX that solves pantry truth",
  "Molecular + co-occurrence flavor layer with explanations",
  "Ranking that actually uses expiry and real availability",
  "Optional, explicit, lightweight handoff to Occasions",
  "Local-first, privacy-respecting defaults",
];
