# Status badge, tag and filter chip

Displays a compact state, category or active filter without dominating the
screen ([colour](../../foundations/colour.md),
[hierarchy](../../foundations/hierarchy.md)).

## Anatomy

- **Container** — pill (`--badge-radius`, height `--badge-height`), single line.
- **Leading cue** — `6–8 px` dot or `12 px` icon carrying shape alongside
  colour so meaning never relies on colour alone.
- **Label** — 1–2 words in sentence case, exact business term from section 7
  (`02-behaviour.md` — *Placed*, *Paid*, *Cancelled*, *Withdrawn*, *Sold out*).
- **Remove trigger** *(filter chip only)* — `×` icon button with `aria-label`
  (*Remove filter: State is Placed*).

## Variants

| Component | `tone` values | Fill & text tokens |
|---|---|---|
| `Badge` | `neutral` · `accent` · `success` · `warn` · `danger` | Soft tint (`--surface-hover`, `--accent-soft`, `--success-soft`, `--warn-soft`, `--danger-soft`) paired with high-contrast text (`--fg-2`, `--accent`, `--success`, `--warn`, `--danger`). |
| `Tag` | `neutral` | Quiet `--surface-hover` fill with `--fg-2` text for non-status labels. |
| `FilterChip` | `active` | `--surface` with `1 px` `--border`, key in `--muted`, value in `--fg`, plus `×` dismiss button. |

## States

1. **Default** — static on badges; clickable on interactive filter chips.
2. **Hover** — filter chip shifts to `--surface-hover`; non-interactive badges
   have no hover change (never imply a click that does nothing).
3. **Focus** — `:focus-visible` ring (`--focus-ring`) on interactive chips and
   their remove button.
4. **Pressed** — active step when clicking a filter chip to edit its value.
5. **Disabled** — `--meta` text on `--panel` fill.
6. **Error / alert** — `tone="danger"` with an explicit word (*Sold out*,
   *Withdrawn*, *Failed*) and warning icon.

## Tokens

| Tier | Tokens |
|---|---|
| Contract | `--surface`, `--fg`, `--fg-2`, `--muted`, `--meta`, `--border`, `--accent`, `--success`, `--warn`, `--danger`, `--focus-ring`, `--radius-pill`, `--space-2` |
| Extensions | `--surface-hover`, `--panel`, `--accent-soft`, `--success-soft`, `--warn-soft`, `--danger-soft` |
| Component | `--badge-height`, `--badge-px`, `--badge-radius` |

## Keyboard and accessibility

- Static badges are plain `<span>` elements (never focusable).
- Filter chips expose two clear controls or one button to edit and a separate
  accessible remove button (`Backspace`/`Delete` or `Enter` on `×`).
- Text contrast over soft tints meets `4.5:1` in both light and dark modes.

## When to use and when not to

- **Use `Badge`** for lifecycle states (`03-matrix.md` section 10) and business
  rule warnings (*Sold out*, *Withdrawn*).
- **Do not use `Badge`** as a decorative rainbow for every category in a list —
  categories use `neutral` tags so real status colours keep their signal.

## Not this

- Showing a coloured dot with no text label — colour alone fails accessibility
  and forces users to memorise a legend.
- Using a bright solid fill on twenty badges down a table column — soft tints
  keep the list calm so the one primary action still leads.
- Giving a static status badge `cursor: pointer` when clicking it does nothing.
