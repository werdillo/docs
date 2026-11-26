# Stage 1 — Context

## 1. The idea

A maker of ceramics sells through social media messages and a spreadsheet.
Orders are lost, items are sold twice, and every sale takes a conversation.

> For **a small maker selling their own goods**, who **sells by message and
> loses orders and stock along the way**, **Small shop** is **an online shop
> with its own stock** that **takes an order without a conversation**. Unlike
> **messages and a spreadsheet**, it **never sells an item that is not there**.

## 2. The problem

| | |
|---|---|
| **Who has it** | Makers with 20–200 products and one or two people. |
| **How they solve it today** | Messages, a spreadsheet of stock, bank transfers. |
| **What it costs them** | About 6 hours a week answering; 2–3 oversold items a month, each a refund and an apology. |
| **Why now** | The maker's sales doubled this year; the spreadsheet no longer keeps up. |
| **Evidence** | One maker's own records for 3 months; conversations with 4 others. |

## 3. Value and success

| Outcome | Measured by | Target | By when |
|---|---|---|---|
| The owner stops answering for each sale | Hours a week on orders | Under 1 | 2 months after launch |
| No item is sold twice | Oversold items a month | 0 | From launch |

**We stop or rethink if:** after two months fewer than half of the sales come
through the shop.

## 4. Scope

| In the first version | Later | Not this product |
|---|---|---|
| A catalogue, a cart, placing an order, stock | Search, a sales report | Payments in the shop — by transfer, confirmed by the owner |
| An email when an order is placed | Cancelling unpaid orders automatically | Delivery tracking |
| Confirming a payment, cancelling an order | Loyalty points | Refunds — made by hand, outside the shop |
| | | Accounts for shoppers |

## 5. Constraints and risks

| Area | Constraint |
|---|---|
| **Isolation / tenancy** | Single maker per shop deployment in the first version. |
| **Privacy and legal** | Shopper contact details are collected only at order placing and kept only for fulfilment and accounting. |
| **Failure fallback** | If the shop is down, the maker pauses new social posts and takes urgent orders via direct message until restored. |
| **Devices and freshness** | Shop site works cleanly on `360 px` mobile phones; stock is checked live at order placing (never cached for writes). |
