# The principles

Each rule carries a status: *guarded* when a check in
[the guards](./testing/guards.md#enforcement) fails on it — the compiler, a
test that reads source, or an assertion that runs in production — *signal*
when it is an orienting size, and *default* otherwise. A default is followed
unless a reason says otherwise; a signal asks a question and fails no test.
Status is about the check, not importance.

Grouped by what they are about. Each is expanded in the folder or file named.

## Safety — [`safety/`](./safety/README.md)

1. **Safety, then performance, then developer experience** — all three are
   goals, and the order decides a conflict. *(default)*
2. **Control flow is simple and explicit** — no recursion, the branches of a
   decision visible in one function, conditions split and stated positively,
   and as few abstractions as the subject needs.
   ([control flow](./safety/control-flow.md)) *(default)*
3. **Everything has a limit** — every loop, queue, buffer, retry and wait has
   an upper bound, and a loop that is meant never to end says so.
   ([limits](./safety/limits.md)) *(default)*
4. **Limits live in one file** *(guarded)* — each is a named constant with its
   unit, and the relations between them are asserted at compile time.
5. **All memory is fixed before the work begins** *(guarded)* — static at
   compile time, allocated at startup from the limits, or given by the caller
   at `init`, in as few allocations as the design allows; after that, nothing
   is allocated or freed. ([memory](./safety/memory.md),
   [fewer allocations](./performance/allocations.md#fewer-allocations))
6. **One owner per piece of state** — the box that holds it changes it;
   another box holds a handle, an index into the owner's pool. A thread owns
   its state too; what threads or interrupts share is named, in one place,
   with its atomic orderings stated. A pointer is one level deep, and a
   function pointer appears only in a named interface. *(default)*
7. **Smallest scope, no aliases** — a variable is declared where it is used
   and checked where it is used; a value is stored once and not copied into a
   second name. *(default)*
8. **Assert what must be true** — arguments, results and invariants; in pairs,
   on both sides of a boundary; the expected and the forbidden; about two per
   function on average. ([assertions](./safety/assertions.md)) *(signal)*
9. **An assertion is for a programmer's error, never for input** — what the
   outside can cause is an operating error and a value. *(default)*
10. **Every error is handled** *(guarded)* — none is discarded, none is
    declared impossible without a reason beside it, a door names its error
    set, and what was acquired is released on the failing path.
    ([errors](./safety/errors.md))
11. **Input is parsed once, at the boundary** — into a type that cannot hold
    an invalid value; inside, the type is trusted and its promises are
    asserted. *(default)*
12. **Types are sized, and an index, a count and a size are different
    things** — `u32` and `u64` for what is stored or sent, `usize` only where
    the language indexes; a cast is checked and a division says how it rounds.
    *(default)*
13. **The program runs at its own pace** — an outside event, a connection or
    an interrupt, is recorded, and each tick does a bounded batch of each kind
    of work. *(default)*
14. **The safety checks ship** *(guarded)* — the release is built with them
    on, none is switched off without a measured reason — a firmware image
    that does not fit is one — and an option to a library is written at the
    call site, not left to its default.

## Structure — [`structure/`](./structure/README.md)

15. **The code is a stack of layers** *(guarded)* — `core ← boxes ← main`;
    each box is a folder and a build module, ordered by the layer map in
    `build.zig`, which gives a box only the boxes below it, so no cycle can
    be built. ([boxes](./structure/boxes.md))
16. **A box is drawn around a subject** — one purpose without an "and", its
    own state, and it changes as one. *(default)*
17. **Boxes meet through their doors** *(guarded)* — a box's `root.zig` is
    its door; a neighbour imports it by name, the compiler refuses a path into
    the folder, and what the door marks `pub` is the surface. `main.zig` is
    the entry point, not a door.
18. **The composition root is the only place that knows everything** — `main`
    allocates, sizes and wires; an allocator, a clock, a source of randomness
    and I/O are passed in, and no state is global — the hardware's registers
    are the one exception, and they are in one box. *(default)*
19. **A function fits on a screen** *(guarded)* — at most 70 lines.
    ([functions](./structure/functions.md))
20. **Push `if`s up and `for`s down** — one function owns the branching and
    the state; its helpers compute and stay pure. *(default)*
21. **A signature is as simple as the work allows** — `void` before `bool`
    before a number before an optional before an error union; an options
    struct where arguments could be swapped; a large value by `*const` and
    built in place. *(default)*
22. **Comptime for what is known before the program runs** — tables,
    assertions, sizes fixed by the design, the target's facts, type
    parameters and what a data-plane loop calls; justified when the value is
    truly known, simpler to trust, and still visible to a reader; never a
    language of its own. *(default)*
23. **Up to about 10 boxes; a file is one subject** — a file of about 500
    lines with its tests asks what should be split out.
    ([sizes](./structure/boxes.md#sizes)) *(signal)*

## Performance — [`performance/`](./performance/README.md)

24. **Sketch before building** — the cost in the target's resources — network,
    disk, memory and CPU on a server; flash, RAM, cycles, power and buses on a
    chip — roughly right before the code exists. *(default)*
25. **The slowest resource first**, weighted by how often each is used.
    *(default)*
26. **The control plane and the data plane are separate** — decisions are made
    once per job and carefully; data is moved in a loop that decides nothing.
    *(default)*
27. **Batch** — a system call, a write and a wake-up are paid for per batch,
    not per item. *(default)*
28. **The hot path is explicit, and its data is laid out for it** — a loop
    of its own over slices, data arranged for the loops that read it, a
    comptime parameter where a function pointer would be, and a scalar
    oracle beside every vector loop. ([data layout](./performance/data-layout.md),
    [SIMD](./performance/simd.md)) *(default)*
29. **A claim about speed is a number** — a benchmark with its budget, kept
    beside the code it measures. *(default)*

## Style — [`structure/`](./structure/style.md)

30. **Names carry the model** — nouns and verbs chosen with care, no
    abbreviations, units and qualifiers last (`latency_ms_max`), one meaning
    per word. ([naming](./structure/naming.md)) *(default)*
31. **Comments say why, briefly** — a sentence or two: what the code cannot
    say. *(default)*
32. **The formatter decides, and a line is at most 100 columns** *(guarded)*.
33. **A file reads top-down** — the important thing first; in a struct,
    fields, then types, then methods. *(default)*

## Toolchain — [`toolchain/`](./toolchain/README.md)

34. **One language and one pinned toolchain** — the program, its build and
    its scripts are Zig, at one version written in the tree. *(default)*
35. **No dependencies by default** *(guarded)* — each one is a recorded
    decision with its reason, pinned by hash.
36. **One command checks everything**, reproducibly, and CI runs the same
    command. *(default)*

## Tests — [`testing/`](./testing/README.md)

37. **Tests live where the behaviour lives** — in the file they test; a box's
    behaviour as a whole, at its door. *(default)*
38. **Each tier guards one edge, and no tier re-tests one below it** — a
    function's decisions, a box under random input, the whole program under
    simulated faults, the real system or the real board at the boundary.
    *(default)*
39. **A test is deterministic** — time, randomness and I/O are passed in, and
    one seed replays a failure. *(default)*
40. **Test the negative space** — invalid input, every error path, each limit
    at its edge and one past it, and an allocation that fails. *(default)*
41. **A guard fails loudly, and its exceptions only shrink** — a known list
    carries a reason and fails when an entry no longer matches. *(default)*

## The road

42. **Guardrails where leaving the road is expensive** — a check for those
    few places; everything else is a signpost, and a signpost that misleads
    is changed. *(default)*
43. **No known showstopper is left for later** — an unbounded loop, a missed
    deadline or an unhandled failure is solved when it is found, while the
    code is cheap to change. *(default)*
44. **Docs describe the code as it is, and a rule lives once** — no dates, no
    phases, no history; a gap in these principles is listed in
    [not decided yet](./open-questions.md). *(default)*
