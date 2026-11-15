# Processes — the level above the boxes

A matrix has two levels besides its boxes. **`shared`** is below them: what
they have in common, which every box may use. **`_processes`** is above them:
where several boxes meet, which no box may use. A process imports the doors of
the boxes it needs and does what is between them; the boxes do not know it
exists.

Most work is one box's. Some is not: a checkout is a cart, stock, an order and
a payment, in an order — several boxes on one line, like stations on a
conveyor. A **process** is that line, given a folder and a name. Calling into
other boxes is its whole job, and it is the only place that calls their
commands: every write between them goes through it.

A process answers "what does it do", not "what is it", so its name is a verb
with its object — `place-order`, `browse-catalogue`. It holds only what belongs
to no box: **the line** — which boxes, in what order, what is one unit of work
(a transaction on a server, a flow on a front end), what is checked — and what
starts it: a route on a server, a screen or an action on a front end. Each box
keeps its own entry points, reads and actions.

On a server of this stack it looks like this:

```
ecommerce/
  shared/                                ← below the boxes: what they have in common
  sales/
    carts/  orders/  stock/  invoices/   ← the boxes: their routes, handlers, services, model
  _processes/                            ← above the boxes: where they meet
    purchase/                            ← a group of processes
      place-order/                       ← a process
        index.ts  router.ts  types.ts
        routes/place.ts                  ← "place this cart": the route belongs to the process
        handlers/placeOrder.ts           ← reads the request, calls the line, answers
        services/line.ts                 ← price → stock → order → ledger, one batch
      browse-catalogue/                  ← a process that only reads
```

The `_` marks the one folder in a matrix that is neither a box nor `shared`,
and puts it at the top of a listing.

## Writing and reading

Most processes change data: they hold one unit of work — a transaction on a
server, a flow on a front end — over the boxes on their line, the guards that
keep it safe against a racing request, and a retry. A process that only reads —
a page put together from several boxes, which do not join — holds none of that:
no unit of work, no guards, nothing to undo. Every
rule below holds for it too. Whether a process writes is a property of the process, not a kind of it.

## How it works

Three levels, and the arrows go one way:

```
what starts a process  →  its line  →  the boxes' doors
```

- **A process owns what starts it** — a route, a screen, a job. It lives with
  the process, not with a box, and calls the line as an ordinary function. A box
  never calls a process: that is the arrow that would close a cycle.
- **A process knows its participants.** It imports the doors of the boxes on its
  line and calls them in order.
