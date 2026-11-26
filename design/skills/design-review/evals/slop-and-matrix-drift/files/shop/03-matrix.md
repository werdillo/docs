# 3. Matrix

## 10. Boxes
| Box | Domain | Keeps |
|---|---|---|
| `products` | `catalogue` | `product` (`on_sale` · `withdrawn`) |
| `orders` | `shop` | `order` (`placed` → `paid` or `cancelled`, both final) |

## 10.4 Processes
- `advance-order`: pushes new `placed` orders live to the admin queue.
