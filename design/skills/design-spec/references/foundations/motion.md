# Motion

How motion orients, confirms and connects interface states without making a
product feel sluggish, noisy or nauseating.

## In one minute

- **Motion has one of three jobs**: orient, confirm or connect — purely
  decorative animation is forbidden.
- **Duration bounds**: `100–150 ms` (`--motion-fast`) for micro-interactions,
  `180–240 ms` (`--motion-base`) for menus, dialogs and drawers, `250–350 ms`
  for view transitions; `400 ms` hard ceiling (hard test limit).
- **Directional easing**: `ease-out` entering, `ease-in` leaving (`20–30%`
  faster), `ease-in-out` (`--ease-standard`) moving in place.
- **Compositor-only properties**: animate `transform` and `opacity` only — never
  `height`, `width`, `top` or `left` (hard test limit).
- **`prefers-reduced-motion` is mandatory**: replace movement with instant
  switches or short `≤ 100 ms` opacity fades (hard test limit).

## Motion only when it has a job

**Every transition earns its milliseconds by answering a spatial or causal
question** ([internal language](../languages/internal.md#instant)):

1. **Orient** — shows where a new surface came from or returned to (a popover
   unfolding from its trigger button, a mobile drawer sliding from the menu
   edge).
2. **Confirm** — gives immediate tactile feedback to a direct gesture (a switch
   thumb crossing its track, a button pressing down by `1%`, a cart badge
   updating).
3. **Connect** — keeps identity continuous when an element changes position or
   state (a segmented-control thumb sliding to the newly selected tab, a bulk
   action bar rising when a row is checked).

If removing an animation makes the screen faster and no harder to understand,
remove it. Frequent actions — opening the command palette (`⌘K`), stepping
through list rows with `j`/`k`, switching sidebar views — are instant or near
instant.

## Duration bounds

All durations read from the OpenDesign motion tokens (`--motion-fast`,
`--motion-base`, [tokens](../system/tokens.md#tier-1-opendesign-contract-names)), never raw
millisecond numbers scattered through components.

| Category | Duration | Token | Kind |
|---|---|---|---|
| Micro-interactions (hover, focus ring, toggle thumb, checkbox, tooltip) | `100–150 ms` | `--motion-fast` | Orienting range |
| Overlays (menus, popovers, dialogs, toasts, slide-over drawers) | `180–240 ms` | `--motion-base` | Orienting range |
| Large view or full-sheet transitions | `250–350 ms` | — | Orienting range |
| **Hard ceiling for any UI transition** | **`400 ms`** | — | **Hard test limit** |

- **Exits run `20–30%` faster than entries** (orienting signal). A dialog that
  enters in `200 ms` dismisses in `140–150 ms`: once the user closes a panel,
  their eyes are already on what lies behind it.
- **Distance scales duration slightly, never past `400 ms`.** A `16 px` switch
  thumb finishes in `120 ms`; a `360 px` mobile cart drawer takes `220–260 ms`.
  Anything above `400 ms` feels sluggish and blocks the next click.

## Directional easing

Easing matches physical momentum so elements feel responsive rather than robotic:

- **`ease-out` for entering elements** (for example `cubic-bezier(0.16, 1, 0.3, 1)`).
  Fast initial velocity makes the interface feel immediate; gentle deceleration
  lands cleanly in place.
- **`ease-in` for leaving elements** (for example `cubic-bezier(0.4, 0, 1, 1)`).
  Quick acceleration clears the stage without lingering.
- **`ease-in-out` (`--ease-standard`) for elements moving or morphing in place**
  (for example a tab indicator or switch thumb travelling across its track).
- **`linear` only for continuous non-spatial progress** — indeterminate spinners
  and smooth opacity-only fades. Never apply `linear` to sliding panels or
  drawers.
- **Avoid spring overshoot on utility UI.** Bouncy elastic curves belong only to
  deliberate playful moments on a public brand site, never on admin dialogs,
  menus or form controls.

## Compositor-only properties

- **Animate only `transform` (`translate`, `scale`, `rotate`) and `opacity`**
  (hard test limit). Both run on the browser's compositor thread at `60–120 fps`
  without triggering layout recalculation or paint.
- **Never animate `height`, `width`, `top`, `left`, `margin`, `padding` or
  `border-width`** (hard test limit). Layout animations force reflow on every
  frame, drop frames on mid-range phones and cause neighbouring content to
  judder ([internal language](../languages/internal.md#instant)).
- **Reveal panels with opacity + short translate, not height expansion.** A
  dropdown opens from `opacity: 0; transform: translateY(-4px) scale(0.98)` to
  `opacity: 1; transform: none` over `--motion-fast` — crisp, anchored to its
  trigger, and zero reflow.

## Mandatory `prefers-reduced-motion`

Vestibular disorders turn parallax, zooming modals and long slides into physical
discomfort ([motion is optional](../../software/principles/web/ui/accessibility.md#motion-is-optional)).

- **Every animated component honours `@media (prefers-reduced-motion: reduce)`**
  (hard test limit).
- **Replace spatial travel with instant switches or short opacity fades
  (`≤ 100 ms`, hard test limit).** Under reduced motion, drawers, dialogs and
  popovers appear in place with no `translate` or `scale`; smooth-scroll jumps
  immediately (`scroll-behavior: auto`).
- **Keep functional progress indicators working.** Reduced motion removes
  unnecessary movement — it never hides a loading state or freezes a progress
  bar's real percentage.

```css
/* Honour reduced motion globally at the token layer */
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0.01ms;
    --motion-base: 0.01ms;
  }
}
```

## Example: Small shop

- **Shop site (cart drawer):** Clicking the cart icon slides the drawer in from
  `inline-end` using `transform: translateX(...)` over `220 ms` (`--motion-base`,
  `ease-out`) while the backdrop fades `opacity` from `0` to `1`. Pressing `Esc`
  dismisses it in `150 ms` (`--motion-fast`, `ease-in`). With
  `prefers-reduced-motion: reduce`, the drawer and backdrop fade in over `80 ms`
  with zero horizontal travel.
- **Admin (filter popover and bulk bar):** Opening *Filter* fades and translates
  `4 px` down over `120 ms` (`--motion-fast`, `ease-out`). Selecting rows raises
  the floating bulk-action bar from the bottom edge via `transform` + `opacity`
  over `180 ms`. Switching between *Orders* and *Products* in the sidebar has
  `0 ms` animation so frequent navigation stays instant.

## Not this

- **Staggered `600 ms` scroll-reveal animations on every product card** —
  violates the `400 ms` ceiling and forces visitors to wait before reading what
  they scrolled to see.
- **Animating `max-height` from `0` to `500px` on an accordion** — triggers
  layout reflow every frame and runs at unpredictable speeds; swap instantly or
  use compositor-safe disclosure transitions.
- **Pulsing or bouncing `--accent` checkout buttons** — decorative motion with
  no user trigger; steals focus continuously and distracts from reading.
- **Ignoring `prefers-reduced-motion` on modals and carousels** — fails the hard
  reduced-motion test and causes nausea for motion-sensitive visitors.
- **Slow `350 ms` exit animations on tooltips and menus** — makes the app feel
  sticky after the user has already moved on.
