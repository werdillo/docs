# KiCad

How electronics are structured, checked and exported inside a unified hardware
repository ([structure](../foundations/structure.md)).

## Libraries, templates and contracts

- **Verified libraries live in `shared/`.** Custom symbols (`shared/libs/`) and
  footprints with 3D STEP models (`shared/footprints/*.pretty`) have one home,
  referenced by relative project paths (`${KIPRJMOD}`) rather than absolute
  machine paths so every machine and CI runner opens the board identically.
- **Form-factor templates fix mechanical seams.** A reusable card standard (such
  as `template/50x75/`) starts as a template KiCad project containing the board
  outline (`Edge.Cuts`), mounting holes, keep-out zones and fixed connector
  coordinates. Every swappable module clones the template and never moves the
  slot's mechanical anchors.
- **Pinout contracts match schematic nets verbatim.** Every connector pin on a
  module or baseboard matches the net names in the slot's pinout table
  (`pins/` or `shared/standards/`) and, for digital/MCU boards, the pin table in
  Zig's `board_chip`
  ([the hardware contract](../../software/principles/low-level/kinds/firmware.md#the-hardware-contract)).
- **Unified preferred parts and local datasheets.** Pick standard passives,
  regulators, active parts and connectors from `shared/parts/` (each linked to
  its verified symbol, footprint, STEP model and PDF in `shared/datasheets/`)
  so BOMs stay short, stocked and consistent across boards.
- **Reusable sub-circuits use design blocks or hierarchical sheets.** Repeated
  blocks (power rails, protection, USB-C/ESD, SWD debug, input buffers) live in
  `shared/` and are instantiated rather than redrawn differently on every board.

## Layout and quality discipline

- **Draw the layout alongside the schematic.** Ground return paths, loop areas,
  decoupling proximity and thermal tracking are part of the circuit design, not
  an afterthought ([where quality comes from](../foundations/quality.md#the-implementation)).
- **Zero ERC and DRC errors before fabrication.** Both Electrical Rules Check
  and Design Rules Check pass cleanly against the target fabricator's rules
  (trace width, clearance, drill size, annular ring, silkscreen clearance). Any
  deliberate waiver is documented beside the board, never silently ignored.

## Handoffs and fabrication outputs

- **To FreeCAD:** export a clean 3D `STEP` model (board + populated components
  with accurate heights and connector bodies) so enclosures and panels fit the
  real geometry ([FreeCAD](../freecad/README.md)).
- **To Zig firmware:** update the `board_chip` pinout, bus speed, revision strap
  and fault-pin table whenever a net or revision changes
  ([firmware](../firmware/README.md)).
- **To fabrication:** export versioned, repeatable outputs per board revision —
  Gerbers, drill files, BOM (with exact MPNs and dielectric/tolerance grades
  such as C0G vs X7R), pick-and-place centroid file and assembly drawings.
