# Principles

How to arrange a project so that **where a thing is says what it is** — to the
business and to the developer alike. Two parts: the **architecture rules**,
which hold whatever the tools, and the **stack**, which a project fixes once
and keeps. Both are written to be copied into a new project on day one and kept for
its life.

The architecture is **feature matrix design**. [`example/`](./example/README.md)
shows it on one small project, from the folder tree to the code. This page is
the vocabulary, the rules in one list, and where each is expanded — and two
answers asked for most: **where new code goes**
([the questions in order](./cheatsheet.md#where-does-code-go)), and **how much of this a
project needs** — new, small or existing ([how to use this](#how-to-use-this)).

The vocabulary is in [`words.md`](./words.md), and the principles 1–48 in one list in [`rules.md`](./rules.md).

**New here?** Take the [one page](./cheatsheet.md), or read [when it is
overkill](#scope) and [adopting it](#how-to-use-this).

## In one minute

- **A project is a few packages** — the API, a front end, a client — that share
  nothing but a **contracts package** of shapes.
- **A package's `src/` is a stack of layers**, and imports point down it:
  `core ← features ← domains`, with `app` composing them. The **domains**
  (`ecommerce`, `booking`…) are the business's subjects; they never import each
  other, and they have the same folders in every package.
- **Each layer is a matrix of boxes.** A **box** is one subject: one purpose,
  its own data — tables on a server, state on a front end — and opaque from
  outside. What a matrix's boxes have in common
  sits in its `shared`, below them; where several of them meet sits in its
  `_processes/`, above them. A matrix can nest inside another — a **group**.
- **Boxes interact by the first step that works:** stay inside one box; share
  through the lowest `shared` they all reach; read a sibling through its
  **door**, its entry file, one way; and when a write runs through several
  boxes, or links pile up or would make a cycle, meet in a **process** above
  them. A reaction that must not undo the write is not a step on that line: it
  is an event in the outbox, handled after the commit.
- **Data follows the boxes.** A box owns its data — tables on a server, state
  on a front end; another box holds its ids, never a foreign key to them or a
  join across.
- **Inside, a box is technical slices** — `routes`, `handlers`, `services`,
  `model` on a server; `api`, `services`, `hooks`, `ui` on a front end — and
  stays flat while it is small. A component may keep its own small state; a
  hook is where reusable or longer-lived state and behaviour goes.
- **A front end's screens compose one UI kit**, which owns the look — text,
  controls, states, spacing and widths — and grows from what repeats; a screen
  file reads top-down, its shape first ([screens](./ui/README.md)). The look
  is tokens with [OpenDesign names](../../../design/system/tokens.md); an internal system is calm
  and dense ([its design language](../../../design/languages/internal.md)).
- **A few tests guard the expensive edges** — the arrows, the doors, cycles,
  the schema, access, and the shapes a reader gets. Everything else is a
  default, followed unless a reason says otherwise.
- **A box owns its tests, as it owns its data.** They sit beside its slices and
  guard one edge each — its decisions, a write against a real database, a
  screen's contract, the real backend — and one command gates the fast tiers
  ([tests](./testing/README.md)).

**The rules are tier-neutral.** A box, door, `shared`, process and part are the
same in a server, a browser, a client and the contracts package. The tier changes
the slices and the stack — `model`, `routes`, `handlers` on a server; `api`,
`services`, `hooks`, `ui` on a front end — not the rules. A server's data is in
tables, a front end's in state; a server's unit of work is a transaction, a
front end's is a flow. The server examples in these documents are one
realisation of the same idea, not the definition of it.

**The folder tree is the map.** The domains and their boxes say what the
project is about, the layers say which way the arrows go, `_processes` shows
where boxes meet, and a README in each folder says what is in it.
Something that matters but cannot be seen in the tree is missing a place in it.

## Scope

**When this is overkill.** A one-off script, a single-box CRUD, a prototype
whose subject is not settled. The boxes and doors are cheap; `shared`, groups
and processes are not. A project with one box, or a few boxes that share
nothing, pays for them without using them. Add a level when its signal shows,
not before. What a small project keeps, and how an existing one comes in, is in
[how to use this](#how-to-use-this).

## Where does it go

The questions for where new code goes are asked in order, in
[the cheatsheet](./cheatsheet.md#where-does-code-go).

## A road, not a supervisor

The structure is there to make work easier — a road and good tools — not to
watch over it.

- **Tests are guardrails, not police.** They stand in the few places where
  leaving the road is expensive — the arrows, cycles, the schema, access (the
  table in [`architecture/enforcement.md`](./architecture/enforcement.md#enforcement)) — and they do
  not judge how you drive, only keep you from the edge.
- **Everything else is markings and signposts**: the names, the sizes, the
  steps by which boxes interact, the processes. They are **defaults** — follow
  them unless a real reason says otherwise — or **options**, used when a
  situation calls for one: the mobile and desktop shells. A principle marked
  *guarded* has a test ([enforcement](./architecture/enforcement.md#enforcement)); every
  other one is a default, followed unless a real reason says otherwise, however
  it is worded.
- **The stack is a decision, not a default**: a project fixes it once, and a
  change to a tool is a change to the standard, made for every project, not in one.
- **A structure is judged by how much easier the work became**, not by how many
  rules are kept. A rule that gets in the way more often than it helps is a
  reason to change the rule here, not to go around it in one place.

## The documents

| Folder or file | What it holds |
|---|---|
| [`words.md`](./words.md) | **The words** — one word per thing, from the outside in: project, package, layer, domain, matrix, group, box. |
| [`rules.md`](./rules.md) | **The principles** — the one-line list 1–48, grouped by what they are about, each expanded in its folder. |
| [`example/`](./example/README.md) | **One project, end to end** — a small shop, from its tree to its code, gaining each process when its signal shows. |
| [`cheatsheet.md`](./cheatsheet.md) | **One page** — the questions in order, the ladder, the levels, a write, a read, the tests. |
| [`open-questions.md`](./open-questions.md) | **Known gaps** that are not rules yet; each says what would settle it. |
| [`architecture/`](./architecture/README.md) | **The umbrella** — what the architecture is, and the rules that hold wherever a box sits: seams, composition, contracts, doors, data. |
| [`structure/`](./structure/README.md) | **Macro and micro** — the boxes and where one ends, how they interact inside a matrix, how the matrices and the packages interact, how a box moves between levels, and how one box is built. The levels below and above the boxes, and the reactions that must not undo a write. |
| [`testing/`](./testing/README.md) | **Tests** — where a test lives, what each tier guards, and the helpers and guards they share. |
| [`guards/`](./guards/README.md) | **The reference for the tests** — how each rule is checked: what each structure test checks, the failure it reports, what it cannot see, and the walker they share. Read it when writing one. |
| [`ui/`](./ui/README.md) | **Screens and the UI kit** — the design language and its tokens, how a front end's screens compose one kit, how the kit grows, and how a screen file reads. |
| [`stack/`](./stack/README.md) | Allowed languages, what a stack must provide, and where the stack shows through the rules. |

## How to use this

- **Reading.** This page, then [`cheatsheet.md`](./cheatsheet.md), then
  [`example/`](./example/README.md); after that, the folder for the question at
  hand — the list above says where each rule is expanded. In full, the order is
  [`architecture/`](./architecture/README.md), then
  [`structure/`](./structure/README.md) (its matrix, its boxes, and the levels
  below and above them), then [`ui/`](./ui/README.md) and
  [`stack/`](./stack/README.md): the whole, then macro, then micro, then the
  levels below and above the boxes, then the screens, then the tools.
- **Starting a project.** Put this folder in it before writing code. Take the
  [stack](./stack/README.md) as it is; draw the domains and their boxes first — they
  are questions about the business, answered before a line is written
  ([where a box ends](./structure/matrix.md#where-one-box-ends)); write the
  structure tests ([enforcement](./architecture/enforcement.md#enforcement)) as soon as
  there is a second box.
- **A small project** — a prototype, one developer, a few screens — keeps the
  layers, a folder per box, the doors and the layers test, and nothing more
  yet: groups wait for the [matrix size](./structure/matrix.md#sizing),
  processes for [their signal](./structure/processes.md#late-on-a-signal),
  slices for the [box sizes](./structure/sizes.md#flat-when-small-and-the-sizes).
  Nothing here is paid for in advance; what needs none of it is in
  [scope](#scope).
- **An existing project** comes in by the cheapest step first, each one leaving
  it working: draw the domains and the boxes; move folders into the layers and
  turn on the layers test; give the boxes their doors and turn on the
  boundaries test; give them their parts and turn on the schema test; remove
  cross-box foreign keys last, because that is a change to data. A test turned
  on part-way may start from today's list of violations, a list that only
  shrinks.
- **Changing a tool** is a change to the standard, made here and in this
  repository's [conventions](../conventions/README.md) — its one full realisation —
  for every project, not swapped for a favourite in one. The architecture rules
  are the reason a change has to earn its place.
