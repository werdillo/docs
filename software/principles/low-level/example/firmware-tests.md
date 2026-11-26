# The firmware's tests

Everything below the board implementations (`board_host` and `board_chip`) in
the layer map runs unchanged on the host, so most of the firmware is tested
where tests are fast and deterministic. The chip's board itself is tested on
the board.

## The host board

```zig
pub const HostBoard = struct {
    samples: board.Samples = .{},
    clock_us: u32 = 0,
    random: std.Random,
    radio_failure_percent: u32,
    frames_sent: u32 = 0,
    watchdog_fed_us: u32 = 0,

    // … `board()` fills the same `Board` interface as the chip's

    /// What the ADC interrupt would do: record and return.
    pub fn interrupt_sample(host: *HostBoard, value: i16) void {
        host.samples.push(value);
    }

    pub fn advance(host: *HostBoard, duration_us: u32) void {
        host.clock_us +%= duration_us;
    }
};
```

A clock that moves when told, a radio that fails on a seed's schedule, and a
watchdog that remembers when it was fed. It is the chip's board with the
world replaced by data.

## Unit

A ring buffer test starts its indexes just before they wrap, so that the
wrap is tested in the first four pushes rather than after four billion:

```zig
test "RingBuffer: order, a full buffer that drops, and wrapping indexes" {
    var ring: RingBuffer(u16, 4) = .{};
    ring.write_index = std.math.maxInt(u32) - 1; // Start where the indexes wrap.
    ring.read_index = ring.write_index;

    for (0..5) |value| ring.push(@intCast(value));
    try std.testing.expectEqual(1, ring.dropped_count.load(.monotonic));
    for (0..4) |value| try std.testing.expectEqual(@as(u16, @intCast(value)), ring.pop().?);
    try std.testing.expectEqual(null, ring.pop());
}
```

## A simulated minute

```zig
const turns_max: u32 = 60 * limits.sample_rate_hz;
var turn: u32 = 0;
while (turn < turns_max) : (turn += 1) {
    // Interrupts arrive unevenly: none, one, or a burst while the loop was busy.
    const burst = if (random.uintLessThan(u32, 50) == 0) random.uintAtMost(u32, 400) else 1;
    for (0..burst) |_| host.interrupt_sample(random.int(i16));
    host.advance(limits.sample_period_us);

    node.turn(board);
    try std.testing.expect(host.clock_us -% host.watchdog_fed_us < watchdog_timeout_us);
}
```

A minute of the chip's time — sixty thousand turns — runs in well under a
second. After it, the test checks that a report went out each second, that
every frame the radio accepted was counted as sent, that no turn missed its
deadline, and that the watchdog was never starved.

A burst of up to 400 samples is larger than the ring's 256, on purpose. The
test checks, across its seeds, that the ring did drop — otherwise the
dropping path would be code no test had run:

```zig
// The bursts must overflow the ring sometimes, or the dropping path was never run.
try std.testing.expect(dropped_total > 0);
```

## The image

The build also compiles the firmware for a Cortex-M4: every box but the
host board, with `main.zig` as the root, in the mode the build is told.

```zig
// The image: every box but the host board, built for the chip. Safe unless it does not fit.
const image_mode = b.option(std.lang.Optimize, "image-mode", "") orelse .safe;
```

That one build proves what the host cannot: the node's boxes compile for a
32-bit target with no OS, where `usize` is 32 bits, and every `*volatile` is
in the one box allowed to hold it.

Measured from the object file, both modes:

| Mode | Flash (code and constants) | RAM (data, zeroed, `.noinit`) |
|---|---|---|
| `.safe` | 1,119 bytes | 592 bytes |
| `.small` | 372 bytes | 524 bytes |

The safe build is three times the size — and 1.1 KiB of a 256 KiB chip. So
it is what ships, and the question of `.small` waits until a measurement
says the flash is short
([the safety checks ship](../toolchain/README.md#the-safety-checks-ship)).
The numbers cover the program alone; the vector table, the startup code and
a HAL add to both columns, and the linker's map of the full image is the
budget that counts.

## On the board

Hardware in the loop is the last tier: the image flashed to a real board,
the sensor driven, the radio's frames read by the host. It checks only what
the host cannot — that the addresses are right, that the interrupt fires,
that the watchdog's key is the chip's — and it is where the stack is
measured: painted with a pattern at reset, read after the worst case ran
([memory is static](../kinds/firmware.md#memory-is-static)).
