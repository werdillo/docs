# Button and icon button

Triggers an action. Primary and destructive buttons always name verb and object
(*Place order*, *Cancel order* — [copy](../../process/copy.md)).

## Anatomy

- **Container** — pill-free rounded box (`--button-radius`) meeting the height
  token for its size.
- **Leading icon** *(optional)* — `16 px`, aligned optically with the label.
- **Label** — single line, `whitespace: nowrap`, medium weight (`500`).
- **Shortcut hint** *(optional, internal only)* — muted key glyph shown in the
  tooltip or menu item.

An **icon button** omits the label, stays square (`height === width`) and
carries a mandatory accessible label (`aria-label`) plus tooltip.

## Variants

| Prop | Values | Role |
|---|---|---|
| `variant` | `primary` · `secondary` · `ghost` · `danger` | `primary` is filled `--accent` (at most one per view); `secondary` is soft `--surface-hover` with no outline; `ghost` is transparent until hover; `danger` is solid `--danger` for irreversible confirmations and danger text on `--danger-soft` inside rows. |
| `size` | `sm` · `md` *(default)* · `lg` | Maps to `--button-height-sm / md / lg` (`28 / 32 / 36 px` internal; `36 / 44 / 48 px` public touch). |
| `busy` | `false` *(default)* · `true` | Locks click, preserves button width, shows inline spinner and present-participle label (*Placing order…*). |

## States

1. **Default** — resting fill and text per `variant`.
2. **Hover** — `--accent-hover` on primary; `--surface-hover` on ghost; subtle
   darkening/lightening step on secondary/danger (`--motion-fast`).
3. **Focus** — `:focus-visible` ring (`--focus-ring`), never suppressed.
4. **Pressed** — `--accent-active` on primary; subtle `scale(0.99)` or fill
   step while held.
5. **Disabled** — muted text (`--meta`), pointer blocked, `disabled` attribute;
   never used alone to hide why a form cannot submit
   ([states](../../process/states.md)).
6. **Busy / loading** — `aria-busy="true"`, non-interactive (prevents duplicate
   commits such as double *Place order*), fixed width so neighbours never shift.

## Tokens

| Tier | Tokens |
|---|---|
| Contract | `--accent`, `--accent-on`, `--accent-hover`, `--accent-active`, `--danger`, `--fg`, `--meta`, `--focus-ring`, `--motion-fast`, `--radius-md`, `--space-2`, `--space-3`, `--space-4` |
| Extensions | `--surface-hover`, `--danger-soft` |
| Component | `--button-height-sm`, `--button-height-md`, `--button-height-lg`, `--button-px-sm`, `--button-px-md`, `--button-px-lg`, `--button-radius`, `--button-primary-bg`, `--button-primary-fg`, `--button-secondary-bg`, `--button-secondary-fg`, `--button-danger-bg`, `--button-danger-fg` |

## Keyboard and accessibility

- Native `<button type="button">` (or `type="submit"` inside a form); never a
  clickable `<div>`.
- Activates on `Enter` and `Space`.
- Icon-only buttons require `aria-label` naming verb + object (*Close dialog*,
  *Remove line*).

## When to use and when not to

- **Use** for actions that change state, open a dialog, submit a form or run a
  process.
- **Do not use** for navigation to another URL — use a link (`<a>`) styled with
  button geometry when a link acts as a primary CTA on a public site.

## Not this

- Putting two `primary` accent buttons side by side in the same bar.
- Letting a button shrink or grow when switching from *Place order* to
  *Placing order…* — reserve the resting width.
- Rendering an outlined grey border around every secondary button — internal
  secondary buttons use soft fills (`--button-secondary-bg`) with no outline
  ([internal](../../languages/internal.md)).
