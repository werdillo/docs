# Filling in the product document

The document exists to make mistakes on paper, where they are cheap. Every
section of the business half (`01`–`04`) is either a **description** — what the
product is — or a **check** — a second view of the same description, drawn so
that a gap or a contradiction shows.

Section by section, the questions to ask and what to avoid; at the end of each
business stage, its **gate** — the check that must pass before the next stage
starts. Each stage maps to one file of [the template](./template/README.md)
(`01-context.md` through `04-launch.md`), optional technical craft lives in
`05-design.md` through `08-plan.md`, and `log.md` is kept across both halves.
Any numbered file may expand into a folder under the same name once it grows
past one sitting (~200–250 lines).

The words are [the shared ones](../../shared/words.md); the matrix is
[the shared matrix](../../shared/matrix.md).

## Where misunderstandings come from

| Source | What catches it |
|---|---|
| One word, two meanings | Words (7) |
| Two roles tangled in one scenario | People and access (6), Scenarios (8) |
| The happy path written, the rest assumed | What if (8), Rules (9) |
| Hidden tenancy, legal or offline assumptions | Constraints and risks (5) |
| A thing created and never ended | Lifecycles (11), Things → scenarios (12.2) |
| A step nobody owns | Walkthrough (12.4) |
| An action nobody is allowed, or everybody is | Roles → actions (12.3) |
| A feature built that no scenario needs | Scenarios → carriers (12.1) |

## Stage 1 — Context (`01-context.md`)

### 1. The idea

The statement is a test, not a slogan. If a part of it will not fill in, that
part is what is not known yet.

- *Who* is one kind of person or business, not "everyone".
- *What they do today* is never "nothing": a spreadsheet, a phone call, a
  competitor, putting up with it.
- *The difference* is one, the one that would make them switch.

### 2. The problem

- **What it costs** — the question that decides whether there is a product. A
  problem that costs nothing is not paid to be solved.
- **Evidence** — say where each claim comes from, and how many people. "Three
  conversations" is honest; "users want" is not evidence.

### 3. Value and success

An outcome is a change for a real group of people, not a feature shipped. Each
has a measure, a target and a date; "more engagement" has none. The stop
condition is written now, while it is easy to be honest.

### 4. Scope

**Not this product** is the column that does the work: write in it what a
reasonable person would expect and will not get. The first version is the
smallest set that completes the core scenario end to end.

### 5. Constraints and risks

Non-negotiable boundaries that shape the matrix from day one — written in
business words, never technology names:

- **Isolation / tenancy** — single customer, or strict separation between
  organisations so one can never see another's data.
