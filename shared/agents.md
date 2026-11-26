# Multi-agent workflow

How multiple AI agents cooperate on a matrix-shaped repository without stepping
on each other's files, saturating the host machine or slipping broken code past
the tests. Tool- and model-agnostic: the roles describe levels of judgement, not
specific vendors or CLIs.

Because a feature matrix splits a system into opaque boxes with disjoint folders
and explicit seams ([matrix](./matrix.md#why-a-matrix-parallelises)), the same
structure turns directly into parallel agent work.

## Why tight boundaries make delegation fast and cheap

Without hard boundaries and automated checks, every task needs the strongest,
slowest model working serially because one loose choice can break neighbouring
modules. Tight rails invert that trade-off:

- **Fixed seams (`shared/` + box doors)** remove architectural guesswork before
  coding starts.
- **Disjoint write scopes (`Owns`)** contain the blast radius of any single
  worker.
- **Deterministic guards and tests** catch mistakes mechanically instead of
  relying on a worker's judgement alone.

Only the thin coordination layer needs strong reasoning; the bulk of the work —
implementing boxes, writing tests, applying mechanical fixes — fans out to
fast, inexpensive subagents running in parallel.

## Three operating modes

Scale delegation up only when the batch pays for the coordination cost, and
never past two levels of subagents:

```text
Mode 1: Solo          Mode 2: One level (~2-12)     Mode 3: Two levels (~15-50)

   Agent                     Coordinator                   Coordinator
                             /    |    \                  /           \
                         Worker Worker Worker       Zone lead       Zone lead
                                                    /   |   \       /   |   \
                                                   W    W    W     W    W    W
```

| Mode | Shape | When to use |
|---|---|---|
| **1. Solo** | One agent works directly | A single box, a small fix, exploratory design, or any serial seam step (`serial A` / `serial C`) where brief-writing costs more than doing the edit. |
| **2. One level** | Coordinator + up to `~10–12` parallel workers | One feature epoch (`08-plan.md`), one domain, or a focused batch of disjoint boxes or files. |
| **3. Two levels** | Coordinator → zone leads → narrow workers | A large monorepo, a wide audit-and-fix sweep, or a multi-deliverable release (`~15–50` tasks) where one coordinator cannot triage and merge every leaf branch cleanly. |

| Role | Responsibility | Capability needed |
|---|---|---|
| **Coordinator** | Splits work into non-overlapping zones or waves, writes briefs, verifies returned branches, merges the integration branch, runs slow and end-to-end suites, reports to the user. | Strongest judgement — architecture, trade-offs, triage and final sign-off. |
| **Zone lead** *(Mode 3 only)* | Owns one domain, package or deliverable: breaks its slice into narrow tasks, dispatches workers, resolves local conflicts, runs package-level checks, returns one clean branch. | Mid-tier judgement — task splitting, discarding false findings, careful merges. |
| **Worker** *(Modes 2 & 3)* | Executes one narrow, well-bounded task inside its own isolated branch or worktree, runs targeted tests for its files, commits and returns a structured report. | Fast, inexpensive execution against an explicit brief. |

- **Never add a third level of subagents.** A third tier adds paraphrasing and
  context loss without adding speed.
- **Run workers through a managed orchestrator**, not detached background shell
  jobs. The coordinator needs live state, completion wakeups and a channel to
  answer questions or steer a worker; an unmanaged shell process hangs silently.

## Two run shapes

### 1. Feature delivery (`serial A → parallel B → serial C`)

Used for planned epochs ([`08-plan.md`](../bizdev/product-document/template/08-plan.md)):

1. **Wave A — Freeze seams (`serial A`).** Update shared contracts (`shared/`),
   box doors, tokens, schema and migrations first so every downstream worker
   builds against fixed interfaces.
2. **Wave B — Fan-out (`parallel B`).** Dispatch workers (or zone leads) across
   strictly disjoint `Owns` folders in isolated worktrees. No parallel worker
   edits `shared/`, migrations, lockfiles or the composition root.
3. **Wave C — Join and regress (`serial C`).** Merge all parallel branches, wire
   them in the composition root, run the full verification and slow suites
   across all prior epochs, and sync docs before opening the next epoch.

### 2. Wide read-only audit and targeted fix

Used to inspect and harden an existing codebase:

1. **Read-only audit fan-out (broad, `20–50` slices).** Slice by `domain ×
   aspect` (business logic, UX, performance, security, cross-package contracts,
   doc-vs-code drift, test quality). Every auditor reads one shared clean
   checkout and writes findings in a strict machine-readable schema (ID,
   severity, kind, `file:line`, failure scenario, proposed fix, size, migration
   needed, confidence). Zero file edits, zero tests, low host load.
2. **Coordinator triage.** Read the highest-severity findings first to calibrate
   quality, drop weak or false items, defer migration-heavy items to a separate
   wave, and group accepted findings by file path into non-overlapping zones.
3. **Zone fixes.** One zone lead per zone (or one worker per `10–15` related
   findings). Every fixer verifies each finding against the real code before
   editing — audits produce false positives.
4. **Staged merge.** Merge conflict-free branches first, then conflicting
   branches one by one while preserving every valid fix.
5. **Serial migration wave.** Run schema or shared-contract migrations in one
   dedicated wave off the merged integration branch so migration numbering stays
   clean.
6. **Sequential slow suites and final delivery.** Coordinator runs the full
   check, browser and live suites, fixes remaining failures by suite, lands the
   result and cleans up temporary worktrees.

## The brief

A freshly spawned agent has none of the coordinator's memory or conversation
history. Every brief states six things explicitly:

1. **Read first:** installed principle skills, package conventions, and the exact
   files or box READMEs needed (keep the read budget small).
2. **Write boundary (`Owns`):** exact paths the agent owns, neighbouring paths
   it may read only, and forbidden paths (including any files with uncommitted
   user edits).
3. **Hard prohibitions:** no migrations unless assigned, no shared-contract or
   composition-root edits during parallel waves, no slow browser/live suites in
   parallel, never push, never switch branches.
4. **Test integrity:** never delete, skip (`.skip`, `todo`) or weaken existing
   assertions to make a suite pass. If an existing test encodes wrong behaviour,
   report it explicitly rather than silencing it.
5. **Proof of done:** the exact verification command that must pass.
6. **Return format:** one line per item (`fixed | skipped (reason) | partial`),
   plus any file touched outside the assigned zone or any missing seam that
   blocked the task.

## Parallelism is bounded by the machine

- **Read-only and edit-only work scales wide** (`20–50` concurrent workers —
  orienting signal), bounded mainly by API rate limits, memory per process and
  dependency setup per worktree.
- **Concurrent test and typecheck runs saturate the host fast** (`10–15`
  concurrent check runs — orienting signal). Running dozens of full suites at
  once drives load through the roof, causing false timeouts and stalled workers.
- **Tier verification by role:**
  - workers run targeted unit tests for only the files they touched;
  - zone leads run package checks once after merging their zone's workers;
  - the coordinator runs the full repository check and slow suites once.
- **Fixed-port suites never overlap.** Never run two copies of the same browser
  or live-server suite simultaneously; different suites run in parallel only
  when each owns a distinct port.

## Merging and verification

An agent reporting *"all checks passed"* is not proof. Before accepting any
returned branch, the coordinator verifies independently:

- **Branch and base:** inspect recent commits (`git log -2`) to confirm the work
  landed on its assigned branch from the expected base commit.
- **Test integrity:** inspect the test diff for removed assertions, added skips
  or weakened matchers (for example checking removed `assert`/`expect` lines and
  added `skip`/`only`/`todo`).
- **Scope discipline:** verify zero edits outside `Owns` and zero touches on
  forbidden files or shared seams.
- **Diff sanity:** confirm the diff size matches the task (no drive-by
  reformatting or unrelated refactors).
- **Conflict resolution:** the best fix for merge conflicts is non-overlapping
  zones up front. When a conflict still occurs, read both sides' commit intent,
  keep both fixes (or one coherent fix if both solved the same bug differently),
  keep both sets of test assertions, verify zero conflict markers remain and
  re-run the affected package checks.
- **Final proof:** run the full verification and slow suites on the merged
  integration branch directly.

## Failures and the user's working tree

- **Stalled or lingering workers:** a live process whose log stops advancing is
  stalled; a worker that already wrote its final report may fail to exit. Detect
  both via the orchestrator and terminate cleanly.
- **Resume with continuation:** when restarting an interrupted worker on the
  same worktree, instruct it to inspect and finish the existing partial work
  first rather than starting from scratch.
- **Separate load flakes from real bugs:** if a test fails during a heavy
  parallel wave, re-run it alone on the integration branch and on the main
  branch; if it fails identically on main, it is pre-existing.
- **Protect the user's working tree:** never touch uncommitted user edits on the
  main branch. Branch workers from the last commit and list the user's dirty
  files as forbidden in every brief. Land verified results into the main working
  tree for the user to inspect, commit only when asked, and delete temporary
  branches only after confirming zero unmerged commits
  (`git rev-list --count main..<branch>` equals `0`).

## Not this

- Spawning a three-tier management chain where two layers only paraphrase the
  coordinator's brief.
- Letting twenty parallel workers edit `shared/`, schema migrations or the same
  box and hoping merge resolution sorts it out later.
- Running thirty full test suites concurrently on one laptop and mistaking
  CPU-starvation timeouts for code bugs.
- Trusting a worker's *"everything passed"* message without inspecting the diff
  for deleted assertions or out-of-scope edits.
- Launching detached background shell loops with no completion signal or way to
  inspect stuck workers.
