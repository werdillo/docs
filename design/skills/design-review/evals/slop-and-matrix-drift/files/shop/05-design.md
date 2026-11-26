# 05 — Design

## Languages and theme
- `site`: public storefront (mobile touch buttons `32 px` height to stay compact).
- `admin`: internal orders tool (light mode only for launch).

## Screen map
| Box or process | Screen | Pattern |
|---|---|---|
| `products` | Product catalogue | `list` |
| `orders` | Live order queue & order record | `list`, `record` |
| *(new)* | Executive KPI & revenue analytics dashboard | `canvas` |

## Public storefront hero
- Full-bleed purple-to-cyan gradient hero with floating glassmorphic card and placeholder copy ("Lorem ipsum dolor sit amet").
- Followed by a 3-column wall of icon cards: "Fast", "Secure", "Reliable".

## States and copy
- **Orders list:** shows Default, Loading (instant spinner on click), and Empty ("No orders yet — create one", reused when filters return 0 rows). No offline banner needed for the live queue.
- **Product status badge:** shows "Active" and "Archived".
- **Order record actions:** always shows "Confirm payment" and "Cancel order" regardless of order status (clicking on a cancelled order shows `"Error 409: CONFLICT"`).
- **Cancel confirmation dialog:** title "Are you sure?", buttons `Cancel` and `OK`.
