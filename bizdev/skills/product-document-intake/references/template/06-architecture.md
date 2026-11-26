# 06 — Architecture (technical half, optional)

*Product-specific choices only. Assumes the principle skill named in
`README.md` (for example `software/principles/web` or `low-level`) is installed
during development — do not repeat its general rules for layers, doors, tests
or guards here. Never silently changes `01`–`04`.*

## Stack and project conventions

| Concern | Choice |
|---|---|
| **Repositories / packages** | *e.g. 4 units: `shared` (contracts), `api`, `site`, `admin`* |
| **Languages and runtime** | |
| **Database and storage** | |
| **Auth and tenancy** | |
| **Real-time / background jobs** | |
| **External adapters** | |

## Shared contracts and box layout

- **`shared` (shared contracts repo/package):** holds Zod/type schemas, domain
  value types (`shared/` of each domain), refusal codes mapped to `R1..Rn`, and
  event payloads imported by every app/service. Frozen first in `serial A`.
- **Box paths:** every deliverable mirrors `src/<domain>/<box>/` from section
  10.

## Door and event contracts (frozen before `parallel B`)

*Freezing input/output shapes, refusal codes and event names here lets parallel
API and front-end tracks compile cleanly at `serial C`.*

| Process / Door | Input | Output | Refusal codes (`R1..Rn`) | Events emitted |
|---|---|---|---|---|
| `<process>` | | | *e.g. `RULE_VIOLATION` (R1)* | *e.g. `OrderPlaced`* |

## Data ownership and tenancy

*Which box owns which tables/state, where snapshots or idempotency keys live,
and how tenant isolation is enforced.*

## Security, privacy and reliability

*Rate limits, GDPR retention jobs, backups and restore testing (answering
`01-context.md` section 5).*
