# Starting a project

How a new Zig project begins on day one — the minimal tree, the `build.zig`
skeleton that enforces `limits ← core ← boxes ← main`, the `limits` file, and
what belongs in the project's own conventions. The rules live in this
repository (and in any skill built from it); they are not copied into the
project.

## Day-one order

1. **Pin the Zig version** in `build.zig.zon` (and `.zigversion` if your
   tooling reads it). Because Zig's standard library moves between releases,
   always verify exact `std` API signatures against the project's pinned
   compiler rather than copying them blindly from older examples
   ([toolchain](./toolchain/README.md)).
2. **Pick the kind** ([kinds](./kinds/README.md)) and write the
   **resource sketch** first: counts, sizes, deadlines or bandwidth, and the
   total memory they add up to
   ([sketch](./performance/sketch.md#sketch-before-building)).
3. **Create the minimal tree** below — `limits`, `core`, `main`, `build.zig`
   and `tools/tidy.zig` — and make `zig build check` pass while the program is
   still empty.
4. **Add the first box** only after the gate is green, then grow one box at a
   time.

## Minimal day-one tree

```text
build.zig                  ← layer_map, .safe release default, `zig build check`
build.zig.zon              ← pinned Zig version and recorded dependencies (none by default)
src/
  limits/root.zig          ← every upper bound + comptime relation assertions (imports nothing)
  core/root.zig            ← reusable primitives, stdlib only (imports nothing of the program)
  main.zig                 ← composition root: allocates, wires, locks allocator, runs loop
tools/
  tidy.zig                 ← source guards (line/fn length, banned patterns, doors, manifest)
```

For firmware, add a low subject box `src/board/root.zig` (importing `limits`
and `core`) for the hardware interface, and `src/board_host/` +
`src/board_chip/` at the top of `layer_map`
([firmware](./kinds/firmware.md#the-hardware-is-one-box)).

## Minimal `limits/root.zig`

```zig
//! Every upper bound of the program, with its unit last.
const assert = @import("std").debug.assert;

pub const items_max: u32 = 1024;
pub const batch_count_max: u32 = 64;
pub const frame_size_max: u32 = 4 * 1024;

comptime {
    assert(items_max > 0);
    assert(batch_count_max > 0 and batch_count_max <= items_max);
    assert(frame_size_max > 0);
}
```

## Minimal `build.zig` skeleton

The exact `std.Build` method names follow the project's pinned Zig release; the
structure stays fixed:

```zig
const std = @import("std");

const Box = struct {
    name: []const u8,
    imports: []const []const u8,
};

/// Single source of truth for layers (`limits <- core <- boxes <- main`).
/// A box only receives modules listed above it, so import cycles cannot compile.
const layer_map = [_]Box{
    .{ .name = "limits", .imports = &.{} },
    .{ .name = "core", .imports = &.{} },
    // Add low subject boxes (e.g. `board` in firmware), then subject boxes here.
};

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{ .preferred_optimize_mode = .safe });

    // 1. Register each box from layer_map, asserting every import appeared earlier.
    // 2. Wire `src/main.zig` with every box module it needs.
    // 3. Register `zig build check`:
    //    - `zig fmt --check src tools build.zig`
    //    - release `.safe` compilation of the main binary
    //    - unit + fixed-seed random tests + short simulation
    //    - `tools/tidy.zig` guards (testing/guards.md)
    _ = target;
    _ = optimize;
}
```

The full checks enforced by `tools/tidy.zig` live in
[the guards](./testing/guards.md).

## What the project's conventions fix

Keep these answers in one short project conventions file (or in
`06-architecture.md` when using a product document):

- **Compiler version** and **targets** (OS/arch or microcontroller + linker
  script).
- **Resource sketch** and link to `src/limits/root.zig`.
- **Layer map** (`limits ← core ← … ← main`).
- **Recorded dependencies** (empty by default, each entry with reason, hash and
  what was read).
- **Known-list exceptions** (empty at day one; each entry carries a reason and
  fails when it stops matching).
- **Release mode exception**, if firmware proves `.small` is required.

## Parallel work across boxes

Because `layer_map` enforces strict one-way doors and each box owns its folder:

1. **Freeze seams (`serial A`):** update `src/limits/root.zig`, `src/core/` and
   any shared low-box doors (such as `src/board/root.zig`) plus `layer_map` in
   `build.zig`.
2. **Fan out (`parallel B`):** implement independent boxes simultaneously, each
   owning only `src/<box>/` and its in-file `test` blocks (never editing
   `limits`, `core`, `build.zig` or `main.zig`).
3. **Join and simulate (`serial C`):** wire the boxes in `src/main.zig`, run
   the full simulation and `zig build check`.

## Adopting in an existing project

Bring an existing Zig codebase in one reversible step at a time, leaving it
working after each:

1. Turn on `zig fmt --check`, the 100-column line limit and `zig build check`.
2. Gather scattered magic numbers into `src/limits/root.zig` with `comptime`
   relations.
3. Add assertions where the last field bug occurred, and name door error sets.
4. Enable `tidy.zig` with today's violations on a shrinking known list.
5. Move allocations to startup and lock the allocator last — that changes the
   architecture and earns its own epoch.
