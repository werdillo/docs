# Control flow

A reader must be able to follow every path through a function, and to say how
long each can run. Both are lost first in the control flow.

## Simple and explicit

- **Use the plain constructs**: `if`, `switch`, `while`, `for`, `return`, and
  `defer` for cleanup. Zig hides no control flow — no exceptions, no operator
  overloading, no destructors — and the code does not rebuild them.
- **A `switch` on an enum names every case.** No `else` branch on a closed
  enum: a new case is then a compile error at every place that must decide
  about it.
- **Few abstractions, and good ones.** An abstraction is never free: it hides
  a cost, a branch or an allocation, and it can leak. One is added when it
  makes the best sense of the subject, not because two functions look alike.
- **No callback where a return value works.** A callback inverts the flow;
  a reader has to find who calls it and when. It is kept for what is truly
  asynchronous — the completion of I/O — and there it is named after its
  caller and comes last in the parameters ([naming](../structure/naming.md)).
- **A function runs to completion.** It does not suspend in the middle, so
  what it asserted at the top is still true at the bottom.

## No recursion

A recursive function has a depth decided by its data, and a stack that is
used up without a line that says so. Every recursion is rewritten as a loop
with an explicit, bounded stack or queue — whose size is then a limit like any
other.

A format that nests — directories, JSON, a tree — is walked with such a
stack, and its depth limit is what refuses a hostile input: a document nested
ten thousand deep is an operating error, not a stack overflow.

No check can see every recursion (a cycle through a function pointer is
invisible), so this is held by review; the direct case is easy to see.

## Every loop has a bound

A loop is one of three kinds, and each says which it is.

1. **Over a slice or a range.** `for (items) |item|` is bounded by the slice,
   and the slice was bounded when it was made.
2. **With a counter and a named limit.** The limit is in the condition, not
   in a `break` in the body:

   ```zig
   var attempt: u32 = 0;
   while (attempt < limits.send_attempts_max) : (attempt += 1) {
       if (try_send(connection)) break;
   }
   ```

   A loop that waits for something — a retry, a search for a free slot, a
   read until a delimiter — is always this kind. What happens when the limit
   is reached is decided: an error, a refusal, or an assertion when reaching
   it would be a bug.
3. **Meant never to end.** The main loop — an event loop, a firmware
   super-loop — and nothing else. It is one `while (true)` in `main`, with a
   comment that says so, and each turn of it is bounded
   ([its own pace](#the-program-runs-at-its-own-pace)).

An iterator's `while (it.next()) |x|` is the first kind when the iterator
walks a bounded slice. Over anything from outside — a socket, a directory, a
linked structure — it is the second kind and carries a counter.

The same holds for what is not written as a loop: a queue has a capacity, a
retry has a count, a wait has a timeout ([limits](./limits.md)).

## The program runs at its own pace

A program that acts directly on each outside event lets the outside decide
its control flow: a burst of connections or interrupts becomes a burst of
work, and nothing bounds a tick. Instead:

- **An event is recorded, not acted on.** A readable socket, a finished read,
  a timer, an interrupt: each is recorded, and the loop decides when to serve
  it. An interrupt handler does nothing else
  ([firmware](../kinds/firmware.md#interrupts-record-the-loop-works)).
- **A tick does a bounded batch of each kind of work**, then goes back to
  waiting. The batch sizes are limits.
- **What does not fit waits for the next tick**, and what does not fit in the
  queue is refused ([what happens at a limit](./limits.md#what-happens-at-a-limit)).

```zig
/// One turn of the loop: a bounded amount of each kind of work, then back to waiting.
pub fn tick(server: *Server, now_ms: u64) void {
    server.accept_batch(now_ms);
    server.serve_batch(now_ms);
    assert(server.active_count == server.pool.count_used());
}

fn accept_batch(server: *Server, now_ms: u64) void {
    var accepted: u32 = 0;
    while (accepted < limits.accepts_per_tick_max) : (accepted += 1) {
        const handle = server.pool.acquire() orelse {
            server.counters.refused_full += 1;
            break;
        };
        const socket = server.network.accept() orelse {
            server.pool.release(handle);
            break;
        };
        // … the connection starts in `.reading`
        server.active[server.active_count] = handle;
        server.active_count += 1;
        server.counters.accepted += 1;
    }
    assert(accepted <= limits.accepts_per_tick_max);
}
```

This is also where the speed comes from: work taken in batches costs one
system call and one wake-up per batch ([batch](../performance/planes.md#batch)).

## Conditions are split and stated positively

- **A compound condition is split.** `if (a and b)` hides which of four cases
  were considered. Nested `if`/`else` shows each, and an `else if` chain
  becomes `else { if … }` when the branches are not parallel.
- **An `if` is asked for its `else`.** A branch with no `else` either truly
  has nothing to do there, or has a case nobody thought about. When the other
  side must not happen, it is asserted.
- **Invariants are stated positively.** `if (index < count)` reads as the
  invariant holding; `if (index >= count)` makes the reader negate it. The
  positive form goes first and the exceptional case in the `else`.
- **An early return is for a refusal at the top**, where it removes a level
  of nesting. In the middle of the work it is a hidden branch.
