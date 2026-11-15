# Firmware

A program that is the only thing on its hardware. It is the kind the Power
of Ten was written for, and the one where the rules cost least: there is
usually no heap to give up, and every resource is already small and fixed.
What it adds is the hardware itself — registers, interrupts, a stack that
cannot grow, and a reset that is the only way to recover.

## Memory is static

All memory is decided at compile time: the pools and buffers are
`var`s of fixed size, and the linker's map says how much flash and RAM the
program takes. That map is the budget, and the build fails when it is
exceeded — the limits file names the sizes, the linker script names the
chip's, and a compile-time assertion relates the two where it can.

- **No allocator in the program's own boxes.** A box that needs scratch
  space is given a fixed buffer, as in a service.
- **The stack is memory too.** No recursion keeps it bounded; how large it
  gets is measured, not guessed: the stack is filled with a pattern at reset
  and a test on the board reads how much was overwritten after the worst
  case ran. The margin is a limit.
- **What the boxes allocate in tests** is still fine — the testing
  allocator finds leaks on the host.

## The hardware is one box

Registers are global by nature: an address that anything could write. So
they are reached in one place.

- **The interface is in `core`; the registers are in a board box.** `core`
  declares what the program needs from the hardware, in its own terms —
  `now_us`, `adc_read`, `radio_send`. A board box fills it, and holds every
  `*volatile` pointer to a register. Nothing else names an address.
