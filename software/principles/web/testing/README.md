# Testing

A test is part of the thing it tests, not a parallel tree kept in step by hand.
A box owns its tests beside its slices; a process owns the tests of its line;
the composition root's tests guard the assembly; a contract's tests sit where
its consumer reads it. A few tiers guard different edges, from a box's decision
to the real backend, and each tier stays at its own edge — the expensive ones do
not re-run what a cheap one already proves.

**Tests are a tool, not a dogma.** Ownership is what makes them one: from where
a test sits you read what it is for — its domain, its subject — and, when the
behaviour it guarded is gone, its place tells you it is safe to delete. A test
that has lost its subject is removed the same day; nothing is kept for its own
sake. What is *not* negotiable is the small set of guards that stand where
leaving the road is expensive
([enforcement](../architecture/enforcement.md)); everything else is judged by
whether it still helps.

## In one line

**A test lives where the behaviour lives, and guards one edge.**

## Where a test lives

| Behaviour | Its tests |
|---|---|
| a box | a tests folder beside its slices |
| a process | a tests folder on its line |
| the composition root | the root's own tests, over the assembly |
| a contract | where its consumer reads it |

Nothing else sits at the side. A box that moves takes its tests with it, and a
failing test is found by the same path as the code it covers. The one exception
is a suite that has to boot the whole app — it is one suite at the package root,
its folders mirroring the boxes. The sizes, the naming and that exception are in
[where a test lives](./where-tests-live.md).

## The tiers

| Tier | Guards |
|---|---|
| unit, behaviour | a box's decisions |
| database | a write against a real (test) database, its guards and races included |
| browser | a screen's contract: the roles and names the code may rely on |
| live | the boundary with the real backend |

One expensive edge per tier: a decision is proven once, where it is made, and a
higher tier adds only what it alone can see. What each covers, and what a stub
cannot say, is in [the tiers](./tiers.md); the tool each tier runs on, and what
the light browser is trusted for, is in [the tools](./tools.md).

## A test is not in the runtime graph

Tests read the code they test, and may read another box's files to set up data;
they are not a step on the arrows, behind a door, or in the runtime graph. The
exemption is written down where the structure guards read the graph — test files
and the helpers they share are named, not skipped silently. A test that needs
another box's data prefers the shared fixtures over that box's handlers, so a
broken handler fails the tests about it and not the ones that merely needed a
row ([helpers and guards](./helpers.md)).

## Guards and helpers

A guard is a test on a structure rule; its exceptions are a list that carries a
reason and only shrinks ([enforcement](../architecture/enforcement.md)). A
helper is the vocabulary a suite shares: seed one row, prepare an entity with
its relations, stub one answer — declared once, imported everywhere
([helpers and guards](./helpers.md)).

## One command

The gate is one command — types, lint, unit tests and database tests
([one command checks everything](../rules.md), rule 41). The browser and live
tiers have their own commands beside it, and CI runs those same commands, never
a second invocation that drifts. On this stack the commands are in the
[stack](../stack/README.md) and the project's conventions — testing.

## In this folder

| File | What it holds |
|---|---|
| [`where-tests-live.md`](./where-tests-live.md) | What a test's place says about its subject, and how a suite is named and sized. |
| [`tiers.md`](./tiers.md) | What each tier guards, and why no tier re-tests the one below it. |
| [`tools.md`](./tools.md) | The runner each tier uses, the real browser, and the light browser an agent verifies in. |
| [`helpers.md`](./helpers.md) | The helpers a suite shares, setup across boxes, and why a guard fails loudly. |
