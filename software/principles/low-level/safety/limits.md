# Limits

## Everything has a limit

In reality everything has one — the machine's memory, the kernel's
descriptors, a client's patience. A program that names no limit still has
them; it finds them in production, at the worst moment. So each is chosen,
named and enforced:

| What | Its limit |
|---|---|
| a loop | the most iterations ([every loop has a bound](./control-flow.md#every-loop-has-a-bound)) |
| a queue, a pool, a table | a capacity, fixed before the work begins |
| a buffer | a size |
| an input — a header, a path, a body | the most bytes, and the most parts |
| a nesting | the deepest level |
| a retry | the most attempts |
| a wait | a timeout |
| work per tick | a batch size per kind of work |

A limit follows the fail-fast principle: a violation is detected where it
happens, as a refusal or an assertion, not downstream as a slow leak or a
tail-latency spike.

## Limits live in one file

Every limit is a named constant in one file. A literal number that bounds
something anywhere else is a limit that has no name yet.

```zig
//! Every limit of the service, in one file. A number that bounds something is named here.
const std = @import("std");
const assert = std.debug.assert;

pub const connections_max: u32 = 4096;
pub const accepts_per_tick_max: u32 = 64;
pub const events_per_tick_max: u32 = 256;
pub const request_header_size_max: u32 = 8 * 1024;
pub const request_buffer_size: u32 = 16 * 1024;
pub const request_headers_count_max: u32 = 32;
pub const path_size_max: u32 = 1024;
pub const path_depth_max: u32 = 16;
pub const send_chunk_size_max: u32 = 256 * 1024;
pub const idle_timeout_ms: u64 = 30 * std.time.ms_per_s;

comptime {
    assert(accepts_per_tick_max <= connections_max);
    assert(events_per_tick_max >= accepts_per_tick_max);
    assert(request_header_size_max <= request_buffer_size);
    assert(path_size_max < request_header_size_max);
    assert(path_depth_max * 2 <= path_size_max);
}

/// What the process allocates at startup, known before it runs.
pub const memory_size_max: u64 = @as(u64, connections_max) * request_buffer_size;
```

- **A limit carries its unit and its qualifier in its name**, last:
  `_size` in bytes, `_count`, `_ms`, then `_max` or `_min`
  ([naming](../structure/naming.md#units-and-qualifiers-go-last)).
- **The relations between limits are asserted at compile time.** A header
  that could not fit its buffer is a design error, and it is caught before
  the program exists ([at compile time](./assertions.md#at-compile-time)).
- **The file adds up.** The memory the process needs is computed from the
  limits in the same file, so a change to one shows its cost at once.
- **A limit an operator may change is still bounded here.** The configuration
  gives a value; the limits file gives the range it must fall in, and `main`
  refuses a value outside it at startup.

One file, not one per box: the limits depend on each other across boxes, and
the relations are the point. A box takes its limits as arguments or imports
the file; it does not keep a private one.

## Sized types

- **What is stored, sent or compared across a boundary has an explicit
  size**: `u32`, `u64`, `u16`. Its range is then the same on every target and
  is part of the design.
- **`usize` is for what the language indexes**: a slice's length, an index
  into it, a pointer's distance. It is converted to a sized type at the edge
  of the box that got it, with a checked cast. It is 64 bits on a server and
  32 or 16 on a chip; code that assumed one of them breaks on the other.
- **A cast is checked.** `@intCast` traps in a safe build when the value does
  not fit; `@truncate` is used only where losing bits is the intent, and a
  comment says so. A widening needs no cast.
- **Arithmetic that can overflow is written to show it.** Plain `+` traps on
  overflow in a safe build, which is right when overflow is a bug. Where the
  operands come from outside, the check comes first, or
  `std.math.add` returns it as an error. The wrapping `+%` and saturating
  `+|` are for when that behaviour is what is meant.
- **A division says how it rounds**: `@divExact`, `@divFloor`, `@divTrunc`,
  or a ceiling helper. A bare `/` on values that may not divide evenly leaves
  the reader to guess.

## Index, count and size

The usual off-by-one is a casual step between these three. They are all
integers and all different things:

- an **index** is 0-based and points at one item;
- a **count** is 1-based and says how many;
- a **size** is a count multiplied by a unit, in bytes.

From an index to a count, add one. From a count to a size, multiply by the
item's size. A name always says which it holds — `slot_index`, `slot_count`,
`buffer_size` — and never `len`, `n` or `num`, which say none of the three.

The last valid index is `count - 1`; the test for validity is
`index < count`, in that form
([stated positively](./control-flow.md#conditions-are-split-and-stated-positively)).

## What happens at a limit

Reaching a limit is a designed event with one of three answers, chosen when
the limit is named.

| Answer | When | Example |
|---|---|---|
| **Refuse** | the outside asked for more than there is | the pool is full → the listener stops accepting; a header is too long → `431` and the connection is closed |
| **Wait** | the work is the program's own and can be done next tick | the batch is full → the rest stays queued |
| **Assert** | the code itself guaranteed the limit could not be reached | releasing into a pool that is already full |

**Growing is not an answer.** A structure that resizes when full has no
limit, only a delay. And a refusal is visible: it is counted and it is
answered, so overload shows up as a number, not as a mystery.
