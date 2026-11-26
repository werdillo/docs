# Hardware

How a device is designed around its firmware: the board and the body.

| Folder | What it holds |
|---|---|
| [`foundations/`](./foundations/README.md) | Principles for any device — where quality comes from, shown on an audio amplifier. |
| [`kicad/`](./kicad/README.md) | Electronics in KiCad — schematics, PCB layout, libraries, manufacturing outputs. |
| [`freecad/`](./freecad/README.md) | Mechanics in FreeCAD — enclosures, mounts, parts for printing and machining. |
| [`skills/`](./skills/README.md) | Agent skills built from the folders above. |

The firmware is software and lives with it: the
[low-level principles](../software/principles/low-level/README.md), written in
Zig — [firmware as a kind of program](../software/principles/low-level/kinds/firmware.md)
and [a worked firmware example](../software/principles/low-level/example/firmware.md).
