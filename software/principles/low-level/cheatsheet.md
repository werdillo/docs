# One page

The whole design in the order a question is asked. This page is a map, not a
copy: each answer is one line and points at the document that owns the rule.

## Priority

**Safety, then performance, then developer experience** — when they pull apart,
the earlier one wins ([rules](./rules.md)).

## Before the code

the [kind](./kinds/README.md) → pin the Zig version ([starting](./starting.md))
→ a sketch of the target's resources × bandwidth, latency → the limits it
implies → the memory it adds up to
([sketch before building](./performance/sketch.md#sketch-before-building))

## Where does code go?

Ask in this order and stop at the first yes.

1. **A number that bounds something?** → `limits`
   ([limits live in one file](./safety/limits.md#limits-live-in-one-file)).
2. **About no subject of this program** — a pool, a buffer, a parser of a
   standard format that another program could use unchanged? → `core`
   ([the layers](./structure/boxes.md#the-layers)).
3. **Shared subject interface used by several boxes** (such as `board` in
   firmware)? → a low subject box above `core`
   ([firmware](./kinds/firmware.md#the-hardware-is-one-box)).
4. **Belongs to an existing box?** → inside it
   ([a box](./structure/boxes.md#a-box)).
5. **A subject of its own** — one sentence without an "and", its own state? →
   a new box, placed in `layer_map` below its users
   ([where one box ends](./structure/boxes.md#where-one-box-ends)).
6. **Several boxes meet?** → a box above them, or `main`
   ([the composition root](./structure/boxes.md#the-composition-root)).
7. **Allocates, reads configuration, or chooses an implementation?** → `main`,
   and the result is passed down
   ([the composition root](./structure/boxes.md#the-composition-root)).

## A function

≤ 70 lines → asserts its arguments → the parent branches, the helpers compute
→ asserts its result → the simplest return type that works
([functions](./structure/functions.md))

## A loop

a named bound → the bound is in the condition → what happens at the bound is
decided → a loop that never ends is marked
([every loop has a bound](./safety/control-flow.md#every-loop-has-a-bound))

## Memory

before the work begins → sized from a limit → held by its owner → static on a
chip, allocated in `main` with `errdefer` beside it on a server, given at
`init` to a library → in as few allocations as the design allows, the count
asserted in a test → then nothing more
([memory](./safety/memory.md#all-memory-is-fixed-before-the-work-begins),
[fewer allocations](./performance/allocations.md#fewer-allocations))

## Something shared

a thread or an interrupt owns its state → what is shared is one named
structure → one producer, one consumer where it can be → each atomic names
its ordering → no lock in the data plane
([sharing](./safety/memory.md#sharing-between-threads-cores-and-interrupts))

## An interrupt or OS signal

record in an atomic or SPSC ring → return → the main loop does the work
([firmware](./kinds/firmware.md#interrupts-record-the-loop-works),
[service](./kinds/service.md#signals-and-shutdown))

## A failure

the outside caused it → an error value, handled, counted, answered · the code
caused it → an assertion, and the program stops
([two kinds of failure](./safety/errors.md#two-kinds-of-failure))

## Input, wire formats and FFI

parsed once at the boundary → explicit byte order and version on every wire or
disk format → C libraries isolated behind one box door with bounded memory →
secrets compared in constant time and zeroed on exit
([errors](./safety/errors.md#input-is-parsed-once-at-the-boundary),
[boundaries](./safety/boundaries.md))

## A tick

take what arrived, up to a limit → do a bounded batch of each kind of work →
wait ([its own pace](./safety/control-flow.md#the-program-runs-at-its-own-pace))

## Comptime

for tables, assertions, design sizes, target facts and data-plane calls →
truly known at build time, simpler to trust, visible to a reader → never a
language of its own ([comptime](./performance/comptime.md))

## A name and types

a noun or a verb, unabbreviated → the unit, then the qualifier, last:
`timeout_ms_max` → an index, a count and a size never share a name → explicit
sized types (`u32`/`u64`), checked casts, explicit rounding on division
([naming](./structure/naming.md), [limits](./safety/limits.md))

## A hot loop

a function of its own over slices → the fields it reads in their own arrays,
the rest elsewhere → no branch per item where a list per state will do →
what it calls is comptime → vectors only with a scalar oracle beside them →
a benchmark beside it ([data layout](./performance/data-layout.md),
[SIMD](./performance/simd.md))

## Toolchain, release and dependencies

one pinned Zig compiler for code, build and scripts → zero dependencies by
default (each recorded with reason and hash, behind one box door) → release
built `.safe` (or measured `.small`), never `.fast` → library options written
explicitly at the call site ([toolchain](./toolchain/README.md))

## Tests

live beside the code → four tiers (`unit` → `random` → `simulation` → `live`),
each guarding one edge → deterministic from one seed (clock, RNG, I/O passed
in) → spend most effort on the negative space (invalid input, limit edges,
every error path, failing allocations) ([testing](./testing/README.md))

## The one command and guards

`zig build check`: format · line length · function length · layers · doors ·
cycles · banned text · release mode · dependencies · locked allocator ·
compile-time assertions · unit, fixed-seed random and short simulation tests
([toolchain](./toolchain/README.md#one-command-checks-everything),
[enforcement](./testing/guards.md#enforcement))

## Not this

a one-off script; a build step; a prototype with no subject. Keep the limits,
the assertions, the error handling and the 70 lines; add the rest when the
program stays ([scope](./README.md#scope)).
