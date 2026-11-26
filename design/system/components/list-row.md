# List row, grid column and card tile

Repeats records across the [`list`](../../patterns/list.md) screen shape — as
aligned horizontal rows in internal tools and as aspect-locked card tiles on
public storefronts.

## Anatomy

### Internal list row
- **Container** — full-width CSS Grid row (`min-height: --row-height`, padding
  `--row-px`, bottom hairline `--row-border`).
- **Selection slot** *(optional)* — checkbox visible on hover or when any row
  is selected (`x` key selects the focused row).
- **Primary cell** — record name (`--fg`, medium weight `500`), truncated with
  ellipsis if overlong, left-aligned.
- **Metadata columns** — fixed shared grid tracks across every row; empty cells
  stay empty so following columns never shift; numbers and money right-aligned
  with `tabular-nums`.
- **Status & trailing action** — status [`Badge`](./badge.md) or inline
  control, plus hover/focus overflow `…` menu.

### Public card tile
- **Media frame** — locked aspect ratio (`4:3`, `1:1` or `4:5`, `CLS = 0`),
  rounded `--tile-radius`, `object-fit: cover`.
- **Body** — title (`--fg`, 1–2 lines max), price (`tabular-nums`), and stock
  status (*In stock* / *Sold out*). Whole tile links to the product `record`.

## Variants

| Component | Variants | Role |
|---|---|---|
| `ListRow` | `default` · `compact` · `grouped-header` | Dense internal rows (~20 per laptop viewport); group headers carry group label and exact count. |
| `CardTile` | `4:3` · `1:1` · `4:5` | Public storefront or content grid tiles with locked media aspect ratio. |

## States

1. **Default** — resting `--bg` / `--surface` with `--row-border` hairline.
2. **Hover** — `--surface-hover` fill on internal rows; subtle media zoom
   (`scale(1.02)` via `transform`, `--motion-base`) on public tiles.
3. **Focus** — visible `:focus-visible` ring (`--focus-ring`) on keyboard
   navigation (`↑`/`↓` or `j`/`k`, `Enter` opens).
4. **Selected** — `--surface-selected` tint with full-strength `--fg` text;
   brings up the floating bulk action bar.
5. **Disabled / unavailable** — muted metadata (`--muted`) and explicit
   *Sold out* / *Withdrawn* badge; never a broken link.
6. **Loading** — skeleton matching exact `--row-height` or locked tile ratio
   ([feedback](./feedback.md)).

## Tokens

| Tier | Tokens |
|---|---|
| Contract | `--bg`, `--surface`, `--fg`, `--fg-2`, `--muted`, `--border-soft`, `--focus-ring`, `--radius-lg`, `--space-3`, `--space-4`, `--motion-fast`, `--motion-base` |
| Extensions | `--surface-hover`, `--surface-selected` |
| Component | `--row-height`, `--row-px`, `--row-border`, `--tile-bg`, `--tile-radius` |

## Keyboard and accessibility

- Internal lists support `↑`/`↓` (or `j`/`k`) to move focus, `Enter` to open,
  `x` to toggle row selection, and `Esc` to clear selection.
- Public card tiles wrap the heading in the semantic `<a>` and stretch the
  click area cleanly so screen readers announce one concise link, not five
  repeated ones.
- Every image inside a `CardTile` carries `alt`, `width` and `height`.

## When to use and when not to

- **Use `ListRow`** for internal collections (`shop/orders`, `shop/stock`)
  where scanning and comparing columns matters.
- **Use `CardTile`** when visual recognition (product photography on
  `browse-catalogue`) is the primary decision factor.

## Not this

- Wrapping every internal list row in its own bordered card with drop shadow —
  rows sit in one container separated by `--row-border` hairlines.
- Letting rows have jagged column widths where a missing date shifts the price
  column left.
- Stuffing descriptions, five badges and three buttons onto a public catalogue
  tile.
