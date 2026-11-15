# What comptime costs

The rule for comptime is in [functions](../structure/functions.md#comptime-for-what-is-known-before-the-program-runs);
this page is its price, measured.

## What comptime buys and what it costs

Its price is paid in code size, and that is the one that counts on a chip. Measured on a Cortex-M4 in `.small`, in bytes of flash:

| What | Code | Constants |
|---|---|---|
| a filter loop, one comptime instance | 24 | 8 |
| the same, two instances | 48 | 16 |
| the same, ten instances | 168 | 56 |
| ten filters through one loop and a function pointer | 130 | 112 |
| a table of 192 `u32` computed at compile time | 12 | 776 |
| a sum over 64 samples, as a `for` | 22 | 8 |
| the same, as an `inline for` | about 386 | 8 |

- **Each instance is a copy.** A comptime parameter makes one function per
  type it is called with, and the size grows with the count. For a body this
  small, ten copies cost about what one loop through a pointer table costs,
  and each copy calls its filter directly, where the compiler can inline it;
  for a large body the copies cost more. So it is
  measured, not guessed: the image's size before and after, as for
  [the build modes](../example/firmware-tests.md#the-image).
- **A table trades flash or cache for time.** 768 bytes for 192 gains is a
  good trade on a 256 KiB chip. A table of hundreds of kilobytes can cost a
  server more in cache misses than computing the value would, and may not
  fit a chip at all. A table's size goes into the sketch like a buffer's.
- **`inline for` unrolls completely.** Over 64 samples it made the function
  about seventeen times larger. It is for a short, fixed count where each
  pass differs at compile time — a field of a struct, a lane of a vector —
  not a way to make an ordinary loop fast. An ordinary loop with a
  comptime-known count is unrolled by the compiler as far as it judges
  worth it.
- **The safe mode roughly doubles a small loop's code** (42 bytes for the
  first row instead of 24), as the checks are compiled into each copy too.

On a server the code-size column rarely matters and the time saved does. On
a chip both are budgets, and a comptime choice is weighed against both.
