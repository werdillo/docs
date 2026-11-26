# 6. Architecture

## 19. System overview
Monorepo with `shared`, `api`, `site`, and `admin`, following `software/principles/web`.

## 20. Boxes and data layout
- `slots` owns the `slots` table.
- `appointments` owns the `appointments` table.
- `sms` owns the `sms_deliveries` table.
- `billing` (added for future invoice reconciliation) reads `appointments` and writes a `billing_status` column directly into the `appointments` table whenever a receptionist confirms a visit.

## 21. Door and event contracts
| Contract | Producer | Consumer | Schema in `shared` |
|---|---|---|---|
| `CreateAppointmentRequest` | `site` | `api` | `shared/visits.ts` |
| `ConfirmAppointmentRequest` | `admin` | `api` | `shared/visits.ts` |
