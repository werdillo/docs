# Dialog, confirmation dialog, drawer and popover

Floating surfaces that sit above the current screen without losing the user's
place ([surfaces](../../patterns/surfaces.md)).

## Anatomy

- **Backdrop** *(dialog and drawer only)* — translucent `--overlay` dimming
  the page beneath.
- **Surface** — `--dialog-bg` (or translucent blurred material on menus and
  popovers where supported, solid fallback otherwise), `--dialog-radius`, and
  `--dialog-shadow` (the only place real drop shadows appear).
- **Header** — concise title (sentence case) + `×` close icon button.
- **Body** — label-and-control rows directly on the surface (no nested cards),
  or concise consequence copy in a confirmation dialog.
- **Footer** — right-aligned actions: secondary *Cancel* / keep-action on the
  left, primary or `danger` verb+object button on the right.

## Variants

| Component | Width / placement | Role |
|---|---|---|
| `Dialog` | Max `--dialog-max-w` (`560 px`), positioned in the upper third of the viewport | Short creation or edit task (under ~5 fields) without leaving the current list. |
| `ConfirmDialog` | Narrow `--dialog-confirm-w` (`400 px`), upper third | **Irreversible** acts only (*Cancel order*, *Withdraw product*, *Delete account*); states exact consequence and echoes the action in the button. |
| `Drawer` | `400–520 px` side sheet (full-width below `768 px`) | Secondary inspection or filter panel while keeping the list visible behind. |
| `Popover` | Anchored to trigger (`200–320 px`) | Action menus, pickers, filter dropdowns; filters as you type in internal apps. |

## States

1. **Closed** — unmounted or hidden (`inert`) from tab order and screen
   readers.
2. **Entering / leaving** — `180–220 ms` (`--motion-base`, `--ease-standard`)
   via `opacity` and subtle `translateY`/`scale` (`transform` only); instant
   under `prefers-reduced-motion`.
3. **Open / focused** — focus moves to the first interactive field (or safe
   button in a confirmation dialog); tab stays trapped inside modal overlays.
4. **Busy** — footer action enters `busy` state (`aria-busy="true"`); backdrop
   click and `Esc` lock while an irreversible commit is in flight.
5. **Dirty** — closing a dialog with unsaved edits asks before discarding.
6. **Error** — inline refusal banner appears inside the dialog body above the
   footer so the user can fix and retry without losing entered values.

## Tokens

| Tier | Tokens |
|---|---|
| Contract | `--surface`, `--fg`, `--fg-2`, `--muted`, `--border`, `--elev-raised`, `--focus-ring`, `--radius-lg`, `--space-4`, `--space-6`, `--motion-base`, `--ease-standard` |
| Extensions | `--overlay` |
| Component | `--dialog-bg`, `--dialog-radius`, `--dialog-shadow`, `--dialog-max-w`, `--dialog-confirm-w` |

## Keyboard and accessibility

- `role="dialog"` with `aria-modal="true"`, `aria-labelledby` pointing to the
  header title, and `aria-describedby` pointing to the consequence text in a
  confirmation dialog.
- `Tab` / `Shift+Tab` wraps inside modal dialogs and drawers; `Esc` dismisses
  and returns focus to the exact trigger element that opened it.

## When to use and when not to

- **Use `ConfirmDialog`** only when the act cannot be undone. For reversible
  actions, apply immediately and show a toast with *Undo*
  ([feedback](./feedback.md)).
- **Do not use `Dialog`** for complex multi-group forms (`6+` fields) or
  multi-step processes — use [`form`](../../patterns/form.md) or
  [`flow`](../../patterns/flow.md).

## Not this

- Centring a small dialog dead in the vertical middle where the keyboard on
  mobile or long content pushes actions off-screen.
- Asking *"Are you sure?"* with *OK / Cancel* buttons instead of naming both
  outcomes (*Keep order* / *Cancel order*).
- Putting boxes and cards inside a dialog body.
