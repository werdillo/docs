# The super-loop

## One turn

```zig
/// One turn of the super-loop: a bounded batch of samples, at most one report, one feed.
pub fn turn(node: *Node, board: core.Board) void {
    const start_us = board.now_us();

    var drained: u32 = 0;
    while (drained < limits.samples_per_turn_max) : (drained += 1) {
        const sample = board.samples.pop() orelse break;
        node.report.add(node.filter.step(sample));
    }
    assert(drained <= limits.samples_per_turn_max);

    if (start_us -% node.report_start_us >= limits.report_period_us) {
        node.send_report(board);
        node.report_start_us = start_us;
    }

    // Fed here and only here: a loop that stops turning resets the chip.
    board.watchdog_feed();
    if (board.now_us() -% start_us > limits.turn_deadline_us) {
        node.counters.deadline_missed += 1;
    }
}
```

- **The drain is bounded** by a limit, not by how much is waiting. A burst
  of interrupts is worked off over several turns.
- **The watchdog is fed once, by the loop.** If it were fed from the timer
  interrupt, a loop stuck forever would keep the chip alive and useless.
- **A missed deadline is counted.** In the simulation it must be zero; on
  the board it is a number in the report.

## A filter without floating point

```zig
/// An exponential moving average with a weight of 1/8, kept with 8 fractional bits.
pub const Filter = struct {
    value_q8: i32 = 0,

    const fraction_bits = 8;
    const weight_shift = 3;

    pub fn step(filter: *Filter, sample: i16) i16 {
        const sample_q8: i32 = @as(i32, sample) << fraction_bits;
        filter.value_q8 += (sample_q8 - filter.value_q8) >> weight_shift;

        const value = filter.value_q8 >> fraction_bits;
        assert(value >= std.math.minInt(i16));
        assert(value <= std.math.maxInt(i16));
        return @intCast(value);
    }
};
```

The unit is in the name: `value_q8` holds 8 fractional bits, and a reader
does not have to find out. The two assertions say the result fits an `i16`,
and the test drives it with the extremes of `i16` to show that they hold
([units and qualifiers go last](../structure/naming.md#units-and-qualifiers-go-last)).

## A frame on the air

```zig
/// The frame on the air. `extern` so that it has no padding to leak, and a fixed size.
pub const Frame = extern struct {
    sequence: u32,
    count: u16,
    dropped: u16,
    minimum: i16,
    maximum: i16,
    mean: i16,
    reserved: u16 = 0,

    comptime {
        assert(@sizeOf(Frame) == limits.report_size);
    }
};
```

What leaves the chip has a layout the program decides, not the compiler, and
a size asserted at compile time. The `reserved` field is written, so no byte
of the frame is whatever the stack held before
([a buffer is fully written](../safety/memory.md#a-buffer-is-fully-written)).

A lost frame is counted, not retried:

```zig
board.radio_send(std.mem.asBytes(&frame)) catch {
    // A lost report is counted, not retried: the next second's is newer.
    node.counters.radio_failed += 1;
    return;
};
```

Retrying would spend the battery on data that the next second replaces. It
is a decision about the subject, written beside the code.

## The registers

`board_chip` is the one box with a `*volatile`. It turns the chip's
registers into the `Board` interface:

```zig
/// Addresses from the chip's reference manual, or its MicroZig definitions. These are
/// placeholders: a real board takes them from there, not from here.
const address = struct {
    const timer_counter_us: usize = 0x4000_8000;
    const adc_result: usize = 0x4000_7000;
    const radio_data: usize = 0x4000_1000;
    const radio_status: usize = 0x4000_1004;
    const watchdog_reload: usize = 0x4001_0000;
};

fn register(comptime at: usize) *volatile u32 {
    return @ptrFromInt(at);
}
```

```zig
fn radio_send(context: *anyopaque, frame: []const u8) core.RadioError!void {
    _ = context;
    assert(frame.len > 0);
    if (register(address.radio_status).* & radio_status_busy != 0) return error.RadioBusy;
    for (frame) |byte| register(address.radio_data).* = byte;
    if (register(address.radio_status).* & radio_status_acknowledged == 0) {
        return error.RadioNoAcknowledgement;
    }
}
```

A busy radio and a missing acknowledgement are operating errors — the air is
the outside — and the node above handles them. With MicroZig the addresses
and register types come from its chip definitions, imported by this box
alone ([the hardware is one box](../kinds/firmware.md#the-hardware-is-one-box)).

## The entry point

On the chip there is no allocator. The memory is static, owned by `main`,
and handed to the node:

```zig
/// Survives a reset: the linker script keeps `.noinit` out of the startup zeroing.
var crash_record: CrashRecord linksection(".noinit") = undefined;
var chip: ChipBoard = .{};
var crashes_count: u32 = 0;
```

```zig
export fn reset_handler() callconv(.c) noreturn {
    if (crash_record.magic == CrashRecord.valid_magic) {
        crashes_count += 1; // Counted once, then the record is cleared.
        crash_record.magic = 0;
    }

    const board = chip.board();
    var node: Node = .init(board);
    // The one loop meant never to end; each turn is bounded.
    while (true) {
        node.turn(board);
        asm volatile ("wfi"); // Sleep until the next interrupt.
    }
}

export fn adc_interrupt_handler() callconv(.c) void {
    chip.interrupt_sample();
}
```

These are the two exceptions to "no global state" that firmware has, both in
one file: the static memory, and the board that the interrupt reaches
([the composition root](../structure/boxes.md#the-composition-root)).

## A crash that survives a reset

```zig
pub const panic = std.debug.FullPanic(panic_handler);

/// A broken assertion: write down why, then reset. There is no one to print to.
fn panic_handler(message: []const u8, return_address: ?usize) noreturn {
    @branchHint(.cold);
    const size = @min(message.len, crash_record.message.len);
    @memcpy(crash_record.message[0..size], message[0..size]);
    crash_record.message_size = @intCast(size);
    crash_record.return_address = @intCast(return_address orelse 0);
    crash_record.magic = CrashRecord.valid_magic;

    // The Cortex-M system reset request: SCB.AIRCR with its key.
    const aircr: *volatile u32 = @ptrFromInt(0xE000_ED0C);
    aircr.* = 0x05FA_0004;
    while (true) {}
}
```

Every assertion in every box — the ring's bound, the filter's range, the
frame's consistency — ends here when it breaks. The chip resets, and the
next `reset_handler` finds the record and counts it, so a crash in the field
is a count and a message the node keeps, not a node that went quiet. Sending
that count with the next report is one more field in the frame
([what a crash does](../kinds/firmware.md#what-a-crash-does)).

Next: [the tests](./firmware-tests.md).
