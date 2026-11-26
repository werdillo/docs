# Accessibility

Concrete, testable design rules that keep every screen usable with a keyboard,
screen reader, magnifier, high zoom or right-to-left script. How the front-end
kit enforces these behaviours in code lives in
[`software/principles/web/ui/accessibility.md`](../../software/principles/web/ui/accessibility.md).

## In one minute

- **100% keyboard reachability**: every interactive action works by keyboard in
  visual reading order, with zero positive `tabindex` values (hard test limit).
- **Visible focus ring**: `:focus-visible` draws a `≥ 2 px` ring via
  `--focus-ring` at `≥ 3:1` contrast — never removed without an equal
  replacement (hard test limit).
- **Modal discipline**: dialogs trap focus inside, close on `Esc` and return
  focus to their trigger (hard test limit).
- **Semantic landmarks and one `h1`**: `<header>`, `<nav>`, `<main>`, `<footer>`
  and strictly nested headings `h1 → h2 → h3` (hard test limit).
- **Text alternatives and non-colour cues**: every icon button and meaningful
  image has a name; status and errors never rely on colour alone (hard test
  limit).
- **200% zoom and RTL readiness**: zero horizontal scroll or clipped text at
  `200%` zoom, and logical layout properties throughout (hard test limit).

## Keyboard reachability and logical Tab order

