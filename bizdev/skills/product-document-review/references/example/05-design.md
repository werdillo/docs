# 05 — Design

*Small shop's design specification built from `01`–`04` and
[`design/`](../../../design/README.md).*

## Languages and theme

| Deliverable | Design language | Theme / token overrides |
|---|---|---|
| **Shop site** | [`public`](../../../design/languages/public.md) | OpenDesign contract + `public-overrides` (`44 px` touch targets, `4:3` product tiles, warm canvas `--surface-warm`) |
| **Admin** | [`internal`](../../../design/languages/internal.md) | OpenDesign contract (Linear UX × Apple macOS/HIG neutral light/dark palette, dense `32–36 px` controls) |

## Screen map

| Box or process | Screens | Pattern | Who sees it |
|---|---|---|---|
| `browse-catalogue` | The catalogue | `list` | Shopper |
| `shop/products` | A product · add or change, withdraw | `record` · `form` | Shopper · Owner |
| `shop/carts` | The cart, with *sold out* and *withdrawn* on a line (R1, R4) | `record` | Shopper |
| `place-order` | Placing the order, and its result | `flow` | Shopper |
| `shop/stock` | Stock levels, restock | `list` · `form` | Owner |
| `shop/orders` | Orders by state · an order, with *paid* and *cancel* | `list` · `record` | Owner |

## Navigation

- **Shop site:** brand mark, Catalogue, Cart (with item count).
- **Admin:** one domain section `shop` declared in the composition root —
  Orders, Stock, Products.

## Public pages' target queries

Handmade ceramic mugs and bowls by the maker's name (catalogue), and each
piece's name (product page).

## Critical states and copy

- `shop/carts` displays `--danger` badges *Sold out* (R1) and *Withdrawn* (R4)
  verbatim from section 7, with inline *Remove* actions blocking *Place order*.
- *Place order* locks width and switches to *Placing order…* on click (R3).
- *Cancel order* uses a narrow `ConfirmDialog` stating stock return and email
  consequence (*Keep order* / *Cancel order*).
