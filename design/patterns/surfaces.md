# Surfaces and overlays

How cross-cutting states and floating surfaces — empty states, dialogs, drawers,
popovers, command palettes, bulk action bars, toasts and inline banners — behave
consistently across all six screen shapes.

## In one minute

- **Floating surfaces share one contract**: `--elev-raised` shadow, `--radius-lg`
  corners, `--overlay` backdrop when modal, `Esc` dismisses the topmost layer,
  and focus returns to the trigger on close.
- **Empty states split in two**: *first-time empty* invites creation with one
  CTA; *filtered-empty* explains what matched nothing and offers *Clear filters*.
- **Dialogs sit in the upper third, not dead centre**: narrow confirmation
  dialogs are reserved for irreversible acts; reversible acts execute at once
  and offer a toast with *Undo*.
- **Drawers inspect without losing place**: keep list scroll and filters intact
  for secondary inspection; promote deep editing to a full `record`.
- **Toasts confirm quietly; inline banners hold errors** until resolved.

## Shared overlay behaviour

Every floating surface — dialog, modal drawer, popover and command palette —
obeys four rules (hard limits):

- **Escape closes the topmost layer.** Pressing `Esc` dismisses one overlay at a
  time without closing the screen beneath it.
- **Modal surfaces trap focus.** Tab cycling stays inside an open dialog,
  command palette or modal drawer; closing returns keyboard focus to the exact
  element that opened it.
