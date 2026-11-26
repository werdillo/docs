# Design cheatsheet

A map, not a copy — every line points to the page that owns the rule. Use this
while turning a product document's `03-matrix.md` and `05-design.md` into a
screen specification or reviewing a built screen.

## Build order: tokens → components → interfaces

1. **Set the theme tokens first** — OpenDesign contract + semantic extensions +
   component tokens tuned to `internal` or `public` density
   ([tokens](./system/tokens.md), [`tokens.json`](./system/tokens.json)).
2. **Build or pick kit components second** — every control comes from
   [`system/components/`](./system/components/README.md) with all six states
   and keyboard handling wired to those tokens.
3. **Assemble screens third** — never draw a screen before its tokens and
   components exist.

## Before drawing a screen

1. **Locate it in the matrix**: which domain, box or process, and role? If it
   is not in `03-matrix.md`, stop and update `bizdev/` first
   ([from matrix](./process/from-matrix.md)).
2. **Pick the design language**: daily staff tool →
   [internal](./languages/internal.md); storefront / landing / site →
   [public](./languages/public.md).
3. **Pick one canonical screen shape**:
   [list](./patterns/list.md) · [record](./patterns/record.md) ·
   [form](./patterns/form.md) · [settings](./patterns/settings.md) ·
   [canvas](./patterns/canvas.md) · [flow](./patterns/flow.md)
   (internal apps use `list`, `record`, `settings`, `canvas`).
4. **Pull the business rules, lifecycles and *What if* rows** from
   `02-behaviour.md` and `03-matrix.md` — every rule a user can trigger lands
   as a state on this screen.

## Check the nine states ([states](./process/states.md))

- [ ] **Default** — one clear focal point, one primary action.
- [ ] **Loading** — nothing under `100 ms`; hold view `100–300 ms`; matching
      skeleton past `300 ms`.
- [ ] **Empty** — first-time empty (purpose + 1 CTA) *and* filtered-empty
      (reset filters).
- [ ] **Error** — inline below invalid field; inline banner on refusal; retry
      on full read failure.
- [ ] **No access / lifecycle-blocked** — forbidden actions omitted, not shown
      as broken clicks.
- [ ] **Pending / optimistic** — instant + rollback for low-risk edits; locked
      busy button (`Placing order…`) for commits.
- [ ] **Dirty / unsaved** — visible indicator and leave guard (or autosave).
- [ ] **Stale / conflict** — names what changed and gives direct recovery.
- [ ] **Undoable success** — quiet toast with *Undo* (`5–8 s`) instead of a
      modal confirmation.

## Check the numbers ([foundations](./foundations/README.md))

- **Hierarchy:** 1 focal point, 1 primary button, ≤2 accent spots on internal
  chrome ([hierarchy](./foundations/hierarchy.md)).
- **Typography:** 1 face (internal) / ≤2 (public), ≤3 weights (no 900),
  `13–14 px` internal or `16–18 px` public body, `45–75 ch` prose measure,
  `tabular-nums` on numbers and money ([typography](./foundations/typography.md)).
- **Colour:** `≥4.5:1` text contrast, `≥3:1` large text and controls, OKLCH
  achromatic-first, never colour alone, equal light & dark on internal apps
  ([colour](./foundations/colour.md)).
- **Spacing & targets:** `4 px` grid, inner gap < outer gap (`1.5–2×`),
  `32–36 px` desktop / `44 × 44 px` touch targets, `0` horizontal scroll at
  `360 px` and `200%` zoom ([spacing](./foundations/spacing.md)).
- **Motion:** `100–350 ms` (`400 ms` max), `transform`/`opacity` only,
  `prefers-reduced-motion` honoured ([motion](./foundations/motion.md)).
- **Accessibility:** full keyboard traversal, `:focus-visible` ring, modal trap
  + `Esc` + focus return, text alternatives ([accessibility](./foundations/accessibility.md)).

## Check copy, tokens and anti-AI-slop

- **Words:** section 7 (`02-behaviour.md`) business words verbatim; verb +
  object buttons; three-part errors; sentence case ([copy](./process/copy.md)).
- **Tokens:** OpenDesign names only (`--accent`, `--warn`, `--danger`,
  `--muted`), mapped in the kit; zero raw hex/px or direct token utilities in
  screen files ([tokens](./system/tokens.md),
  [UI guard](../software/principles/web/guards/ui.md)).
- **Anti-AI-slop:** no decorative gradients, no cards inside cards, no generic
  icon-card walls, no hero headers inside internal tools, no lorem ipsum.
