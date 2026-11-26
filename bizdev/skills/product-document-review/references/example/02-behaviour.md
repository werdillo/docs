# Stage 2 — Behaviour

## 6. People and access

| Role | Who they are | Access | What they come for | How often |
|---|---|---|---|---|
| **Shopper** | A buyer, usually from social media | Anonymous (no account) | To find a piece and buy it | Once or twice |
| **Owner** | The maker | Signed-in owner role | To add products, restock, handle orders | Daily |

## 7. Words

| Word | Means | Does not mean |
|---|---|---|
| **Order** | A cart the shopper placed: its lines, prices and stock are fixed. | A paid sale — that is a *paid* order. |
| **In stock** | At least one is left now. | Reserved — a cart holds no stock. |
| **Price** | What a product costs now. An order line keeps the price it was placed at. | What the shopper paid, if the price changed since. |
| **Withdrawn** | No longer sold; still shown in past orders. | Deleted — a product is never deleted. |

## 8. Scenarios

### S1. Browse the catalogue

- **Who:** Shopper
- **Starts when:** the shopper opens the shop.
- **Steps:** 1. Products on sale are listed with prices. 2. Each shows whether it is in stock.
- **Ends with:** the shopper sees what can be bought.
- **Must not:** show a withdrawn product.
- **What if:**

  | Case | Then |
  |---|---|
  | the last one sells while it is on screen | It is shown as in stock until the page is reloaded; placing the order is where it is checked (R1). |

### S2. Fill a cart

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

### S3. Place an order

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

### S4. Confirm a payment

- **Who:** Owner
- **Starts when:** a transfer arrives for an order.
- **Steps:** 1. The owner finds the order. 2. Marks it paid.
- **Ends with:** a paid order, ready to send.
- **Must not:** mark a cancelled order paid.
- **What if:**

  | Case | Then |
  |---|---|
  | it is done twice | The second is a no-op: the order is already paid. |
  | the order was already cancelled | Refused; the owner handles the refund outside the shop. |
  | the owner changes their mind | Not reversible in the first version; refunds are handled outside the shop. |

### S5. Cancel an order

- **Who:** Owner
- **Starts when:** an order is not paid in 3 days, or the shopper asks.
- **Steps:** 1. The order is cancelled. 2. Its stock is returned.
- **Ends with:** a cancelled order, and the stock as it was before it.
- **Must not:** cancel a paid order; cancel without returning the stock.
- **What if:**

  | Case | Then |
  |---|---|
  | it is done twice | The second fails: stock is returned only once (R5). |
  | it stops halfway | All or nothing: neither the cancellation nor the stock return stands. |
  | the email fails | The cancellation stands; the email is sent again later. |
  | the owner cancels by mistake | The shopper places a new order; stock is already back. |

### S6. Add or change a product

- **Who:** Owner
- **Starts when:** a new piece is ready to sell, or a price changes.
- **Steps:** 1. The owner enters or changes the name, description and price.
- **Ends with:** the product on sale — treated as out of stock until restocked.
- **Must not:** change the price of an already placed order (R2).
- **What if:**

  | Case | Then |
  |---|---|
  | submitted twice | Editing overwrites the current fields; adding the same piece twice creates a second product the owner withdraws (S8). |
  | the price changes while a cart is open | The cart reads the new price; placed orders keep their recorded price (R2). |
  | the owner changes their mind | Edit the product again, or withdraw it (S8). |

### S7. Restock a product

- **Who:** Owner
- **Starts when:** a batch comes out of the kiln.
- **Steps:** 1. The owner finds the product. 2. Adds the number made.
- **Ends with:** the product can be bought again.
- **Must not:** set stock below zero (R1); restock a withdrawn product.
- **What if:**

  | Case | Then |
  |---|---|
  | a negative or wrong number is entered | Refused below zero (R1); an overshoot is corrected by an adjustment that keeps stock non-negative. |
  | a shopper places an order at the same time | Both updates apply cleanly to the stock level; neither is lost. |

### S8. Withdraw a product

- **Who:** Owner
- **Starts when:** a piece will not be made again.
- **Steps:** 1. The owner withdraws it.
- **Ends with:** it is not sold, and past orders still show it.
- **Must not:** delete the product or break past orders; allow it in a new cart or order (R4).
- **What if:**

  | Case | Then |
  |---|---|
  | it is done twice | The second is a no-op: the product is already withdrawn. |
  | it is in an open cart | Placing the order fails for that line (R4). |
  | the owner changes their mind | Not reopened in the first version; add a new product (S6). |

## 9. Rules

| Rule | Must always be true | Kept by |
|---|---|---|
| R1 | Stock is never below zero. | `stock` |
| R2 | An order line keeps the price it was placed at. | `orders` |
| R3 | A cart is placed at most once. | `carts` |
| R4 | A withdrawn product is in no new cart or order. | `products`, checked by `place-order` |
| R5 | A cancelled order returns all of its stock, and only once. | `cancel-order` |
