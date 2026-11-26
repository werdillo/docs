# Rules

Every design rule in one numbered list. The full text and examples live in the
linked page; this file is the index, not a copy.

Status says whether a test checks it, not how important it is:
- ***(guarded)*** — checked automatically by a UI or site guard in
  [`software/principles/web/guards/`](../software/principles/web/guards/README.md).
- ***(signal)*** — an orienting number or threshold that asks a question before
  it breaks.
- ***(default)*** — the rule, checked by design review and manual checks.

## Process and matrix — [`process/`](./process/README.md)

1. **Every screen belongs to a box or process in the product document.** A
   screen with no box is a missing product decision, fixed in `bizdev/` first.
   *(default)* ([from matrix](./process/from-matrix.md))
2. **One owner edits each piece of data.** Other screens show it read-only or
   link to its owner. *(default)* ([from matrix](./process/from-matrix.md))
3. **Lifecycles decide which actions exist.** Only transitions allowed from the
   current state appear on screen. *(default)* ([from matrix](./process/from-matrix.md))
4. **Every rule a person can break has a visible state on screen**, and every
   *What if* row has a designed edge state. *(default)*
   ([from matrix](./process/from-matrix.md))
5. **Every screen designs all nine states up front** — default, loading, empty,
   error, no-access, pending/optimistic, dirty, stale/conflict, undoable
   success. *(default)* ([states](./process/states.md))
6. **Loading follows three time thresholds**: under `100 ms` show nothing,
   `100–300 ms` hold the previous view, past `300 ms` draw a skeleton matching
   the final geometry. *(signal)* ([states](./process/states.md))
7. **Empty states split into first-time and filtered-empty** — creation CTA for
   the first, one-click filter reset for the second. *(default)*
   ([states](./process/states.md))
8. **Screens use the product document's words verbatim.** A synonym on a screen
   invents a second concept. *(default)* ([copy](./process/copy.md))
9. **Primary and destructive buttons name verb and object**, and confirmation
   dialogs echo the exact outcome. *(default)* ([copy](./process/copy.md))
10. **Every error has three parts** — what failed, why, and what to do next —
    placed beside what failed. *(default)* ([copy](./process/copy.md))

## Foundations — [`foundations/`](./foundations/README.md)

11. **One focal point per screen or band**, and at most one primary accent
    action per view (at most two accent spots on internal chrome). *(signal)*
    ([hierarchy](./foundations/hierarchy.md))
12. **At most one typeface in an internal app, and at most two on a public
    site**, with a three-weight scale (never Black/900 in UI). *(default)*
    ([typography](./foundations/typography.md))
13. **Readable body sizes, line heights and measures**: `13–14 px` internal or
    `16–18 px` public body, `1.45–1.6` body line-height, `45–75 ch` prose
    measure, and `tabular-nums` on every price, count and table column.
    *(signal)* ([typography](./foundations/typography.md))
14. **Contrast is measured, never guessed**: at least `4.5:1` for normal text,
    `3:1` for large text and UI controls/borders, and colour never carries
    meaning alone. *(default)* ([colour](./foundations/colour.md))
15. **Colour is built in OKLCH with achromatic chrome first** — greys carry
    hierarchy, semantic tokens carry state. *(default)*
    ([colour](./foundations/colour.md))
16. **Spacing follows the `4 px` base grid and the Law of Proximity**: the gap
    inside a group is strictly smaller than the gap between groups (at least
    `1.5–2×`). *(signal)* ([spacing](./foundations/spacing.md))
17. **Hit targets meet their floor**: `32–36 px` for dense desktop controls and
    `44 × 44 px` minimum for touch, with zero horizontal overflow at `360 px`
    viewport or `200%` zoom. *(default)* ([spacing](./foundations/spacing.md))
18. **Motion only orients, confirms or connects**, never exceeds `400 ms`,
    animates only `transform` and `opacity`, and respects
    `prefers-reduced-motion`. *(default)* ([motion](./foundations/motion.md))
19. **Every control is keyboard-reachable with a visible focus ring**, every
    modal traps focus and returns it on `Esc`, and every icon-only button or
    non-decorative image carries a text alternative. *(guarded for site images
    and headings; default otherwise)*
    ([accessibility](./foundations/accessibility.md))

## Design languages — [`languages/`](./languages/README.md)

20. **Internal tools are calm, dense, keyboard-first and equal in light and
    dark**, combining Linear for UX and behaviour with Apple desktop system
    apps (macOS / HIG) for colour palette, materials and control feel.
    *(default)* ([internal](./languages/internal.md),
    [references](./references/internal.md))
21. **The composition root declares navigation order**, grouped by domain; each
    box exports only its own item. *(default)*
    ([internal](./languages/internal.md#navigation))
22. **Reversible writes undo; irreversible writes confirm.** Low-risk writes
    update optimistically and roll back with an error on refusal. *(default)*
    ([internal](./languages/internal.md#quiet-feedback))
23. **Public sites state their promise above the fold**, are designed
    mobile-first at `360 px` with locked media aspect ratios (`CLS = 0`), and
    carry designed OpenGraph previews. *(guarded for head/images; default
    otherwise)* ([public](./languages/public.md))
24. **No AI slop**: no decorative gradients, no cards inside cards, no walls of
    generic icon cards, no fake testimonials, no unmotivated KPI dashboards.
    *(default)* ([public](./languages/public.md#not-this))

## System and tokens — [`system/`](./system/README.md)

25. **Build bottom-up: tokens first, components second, interfaces third.**
    One theme file declares all three tiers (OpenDesign contract, semantic
    extensions, component tokens), light and dark under the same names;
    optional slots alias rather than disappear. *(default)*
    ([tokens](./system/tokens.md))
26. **Component tokens always alias tier-1 or tier-2 tokens**, never raw
    colours, stay scoped to their owning component, and keep dimensions on the
    `4 px` grid. *(default)*
    ([component tokens](./system/tokens.md#tier-3-component-tokens))
27. **No raw colours, sizes or shadows in components or screens**, and no
    framework default palette classes (`bg-blue-500`, `dark:`). *(guarded)*
    ([tokens](./system/tokens.md),
    [UI guard](../software/principles/web/guards/ui.md))
28. **The kit maps tokens; screens pass variants only** — a screen reaches no
    token directly. *(guarded)* ([tokens](./system/tokens.md),
    [the kit](../software/principles/web/ui/kit.md))

## Screen shapes and patterns — [`patterns/`](./patterns/README.md)

29. **Every screen is one of six canonical shapes** — `list`, `record`, `form`,
    `settings`, `canvas` or `flow` (four of them — `list`, `record`, `settings`,
    `canvas` — for an internal system). *(default)*
    ([patterns](./patterns/README.md))
30. **Lists align by column** (text left, numbers and money right), show about
    `20` rows on a laptop in internal tools, and lock card ratios on public
    grids. *(signal)* ([list](./patterns/list.md))
31. **Forms default to one column (`520–600 px` max)**, validate on blur and
    submit (never while first typing), and protect unsaved work. *(default)*
    ([form](./patterns/form.md))
32. **Flows are linear, reversible until commit, and idempotent on submit**,
    with `3–5` steps as the orienting signal. *(signal)*
    ([flow](./patterns/flow.md))
33. **Dialogs sit near the top of the screen**, keep confirmation dialogs
    narrow and reserved for irreversible acts, and never replace a full screen
    shape. *(default)* ([surfaces](./patterns/surfaces.md))
