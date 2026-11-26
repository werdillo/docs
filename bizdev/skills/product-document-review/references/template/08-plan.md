# 08 — Delivery plan (technical half, optional)

*Turns `01`–`07` into executable epochs, parallelisable tasks with disjoint
write scopes (`Owns`) and minimal read budgets (`Reads`), ready to hand
straight to multiple developers or parallel agents with the principle skills
installed. Past ~200–250 lines, expand `08-plan.md` into a folder (`08-plan/`
with one `E1-*.md` file per epoch).*

## The working cycle

Every epoch follows a **freeze → fan-out → join** parallel shape
([multi-agent workflow](../../../shared/agents.md)):

1. **Wave A — Freeze seams (`serial A`):** update `shared` (shared contracts,
   refusal codes, event payloads), box doors, kit tokens and schema first so
   downstream tracks build against fixed interfaces.
2. **Wave B — Fan-out (`parallel B`):** run every task whose **`Owns`** write
   scope is strictly disjoint in parallel (separate branches or worktrees).
   No parallel task edits another task's paths, `shared` contracts or the
   composition root (`app/` / `main.zig`); if a seam is missing, mark the task
   `blocked` and report it instead of colliding.
3. **Wave C — Join, wire and regress (`serial C`):** merge parallel branches,
   wire them in the composition root, run the full `07-verification.md` suite
   across **all** prior epochs, audit `01`–`07` + `log.md`, and close any
   regressions before opening the next epoch.
4. **Version loop (after the final epoch):** measure live results against
   `01-context.md` (Value and success) and `04-launch.md` (Pilot criteria),
   feed learnings into `01`–`04`, then open the next version's epochs.

## Task brief (copy-paste contract for a worker or agent)

```text
Task:          <E1.2> (<Wave>)
Skills:        <from README.md — e.g. software/principles/web, design>
Read first:    <exact files/sections from Reads column — nothing else unless blocked>
Owns:          <exact paths from Owns column>
Must not edit: shared contracts (outside serial A), other boxes, composition root (app/)
Done when:     <Done when criterion + single check command passes>
Escalate if:   a blocking Q* is open, a shared contract is missing, or a box/rule must change
```

## Epochs and tasks

*Tasks sharing the same `parallel B` label run concurrently because their
**`Owns`** paths never overlap.*

### E1. <First slice / Demo milestone>

**Goal:** *the single core scenario working end to end.*
**Epoch exit gate:** *all tasks `done` + zero open `Q*` blocking `E1` + full regression pass + `01`–`07` synced.*

| Task | Wave | Scope | Reads | Owns (write scope) | Depends on | Done when | Status |
|---|---|---|---|---|---|---|---|
| `E1.1` | `serial A` | `shared` contracts, doors, schema, guards | `03-matrix`, `06-arch` | `shared/`, `tests/guards/` | — | Contracts compile; guards green | `todo` |
| `E1.2` | `parallel B` | Box A + tests | `S1, R1; 06-arch` | `api/src/<domain>/<box-a>/` | `E1.1` | Box A rules pass unit + DB tier | `todo` |
| `E1.3` | `parallel B` | Box B + tests | `S2, R2; 06-arch` | `api/src/<domain>/<box-b>/` | `E1.1` | Box B rules pass unit + DB tier | `todo` |
| `E1.4` | `serial C` | Process, wire `app/`, E1 regression | `03-matrix`, `07-verif` | `api/src/<domain>/_processes/`, `api/src/app/` | `E1.2`, `E1.3` | End-to-end slice + regression green; docs synced | `todo` |

### E2. <Pilot MVP>

**Goal:** *the complete first version ready for real users.*
**Epoch exit gate:** *all tasks `done` + full regression across E1–E2 + pilot readiness checked.*

| Task | Wave | Scope | Reads | Owns (write scope) | Depends on | Done when | Status |
|---|---|---|---|---|---|---|---|
| `E2.1` | `serial A` | | | | `E1.4` | | `todo` |

## Rollout and failure runbook

- **Rollout:** *how releases and migrations ship without breaking running users*
- **When the service is down:** *exact operational fallback matching `01-context.md` section 5*
