# Kitchen & Bar Intelligence · Salty & Clever (SC-KBI-001)

Validation desk and working prototype for the Kitchen & Bar layer beside [Occasions](https://occasion.saltnotes.blog). Menu architecture now lives inside Occasions (`/architecture`); this desk is the daily food + bar layer.

Educational planning only. No allergen safety, nutrition, or pricing claims.

## Verdicts

| Track | Finding |
| --- | --- |
| Vision | Feasible for MVP. Bar/spirits stronger (mAP low–mid 90s). Pantry usable with review. Confirmation UX is the product. |
| Pairing | Highly feasible. FlavorDB / FooDB + recipe co-occurrence. Hybrid 50/50 Jaccard + NPMI-style overlap, synergy bonus. |
| Inventory + match | Local-first JSON, hierarchical cover, expiry-aware rank, Now / Almost / Smart Buy. |
| Handoff | Availability Packet **1.0** — user-initiated only. Opens Occasions Architecture. No recipes, no guarantees, no silent inference. |
| Field | Own unified food + bar, review-first vision, explainable chemistry, expiry ranking, explicit handoff. |

## Routes

| Path | Surface |
| --- | --- |
| `/` | Report desk |
| `/vision` | Feasibility + scan review (demo scenes; boxes without overlay labels) |
| `/pairing` | Sources + molecular / co-occurrence explorer |
| `/inventory` | Local inventory; optional signed-in household save |
| `/match` | Now / Almost / Smart Buy |
| `/handoff` | Assemble, copy, download Packet 1.0; open Occasions |
| `/teardown` | Home Bar Hero, Chefs AI, CompKitchen, KitchenPal / SuperCook |

## Product rules

- Inventory is local-first. Household sync is optional and signed-in.
- Vision is review-before-truth. Demo scenes stand in for live camera.
- Pairing is a curated FlavorDB-style stand-in, not a live database pull.
- Packet send is explicit. Occasions stays independent.
- Packet never includes recipes, allergen claims, pricing, or nutrition.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
```

Trust boundary is printed on every page.
