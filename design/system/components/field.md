# Field, input, textarea and select

Captures typed or chosen values with top-aligned labels, one-line hints and
inline validation errors ([form](../../patterns/form.md)).

## Anatomy

- **Field wrapper** — vertical stack (`--space-1` gap inside; `--space-4`
  between fields, obeying proximity in [spacing](../../foundations/spacing.md)).
- **Label** — linked via `for`/`id`, medium weight (`500`), sentence case.
- **Control** — `<input>`, `<textarea>`, or filterable `<select>` / combobox
  (`--input-bg`, hairline `--input-border`, `--input-radius`).
- **Prefix / suffix slot** *(optional)* — currency glyph (`£`), unit (`kg`), or
  clear button.
- **Hint or error line** — single line below the control (`--muted` for hint,
  `--danger` with small icon for error; `aria-describedby` bound to the
  control).

## Variants

| Component | Variants | Role |
|---|---|---|
| `Input` | `text` · `number` · `money` · `search` · `email` · `password` | Single-line entry; `number` and `money` set `tabular-nums` and appropriate `inputMode`. |
| `Textarea` | `rows` (`3–6` default) | Multi-line text; grows vertically or scrolls, never resizes horizontally. |
| `Select` | `single` · `multi` | Filter-as-you-type list in a floating popover; every option keyboard-navigable via `↑`/`↓` and `Enter`. |

## States

1. **Default** — `--input-bg` with `1 px` `--input-border`.
2. **Hover** — border steps slightly darker/brighter toward `--fg-2`.
3. **Focus** — accent focus ring (`--focus-ring`) and `--accent` border.
4. **Pressed / open** — select popover opens cleanly (`--motion-fast`,
   `--elev-raised`).
5. **Disabled / read-only** — muted `--panel` background and `--meta` text;
   read-only keeps copyable text when a user needs to copy an ID or code.
6. **Error** — `--danger` border, `aria-invalid="true"`, and specific message
   below the control (*"Enter a price above £0.00"*). Validated on blur and
   submit — never flashing red after the first keystroke.

## Tokens

| Tier | Tokens |
|---|---|
| Contract | `--surface`, `--fg`, `--fg-2`, `--muted`, `--meta`, `--border`, `--accent`, `--danger`, `--focus-ring`, `--radius-sm`, `--space-1`, `--space-3`, `--space-4`, `--motion-fast` |
| Extensions | `--panel`, `--surface-hover`, `--surface-selected` |
| Component | `--input-height`, `--input-px`, `--input-bg`, `--input-border`, `--input-radius` |

## Keyboard and accessibility

- Every control has a visible `<label>` (never placeholder-only).
- Error text connects via `aria-describedby` and `aria-invalid="true"`; on
  failed submit, focus moves to the first invalid control.
- Select and combobox support `↑`/`↓`, `Home`/`End`, typing to filter, `Enter`
  to select and `Esc` to close without losing prior value.

## When to use and when not to

- **Use `Input`** for short structured values, **`Textarea`** for free-form
  descriptions, **`Select`** for 5 or more mutually exclusive options.
- **Do not use `Select`** for 2–4 always-visible options — use a segmented
  track or radio group ([choice](./choice.md)).

## Not this

- Using `placeholder` text as the field's label — once the user types, the
  label disappears.
- Showing a red error while the user is still typing the first character of an
  email or price.
- Rendering a dropdown that cannot be filtered by typing in an internal app
  ([internal](../../languages/internal.md)).
