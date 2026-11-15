# One page

The whole design in the order a question is asked. This page is a map, not a
copy: each answer is one line and points at the document that owns the rule.
None of the rules is repeated here.

## Where does code go?

Ask in this order and stop at the first yes. Each answer links to the rule
behind it.

1. **About no subject at all** — a client, a format, a primitive that another
   program could use unchanged? → `core`, the package's standard library
   ([the layers](./structure/interaction.md#how-matrices-interact-with-each-other)).
   What maps one provider into the project's terms is an adapter behind a port
   ([a third party](./architecture/seams.md#a-third-party-is-reached-through-a-port)).
2. **Every domain needs it, and no domain owns it?** → a box in `features`
   ([the layers](./structure/interaction.md#how-matrices-interact-with-each-other)).
3. **Belongs to an existing box?** → inside it, in the slice that says what it
   is ([the technical slices](./structure/inside-a-box.md#the-technical-slices)).
4. **Several boxes need it, and it changes none of their data?** → the lowest
   `shared` they all reach: a type or a helper, or a box of its own when it
   holds records they all need. Never a call into one of them
   ([what goes into it](./structure/shared.md#what-goes-into-it)).
5. **A subject of its own** — one sentence without an "and", its own records?
   → a new box, in the lowest matrix its users share
   ([where one box ends](./structure/matrix.md#where-one-box-ends)).
6. **One box reads one thing from another?** → its door, a query, one way and
   never in a cycle
   ([boxes meet through their doors](./architecture/doors.md#boxes-meet-through-their-doors)).
7. **A write through more than one box, or an answer that belongs to none?** →
   a process above them, and a box's commands are called by no other box
   ([processes](./structure/processes.md)).

The last three are about how the code runs, not where it goes.

8. **Another box reacts, but its failure must not undo the write?** → an event
   in the outbox, with the reaction declared in a part
   ([a reaction that must not undo the write](./structure/reactions.md#a-reaction-that-must-not-undo-the-write)).
9. **Outlives the request?** → a job
   ([long work is a job](./architecture/data.md#long-work-is-a-job-never-a-request)).
10. **A lower layer needs it without importing?** → a registry below, and the
    plug in the part of the box that owns the data
    ([invert the dependency](./architecture/seams.md#invert-the-dependency-at-a-seam)).

In every package that has the same box, it goes at **the same path**
([the same box, the same place](./structure/matrix.md#the-same-box-the-same-place)).

## The ladder

[inside](./structure/inside-a-box.md#the-technical-slices) →
[shared](./structure/shared.md#what-goes-into-it) →
[door](./architecture/doors.md#boxes-meet-through-their-doors) →
[process](./structure/processes.md)

## The levels

[`shared`](./structure/shared.md#what-goes-into-it) below ← boxes →
[`_processes`](./structure/processes.md) above

## A write

read first → statements → one batch → guards inside → refuse or retry
([atomic writes](./architecture/data.md#atomic-writes-are-one-transaction-racing-writes-are-versioned))

## A read

one read per box → join in memory → a view, never a row; a list is a summary,
a detail is the full shape; grouped to ~9–10 top-level keys
([a reader sees a view](./architecture/access.md#a-reader-sees-a-view-never-a-row);
grouped by meaning, [wire shapes](./architecture/contracts.md#a-wire-shape-is-grouped-by-meaning))

## A screen

kit components only, layout classes at most → text in one scale → states as
variants from data → three repeats become kit → exported shape first, named
private blocks below ([screens and the kit](./ui/README.md)). The frame is
reached through the frame module ([the frame](./ui/screen-files.md#the-frame)); a
domain's menu is one navigation file ([navigation](../../../design/languages/internal.md#navigation))

## The tests

layers · boundaries · cycles · commands · schema · cross-box keys · owned
writes · public surface · views · same place · access · kit usage
([enforcement](./architecture/enforcement.md#enforcement))

## Not this

a script; one box; a prototype with no subject. Start with boxes and doors; add
the rest on a signal ([scope](./README.md#scope)).
