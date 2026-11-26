# Canvas

How spatial and multi-dimensional workspaces — kanban boards, calendars,
timelines, visual editors and decision dashboards — use wide screen real estate
under the shared header bar without turning into clutter.

## In one minute

- **Same header bar, wide working surface**: keeps the identical workspace frame
  as `list` and `record` while releasing the narrow column constraint.
- **Explicit scroll and zoom boundaries**: sticky column or time headers keep
  orientation fixed; pan/zoom editors declare clear bounds and a *Fit to screen*
  reset.
- **Collapsible right inspector**: clicking a card or node inspects and edits it
  without leaving the spatial view; `Esc` closes it.
- **Keyboard parity for every drag**: every pointer drag has a keyboard
  equivalent so nothing depends on mouse-only manipulation.
- **Dashboard anti-bloat rule**: every widget answers one real decision, capped
  at `4–6` top-level metrics, with zero decorative charts.

## Anatomy and layout

```text
+------------------------------------------------------------------------+
| Orders  14                                    [List | Board]           |  <- Shared header bar
+------------------------------------------------------------------------+
| [All dates]  [+ Filter]                                    [Display v] |  <- Filter bar
+------------------------------------------------------------------------+
|  Placed  4         |  Paid  7           |  Cancelled  3  || Inspector  |
|  ------------------|--------------------|----------------||------------|
|  +---------------+ |  +---------------+ |  +-----------+ || Order #1042|
|  | #1042   £48.00| |  | #1040   £72.00| |  | #1037 £24 | || State:     |
|  | Hannah Cole   | |  | Priya Nair    | |  | Sam Park  | || [Placed v] |
|  | 2 items 15 Nov| |  | 3 items 14 Nov| |  | 1 item    | ||            |
|  +---------------+ |  +---------------+ |  +-----------+ || 2x Mug £48 |
|  +---------------+ |  +---------------+ |                || [Confirm]  |
|  | #1041   £24.00| |  | #1039   £38.00| |                || [Cancel]   |
|  | David Osei    | |  | Maya Lin      | |                ||            |
|  +---------------+ |  +---------------+ |                || [Open full]|
+------------------------------------------------------------------------+
                 Wide working area (100% available width)     Collapsible
                                                              (300-360 px)
```

