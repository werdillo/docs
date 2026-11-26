# Segmented track, tabs, switch, checkbox and radio

Chooses between a small set of known options or toggles a binary state.

## Anatomy

- **Segmented track / Tabs** — sunken grey track (`--track-bg`, `--track-radius`)
  containing `2–5` equal-height options; the active option sits on a raised
  thumb (`--track-thumb-bg`, `1 px` `--border-soft` hairline, light shadow).
- **Switch** — pill track (`--radius-pill`) with a round `--surface` thumb,
  filled in `--accent` when on and `--border` when off.
- **Checkbox / Radio** — `16 × 16 px` visual box (`--radius-sm` or
  `--radius-pill`) inside a `32 px` (internal) or `44 px` (public touch) hit
  area, paired with a clickable `<label>`.

## Variants

| Component | Variants | Role |
|---|---|---|
| `Segmented` | `sm` · `md` | Switches view mode (*List / Board*) or short exclusive choice (`2–4` items). |
| `Tabs` | `track` · `underline` | Switches sub-views of the same record or settings group (`2–5` tabs). |
| `Switch` | `default` | Immediate binary setting (auto-saves in [settings](../../patterns/settings.md)). |
| `Checkbox` | `unchecked` · `checked` · `indeterminate` | Multi-select in forms or bulk row selection in [list](../../patterns/list.md). |
| `Radio` | `vertical` · `inline` | Mutually exclusive form choice (`2–5` options) committed on form submit. |

## States

1. **Default** — resting track and indicator.
2. **Hover** — subtle surface or border step (`--motion-fast`).
3. **Focus** — visible `:focus-visible` ring (`--focus-ring`) around the
   interactive control.
4. **Pressed** — thumb slides smoothly via `transform` (`--motion-fast`,
   `--ease-standard`).
5. **Disabled** — `--meta` text and muted track; non-interactive.
6. **Error** — `--danger` border on checkbox/radio group with inline error
   below the group when a required choice is missing.

## Tokens

| Tier | Tokens |
|---|---|
| Contract | `--surface`, `--fg`, `--muted`, `--meta`, `--border`, `--border-soft`, `--accent`, `--accent-on`, `--danger`, `--focus-ring`, `--radius-sm`, `--radius-md`, `--radius-pill`, `--motion-fast`, `--ease-standard` |
| Extensions | `--surface-hover` |
| Component | `--track-bg`, `--track-thumb-bg`, `--track-radius`, `--button-height-sm`, `--button-height-md` |

## Keyboard and accessibility

- Native `<input type="checkbox">` / `<input type="radio">` or ARIA
  `role="switch"` (`aria-checked`), `role="tablist"` / `role="tab"`
  (`aria-selected`).
- `Space` toggles switches and checkboxes; `←`/`→` moves across tabs,
  segmented tracks and radio groups.
- Checking or toggling a `Switch` applies immediately; a `Checkbox` inside a
  form waits for form submit.

## When to use and when not to

- **Use `Switch`** only when the change takes effect at once (for example
  enabling notifications in settings).
- **Use `Checkbox`** inside forms that end with a *Save* button, and for
  selecting rows in a list.
- **Do not use `Tabs`** when there are more than `5` sections — switch to a
  sidebar list.

## Not this

- Putting a `Switch` inside a form that still requires clicking *Save* — users
  expect a switch to act immediately.
- Making only the `16 px` square clickable instead of the whole label row.
- Animating tab underlines with `left`/`width` instead of `transform`.
