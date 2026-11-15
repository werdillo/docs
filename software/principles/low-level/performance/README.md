# Performance

The large wins — a hundred times, a thousand — are in the design, which is
exactly when nothing can be measured yet. After the code exists, a profiler
finds the last 20%. So performance is thought about first, with arithmetic,
and measured after, with benchmarks.

It comes second to safety and is rarely in conflict with it: bounded memory,
batches and a program that runs at its own pace are the same decisions seen
from the other side. Where speed would cost a safety rule, the rule is broken
on purpose, in the smallest place, with a measurement and a sentence beside
the code.

## In one line

**Sketch, separate the planes, lay the data out for the loop, then
measure — and keep every claim a number.**

## The order of the work

1. **[The sketch](./sketch.md)** — before the code: each of the target's
   resources, in bandwidth and latency; the slowest first, weighted by how
   often it is used.
2. **[The two planes](./planes.md)** — decisions once per job, written for
   safety; data moved in batches by a loop that decides nothing.
3. **[Data layout](./data-layout.md)** — the data arranged for the loop that
   reads it: slices, struct of arrays, hot and cold apart, a list per state.
4. **[SIMD](./simd.md)** — for a loop a measurement named, with a scalar
   oracle beside it.
5. **[Measuring](./measuring.md)** — a benchmark with its budget, in the
   mode that ships.

Two costs run under all of them: [comptime](./comptime.md), paid in code
size, and [allocations](./allocations.md), kept few and counted.

## In this folder

| File | What it holds |
|---|---|
| [`sketch.md`](./sketch.md) | The sketch before building, and the slowest resource first. |
| [`planes.md`](./planes.md) | The control plane and the data plane, batching, and the hot path made explicit. |
| [`data-layout.md`](./data-layout.md) | Data-oriented design: know the data, boxes by subject and layout by loop, struct of arrays, hot and cold, smaller items, a list per state, comptime in the data plane. |
| [`simd.md`](./simd.md) | Vectors with `@Vector`: when, the scalar oracle, the tail, the checks per lane, saturation, selects, other instructions. |
| [`comptime.md`](./comptime.md) | What comptime costs in code size: instances, tables, `inline for`, measured on a chip. |
| [`allocations.md`](./allocations.md) | Few allocations, each large; none hidden; the count asserted in a test. |
| [`measuring.md`](./measuring.md) | A claim is a number: the benchmark, its budget, the clock, and why it is not in the gate. |
