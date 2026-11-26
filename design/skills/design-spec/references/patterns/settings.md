# Settings

How workspace, account and system configuration is organised into scannable
label-and-control rows with predictable save behaviour and an isolated danger
zone.

## In one minute

- **Narrow column**: `640–720 px` maximum width (orienting signal) of grouped
  rows — label and one-line hint on the left, control on the right.
- **Independent toggles auto-save immediately** with optimistic feedback;
  **multi-field configuration saves explicitly** with dirty-state protection.
- **Never mix auto-save and manual save silently** inside one undifferentiated
  group.
- **Danger zone sits isolated at the bottom**, guarded by an explicit
  confirmation dialog stating the exact consequence.

## Anatomy and layout

```text
+------------------------------------------------------------------------+
| Settings                                                               |  <- Header bar
+------------------------------------------------------------------------+
|  (max width 640-720 px)                                                |
|  Storefront                                                            |  <- Multi-field group
|  +------------------------------------------------------------------+  |
|  | Shop name                                [ Small shop          ] |  |
|  | Shown in the header and emails.                                  |  |  <- 1-line --muted hint
|  |------------------------------------------------------------------|  |  <- --border-soft
|  | Bank transfer instructions               [ Sort code 00-00-00  ] |  |
|  | Shown to shoppers after placing an order.                        |  |
|  |------------------------------------------------------------------|  |
|  | Unsaved changes                     [ Reset ]  [ Save changes ]  |  |  <- Explicit save bar
|  +------------------------------------------------------------------+  |
|                                                                        |
|  Notifications                                                         |  <- Toggle group
|  +------------------------------------------------------------------+  |
|  | Order placed emails                                      (  o)   |  |  <- Auto-save switch
|  | Email the owner whenever a shopper places an order.              |  |
|  |------------------------------------------------------------------|  |
|  | Shopper confirmations                                    (  o)   |  |
|  | Email bank transfer details after placing an order.              |  |
|  +------------------------------------------------------------------+  |
|                                                                        |
|  Danger zone                                                           |  <- Isolated at bottom
|  +------------------------------------------------------------------+  |  <- Subtle --danger edge
|  | Pause storefront                             [ Pause storefront ]|  |
|  | Hides the public catalogue; existing orders stay open.           |  |
|  +------------------------------------------------------------------+  |
+------------------------------------------------------------------------+
```

- **Narrow column.** Constrain settings content to `640–720 px` max width
  (orienting signal) so the horizontal distance between a left-hand label and
  its right-hand control stays scannable. When configuration spans `4` or more
  distinct areas (orienting signal), add a compact left section list inside the
  settings area rather than stacking one endless page.
- **Grouped label-and-control rows.** Separate unrelated subjects by `32–40 px`
  vertical space and a short section heading (orienting signal). Inside a
  section, rows stack with `--border-soft` hairlines inside one clean container.
- **Left/right row split.** The left side holds the setting label (`--fg`,
  medium weight, `1–4` words) and at most `1` short hint line (`--muted`)
  explaining the effect. The right side holds the control (switch, select,
  compact text field or action button), right-aligned consistently down the
  group. Below `640 px` (orienting signal), the control drops cleanly beneath
  the label so text never crushes into narrow columns.

## Instant auto-save versus explicit save

Settings follow two clear persistence models — never an ambiguous middle ground:

- **Instant auto-save for independent toggles and single picks.** Switches,
  notification preferences, density modes and single dropdowns commit on change.
  The control updates optimistically ([internal language](../languages/internal.md#instant)),
  shows a quiet inline *Saved* state (or subtle toast when the effect is global),
  and rolls back with an inline error beside that row if the server refuses the
  write.
- **Explicit save for multi-field configuration.** Sections whose values take
  effect together or require typing (shop identity, bank transfer details,
  shipping rates, webhook URLs) reveal a footer bar (*Reset* + *Save changes*)
  once dirty and protect against accidental navigation away
  ([form](./form.md#dirty-and-unsaved-state-protection)).
- **Separate the two behaviours by section.** Keep instant toggles in their own
  group and manually saved inputs in theirs, so the user never wonders whether a
  toggle waits for a *Save* button at the bottom of the screen.

## Danger zone

- **Isolated at the bottom.** Irreversible or high-impact settings (pausing a
  storefront, revoking all API keys, deleting an account) sit in a dedicated
  *Danger zone* block at the end of the page or section, separated by a `--danger`
  hairline or `--danger-soft` tint — never adjacent to routine save buttons.
- **Guarded by explicit confirmation.** Clicking a danger-zone action always
  opens a narrow [confirmation dialog](./surfaces.md#dialog) stating the exact
  consequence in plain business words and naming both actions (*Keep storefront
  open* / *Pause storefront*).
- **Typed confirmation for high blast radius.** Actions that destroy a workspace,
  delete an account or break live integrations require typing the exact resource
  name (for example `Small shop`) before the destructive button enables.

## Required states

Every settings screen implements all relevant states from
[`process/states.md`](../process/states.md#the-nine-states):

- **Loading.** Past `300 ms` (orienting signal), draw skeleton rows matching the
  label/control split so controls never pop into place one by one.
- **Saving and rollback.** Auto-save toggles show no blocking spinner on fast
  writes; if a write fails, revert the control to its previous value and display
  a concise inline error directly below that row. Multi-field saves lock *Save
  changes* to *Saving…* preserving button width.
- **Validation error.** Inline `--danger` error sits under the invalid control
  without disturbing valid rows in the same group.
- **No access / read-only.** Settings a role never controls are omitted from
  navigation. Organisation-enforced settings visible for context appear
  read-only with a one-line muted note naming who controls them (*"Managed by
  the shop owner"*).

## Example: Small shop

Small shop's first version keeps configuration minimal; as Admin settings are
exposed to the Owner, they follow one `680 px` column:

1. **Storefront** (explicit *Save changes*): Shop name (*Small shop*), Public
   contact email, Bank transfer instructions printed on the `place-order`
   completion screen and emails.
2. **Notifications** (instant auto-save switches): *Email me when an order is
   placed*, *Email shoppers on order placement and cancellation*.
3. **Danger zone** (bottom block, `--danger` edge): *Pause storefront* — opens a
   confirmation dialog explaining *"Shoppers will see a closed notice; existing
   placed orders remain editable in Admin"* with *Keep open* and *Pause
   storefront*.

## Not this

- Stretching settings rows across a `1440 px` ultrawide monitor so the label sits
  on the far left edge and its switch floats `1000 px` away on the right — cap
  the column at `640–720 px`.
- Putting one *Save all settings* button at the bottom of a `2000 px` page of
  independent switches — switches save immediately on toggle.
- Placing *Delete shop* in the same button group next to *Save changes* —
  isolate destructive actions in the bottom danger zone behind confirmation.
- Writing three-paragraph explanations under every setting label — keep hints to
  `1` short line; if a setting needs an essay, simplify the option.
- Hiding whether a setting saved or failed — auto-saved rows confirm quietly and
  roll back visibly on failure.
