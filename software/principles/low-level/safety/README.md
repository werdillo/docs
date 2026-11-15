# Safety

What the program may not do. A low-level program has no runtime that catches
its mistakes: an unbounded loop is a stall, an unbounded queue is a death by
memory, an unchecked error is silent corruption. The rules in this folder
remove whole kinds of failure by construction, so that what remains can be
read, tested and asserted.

**Safety, then performance, then developer experience.** All three are goals,
and most of the time one design serves them all: a bounded buffer is safer,
faster and easier to reason about than a growing one. The order matters only
when they pull apart, and then it decides.

## In one line

**The program's memory, its work per tick and its failures are bounded, named
and visible before it runs.**

## The two questions

Most of this folder is two questions asked of every piece of code.

1. **What is the most this can be?** The most iterations, the most items, the
   most bytes, the longest wait. If the answer is not a named constant, the
   code is not finished ([limits](./limits.md)).
2. **What must be true here, and who broke it if it is not?** If the code
   broke it, that is an assertion. If the outside broke it, that is an error
   value ([assertions](./assertions.md), [errors](./errors.md)).

## In this folder

| File | What it holds |
|---|---|
| [`control-flow.md`](./control-flow.md) | Simple and explicit flow, no recursion, a bound on every loop, and the program's own pace. |
| [`limits.md`](./limits.md) | Everything has a limit, the limits file, sized types, and what happens at a limit. |
| [`memory.md`](./memory.md) | Allocation at startup, the locked allocator, one owner and handles, pointers, scope. |
| [`assertions.md`](./assertions.md) | What an assertion is for, where they go, pairs, both spaces, compile time. |
| [`errors.md`](./errors.md) | The two kinds of failure, handling every error, parsing input at the boundary. |

## What these rules buy

- **The worst case is known.** Memory is the sum of the limits; work per tick
  is the sum of the batches. Neither depends on what a client sends.
- **A bug stops the program where it is, not later somewhere else.** An
  assertion turns corruption into a crash with a line number.
- **Overload is an answer, not an accident.** A full pool refuses a
  connection, a full ring buffer drops and counts a sample; neither grows
  until the machine falls over.
- **The code is checkable.** Without recursion, hidden allocation and
  ignored errors, a reader — or a test — can follow every path.