- **Depth belongs only to what floats.** Floating chrome uses `--elev-raised`,
  `--radius-lg`, and translucent blurred material where supported in internal
  apps ([internal language](../languages/internal.md#the-look)); content
  underneath is never translucent.
- **No stacked modals.** Never open a second modal dialog on top of an existing
  modal dialog; transition inline inside the first dialog or move the task to a
  dedicated screen.

## Empty state

An empty state replaces the body of a [`list`](./list.md) or
[`canvas`](./canvas.md) whenever zero items render, and always distinguishes
between two cases ([states](../process/states.md#the-nine-states)):

```text
First-time empty                          Filtered-empty
+--------------------------------------+  +--------------------------------------+
|                                      |  | [State: Paid x] [Search: bowl x]     |
|        No products on sale yet       |  |--------------------------------------|
|   Add your first piece to open the   |  |                                      |
|              catalogue.              |  |     No orders match these filters    |
|                                      |  |    State: Paid · Search: "bowl"      |
|           [ Add product ]            |  |          [ Clear filters ]           |
+--------------------------------------+  +--------------------------------------+
```

- **First-time empty.** Centred inside the content area with a concise heading
  (display type scale is permitted here in internal apps), `1` sentence stating
  what belongs here, and **one** primary `--accent` CTA. If the current role
  cannot create items here (for example, the Owner viewing `shop/orders` before
  the first sale), omit the CTA and state what will populate the list.
- **Filtered-empty.** Keeps the search input and filter bar visible above it,
  names the active filters or query that matched nothing, and offers **one**
  quiet button: *Clear filters*. Never invite creating a new record solely
  because a filter matched zero items.

## Dialog

A modal box used for focused short forms (`1–5` fields — orienting signal) or
irreversible confirmations.

```text
+------------------------------------------------------------------------+
|  (upper third of viewport, ~12-18% from top)                           |
|             +------------------------------------------+               |
|             | Cancel order #1042?                  [x] |  <- Header    |
|             |------------------------------------------|               |
|             | Cancelling returns 2 stoneware mugs to   |  <- Body on   |
|             | stock and emails the shopper. This       |     --surface |
|             | cannot be undone.                        |               |
|             |------------------------------------------|               |
|             |       [ Keep order ]   [ Cancel order ]  |  <- Footer    |
|             +------------------------------------------+               |
+------------------------------------------------------------------------+
```

- **Upper-third placement.** Position dialogs `12–18%` down from the top of the
  viewport (orienting signal), not vertically centred, so the eye lands directly
  on the title without scanning down and tall content grows downward predictably
  ([internal language](../languages/internal.md#dense)).
- **Clean anatomy.** Header row (title + close button), body (label-and-control
  rows set directly on `--surface` with no nested boxes; a primary name input is
  a large untitled field), and footer (quiet cancel action + verb+object primary
  or destructive button). Width is `480–560 px` for creation/edit dialogs and
  `380–440 px` (narrow) for confirmations (orienting signals).
- **Confirm only irreversible acts.** Reversible actions (archiving, hiding,
  reordering) run immediately and offer a corner toast with *Undo*
  ([internal language](../languages/internal.md#quiet-feedback)). Confirmation
  dialogs are reserved for irreversible consequences (cancelling an order,
  withdrawing a product, deleting an account).
- **Echo both outcomes on buttons.** Never label buttons *No / Yes* or *Cancel /
  OK*; name both sides explicitly (*Keep order* / *Cancel order*, solid
  `--danger` fill on the destructive commit —
  [copy](../process/copy.md#actions-and-buttons)).

## Drawer and sheet

A panel sliding from the right edge (`360–480 px` wide on desktop — orienting
signal) or from the bottom as a full-width sheet below `768 px` (hard mobile
breakpoint).

- **Use for secondary inspection without losing list context.** Inspecting a
  row's summary, adjusting filters on mobile, or editing `1–5` quick properties
  inside a drawer keeps the underlying list's scroll position and filters intact.
- **Promote deep work to a `record` or `form`.** Whenever the content needs
  shareable deep links, multi-section editing, or full activity history, open a
  dedicated [`record`](./record.md) screen instead of cramming an entire
  workspace into a `420 px` strip.

## Popover and command palette

- **Popover.** A compact floating menu or picker (`Filter`, `Display`, status
  picker, date picker) anchored directly to its trigger with `--elev-raised`.
  Every popover menu holding `6` or more options (orienting signal) includes a
  top search input that filters options as you type
  ([internal language](../languages/internal.md#keyboard-first)).
- **Command palette (`⌘K` / `Ctrl+K`).** An internal-app overlay placed in the
  upper third (`540–620 px` wide — orienting signal) that jumps to records and
  runs actions, ranking actions for the current screen first and showing
  keyboard shortcuts right-aligned in `--meta`. Public storefronts never include
  a command palette ([public language](../languages/public.md#not-this)).

## Bulk action bar

A floating pill or bar anchored `16–24 px` above the bottom edge of the viewport
(orienting signal) whenever `1` or more rows in a [`list`](./list.md) or cards
on a [`canvas`](./canvas.md) are selected.

```text
     +---------------------------------------------------------------+
     |  3 selected   |   [ Restock selected ]   [ Withdraw ]   [ x ] |
     +---------------------------------------------------------------+
```

- **Zero layout shift.** Floats above content with `--elev-raised` so selecting
  the first row never pushes rows downward.
- **Scoped to the current selection.** Shows the exact selection count (*3
  selected*), `1–4` actions valid across the selected items (orienting signal),
  and a clear button (`Esc`). Actions invalid for part of the selection are
  omitted or disabled with a short tooltip naming why.

## Toast and inline banner

Choose feedback surfaces by urgency and required action:

| Surface | Placement | Persistence | Use for |
|---|---|---|---|
| **Toast** | Corner (bottom-right or bottom-centre), max `3` stacked (orienting signal) | Auto-dismisses in `5–8 s` (orienting signal), pauses on hover/focus (`aria-live="polite"`) | Quiet completion confirmations and reversible *Undo* offers. |
| **Inline banner** | Directly beside the affected section, line or action | Persists until fixed or explicitly dismissed (`role="alert"` for refusals) | Write refusals, stale/conflict warnings, failed reads with *Try again*, and system notices. |
| **Confirmation dialog** | Upper third, modal | Blocks until explicitly chosen | Irreversible actions requiring conscious consent before execution. |

- **Never put validation or critical errors in a vanishing toast.** A message
  that disappears after `6 s` forces the user to guess what failed; keep every
  actionable error pinned inline beside what failed
  ([states](../process/states.md#the-nine-states)).

## Example: Small shop

- **Empty states.** Admin `shop/products` first-time empty reads *"No products
  on sale yet. Add your first piece to open the catalogue."* + *Add product*.
  Admin `shop/orders` filtered by `State: Paid` with zero matches reads *"No
  paid orders yet."* + *Clear filters*.
- **Confirmation dialog.** Admin *Cancel order #1042* opens a `420 px` upper-third
  dialog: *"Cancelling returns 2 stoneware mugs to stock and emails the shopper.
  This cannot be undone."* with *Keep order* and *Cancel order* (`--danger`).
  Admin *Withdraw product* (S8) uses the same narrow confirmation pattern
  stating *"Withdrawn pieces leave the catalogue immediately and cannot be
  reopened; past orders stay intact."*
- **Bulk action bar.** Selecting `3` active rows in Admin `shop/stock` raises
  the floating bottom bar (*3 selected · Restock selected · Clear*).
- **Toast versus inline banner.** On the Shop site, clicking *Add to cart* shows
  a quiet toast (*"Added to cart · View cart"*); a sold-out line on `shop/carts`
  (R1) renders a persistent inline `--danger` banner directly on that line with
  *Remove*, never a vanishing toast.

## Not this

- Asking *"Are you sure?"* in a modal dialog for a reversible archive or filter
  toggle — execute immediately and offer a toast with *Undo*.
- Putting form validation errors or stock-conflict refusals in a `5 s` corner
  toast that vanishes before the user finishes reading it — pin errors inline.
- Opening a confirmation modal on top of an already open edit dialog — resolve
  inline inside the first dialog or promote the edit flow to a full screen.
- Placing a `⌘K` command palette on a public ceramic storefront — command
  palettes belong to daily internal tools, not first-time shoppers.
- Showing a *Create new* primary button in a filtered-empty state when records
  already exist under different filters — offer *Clear filters*.
