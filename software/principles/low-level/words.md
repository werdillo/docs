# The words

> **Shared core.** The core words — box, door, owner, layer, composition root — are defined once for every section of this repository in [`shared/`](../../../shared/words.md). That is the source: this page applies it to its own field, and where the two disagree, `shared/` wins and this page is fixed.

One word per thing, and the same word in every document. From the outside in:

| Word | What it is |
|---|---|
| **Program** | The whole thing that is built: one executable, one firmware image or one library, and its set of boxes. |
| **Kind** | What sort of program it is — a service, firmware, a library, a tool. The rules are the same; the kind decides how each is realised ([kinds](./kinds/README.md)). |
| **Target** | The machine a build is for: an OS and a CPU, or a chip. |
| **Layer** | A level of `src/` that imports only what is below it — `core`, the boxes, `main`. |
| **`core`** | The lowest layer: what knows no subject of this program and another program could use unchanged — a pool, a ring buffer, a parser of a standard format. |
| **Box** | The unit of design: one subject, one purpose, its own state, opaque from outside. A folder in `src/` and a build module of its own. |
| **Door** | A box's `root.zig`: the root of its module and the only file a neighbour reaches, by the box's name. What it marks `pub` is the box's whole surface. |
| **Entry point** | `main.zig`: the executable's root, which nothing imports. Not a door. |
| **Layer map** | The ordered list of boxes in `build.zig`: each is given only those before it. A decision, and the build enforces it. |
| **Composition root** | `main` — the one place that knows every box. It reads the configuration, allocates everything, hands each box what it needs, and starts the loop. |
| **Limit** | A named constant that bounds something — a count, a size, a duration. Every limit is in the limits file — the `limits` box, one `root.zig`. |
| **Limits file** | The one file that holds every limit and asserts the relations between them at compile time. |
| **Startup** | The time before the work begins. All memory is fixed by its end: at compile time, by allocation in `main`, or by the caller at a library's `init`. |
| **Locked allocator** | The allocator after startup: a wrapper that treats any further allocation as a programmer's error. |
| **Owner** | The one box that holds a piece of state, changes it and, if it allocated it, frees it. |
| **Pool** | A fixed set of equal items, fixed before the work begins,, handed out and taken back by its owner. |
| **Handle** | What a box holds for something it does not own: an index into the owner's pool, as a distinct type. Not a pointer. |
| **Main loop** | The one loop meant never to end: an event loop in a service, a super-loop in firmware, the caller's loop for a library. |
| **Tick** | One turn of the main loop: a bounded batch of each kind of work, then back to waiting. |
| **Interrupt** | Hardware calling into the program at any moment. Its handler records and returns; the main loop does the work ([firmware](./kinds/firmware.md#interrupts-record-the-loop-works)). |
| **Board** | In firmware, the box that names the hardware's registers and fills the interface `core` declares for them. One per chip, and one for the host; only `main` is given one. |
| **Struct of arrays** | One array per field instead of one array of structs, so a loop that reads one field reads nothing else. `std.MultiArrayList`. |
| **Hot / cold** | Fields a loop reads every pass, and fields read rarely; kept in separate arrays at the same index. |
| **Control plane / data plane** | The control plane decides — parses a request, picks a file, configures a peripheral; it runs once per job and may be slow and careful. The data plane moves data — bytes to a socket, samples through a filter; it runs per buffer, in batches, and does nothing but that. |
| **Assertion** | A statement of what must be true if the code is correct. A broken one is a bug, and stops the program. |
| **Programmer's error** | A state the code should have made impossible. Met with an assertion. |
| **Operating error** | A failure the world is allowed to cause: bad input, a closed socket, a missing file, a full disk, a sensor that does not answer. A value in an error set, always handled. |
| **Boundary** | Where bytes from outside become the program's own types: a socket, a file, a bus, the command line, a library's public arguments. |
| **Positive / negative space** | What a piece of code expects, and what it must never see. Both are asserted and both are tested. |
| **Sketch** | A back-of-the-envelope estimate of a design's cost in network, disk, memory and CPU, made before the code. |
| **Guard** | A test on a rule of these documents rather than on behaviour: it reads source, or the build's manifest. |
| **Oracle** | What a test compares a result against: a plain model of a box, the scalar version of a vector loop, the answer a client deserves. Code too, and can be wrong. |
| **Seed** | The one number a randomised test is derived from. Printed on failure; given back, it replays the failure. |

**Module** is not one of these words. In Zig it is the build system's — a
root source file with its imports — and it keeps that meaning. A unit of
design is a box.

**Feature**, **domain**, **`shared`** and **process** are not here either. A
program of one executable has boxes in one stack; what several boxes have in
common is in `core`, and where several meet is a box above them, or `main`.
