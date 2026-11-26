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

## Automated contrast and visual regression guards

Today the UI guard ([`web/guards/ui.md`](../software/principles/web/guards/ui.md))
blocks raw values and framework palettes in code, and the site guard checks
heads and image attributes, but nothing automatically fails CI on a contrast
regression (`< 4.5:1`) or a layout shift across light and dark modes. What
would settle it: an automated check over `tokens.json` (testing every
foreground/background token pair) plus Playwright screenshot/axe rules in
`software/principles/web/testing/`.

## `tokens.json` to CSS and Figma pipeline

[`system/tokens.md`](./system/tokens.md) defines the three-tier token contract
and [`system/tokens.json`](./system/tokens.json) holds the starter W3C Design
Tokens data, but the exact generator from `tokens.json` to CSS custom
properties, utility theme config and Figma variables is not chosen yet. What
would settle it: one build script exercised on a real project that outputs CSS
and Figma variables cleanly from `tokens.json`.
