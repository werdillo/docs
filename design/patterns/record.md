# Record

How a single item is inspected, edited and moved through its lifecycle — either
as an internal split-column workspace or as a public product detail page.

## In one minute

- **Internal records split into two columns under one header bar**: breadcrumb +
  prev/next + `…` menu on top; editable title, content and activity on the left;
  white property cards on the `--bg` canvas on the right.
- **Edit in place wherever safe**: titles, notes, statuses and relations update
  directly on the record without opening a separate form page.
- **Lifecycle controls match allowed moves only**: actions forbidden by the
  current state disappear instead of failing after a click.
- **Public records pair a locked-ratio media gallery with a calm buy-box**:
  title, price, honest stock status, one `--accent` CTA and trust terms above
  the fold, structured details below.
- **Missing, withdrawn and stale records explain themselves clearly** and offer
  one direct next step.

## Internal record

An internal record opens from a [`list`](./list.md) or the command palette and
keeps the parent list one step away
([internal language](../languages/internal.md#few-screen-shapes)).

```text
+------------------------------------------------------------------------+
| Orders / #1042                      [< Prev] [Next >]  [Confirm] [...] |  <- Header bar
+------------------------------------------------------------------------+
|                                               |  +------------------+  |
|  Order #1042                                  |  | State   [Placed] |  |  <- White card
|  Placed 15 Nov 2026 · Bank transfer           |  | Placed   15 Nov  |  |     on --bg
|                                               |  +------------------+  |
|  Lines                                        |                        |
|  Speckled stoneware mug   x2  £24.00   £48.00 |  +------------------+  |
|  -------------------------------------------- |  | Shopper          |  |
|  Total                                 £48.00 |  | Hannah Cole      |  |
|                                               |  | hannah@mail.test |  |
|  Activity                                     |  +------------------+  |
|  * Confirmation email sent        15 Nov 14:12|                        |
|  * Order placed by shopper        15 Nov 14:12|  +------------------+  |
|  [ Add internal note...                     ] |  | Actions          |  |
|                                               |  | [Cancel order]   |  |
|                                               |  +------------------+  |
+------------------------------------------------------------------------+
                 Main column (1fr)                  Properties (280-340px)
```

- **Header bar.** Holds a breadcrumb returning to the parent list with its
  active filters intact, previous/next steppers moving through that same list,
  the primary lifecycle action (`--accent`) when one exists, and a single `…`
  overflow menu for secondary or destructive actions.
- **Main column.** Opens with the record's title edited in place (where the
  subject allows renaming; immutable identifiers such as `#1042` stay
  read-only), followed by its primary content (structured lines, description or
  media) capped at `65–75 ch` for prose blocks (orienting signal). Below the
  content sits the chronological **activity and history** feed — system
  transitions and comments — using relative timestamps with exact timestamp
  tooltips ([copy](../process/copy.md#numbers-money-and-dates)).
- **Right properties panel.** Fixed `280–340 px` wide on desktop, stacking below
  the main column below `960 px` (orienting signals). Its grouped sections are
  white `--surface` cards on the `--bg` canvas — the one sanctioned exception to
  "hairlines, not boxes" ([internal language](../languages/internal.md#calm)).
  Each row pairs a muted label on the left with an in-place editable control on
  the right (status, owner, dates, relations), displaying its single-letter
  keyboard shortcut in its tooltip.
- **Instant feedback on low-risk edits.** Renaming, toggling a property or
  adding a note updates optimistically and rolls back with an inline error on
  refusal; deliberate lifecycle transitions (*Confirm payment*, *Cancel order*)
  use explicit buttons and confirmation where irreversible.

## Public record

A public record (such as a storefront product page) answers every buying
question cleanly on a `360 px` phone first and expands to a two-column split at
`960 px` and above (orienting signal).

```text
+------------------------------------------------------------------------+
| Catalogue / Speckled stoneware mug                                     |  <- Breadcrumb
+------------------------------------------------------------------------+
| +--------------------------------+  Speckled stoneware mug             |
| |                                |  £24.00                             |
| |       4:3 main photo           |  In stock                           |
| |                                |                                     |
| |                                |  Qty  [-] 1 [+]                     |
| +--------------------------------+  [        Add to cart        ]      |  <- Primary (--accent)
| [img1] [img2] [img3]                Paid by bank transfer after        |  <- Trust signal
|                                     placing. Dispatches within 3 days. |
+------------------------------------------------------------------------+
| About this piece                                                       |
| Wheel-thrown stoneware glazed in matte oat with iron speckles.         |
| Dimensions: 9 cm tall x 8 cm wide (320 ml). Dishwasher safe.           |
+------------------------------------------------------------------------+
```

- **Media gallery.** Main frame locks an explicit aspect ratio (`4:3` or `1:1` —
  hard limit for zero layout shift). Thumbnails below or beside the main frame
  switch images by click or arrow keys without auto-playing carousels
  ([public language](../languages/public.md#not-this)).
- **Buy-box.** Holds the `h1` title, price (`tabular-nums`), honest stock status
  (*In stock* / *Sold out*), optional quantity stepper (`44 × 44 px` touch
  targets — hard limit), **one** primary `--accent` action (*Add to cart*), and
  short payment/delivery terms directly underneath. Adding to the cart gives
  quiet immediate confirmation (updating the cart count and offering *View
  cart*) without hijacking scroll position.
- **Structured description.** Prose stays within `45–75 ch` (orienting signal);
  key specifications (dimensions, materials, care) sit in plain key-value rows
  rather than buried inside long paragraphs.

## Required states

Every record implements all relevant states from
[`process/states.md`](../process/states.md#the-nine-states):

- **Loading.** Past `300 ms` (orienting signal), draw a skeleton preserving the
  exact two-column split, media aspect ratio and reserved height for
  below-the-fold activity so nothing jumps as sections settle.
- **Not found (`404`), withdrawn or deleted.** Never render a blank frame or a
  raw status code. A missing record states *"Order #1099 was not found"* with a
  direct button back to its parent list. On a public storefront, a direct link
  to a `withdrawn` product renders the piece clearly marked *Withdrawn — no
  longer for sale*, omits *Add to cart* (R4), and offers *Browse catalogue*.
- **Error and refusal.** A failed read shows an inline error message and *Try
  again* while keeping the breadcrumb intact. A refused action (for example,
  confirming payment on an order cancelled seconds earlier, S4) displays a
  persistent three-part [inline banner](./surfaces.md#toast-and-inline-banner)
  next to the action naming what failed, why and what to do next
  ([copy](../process/copy.md#three-part-error-messages)).
- **Stale / conflict.** When another session changes the record while it is
  open, display an inline banner stating what changed (*"Order state changed to
  cancelled"*) with a *Reload record* trigger rather than silently overwriting
  the newer state.
- **Lifecycle-bound actions.** Actions forbidden by the current state are
  removed cleanly. On an order in a final state (`paid` or `cancelled`), neither
  *Confirm payment* nor *Cancel order* appears.

## Example: Small shop

- **Admin — `shop/orders` record.** Header shows *Orders / #1042*, prev/next
  arrows, *Confirm payment* (`--accent`, visible only while `placed`), and `…`
  menu. Main column lists each order line at the exact price fixed when placed
  (R2) and the activity log (*Placed*, *Email sent*, *Marked paid*). Right
  properties panel holds white cards for *State*, *Shopper*, *Payment method*
  (`Bank transfer`) and *Cancel order* (visible only while `placed`; triggers a
  narrow [confirmation dialog](./surfaces.md#dialog) explaining that stock
  returns and the shopper is emailed, S5).
- **Shop site — `shop/products` page.** Left `4:3` ceramic photo gallery; right
  buy-box with *Speckled stoneware mug*, `£24.00`, *In stock*, *Add to cart*,
  and *"Paid by bank transfer after placing"*. When stock reaches `0`, the
  status reads *Sold out* and *Add to cart* is replaced by plain muted text
  stating the piece is currently unavailable.
- **Shop site — `shop/carts` record.** Lists every open cart line with live
  prices (R2), quantity steppers and *Remove*. Any line whose product sold out
  (R1) or was withdrawn (R4) shows an inline `--danger` badge (*Sold out* /
  *Withdrawn*) and blocks progression into `place-order` with an inline message
  directly beside *Place order* explaining which line to remove.

## Not this

- Showing *Cancel order* and *Confirm payment* on a `paid` or `cancelled` order
  only to reject the click with an error — hide transitions the lifecycle
  forbids.
- Wrapping every block of the main column in separate shadowed cards — only the
  internal right properties panel uses white cards on `--bg`.
- Opening a full edit page to change one status dropdown or title — edit single
  properties in place on the record.
- Hiding payment terms and delivery windows in a footer link far away from *Add
  to cart* — trust signals sit directly under the primary decision.
- Deleting a withdrawn product's URL into a dead `404` when past orders still
  reference it — keep the record readable in its `withdrawn` state (S8).
