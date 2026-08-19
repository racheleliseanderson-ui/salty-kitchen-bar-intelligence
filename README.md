# Kitchen & Bar Intelligence · Salty & Clever

Daily food + bar layer beside [Occasions](https://occasion.saltnotes.blog). Menu architecture lives inside Occasions (`/architecture`); this app is what is on the shelf, what pairs, and what you can make tonight.

Planning tool, not a safety system. No allergen, nutrition, or pricing claims.

## Surfaces

| Path | Surface |
| --- | --- |
| `/` | Home |
| `/vision` | Scan review (keep / skip / confirm quantity and expiry) |
| `/pairing` | Molecular + co-occurrence explorer, featured and unexpected bridges |
| `/inventory` | Local pantry and bar; optional signed-in household save |
| `/match` | Now / Almost / Smart Buy |
| `/handoff` | Assemble, copy, download Packet 1.0; open Occasions Architecture |
| `/teardown` | Home Bar Hero, Chefs AI, CompKitchen, KitchenPal / SuperCook |

## Product rules

- Inventory is local-first. Household sync is optional and signed-in.
- Vision is review-before-truth. Quantity and expiry are user-owned.
- Pairing is a curated molecular + co-occurrence library, not a live FlavorDB / FooDB extract.
- Packet send is explicit. Occasions stays independent.
- Packet never includes recipes, allergen claims, pricing, or nutrition.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
```

Trust boundary is printed on every page.
