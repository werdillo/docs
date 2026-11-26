# Foundations

Universal design principles that hold for every product — whether it uses
[the internal design language](../languages/internal.md) or
[the public design language](../languages/public.md). Each rule states a number
or a test, never an adjective, and maps directly to the
[OpenDesign tokens](../system/tokens.md).

## How to read this folder

1. Start with [hierarchy.md](./hierarchy.md) to decide what draws the eye first
   and what stays quiet.
2. Read [typography.md](./typography.md), [colour.md](./colour.md) and
   [spacing.md](./spacing.md) together — they govern every static surface.
3. Read [motion.md](./motion.md) before adding any transition or state change.
4. Use [accessibility.md](./accessibility.md) as the verification gate across
   all five; its implementation rules live in
   [`software/principles/web/ui/accessibility.md`](../../software/principles/web/ui/accessibility.md).

Once read, open a single file whenever a screen review or token decision raises
a question in that area.

## What is in this folder

| File | What it holds |
|---|---|
| [`hierarchy.md`](./hierarchy.md) | **One primary focal point per screen** — emphasis order, accent budget, squint test and scan paths. |
| [`typography.md`](./typography.md) | **Legible type on a short scale** — typeface caps, 3-weight scale, size floors, line-height, measure and `tabular-nums`. |
| [`colour.md`](./colour.md) | **Perceptual colour and hard contrast floors** — OKLCH, WCAG and APCA limits, achromatic balance, semantic roles and equal light/dark modes. |
| [`spacing.md`](./spacing.md) | **A 4 px grid where proximity carries structure** — `--space-*` rhythm, container widths, breakpoints, hit targets and optical alignment. |
| [`motion.md`](./motion.md) | **Short, compositor-only motion with a job** — duration ceilings, directional easing, token timing and `prefers-reduced-motion`. |
| [`accessibility.md`](./accessibility.md) | **Concrete testable accessibility rules** — keyboard flow, focus rings, modal traps, landmarks, text alternatives, 200% zoom and RTL readiness. |