- **Shared header and filter bar.** A canvas uses the exact same header bar,
  view switch, filter chips and *Display* menu as a [`list`](./list.md)
  ([internal language](../languages/internal.md#few-screen-shapes)). Switching
  between *List* and *Board* preserves every active filter.
- **Wide working area.** Releases the narrow prose cap so board columns
  (`260–320 px` each — orienting signal), calendar tracks or visual nodes use
  the full main viewport width.
- **Declared scroll and zoom boundaries.**
  - *Boards*: horizontal scroll across columns, independent vertical scroll
    inside each column, sticky column headers showing exact counts.
  - *Calendars and timelines*: sticky date/time axis with a *Today* jump button
    and discrete zoom steps (day, week, month).
  - *Visual editors*: bounded 2D pan and zoom with explicit limits (for example
    `25%–400%` — example) and a persistent zoom control with *Fit to screen*
    (`Shift+1` or button) so users never lose their work off-canvas.
- **Collapsible inspector panel.** Selecting a card, event or node opens a
  right-hand inspector (`300–360 px` wide on desktop — orienting signal; bottom
  sheet on mobile) for quick inspection and in-place edits, with an *Open full
  record* link for deep history. `Esc` or the close button collapses the
  inspector without losing scroll position.

## Keyboard navigation and selection

- **Directional focus.** Arrow keys move focus across cards, calendar cells or
  columns; `Enter` opens the inspector or full record; `x` toggles selection;
  `Esc` clears selection or closes the inspector.
- **Keyboard equivalent for every drag.** Moving a card across board columns or
  rescheduling a timeline bar is always reachable via keyboard shortcut or card
  action menu (for example `s` to change state), never pointer-drag only.
- **Consistent bulk selection.** Selecting `1` or more items on a board or
  canvas raises the same floating [bulk action bar](./surfaces.md#bulk-action-bar)
  used on lists.

## Dashboards: the anti-bloat rule

When a canvas renders a monitoring or summary dashboard, strict restraint stops
it from turning into wallpaper:

- **Every widget answers one real decision.** Each metric or table maps directly
  to a scenario or question in the product document. A chart that prompts no
  action is cut.
- **Maximum `4–6` top-level metrics** (orienting signal). Beyond `6` KPI tiles,
  nothing reads as urgent and the eye skips the band. Each metric shows one
  exact figure (`tabular-nums`), its time period, and clicks straight through to
  the filtered [`list`](./list.md) behind it.
- **Plain tables before charts, zero decorative visuals.** Use a `4–8` row
  ranked table or a plain delta number whenever it communicates faster than a
  plot. Never draw 3D charts, unlabelled sparklines, radial gauges or multi-axis
  spaghetti graphs.

## Required states

Every canvas implements all relevant states from
[`process/states.md`](../process/states.md#the-nine-states):

- **Loading.** Past `300 ms` (orienting signal), draw skeleton column tracks or
  widget frames matching the final grid geometry so cards never jump into place.
- **Empty column versus empty canvas.** On a board, an empty column remains
  visible as a valid drop target with count `0` and a subtle muted label; when
  zero records exist across the entire canvas, show a centred first-time
  [empty state](./surfaces.md#empty-state). Filtered-empty keeps the filter bar
  visible with *Clear filters*.
- **Optimistic move and refusal rollback.** Dragging or transitioning a card
  updates its position immediately and rolls back smoothly with a three-part
  [inline banner](./surfaces.md#toast-and-inline-banner) if a business rule
  refuses the transition. Irreversible moves (such as dragging an order to
  *Cancelled*) open a narrow [confirmation dialog](./surfaces.md#dialog) before
  committing.
- **Isolated widget errors.** On a dashboard canvas, a failing query shows an
  inline error and *Retry* inside that widget frame alone — never blanking the
  working widgets beside it.

## Example: Small shop

- **Admin — `shop/orders` board (`canvas` view).** Reached via the *List |
  Board* switch in the `shop/orders` header bar, sharing the same filters. Three
  columns match the Order lifecycle (`placed`, `paid`, `cancelled` —
  [lifecycles](../../bizdev/product-document/example/03-matrix.md#11-lifecycles)):
  - Dragging a card from *Placed* to *Paid* marks the order paid (S4).
  - Dragging a card from *Placed* to *Cancelled* opens the cancellation
    confirmation dialog stating that stock returns and the shopper is emailed
    (S5).
  - Cards in final states (`paid`, `cancelled`) cannot be dragged out; any
    forced transition attempt is refused cleanly.
  - Clicking a card opens the collapsible right inspector with lines, total and
    lifecycle buttons.
- **Admin — Later sales summary (anti-bloat dashboard).** If Small shop adds its
  *Later* sales report
  ([scope](../../bizdev/product-document/example/01-context.md#4-scope)), the
  top row holds `4` actionable metrics — *Unpaid orders over 3 days* (prompts
  S5), *Orders placed this week*, *Paid total this week*, and *Active products
  at 0 stock* (prompts S7) — each linking straight to its filtered list.

## Not this

- Twelve KPI tiles, four donut charts and an animated world map on an admin home
  screen — that is decoration; cap top metrics at `4–6` and tie every widget to
  a decision.
- A drag-and-drop kanban board with no keyboard move command — keyboard and
  assistive-tech users are locked out.
- Dropping a card into an irreversible column (*Cancelled*, *Refunded*) silently
  with no confirmation — confirm irreversible transitions before committing.
- An infinite pan canvas with no zoom bounds or *Fit to screen* button — users
  pan away from their work and get lost.
- Opening a full-page reload every time a user clicks a card to check `2` fields
  — open the collapsible inspector panel and keep the board visible.