- **Privacy and legal** — data minimisation, retention windows, legal
  disclaimers (for example "not a fiscal receipt" or "allergen claims confirmed
  only by the restaurant").
- **Failure fallback** — how the business keeps operating if the service is
  down.
- **Devices and freshness** — minimum screen size (`320 px` or `360 px`),
  offline needs, or live updates without reloading.

### Gate 1 — Context

- [ ] The positioning statement fills in, every part.
- [ ] The cost of the problem is named, with a number or a reason there is none.
- [ ] Evidence is stated with its source and its size.
- [ ] Every outcome has a measure, a target and a date, plus a stop condition.
- [ ] *Not this product* has at least three concrete lines.
- [ ] Non-negotiable constraints (isolation, legal/privacy, fallback, devices) are named.
- [ ] The riskiest belief behind the idea is in `log.md` Assumptions.

## Stage 2 — Behaviour (`02-behaviour.md`)

### 6. People and access

A role is a reason to come, not a job title. The same person can hold two
roles; two job titles that come for the same thing are one role. Include
operators and the system itself when it runs timed work. State **how each role
enters** (*anonymous*, *opaque link token*, *signed-in role*, *tenant-scoped*)
— this bridges directly into access rules in code.

### 7. Words

Most misunderstandings are one word read two ways. Is an *order* placed or
paid? Is a *bestseller* computed from sales or picked by hand? Write the word,
what it means, and — the column that catches it — what it does **not** mean.
From then on the document, the screens and the code use it in that meaning
only.

### 8. Scenarios

- **One role, one goal each.** A scenario with "and then also" or two different
  actors ("staff updates status and guest watches it") is two scenarios linked
  by a lifecycle.
- **The trigger and the end are concrete.** "Starts when a shopper presses
  *Place order*" — "ends when the order is written and the stock is taken".
- **Must not** is the most useful line in a scenario: each becomes a rule (9),
  and from there the all-or-nothing of a process and a test in code.
- **What if** is where the happy path is broken on purpose. Answer every row
  that applies; each answer is a step, a rule, a new scenario, or a line in
  *Not this product*. "It won't happen" is an answer only with a reason.
- **Name it as a verb and its object** — *place an order*, *restock a product*.

### 9. Rules

A rule is a sentence that is true after every scenario, not a step in one:
"stock is never below zero", "an order keeps the price it was placed at". The
*Must not* lines and *What if* answers are where rules come from. Each is
numbered (`R1`, `R2`…) so screens and tests can point at it; who keeps it is
filled in at stage 3, and a rule no box can keep says the matrix is wrong.

### Gate 2 — Behaviour

- [ ] Every role has an access mode and at least one scenario, and every scenario has one role.
- [ ] Every word two people used differently is in Words (7).
- [ ] Every scenario answers its *What if* cases.
- [ ] Every *Must not* is a numbered rule in Rules (9).

## Stage 3 — Matrix (`03-matrix.md`)

Draw from the scenarios. Read them and underline the nouns the business keeps —
a product, a cart, an order, a stock level. Those nouns are the boxes'
candidates; the verbs between them are the processes'.

### 10.1 Domains

A domain is a subject the business could talk about for an hour without
mentioning another: selling, booking, menu, publishing. Most products start
with one. Two domains never reach into each other; what both need is a common
capability (10.3).

### 10.2 Boxes (and box groups)

Each candidate is tested by [the three signs](../../shared/matrix.md#a-box):

- **One sentence, no "and".** "What a shopper is about to buy" — a box.
  "Products and their stock" — two boxes.
- **It keeps its own things.** Each thing in *What it keeps* is in exactly one
  box. A thing in two boxes is drawn wrong; the other box keeps its id.
- **It changes as one.** Imagine three requests from the business. If each
  lands in one box, the lines are right; if each touches the same two, they are
  one box or need a process.

*What it lets others read* is the box's door: what another box may ask it,
never change. **`shared`** is for what every box of the domain uses and no box
owns — money, a locale, a tenant id — not for a box that has no home yet.

Past about ten boxes a domain, or when one box accumulates several independent
lifecycles (for example `catalogue` holding dishes, translations, ingredients
and modifiers), split it into a **box group** (`<group>/<sub-box>`) or a second
domain.

### 10.3 Common capabilities

Accounts, media, payments, notifications, exchange rates, analytics: needed by
every domain, about none of them. Draw a capability here as soon as a second
domain needs it, or even with one domain when it is plainly not that domain's
subject.

### 10.4 Processes

A process is drawn when a scenario **changes** things in more than one box, or
**reads** several boxes into one combined view (such as a catalogue, search or
dashboard).

- **The line** lists the domain boxes — and any common capabilities read
  synchronously (such as `exchange-rates`) — in order.
- **All or nothing?** Yes when a half-done result violates a *Must not* of its
  scenario. That is one atomic unit of work in code.
- **Afterwards** lists reactions that run after the write finishes and must not
  undo it — an email, analytics logging, or a **live push** to a screen that
  must update without reloading.

### 10.5 The grid

Fill a cell only when a scenario needs it. A box reaches `shared` always;
another box only to read, one way, never in a cycle; a change across boxes only
through a process. Common capabilities sit below every domain and are reached
only where declared in 10.3 and 10.4. Many "door" cells between the same boxes
say a process is missing.

### 11. Lifecycles

For every thing that changes state — an order, a booking, a dish, a cart — list
its states and every move between them, each with the scenario that makes it:

- **Every state is reached** by some move, except the first.
- **Every state is left**, or marked final. A state with no way out and not
  final is where things pile up (an unacknowledged `pending` order left for
  ever).
- **Every move has a scenario and a role.** A state like `cancelled` with no
  owner is a bug caught on paper.

### 12. Checks on paper

The description is done; these are second views of it. Fill them in order, fix
what they find in the sections above, and record each fix in 12.5 and in
`log.md` Decisions.

- **12.1 Scenarios → carriers.** Every scenario lands on a box or a process; a
  box no scenario needs is removed, or a scenario is missing.
- **12.2 Things → scenarios.** For every thing kept: created by, changed by,
  ends by. The *ends by* column is the one usually empty — and the one that
  becomes a support ticket or a privacy leak.
- **12.3 Roles → actions.** Who may do each scenario. A scenario two roles can
  both do needs a reason; a role with no scenario is not a role.
- **12.4 Walkthrough.** Read each cross-box scenario — and any scenario with
  rules or state changes — aloud, one step at a time, naming its box or
  process, what it changes, which transition of section 11 that is, and which
  rules it keeps.
- **12.5 Found on paper.** The list of what the checks caught. It is also the
  document's record that the checks were run.

### Gate 3 — Matrix

- [ ] Every box passes the three signs (and oversized boxes are split into box groups).
- [ ] Every thing kept is kept by exactly one box.
- [ ] Every rule (9) is kept by a box or a process.
- [ ] Every change that spans boxes is a process, with all-or-nothing answered.
- [ ] The grid has no cycle, and no box changes another directly.
- [ ] Every lifecycle state is reached and left or final, and every move has a scenario and role.
- [ ] The checks of section 12 are filled in, and what they found is fixed.
- [ ] No domain has more than about ten boxes.

## Stage 4 — Launch (`04-launch.md`)

### 13. Deliverables

The deliverables are what is built, versioned or shipped separately: `shared`
(shared contracts consumed by every app/service), an API, a public site, an
internal app, a client, firmware, a device. Every deliverable lists only boxes
and processes from section 10 — never new ones.

### 14. First slice

The smallest set of boxes and processes that completes one core scenario end to
end — built first, so the whole line is real before any box is finished.

### 15. Pilot and launch criteria

For products launching to external customers or venues, state the pilot terms
(how many users/organisations, duration, free/paid) and the concrete business
conditions that say the first version is ready.

### Gate 4 — Launch

- [ ] Every deliverable in 13 carries only boxes and processes from section 10.
- [ ] The first slice completes one core scenario end to end.
- [ ] Open questions in `log.md` that block the first slice are answered.

## Technical half — optional (`05`–`08`)

Filled by design and engineering **after Gate 4** (or used during intake to
park technical details from a raw brief so nothing is lost while keeping
`01`–`04` free of jargon). None of `05`–`08` is required to pass Gates 1–4.
Because the relevant principle skills (such as `software/principles/web` and
`design`) are installed during development, `05`–`08` hold **product-specific
choices only** and never repeat generic rules for layers, doors, tokens or
guards.

- **`05-design.md`** — design languages (`internal` / `public`), OpenDesign
  theme & density overrides, screen map using canonical shapes from
  [`design/patterns/`](../../design/patterns/README.md), navigation order,
  public pages' target queries, and critical states/copy.
- **`06-architecture.md`** — stack & project conventions, the `shared`
  contracts package/repo and box layout, a frozen **Door and event contracts**
  table (inputs, outputs, refusal codes mapped to `R1..Rn`, events), data
  ownership, tenancy, real-time transport, and security/privacy safeguards
  answering section 5.
- **`07-verification.md`** — every rule (9) and critical *What if* (8) mapped
  to test tiers, enabled guards, and the demo/pilot readiness checklist.
- **`08-plan.md`** — the **working cycle** (freeze `shared` contracts and
  doors in `serial A` → parallel fan-out on disjoint **`Owns`** write scopes in
  `parallel B` → serial join, full regression and doc re-sync in `serial C` →
  version loop), a copy-paste **Task brief**, and **epochs (`E1`, `E2`…)**
  broken into atomic **tasks (`E1.1`, `E1.2`…)** with `Wave`, `Reads`, `Owns`,
  `Depends on` and *done when* checks. Past ~200–250 lines, expand into a
  folder `08-plan/` (one file per epoch).

**One rule governs the technical half:** `05`–`08` never silently change the
matrix, words or rules. When design or architecture discovers that a box must
split or a rule cannot hold, `03-matrix.md` and `log.md` Decisions change
first.

## Kept throughout (`log.md`)

Every item carries a stable ID (`A1`, `D1`, `Q1`) that is never reused:

- **Assumptions (`A1`…)** — every claim the product depends on that nobody has
  checked. The riskiest is tested first, and cheaply.
- **Decisions (`D1`…)** — a line for every decision or change to the matrix or
  architecture: date, decision, why, any earlier decision it supersedes, and
  which files/sections it touched.
- **Open questions (`Q1`…)** — each with an owner and **`Blocks`** (which gate
  or epoch cannot close until it is answered). A question with no owner is not
  open, it is forgotten.
