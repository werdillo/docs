# 08 — Delivery plan

## The working cycle

Small shop follows the **freeze → fan-out → join** cycle with `design` and
`software/principles/web` skills installed:

1. **Wave A (`serial A`):** freeze `shared` contracts (schemas, refusal codes,
   event payloads), box doors and schema.
2. **Wave B (`parallel B`):** run tasks with disjoint **`Owns`** scopes
   concurrently against the frozen `shared` contracts (never editing `shared`
   or `app/`).
3. **Wave C (`serial C`):** wire `app/`, run every tier in `07-verification.md`
   across all prior epochs, and sync `01`–`07` + `log.md`.
4. **Version loop:** after 2 months live, check `01-context.md` targets before
   opening `E3` (v2).

## Task brief

```text
Task:          <E2.2> (parallel B)
Skills:        software/principles/web, design
Read first:    <from Reads column>
Owns:          <from Owns column>
Must not edit: shared/, other boxes, composition root (app/)
Done when:     <from Done when column + single check command passes>
Escalate if:   a blocking Q* is open, a shared contract is missing, or a rule must change
```

## Epochs and tasks

### E1. First vertical slice

**Goal:** S3 (*Place an order*) runs atomically end to end against a real
database before any screen is finished.
**Epoch exit gate:** E1.1–E1.4 `done` + database concurrency test green +
`01`–`07` / `log.md` synced.

| Task | Wave | Scope | Reads | Owns (write scope) | Depends on | Done when | Status |
|---|---|---|---|---|---|---|---|
| `E1.1` | `serial A` | `shared` contracts, money types, schema, guards | `03-matrix`, `06-arch` | `shared/`, `tests/guards/` | — | Contracts compile; guards pass | `todo` |
| `E1.2` | `parallel B` | `products` and `stock` boxes | `S6–S8, R1, R4; 06-arch` | `api/src/shop/products/`, `api/src/shop/stock/` | `E1.1` | R1, R4 unit + DB tests pass | `todo` |
| `E1.3` | `parallel B` | `carts` and `orders` boxes | `S2–S5, R2, R3; 06-arch` | `api/src/shop/carts/`, `api/src/shop/orders/` | `E1.1` | R2, R3 unit + DB tests pass | `todo` |
| `E1.4` | `serial C` | `place-order` atomic batch, wire `app/`, E1 regression | `S3, R1–R4; 07-verif` | `api/src/shop/_processes/place-order/`, `api/src/app/` | `E1.2`, `E1.3` | S3 + R1–R4 proven under concurrency; docs synced | `todo` |

### E2. Launch v1 (Shop site + Admin)

**Goal:** All eight scenarios (S1–S8) live on a `360 px` phone and desktop
admin for one ceramics maker (`Q1` resolved before launch).
**Epoch exit gate:** E2.1–E2.4 `done` + `Q1` answered + full E1–E2 regression +
launch checklist green.

| Task | Wave | Scope | Reads | Owns (write scope) | Depends on | Done when | Status |
|---|---|---|---|---|---|---|---|
| `E2.1` | `serial A` | `shared` v1 contracts, `accounts`, `notifications` outbox, `browse-catalogue`, `cancel-order` | `S1, S5, R5; 06-arch` | `shared/`, `api/src/features/`, `api/src/shop/_processes/` | `E1.4` | R5 and outbox retry proven at DB tier | `todo` |
| `E2.2` | `parallel B` | `Shop site` (`list`, `record`, `flow`) | `S1–S3, R1–R4; 05-design` | `site/` | `E2.1` | S1–S3 pass on `360 px` mobile; site guard green | `todo` |
| `E2.3` | `parallel B` | `Admin` (`products`, `stock`, `orders` in `internal`) | `S4–S8, R1–R5; 05-design` | `admin/` | `E2.1` | S4–S8 pass; UI token guard green | `todo` |
| `E2.4` | `serial C` | Live integration, full E1–E2 regression, backup check | `07-verif`, `log.md` | `tests/live/`, `log.md` | `E2.2`, `E2.3` | All `07-verification.md` checklist items pass | `todo` |

### E3. v2 growth (after 2-month validation)

**Goal:** Promote *Later* features once v1 meets `01-context.md` targets
([growing.md](../../../software/principles/web/example/growing.md)).

| Task | Wave | Scope | Reads | Owns (write scope) | Depends on | Done when | Status |
|---|---|---|---|---|---|---|---|
| `E3.1` | `serial A` | Update `01`–`04`, freeze v2 `shared` contracts | `01`–`04`, `log.md` | `shared/`, `01`–`04` | `E2.4` | New boxes (`loyalty`, `reports`, `manage-cart`) pass Gate 3 | `todo` |
| `E3.2` | `parallel B` | `loyalty` domain + outbox reactions | `03-matrix`, `06-arch` | `api/src/loyalty/` | `E3.1` | Loyalty reaction tests pass | `todo` |
| `E3.3` | `parallel B` | `reports` + `manage-cart` + admin search | `03-matrix`, `05-design` | `api/src/shop/`, `admin/` | `E3.1` | Reports and search tests pass | `todo` |
| `E3.4` | `serial C` | Wire `app/` + full E1–E3 regression | `07-verif` | `api/src/app/`, `tests/live/` | `E3.2`, `E3.3` | All v1 + v2 tests and guards green | `todo` |

## Rollout and failure runbook

- **Rollout:** Schema migrations run before app traffic shifts; `Shop site`
  static pages rebuild on catalogue updates.
- **When the service is down:** Maker pauses social links and records urgent
  sales manually in the backup spreadsheet, reconciling stock via S7 once the
  shop returns.
