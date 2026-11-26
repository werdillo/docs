# Stage 3 — Matrix

## 10. The matrix

### 10.1 Domains

| Domain | The subject, in one sentence |
|---|---|
| `shop` | Selling the maker's goods. |

### 10.2 Boxes

**Domain `shop`**

| Box | What it is for | What it keeps | What it lets others read |
|---|---|---|---|
| `products` | What the shop sells. | Products, their prices | A product, its price, whether it is on sale |
| `carts` | What a shopper is about to buy. | Carts, cart lines | A cart and its lines |
| `stock` | How many of each product there are. | Stock levels | Whether a product is in stock |
| `orders` | What was bought. | Orders, order lines | An order |

**`shared`** — money: an amount in a currency, and the arithmetic on it. Every
box uses it; none owns it.

### 10.3 Common capabilities

| Capability | What it is for | Used by |
|---|---|---|
| `accounts` | Who the owner is, and that only they manage the shop. | Owner's scenarios |
| `notifications` | Sending a message to a person. | *Afterwards* of `place-order` and `cancel-order` |

### 10.4 Processes

| Process | Scenario | The line — boxes, in order | All or nothing? | Afterwards |
|---|---|---|---|---|
| `browse-catalogue` | S1 | `products`, `stock` — reads only | — | — |
| `place-order` | S3 | `carts` → `products` → `stock` → `orders` → `carts` | Yes | An email to the shopper and to the owner |
| `cancel-order` | S5 | `orders` → `stock` | Yes | An email to the shopper |

### 10.5 The grid

| may reach → | `shared` | `products` | `carts` | `stock` | `orders` |
|---|---|---|---|---|---|
| **processes** | yes | door | door | door | door |
| **`products`** | yes | | | | |
| **`carts`** | yes | door | | | |
| **`stock`** | yes | | | | |
| **`orders`** | yes | | | | |

`carts` reads a product's name, price and whether it is on sale for its lines;
every change across boxes goes through a process.

## 11. Lifecycles

**Product** — kept by `products`

| From | To | By | Final? |
|---|---|---|---|
| — | on sale | S6 | |
| on sale | withdrawn | S8 | yes |

**Cart** — kept by `carts`

| From | To | By | Final? |
|---|---|---|---|
| — | open | S2 | |
| open | placed | S3 | yes |
| open | abandoned | the shopper leaves (S2) | yes — kept, never cleaned up in the first version |

**Order** — kept by `orders`

| From | To | By | Final? |
|---|---|---|---|
| — | placed | S3 | |
| placed | paid | S4 | yes |
| placed | cancelled | S5 | yes |

## 12. Checks on paper

### 12.1 Scenarios → carriers

| Scenario | Carried by |
|---|---|
| S1. Browse the catalogue | `browse-catalogue` |
| S2. Fill a cart | `carts` |
| S3. Place an order | `place-order` |
| S4. Confirm a payment | `orders` |
| S5. Cancel an order | `cancel-order` |
| S6. Add or change a product | `products` |
| S7. Restock a product | `stock` |
| S8. Withdraw a product | `products` |

Every box carries a scenario.

### 12.2 Things → scenarios

| Thing | Created by | Changed by | Ends by |
|---|---|---|---|
| Product | S6 | S6 | S8 |
| Stock level | Implicitly zero when a product has no record yet; first written by S7 | S7, S3, S5 | with its product |
| Cart | S2 | S2 | S3, or abandoned |
| Order | S3 | S4, S5 | paid or cancelled |

### 12.3 Roles → actions

| Action | Shopper | Owner |
|---|---|---|
| S1, S2, S3 | yes | — |
| S4, S5, S6, S7, S8 | — | yes |

### 12.4 Walkthrough

**S3. Place an order**

| Step | Box or process | Changes | Transition | Rules |
|---|---|---|---|---|
| 1. The cart is priced | `place-order` reads `carts`, `products` | — | — | R4 |
| 2. The stock is taken | `place-order` → `stock` | stock levels | — | R1 |
| 3. The order is written | `place-order` → `orders` | a new order | — → placed | R2 |
| 4. The cart is closed | `place-order` → `carts` | the cart | open → placed | R3 |

**S5. Cancel an order**

| Step | Box or process | Changes | Transition | Rules |
|---|---|---|---|---|
| 1. The order is cancelled | `cancel-order` → `orders` | the order | placed → cancelled | — |
| 2. Its stock is returned | `cancel-order` → `stock` | stock levels | — | R5 |

### 12.5 Found on paper

| Found | By which check | Fixed in |
|---|---|---|
| No scenario puts anything in a cart | Things → scenarios: *Cart, created by* was empty | S2 |
| Payment is by transfer, but nothing marks an order paid | Lifecycles: an order had one state and no way out | S4, the *paid* state |
| A shopper who never pays keeps the stock for ever | What if (S3): *never pays* | S5, `cancel-order`, R5 |
| A product could only be added, never taken off sale | Things → scenarios: *Product, ends by* was empty | S8, R4, the *withdrawn* state |
| Two shoppers could both buy the last one if a cart held stock | What if (S3): *two at once* | R1; a cart holds no stock (Words) |
| "Order" meant placed to the shopper and paid to the owner | Words | Words: *order*, *paid* |
