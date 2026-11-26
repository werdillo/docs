# SIMD and the machine's own instructions

When a hot loop does the same thing to every item, the CPU can do it to
several at once. Zig says this directly with `@Vector`, without intrinsics
and without leaving the language. This page is how it is used under these
rules: when, how it stays correct, and how it is checked. It follows
[data layout](./data-layout.md): a vector loop needs its data contiguous,
which is what that page arranges.

## When

- **A measurement names the loop.** SIMD makes code longer and harder to
  read; it is for a loop a benchmark showed to be the cost, not for any loop
  that could take it ([a claim is a number](./measuring.md#a-claim-is-a-number)).
- **The data is contiguous and of one type.** A field in its own array, not
  scattered across structs.
- **The work per item is the same**, with few branches. A loop that decides
  per item is first made into one that does not — a list per state, a
  [select](#branches-become-selects) — and then vectorised.

The compiler sometimes vectorises a plain loop by itself. That is a gift,
not a plan: a change elsewhere can take it away silently. A loop that must
be fast says so with `@Vector`.

## The scalar version is the oracle

Every vector loop has a plain one beside it that does the same thing, and a
test that runs both on random input and compares:

```zig
/// The scalar version: the oracle the vector version is tested against.
pub fn gain_apply_scalar(samples: []i16, gain: Gain) void {
    assert(gain.q15 <= 32768);
    for (samples) |*sample| {
        const product = @as(i32, sample.*) * gain.q15;
        sample.* = @intCast(product >> 15);
    }
}
```

```zig
// Every length from empty to past a few vectors, so the tail is tested at each count.
const count = random.uintAtMost(u32, vector.len);
for (vector[0..count]) |*sample| sample.* = random.int(i16);
if (count > 0) vector[0] = std.math.minInt(i16);
if (count > 1) vector[count - 1] = std.math.maxInt(i16);
@memcpy(scalar[0..count], vector[0..count]);

const gain: Gain = .{ .q15 = random.uintAtMost(u16, 32768) };
gain_apply(vector[0..count], gain);
gain_apply_scalar(scalar[0..count], gain);
try std.testing.expectEqualSlices(i16, scalar[0..count], vector[0..count]);
```

The scalar version is easy to check by reading; the vector version is
checked against it. They are a pair, like assertions
([in pairs](../safety/assertions.md#in-pairs)). The scalar one also does the
tail.

## Whole vectors, then the tail

```zig
const lanes = std.simd.suggestVectorLength(i32) orelse 4;
const Lanes32 = @Vector(lanes, i32);
const Lanes16 = @Vector(lanes, i16);

/// The vector version: whole vectors first, then the tail with the scalar code.
pub fn gain_apply(samples: []i16, gain: Gain) void {
    assert(gain.q15 <= 32768);
    const gain_lanes: Lanes32 = @splat(gain.q15);
    const vectors_count = @divFloor(samples.len, lanes);

    for (0..vectors_count) |vector_index| {
        const block = samples[vector_index * lanes ..][0..lanes];
        const wide: Lanes32 = @as(Lanes16, block.*);
        // A gain of at most 1.0 cannot make a sample larger, so the narrowing loses nothing.
        const result: Lanes16 = @truncate((wide * gain_lanes) >> @splat(15));
        block.* = result;
    }
    gain_apply_scalar(samples[vectors_count * lanes ..], gain);
}
```

- **The width comes from the target**, at compile time.
  `std.simd.suggestVectorLength(i32)` is 4 on an Apple M-series core and 8 on
  x86-64 with AVX2; on a Cortex-M4 it is `null`, because the core has no
  vector registers, and the code falls back to a width that the compiler
  turns into plain instructions. One source serves every target, and the
  choice is in one line.
- **The tail is the scalar code**, not a second, padded vector path. A
  buffer is never read past its end to fill the last vector.
- **The loop is bounded by the slice**, like any other
  ([every loop has a bound](../safety/control-flow.md#every-loop-has-a-bound)).

## The safety checks, per lane

In the safe mode a vector's arithmetic is checked as a scalar's is: an
overflow in any lane panics. That is the right default, and it has a cost
worth knowing. The same loop, compiled for aarch64 in the safe mode:

| Narrowing written as | Inner loop | Checks per vector |
|---|---|---|
| `@intCast` | 15 instructions | two range comparisons and two branches |
| `@truncate`, with the reason beside it | 7 instructions — the same as in `.fast` | none |

The `@truncate` is not a switch turned off. It is a proof written down: a
gain of at most 1.0 cannot make a sample larger, so nothing is lost. The
premise is asserted once per call, at the top — `assert(gain.q15 <= 32768)`
— and the oracle test shows the result is exact. That is the general rule
for the data plane: check once at the edge of the batch, prove what can be
proved, and leave the loop with nothing to decide
([control plane and data plane](./planes.md#control-plane-and-data-plane)).

Where the narrowing cannot be proved, the checked cast stays.

## Saturating, not wrapping

Audio, pixels and counters usually want a value that stops at its limit, not
one that wraps to the other end: a clipped sample is a small distortion, a
wrapped one is a loud click. Zig has saturating operators, for scalars and
vectors alike:

```zig
for (target, source) |*sample, addition| sample.* +|= addition;
```

The choice between `+`, `+|` and `+%` is a statement about the data
([sized types](../safety/limits.md#sized-types)): `+` when overflow is a bug,
`+|` when the limit is the right answer, `+%` when wrapping is the meaning.

## Branches become selects

A branch per item stops a vector loop. A condition applied to every lane is
a mask, and `@select` picks per lane without branching. A reduction over a
vector — the largest, the sum — is `@reduce`:

```zig
peak_lanes = @max(peak_lanes, @abs(block));
```

```zig
var result = @reduce(.Max, peak_lanes);
```

## A block size known at compile time

When the size of a block is fixed by the design — an audio buffer of 64
frames, a DMA transfer — it is a comptime parameter, and the loop's count is
a constant the compiler can unroll:

```zig
/// A block of a count known at compile time: the loop's count is a constant.
pub fn mix_block(
    comptime block_count: u32,
    target: *[block_count]i16,
    source: *const [block_count]i16,
) void {
    comptime assert(block_count % 4 == 0);
    for (target, source) |*sample, addition| sample.* +|= addition;
}
```

The pointers to arrays carry the count in the type, so a call with the wrong
buffer is a compile error, and the assertion on the count is checked once, by
the compiler.

## Other instructions of the machine

- **Prefetch** (`@prefetch`) for a loop that walks memory the hardware
  cannot predict, with every option written out
  ([options are explicit](../safety/errors.md#options-are-explicit)).
- **`@branchHint(.cold)`** on a path kept out of the hot one: a refusal, a
  panic handler.
- **Alignment** with `align(n)` on a buffer that a vector load or a DMA
  engine requires to be aligned, and an assertion where a slice of it is
  taken.
- **Floating point** keeps its strict mode. `@setFloatMode(.optimized)`
  lets the compiler reorder operations, which changes results; it is allowed
  only in a loop whose test compares against the strict version with a
  tolerance written down.
- **On a microcontroller**, the speed-ups are different instructions: a
  multiply-accumulate, saturating arithmetic, a DSP extension. Whether the
  compiler uses them is seen only in the generated code — it did not, for the
  loop above on a Cortex-M4 — and reaching them on purpose is
  [an open question](../open-questions.md#dsp-instructions-on-a-microcontroller).

## How it is checked

- **The oracle test**, on random input of every length.
- **The generated code is read** when a vector loop is written or changed:
  `zig build-obj -femit-asm` for the target, in the mode that ships. A
  vector loop that the compiler turned back into scalar code, or that checks
  every lane, is found there and nowhere else.
- **A benchmark with its budget** beside the loop, run on the machine it is
  for.
