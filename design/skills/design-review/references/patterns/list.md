# List

How a collection of records is scanned, filtered, sorted and acted upon — either
as a dense internal grid-list for daily work or as a public catalogue grid for
visitors deciding what to open or buy.

## In one minute

- **Two flavours, one purpose**: internal tools use a dense aligned grid-list
  showing roughly `20` rows on a laptop; public storefronts use a responsive
  card grid with locked image ratios.
- **One shared header bar, one filter bar, one row container** in internal
  systems — hairline separators (`--border-soft`), never stacked cards.
- **Fixed columns, right-aligned numbers**: every column matches its widest
  value; empty cells stay blank so nothing shifts; money and counts align right
  with `tabular-nums`.
- **Pagination or *Load more* by default**: infinite scroll is reserved for
  high-volume internal streams (`500+` items) with no footer.
- **First-time empty invites creation; filtered-empty resets filters.**

## Internal dense grid-list

An internal list shares the workspace frame
([internal language](../languages/internal.md#few-screen-shapes)) and optimises
for fast scanning and keyboard triage.

```text
+------------------------------------------------------------------------+
| Orders  14                                    [List | Board]  [+ New]  |  <- Header bar
+------------------------------------------------------------------------+
| [State: Placed x]  [+ Filter]                              [Display v] |  <- Filter bar
+------------------------------------------------------------------------+
| [ ]  #1042  Hannah Cole        (o) Placed      2 items    £48.00  15 Nov|
|------------------------------------------------------------------------|  <- Hairline (--border-soft)
| [x]  #1041  David Osei         (o) Placed      1 item     £24.00  15 Nov|  <- Selected (--surface-selected)
|------------------------------------------------------------------------|
| [ ]  #1040  Priya Nair         (•) Paid        3 items    £72.00  14 Nov|
+------------------------------------------------------------------------+
              [ 1 selected  |  Confirm payment  |  Cancel  |  Clear ]      <- Floating bulk bar
```

- **Header bar.** Holds the screen title, an exact record count in `--muted`, an
  optional view switch (for example list versus board) on a segmented track, and
  at most **one** primary action (`--accent`) when records are created here
  ([internal language](../languages/internal.md#the-look)).
- **Filter bar.** Displays active filters as removable chips, a *Filter* button
  that opens a type-to-filter popover, and a *Display* menu controlling
  grouping, sort order, visible columns and view mode.
- **Aligned grid rows.** Every row sits inside one container separated by
  `1 px` `--border-soft` hairlines — never separate bordered cards. Each kind
  of value occupies a column as wide as its widest visible value; a missing
  value leaves its cell blank so columns after it stay aligned. Embedded
  controls (such as an inline status select) fill their column width.
- **Row density and typography.** Target `36–44 px` row height (orienting
  signal) so roughly `20` records fit on a `900 px` laptop viewport without
  scrolling (orienting signal). The record's primary name comes first in `--fg`,
  metadata follows in `--muted`, status renders as an icon or compact badge, and
  every number or currency amount aligns right with `tabular-nums`
  ([copy](../process/copy.md#numbers-money-and-dates)).
- **Grouped mode.** When grouped by lifecycle state or another property, each
  group shows a quiet sticky header with its exact count (`Placed · 4`). Empty
  groups collapse or stay hidden unless the user toggles *Show empty groups* in
  *Display*.
- **Keyboard and selection.** `↑`/`↓` or `j`/`k` moves focus between rows,
  `Enter` opens the record, `x` toggles row selection (`--surface-selected`),
  and `Esc` clears selection. Selecting `1` or more rows raises the floating
  [bulk action bar](./surfaces.md#bulk-action-bar).

## Public catalogue grid

A public list serves visitors scanning products or articles on phones first and
desktops second ([public language](../languages/public.md#storefronts-and-content-grids)).

```text
+------------------------------------------------------------------------+
| Ceramics  (18 pieces)                    [In stock only]  [Sort: New v]|  <- Filter & sort bar
+------------------------------------------------------------------------+
| +--------------------+  +--------------------+  +--------------------+ |
| |                    |  |                    |  |                    | |
| |   4:3 photo        |  |   4:3 photo        |  |   4:3 photo        | |  <- Locked ratio
| |                    |  |                    |  |                    | |
| +--------------------+  +--------------------+  +--------------------+ |
| Speckled stoneware      Tall pouring jug        Deep ramen bowl        |  <- Product name
| mug                     £38.00                  £32.00                 |  <- Price (tabular-nums)
| £24.00                  In stock                Sold out               |  <- Stock status
| In stock                                                               |
+------------------------------------------------------------------------+
|                        [ Show more (12 of 18) ]                        |  <- Explicit pagination
+------------------------------------------------------------------------+
```

- **Responsive column count.** `1` column at `360 px`, `2` columns at `768 px`,
  and `3–4` columns inside `--container-max` (`1200–1280 px`) on desktop
  (orienting signals). Nothing scrolls horizontally at `360 px` or `200%` zoom
  (hard limit).
- **Locked aspect ratios.** Every image in a grid declares one explicit ratio
  (`4:3`, `1:1` or `4:5` — hard limit per grid) so every row aligns cleanly and
  Cumulative Layout Shift stays `0`.
- **Maximum four data points per tile.** Image, name, price (`tabular-nums`) and
  availability (*In stock* / *Sold out*) — `4` facts is an orienting signal.
  Full descriptions, dimensions and care instructions belong on the
  [`record`](./record.md#public-record) screen.
- **Clear filter and sort controls.** Filter chips and sort selectors sit
  directly above the grid on desktop and collapse into a single *Filter & sort*
  trigger opening a [sheet](./surfaces.md#drawer-and-sheet) below `768 px`.
  Every interactive tile link, chip and button meets the `44 × 44 px` touch
  minimum with at least `8 px` spacing (hard limit).

## Pagination versus infinite scroll

- **Paginate or offer *Load more* by default.** Page sizes of `20–50` rows for
  internal lists and `12–24` tiles for public catalogues (orienting signals)
  preserve shareable URLs, browser Back scroll restoration, exact total counts
  and footer access.
- **Reserve virtualised infinite scroll for large internal streams.** Use
  virtualised continuous scrolling only on chronological internal logs or feeds
  exceeding `500` items (orienting signal) where rows share a fixed height and
  no footer exists below the list. Public storefronts never use infinite scroll.

## Required states

Every list implements all relevant states from
[`process/states.md`](../process/states.md#the-nine-states):

- **Loading.** Under `100 ms` show nothing; `100–300 ms` hold the existing rows
  while a filter or sort refetches; past `300 ms` draw skeleton rows or cards
  with exact row height and locked image ratios so nothing shifts
  ([timing](../process/states.md#loading-timing-thresholds)).
- **First-time empty versus filtered-empty.** Zero records in the box shows a
  first-time empty state naming what lives here with one primary CTA; zero
  matches for active filters keeps the filter bar visible and offers one-click
  *Clear filters* ([empty state](./surfaces.md#empty-state)).
- **Read error.** Keep the header and filter bar intact, show an inline error
  banner explaining what failed, and offer *Try again* without resetting active
  filters or search queries.
- **No access / lifecycle-hidden rows.** Records a role cannot view are omitted
  by the query; unavailable items that remain visible (such as a *Sold out*
  product in a public catalogue) display an honest muted badge rather than a
  broken button.

## Example: Small shop

- **Admin — `shop/orders` (internal list).** Header bar shows *Orders* and exact
  count (`14`), with no *New order* button because only shoppers place orders
  ([matrix](../../bizdev/product-document/example/03-matrix.md#12-checks-on-paper)).
  Filter chips default to `State: Placed`; *Display* switches between flat list,
  grouped-by-state list and the `canvas` board. Columns: order number, shopper
  name, state badge (`placed`, `paid`, `cancelled`), item count (right-aligned),
  order total in `£` (`tabular-nums`, right-aligned), and placed date
  (`15 Nov 2026`).
- **Admin — `shop/stock` (internal list).** Header bar shows *Stock*, count
  (`18`), and primary button *Restock*. Columns: product name, status badge
  (`on sale`, `withdrawn`), quantity on hand (right-aligned, coloured `--danger`
  at `0` while `on sale`), and last restocked date. Inline *Restock* controls
  are omitted on `withdrawn` rows because withdrawn products cannot be restocked
  (S7).
- **Shop site — `browse-catalogue` (public list).** Responsive `4:3` grid of
  ceramic pieces showing photo, name (*Speckled stoneware mug*), price
  (`£24.00`) and stock status (*In stock* / *Sold out*). Withdrawn products
  never appear in the catalogue (S1, R4).

## Not this

- Wrapping every row of an internal list in its own white card with drop shadows
  — that cuts visible density in half and adds visual noise; use hairlines.
- Left-aligning currency amounts in proportional type — columns lose visual
  comparison; right-align numbers with `tabular-nums`.
- Showing *"No orders yet — create one"* when the user filtered by `State: Paid`
  and got zero matches — that is a filtered-empty state needing *Clear filters*.
- Putting full product descriptions, quantity steppers and three competing
  buttons on every storefront catalogue tile — keep `4` facts on the tile and
  move purchase controls to the `record`.
- Infinite scroll above a storefront footer — visitors can never reach contact
  details or return policies.
