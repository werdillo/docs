# `shared` — the level below the boxes

A matrix has two levels besides its boxes. **`shared`** is below them: what
they have in common, which every box of the matrix may use. **`_processes`** is
above them: where several boxes meet, which no box may use
([processes](./processes.md)). What is common goes down, into the one place all
its users can reach; what connects them goes up, into the one place that
reaches them all.

```
ecommerce/
  shared/                      ← below the boxes: what they have in common
    codes.ts                   ← a pure helper every box uses
    checkout/                  ← a contract: the shape a refused placement takes
    ledger/                    ← a box of its own: records several boxes need
  sales/  products/  …         ← the boxes
  _processes/                  ← above the boxes: where they meet
```

## What goes into it

A `shared` holds only what is **common and stable**:

- **types, pure helpers and contracts** the boxes agree on;
- **a box of its own, when several boxes need the same records or the same
  I/O.** It owns its table like any box and declares it in its part: the
  others **read** its model by path, and **write** only through what it
  exports: an action, or — when the write must join the caller's batch — the
  **statements** of its step. The ledger is both: `moveAdjustments` runs its own
  batch, and `moveAdjustmentsStatements` is what `place-order` puts in its
  batch. A ledger of price adjustments is one — a cart's pricing replaces its
  rows, placing an order moves them onto the order, promotions count them; kept
  in any one of those boxes, it made a cycle between them.

It goes in the **lowest** `shared` all of its users can reach, and nowhere
higher: what two boxes of one group share is in that group's `shared`, not the
domain's.

## What never goes into it

- **Coordination.** A `shared` never imports a box of its matrix, and never runs
  a step that spans boxes — work that does is a process, one level up.
- **A forward to a box.** Re-exporting B's functions from `shared` for A is the
  direct link with its name hidden: the dependency disappears from A's imports,
  `shared` now stands above B, and a cycle through it no longer shows.

A test fails on a `shared` that reaches a box.

## Breaking a cycle with a contract

When two boxes of a group each need the other, `shared` may hold the
**contract** between them — a type and a slot, no I/O, no box imported. The box
that owns the work fills the slot at startup; the other calls the slot instead
of importing its sibling. It is the seam below a lower layer
([architecture](../architecture/seams.md#invert-the-dependency-at-a-seam)), drawn
inside one group, and it is used only for a cycle that has no simpler fix. Two
slots between the same pair are a warning; a third says the line between the
boxes is drawn in the wrong place.

## At every level

- **Sub-boxes talk to each other through a local `shared`** — the one inside
  their common group.
- **The top-level `shared` is available to every box of the matrix** — it is the
  common ground of the whole matrix.
- **A `shared` may itself have boxes, and those may have their own `shared`.**
  When two of its boxes have something in common, it goes into a
  **`shared/common`** — by the same rule one level down.

So it is one rule at every scale — *the common thing lives in the `shared` the
sharers can all reach, and nowhere else* — which is what keeps a `shared` from
becoming a dumping ground and a box from quietly importing its sibling.

## How it is reached

What lies below is imported **by path**, not through a door: a box imports the
file it needs from its `shared`, in full. A box inside a `shared` is part of
that ground — an entry file there is a convenience, never a gate — and its rows
are still written only through what it exports. Its statements are imported by
path, like its model, and run by the caller's batch; the box still owns them. It
is one of the exceptions to the door rule
([architecture](../architecture/doors.md#exceptions-and-their-conditions)).

## Changing it

A `shared` has the largest blast radius in its matrix: a change to it is a
change to every box that reaches it. Treat it as the matrix's public API — a
change is reviewed against every box that uses it, and what only two boxes need
moves down into their group, or up into a process, rather than in.

## Why

**The boxes stay apart, and what they share has a name.** Without a `shared`,
a box reaches into its sibling for a type or a rule, and the siblings slowly
become one. With it, what is common is in one place, below everyone, and the
arrows still point down.
