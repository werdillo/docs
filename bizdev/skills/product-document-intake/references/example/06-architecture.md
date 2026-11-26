# 06 — Architecture

*Product-specific choices only. Assumes `software/principles/web` and `design`
skills are installed during build; worked code lives in
[`software/principles/web/example/`](../../../software/principles/web/example/README.md).*

## Stack and project conventions

| Concern | Choice |
|---|---|
| **Repositories / packages** | 4 deliverables: `shared` (shared contracts), `api`, `site`, `admin` (plus shared UI kit) |
| **Languages and runtime** | TypeScript |
| **Database and storage** | Relational database with single-batch atomic writes for cross-box processes |
| **Auth and tenancy** | Anonymous shopper session for carts; signed-in owner grant for admin routes |
| **Real-time / background jobs** | Transactional outbox for confirmation and cancellation emails (`notifications`) |
| **External adapters** | Email provider behind `features/notifications` door |

## Shared contracts and box layout

- **`shared`:** holds `shop/shared` money types, API input/output schemas,
  refusal codes (`R1`–`R5`), and `OrderPlaced` / `OrderCancelled` event shapes.
  Frozen in `serial A` before `api`, `site` and `admin` fan out.
- **Box paths:** `src/shop/{products, carts, stock, orders, shared, _processes/{browse-catalogue, place-order, cancel-order}}`.

## Door and event contracts (frozen before `parallel B`)

| Process / Door | Input | Output | Refusal codes (`R1`–`R5`) | Events emitted |
|---|---|---|---|---|
| `browse-catalogue` | `page` | `CatalogueTile[]` | — | — |
| `place-order` | `cartId`, `contact`, `idempotencyKey` | `Order` | `OUT_OF_STOCK` (R1), `CART_ALREADY_PLACED` (R3), `PRODUCT_WITHDRAWN` (R4) | `OrderPlaced` |
| `cancel-order` | `orderId` | `Order` | `ORDER_ALREADY_PAID` (S5), `ORDER_ALREADY_CANCELLED` (R5) | `OrderCancelled` |
| `orders.confirmPayment` | `orderId` | `Order` | `ORDER_CANCELLED` (S4) | — |
| `stock.restock` | `productId`, `delta` | `StockLevel` | `STOCK_NEGATIVE` (R1), `PRODUCT_WITHDRAWN` (S7) | — |

## Data ownership and tenancy

`products` owns product and price rows; `stock` owns non-negative quantity
levels; `carts` owns open carts; `orders` owns immutable order/line snapshots
(R2). Single-shop deployment in v1.

## Security, privacy and reliability

Shopper email/address is stored only on placed orders; automated daily database
backups; no payment card data touches the server.
