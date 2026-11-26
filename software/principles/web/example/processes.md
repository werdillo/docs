# Processes

## 4. Checkout: the first process

Placing an order reads the cart, prices it, takes the stock, writes the order
and closes the cart — four boxes, in an order, and it must not half-apply.
Inside `orders` it would import `carts`, `stock` and `products`, and `stock`
would soon need to tell `carts` that a line sold out: a cycle on the way. Those
are the signals ([late, on a signal](../structure/processes.md#late-on-a-signal)),
so the line gets a folder of its own:

```
api/src/shop/_processes/place-order/
  index.ts  router.ts  types.ts
  routes.ts       ← POST /carts/{id}/place belongs to the process
  handlers.ts     ← reads the request, calls the line, answers
  line.ts         ← the line
  freeze.ts       ← copies cart lines and prices onto the order
```

Each box hands over the statements of its step and runs nothing — its writes,
and the **guards** on its own data that must still hold when they land. The
process reads first, then runs every statement in one batch
([why a batch](../stack/where-it-shows.md#where-the-stack-shows-through)):

```ts
// shop/carts/services.ts — carts' step: still open, then closed
export function closeCartStatements(db: Db, cartId: string): Statement[] {
  // The guard is what makes a second click on "place" fail: the read before the batch saw the cart open too.
  return [guard(db, isOpen(cartId), CART_CLOSED), markOrdered(db, cartId)];
}

// shop/stock/services.ts — stock's step: still there, then taken
export function takeStatements(db: Db, lines: Line[]): Statement[] {
  return lines.flatMap((line) => [guard(db, inStock(line), SOLD_OUT), takeStock(db, line)]);
}
```

`guard` is a helper from `core/data` that turns a SQL condition and a marker
into a batch statement, rolling the batch back with that marker when the
condition fails ([how a guard works](../stack/where-it-shows.md#how-a-guard-works)).

```ts
// shop/_processes/place-order/line.ts
import { CART_CLOSED, closeCartStatements, readCart } from "#/shop/carts";
import { placedStatements } from "#/shop/orders";
import { pricesOf } from "#/shop/products";
import { moveAdjustmentsStatements } from "#/shop/shared/ledger";
import { SOLD_OUT, takeStatements } from "#/shop/stock";
import { freeze } from "./freeze";

export async function placeOrder(db: Db, cartId: string): Promise<Outcome<{ orderId: string }>> {
  const cart = await readCart(db, cartId);
  if (!cart) return refuse("not_found", "No such cart");
  if (cart.status !== "open") return refuse("cart_closed", "This cart has already been placed");
  const prices = await pricesOf(db, cart.lines.map((line) => line.productId));
  // The price is fixed here, at the read; the guards below check the cart and the stock.
  const gone = cart.lines.find((line) => !prices.has(line.productId));
  if (gone) return refuse("product_unavailable", `${gone.title} is no longer sold`);
  // The lines are copied in, so the order reads the same after a product changes.
  const order = freeze(cart, prices);
  try {
    await db.batch([
      ...closeCartStatements(db, cartId),
      ...takeStatements(db, cart.lines),
      ...placedStatements(db, order),
      ...moveAdjustmentsStatements(db, cartId, order.id),
    ]);
  } catch (error) {
    // Nothing was written. A failed guard says why, and the answer is the shopper's to act on.
    if (isGuardFailure(error, CART_CLOSED)) return refuse("cart_closed", "This cart has already been placed");
    if (isGuardFailure(error, SOLD_OUT)) return refuse("out_of_stock", "Something in the cart has just sold out");
    throw error;
  }
  return ok({ orderId: order.id });
}
```

404 is only for a cart that is not there; a cart that is there and closed is
a conflict, and the guard answers the same 409, so the first click and the
second tell the same story.

The ledger is a box inside `shop/shared`; it exports the statement, not an
action that runs it, so the line can put it in the same batch. Its part is in
the domain's list with the boxes' parts, so its tables are erased with the
tenant's like any other.

The price is fixed at the read, and the cart lines are the lines at the read. A
product gone at the read is refused by name; one that disappears after the read
does not cancel the order, because the line froze its title and price. The
guards protect only what must still hold at write time — the cart is open, the
stock is enough. If the line set must be exact, the cart carries a version and
the guard checks it; this example does not need that.

The reads before the batch decide what to try; the guards inside it decide
whether it lands. Two placements of one cart both read it open, and only the
first gets past `CART_CLOSED` — the race is answered by a guard, as racing
writes must be
([racing writes](../architecture/data.md#atomic-writes-are-one-transaction-racing-writes-are-versioned)).
A failure a fresh read could cure — an order number another checkout took a
moment before — is retried from the reads instead of refused.

The imports from the line's boxes are the participants — `carts`, `orders`,
`products`, `stock` — and none of those boxes names the process. Each name comes
through its box's door, so the doors grow by what the line uses: `orders`' door
now exports `placedStatements` too, from its `commands.ts` — it writes. A refusal is a value, not an exception
([say no with a value](../architecture/contracts.md#say-no-with-a-value)).

### What the new process changed

The import from step 2 — `carts` asking `products` for a price — stays: `priceOf`
is a query, and a query may be called through a door
([commands](../structure/processes.md#a-boxs-commands-are-called-only-by-a-process)).
What the process changed is the writes. Closing the cart and recording the
order are commands of `carts` and `orders`, and `place-order` is the only place
that calls them together. Had `carts` recorded the order itself, the test would
name it:

```
carts → orders: placedStatements is a command of orders
carts/services.ts: import { placedStatements } from "#/shop/orders"
```

The rule is read from the import alone, so adding `place-order` changed no
link that was right before it.

## 5. The product list: a process that reads

In the first version of the shop
([the product document](../../../../bizdev/product-document/example.md)),
`browse-catalogue` reads `products` and `stock`. Here it also reads `carts` so
each storefront tile shows how many are already in the shopper's open cart —
three boxes, which do not join. The answer is put together in a process that
only reads: no transaction, no guards
([writing and reading](../structure/processes.md#writing-and-reading)):

```ts
// shop/_processes/browse-catalogue/list.ts — one read per box, joined in memory
export async function productList(db: Db, shopper: Shopper, page: Page): Promise<Tile[]> {
  const products = await listProducts(db, page);
  const ids = products.map((product) => product.id);
  const [levels, inCart] = await Promise.all([stockLevels(db, ids), cartQuantities(db, shopper.cartId, ids)]);
  return products.map((product) => ({
    ...tileOf(product),
    inStock: (levels.get(product.id) ?? 0) > 0,
    inCart: inCart.get(product.id) ?? 0,
  }));
}
```

Three reads for a page of any length
([one read per page](../architecture/data.md#atomic-writes-are-one-transaction-racing-writes-are-versioned)),
and a public answer built field by field by `tileOf`, never a row
([a view, never a row](../architecture/access.md#a-reader-sees-a-view-never-a-row)).
Nothing here closes a link: the three boxes may still call each other's
queries. The process is the one place that knows the combination, and it
writes nothing.

## 6. The receipt: a message queued with the order

The shopper gets an email when an order is placed. It must not delay the
answer, and a mail gateway that is down must not undo the sale. So `orders`
queues the message in the same batch as the order — it lands with the order or
not at all — and a job sends what is queued after the commit, retrying what
fails ([long work is a job](../architecture/data.md#long-work-is-a-job-never-a-request)):

```ts
// shop/orders/services.ts — the order and its message land together, or neither does
export function placedStatements(db: Db, order: Order): Statement[] {
  return [insertOrder(db, order), ...insertLines(db, order), queueNotification(db, receiptFor(order))];
}
```

`queueNotification` belongs to the notifications box in `features/`, below the
shop: it returns the insert rather than running it, which is what lets it ride
in the order's batch. No process and no new folder — a box asks a box below it.
