# FreeCAD

How enclosures, panels, mounts and mechanical parts are designed inside a
unified hardware repository ([structure](../foundations/structure.md)), fitted
directly to the electronics from [KiCad](../kicad/README.md).

## Parametric and contract-driven

- **Fit against the real KiCad STEP export.** Import the populated board's STEP
  model from `kicad/` as the reference geometry rather than re-typing component
  or connector positions by hand. When the PCB moves a connector or heatsink,
  re-importing the STEP exposes any collision immediately.
- **Drive dimensions from shared parameters.** Mounting-hole grids, stand-off
  heights, PCB thickness (`1.6 mm`), card form-factor envelopes (`50 × 75 mm`),
  panel thicknesses and tolerances live in a named parameter spreadsheet (or
  shared master model in `shared/cases/`) rather than scattered magic numbers.
- **Design for the real manufacturing process.** Account explicitly for printer
  clearance (`0.2–0.3 mm` slip fit), CNC internal corner radii, sheet-metal bend
  radii, fastener head clearance and tool access during assembly.

## Electrical and thermal fit

- **Respect electrical clearance and grounding.** Maintain creepage and
  clearance around mains wiring and high-voltage rails, specify chassis-earth
  bonding points cleanly, and keep transformer orientation away from sensitive
  analogue inputs ([implementation](../foundations/quality.md#the-implementation)).
- **Plan heat paths up front.** Heatsink fins, ventilation slots, thermal-pad
  compression gaps and airflow paths are modelled together with the power and
  thermal budget of the modules inside.

## Manufacturing exports

- **Versioned outputs per revision:** export `STEP` for CNC machining or vendor
  fabrication, `3MF`/`STL` for 3D printing, and `DXF`/`SVG` for laser-cut or
  engraved front and rear panels, tagged with the matching hardware revision.
