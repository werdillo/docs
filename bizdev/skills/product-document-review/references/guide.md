# Filling in the product document

The document exists to make mistakes on paper, where they are cheap. Every
section after the first is either a **description** — what the product is — or
a **check** — a second view of the same description, drawn so that a gap or a
contradiction shows. A check that finds nothing is fine; a check skipped is a
misunderstanding postponed to design or to code.

Section by section, the questions to ask and what to avoid; at the end of each
stage, its **gate** — the check that must pass before the next stage starts.
The words are [the shared ones](../../shared/words.md); the matrix is
[the shared matrix](../../shared/matrix.md).

## Where misunderstandings come from

| Source | What catches it |
|---|---|
| One word, two meanings | Words (6) |
| The happy path written, the rest assumed | What if (7), rules (8) |
| A thing created and never ended | Lifecycles (10), things → scenarios (11.2) |
| A step nobody owns | Walkthrough (11.4) |
| An action nobody is allowed, or everybody is | Roles → actions (11.3) |
| A feature built that no scenario needs | Scenarios → carriers (11.1) |

## Stage 1 — Idea

### 1. The idea

The statement is a test, not a slogan. If a part of it will not fill in, that
part is what is not known yet.

- *Who* is one kind of person or business, not "everyone".
- *What they do today* is never "nothing": a spreadsheet, a phone call, a
  competitor, putting up with it.
- *The difference* is one, the one that would make them switch.

### 2. The problem

- **What it costs** — the question that decides whether there is a product.
  A problem that costs nothing is not paid to be solved.
- **Evidence** — say where each claim comes from, and how many people. "Three
  conversations" is honest; "users want" is not evidence.

### Gate 1

- [ ] The statement fills in, every part.
- [ ] The cost of the problem is named, with a number or a reason there is none.
- [ ] Evidence is stated with its source and its size.
- [ ] The riskiest belief behind the idea is in the assumptions (13).

## Stage 2 — Discovery

### 3. The people

A role is a reason to come, not a job title. The same person can hold two roles
(a shop owner who also packs orders); two job titles that come for the same
thing are one role. Include the people who run the product — support, an
operator — and the product itself when it acts on a timer.

### 4. Value and success

An outcome is a change for a role in section 3, not a feature shipped. Each has
a measure and a target; "more engagement" has neither. The stop condition is
written now, while it is easy to be honest.

### 5. Scope

**Not this product** is the column that does the work: write in it what a
reasonable person would expect and will not get. The first version is the
smallest set that completes one scenario for one role end to end.

### 6. Words

Most misunderstandings are one word read two ways. Is an *order* placed or
paid? Is a *customer* anyone who looked, or someone who bought? Write the word,
what it means, and — the column that catches it — what it does **not** mean.
Add a word whenever two people use it differently in a conversation; from then
on the document, the screens and the code use it in that meaning only.

### 7. Scenarios

- **One goal each.** A scenario with "and then also" is two.
- **The trigger and the end are concrete.** "Starts when a shopper presses
  *Place order*" — "ends when the order is written and the stock is taken".
- **Must not** is the most useful line in a scenario: each becomes a rule (8),
  and from there the all-or-nothing of a process and a test in code.
- **What if** is where the happy path is broken on purpose. Answer every row;
  each answer is a step, a rule, a new scenario, or a line in *Not this
  product*. "It won't happen" is an answer only with a reason.
- **Name it as a verb and its object** — *place an order*, *restock a product*.

### 8. Rules

A rule is a sentence that is true after every scenario, not a step in one:
"stock is never below zero", "an order keeps the price it was placed at". The
*Must not* lines and the *What if* answers are where rules come from. Each is
numbered so it can be pointed at; who keeps it is filled in once the matrix
exists, and a rule no box can keep says the matrix is wrong.

### Gate 2

- [ ] Every role has at least one scenario, and every scenario has a role.
- [ ] Every outcome has a measure, a target and a date.
- [ ] *Not this product* has at least three lines.
- [ ] Every word two people used differently is in Words.
- [ ] Every *What if* row of every scenario is answered.
- [ ] Every *Must not* is a rule.

## Stage 3 — Matrix

Draw from the scenarios. Read them and underline the nouns the business keeps —
a product, a cart, an order, a stock level. Those nouns are the boxes'
candidates; the verbs between them are the processes'.

### 9.1 Domains

A domain is a subject the business could talk about for an hour without
mentioning another: selling, booking, publishing. Most products start with one.
Two domains never reach into each other; what both need is a common capability
(9.3).

### 9.2 Boxes

