# Structure

> **Shared core.** The idea of a matrix — boxes, their doors, the levels around them — is defined once for every section of this repository in [`shared/`](../../../../shared/matrix.md). That is the source: this page applies it to its own field, and where the two disagree, `shared/` wins and this page is fixed.

Where code goes. The idea in one sentence: the code is **a stack of boxes**,
each one subject with its own state, and an import points down the stack.

Three levels. The **macro level** is the boxes and the arrows between them:
what a box is for and which others it may reach, not how it is built
([`boxes.md`](./boxes.md)). The **micro level** is one function: its length,
who branches, what it takes and returns ([`functions.md`](./functions.md)).
And **style** is how every line reads — names, comments, the numbers
([`naming.md`](./naming.md), [`style.md`](./style.md)).

## In one picture

```
build.zig               ← the layer map: every box, in order, and what each may import
src/
  main.zig              ← the composition root: the entry point; allocates, wires, runs the loop
  limits/
    root.zig            ← every limit
  core/
    root.zig            ← knows no subject of this program: pool, ring buffer, allocator
    pool.zig
    static_allocator.zig
  files/
    root.zig            ← a box's door; a small box is this file alone
  http/
    root.zig            ← the door: what it marks `pub` is the box's surface
    request.zig         ← behind the door
    range.zig
  server/
    root.zig
```

Each box is a folder and a **build module** whose root is `root.zig`. A box
imports a neighbour by name — `@import("files")` — and its own files by
path — `@import("range.zig")`. The compiler refuses the rest
([doors](./boxes.md#the-door)).

## In this folder

| File | What it holds |
|---|---|
| [`boxes.md`](./boxes.md) | The layers, a box and its door, the layer map in the build, the composition root, where a box ends, and the sizes. |
| [`functions.md`](./functions.md) | 70 lines, who owns the branching, signatures, comptime, and the order in a file. |
| [`naming.md`](./naming.md) | Nouns and verbs, case, no abbreviations, units and qualifiers last, names that line up. |
| [`style.md`](./style.md) | Comments that say why, the numbers — formatter, 100 columns, 70 lines — and commits. |

## What is not here

A program of one executable needs less than a system of several packages.
There is no `shared` — what boxes have in common and no subject owns is
`core` (importing only `std`), and types shared by several subject boxes live
in a low subject box above `core`. There is no level of processes — where
boxes meet is a box above
them, and there is always one, because the stack is ordered. There are no
registries a box plugs into: `main` is small enough to name each box itself.

If a program outgrows this — several executables, or more boxes than one
stack can order — the next step is a group: a folder of boxes with its own
door, treated from outside as one box
([sizes](./boxes.md#sizes)).