- **Every pointer action has a keyboard path** (hard test limit). Buttons,
  links, menus, filter chips, row actions, tooltips carrying information and
  drag-and-drop reorders all work using `Tab`, `Shift+Tab`, `Enter`, `Space`,
  arrow keys and `Esc`
  ([keyboard is the second pointer](../../software/principles/web/ui/accessibility.md#keyboard-is-the-second-pointer)).
- **Tab order matches visual reading order.** Focus flows top-to-bottom and
  `inline-start` to `inline-end` without jumping erratically across columns.
- **Never set a positive `tabindex` (`tabindex > 0`)** (hard test limit). Fix
  DOM order instead of overriding Tab sequence; use `tabindex="0"` to enter the
  natural flow and `tabindex="-1"` only for programmatic focus targets (such as
  a modal container or error summary).
- **Provide a *Skip to main content* link** on pages with persistent top or side
  navigation, visible on `:focus-visible` as the first Tab stop.

## Visible focus ring

- **Draw focus with `:focus-visible` and `--focus-ring`** (hard test limit;
  [tokens](../system/tokens.md#tier-1-opendesign-contract-names)). Keyboard navigation shows a crisp
  ring without leaving distracting outlines after casual mouse clicks.
- **Minimum ring geometry: `≥ 2 px` thickness and `≥ 3:1` contrast** against the
  adjacent background (hard test limit). Where a filled `--accent` button meets
  a matching `--focus-ring`, add a `2 px` offset (`outline-offset: 2px`) so the
  ring separates clearly from the button edge.
- **Never write `outline: none` without a tokenised focus replacement** (hard
  test limit). A focus state that changes only subtle background grey fails
  keyboard scanning across dense screens
  ([focus is visible and managed](../../software/principles/web/ui/accessibility.md#focus-is-visible-and-managed)).

## Modal focus trap, Escape and return focus

Every modal dialog, confirmation box and blocking drawer obeys four rules (hard
test limits):

1. **Initial focus moves inside on open** — to the first interactive control, or
   to the dialog title/container (`tabindex="-1"`) when the dialog starts with a
   long confirmation warning so the user does not accidentally trigger a
   destructive button with `Enter`.
2. **Focus stays trapped inside** — `Tab` from the last control wraps to the
   first; `Shift+Tab` from the first wraps to the last; background content is
   marked `inert`.
3. **`Esc` closes the overlay** without saving destructive changes.
4. **Closing returns focus to the trigger** — the exact button that opened the
   dialog. If the dialog deleted that trigger (for example deleting an order
   row), focus moves cleanly to the next row or the list heading rather than
   falling back to `<body>`.

## Semantic landmarks and single `h1`

- **Every screen declares structural landmarks**: `<header>`, `<nav>` (labelled
  when more than one exists, e.g. *Main* vs *Breadcrumb*), one `<main>`, and
  `<footer>` where applicable. Screen-reader users jump between regions by
  landmark before reading line by line.
- **Exactly `1` `<h1>` per screen** (hard test limit), naming the screen's
  subject (*Orders*, *Stoneware Mug*, *Checkout*).
- **Headings nest without skipping levels** (`h1 → h2 → h3`, hard test limit).
  Size and weight come from type tokens (`--text-*`), never from choosing an
  `<h4>` because it happens to look smaller.

## Text alternatives

- **Every icon-only control carries an accessible name** (hard test limit) —
  describing its action, never the icon's picture (*"Remove Stoneware Mug from
  cart"*, not *"Trash icon"*). Browser tests locate controls by role and name
  ([tests find what a person can name](../../software/principles/web/ui/accessibility.md#tests-find-what-a-person-can-name)).
- **Every meaningful image has concise `alt` text** stating the fact the image
  conveys (*"Speckled cream stoneware mug, 320 ml"*).
- **Purely decorative icons and images stay silent**: `aria-hidden="true"` on
  decorative SVG icons sitting next to visible text labels, and empty `alt=""`
  on decorative photos so screen readers do not repeat the label twice.

## Non-colour cues for status and errors

- **Never rely on colour alone for status, validation or data series** (hard
  test limit, [colour](./colour.md#semantic-colour-roles)). Pair `--danger`
  error borders with an error icon and specific guidance text; pair `--success`
  and `--warn` badges with clear words.
- **Bind every field error programmatically to its input** (`aria-describedby`,
  `aria-invalid="true"`) and place the visible message directly beneath the
  field in words that state how to fix it (*"Enter a UK postcode such as
  SW1A 1AA"*, not *"Invalid input"*).
- **Announce async status through live regions only when needed**
  (`role="status"` polite for cart updates or saved drafts; `role="alert"` for
  blocking submission errors) — static helper text is never a live region
  ([errors are announced and attached](../../software/principles/web/ui/accessibility.md#errors-are-announced-and-attached)).

## 200% zoom and reflow

- **Zero horizontal overflow and zero clipped text at `200%` browser zoom** on a
  `1280 px` desktop viewport, and at `320–360 px` narrow mobile width (hard test
  limit).
- **Size type and containers in relative units (`rem`, `ch`, `%`)** rather than
  locking fixed pixel heights onto text boxes. A button or table header with a
  hard `height: 32px; overflow: hidden` clips words when a user raises their
  base font size; prefer `min-height` and wrapping-safe layouts.
- **Sticky headers and floating toolbars keep height modest** (at most `20%` of
  viewport height at `200%` zoom, orienting signal) so zoomed content remains
  readable between them.

## RTL and direction awareness

- **Set `lang` and `dir` on the root `<html>` element** (`lang="en"`,
  `dir="ltr"` or `dir="rtl"`), and mark mixed-direction strings explicitly
  ([language and direction](../../software/principles/web/ui/accessibility.md#language-and-direction)).
- **Use CSS logical properties everywhere** (`margin-inline-start`,
  `padding-inline`, `inset-inline-end`, `border-inline-start`,
  `text-align: start`) instead of physical `left` and `right` so layouts mirror
  automatically when `dir="rtl"` is active.
- **Mirror directional icons only.** Back/forward arrows, chevrons, breadcrumb
  separators and sidebar collapse icons flip in RTL; non-directional symbols
  (checkmarks, clocks, search magnifying glasses, currency marks, media play)
  stay unmirrored.

## Example: Small shop

- **Shop site (checkout & product card):** The page opens with a *Skip to main
  content* link, `<header>` with primary `<nav aria-label="Main">` and a single
  `<main>` holding one `<h1>` (*Checkout*). Submitting an empty email moves
  focus to the email field (`aria-invalid="true"`), displays *"Enter an email
  address for your receipt"* bound via `aria-describedby`, and renders an error
  icon beside `--danger` ink. At `200%` zoom, the two-column summary stacks into
  a single column with `0 px` horizontal overflow.
- **Admin (delete-order confirmation & icon toolbar):** Every icon button in the
  row toolbar (*Edit*, *Print invoice*, *Cancel order*) carries an explicit
  accessible name and a `2 px` `--focus-ring` on `:focus-visible`. Choosing
  *Cancel order* opens a confirmation dialog that focuses the non-destructive
  *Keep order* button first, traps `Tab` inside, closes on `Esc`, and returns
  focus to the row's action button (or the next order row after cancellation).

## Not this

- **`<div onClick={...}>` styled like a button** — unreachable by `Tab`, missing
  `Enter`/`Space` activation and invisible to role/name tests; use `<button>`.
- **`*:focus { outline: none }` in a global reset** — blinds every keyboard user
  and breaks the `≥ 2 px`, `≥ 3:1` focus-ring floor.
- **Highlighting invalid form inputs with a red border alone** — invisible to
  colour-blind and screen-reader users; attach an icon and plain-language fix
  text via `aria-describedby`.
- **A dialog that leaves background links tabbable behind the scrim** — breaks
  modal focus trapping; mark background `inert` and return focus on close.
- **Hard-coded `padding-left` and `text-align: left` across the kit** — breaks
  layout mirroring in RTL languages; use logical properties from day one.
