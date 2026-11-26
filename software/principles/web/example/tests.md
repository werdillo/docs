# The tests, red and green

## Commands

The failure a box would meet at step 4: `carts` importing `placedStatements`,
a command `orders` exports from its `commands.ts`. A query would pass; a write
that spans two boxes belongs on a line.

## Owned writes

```
carts → orders.order_lines
carts/services.ts: db.insert(orderLines)
```

The write belongs in `orders`, which exports `placedStatements`; `place-order`
(the process) puts that statement in its batch — `carts` neither builds a
statement on `orders`' table nor calls `orders`' commands.

## The guard

```ts
const stale = closeCartStatements(db, cart.id); // built while the cart was open
await placeOrder(db, cart.id); // the first placement closes it
await assertRejects(() => db.batch(stale), (error) => isGuardFailure(error, CART_CLOSED));
```

The first placement wins; the second batch fails on the guard, not on a read,
and nothing is written.
