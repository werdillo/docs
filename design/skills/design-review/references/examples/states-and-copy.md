# States and microcopy references

Concrete bad-versus-good examples for [screen states](../process/states.md) and
[interface copy](../process/copy.md), drawn from Small shop
([example](../../bizdev/product-document/example/README.md)).

## 1. Error messages (Rules 8, 10)

| Bad | Good | Why |
|---|---|---|
| Toast: *"Error 409: CONFLICT_STOCK_UNDERFLOW"* | Inline banner on `shop/carts`: *"Order could not be placed. Speckled mug has 0 left in stock. Remove it from your cart to continue."* + *Remove* button | Three parts (what failed, why, next step), plain business words, placed beside the failed line instead of a vanishing toast. |
| Inline field: *"Invalid input"* | Inline field: *"Enter a price above £0.00."* | States the exact rule without blaming the user. |
| Toast: *"Oops! Something went sideways :("* | Inline banner: *"Could not load orders. Your connection dropped. Try again."* + *Try again* button | Drops cute filler and gives an immediate recovery action. |

## 2. Empty states: first-time vs filtered (Rule 7)

| Situation | Bad | Good |
|---|---|---|
| Owner opens `shop/products` on day one (0 products exist) | Blank white table with headers and nothing below | Centred `EmptyState` (`first-time`): *"No products on sale yet. Add your first piece to open the catalogue."* + primary *Add product* button. |
| Owner filters `shop/orders` by `State: Paid` and `Date: Today` (0 matches, 14 orders exist) | *"No orders yet!"* (misleading — implies data is gone) | Centred `EmptyState` (`filtered`): *"No paid orders match today's filter."* + secondary *Clear filters* button. |

## 3. Confirmation dialogs vs reversible undo (Rules 9, 22, 33)

| Action | Bad | Good |
|---|---|---|
| Cancelling an unpaid order (irreversible email + stock return) | Modal: *"Are you sure?"* with buttons *Cancel* and *OK* | Narrow `ConfirmDialog`: *"Cancel order #1042?"* — *"Cancelling returns 3 items to stock and emails the shopper."* Buttons: *Keep order* (secondary) and *Cancel order* (`danger`). |
| Changing a filter or archiving a temporary note (reversible) | Full modal confirmation before applying | Apply immediately + `5–8 s` corner toast: *"Note archived."* + *Undo*. |

## 4. Pending commits and double clicks (Rules 4, 5, 32)

- **Bad:** Shopper clicks *Place order* twice on a slow mobile connection; the
  button stays clickable, two requests fire, and the layout shifts when a
  spinner appears.
- **Good:** First click immediately sets `busy="true"` (`aria-busy="true"`),
  locks the button width and changes the label to *Placing order…*. Combined
  with server idempotency (R3), duplicate orders cannot happen visually or in
  code ([button](../system/components/button.md)).

## 5. Stale data and business words (Rules 4, 8)

- **Bad:** A product is *withdrawn* while open in a shopper's cart; the cart
  calls it *"Deleted item"* and silently drops it when the shopper clicks
  *Place order*.
- **Good:** The cart keeps the exact word from section 6 (*Withdrawn*), marks
  the line with a `--danger` badge *Withdrawn* and a *Remove* button, and
  blocks *Place order* with *"Remove withdrawn items to place your order"*
  (R4).

## 6. Loading thresholds (Rule 6)

- **Bad:** Filtering 18 stock items locally takes `25 ms`, yet the list flashes a
  full-page grey spinner on every keystroke.
- **Good:** Under `100 ms`, rows update in place with zero loader. Between
  `100–300 ms`, the previous rows stay visible without flashing. Only past
  `300 ms` does a matching `36 px` row skeleton appear
  ([feedback](../system/components/feedback.md)).
