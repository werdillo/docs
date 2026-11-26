# Firmware

How microcontroller firmware sits inside a unified hardware repository beside
[KiCad](../kicad/README.md) and [FreeCAD](../freecad/README.md)
([structure](../foundations/structure.md)).

Firmware is written in **Zig**, primarily targeting **RP2040** and **RP2350**
microcontrollers. All software engineering, safety and testing rules live in
the [low-level firmware principles](../../software/principles/low-level/kinds/firmware.md)
(worked example:
[firmware example](../../software/principles/low-level/example/firmware.md));
this page covers only how firmware connects to the boards, contracts and shared
blocks in a hardware repository.

## Where firmware lives in the repo

- **Per device or smart module:** `<domain>/<device>/firmware/` sits directly
  beside `kicad/` and `freecad/` so schematic pinout, board revision and
  firmware image stay locked to the same commit.
- **Shared across boards:** `shared/firmware/` holds wire protocols, shared
  control framing, board-revision ID enums, common I²C/SPI device register maps
  and host-side test helpers imported by each board's Zig package.
- **Layer order inside each `firmware/` package:** follows
  `limits ← core ← board ← boxes ← main`
  ([the hardware is one box](../../software/principles/low-level/kinds/firmware.md#the-hardware-is-one-box)),
  keeping all chip registers and HAL imports (such as MicroZig) strictly inside
  `board_chip` so every domain box tests deterministically on the host against
  `board_host`.

## Primary targets: RP2040 and RP2350

RP2040 and RP2350 are the default microcontrollers for control, IO, USB/digital
audio bridging and light DSP across modular hardware:

- **Deterministic PIO for hardware timing.** Custom or timing-critical buses
  (I²S, S/PDIF, quadrature encoders, relay ladder timing, custom serial links)
  run on PIO state machines fed by DMA rather than bit-banging inside CPU
  interrupts.
- **DMA-first streaming.** Audio and continuous sensor streams use ping-pong
  DMA buffers with explicit half-buffer deadlines in `limits.zig`
  ([a stream through DMA](../../software/principles/low-level/kinds/firmware.md#a-stream-through-dma)).
- **HAL boundary.** MicroZig (or vendor register definitions) stops at
  `board_chip`; no HAL type crosses `board`'s door into domain boxes.
- **RP2040 vs RP2350 specifics recorded in `board_chip`:**
  - CPU target and FPU/DSP availability (Cortex-M0+ on RP2040; Cortex-M33 with
    hardware float/DSP or Hazard3 RISC-V on RP2350);
  - clock tree, external flash size (`XIP`) and SRAM budget checked against the
    linker map;
  - PIO block allocation (`2` blocks on RP2040, `3` on RP2350) with one table
    assigning each state machine to its peripheral;
  - 3.3 V GPIO domain limits and power-sequencing rules (never drive unpowered
    pins from external rails).

## The KiCad ↔ Zig contract

Four concrete seams tie each board's KiCad schematic to its Zig `board_chip`
([the hardware contract](../../software/principles/low-level/kinds/firmware.md#the-hardware-contract)):

1. **Verbatim pin table.** Every GPIO net name on the KiCad schematic (`MUTE_N`,
   `I2S_BCLK`, `VOL_CS`, `FAULT_N`, `REV_ID0`) appears under the same name in
   `pins/` and in `board_chip`'s pin table with its direction, pull resistor,
   alternate function and bus speed.
2. **Board revision ID straps.** Strap pins (or an OTP/EEPROM field) identify
   the PCB revision at boot; an unknown revision keeps outputs muted and halts
   safely instead of driving mismatched pins.
3. **Standardised debug and flashing header.** Every RP2040/RP2350 board exposes
   the same compact SWD + UART debug connector (defined once in
   `shared/connectors/`) and accessible `BOOTSEL` / `RUN` pads so every board
   flashes over USB (`.uf2`) or SWD with the same probe.
4. **Mute-first fault path.** Power brown-out, DC-protect, thermal-shutdown and
   firmware panic all enter the same mute-first safe state before resetting or
   logging crash info.

## Build, tests and release artefacts

- **Grounded LLM authoring:** an agent writing Zig drivers or `board_chip` reads
  the exact KiCad schematic/netlist, `pins/` table and local chip PDF in
  `shared/datasheets/` (or `<device>/docs/datasheets/`) directly from the
  repository — never guessing GPIO numbers, active polarity or register bits —
  and checks its own code immediately with host tests.
- **Host tests (`zig build test`):** run all domain boxes and simulated-board
  tests (`board_host`) on the host with zero hardware attached.
- **Target image:** cross-compile the RP2040/RP2350 image (`.elf`, `.uf2`,
  `.bin`) with linker flash/RAM budgets verified against `limits.zig`, tagged
  with the matching PCB revision (`rev1.2`).
- **Bench verification:** flash to the target revision and verify boot strap
  ID, mute-on-boot/mute-on-fault timing, bus clocks and DMA underrun counters
  on the bench.
