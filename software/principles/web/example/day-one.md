# Day one

## 1. Draw the boxes

One domain, `shop`. Each box is one sentence without an "and", and owns its
records ([where a box ends](../structure/matrix.md#where-one-box-ends)):

| Box | What it is for | Its records |
|---|---|---|
| `products` | what the shop sells | products, their prices |
| `carts` | what a shopper is about to buy | carts, cart lines |
| `stock` | how many of each product there are | stock levels |
| `orders` | what was bought | orders, order lines |

Money — an amount in a currency, and the arithmetic on it — is used by all four
and owned by none, so it goes into the domain's `shared/`.

## 2. Day one: boxes, `shared` and doors

```
packages/
  contracts/src/shop/
    products/  carts/  stock/  orders/     ← the shapes, one folder per box
  api/src/
    core/                                  ← db, http, ids: knows no subject
    features/                              ← accounts, files, search: every domain's, no domain's
    shop/                                  ← a layer: the domain, a matrix
      shared/money.ts                      ← common ground: a type and pure helpers
      products/  carts/  stock/  orders/   ← the boxes
      index.ts                             ← the domain's entry: gathers its routers
    app/                                   ← the composition root
  admin/src/
    shop/products/  shop/orders/           ← the screens, at the same paths
    app/                                   ← router, App, tests
    app/router.tsx                         ← the front end's composition root
```

A box stays flat while it is small
([sizes](../structure/sizes.md#flat-when-small-and-the-sizes)):

```
api/src/shop/orders/
  index.ts      ← the door
  model.ts      ← its tables: orders, order_lines
  router.ts     ← its routes: list, get
  handlers.ts
  services.ts
  README.md
```

Its door holds only import and export lines and, when the box has one, its
part — what its neighbours use, and nothing more:

```ts
// shop/orders/index.ts
export { ordersRouter } from "./router";
export { orderById } from "./services";
export type { Order } from "./model";
```

A cart shows the price of what is in it, so `carts` asks `products` — one call,
one way, through the door. That is step 3
([how boxes interact](../structure/interaction.md#how-boxes-interact-inside-a-matrix)),
and the import line is where it shows:

```ts
// shop/carts/services.ts
import { priceOf } from "#/shop/products";   // the door — never "#/shop/products/services"
```

Between the tables the link is an id: `cart_lines.product_id` holds a
product's id, with no foreign key to `products`
([data](../architecture/data.md#a-box-owns-its-data-between-boxes-reference-by-id)).
A cart line also keeps the title it was added with, so a line whose product is
gone still says what it was — and placing the order refuses it by that name
(step 4) rather than dropping it unseen.

## 3. Declare, then list

Each box declares itself where it lives, and the root only lists the
declarations
([composition root](../architecture/seams.md#the-composition-root-is-the-only-place-that-knows-everything)).
On the front end a declaration is the box's addresses, the access section that
guards them, and its menu entry:

```ts
// admin/src/shop/orders/routes.ts
export const ordersRoutes = defineModuleRoutes({
  section: "orders",                                   // what a grant names
  nav: { group: "Shop", item: { title: "Orders", href: "/orders" } },
  routes: [{ path: "/orders", component: lazy(() => import("./ui/OrdersPage")) }],
});

// admin/src/app/router.tsx — the route tree, the menu and the access map all come from this list
const modules = [productsRoutes, ordersRoutes];
```

On the server a box's door exports its router, the domain's entry gathers them,
and the root mounts the domain once:

```ts
// api/src/shop/index.ts — the entry gathers; it decides nothing
export const shopRouter = new Hono().route("/", productsRouter).route("/", ordersRouter);

// api/src/app/routes.ts
app.route("/shop", shopRouter);
```
