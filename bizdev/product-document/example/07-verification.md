# 07 — Verification

*Maps R1–R5 and the critical *What if* rows from `02-behaviour.md` to test
tiers and automated guards.*

## Rules and edge cases → tests

| Rule / *What if* | Behaviour proven | Test tier |
|---|---|---|
| **R1** + *two shoppers buy the last one at once* | Atomic stock check refuses the second order; stock never drops below `0` | `database` |
| **R2** + *price changed after adding to cart* | Cart shows current price; placed order keeps price at placing | `database` |
| **R3** + *Place order pressed twice* | Second attempt fails cleanly; only one order written | `database` + `browser` |
| **R4** + *product withdrawn while in cart* | `place-order` refuses withdrawn line; catalogue omits withdrawn products | `unit` + `database` |
| **R5** + *Cancel order done twice* | Stock returns exactly once; cancelling a paid order is refused | `database` |
| *Email fails after placing* | Order stands; outbox retries notification independently | `database` |

## Guards enabled

All `software/principles/web/guards/` checks on every push: layers, doors,
cycles, commands, writes, schema, gates, UI tokens, and site head/links guard.

## Launch readiness checklist

- [ ] S1–S8 tested on a `360 px` phone and desktop browser
- [ ] Concurrent last-item checkout proven against a real database
- [ ] Site guard passes (`title`, `description`, `canonical`, `h1`, image `alt`/dimensions)
