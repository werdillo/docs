# Repository structure, modules and contracts

How a hardware repository organises electronics (**KiCad**), mechanics
(**FreeCAD**) and firmware (**Zig**) together under one roof using the same
matrix discipline as software ([matrix](../../shared/matrix.md),
[mapping](../../shared/mapping.md)): **domains** separate subjects, **modules**
stay opaque behind explicit **contracts**, and **`shared/`** holds every
reusable standard, library and sub-block.

## One repository across disciplines

A board, its enclosure and its firmware change together — moving a connector by
`2 mm` changes the PCB, the panel cut-out and sometimes the pin assignment.
Keeping all three in one repository keeps schematic revision, mechanical fit and
firmware pinout locked to the same commit:

- **KiCad** owns schematics, PCB layouts, verified libraries and fabrication
  outputs ([KiCad](../kicad/README.md)).
- **FreeCAD** owns parametric enclosures, front/rear panels, brackets and
  mounts fitted directly against the KiCad STEP model
  ([FreeCAD](../freecad/README.md)).
- **Zig** owns firmware (primarily targeting **RP2040** and **RP2350**
  microcontrollers), following [firmware](../firmware/README.md) and the
  [low-level firmware principles](../../software/principles/low-level/kinds/firmware.md),
  with every register confined to `board_chip` and every pin matching the
  schematic net table.

Not every module uses all three disciplines: a purely analogue card omits
`firmware/`, an internal daughterboard omits `freecad/`, and a cable or
mechanical bracket has neither PCB nor firmware. Each module holds only the
disciplines it physically has.

## Domains, `shared/` and modules

The repository mirrors the feature matrix directly:

```text
<hardware-repo>/
  README.md                       <- repository overview, domain map and revision policy
  docs/                           <- repo-wide architecture, measurement setup and bring-up guides
  shared/                         <- everything reused across domains
    standards/                    <- board form factors, bus specs, keying rules
    parts/                        <- unified preferred-parts catalogue (MPN, footprint, datasheet) & reference sub-circuits
    datasheets/                   <- vendor datasheets, app notes and errata for shared parts
    libs/                         <- verified KiCad symbol libraries
    footprints/                   <- verified .pretty footprints & 3D STEP models
    connectors/                   <- standard connector assemblies & pinouts
    cases/                        <- shared enclosure families & panel grids
    protection/                   <- reusable cross-domain circuits (DC protect, soft-start)
    signal-converter/             <- reusable balanced/unbalanced & level shifters
    volume/                       <- reusable attenuators & volume control blocks
    firmware/                     <- shared Zig protocols, board-ID enums, wire framing
  analog/                         <- domain: analogue signal processing
    README.md                     <- what this domain covers and its device groups
    headphone-amp/                <- device group (baseboards + swappable module cards)
      README.md                   <- short map of this device group
      docs/                       <- what it is for, block diagram, contracts, bench measurements, local datasheets
      template/50x75/             <- card form-factor template (outline, holes, header)
      pins/                       <- electrical pinout contract for the 50x75 card slot
      baseboards/                 <- composition roots (unbalance-single, unbalance-dual)
      amps/                       <- swappable amplifier modules (bipolar, chip, mosfet — each with its own README.md)
      io/                         <- swappable IO modules (balance-converter — with its own README.md)
      shared/                     <- blocks shared only inside headphone-amp
    preamp/
    phono-amp/
    power-amp/
  digital/                        <- domain: digital audio & control (with Zig firmware)
    dac/
      README.md
      docs/
      kicad/
      freecad/
      firmware/                   <- Zig package (limits <- core <- board <- boxes <- main)
    transport/
    player/
  power/                          <- domain: ac-ac, ac-dc, dc-dc supplies
  speakers/                       <- domain: transducers & acoustic enclosures
  headphones/                     <- domain: dynamic, planar, electrostatic
  cables/                         <- domain: power, analog, digital, speaker, headphone
```

