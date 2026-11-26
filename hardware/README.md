# Hardware

How physical devices are designed as one unified repository of electronics
(**KiCad**), mechanics (**FreeCAD**) and firmware (**Zig**), built on the same
matrix discipline as software ([`shared/`](../shared/README.md)): domains
separate subjects, modules sit behind explicit electrical and mechanical
contracts, and `shared/` holds every reusable standard, library and sub-block.

| Folder | What it holds |
|---|---|
| [`foundations/`](./foundations/README.md) | Principles for any device — modular repository structure, hardware contracts, and where quality comes from. |
| [`kicad/`](./kicad/README.md) | Electronics in KiCad — module templates, shared libraries, DRC/ERC checks, STEP handoff and manufacturing outputs. |
| [`freecad/`](./freecad/README.md) | Mechanics in FreeCAD — parametric enclosures, panels and mounts fitted against KiCad STEP exports. |
| [`firmware/`](./firmware/README.md) | Zig microcontroller firmware (primarily RP2040 and RP2350) inside a hardware repository — repo layout, PIO/DMA boundaries and KiCad ↔ `board_chip` contracts. |
| [`skills/`](./skills/README.md) | Agent skills built from the folders above. |

The firmware is written in Zig under the
[low-level principles](../software/principles/low-level/README.md) —
[firmware as a kind of program](../software/principles/low-level/kinds/firmware.md)
(including [the hardware contract](../software/principles/low-level/kinds/firmware.md#the-hardware-contract))
and [a worked firmware example](../software/principles/low-level/example/firmware.md).
Inside a unified hardware repository, a board's firmware lives right beside its
KiCad and FreeCAD folders (`<domain>/<device>/firmware/`) so schematic pinouts,
enclosure fit and Zig `board_chip` stay locked to the same commit.
