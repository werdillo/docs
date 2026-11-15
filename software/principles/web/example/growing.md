# Growing the shop

## 7. Search: a plug

The admin's search is `features/search`, below every domain, and it may not
import `shop`. So search defines a registry and the type of a plug, and each box
that wants to be found declares it in its **part** — what the box brings to the
layers below, through its door ([the seam](../architecture/seams.md#invert-the-dependency-at-a-seam)):

```ts
// features/search/registry.ts — the slot; it names no domain
export type SearchSource = { section: string; find(db: Db, projectId: string, text: string): Promise<Hit[]> };

// shop/products/index.ts — the box's part: the tables it owns, and its plugs
export const productsPart = definePart({ tables: [products], search: [productSearch] });

// shop/index.ts — the domain entry lists its parts
export const shop = domain("shop", [productsPart, cartsPart, stockPart, ordersPart]);

// app/registrations.ts — once, at startup
install([shop]);
```

`tables` is also how a deleted tenant is erased: nothing cascades between
boxes, so each part's tables are emptied by the tenant's id, in the list's
order, and a box that needs more gives its own `cleanup`. A second domain is
one more name in `install`; a new box is one more part in its domain's list.

## 8. The sales report: a link that stays

The owner wants to see what sold: totals by day, and the best sellers by name.
The order lines froze each product's name, so the figures come from `orders`
alone. A new box, `reports`, keeps what the owner set up — the periods and
targets to compare against — and reads `orders` through its door, one way. It
is on no process's line, so nothing forbids the link, and nothing calls for a
process: step 3, for good.

```ts
// shop/reports/services.ts
import { ordersBetween } from "#/shop/orders";
```

Had it kept nothing of its own and read `products` as well, it would not be a
box at all but a [process](../structure/processes.md) that reads.

## 9. Loyalty: another domain reacts

The shop gives points for an order, and loyalty is a second domain, `loyalty` —
a peer of `shop`. The sale must not wait for it or fail with it, so the order
queues an event and a job delivers it after the commit
([a reaction that must not undo the write](../structure/reactions.md#a-reaction-that-must-not-undo-the-write)).
The reacting box is small:

```
api/src/loyalty/points/
  index.ts      ← the door; its part:
                  tables: [points, processedEvents],
                  reacts: [{ event: ORDER_PLACED, handle: onOrderPlaced }]
  model.ts      ← points, processed_events
  services.ts   ← the handler: points and the event id, one batch
```

The event rides in the order's batch, so the two land together or not at all.
`placedStatements` is the order and its receipt (step 6); the event is one more
statement in the same batch:

```ts
// shop/_processes/place-order/services/line.ts — one more statement in the batch
await db.batch([
  ...placedStatements(db, order),
  queueEvent(db, orderPlaced(order)),
]);
```

The event's shape is a contract in the contracts package, because loyalty is
another domain and domains never import each other:

```ts
// contracts/src/shop/orders/events.ts
export const ORDER_PLACED = "order.placed" as const;

export type OrderPlaced = {
  type: typeof ORDER_PLACED; orderId: string; customerId: string; total: Money;
};

export const orderPlaced = (order: Order): OrderPlaced => ({
  type: ORDER_PLACED, orderId: order.id, customerId: order.customerId, total: order.total,
});
```

The app installs both domains — `install([shop, loyalty])` — and the points part
fills the outbox's `reacts` registry. A job delivers due events after the
commit — at least once, retried with backoff, dead-lettered. The handler writes
the points and the event's id in one batch, so a redelivery is a no-op:

```ts
// loyalty/points/services.ts — the effect and its marker land together
export async function onOrderPlaced(db: Db, event: OrderPlaced): Promise<void> {
  try {
    await db.batch([
      guard(db, unprocessed(event.id), ALREADY_HANDLED),  // a redelivery stops here
      markProcessed(db, event.id),
      addPoints(db, event.customerId, pointsFor(event)),
    ]);
  } catch (error) {
    if (!isGuardFailure(error, ALREADY_HANDLED)) throw error;
  }
}
```

Loyalty's failure cannot undo the order: the order is already committed, and
the job retries or parks the event. The outbox is a box in `features/`, below
both domains; neither domain imports the other.

## The whole shop

```
api/src/shop/
  shared/money.ts
  shared/ledger/        ← a box of its own: the price adjustments
  products/  carts/  stock/  orders/  reports/
  _processes/
    place-order/        ← carts, orders, products, stock
    manage-cart/        ← carts, products
    browse-catalogue/   ← products, stock, carts — reads only
  index.ts              ← routers, and domain("shop", [productsPart, …])
```

`loyalty` is a second domain, a peer: it has its own tree and its own parts,
and the event contract in the contracts package is the only thing between them.
The grid stays the shop's grid.

Read as a grid, the matrix is now as quiet as it gets:

| may reach → | `shared` | `products` | `carts` | `stock` | `orders` | `reports` |
|---|---|---|---|---|---|---|
| **`products`** | yes | | | | | |
| **`carts`** | yes | | | | | |
| **`stock`** | yes | | | | | |
| **`orders`** | yes | | | | | |
| **`reports`** | yes | | | | door | |

The four boxes on the checkout's line reach no one: everything between them is
in `_processes`, where the imports say who takes part. That is what
a domain of processes tends to: its writes run through several boxes, so its
links end up on lines. What stays direct is a box on no line — a report,
an account page — and in a domain of content, where few writes cross boxes,
direct links stay the ordinary case. What the shop gives the layers below is
its list of parts, and each process exists because a step of the shop's growth
called for it.

What the tests hold here ([enforcement](../architecture/enforcement.md#enforcement)):
nothing in `features/` imports `shop` (layers); the line imports
`#/shop/carts`, never its `services` (boundaries); `cart_lines` has no key to
`products` (cross-box keys). The [tests, red and green](./tests.md#the-tests-red-and-green) show what a red one looks like.
