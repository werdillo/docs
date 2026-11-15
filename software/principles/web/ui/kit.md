# The UI kit

## The kit is the only place that draws

The `components` layer is the UI kit: presentational parts with no knowledge of
any subject, built on an accessible primitive library. Everything above it —
features and domains — renders through it.

- **No raw controls or styled tags in a screen.** A button, an input, a select,
  a table, a heading or a paragraph of text in `ui/` is a kit component, never
  the HTML element with classes on it. A screen keeps only **layout** classes —
  flex, grid, gap, a span, a min-width — and even those shrink as the kit grows
  layout parts (below).
- **Text is one component with a small fixed scale** — about nine variants:
  six headings and three body sizes. Any text on any screen is one of them; a
  tenth size is a question for the kit, not a class on a screen. Its colour is
  **inherited** unless one is named, so text inside a muted block, a button or a
  tooltip takes its parent's colour without a fight, and a named colour is a
  semantic token — muted, primary, destructive, warning, success — never a
  palette colour.
- **A state is a variant, chosen from data.** A status badge, a tone, a size is
  a prop the kit defines; a screen maps its data to it (`status → variant`) in
  a small table, never to a class string. The map is then the one place that
  says what a "cancelled" looks like.
- **A variant never needs overriding.** Utilities that would conflict live in
  the variants, not in the base, so a caller picks a variant instead of
  fighting the default; an `!important` in a screen, or a class that undoes the
  kit's, means the kit is missing a variant.
- **Global stylesheets belong to the composition root.** Design tokens (light
  and dark, [named by OpenDesign](../../../../design/system/tokens.md)) and shared keyframes are loaded
  once by the app's root; the kit's class helpers live with the kit; `core`
  stays logic only.
- **The primitive's semantics survive the kit.** Role, keyboard behaviour and
  focus order reach the screen intact; a screen that overrides them is a
  missing kit part, not a screen decision
  ([accessible by construction](./accessibility.md)).

This is *guarded*: a test walks every screen file and fails on a raw control or
table, a text size on an HTML tag, an `!important` utility, a hand-typed
page width, or a call into the kit's raw class builders. Its exceptions are an
explicit list — a path, a rule and the reason — and an exception that stops
matching fails the test too, so the list cannot rot.

## The kit grows from repetition

The kit is not designed up front; it is **harvested**. When the same markup
appears in **three or more** places, it becomes a kit variant or a kit
component, and the places are moved onto it in the same change.

- **First look for a missing variant**, then for a missing part, and only then
  for a new component. A new size on a button beats a new kind of button.
- **Harvest in two passes.** The kit change first, on its own, so every screen
  can use it; then the screens, area by area. A screen pass that meets a gap
  does not invent a local component — it lists the gap, and the gap goes into
  the kit.
- **A kit component knows no subject.** It takes values and renders them; what
  a "return" or a "booking" is stays in the domain. A component that needs a
  subject's types to work belongs in `features` or in the box.
- **A component is filed by what it is**, not where it is used: an overlay is
  feedback even when it hosts a form; a control that decides about its value
  (money, a slug, a period) is apart from one that only takes it.

What the kit holds, at the least, once a product has a few screens:

| Need | Kit part |
|---|---|
| Any text | the text component and its scale |
| A screen's column | a page frame with a few named widths — narrow, form, list, wide |
| A labelled input | a field whose root stacks label, control, hint and error itself |
| Fields side by side | a field grid with a column count |
| The buttons under a form or in a dialog | a form-actions row; a dialog footer |
| Rows in a bordered list | a list with items and an empty line |
| A card's body | a card with a body that can stack its children |
| One choice of a few | a segmented control; for big options with a hint, choice cards |
| A filter that toggles | a filter chip |
| A full-width clickable row | a row button |
| An icon with no text | an icon button that takes the icon and requires a label |
| A status | a badge with solid and soft tones |
| A notice in a form | a callout with tones and an actions slot |
| Data in columns | a table with numeric and muted cells |

## Layout is the kit's too

Spacing is where screens drift first: each one picks its own gap, its own width,
its own button row. So the repeated layout is a kit part like any other.

- **A field lays out its own label, control and hint.** No screen wraps a field
  to stack it; one spacing holds for every field.
- **A width is never typed by hand.** A screen's column is a page width by name;
  a dialog's is a dialog size. Small caps on a single input are the exception.
- **Rows of fields, rows of buttons, bordered lists and stacked card bodies**
  are kit parts with a few named options (columns, alignment, density, gap) —
  not a grid or flex written out again.
- **A general flex primitive is optional.** Laying out a few children in a row
  or a column is readable as it is; a stack component pays for itself only when
  a project wants one spacing scale everywhere.
