# Errors

## Two kinds of failure

| | A programmer's error | An operating error |
|---|---|---|
| **Who caused it** | the code | the world: a client, a disk, the network, a sensor, a bus, the operator, a library's caller |
| **Is it expected** | no | yes — it will happen, and often |
| **How it is written** | an assertion | a value in an error set |
| **What happens** | the program stops | it is handled: answered, retried, counted |
| **How it is tested** | by never happening under random input | by a test that causes it |

Mixing them up is the mistake in both directions. An assertion on input lets
a client stop the server. An error value for a broken invariant asks every
caller to handle a state that cannot be handled, and the bug travels on.

## Every error is handled

Studies of failures in production systems keep finding the same thing: most
catastrophic failures start as an ordinary, explicitly signalled error that
was handled badly or not at all. The error path is code, and it is the code
that runs when things are already going wrong.

- **No error is discarded.** Zig refuses an unused error union; these are the
  ways around it, and they are closed:
  - `catch {}` — never.
  - `catch unreachable` — only with a comment that says why the error cannot
    occur, and only when the code guarantees it, not the input. It is an
    assertion and follows [their rule](./assertions.md#never-on-input).
  - `_ = f();` on a result that carries meaning — never.
- **`try` is a decision, not a reflex.** It hands the error to the caller.
  That is right when the caller can do something about it and wrong when
  this function was the last one that knew what the error meant.
- **An error is handled where it can be answered.** Usually that is the
  function that owns the job — a request, a sample, a command: it turns the
  error into a status, a closed connection, a retry, or a safe state. Below it, errors travel up; above it, none remain.
- **A handled error is counted.** A refusal and a failure each have a
  counter, so that the rate of each is a number an operator can read.
- **A `void` function has no way to fail.** If one is found swallowing a
  failure to stay `void`, its signature is wrong.

## Error sets are named

- **A door declares its error set**: `RangeError!Range`, not an inferred
  `!Range`. The set is part of the box's surface, and a caller can `switch`
  on it and be told when a case is added.
- **`anyerror` does not cross a door.** It says "anything", and a caller can
  handle nothing in particular.
- **An error's name says what happened**, not where: `RangeUnsatisfiable`,
  `HeaderTooLarge`, `ConnectionClosed`.
- **The boundary maps each error to an answer** in one `switch` with no
  `else`: one place where a reader sees every way a request can fail and what
  the client is told.

Inside a box an inferred error set is fine; the door is where it is fixed.

## Input is parsed once, at the boundary

Bytes from outside — a request, a path, a file's header, a frame from a
bus, a configuration value — become the program's own types in one place. That place checks
everything; nothing after it checks again.

```zig
pub const Range = struct { offset: u64, size: u64 };

pub const RangeError = error{ RangeMalformed, RangeUnsatisfiable };

/// Parses `bytes=first-last` for a file of `file_size` bytes. The header is the client's:
/// whatever is wrong with it is an error value, never an assertion.
pub fn parse_range(header_value: []const u8, file_size: u64) RangeError!Range {
    assert(file_size > 0);

    const prefix = "bytes=";
    if (!std.mem.startsWith(u8, header_value, prefix)) return error.RangeMalformed;

    const spec = header_value[prefix.len..];
    const dash = std.mem.indexOfScalar(u8, spec, '-') orelse return error.RangeMalformed;
    const first = std.fmt.parseInt(u64, spec[0..dash], 10) catch return error.RangeMalformed;
    const last_text = spec[dash + 1 ..];
    const last = if (last_text.len == 0)
        file_size - 1
    else
        std.fmt.parseInt(u64, last_text, 10) catch return error.RangeMalformed;

    if (first >= file_size) return error.RangeUnsatisfiable;
    if (first > last) return error.RangeMalformed;

    const range: Range = .{
        .offset = first,
        .size = @min(last, file_size - 1) - first + 1,
    };
    assert(range.size > 0);
    assert(range.offset + range.size <= file_size);
    return range;
}
```

The function shows the whole rule. `file_size` comes from the program, so it
is asserted. `header_value` comes from the client, so every way it can be
wrong is an error. And the result is asserted before it leaves: from here on
a `Range` is a range inside the file, and the code that sends bytes asserts
that and does not test it.

- **The parsed type cannot hold an invalid value**, as far as the type system
  allows: an enum, not a string; a `Range`, not two numbers; a validated path
  type, not a slice of bytes.
- **Input is bounded before it is parsed**: its size against a limit first,
  then its content.
- **Nothing from outside is used as an index, a size or a path until it has
  passed through the boundary.** A path is the sharpest case: it is
  normalised and confined to its root there, and only the confined type can
  open a file.

## Cleanup is beside the acquisition

What a function acquires, it releases on every path out. `errdefer` is
written on the line after the acquisition, so the failing path is correct by
construction and not by a second copy of the cleanup
([allocation and release sit together](./memory.md#allocation-and-release-sit-together)).

That the failing path really is clean is tested, not assumed: an
initialisation is run with an allocator that fails at each allocation in turn
([the negative space](../testing/README.md#the-negative-space)).

## Options are explicit

A call to a library passes the options it depends on, even when they equal
the defaults today:

```zig
@prefetch(buffer.ptr, .{ .rw = .read, .locality = 3, .cache = .data });
```

A default is someone else's decision and can change with a version. Written
out, the call says what the code relies on, and a change in the library is a
compile error or a visible diff, not a silent change in behaviour.
