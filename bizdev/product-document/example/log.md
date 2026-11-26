# Log — kept throughout

## Assumptions

| ID | Assumption | If wrong | How we test it | Status |
|---|---|---|---|---|
| `A1` | Shoppers will order without asking first | The hours do not drop | Watch the first month's messages | `open` |
| `A2` | Transfer is enough as payment at first | Orders are placed and not paid | Count cancelled orders after two weeks | `open` |
| `A3` | Abandoned carts cost nothing to keep | Storage grows | Count carts after three months | `open` |

## Decisions

| ID | Date | Decision | Why | Supersedes | Changes |
|---|---|---|---|---|---|
| `D1` | 2026-11-15 | Stock is its own box, not part of `products` | A restock and a price change are different requests by different people at different times | — | `03-matrix.md` (10.2, 10.5) |
| `D2` | 2026-11-15 | A cart holds no stock; stock is taken at placing | Holding it needs a timeout and a cleanup; taking it at placing keeps R1 with one check | — | `02-behaviour.md` (7, 8, 9) |
| `D3` | 2026-11-15 | Unpaid orders are cancelled by the owner, not on a timer | One fewer moving part in the first version; on a timer later | — | `01-context.md` (4), `02-behaviour.md` (S5) |

## Open questions

| ID | Question | Owner | Blocks | Status |
|---|---|---|---|---|
| `Q1` | After how many days is an unpaid order cancelled — 3, or less for a product with one left? | The owner | `E2` launch | `open` |
