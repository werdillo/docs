# The two planes

Every program has work that decides and work that moves data. Kept apart,
each can be written for what it needs: the first for safety, the second for
speed.

## Control plane and data plane

| | Control plane | Data plane |
|---|---|---|
| **What** | decides: parse the request, find the file, check the range; configure a peripheral, pick a mode | moves: bytes from the file to the socket; samples through a filter |
| **How often** | once per job | once per buffer, per tick, for as long as the data flows |
| **Written for** | clarity and safety: every assertion, every check | throughput: no decisions, no allocation, as few system calls as possible |

The split is what lets the two goals coexist. All the assertions live in the
control plane, where their cost is paid once. The data plane is given
arguments that have already been checked and does one thing in a loop. A
check that must cover the data — a size, a bound — is made once per batch, at
the edge of the loop, not per item inside it.

## Batch

Fixed costs — a system call, a context switch, a wake-up, a disk flush — are
paid per operation, not per byte. So operations are gathered:

- **Read and write in large buffers**, and give the kernel several buffers in
  one call where it takes them.
- **Take every ready event from the loop at once**, up to the tick's limit,
  not one per wake-up.
- **Let the CPU run straight.** A long loop over one kind of work keeps its
  code and data in cache and its branches predictable; alternating between
  kinds of work throws that away each time.

A batch has a maximum size, which is a limit, and usually a maximum wait, so
that a lone item is not held for company that never comes.

This is the same decision as [the program's own pace](../safety/control-flow.md#the-program-runs-at-its-own-pace):
a program that reacts to each event cannot batch, and one that batches is
bounded per tick.

## Be explicit in the hot path

- **A hot loop is a function of its own with primitive arguments**: slices
  and integers, no `self`. The compiler then does not have to prove that a
  field cannot change under the loop, and a reader sees every input.
- **Hoist by hand.** What does not change in the loop is computed before it.
  The optimiser may do it; written out, it is done.
- **Lay data out for the loop.** What the loop reads is contiguous and
  nothing else is beside it; what the loop calls is a comptime parameter
  ([data layout](./data-layout.md)).
- **No allocation and no lock in the data plane** — the first is a rule
  everywhere, the second follows from one owner per piece of state.
- **Copy nothing that can be handed over.** The fastest way to move bytes is
  not to: a file is given to the socket by the kernel, a buffer is passed by
  slice.
