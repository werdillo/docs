# Principles for Zig

How to write a low-level program so that **what it can do is bounded and
visible** — its memory, its loops, its failures and its dependencies — and so
that where a thing is still says what it is. Written for any program in Zig — a service, firmware for a microcontroller, a
library, a tool — as a central reference for people and for agent skills. The
ideas — bounded memory, fixed loops, explicit errors and simulation — apply to
any systems language; the rules, examples and guards here are expressed in Zig.
Learning Zig itself lives in [`languages/zig/`](../../languages/zig/README.md).

Three sources, one set of rules:
[NASA's Power of Ten](https://spinroot.com/gerard/pdf/P10.pdf) for what a
program may not do, [TigerStyle](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md)
for how that is lived in Zig, and feature matrix design for where code goes.
Which rule comes from where, and where these documents depart from a source, is
in [`sources/`](./sources/README.md).

The vocabulary is in [`words.md`](./words.md), and the principles 1–44 in one
list in [`rules.md`](./rules.md).

The core words and the matrix, shared by every section of this repository, are in [`shared/`](../../../shared/README.md).

**New here?** Take the [one page](./cheatsheet.md), then the page for
[the kind of program](./kinds/README.md) you are writing.

## In one minute

- **Safety, then performance, then developer experience.** All three matter;
  the order says which wins when they pull apart.
- **Everything has a limit, and the limits are named.** Every loop, queue,
  buffer, retry and wait has an upper bound; the bounds are constants in one
  file, and the relations between them are asserted at compile time.
- **All memory is fixed before the work begins** — at compile time, or at
  startup from the limits, or handed in by the caller, in few allocations.
  Nothing is allocated while the program works, so what it can use is known
  before it runs.
- **Control flow is simple.** No recursion, no hidden jumps, few abstractions.
  A function fits on a screen — 70 lines — and one function owns the branching
  while its helpers compute.
- **Assertions say what must be true; errors say what went wrong outside.** A
  broken assertion is a bug and stops the program. A bad packet, a full disk
  and a sensor that does not answer are values, and every one is handled.
  Input is never asserted on: it is parsed once, at the boundary.
- **The program runs at its own pace.** An outside event — a connection, an
  interrupt — is recorded; the main loop does a bounded batch of each kind of
  work per turn.
- **The code is a stack of layers, and imports point down**: `limits ← core ←
  boxes ← main`. `limits` holds compile-time bounds and imports nothing; `core`
  holds reusable primitives with no subject of the program and imports only
  `std`; subject **boxes** sit above `core`, each with its own state, reached
  through its **door**. `main` is the only place that knows everything.
- **One owner per piece of state.** Everyone else holds a handle — an index
  into the owner's pool — not a pointer. Threads and interrupts share only
  what is named for it.
- **What is known when the program is built is decided then.** Tables,
  sizes and the target's facts are comptime, and the build checks them.
- **Performance is designed, then measured.** A back-of-the-envelope sketch
  of the target's resources comes before the code, the slowest is served
  first, work is batched, data is laid out for the loop that reads it, and a
  claim about speed is a benchmark with a budget.
- **One toolchain, no dependencies by default.** Zig for the program, its
  build and its scripts; one command checks everything.
- **A few checks guard the expensive edges** — the arrows and the doors in
  the build, the function length and banned text in tidy, the memory that
  must not grow in the allocator. Everything else is a
  default, followed unless a reason says otherwise.

**The rules are kind-neutral.** A limit, an assertion, a box and a door are
the same in a server, in firmware, in a library and in a tool. The kind
changes how a rule is realised — where memory comes from, what the main loop
waits on, what "the outside" is, what a crash does — not the rule. How each
kind realises them is in [`kinds/`](./kinds/README.md); the examples in the
other documents are one realisation, not the definition.

**The folder tree is the map.** The boxes say what the program is about, the
layers say which way the arrows go, and the limits file says how big it can
get. Something that matters but cannot be seen in the tree is missing a place
in it.

## Scope

**What this is for.** A program where a crash, a stall or unbounded growth
is expensive, or where the resources are small and fixed: a server, a
daemon, a storage engine, firmware, a library others build on, a tool that
runs unattended.

**When it is overkill.** A one-off script, a build step, a prototype whose
subject is not settled. There the layers and the fixed memory are paid for
without being used. Keep the limits, the assertions, the error handling and
the function size — they cost nothing in advance — and add the rest when the
program is going to stay.

**What it does not cover.** Screens, databases with a schema, a contracts
package shared by several packages. A project with those takes them from the
principles written for them.

## A road, not a supervisor

The structure is there to make work easier — a road and good tools — not to
watch over it.

- **Checks are guardrails, not police.** They stand in the few places where
  leaving the road is expensive (the table in
  [`testing/guards.md`](./testing/guards.md#enforcement)), and they do not judge
  how you drive, only keep you from the edge.
- **Everything else is markings and signposts.** A principle marked *guarded*
  has a check; every other one is a **default**, followed unless a real reason
  says otherwise, however firmly it is worded. A reason is a sentence beside
  the code.
- **The safety rules are firmer than the rest.** A default about a name bends
  easily. A default about a bound, an allocation or an unhandled error bends
  only with a written reason, because what it prevents is found in the field,
  not in review.
- **A structure is judged by how much easier the work became**, not by how
  many rules are kept. A rule that gets in the way more often than it helps is
  a reason to change the rule here, not to go around it in one place.

## The documents

| Folder or file | What it holds |
|---|---|
| [`words.md`](./words.md) | **The words** — one word per thing: box, door, limit, handle, main loop, operating error. |
| [`rules.md`](./rules.md) | **The principles** — the one-line list 1–44, grouped by what they are about, each expanded in its folder. |
| [`cheatsheet.md`](./cheatsheet.md) | **One page** — where code goes, a function, a loop, memory, a failure, FFI, tests, the checks. |
| [`starting.md`](./starting.md) | **Day one** — the minimal folder tree, `build.zig`, `limits/root.zig`, conventions checklist, and parallel work across boxes. |
| [`kinds/`](./kinds/README.md) | **One rule, four realisations** — what the rules become in a service, in firmware, in a library and in a tool. |
| [`sources/`](./sources/README.md) | **Where each rule comes from** — the Power of Ten and TigerStyle, rule by rule, where these documents depart, and the text of TigerStyle itself. |
| [`open-questions.md`](./open-questions.md) | **Known gaps** that are not rules yet; each says what would settle it. |
| [`safety/`](./safety/README.md) | **What the program may not do** — control flow, limits, memory, assertions, errors. |
| [`structure/`](./structure/README.md) | **Where code goes, and how it reads** — the layers, the boxes and their doors, the composition root, how one function is built, names, comments and the numbers. |
| [`performance/`](./performance/README.md) | **Designed, then measured** — the sketch, the slowest resource, the two planes, batching, data laid out for the loop that reads it, and SIMD. |
| [`testing/`](./testing/README.md) | **Tests** — where a test lives, what each tier guards, determinism, and the guards. |
| [`toolchain/`](./toolchain/README.md) | **The tools** — one pinned compiler, dependencies, build modes, the one command. |
| [`example/`](./example/README.md) | **Two programs, end to end** — a media file server and a sensor node, from the sketch and the tree to the code and its tests. |

## How to use this

- **Reading.** This page, then [`cheatsheet.md`](./cheatsheet.md), then the
  [kind](./kinds/README.md) you are writing and the
  [example](./example/README.md); after that, the folder for the question at
  hand. In full, the order is [`safety/`](./safety/README.md),
  [`structure/`](./structure/README.md),
  [`performance/`](./performance/README.md),
  [`testing/`](./testing/README.md), [`toolchain/`](./toolchain/README.md).
- **Starting a project.** Follow [`starting.md`](./starting.md): pin the
  compiler version, write the sketch and the limits file first — how many of
  each thing, how large, how fast, and how much memory that adds up to — before
  a line of feature code exists
  ([sketch before building](./performance/sketch.md#sketch-before-building)).
  Then wire `build.zig` (`layer_map` and `zig build check`), the composition
  root, and the first box.
- **A small project** keeps the limits file, the assertions, the error
  handling, the 70 lines and the one command. The layer map waits for the
  second box.
- **An existing project** comes in by the cheapest step first, each one
  leaving it working: run the formatter and the line limit; name the limits it
  already has; add assertions where a bug was last found; turn on a guard
  starting from today's list of violations, a list that only shrinks; fix
  memory before the work begins last, because that is a change to the design.
- **A project's own choices** — its limits, its boxes, its target, its
  compiler version — are not here. They are in that project's conventions,
  which link to these rules and do not copy them.