- **A process that writes runs one unit of work.** On a server that is one
  transaction; on a front end, one flow the page can retry. Each step is an
  action of the box that owns its data; the process reads what it decides on,
  then runs the boxes' steps together, with the guards that keep them true. How
  a step is handed over is the stack's — on this one, each box gives the
  statements of its step unrun and the process runs them as one batch
  ([`stack/where-it-shows.md`](../stack/where-it-shows.md#where-the-stack-shows-through)). The exception this
  makes to "a box owns its data" is listed in
  [`architecture/doors.md`](../architecture/doors.md#exceptions-and-their-conditions);
  [`example/processes.md`](../example/processes.md#4-checkout-the-first-process) shows it in code.
- **A process reads in waves, then writes once.** Reads that do not depend on
  each other go together, and the steps' statements go as one batch, so a
  line's latency is the number of waves the data needs, not the number of boxes
  ([performance](../stack/performance.md#what-the-architecture-asks)).
- **A process holds the line and what starts it** — no data of its own, no
  reads beyond what the line needs to decide.
- **A process imports boxes only through their doors.** Other processes, one
  way, and shared code are imported directly; nothing inside a box is reached.
  When what it gives a registry below spans boxes — a route resolver that
  answers through it, say — it declares a part in its own entry, as a box does
  in its door
  ([inside a box](./inside-a-box.md#a-box-owns-everything-about-itself)).
- **A box's services and model never reach a process.** They stay below every
  process; that is what keeps the arrows one way.
- **A process may call another process, one way** — never the other way: two
  processes calling each other are two lines with no order to run in.
- **A process lives in the lowest matrix that holds every box it connects.** What
  is common sits at the nearest point below, what connects at the nearest point
  above.
- **Grouping is optional, as for boxes.** A `_processes` folder stays flat up to
  about eight or nine; past that, group the processes the way boxes are
  grouped — one matrix, with no nesting, at the
  [matrix size](./matrix.md#sizing). A group folder has no index of its
  own.
- **A process has a box's layout** — the slices of its package, flat while it
  is small; the package's guide says which.
- **A process is one file when it has one step and reads as one file; otherwise a
  folder.** Its routes, handler and line share that file. A second step, or a file
  of its own that grows past what one read holds, makes it a folder.
- **A process is small**: a few files for the line and its routes. A process larger
  than the boxes it connects is a box that has moved house — move it back.

A test fails on a box's services or model importing a process, a process importing
a box other than through its door, and on two doors reaching each other.

## A box's commands are called only by a process

A box's door says which of its exports change data. Its **queries** read or
compute; its **commands** change something — a statement for a batch, a guard
in one, an insert, a job or an event queued, an effect in another system. When
a process calls a box's commands, the door keeps them apart: it re-exports a
`commands.ts` beside it whole, the one list of them. A box whose writes no
process calls needs no such file.

- **Another box's query may be called** one way, through its door, like any call
  between boxes, and never in a cycle (principle 10).
- **Another box's command is called only by a process.** A box never runs another
  box's write, directly or through a helper: a write that spans boxes is a
  line, with its order, its unit of work and its guards in one place. A box's
  commands are imported by its own files and by processes, and by nothing else.
- **Inside a write process, a step takes what the process read.** The process
  reads what it decides on and hands the values to its steps; a participant
  does not read a sibling again for the same decision, so the value checked is
  the value written.
- **What lies below is not "another box" here.** A box in a `shared` below,
  a box in `features` such as an outbox, and `core` are ground, not peers: the
  boxes above them call what they export to change their records — an order
  queues its event, a cart moves its ledger rows — through the exports those
  boxes keep for it ([what goes into `shared`](./shared.md#what-goes-into-it)).
  The rule is about peers: boxes of one domain, and the processes above them.
- **The rule is local.** Whether an import is allowed is read from the import
  itself: a query one way, a command only from `_processes/`. Adding a process
  changes no box's links.
- **On a front end** a box's commands are its actions — the writes it runs
  through the API — and the same holds: a neighbour may read through a box's
  door, and a flow that writes through several boxes is a process. Where a
  front end's boxes rarely import each other, review holds the rule rather
  than a test.

A process's imports show who takes part: each box on the line is imported
through its door (`import { … } from '…/sales/carts'`), and no box
names the process.

**Why reads stay open.** A read changes nothing, so a call to a sibling's query
cannot split a unit of work or reorder a write; closing it would only force a
process where nothing is coordinated. A read is still a dependency: a box that
keeps reaching the same sibling is a sign that the two share something that
belongs in `shared`, or that a page belongs in a process.

## Where they are needed

How many processes a domain has follows from what it is. A domain of
**content** — records kept and served — rarely has one: its boxes have little
to do with one another, and `shared` and the odd one-way link are enough. A
domain of **work** — an order, a return, a booking — is where the boxes stand on
one line, and where splitting into boxes still leaves the line implicit; there
a process names it, and names each answer its pages read from several boxes.

## Late, on a signal

A write that spans boxes is a process from the first one, because only a
process calls another box's commands
([commands](#a-boxs-commands-are-called-only-by-a-process)).
Everything else is put off as long as the boxes, `shared` and an occasional
direct read hold, and added when that has visibly hit its limit, not because it
could be. Reach for one when:

- **a write runs through more than one box** and decides what is
  one unit of work — a checkout, a return, booking an appointment;
- **direct links pile up** — several boxes calling each other to get one thing
  done is a process without a name; a box that is a hub of links is the same
  signal;
- **a dependency would be a cycle** — the work that needs both sides becomes a
  process, and each side stays one way;
- **a box reacts, in the same unit of work, to what happened in another** — the
  reaction is a step on the line, not an import from one box into the other;
- **a box reacts to what happened in another, but its failure must not undo the
  write** — that is not a step on the line: it is an event in the outbox,
  handled after the commit ([a reaction that must not undo the
  write](./reactions.md#a-reaction-that-must-not-undo-the-write));
- **an answer is assembled from several boxes** — a storefront page that is a
  product, its prices, stock, reviews and links: a process that only reads
  owns what serves it.

Reading another box's data is **not** a process: it goes through `shared` or
that box's door, as a query. Adding a process early is paying
for structure before there is anything to structure.

A process that only reads is one place that knows a combination. It is worth
adding when the page is a real answer, read from several routes or screens; a
page that only adds one sibling's query to a box's own answer stays in that box,
and a box that only occasionally appears on it may be better served by `shared`
([what goes into it](./shared.md#what-goes-into-it)).

## What a process is not

A process is a synchronous line inside one request: it returns its result. Work
that outlives the request is a job
([long work is a job](../architecture/data.md#long-work-is-a-job-never-a-request)), and
a message that must go out with a write is queued with it and delivered
afterwards — how the shop's order confirmation is sent.

**There is no level above the domains.** Domains are peers that never know each
other, and a package's composition root assembles them but runs nothing between
them. Work that spans two domains meets **below** them: a registry in `features`
that one domain fills and the other reads
([the seam](../architecture/seams.md#invert-the-dependency-at-a-seam)) — the way a
booking's deposit is paid through the payment providers the shop also uses. An
event is the other way one domain reaches another: its shape is in the
contracts package and its outbox in `features`, so a domain reacts to another's
fact without either importing the other
([a reaction that must not undo the write](./reactions.md#a-reaction-that-must-not-undo-the-write);
[the shop's loyalty points](../example/growing.md#9-loyalty-another-domain-reacts)).

## What the business sees

Boxes, and the processes between them — nothing else. A process is a line the
business would draw as an arrow between its subjects, and its name is a verb it
would use. A folder that brings a word neither the business nor the boxes use
is an abstraction too many.

## Why

**The box stays whole, and the process gets a name.** A box is still read in
one place — everything about carts is in `carts` — and a process is read in one
folder: what the business would draw as arrows between the boxes, written as the
line. It is the same idea as a use case in domain-driven design, or a mediator — the
layer between a controller and the domain — kept apart from the boxes it
connects, the way `shared` is kept apart below them.
