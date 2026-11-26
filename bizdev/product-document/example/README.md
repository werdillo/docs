# Small shop

*An example of [the template](../template/README.md), filled in for the first
version of Small shop. [The web example](../../../software/principles/web/example/README.md)
builds this first version and then evolves it further in `growing.md`. The names
and numbers are made up.*

*The first draft of this document had four scenarios. The checks of stage 3
found four more and five rules; what they found, and where it was fixed, is in
[12.5](./03-matrix.md#125-found-on-paper).*

| | |
|---|---|
| **Status** | Launch |
| **Owner** | The shop's owner |
| **Updated** | 2026-11-15 |
| **Skills / principles** | `design`, `software/principles/web` |
| **Active epoch / wave** | `E1 · serial A` |
| **Next action** | Freeze `shared` contracts and run `E1.1` |
| **Blocking Qs** | `Q1` (before `E2` launch) |

## Business half (`01`–`04`)

| File | Stage | What it holds |
|---|---|---|
| [`01-context.md`](./01-context.md) | 1. Context | The maker's problem, value targets, scope and constraints (1–5). |
| [`02-behaviour.md`](./02-behaviour.md) | 2. Behaviour | Shopper and Owner, four words, eight scenarios (S1–S8), five rules (R1–R5) (6–9). |
| [`03-matrix.md`](./03-matrix.md) | 3. Matrix | Domain `shop`, four boxes, three processes, lifecycles and paper checks (10–12). |
| [`04-launch.md`](./04-launch.md) | 4. Launch | Four deliverables (including `shared` contracts), first slice and launch criteria (13–15). |

## Technical half (`05`–`08`)

| File | Craft | What it holds |
|---|---|---|
| [`05-design.md`](./05-design.md) | Design | Public storefront + internal admin languages, screen map, navigation and target queries. |
| [`06-architecture.md`](./06-architecture.md) | Architecture | 4-unit layout (`shared`, `api`, `site`, `admin`), door & event contracts, data ownership. |
| [`07-verification.md`](./07-verification.md) | Verification | R1–R5 and edge cases mapped to test tiers, guards and launch checklist. |
| [`08-plan.md`](./08-plan.md) | Delivery | Parallel epochs/waves (`Reads` + `Owns`), task brief and fallback runbook. |

## Kept throughout

| File | What it holds |
|---|---|
| [`log.md`](./log.md) | Traceable assumptions (`A1`–`A3`), decisions (`D1`–`D3`) and open questions (`Q1`). |