- **The boards are at the top of the layer map**, above the program's
  boxes, so that no box can import one; only `main` is given a board, and
  hands the interface down
  ([the composition root](../structure/boxes.md#the-composition-root)).
- **A board per target, and one for the host.** `main` on the chip gets the
  chip's; the tests get a simulated one. The boxes between do not know which
  they run on.
- **A HAL is a dependency, and the board box is where it stops.** MicroZig,
  or a chip vendor's register definitions, is recorded like any dependency
  ([no dependencies by default](../toolchain/README.md#no-dependencies-by-default)),
  imported by the board box alone, and its types do not cross the board's
  door. Its build helpers may produce the firmware image; the layer map is
  still the project's.

## Interrupts record, the loop works

An interrupt is the sharpest case of an outside event acting directly
([its own pace](../safety/control-flow.md#the-program-runs-at-its-own-pace)).
So an interrupt handler does the least it can:

- **It records and returns**: a flag, a timestamp, a byte into a ring buffer
  of fixed size. It does not parse, decide or call into the program's boxes.
- **It is bounded**, like everything: no loop without a limit, and its worst
  case is part of the timing sketch.
- **What it shares with the loop is in one place**, owned by the board box:
  a single-producer, single-consumer ring buffer, or an atomic. This is the
  one exception to "one owner", and it is named as one.
- **A full ring buffer drops and counts** — it does not block in an
  interrupt ([what happens at a limit](../safety/limits.md#what-happens-at-a-limit)).

The main loop takes what the interrupts recorded, does a bounded batch of
each kind of work, and sleeps until the next interrupt or timer.

## Deadlines are limits

A service has latency; firmware has deadlines. A control loop that must run
every 1 ms, a reply a bus expects within 50 µs — each is a limit in the
limits file, in cycles or microseconds, and the work in a turn of the loop is
sketched against it ([sketch before building](../performance/sketch.md#sketch-before-building)).

A **watchdog** is the assertion of liveness: the main loop feeds it once per
turn, so a loop that stops turning resets the chip. It is fed in one place,
the loop itself, never from an interrupt — an interrupt keeps firing while
the loop is stuck.

## A stream through DMA

Audio, and any stream that must not stop, is moved by DMA rather than by an
interrupt per sample. The buffer is split in two, and the halves change
hands:

- **One half is the hardware's, one is the program's.** While DMA plays or
  records one half, the loop fills or reads the other. The controller's
  half-transfer and transfer-complete interrupts say when they swap; each
  records which half is now free, and returns.
- **Ownership is a state, and it is asserted.** The loop asserts that the
  half it touches is the one the last interrupt handed it; touching the other
  is a bug that sounds like a click, and the assertion makes it a stop
  instead.
- **The deadline is half a buffer.** At 48 kHz with 64 frames a half, the
  loop has 1.33 ms to fill it, every time. That number is a limit, derived in
  the limits file from the rate and the size, with a compile-time assertion
  that the sketch's worst case fits it.
- **An underrun is counted and filled with silence.** A half the loop did
  not finish in time is played as zeros, not as whatever was left in it, and
  a counter says how often. Repeating the last half sounds worse than
  silence.
- **The buffer is one contiguous, aligned array** that the controller can
  reach, declared in the board box with the alignment and the memory region
  the chip requires ([data layout on a chip](../performance/data-layout.md#on-a-chip)).

## Interrupt priorities

Several interrupts — DMA, a timer, an encoder, a serial port — preempt each
other in an order the chip enforces. That order is a design decision, not a
default:

- **The priorities are a table in the board box**, one line per interrupt,
  with the reason: the audio stream above everything that can wait, the
  encoder below it.
- **A handler that a higher one can interrupt shares nothing with it** but a
  single-producer, single-consumer structure. Nesting is bounded by the
  table, so the stack's worst case is the sum along the deepest chain — a
  number the stack measurement checks
  ([memory is static](#memory-is-static)).
- **No handler waits for another.** If two must agree, they agree through
  the loop.

## Power and clicks

What a device does when power comes and goes is as much a part of its design
as what it does in between.

- **It starts silent.** The output is muted, or the volume at its minimum,
  before anything else is configured, and stays so until the supplies have
  settled — a delay that is a limit, from the hardware's datasheet.
- **Changes are ramped.** A volume moves to its target over several turns,
  never in one step; the step per turn is a limit, and an assertion checks it
  after every turn ([deadlines are limits](#deadlines-are-limits)).
- **It stops silent.** When power is falling — a brown-out interrupt, a
  supervisor pin — the first action is to mute, before saving anything.
- **The panic handler mutes first** and resets after: a broken assertion
  must not leave the last level, or noise, on the output
  ([what a crash does](#what-a-crash-does)).

## Settings in flash

Flash wears out with writes, and a write can be cut by power loss half-way.

- **Writes are rare by design.** A setting that changes often — a volume —
  is written only after it has been still for some seconds, and the number
  of writes per hour is a limit with the chip's endurance behind it.
- **Two copies, alternating.** Each record carries a sequence number and a
  checksum; startup reads both and keeps the newest valid one. A write cut by
  power leaves the older copy intact.
- **The check is a pair**: the checksum is computed before the write and
  verified after the read ([in pairs](../safety/assertions.md#in-pairs)). A
  record that fails its checksum is an operating error — the outside, here
  the power, broke it — and the device starts from defaults and counts it.

## What a crash does

A broken assertion calls the panic handler, which the root file declares. On
a device with an output that can hurt — a speaker, a motor — it first puts
that output in its safe state. Then it writes why — the message and the
address — to a place that survives a reset (a reserved region of RAM, a
flash page), and resets the chip. After the
reset, `main` reads the record, counts it and clears it, so that a crash in
the field is found later, not lost.

**The safety checks still ship** where the flash allows
([build modes](../toolchain/README.md#the-safety-checks-ship)). When it does
not, the release is built `.small` — and that is a measured decision written in
the project's conventions, with the assertions that matter most kept by
explicit checks that call the panic handler.

## The sketch

The resources are flash, RAM, cycles per deadline, power and the buses. A
whole sketch, with the image measured afterwards, is in
[the example](../example/firmware.md#the-sketch).

## Its tests

| Tier | Here |
|---|---|
| unit, random | on the host: the boxes do not know the chip, so they run as ordinary tests |
| simulation | on the host: the program with a simulated board — a clock that jumps, a sensor that returns noise or nothing, a bus that times out |
| live | hardware in the loop: the build flashed to a real board, driven and read by a test on the host |

The more of the program that is above the board box, the more of it is
tested on the host, where tests are fast and deterministic.

## An example

A sensor node, end to end — the tree, the board, the interrupt, the loop,
the crash record, and the image measured in both modes — is in
[`example/firmware.md`](../example/firmware.md).
