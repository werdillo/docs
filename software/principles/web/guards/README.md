# The structure guards

A few tests stand where leaving the road is expensive — the arrows between
layers, the doors between boxes, the data edges, the schema, access, the shapes
a reader gets. They are the structural part of
[the table in enforcement](../architecture/enforcement.md#enforcement) made runnable; a
behaviour guard — a view's shape, a write against a real database — sits where
the behaviour lives. Every rule they guard stays in the folder that owns it;
each page here describes the **test**: what it checks, the failure it reports,
and what it cannot see.

## Two disciplines

1. **Resolve, do not match.** A guard walks the source, resolves each import to
   the file it loads, and asks its question about the resolved graph. It keeps
   no list of files by hand, and it does not match a path by its text where it
   can resolve it: a door and a file beside it can have the same name, and only
   a resolution tells them apart. Where the question is about text — a class
   name, a write call, a part's argument — the test reads the text, and its page
   says so.
2. **A known list, with reasons.** Every escape hatch is a list of entries; an
   entry names the violation and the reason it stays. The guard fails on a
   violation not on the list, and fails on an entry that no longer matches — so
   the list only shrinks ([guards fail loudly](../testing/helpers.md#guards-fail-loudly)).

## In this folder

What each test fails on is the table in [enforcement](../architecture/enforcement.md#enforcement).

| File | Test |
|---|---|
| [`layers.md`](./layers.md) | Layers, and the layer map |
| [`doors.md`](./doors.md) | Boundaries, cycles, commands, the door's contents, the editing entry |
| [`writes.md`](./writes.md) | Cross-box keys, foreign joins, owned writes, and table declarations |
| [`schema.md`](./schema.md) | Schema |
| [`gates.md`](./gates.md) | Access, and mounts |
| [`jobs.md`](./jobs.md) | Jobs |
| [`ui.md`](./ui.md) | Kit usage, two halves, and public surface |
| [`site.md`](./site.md) | Site — heads, links, sitemap, kept addresses, product UI `noindex` |
| [`placement.md`](./placement.md) | Same place |
| [`module-graph.md`](./module-graph.md) | The walker they share: files, specifiers, boxes and layers |

Each page ends with what its guard cannot see. A template is the test's shape,
trimmed: imports, a long message and a repeated case are elided, and `// …`
marks the cut.

## The order to adopt them

Add a guard when the thing it guards first exists, not before. Each step leaves
the project working, and none is paid for in advance.

1. **A second box** → the layers test. With one box the layers have almost
   nothing to connect; with two, the layer map is a decision worth pinning.
2. **Doors** → the boundary tests: a box reaches a neighbour only through its
   door, and no two doors reach each other. A door needs a neighbour to
   be a door.
3. **Parts and schema** → every table declared by exactly one part, and the
   latest snapshot equal to the models. A part exists once a box owns data.
4. **Joins** → the data edges: no foreign key to another box's table, no join
   across, and no write outside the owner. This comes last in the order, because
   removing a cross-box key is a change to data.
5. **The UI guards** when the kit exists: a screen draws through the kit, the
   plain half of a client stays plain, and the exports map names what it
   promises.
6. **The job gate** when background work exists: the routes that answer with a
   job are listed, and a new one in those routers is added to the list.

Two guards are not on this ladder because their subject is not the tree: the
access audit arrives with the first route that answers, and the placement guard
with the second package that repeats a box, where the twin's path can drift.

**Adopting part-way is allowed.** A guard turned on in an existing project may
start from today's list of violations — a known list that only shrinks — rather
than from a rewrite ([how to use this](../README.md#how-to-use-this)).

## What the guards are not

They are not a proof. Each page names what its guard cannot see, and what holds
that instead: a resolution the walker does not make, a write behind a name it
does not know, a route that belongs in a job and never became one. What a guard
does not see is a rule plus review, never a silent hole.

They are also not a tier. A guard is a unit test that reads source, so it sits
with the composition root's tests and is outside the runtime graph
([a test is not in the runtime graph](../testing/README.md#a-test-is-not-in-the-runtime-graph)).
