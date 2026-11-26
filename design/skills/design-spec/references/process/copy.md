# Words on screens

How interface copy — labels, buttons, empty states, headings and error messages
— is written so a person always knows what a control does and what happened.
Interface text is part of the design, never placeholder filler added at the end.

## In one minute

- **Use the product document's words verbatim** — if section 7 calls it
  *withdrawn*, no screen calls it *archived* or *deleted*.
- **Buttons name the verb and its object** — *Place order*, *Cancel order*,
  *Restock product* — never *Submit*, *OK* or *Yes*.
- **Errors have three parts**: what failed, why, and what to do next.
- **Short, plain, scannable** — labels are 1–3 words; explanation lives on
  demand in hints, empty states and tooltips.
- **Consistent sentence case** across every heading, tab, menu item and button.

## Business words are law

Section 7 of the product document (`02-behaviour.md`) defines every word the
business uses and what it does **not** mean. Every screen, button, filter tab
and error message uses that exact word. A synonym on a screen creates a second
concept in the user's head: if `02-behaviour.md` distinguishes a *placed* order
from a *paid* order, no confirmation banner says *"Payment complete"* when the
order was only placed.

## Actions and buttons

- **Verb + object on primary and destructive actions.** *"Delete product"*,
  *"Confirm payment"*, *"Return stock"*. A person reading only the button knows
  the consequence without reading the paragraph above it.
- **Confirmation dialogs echo the exact action.** If the dialog asks *"Cancel
  order #1042?"*, the two buttons are *Keep order* and *Cancel order* — never
  *No* and *Yes*, never *Cancel* next to *Cancel*.
- **Present participle while in flight.** *Place order* → *Placing order…*;
  *Save changes* → *Saving…*.

## Three-part error messages

Every refusal or validation error answers three questions in at most two short
sentences:

1. **What failed** — *"Order could not be placed."*
2. **Why** — *"Stoneware mug has 0 left in stock."*
3. **What to do next** — *"Remove it from your cart to continue."*

For inline field validation, the first part is already visible from the field
itself, so one short line suffices: *"Enter a price above £0.00"*, *"Name is
required"*. Never blame the user (*"Invalid input"*, *"You forgot…"*), and
never leak internal error codes or stack traces.

## Empty states, hints and confirmation

- **Empty states state what belongs here and give one action.** *"No products
  on sale yet. Add your first piece to open the catalogue."* + *Add product*.
- **Sentence case everywhere.** *"Stock levels"*, *"Place order"*, *"Order
  history"* — not Title Case, not ALL CAPS (except small uppercase category
  tags when the theme specifies them).
- **One hint line maximum.** A field hint fits on one line under the control;
  if a control needs a paragraph of explanation, the control or the flow is too
  complex.

## Numbers, money and dates

- **Format for the reader's locale**, using explicit currency symbols or ISO
  codes (`£24.00`, `$18.50`), and keep decimal precision uniform down a column.
- **Relative dates for recent activity, exact dates for records.** *"5 min ago"*
  with an exact timestamp tooltip in an activity feed; `15 Nov 2026` in an
  order table or invoice.
- **Exact counts, never vague plurals.** *"0 items"*, *"1 order"*, *"14
  products"* — handle singular and plural cleanly (including Slavic multi-form
  plurals when localised via `Intl.PluralRules`).
- **Allow `20–35%` expansion for localised labels.** Short Russian or European
  action labels run longer than English; keep button text to `1–3` words and
  never rely on fixed-width English buttons or tabs
  ([typography](../foundations/typography.md#text-expansion-and-overflow-localisation)).

## Not this

- *OK / Cancel* on a destructive dialog — name both outcomes (*Keep order* /
  *Cancel order*).
- *"Are you sure?"* with no consequence stated — say what happens (*"Cancelling
  returns 3 items to stock and emails the shopper."*).
- *"Error 409: CONFLICT_STOCK_UNDERFLOW"* shown to a shopper — translate every
  server refusal code into plain business words.
- *"Oops! Something went sideways :("* — cute apologies waste words and hide
  what to do next.
- *Lorem ipsum* in any design specification or prototype — realistic business
  text exposes wrapping, truncation and hierarchy flaws immediately.
