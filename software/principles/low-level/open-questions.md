# Not decided yet

Gaps in these principles: what they do not settle, named so that the gap is
visible instead of implied. Each says what would settle it, and leaves the
list when a rule replaces it. What a project has not built is not here; it is
one line in that project's roadmap.

## More than one core

The rules assume one thread that owns all state: one event loop, ticks, no
locks. They do not say how a program uses several cores. The candidates are
a thread per core, each with its own loop, pools and share of the limits, and
nothing shared; or several processes behind one listening socket. What would
settle it: a rule for what — if anything — threads may share, and how the
limits file divides a limit among them.

## TLS and the dependency rule

A service on the open network needs TLS, and writing it is exactly the kind
of work the dependency rule's exception exists for. The choices are a proxy
in front that terminates it, the standard library's implementation, or a
library behind a box. Each changes the sketch: once the bytes are encrypted
in the program, the kernel can no longer hand a file straight to the socket,
and a proxy moves that cost out of the process without removing it. What
would settle it: a measurement of each against one service's sketch, and a
rule for when a concern is moved out of the process rather than brought in.

## `std.Io` on io_uring, and the tick

`std.Io` is the I/O passed in that these rules ask for, and its io_uring
implementation (`std.Io.Uring`) is the natural back end for a service on
Linux. It does not run the way these rules describe, though. Each task is a
fiber that suspends at every I/O call, so a function no longer runs to
completion and what it asserted at the top may have changed by the bottom.
It runs fibers on a pool of threads unless told otherwise. And it allocates a
fiber from its backing allocator whenever its free list is empty, which a
locked allocator turns into a crash. Two shapes are open: `std.Io.Uring`
with one thread, fibers bounded by a fixed buffer as its backing allocator
(so a burst past the limit is an `OutOfMemory` to refuse, not a crash) and
assertions re-checked after each I/O call; or `std.os.linux.IoUring`
directly, with the program's own submission and completion loop, which keeps
every rule as written and gives up the sequential style. What would settle
it: one box written both ways, with the sketch's numbers and the simulation
run against each.

## DSP instructions on a microcontroller

A Cortex-M4 has no vector registers, but it has a multiply-accumulate, dual
16-bit operations and saturating arithmetic, which an audio loop wants. The
compiler did not use them for a plain gain loop. The ways to reach them are
a different shape of the code the compiler recognises, inline assembly in
the board box, or a vendor's DSP library behind a box, and none is chosen.
What would settle it: one audio loop written each way, its generated code
read and its cycles measured on the board, against the scalar oracle.

## Work that blocks

Opening a file or reading its metadata can block on a slow disk, and a
blocked loop serves nobody. The rules say work is bounded per tick and I/O is
passed in, and stop there. What would settle it: a rule for which operations
may be called from the loop directly and which go through a bounded queue to
something that may block.

## What an operator sees

The rules ask that every refusal and failure is counted, and say nothing
about how the counts leave the process, what a log line holds, or how a
crash from an assertion is reported. What would settle it: a rule for the
shape of a metric and a log line, their bounds — a log is a queue too — and
what is written when the program stops itself.

## Shutdown, and change without restart

Everything is fixed before the work begins and sized from the limits. That
leaves two things unsaid: how the program stops — whether it drains its
connections and for how long — and how a limit or the configuration changes
while it runs.
What would settle it: a rule that says a restart is the only way to change a
limit, or the one that replaces it, and a bound on a graceful stop.

## The language is still moving

Zig changes between versions, the I/O interface most of all. The rules are
written against ideas — an allocator passed in, I/O passed in — not against
one version's API, and the examples are checked against one compiler. What
would settle it: a stable release, or a rule for how often a project moves
and what a move must prove.
