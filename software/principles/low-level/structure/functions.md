# Functions

## A function fits on a screen

**At most 70 lines**, from the signature to the closing brace. There is a
sharp difference between a function that is all in view and one that has to
be scrolled: in the first, a reader sees every branch and every variable at
once.

It is a hard limit, and a guard counts
([function length](../testing/guards.md#text-rules)). A limit that bends is a
discussion in every review; one that does not is a constraint to design
within. There are many ways to cut a long function into pieces of 70 lines
and only a few that feel right — the next section is how to find them.

A good function is the inverse of an hourglass: few parameters, a simple
return type, and a lot of meaty logic between the braces. A function of three
lines called once is usually a name that hides the code, not a help.

## Push ifs up and fors down

When a long function is split, the cut follows responsibility, not length.

- **One function owns the control flow.** The `if`s and the `switch` stay in
  the parent, where a reader sees every case together. A helper is given the
  case already decided and does not branch on it again.
- **One function owns the state.** The parent keeps the state in its locals
  and fields; a helper computes the change and returns it, and the
  parent applies it.
- **Leaves are pure.** A helper that takes values and returns a value can be
  read, tested and trusted alone.
- **Loops go down.** A helper takes a slice and does the loop inside, so that
  the per-item work is one tight function and the branching above it was
  done once, not per item.

```zig
const progress = switch (connection.state) {
    .reading => server.step_read(handle),
    .sending_head => server.step_send_head(handle),
    .sending_body => server.step_send_body(connection),
} catch {
    server.counters.closed_by_peer += 1;
    return false;
};
```

That is the server's step: each helper does one state's work, and only the
parent knows there are three
([the example](../example/service-loop.md#one-function-branches)). The
opposite shape — a helper that receives a flag and branches on it — means
the caller knew the answer and made the helper ask again.

## Simple signatures

Every value a function returns is a case its caller must handle, and that
cost travels up the call chain. So the simplest type that carries the meaning
wins:

```
void  <  bool  <  u64  <  ?u64  <  !u64
```

- **`void` when it cannot fail and has nothing to say.** Often that is
  achieved by moving the check to the caller, where an assertion states the
  precondition.
- **An optional for "there is none"**, an error union for "it went wrong".
  Not an error for an ordinary absence, and not a sentinel number for either.
- **An options struct where arguments could be swapped.** Two parameters of
  the same type in a row — two `u64`, two slices — are a bug waiting at a
  call site. A struct makes the call name them:

  ```zig
  copy_range(.{ .source_offset = 0, .target_offset = 512, .size = 4096 });
  ```

- **A parameter that may be `null` is named so that `null` reads clearly** at
  the call site.
- **Dependencies come first, positionally** — allocator, clock, I/O — from
  the most general to the most specific; then the subject; a callback last.
- **A value over 16 bytes that is not to be copied is passed as `*const`.**
  By value, the caller may copy it onto the stack without anyone asking.
- **A large struct is initialised in place**
  ([large values are built in place](../safety/memory.md#large-values-are-built-in-place)).

## Comptime for what is known before the program runs

What can be known when the program is built is decided then. A value
the compiler computes costs nothing at run time, cannot fail in the field,
and is checked by the build. That makes comptime one of the strongest tools
for these rules — used for what it is for.

**Use it for:**

- **A table** computed from constants: gains per volume step, a window, the
  coefficients of a filter, a lookup the data plane indexes. The chip gets
  the numbers, not the floating point that made them:

  ```zig
  /// Attenuation in Q31 for each volume step, computed by the compiler: the chip gets a table,
  /// not a `pow` it would have to run in floating point. Q15 would merge the steps below -66 dB.
  pub const gain_table: [volume_steps_count]u32 = blk: {
      @setEvalBranchQuota(10_000);
      var table: [volume_steps_count]u32 = undefined;
      for (&table, 0..) |*entry, step| {
          const decibels = -@as(f64, @floatFromInt(step)) * 0.5;
          const linear = @exp(decibels / 20.0 * @log(10.0));
          entry.* = @intFromFloat(@round(linear * 2147483648.0));
      }
      break :blk table;
  };
  ```

- **An assertion about the table, the sizes and the limits**, checked before
  the program exists
  ([at compile time](../safety/assertions.md#at-compile-time)):

  ```zig
  comptime {
      assert(gain_table[0] == 1 << 31);
      for (gain_table[1..], gain_table[0 .. gain_table.len - 1]) |quieter, louder| {
          assert(quieter < louder); // Every step is quieter than the one before: no step is lost.
      }
  }
  ```

  This one is why the table is Q31. In Q15 the steps below −66 dB round to
  the same value — two clicks of the knob, one level — and the build stops
  on this assertion rather than shipping a volume control with dead steps.

- **A size fixed by the design** — a block of 64 frames, a DMA transfer — as
  a comptime parameter, so the loop's count is a constant and a wrong
  buffer is a compile error
  ([a block size known at compile time](../performance/simd.md#a-block-size-known-at-compile-time)).
- **The target's facts**: a vector width, an alignment, a feature of the
  chip, chosen in one place
  ([SIMD](../performance/simd.md#whole-vectors-then-the-tail)).
- **A type parameter** — a pool of `T`, a ring buffer of `T` and its count.
- **What a data-plane loop calls** — a filter, a codec — so that the call is
  direct and can be inlined; the control plane keeps its interfaces
  ([data layout](../performance/data-layout.md#the-data-plane-takes-comptime-parameters)).

**Justified means three things.** The value really is known at build time;
the comptime version is simpler to trust than the run-time one, not only
faster; and a reader can still find what was generated — a table is named,
a parameter is in the signature. Its price is code size: each instance is
a copy, and a table takes flash — measured in
[what comptime costs](../performance/comptime.md#what-comptime-buys-and-what-it-costs).

**Do not use it for** a small language of its own: types assembled from
strings, behaviour that depends on a field's name, a generic that exists
for one caller. Comptime runs in the compiler, where a debugger cannot step
and an error is harder to read, so cleverness there costs more than
anywhere else. `anytype` is for a true generic; a parameter with one real
type has that type written.

## The order in a file

A file is read from the top, so the important thing is first.

- **In a file**: the `//!` comment that says what the file is for, the
  imports, then the main type or `main`, then what it uses, in the order it
  uses it. Tests come last, or right after the function they test when that
  reads better.
- **In a struct**: fields, then types, then methods.

  ```zig
  /// One allocation for every slot: the item, whether it is in use, and the free list.
  slots: std.MultiArrayList(Slot),
  free_count: u32,

  pub const Handle = enum(u32) { _ };
  const Slot = struct { item: T, used: bool, free: u32 };
  const Self = @This();

  pub fn init(gpa: std.mem.Allocator, count: u32) std.mem.Allocator.Error!Self {
      // …
  }
  ```

- **Among methods**: `init` and `deinit` first, then the public ones, then
  the private ones, each helper after its caller.
- **A nested type that has grown is a top-level struct** in the file, or a
  file of its own.

Where nothing suggests an order, alphabetical is one nobody has to argue
about — and names written most-significant-word first then sort by subject
([units and qualifiers go last](./naming.md#units-and-qualifiers-go-last)).
