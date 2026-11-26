# Not decided yet

Gaps in these design documents: what is not settled yet, named so the gap is
visible instead of implied. Each leaves the list when a document replaces it.

## Native mobile and desktop conventions

The foundations set touch targets (`44 × 44 px`) and responsive floors
(`360 px`), and [`software/principles/web/stack/mobile-desktop.md`](../software/principles/web/stack/mobile-desktop.md)
names mobile and desktop targets. What is not written yet is how a native app
handles platform conventions — bottom tab bars, safe areas, swipe gestures,
haptics, desktop window chrome, menu bars and native dialogs. What would settle
it: a `languages/native.md` (or platform addenda) tested against one real
mobile and one real desktop deliverable.

## Brand identity, photography and iconography

The public language covers layout, typography, contrast and anti-slop rules,
and stops short of brand systems: logo construction and clear space, custom
icon stroke weights (`1.5 px` vs `2 px`), illustration style, and photography
direction. What would settle it: a concise `foundations/imagery.md` (or brand
brief template) once two real public products share the same requirements.

## Industrial and embedded UI at the hardware boundary

[`hardware/`](../hardware/README.md) covers boards and enclosures, and
[`low-level/kinds/firmware.md`](../software/principles/low-level/kinds/firmware.md)
covers firmware. Physical controls (buttons, rotary encoders, LED blink codes,
port labels, small OLED/e-ink screens) sit between `design/` and `hardware/`
and have no shared rules yet. What would settle it: one device project that
defines tactile, LED and small-display rules and tests whether they belong in
`design/languages/` or `hardware/foundations/`.

## Runtime visual regression and accessibility checks

[`check-docs.mjs`](../shared/scripts/check-docs.mjs) verifies WCAG 2.1 contrast
ratios across every foreground/background pair in [`tokens.json`](./system/tokens.json)
in both light and dark modes, and the UI guard
([`web/guards/ui.md`](../software/principles/web/guards/ui.md)) blocks raw
values and framework palettes in code. What is not automated yet is runtime
browser verification — rendered layout shift (`CLS`), text-over-photo contrast,
and live DOM accessibility across light and dark modes. What would settle it:
Playwright screenshot and axe checks wired into
[`software/principles/web/testing/`](../software/principles/web/testing/README.md).

## Syncing `tokens.json` with Figma variables

[`tokens-to-css.mjs`](../shared/scripts/tokens-to-css.mjs) compiles
[`tokens.json`](./system/tokens.json) into a ready-to-use `theme.css` (light,
dark and `public` density), but syncing the same W3C file into Figma variable
collections is not automated yet. What would settle it: one real product team
running a round-trip sync between `tokens.json` and Figma variables.
