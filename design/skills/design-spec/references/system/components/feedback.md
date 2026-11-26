# Toast, inline banner, empty state and skeleton

Communicates system feedback, refusals, zero-data states and waits past
`300 ms` ([states](../../process/states.md)).

## Anatomy

- **Toast** — compact corner floating bar (`--surface`, `--elev-raised`,
  `--radius-md`), one short sentence (`Order archived`), optional *Undo* button
  and dismiss `×`. Auto-dismisses after `5–8 seconds` (pauses on hover/focus).
- **Inline banner** — full-width bar placed right beside the failed region or
  action (`--*-soft` fill, `1 px` matching border or leading status icon,
  three-part error copy, optional direct action such as *Try again* or *Remove
  unavailable items*).
- **Empty state** — centred narrow block (`max-width: 360–420 px`) with one
  quiet heading, one sentence of explanation and one primary action (*Add
  product* for first-time empty; *Clear filters* for filtered-empty).
- **Skeleton** — static or gently pulsing `--surface-hover` shapes matching the
  exact height, column widths or aspect ratio of the arriving content.

## Variants

| Component | Variants | Role |
|---|---|---|
| `Toast` | `neutral` · `success` · `warn` · `danger` | Quiet confirmation and reversible *Undo*; never the sole carrier of a persistent form error. |
| `Banner` | `info` · `warn` · `danger` | Persistent contextual notice or refusal that stays visible until resolved. |
| `EmptyState` | `first-time` · `filtered` | First-time invites creation; filtered invites resetting search/filters. |
| `Skeleton` | `row` · `card` · `record` | Shown only when a wait exceeds `300 ms`, preserving exact final geometry (`CLS = 0`). |

## States

1. **Default** — visible with clear contrast (`≥4.5:1`) in both light and dark
   modes.
2. **Hover / focus** — hovering or focusing a toast pauses its auto-dismiss
   timer so a user never misses *Undo*.
3. **Entering / leaving** — `120–200 ms` (`--motion-fast` / `--motion-base`),
   `opacity` and `translateY` only.
4. **Reduced motion** — skeleton pulse stops (static tinted block); toasts
   crossfade with no slide.
5. **Action pending** — clicking *Undo* or *Try again* shows immediate feedback
   and prevents duplicate clicks.
6. **Dismissed** — removes cleanly without shifting content underneath (toasts
   sit in a fixed corner viewport layer).

## Tokens

| Tier | Tokens |
|---|---|
| Contract | `--surface`, `--fg`, `--fg-2`, `--muted`, `--border`, `--accent`, `--success`, `--warn`, `--danger`, `--elev-raised`, `--radius-md`, `--radius-lg`, `--space-3`, `--space-4`, `--motion-fast`, `--motion-base` |
| Extensions | `--surface-hover`, `--success-soft`, `--warn-soft`, `--danger-soft` |
| Component | `--row-height`, `--tile-radius` (reused by skeletons so dimensions always match) |

## Keyboard and accessibility

- Non-urgent toasts use `role="status"` (`aria-live="polite"`); urgent refusals
  and error banners use `role="alert"` (`aria-live="assertive"`).
- Skeleton containers set `aria-busy="true"` on the loading region and
  `aria-hidden="true"` on individual placeholder bars.

## When to use and when not to

- **Use `Toast`** for brief confirmations and *Undo* on reversible writes.
- **Use `Banner`** when the user needs to read the refusal while fixing fields
  or lines on the screen.
- **Do not show `Skeleton`** for waits under `300 ms`.

## Not this

- Showing a form validation error only in a corner toast that vanishes after 5
  seconds.
- Displaying a full-screen spinner that wipes out the header bar and filter
  context on every sort or search keystroke.
- Drawing a generic skeleton whose row height differs from `--row-height`,
  causing a visible jump when real rows arrive.
