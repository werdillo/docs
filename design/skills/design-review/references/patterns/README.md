# Patterns

How canonical screen shapes and cross-cutting surfaces are structured across a
product, so every screen starts from a known recipe instead of a blank frame.
Every screen in a product belongs to one of six shapes; cross-cutting states and
floating overlays sit beside them in [`surfaces.md`](./surfaces.md).

## The six shapes and shared surfaces

| File | What it holds |
|---|---|
| [`list.md`](./list.md) | **List** — scanning, filtering, sorting and acting on a collection, as an internal grid-list or a public catalogue grid. |
| [`record.md`](./record.md) | **Record** — inspecting and editing one item, as an internal split-column workspace or a public product page. |
| [`form.md`](./form.md) | **Form** — single-column creation and multi-field editing, validation timing, dirty-state protection, and dialog vs page thresholds. |
| [`settings.md`](./settings.md) | **Settings** — narrow label-and-control rows, auto-save versus explicit save, and an isolated danger zone. |
| [`canvas.md`](./canvas.md) | **Canvas** — wide spatial workspaces for boards, calendars, timelines, editors and anti-bloat dashboards. |
| [`flow.md`](./flow.md) | **Flow** — multi-step processes spanning boxes, review before commit, idempotent submit and failure recovery. |
| [`surfaces.md`](./surfaces.md) | **Surfaces and overlays** — empty states, dialogs, drawers, popovers, command palettes, bulk action bars, toasts and inline banners. |

## Internal systems versus public sites

- **An internal system uses four shapes.** Admin tools and back offices build
  their screens from `list`, `record`, `settings` and `canvas` inside one shared
  frame ([few screen shapes](../languages/internal.md#few-screen-shapes)). Short
  edits happen in place on a `record` or inside a `dialog`
  ([surfaces](./surfaces.md#dialog)); a dedicated `form` page is added only when
  creation or editing outgrows a dialog ([form](./form.md#form-page-versus-dialog-versus-in-place-edit)).
- **Public sites and cross-box processes add `form` and `flow`.** A storefront
  uses `list` for its catalogue, `record` for a product or cart, and `flow` for
  multi-step commits such as checkout
  ([public language](../languages/public.md#storefronts-and-content-grids)).
- **Every shape covers all nine states.** A pattern defines the resting layout
  and its specific edge cases; the full nine-state contract lives in
  [`process/states.md`](../process/states.md#the-nine-states) and applies to
  every screen without exception.

## How a design spec picks from these names

A product's design file (`05-design.md`) lists every screen to design in its
*Screen map* table and picks verbatim from these six pattern names in its
*Pattern* column ([from matrix](../process/from-matrix.md#specification-before-code)). A
screen that appears to need a seventh shape signals either two subjects mixed on
one screen or a missing recipe to settle here — never a one-off layout invented
inside a product folder.

| Need on the screen | Canonical shape |
|---|---|
| Browse, filter or select many records of one subject | `list` |
| Inspect, edit or advance the lifecycle of one record | `record` |
| Create or edit a multi-group payload (`6+` fields — orienting signal) | `form` |
| Configure workspace, account or system preferences | `settings` |
| Arrange records spatially (board, calendar, timeline) or monitor `4–6` KPIs | `canvas` |
| Complete a sequenced process spanning multiple boxes (`3–5` steps — orienting signal) | `flow` |

## Example: Small shop

Small shop's [design spec](../../bizdev/product-document/example/05-design.md#screen-map)
maps every box and process onto four of the six shapes across its two
deliverables:

| Box or process | Deliverable | Screen | Pattern |
|---|---|---|---|
| `browse-catalogue` | Shop site | The catalogue | [`list`](./list.md) (public) |
| `shop/products` | Shop site · Admin | Product page · add or change | [`record`](./record.md) (public) · [`form`](./form.md) |
| `shop/carts` | Shop site | The cart with *sold out* and *withdrawn* states | [`record`](./record.md) (public) |
| `place-order` | Shop site | Placing the order and confirmation | [`flow`](./flow.md) |
| `shop/stock` | Admin | Stock levels · restock | [`list`](./list.md) (internal) · [`form`](./form.md) / dialog |
| `shop/orders` | Admin | Orders by state · single order | [`list`](./list.md) (internal) · [`record`](./record.md) (internal) |

## Not this

- Naming a screen *"dashboard-v2"*, *"hub"* or *"overview"* in `05-design.md`
  — pick one of the six canonical shapes so layout and behaviour are decided up
  front.
- Mixing a full settings panel, a creation form and a list onto one cluttered
  screen — split by subject and give each screen one shape.
- Inventing a custom modal or alert banner per box — floating overlays come from
  [`surfaces.md`](./surfaces.md) so focus, dismissal and copy stay identical
  everywhere.