- **Domains never tangle.** Each top-level folder owns one hardware subject
  (`analog/`, `digital/`, `power/`, `speakers/`, `headphones/`, `cables/`).
- **What is shared moves down into `shared/`.** A footprint, heatsink,
  protection circuit, connector pinout or Zig protocol used by one device lives
  in that device's local `shared/`; the moment a second device or domain uses
  it, it moves down into top-level `shared/` and keeps one single source of
  truth ([how a box moves](../../shared/matrix.md#how-a-box-moves)).
- **Baseboards are the composition root.** Inside a modular device group such as
  `analog/headphone-amp/`, each baseboard (`baseboards/unbalance-single`,
  `baseboards/unbalance-dual`) routes power, ground and signal between slots
  without duplicating amplifier internals. Swappable cards (`amps/bipolar`,
  `amps/chip`, `amps/mosfet`) plug into the same slot because every card obeys
  the same contract.

## The module contract (the hardware door)

In software, a box is opaque behind its door (`index.ts` or `root.zig`). In
hardware, a module is opaque behind a **four-part contract** kept beside its
slot (`pins/` and `template/` locally, or `shared/standards/` when reused across
domains):

| Part | What it fixes | Why it matters |
|---|---|---|
| **1. Electrical interface** | Pinout table: pin number, exact net name, signal kind (power, ground domain, analogue, digital bus), voltage/current limits, direction, pull resistors. | Any compliant module plugs in without frying a rail or creating a ground loop ([quality](./quality.md)). |
| **2. Mechanical interface** | Board outline (for example `50 × 75 mm`), PCB thickness, mounting-hole coordinates and diameter, connector origin and orientation, component height envelope, heatsink/thermal contact zone. | Cards swap physically across baseboards and fit the FreeCAD enclosure with zero manual re-drilling. |
| **3. Power and thermal budget** | Quiescent and peak current per supply rail, maximum dissipation in watts, thermal relief and clearance around hot parts. | The power domain sizes transformers, regulators and heatsinks from numbers, not guesses. |
| **4. Firmware contract** *(MCU or digital modules)* | Matching `board_chip` pinout table, bus addresses and speeds (I²C/SPI/I²S/UART), hardware revision strap ID, fault/mute pins and safe-state boot behaviour ([the hardware contract](../../software/principles/low-level/kinds/firmware.md#the-hardware-contract)). | Zig firmware compiles against exact schematic net names and halts safely on an unknown board revision. |

## Documentation, datasheets and unified components

A schematic shows *how* pins connect, never *why* a board exists or which parts
were proven on the bench. Every level of the repository documents itself so a
person or an agent understands any folder without reverse-engineering a PCB:

- **Every device group has `docs/`.** A product family such as
  `analog/headphone-amp/docs/` states what the device is, what it is used for,
  its block diagram, how baseboards and swappable modules combine, bring-up
  procedures, bench measurements (THD+N, noise floor, thermals) and revision
  history.
- **Every module box has a `README.md` (and `docs/` when needed).** Each module
  (for example `amps/mosfet/README.md`) names the slot contract it implements,
  its topology, operating points, power and thermal budget, known quirks and
  measured results.
- **Datasheets live inside the repository.** Vendor datasheets, application
  notes and errata are saved locally so links never rot: shared parts
  (RP2040/RP2350, regulators, op-amps, transistors, connectors) live in
  `shared/datasheets/`; parts unique to one device live in `<device>/docs/datasheets/`.
- **Unified components and reference sub-circuits (`shared/parts/`).** A curated
  preferred-parts catalogue lists the default resistors, C0G/film/electrolytic
  capacitors, regulators, protection diodes, transistors, connectors and
  fasteners — each linked once to its verified KiCad symbol, footprint, 3D STEP
  model and datasheet — alongside reusable reference circuits (standard power
  rails, USB-C/ESD front ends, SWD headers, DC-protection and mute drivers). New
  boards pick from the unified catalogue first rather than introducing a new
  part number for the same job.

## Standards, naming and revision discipline

- **One name across schematic, CAD and firmware.** A net named `MUTE_N` on the
  KiCad schematic is `MUTE_N` in the `pins/` contract table, `mute_n` in Zig's
  `board_chip`, and the matching silkscreen/panel label in FreeCAD. Synonyms
  across tools cause wiring bugs.
- **Freeze the contract before fanning out modules.** Just as software freezes
  `shared/` contracts in `serial A` before building boxes in parallel
  ([multi-agent workflow](../../shared/agents.md)), pinout tables, connector
  coordinates and form-factor templates (`template/50x75/`) are frozen and
  checked first so multiple amplifier topologies (`bipolar`, `chip`, `mosfet`)
  or baseboard layouts develop independently without collision.
- **Breaking a contract changes the revision and physical keying.** Never
  silently swap power and signal pins on an existing connector footprint. An
  incompatible pinout gets a new contract version (`v2`) and mechanical keying
  (missing pin, shifted header or different connector) so an old card cannot
  plug into a new baseboard and burn it.
- **Separate ground domains explicitly in the contract.** High-current return
  (`PGND`), digital return (`DGND`) and analogue reference (`AGND`) are named
  distinctly on connector pins and joined at the one star point chosen by the
  baseboard ([implementation](./quality.md#the-implementation)).
- **Every board revision carries a readable ID.** Passive boards carry revision
  silkscreen (`rev1.2`) and contract version (`slot-50x75-v1`); MCU-bearing
  boards also expose hardware strap pins or EEPROM ID read by Zig firmware at
  boot.

## Text-first formats and automated or LLM review

Hardware layout and mechanical modelling are still done by hand, yet keeping
every artefact in text-based formats inside one repository (KiCad S-expressions,
exported netlists, BOMs, ERC/DRC reports, Markdown pin contracts, local PDF
datasheets, FreeCAD parameter tables and Zig source) lets scripts and LLM
reviewers catch costly mistakes before fabrication:

- **Netlist vs contract and firmware:** cross-check the KiCad netlist against
  `pins/` (baseboard-to-module slot match, ground domain separation `AGND` /
  `DGND` / `PGND`, swapped bus lines) and against Zig's `board_chip` pin table.
- **Standards and BOM audit:** check the BOM against `shared/parts/` and local
  datasheets — flagging unapproved part numbers, class II ceramics (`X7R`) in
  an analogue signal path ([quality](./quality.md#components)), under-rated
  voltage/power margins or absolute library paths instead of `${KIPRJMOD}`.
- **Template and revision alignment:** verify that card outlines, mounting holes
  and connector coordinates in `.kicad_pcb` still match `template/` and that
  schematic revision, PCB silkscreen, FreeCAD exports and Zig strap IDs agree.
- **Grounded Zig firmware authoring:** because the schematic/netlist, `pins/`
  contract, local PDF datasheets (`shared/datasheets/`, `<device>/docs/datasheets/`)
  and host test harness live in the same repository, an LLM agent writes
  `board_chip` pin tables, peripheral drivers (register maps, bitfields,
  startup/mute delays) and domain boxes directly from primary sources rather
  than guessing, and proves them on the host with `zig build test` before
  flashing ([firmware](../firmware/README.md)).

## Not this

- Copying custom footprints and symbols into every module folder — a fixed pad
  error stays broken in five other boards; keep verified footprints in
  `shared/footprints/` and `shared/libs/`.
- Keeping Zig firmware, KiCad boards and FreeCAD enclosures in three unrelated
  repositories with no shared revision tag — pinouts and mounting holes drift on
  the very first board spin.
- Changing a module slot's pinout in place without versioning or keying —
  plugging an earlier module into the revised baseboard destroys hardware.
- Designing a baseboard that reaches into a module's internal bias or feedback
  nodes — every interaction crosses the documented connector contract.
- Drawing the enclosure in FreeCAD from hand-typed measurements instead of
  importing the real STEP export from KiCad.
