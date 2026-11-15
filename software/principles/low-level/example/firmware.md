# A sensor node

[Firmware](../kinds/firmware.md) for a microcontroller that samples a sensor
at 1 kHz and sends one report a second over a radio: the minimum, maximum
and mean of the second's filtered samples, and how many were dropped.

## The sketch

| Resource | Budget | Estimate |
|---|---|---|
| **Cycles** | 1 ms per sample at 64 MHz = 64,000 cycles | a filter step and a report update: a few dozen instructions; the loop sleeps most of the time |
| **RAM** | 32 KiB | the samples ring: 256 × 2 bytes; a 64-byte crash record; the stack, measured on the board |
| **Flash** | 256 KiB | measured from the image: 1,119 bytes for the program in the safe mode ([measured](./firmware-tests.md#the-image)) |
| **Bus** | the ADC, read once per interrupt | one register read per sample |
| **Power** | a battery, for as long as possible | the radio dominates: one frame a second is the number to cut first |

The sketch says the design is bound by power, not by cycles, and that the
safe mode fits with room to spare — so it is what ships
([the safety checks ship](../toolchain/README.md#the-safety-checks-ship)).

## The tree

```
build.zig              ← the layer map; the host tests; the image for the chip
src/
  main.zig             ← the entry point on the chip: crash record, node, super-loop
  simulation.zig       ← the node on the host board, for a simulated minute
  limits/root.zig      ← rates, periods, sizes, the deadline
  core/
    root.zig           ← door: RingBuffer, Board, Samples
    ring_buffer.zig    ← one producer, one consumer, no lock
    board.zig          ← the hardware, as the node sees it
  filter/root.zig      ← a fixed-point low-pass filter; knows no chip
  report/root.zig      ← samples → one frame for the radio; knows no chip
  node/root.zig        ← the work of one turn; knows no chip
  board_host/root.zig  ← the board the tests run on
  board_chip/root.zig  ← the registers of the chip — every `*volatile` in the program
```

```zig
/// The layer map. The two boards are last: only `main` and the tests are given one.
const layer_map = [_]Box{
    .{ .name = "limits", .imports = &.{} },
    .{ .name = "core", .imports = &.{"limits"} },
    .{ .name = "filter", .imports = &.{} },
    .{ .name = "report", .imports = &.{"limits"} },
    .{ .name = "node", .imports = &.{ "limits", "core", "filter", "report" } },
    .{ .name = "board_host", .imports = &.{ "limits", "core" } },
    .{ .name = "board_chip", .imports = &.{ "limits", "core" } },
};
```

`node` is the program's subject, and it is below both boards: it cannot name
a register even by accident, and the compiler would say so. Everything above
the boards' line runs unchanged on the developer's machine.

## The limits

```zig
//! Every limit of the node. Times are in microseconds: the chip counts in them.
const std = @import("std");
const assert = std.debug.assert;

pub const sample_rate_hz: u32 = 1000;
pub const sample_period_us: u32 = 1_000_000 / sample_rate_hz;
pub const samples_ring_count: u32 = 256;
pub const samples_per_turn_max: u32 = 64;
pub const report_period_us: u32 = 1_000_000;
pub const turn_deadline_us: u32 = 2 * sample_period_us;
pub const report_size: u32 = 16;

comptime {
    assert(std.math.isPowerOfTwo(samples_ring_count));
    // A turn drains more than arrives during it, so the ring cannot fill in steady state.
    assert(samples_per_turn_max * sample_period_us > turn_deadline_us);
    assert(samples_per_turn_max <= samples_ring_count);
    assert(report_period_us % sample_period_us == 0);
}
```

The second relation is the design in one line: the loop takes up to 64
samples a turn, and in a turn's deadline at most two arrive. If someone
raises the rate or lowers the batch until the loop could fall behind, the
program does not compile. The deadline is a limit like a buffer size
([deadlines are limits](../kinds/firmware.md#deadlines-are-limits)).

## The board

The hardware is an interface in `core`, and the node is given one:

```zig
/// The hardware, as the node's boxes see it. `main` gives them the chip's board; the tests,
/// the host's. Nothing above this names an address.
pub const Board = struct {
    context: *anyopaque,
    vtable: *const VTable,
    samples: *Samples,

    pub const VTable = struct {
        now_us: *const fn (context: *anyopaque) u32,
        radio_send: *const fn (context: *anyopaque, frame: []const u8) RadioError!void,
        watchdog_feed: *const fn (context: *anyopaque) void,
    };
    // … one forwarding function per entry
};
```

It is a function pointer table, which the Power of Ten bans and these rules
allow inside a named interface: this one is what lets the same node run on
two boards ([pointers are restricted](../safety/memory.md#pointers-are-restricted)).

The clock is a `u32` of microseconds, so it wraps every 71 minutes. Every
duration is taken with wrapping subtraction, `now -% start`, which is right
across the wrap; a plain `-` would trap the first time the clock wraps — on
the board, after an hour, not in a test that runs a minute.

## The interrupt records, the loop works

The ADC interrupt does one thing:

```zig
/// The ADC interrupt: one read, one push, return.
pub fn interrupt_sample(chip: *ChipBoard) void {
    const raw = register(address.adc_result).*;
    chip.samples.push(@bitCast(@as(u16, @truncate(raw))));
}
```

`push` is the producer side of a ring buffer with one producer and one
consumer. Each side owns one index and only reads the other's, so there is
no lock — the one place in the program where two contexts share state, and
it is named as such:

```zig
/// One producer (an interrupt), one consumer (the main loop), no lock. The producer owns
/// `write_index`, the consumer owns `read_index`; each only reads the other's.
pub fn RingBuffer(comptime T: type, comptime count: u32) type {
    comptime assert(std.math.isPowerOfTwo(count));
    return struct {
        items: [count]T = undefined,
        write_index: u32 = 0,
        read_index: u32 = 0,
        dropped_count: u32 = 0,

        const Self = @This();

        /// Called from the interrupt. A full buffer drops and counts: an interrupt never waits.
        pub fn push(ring: *Self, item: T) void {
            const write = ring.write_index;
            const read = @atomicLoad(u32, &ring.read_index, .acquire);
            assert(write -% read <= count);
            if (write -% read == count) {
                ring.dropped_count +%= 1;
                return;
            }
            ring.items[write % count] = item;
            @atomicStore(u32, &ring.write_index, write +% 1, .release);
        }
        // … `pop`, the mirror image, for the main loop
    };
}
```

- **The indexes run free and wrap**; their difference is the fill, which the
  assertion bounds. A power-of-two count makes `% count` exact across the
  wrap, and the build refuses another.
- **Full is an answer**: the sample is dropped and counted, and the count
  goes out with the next report. An interrupt that waited for room would
  wait for the loop it interrupted
  ([what happens at a limit](../safety/limits.md#what-happens-at-a-limit)).

Next: [the loop](./firmware-loop.md).
