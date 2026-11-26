# The words in each section

What each core word ([words](./words.md)) is in each section. A product
document draws the matrix in the first column; every column after it is what
that matrix becomes.

| Core word | Product | Design | Web | Low-level | Hardware |
|---|---|---|---|---|---|
| **Domain** | A subject of the business | A section of the navigation | A layer in `src/` — `src/<domain>/`, the same in every package | — none: one program, one stack of boxes | A top-level hardware family (`analog/`, `digital/`, `power/`, `speakers/`) |
| **Box** | A capability, in one sentence without "and" | The screens of one subject | A folder `<domain>/<box>/`, the same path in every package | A folder in `src/` and a build module | A swappable module or self-contained board/sub-assembly (`amps/mosfet`, `io/balance-converter`) |
| **Door** | What the capability offers others | Component variants (screens reach no tokens directly) | Its entry file — `index.ts` in TypeScript, the public surface in other languages | Its `root.zig`; what is `pub` | The four-part module contract: electrical pinout, mechanical template (`50×75 mm`), power/thermal budget and `board_chip` pin map |
| **Owner** | Who is the source of truth for a piece of data | The one screen where a thing is edited | The box whose tables or state hold it | The box that holds the state, and frees it | The module or standard that owns a circuit, mechanical envelope, bus address or power rail |
| **`shared`** | Domain common types; cross-deliverable `shared` contracts | The design system and patterns | A `shared/` folder of a matrix, plus the `shared` contracts repo/package | A low subject box (such as `board` in firmware), when several boxes share subject types | Top-level `shared/` (standards, footprints, libs, connectors, cases, protection, shared Zig protocols) and local `shared/` inside a device group |
| **Process** | A business process across capabilities | A `flow` (write) or composite `list`/`canvas` (read) across subjects | `_processes/` above a matrix's boxes | A box higher in the layer map, or `main` | A signal, power or control chain across modules (supply → DAC → volume → amp → protection → output) |
| **Group** | A box split into sub-boxes (`<group>/<sub-box>`) | Sub-section of screens under one subject | A folder `<domain>/<group>/<sub-box>/` with its entry | A subgroup of boxes in `layer_map` | A modular device family holding baseboards and swappable module cards (`analog/headphone-amp/{baseboards,amps,io}`) |
| **Deliverable** | A separately shipped unit (`04-launch.md` 13) | One themed app or site (`internal` or `public`) | A repo or workspace package (`shared`, `api`, `site`, `admin`) | One compiled binary, firmware image or library artifact | A manufacturable board revision (Gerbers/BOM), enclosure export (STEP/3MF/DXF) or flashed Zig firmware image |
| **Layer** | — | `foundations ← system ← patterns ← screens` | `core ← features ← domains ← app` (a front end adds `components` between `core` and `features`) | `limits ← core ← boxes ← main`, the layer map in `build.zig` | `standards & libs (shared) ← modules (KiCad / FreeCAD / Zig) ← baseboard & enclosure assembly` |
| **Composition root** | The product document itself | The application shell and navigation declaration | `app` | `main` | The baseboard / carrier PCB + enclosure assembly (and `main.zig` in firmware) |

Each section's own documents are the full text:
[design](../design/words.md),
[web](../software/principles/web/words.md),
[low-level](../software/principles/low-level/words.md),
[hardware](../hardware/foundations/structure.md). Product adopts these words as
they are written; design maps the matrix to screens in
[from matrix to screens](../design/process/from-matrix.md).
