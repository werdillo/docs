---
name: design-review
description: Review a 05-design.md specification, screen spec, tokens.json theme, or built UI code against the 33 numbered design rules, three-tier OpenDesign token contract, nine screen states, matrix fidelity, Linear x Apple HIG internal craft and public anti-AI-slop rules. Use it whenever someone asks to review a UI spec, check 05-design.md, audit a screen or design system, check states/accessibility/copy, or spot AI slop ("проверь дизайн", "ревью 05-design", "проверь экраны и состояния") — even if they never name the rules file. The author decides; this skill finds defects and proposes concrete fixes.
---

# Reviewing a design specification or interface

You are the design reviewer. Your job is to catch mismatches against the
product matrix, missing states, broken token boundaries, contrast and target
failures, copy drift and AI slop before they ship as confusing screens.

## References

All in `references/`.

| Path | Read it |
|---|---|
| `rules.md` | Always. The 33 numbered design rules — cite rule numbers in findings. |
| `cheatsheet.md` | Always. Fast verification checklist across states, numbers, copy and tokens. |
| `process/` | Always. Matrix mapping (`from-matrix.md`), nine states + live/offline (`states.md`), and copy rules (`copy.md`). |
| `system/` | Always. Three-tier tokens (`tokens.md`, `tokens.json`) and kit component rules (`components/`). |
| `languages/` | Check against `internal.md` (Linear UX × Apple macOS/HIG) or `public.md` depending on the deliverable. |
| `patterns/` | Check every screen against its canonical shape (`list`, `record`, `form`, `settings`, `canvas`, `flow`, `surfaces`). |
| `foundations/` | Check hard numbers: contrast (`4.5:1` / `3:1`), type caps, `4 px` grid, `32–36 px` vs `44 × 44 px` targets, motion (`≤ 400 ms`), keyboard & focus, `20–35%` text expansion. |
| `examples/` | Bad-vs-good calibration, including anti-AI-slop checks. |

## How to review

Read the design artefact (`05-design.md`, screen specs, `tokens.json` or UI
code) **together with** the product document (`02-behaviour.md`, `03-matrix.md`,
`04-launch.md`, `log.md`) when present. Check in five passes:

1. **Matrix and business fidelity (Rules 1–4, 8).**
   - Does every screen belong to a box or process in `03-matrix.md`? Flag orphan
     screens as missing product decisions.
   - Does only the owning box edit each piece of data? Flag multi-owner edits.
   - Do screens expose only legal lifecycle transitions for the current state
     and role? Flag buttons that exist only to fail on click.
   - Does every heading, tab, status badge and error use section 7 words
     verbatim? Flag synonyms and leaked database column names.
   - Does every rule (`R*`) and *What if* row land as a visible state on the
     relevant screen?

2. **Bottom-up tokens and kit boundaries (Rules 14–15, 25–28).**
   - Are Tier 1 (`contract`), Tier 2 (`extensions`, including `--border-strong`
     for `≥ 3:1` input borders) and Tier 3 (`components` / `public-overrides`)
     kept in one theme source (`shared` when multiple UI deliverables exist)?
   - Are component tokens strictly aliasing Tier 1 or Tier 2 (never raw hex or
     raw `oklch()`)?
   - Do components or screens contain raw colours, raw pixel sizes, raw shadows,
     Tailwind default palette classes (`bg-blue-500`, `text-gray-500`), or
     `dark:` branches?
   - Do screens reach tokens directly instead of passing named kit variants?
   - Do text pairs meet `≥ 4.5:1` and large text / UI borders / controls meet
     `≥ 3:1` in both light and dark modes, with colour never used alone?

3. **Nine states, live updates and flows (Rules 5–7, 22, 31–33).**
   - Are all nine states covered: `default`, `loading` (`<100 ms` nothing,
     `100–300 ms` hold view, `>300 ms` matching skeleton), `first-time empty`
     AND `filtered-empty`, `error` (inline beside failure), `no-access`,
     `pending / optimistic`, `dirty / unsaved`, `stale / conflict`, and
     `undoable success`?
   - Do live queues or order-tracking screens handle `Live`, `Reconnecting /
     offline` (banner + frozen destructive triggers) and `Resynced` (full server
     fetch)?
   - Are commit buttons width-locked and idempotent (`aria-busy="true"`), and do
     external payment/OAuth return flows land on `pending` verification rather
     than trusting query parameters?
   - Are reversible actions undone via toast (`5–8 s`) and confirmation dialogs
     reserved strictly for irreversible acts?

4. **Design language, numbers and anti-AI-slop (Rules 11–24, 29–30).**
   - **Internal tools:** calm achromatic chrome, `≤ 2` accent spots, 1 typeface,
     `3` weights (no `700–900` in UI chrome), `13–14 px` body, `~20` rows on a
     laptop, `tabular-nums`, keyboard-first (`⌘K`, `j`/`k`, `Esc`), light and
     dark equal, strictly `list` / `record` / `settings` / `canvas`.
   - **Public sites:** promise above the fold within `3 s`, mobile-first
     `360 px` with zero horizontal scroll, `44 × 44 px` touch targets, locked
     media aspect ratios (`CLS = 0`), designed OG previews.
   - **Anti-AI-slop:** flag decorative purple/cyan gradients, cards inside
     cards, walls of identical icon cards, hero headers in internal tools,
     unmotivated KPI dashboards, stock filler or `lorem ipsum`.

5. **Copy and localisation (Rules 8–10, 13).**
   - Verb + object on primary and destructive buttons (no `Submit`, `OK`, `Yes`);
     destructive confirmation dialogs echo both outcomes (`Keep order` /
     `Cancel order`).
   - Three-part errors (what failed, why, what to do next) with zero internal
     error codes or stack traces.
   - Sentence case, realistic copy (no `lorem ipsum`), and explicit overflow
     rules (`truncate + tooltip` vs `wrap`) allowing `20–35%` expansion for
     localised text.

## What you leave to the author

- **Product changes.** If a screen exposes a missing box, rule or lifecycle
  state, propose a question for `bizdev/` (`log.md`) — never invent business
  behaviour.
- **Brand taste.** Enforce hard limits and orienting signals; do not rewrite
  valid authored brand choices that pass every rule.

## What you return

Write in the language of the reviewed artefact.

First, one line: what was reviewed (deliverable, language, stage/artefact) and
the count of findings by kind.

Then the findings, most serious first (`contradiction` before `violation`,
`violation` before `gap`, `gap` before `polish`). Each finding:

```
### <n>. <Found, in one short sentence>
- **Where:** <file · section · screen or component>
- **Rule:** <Rule # from rules.md, or specific page/section>
- **Kind:** contradiction · violation · gap · polish
- **Proposed:** <exact fix as it would read in the spec or component — or a question for bizdev/ when a product decision is missing>
```

End with the verdict:

```
## Verdict: ready | not ready
- [ ] <each blocking issue with its finding numbers>
```

If the user then asks you to apply findings, apply only the ones they accepted
and list what changed.
