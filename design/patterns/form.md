# Form

How structured creation and multi-field editing are laid out, validated and
submitted without punishing typing or losing unsaved work.

## In one minute

- **Single column by default**: `520–600 px` maximum width (orienting signal),
  top-aligned labels, grouped by subject with proximity spacing.
- **Validate on blur and submit, never on first keystroke**: clear each field's
  error immediately once the user corrects it.
- **Errors sit right under the control**, backed by a top error summary on
  submit failure; never disable the submit button to hide validation errors.
- **Verb + object primary button** paired with plain *Cancel*; protect dirty
  forms before discarding work.
- **Pick the right container**: `1` field edits in place, `1–5` fields sit in a
  dialog, `6+` fields or rich media earn a dedicated `form` page.

## Anatomy and layout

```text
+------------------------------------------------------------------------+
| Products / Add product                                                 |  <- Breadcrumb header
+------------------------------------------------------------------------+
|  (max width 520-600 px)                                                |
|  Details                                                               |  <- Subject group
|                                                                        |
|  Name                                                                  |  <- Top-aligned label
|  [ Speckled stoneware mug                                            ] |  <- --surface + --border
|                                                                        |
|  Description  (Optional)                                               |  <- Mark minority only
|  [ Wheel-thrown stoneware glazed in matte oat.                       ] |
|  [                                                                   ] |
|  Shown on the product page below the buy-box.                          |  <- 1-line --muted hint
|                                                                        |
|  --------------------------------------------------------------------  |  <- 32-40 px group break
|  Pricing                                                               |
|                                                                        |
|  Price (£)                                                             |
|  [ 24.00                  ]                                            |
|  Existing placed orders keep the price they were placed at.            |
|                                                                        |
|  --------------------------------------------------------------------  |
|  Unsaved changes                        [ Cancel ]   [ Add product ]   |  <- Footer actions
+------------------------------------------------------------------------+
```

- **Single-column default.** Constrain the form container to `520–600 px` max
  width (orienting signal) so eye travel stays strictly vertical and completion
  stays predictable. Two fields share one horizontal row only when they form a
  single natural pair (such as *Currency* + *Price*, or *First name* + *Last
  name*).
- **Top-aligned labels.** Place every label directly above its control (`4–8 px`
  gap — orienting signal) in sentence case (`1–3` words). Never use placeholder
  text as the sole label; placeholders vanish on focus and break verification.
  Mark the minority (*Optional*) rather than placing red asterisks on every
  required field.
- **Proximity spacing between groups.** Keep `16–20 px` between fields inside a
  group and `32–40 px` between subject groups (orienting signals), separated by
  a short section heading or a `--border-soft` hairline instead of nested cards.
