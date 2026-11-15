# Small shop

*An example of [the template](./template.md), filled in. It is the shop that
[the web example](../../software/principles/web/example/README.md) builds: the
boxes here are the folders there. The names and numbers are made up.*

*The first draft of this document had four scenarios. The checks of stage 3
found four more and five rules; what they found, and where it was fixed, is in
[11.5](#115-found-on-paper).*

| | |
|---|---|
| **Status** | Handoff |
| **Owner** | The shop's owner |
| **Updated** | 2026-11-15 |

---

## Stage 1 — Idea

### 1. The idea

A maker of ceramics sells through social media messages and a spreadsheet.
Orders are lost, items are sold twice, and every sale takes a conversation.

> For **a small maker selling their own goods**, who **sells by message and
> loses orders and stock along the way**, **Small shop** is **an online shop
> with its own stock** that **takes an order without a conversation**. Unlike
> **messages and a spreadsheet**, it **never sells an item that is not there**.

### 2. The problem

| | |
|---|---|
| **Who has it** | Makers with 20–200 products and one or two people. |
| **How they solve it today** | Messages, a spreadsheet of stock, bank transfers. |
| **What it costs them** | About 6 hours a week answering; 2–3 oversold items a month, each a refund and an apology. |
| **Why now** | The maker's sales doubled this year; the spreadsheet no longer keeps up. |
| **Evidence** | One maker's own records for 3 months; conversations with 4 others. |

---

## Stage 2 — Discovery

### 3. The people

| Role | Who they are | What they come for | How often |
|---|---|---|---|
| Shopper | A buyer, usually from social media; no account | To find a piece and buy it | Once or twice |
| Owner | The maker | To add products, restock, handle orders | Daily |

### 4. Value and success

| Outcome | Measured by | Target | By when |
|---|---|---|---|
| The owner stops answering for each sale | Hours a week on orders | Under 1 | 2 months after launch |
| No item is sold twice | Oversold items a month | 0 | From launch |

**We stop or rethink if:** after two months fewer than half of the sales come
through the shop.

### 5. Scope

| In the first version | Later | Not this product |
|---|---|---|
| A catalogue, a cart, placing an order, stock | Search, a sales report | Payments in the shop — by transfer, confirmed by the owner |
| An email when an order is placed | Cancelling unpaid orders automatically | Delivery tracking |
| Confirming a payment, cancelling an order | Loyalty points | Refunds — made by hand, outside the shop |
| | | Accounts for shoppers |

### 6. Words

| Word | Means | Does not mean |
|---|---|---|
| **Order** | A cart the shopper placed: its lines, prices and stock are fixed. | A paid sale — that is a *paid* order. |
| **In stock** | At least one is left now. | Reserved — a cart holds no stock. |
| **Price** | What a product costs now. An order line keeps the price it was placed at. | What the shopper paid, if the price changed since. |
| **Withdrawn** | No longer sold; still shown in past orders. | Deleted — a product is never deleted. |

### 7. Scenarios

#### S1. Browse the catalogue

- **Who:** Shopper
- **Starts when:** the shopper opens the shop.
- **Steps:** 1. Products on sale are listed with prices. 2. Each shows whether it is in stock.
- **Ends with:** the shopper sees what can be bought.
- **Must not:** show a withdrawn product.
- **What if:**

  | Case | Then |
  |---|---|
  | the last one sells while it is on screen | It is shown as in stock until the page is reloaded; placing the order is where it is checked (R1). |

#### S2. Fill a cart

- **Who:** Shopper
- **Starts when:** the shopper adds a product.
- **Steps:** 1. A cart is opened if there is none. 2. The product is added, or its quantity changed or removed.
- **Ends with:** an open cart with its lines.
- **Must not:** add a withdrawn product.
- **What if:**

  | Case | Then |
  |---|---|
  | more is added than is in stock | Allowed; placing the order is where stock is checked (R1). |
  | the shopper leaves | The cart stays open and is never placed — it ends abandoned. |

#### S3. Place an order

- **Who:** Shopper
- **Starts when:** the shopper presses *Place order* on a cart.
- **Steps:** 1. The cart is priced. 2. The stock of each line is taken. 3. The
  order is written. 4. The cart is closed.
- **Ends with:** a placed order the owner sees, and the stock lower by what was bought.
- **Must not:** sell more than is in stock; leave an order without its stock
  taken, or stock taken without an order; place the same cart twice.
- **What if:**

  | Case | Then |
  |---|---|
  | it is pressed twice | The second fails: the cart is already placed (R3). |
  | two shoppers buy the last one at once | One order is placed; the other is told the line is sold out, and the cart stays open (R1). |
  | it stops halfway | Nothing is placed and nothing taken: all or nothing. |
  | the price changed since it was added | The cart shows the price now; the order keeps the price at placing (R2). |
  | a product was withdrawn meanwhile | Placing fails for that line; the shopper removes it (R4). |
  | the email fails | The order stands; the email is sent again later. |
  | the shopper never pays | S5. |

#### S4. Confirm a payment

- **Who:** Owner
- **Starts when:** a transfer arrives for an order.
- **Steps:** 1. The owner finds the order. 2. Marks it paid.
- **Ends with:** a paid order, ready to send.
- **Must not:** mark a cancelled order paid.

#### S5. Cancel an order

- **Who:** Owner
- **Starts when:** an order is not paid in 3 days, or the shopper asks.
- **Steps:** 1. The order is cancelled. 2. Its stock is returned.
- **Ends with:** a cancelled order, and the stock as it was before it.
- **Must not:** cancel a paid order; cancel without returning the stock.

#### S6. Add or change a product

- **Who:** Owner
- **Starts when:** a new piece is ready to sell, or a price changes.
- **Steps:** 1. The owner enters or changes the name, description and price.
- **Ends with:** the product on sale — out of stock until restocked.

#### S7. Restock a product

- **Who:** Owner
- **Starts when:** a batch comes out of the kiln.
- **Steps:** 1. The owner finds the product. 2. Adds the number made.
- **Ends with:** the product can be bought again.

#### S8. Withdraw a product

- **Who:** Owner
- **Starts when:** a piece will not be made again.
- **Steps:** 1. The owner withdraws it.
- **Ends with:** it is not sold, and past orders still show it.

### 8. Rules

| Rule | Must always be true | Kept by |
|---|---|---|
| R1 | Stock is never below zero. | `stock` |
| R2 | An order line keeps the price it was placed at. | `orders` |
| R3 | A cart is placed at most once. | `carts` |
| R4 | A withdrawn product is in no new cart or order. | `products`, checked by `place-order` |
| R5 | A cancelled order returns all of its stock, and only once. | `cancel-order` |

---

## Stage 3 — Matrix

### 9. The matrix

#### 9.1 Domains

| Domain | The subject, in one sentence |
|---|---|
| `shop` | Selling the maker's goods. |

#### 9.2 Boxes

**Domain `shop`**

| Box | What it is for | What it keeps | What it lets others read |
|---|---|---|---|
| `products` | What the shop sells. | Products, their prices | A product, its price, whether it is on sale |
| `carts` | What a shopper is about to buy. | Carts, cart lines | A cart and its lines |
| `stock` | How many of each product there are. | Stock levels | Whether a product is in stock |
| `orders` | What was bought. | Orders, order lines | An order |

**`shared`** — money: an amount in a currency, and the arithmetic on it. Every
box uses it; none owns it.

#### 9.3 Common capabilities

| Capability | What it is for | Used by |
|---|---|---|
| `accounts` | Who the owner is, and that only they manage the shop. | Owner's scenarios |
| `notifications` | Sending a message to a person. | *Afterwards* of `place-order` |

#### 9.4 Processes

| Process | Scenario | The line — boxes, in order | All or nothing? | Afterwards |
|---|---|---|---|---|
| `browse-catalogue` | S1 | `products`, `stock` — reads only | — | — |
| `place-order` | S3 | `carts` → `products` → `stock` → `orders` → `carts` | Yes | An email to the shopper and to the owner |
| `cancel-order` | S5 | `orders` → `stock` | Yes | An email to the shopper |

#### 9.5 The grid

| may reach → | `shared` | `products` | `carts` | `stock` | `orders` |
|---|---|---|---|---|---|
| **processes** | yes | door | door | door | door |
| **`products`** | yes | | | | |
| **`carts`** | yes | door | | | |
| **`stock`** | yes | | | | |
| **`orders`** | yes | | | | |

`carts` reads a product's name, price and whether it is on sale for its lines;
every change across boxes goes through a process.

### 10. Lifecycles

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

### 11. Checks on paper

#### 11.1 Scenarios → carriers

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

#### 11.2 Things → scenarios

| Thing | Created by | Changed by | Ends by |
|---|---|---|---|
| Product | S6 | S6 | S8 |
| Stock level | S6 — at zero | S7, S3, S5 | with its product |
| Cart | S2 | S2 | S3, or abandoned |
| Order | S3 | S4, S5 | paid or cancelled |

#### 11.3 Roles → actions

| Action | Shopper | Owner |
|---|---|---|
| S1, S2, S3 | yes | — |
| S4, S5, S6, S7, S8 | — | yes |

#### 11.4 Walkthrough

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

#### 11.5 Found on paper

| Found | By which check | Fixed in |
|---|---|---|
| No scenario puts anything in a cart | Things → scenarios: *Cart, created by* was empty | S2 |
| Payment is by transfer, but nothing marks an order paid | Lifecycles: an order had one state and no way out | S4, the *paid* state |
| A shopper who never pays keeps the stock for ever | What if (S3): *never pays* | S5, `cancel-order`, R5 |
| A product could only be added, never taken off sale | Things → scenarios: *Product, ends by* was empty | S8, R4, the *withdrawn* state |
| Two shoppers could both buy the last one if a cart held stock | What if (S3): *two at once* | R1; a cart holds no stock (Words) |
| "Order" meant placed to the shopper and paid to the owner | Words | Words: *order*, *paid* |

---

## Stage 4 — Handoff

### 12. What is drawn and built

#### 12.1 To design

| Box or process | Screens | Pattern | Who sees it |
|---|---|---|---|
| `browse-catalogue` | The catalogue | list | Shopper |
| `shop/products` | A product · add or change, withdraw | detail · form | Shopper · Owner |
| `shop/carts` | The cart, with *sold out* and *withdrawn* on a line (R1, R4) | detail | Shopper |
| `place-order` | Placing the order, and its result | flow | Shopper |
| `shop/stock` | Stock levels, restock | list · form | Owner |
| `shop/orders` | Orders by state · an order, with *paid* and *cancel* | list · detail | Owner |

**Navigation:** one section, `shop` — the catalogue for a shopper; products,
stock and orders for the owner.

#### 12.2 To build

| Part | Kind | Carries |
|---|---|---|
| API | API | `shop` — every box and process; `accounts`, `notifications` |
| Shop site | front end | `browse-catalogue`, `products`, `carts`, `place-order` |
| Admin | front end | `products`, `stock`, `orders`, `cancel-order` |

**First slice:** `products`, `stock`, `carts`, `orders` and `place-order`,
with products added by hand — S3 end to end, before any screen is finished.

---

## Kept throughout

### 13. Assumptions

| Assumption | If wrong | How we test it | Status |
|---|---|---|---|
| Shoppers will order without asking first | The hours do not drop | Watch the first month's messages | Open |
| Transfer is enough as payment at first | Orders are placed and not paid | Count cancelled orders after two weeks | Open |
| Abandoned carts cost nothing to keep | Storage grows | Count carts after three months | Open |

### 14. Decisions

| Date | Decision | Why | Changes |
|---|---|---|---|
| 2026-11-15 | Stock is its own box, not part of `products` | A restock and a price change are different requests by different people at different times | 9.2, 9.5 |
| 2026-11-15 | A cart holds no stock; stock is taken at placing | Holding it needs a timeout and a cleanup; taking it at placing keeps R1 with one check | 6, 7 (S2, S3), 8 |
| 2026-11-15 | Unpaid orders are cancelled by the owner, not on a timer | One fewer moving part in the first version; on a timer later | 5, 7 (S5) |

### 15. Open questions

- After how many days is an unpaid order cancelled — 3, or less for a product
  with one left? — the owner, before launch.
