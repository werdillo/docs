---
name: design-spec
description: Translate a product document (02-behaviour.md, 03-matrix.md and 04-launch.md) into 05-design.md, three-tier token overrides and per-screen specifications strictly in the build order tokens -> components -> interfaces. Use it whenever someone asks to design screens, write 05-design.md, map a feature matrix to UI, specify states and copy, or prepare a UI handoff from a product spec ("спроектируй экраны", "напиши 05-design", "переведи матрицу в интерфейс") — even if they never name the design rules.
---

# Designing from a product matrix

You turn a product document (`01`–`04`) into `05-design.md` and concrete screen
specifications that a person or an implementation agent can build without
guessing. Design never invents a second structure beside the business's: it
draws the exact domains, boxes, processes, lifecycles, rules and words from
`bizdev/`.

## References

All in `references/`. Read what matches the task; do not recite rules back to
the user.

| Path | Read it |
|---|---|
| `rules.md` | Always. All 33 numbered design rules and their status. |
| `cheatsheet.md` | Always. One-screen build and verification checklist. |
| `process/` | Always. Matrix-to-screen mapping, the nine states (+ real-time/offline), and interface copy. |
| `system/` | Always. Three-tier tokens (`tokens.md`, `tokens.json`) and kit component specifications (`components/`). |
| `languages/` | Pick per deliverable: `internal.md` (Linear UX × Apple macOS/HIG palette & materials) or `public.md` (mobile-first storefronts & sites). |
| `patterns/` | Pick per screen: `list`, `record`, `form`, `settings`, `canvas`, `flow`, plus `surfaces`. |
| `foundations/` | Whenever choosing numbers, contrast, type, spacing, motion, keyboard or localisation overflow behaviour. |
| `examples/` | Bad-vs-good calibration, including anti-AI-slop comparisons. |
| `05-design-template.md` | Target structure for `05-design.md` in an Option A product folder. |
| `mapping.md` | Shared vocabulary mapping across product, design and code. |

## Non-negotiable rules

1. **Follow the build order: tokens → components → interfaces.** Specify the
   theme/token tier first, confirm which kit components and variants are needed
   second, and specify screens third. Never draw a screen with raw hex values,
   unnamed pixel sizes, or ad-hoc components outside the kit.
2. **Never invent product decisions.** Every screen maps to a box or process in
   `03-matrix.md`. If a screen seems to need a missing box, role, rule, or
   lifecycle move, stop and log an open question (`Q*`) in `log.md` rather than
   quietly inventing it.
3. **One owner edits each piece of data.** Other screens show it read-only or
   link back to the owning box's screen.
4. **Business words are law.** Use section 7 (`02-behaviour.md`) words verbatim
   across headings, tabs, status badges, buttons and error messages.
5. **No AI slop.** No decorative gradients, no cards inside cards, no walls of
   generic icon cards, no hero headers in internal tools, no `lorem ipsum`, no
   invented metrics or fake testimonials.

## How to produce a design specification

1. **Read the product document first.** Read `README.md`, `02-behaviour.md`,
   `03-matrix.md`, `04-launch.md` and `log.md` (or the single-file draft). Note
   every deliverable (`shared`, `api`, `site`, `admin`), role, business word,
   box, process, lifecycle, rule (`R1`, `R2`…) and *What if* row.
2. **Assign languages and three-tier tokens.**
   - Map each UI deliverable to `internal` (daily staff tool) or `public`
     (storefront, landing or guest surface).
   - When a product ships multiple interfaces alongside a `shared` deliverable,
     place Tier 1 (`contract`) and Tier 2 (`extensions`) tokens (including
     `--border-strong` for `≥ 3:1` input borders) in `shared`, and switch Tier 3
     density per deliverable (`internal` `32 px` defaults vs
     `[data-density="public"]` `44 px` touch minimum).
   - State the light/dark policy explicitly: internal tools always design light
     and dark as equals; public sites may choose one authored mode if their
     photography requires it.
3. **Write `05-design.md` (following `05-design-template.md`).**
   - **Languages and theme** table per deliverable.
   - **Screen map** table: one row per user-facing box or process, naming the
     exact canonical shape (`list`, `record`, `form`, `settings`, `canvas`,
     `flow`; internal apps use `list`, `record`, `settings`, `canvas`) and
     allowed roles. Omit boxes people never see.
   - **Navigation**: one section per domain in daily-use order, declared by the
     composition root; setup items folded at the end for internal apps.
   - **Public pages' target queries** (only when a public site exists).
   - **Critical states and copy**: map every rule (`R*`), lifecycle transition,
     *What if* row, live/offline screen (`Live · Reconnecting · Resynced`) and
     external redirect/return flow (payment/OAuth `pending` verification) onto
     the exact screen where it lands.
4. **Write per-screen specifications (when requested or for Stage 1 screens).**
   For each screen, keep the spec concise and complete:
   - Source box/process, deliverable, design language, role, and canonical shape.
   - Kit components and named variants only (no raw tokens or raw hex/px).
   - Lifecycle-driven actions (only transitions legal from the current state;
     verb + object labels; undo for reversible writes, narrow confirmation
     dialog echoing the exact outcome for irreversible writes).
   - All nine states (`default`, `loading` with `<100 ms / 100–300 ms / >300 ms`
     skeleton, `first-time empty` + `filtered-empty`, `error` with 3-part copy,
     `no-access`, `pending / optimistic`, `dirty / unsaved`, `stale / conflict`,
     `undoable success`), plus live/offline or external-return states where
     applicable.
   - Real business copy (never `lorem ipsum`) and explicit overflow behaviour
     (`truncate + tooltip` vs `wrap`) allowing `20–35%` localisation expansion.

## What you return

Write in the language of the product document.

1. The created or updated `05-design.md` (and any requested screen specs or
   `tokens.json` overrides).
2. A short summary listing:
   - deliverables and chosen languages (`internal` / `public`) + `shared` token
     split;
   - every screen mapped to its box/process and canonical shape;
   - any missing product decisions logged as `Q*` in `log.md` rather than
     invented.