- **One hint line maximum.** A field hint sits in `--muted` directly under the
  control and fits on `1` line ([copy](../process/copy.md#empty-states-hints-and-confirmation)).
- **Explicit footer actions.** Place one verb+object primary button (`--accent`,
  such as *Add product* or *Save changes*) beside a plain *Cancel* button.
  Never label a form button *Submit* or *OK*
  ([copy](../process/copy.md#actions-and-buttons)).

## Validation and error handling

- **Validate on blur and on submit — never while first typing.** Showing red
  errors on keystroke one interrupts thought before the user finishes an entry.
  Once a field has entered an error state, validate on input so the error clears
  the instant the value becomes valid.
- **Field-level error directly under the control.** Mark the control with
  `--danger` border, `aria-invalid="true"`, and `1` plain sentence right below
  it explaining how to fix the entry (*"Enter a price above £0.00"*), bound via
  `aria-describedby`.
- **Error summary on submit failure.** When submit fails with `1` or more
  invalid fields — or a server business-rule refusal — show a persistent
  [inline banner](./surfaces.md#toast-and-inline-banner) at the top of the form
  listing each problem with links to the affected fields, and move keyboard
  focus to the first invalid control (or to the summary when errors sit out of
  view).
- **Keep the primary button clickable while invalid.** Never disable *Save* or
  *Add product* to prevent submission when a required field is empty — a
  disabled button hides why nothing works. Disable the trigger only while the
  submit request is in flight (`aria-busy="true"`, pending label such as
  *Saving…*, preserving button width).

## Dirty and unsaved state protection

- **Show dirty state visibly.** Once any field diverges from its loaded value,
  display a quiet *Unsaved changes* indicator near the footer actions
  ([states](../process/states.md#the-nine-states)).
- **Guard against accidental loss.** Navigating away via an in-app link, *Cancel*
  or browser close while dirty raises a narrow
  [confirmation dialog](./surfaces.md#dialog) (*"Discard unsaved changes?"* with
  *Keep editing* and *Discard changes*). Clean forms navigate away immediately
  with no prompt.
- **Preserve values on failure.** A failed network call or server validation
  refusal never clears the user's entered text.

## Form page versus dialog versus in-place edit

Choose the lightest surface that fits the fields (numbers are orienting
signals):

| Container | When to use it | Example |
|---|---|---|
| **In-place edit** | `1` field on an existing `record` with instant save and no cross-field rules. | Changing a note or toggling status on a record. |
| **Dialog** ([surfaces](./surfaces.md#dialog)) | `1–5` fields, no rich media or deep branching, where keeping the parent list visible helps. | *Restock product* (`shop/stock` — quantity + optional batch note). |
| **Dedicated `form` page** | `6+` fields, grouped sections, media uploads, rich text, or a workflow needing its own URL. | *Add product* / *Edit product* (`shop/products`). |

## Required states

Every form implements all relevant states from
[`process/states.md`](../process/states.md#the-nine-states):

- **Loading (edit mode).** Past `300 ms` (orienting signal), draw a skeleton
  matching the field groups and heights; never render empty inputs that could be
  typed into before existing values arrive.
- **Validation and refusal errors.** Field errors sit under each control;
  business-rule refusals from the server (such as setting stock below `0`, R1)
  map to the exact offending input or top summary in plain business words.
- **Pending submit.** Primary button locks immediately on click with present
  participle text (*Adding product…*, *Restocking…*) and identical width so
  double-clicks never fire duplicate writes.
- **Dirty / unsaved.** Visible status + leave confirmation until saved or
  explicitly discarded.
- **Stale / conflict.** If another tab edited the record before submit, show an
  inline banner naming the conflict and let the user review or reload without
  destroying their draft text.

## Example: Small shop

- **Admin — `shop/products` add or edit (`form` page, S6).** `560 px` max-width
  single column with two groups: *Details* (Name, Description, Photos) and
  *Pricing* (Price in `£`, hint: *"Placed orders keep the price they were placed
  at"* per R2). Primary button reads *Add product* on creation (starting the
  product `on sale` with `0` stock until restocked) and *Save changes* on edit.
  Withdrawing a product is not a checkbox on this form; it is an explicit
  destructive action on the product record or bottom danger section (S8).
- **Admin — `shop/stock` restock (dialog or compact `form`, S7).** Displays the
  product name and current stock (`0`), a numeric field *Quantity added*
  (validated so stock never drops below `0` per R1), an optional one-line batch
  note (*"Kiln batch #12"*), and buttons *Cancel* and *Restock product*.
  Withdrawn products cannot open this form (S7).

## Not this

- Multi-column masonry forms where fields zig-zag left and right — eye movement
  slows down and fields get skipped; stay single-column.
- Turning inputs red on the very first character typed before the user finishes
  entering an email or price — validate on blur and submit.
- Disabling the *Save changes* button with zero explanation because one field
  above the fold is missing — allow submit and focus the first invalid field.
- Using placeholder text like *"Enter price"* with no visible label — once a
  value is typed, nobody can tell what the box holds.
- Opening a full-page form with a new URL just to change one quantity or add a
  two-word tag — use a dialog or edit in place.
