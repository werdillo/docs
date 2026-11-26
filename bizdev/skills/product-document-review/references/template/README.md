# <Product name>

| | |
|---|---|
| **Status** | Context · Behaviour · Matrix · Launch — *the last business gate passed* |
| **Owner** | *who decides* |
| **Updated** | *YYYY-MM-DD* |
| **Skills / principles** | *e.g. `design`, `software/principles/web` (installed during build; `05`–`08` never repeat their rules)* |
| **Active epoch / wave** | *`—` before build; e.g. `E2 · parallel B` during execution* |
| **Next action** | *one concrete next step* |
| **Blocking Qs** | *e.g. `Q1, Q2` or `none`* |

*Copy this folder for a new product. How to fill each section, and the gate at
the end of each business stage, is in [the guide](../guide.md). Any numbered
file may turn into a folder under the same name once it grows past one sitting
(~200–250 lines). Delete these italic prompts as you go.*

## Business half — source of truth (business words only)

| File | Stage | What it holds |
|---|---|---|
| [`01-context.md`](./01-context.md) | 1. Context | The idea (1), problem (2), value and success (3), scope (4), constraints and risks (5). |
| [`02-behaviour.md`](./02-behaviour.md) | 2. Behaviour | People and access (6), words (7), scenarios (8), rules (9). |
| [`03-matrix.md`](./03-matrix.md) | 3. Matrix | The matrix (10), lifecycles (11), checks on paper (12). |
| [`04-launch.md`](./04-launch.md) | 4. Launch | Deliverables including `shared` contracts (13), first slice (14), pilot and launch criteria (15). |

## Technical half — optional craft and engineering (after Gate 4)

*Product-specific deltas only — assumes the skills listed in the header are
installed, so generic architecture, guard and UI rules are never repeated here.
Never silently changes `01`–`04`.*

| File | Craft | What it holds |
|---|---|---|
| [`05-design.md`](./05-design.md) | Design | Languages and theme overrides, screen map, navigation, public target queries, critical states and copy. |
| [`06-architecture.md`](./06-architecture.md) | Architecture | Stack choices, `shared` contracts + package layout, door & event contracts, data ownership, access, real-time, privacy. |
| [`07-verification.md`](./07-verification.md) | Verification | Rules and *What if* mapped to test tiers, enabled guards, demo and pilot readiness checklist. |
| [`08-plan.md`](./08-plan.md) | Delivery | Parallel epochs/waves (`Owns` + `Reads`), task brief, regression cycle, rollout and fallback runbook. |

## Kept throughout both halves

| File | What it holds |
|---|---|
| [`log.md`](./log.md) | Traceable assumptions (`A1`), decisions (`D1`) and open questions (`Q1` with `Blocks`). |
