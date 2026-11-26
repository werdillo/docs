# Stage 4 — Launch

## 13. Deliverables

| Deliverable | Kind | Who uses it | Carries |
|---|---|---|---|
| **shared** | shared contracts | API, Shop site, Admin | `shop/shared` money types, API schemas, refusal codes (`R1`–`R5`) and event payloads |
| **API** | API | Shop site, Admin | `shop` — every box and process; `accounts`, `notifications` |
| **Shop site** | public site | Shopper | `browse-catalogue`, `products`, `carts`, `place-order` |
| **Admin** | internal app | Owner | `products`, `stock`, `orders`, `cancel-order` |

## 14. First slice

- **Boxes and processes:** `shared`, `products`, `stock`, `carts`, `orders` and
  `place-order`, with products seeded by hand.
- **Scenario completed end to end:** S3 (*Place an order*) from request through
  atomic stock deduction and order creation before any full screen is finished.

## 15. Pilot and launch criteria

- **Pilot scope:** One ceramics maker's live catalogue (20–200 products) for
  two months, announced to existing social media buyers.
- **Ready to launch when:** Every scenario S1–S8 runs on a real phone and
  laptop, two simultaneous buyers cannot oversell the last piece (R1), and
  order emails arrive reliably.