Each candidate is tested by [the three signs](../../shared/matrix.md#a-box):

- **One sentence, no "and".** "What a shopper is about to buy" — a box.
  "Products and their stock" — two boxes.
- **It keeps its own things.** Each thing in *What it keeps* is in exactly one
  box. A thing in two boxes is drawn wrong; the other box keeps its id.
- **It changes as one.** Imagine three requests from the business. If each
  lands in one box, the lines are right; if each touches the same two, they are
  one box or need a process.

*What it lets others read* is the box's door: what another box may ask it, never
change. **`shared`** is for what every box of the domain uses and no box owns —
money, a unit, an address format — not for a box that has no home yet.

Past about ten boxes, a level is missing: a group of boxes inside one of them,
or a second domain.

### 9.3 Common capabilities

Accounts, files, payments, notifications, search: needed by every domain, about
none of them. A capability is drawn here as soon as a second domain needs it;
with one domain, draw it here anyway when it is plainly not that domain's
subject.

### 9.4 Processes

A process is drawn when a scenario **changes** things in more than one box. It
is the line: which boxes, in what order.

- **All or nothing?** Yes when a half-done result is wrong — a *Must not* of
  its scenario. That is one unit of work in code.
- **Afterwards** lists what happens after the line has finished and must not
  undo it — a confirmation email, a loyalty point. These are reactions, not
  steps.
- A scenario that only **reads** several boxes into one answer — a dashboard, a
  report — is a process that reads.

### 9.5 The grid

Fill a cell only when a scenario needs it. A box reaches `shared` always;
another box only to read, one way, never in a cycle; a change across boxes only
through a process. Many "door" cells between the same boxes say a process is
missing.

### 10. Lifecycles

For every thing that is more than a number — an order, a booking, a cart —
list its states and every move between them, each with the scenario that makes
it. Then read the table:

- **Every state is reached** by some move, except the first.
- **Every state is left**, or marked final. A state with no way out and not
  final is where things pile up: an unpaid order kept for ever.
- **Every move has a scenario.** A move nobody makes is either a missing
  scenario or a state that does not exist.

### 11. Checks on paper

The description is done; these are second views of it. Each is quick, and each
catches a different mistake. Fill them in order, fix what they find in the
sections above, and record each fix in 11.5 and in the decisions (14).

- **11.1 Scenarios → carriers.** Every scenario lands on a box or a process; a
  box no scenario needs is removed, or a scenario is missing.
- **11.2 Things → scenarios.** For every thing kept: created by, changed by,
  ends by. The *ends by* column is the one usually empty — and the one that
  becomes a support ticket.
- **11.3 Roles → actions.** Who may do each scenario. A scenario two roles can
  both do needs a reason; a role with no scenario is not a role.
- **11.4 Walkthrough.** Read each scenario aloud, one step at a time, and say
  which box or process does it, what it changes, which transition of section 10
  that is, and which rules it must keep. A step with no box, a change with no
  transition, a rule no step checks — each is a mistake found.
- **11.5 Found on paper.** The list of what the checks caught. It is also the
  document's record that the checks were run.

### Gate 3

- [ ] Every box passes the three signs.
- [ ] Every thing kept is kept by exactly one box.
- [ ] Every rule is kept by a box or a process.
- [ ] Every change that spans boxes is a process, with all-or-nothing answered.
- [ ] The grid has no cycle, and no box changes another directly.
- [ ] Every lifecycle is reached, left or final, and every move has a scenario.
- [ ] The checks of section 11 are filled in, and what they found is fixed.
- [ ] No domain has more than about ten boxes.

## Stage 4 — Handoff

### 12.1 To design

One line per box or process that a person sees. The pattern is a screen shape
from [`design/patterns/`](../../design/patterns/README.md); the navigation is
the domains. A box with no screen — a capability people never see — has no
line. The rules (8) go with it: a rule a person can break from a screen needs a
message on that screen.

### 12.2 To build

The parts are what is built and deployed separately: an API, an admin front
end, a client, firmware, a device. A domain is the same in every part, so a
part lists the boxes it carries, not new ones. How the parts are built is
[software](../../software/README.md) or [hardware](../../hardware/README.md);
this document stops at naming them. The rules become the tests that guard them,
and the *What if* tables the cases those tests cover.

**The first slice** is the smallest set of boxes and processes that completes
one scenario of the first version end to end — built first, so the whole line
is real before any box is finished.

### Gate 4

- [ ] Every box a person sees has a line in 12.1.
- [ ] Every part in 12.2 carries only boxes from section 9.
- [ ] The first slice completes one scenario end to end.
- [ ] Open questions that block the first slice are answered.

## Kept throughout

- **Assumptions** — every claim the product depends on that nobody has checked.
  The riskiest is tested first, and cheaply.
- **Decisions** — a line for every change to the matrix after stage 3: what
  changed, why, which sections it touched. It is how design and code learn the
  matrix moved.
- **Open questions** — each with who answers it. A question with no owner is
  not open, it is forgotten.
