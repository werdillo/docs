# The design language

How an **internal system** behaves and looks — an admin, a back office, a tool
staff keep open all day. **Linear is the reference for behaviour**: its action
menus, its buttons in the bar, its density, its keyboard and its screen shapes.
Where a rule below and Linear disagree, the rule wins; where the rules are
silent, Linear is a good guess. **The look is the product's own**, in the
manner of the system apps of a desktop OS, and is not a copy of Linear's
([the look](#the-look)). A public site or a storefront has its own design and
does not follow this page.

The theme's values may start from an OpenDesign design system
([tokens](../system/tokens.md)); the names are the standard, the values are the
product's. The rules:

## The look

The look is quiet greys, one filled colour for the one action, soft fills for
the rest, and depth only on what floats.

- **One face.** The platform's own system face, a neutral sans where there is
  none; a few weights, regular, medium and semibold.
- **Material for what floats.** Chrome that sits over content — the sidebar,
  the bars, a menu, a picker — is a translucent material with a blur behind it;
  where the browser cannot blur, it is solid. Content is never translucent.
- **Fills, not outlines.** A secondary action is a soft grey fill with no edge.
  The primary is the one filled accent, with a lit top edge. Destructive is a
  solid red for a confirmation, and red text on a soft red in a row.
- **Choices are a track.** A group of options, and tabs, sit on a grey track;
  the selected one is a white thumb with a hairline and a small shadow. A switch
  is a pill with a round white thumb, filled in the accent when on.
- **Fields are white with a hairline**, and take the accent ring on focus.
- **Three radii**: small for fields, medium for controls, large for cards,
  dialogs and popovers. The look never changes a control's height.
- **A selection is a tint.** A selected row in a sidebar or a list is a rounded
  fill in the accent's soft tint, its text at full strength.

## Calm

- **Achromatic chrome.** Greys and steps of luminance carry the hierarchy. The
  accent appears on the primary action, on focus and on a selection — at most
  twice on a screen.
- **Colour is information.** A status's colour says the status; nothing is
  coloured to decorate.
- **Hairlines, not boxes.** A region is set apart by a step of surface or by
  space first, by a thin low-contrast line second; a card around every section
  is noise. The one exception is the record's details panel, whose groups are
  white cards on the canvas.
- **Depth by luminance.** In dark a raised surface is a step lighter; a real
  shadow is only on what floats — a menu, a dialog, the command palette.
- **Weights are a short scale**: a reading weight, a label weight a step heavier,
  an announcing weight a step heavier again; never the heaviest weight of the
  family. The values and the typeface belong to the project's theme.

## Dense

- **An app, not a page.** Body text is the app's body size, secondary text one
  step smaller; a screen's title sits in its header bar, not as a hero. Display
  sizes are for an empty state and the sign-in screen.
- **Rows and controls are short.** A list shows about twenty records on a laptop
  without scrolling.
- **A record is one line in a list**: its name first, a few columns of
  metadata after it in muted text, its status as an icon or a small badge.
- **A list is a grid.** Each kind of value is a column shared by every row, as
  wide as its widest value; a row without that value leaves its cell empty, so
  nothing after it moves. A control in a column (a status select) fills the
  column's width. Numbers and money align right.
- **Explanation is on demand** — in an empty state, a tooltip, a hint — not a
  paragraph under every title.
- **A dialog** — a box near the top of the screen, not the middle: a header row,
  a body of label-and-control rows set on its surface with no box around them,
  and a footer with the actions; a name is a large untitled field, and only a
  confirmation is narrow.

## Few screen shapes

An internal system uses four of the canonical screen shapes
([patterns](../patterns/README.md)); a screen that needs another is a missing
shape, settled in the kit, not invented in place.

- **A list** — a header bar (title, count, view switch, the one primary
  action); a filter bar (applied filters as chips, *Filter* to add one,
  *Display* for grouping, ordering, columns and view mode); the rows, in one
  container with hairline separators. Grouped by a property, it shows group
  headers with counts. Selected rows bring up a floating bar of bulk actions.
- **A record** — a header bar (a breadcrumb back to its list, previous and
  next in that list, secondary actions in one *…* menu); the main column — the
  title edited in place, then the content; a properties panel on the right —
  status, relations, dates, each a row edited in place; the activity — history
  and comments — under the content.
- **Settings** — a narrow column of grouped rows, label on the left, control
  on the right.
- **A canvas** — a board, a calendar, a dashboard: a wide area under the same
  header bar.

The frame — sidebar, header bar, palette — is the same around all four.

## Navigation

The composition root declares the sidebar in one place, grouped by domain and
ordered by use: the screens a person works through every day come first, and
what is set up once sits in a fold at the end. Each box exports only its own
item, and the composition root places it. Folders and URLs do not follow the
menu: a fold's address is its first screen's, and a box stays in the folder of
its subject.

## Keyboard first

- **⌘K finds and does.** The command palette finds records and runs
  actions, the current screen's first.
- **Lists move by key**: ↑/↓ or j/k, Enter opens, x selects, Esc goes back.
  A record's properties have letters. Every shortcut is shown in the tooltip
  and the menu item it belongs to.
- **Every menu filters as you type.**

## Instant

- **A write shows its result at once** where the server rarely refuses it — a
  status, a toggle, a rename, an order of rows — and rolls back with a message
  when it does.
- **A draft saves itself**; publishing, paying, shipping are deliberate acts
  with their own button. Unsaved work is a visible state, not a disabled
  button.
- **Waiting looks like the result.** A skeleton of the same shape, shown only
  when the wait is long enough to notice; the previous screen stays until the
  next is ready.
- **A screen appears whole.** Its parts land with it, not one by one: a part
  below the fold reserves its height while it loads, a field whose choices come
  later is drawn disabled, and nothing animates height.
- **Motion is short and only on what moves**, with the motion tokens for its
  duration and easing ([tokens](../system/tokens.md#the-names)); reduced motion removes it.

## Quiet feedback

- **A reversible action is undone, not confirmed.** A small message in a
  corner offers *Undo*; a confirmation dialog is for what cannot be taken
  back.
- **An error sits by what failed**, in words that say what to do.

## Light and dark are equal

Both are designed. Dark is near-black with luminance steps, not the light theme
inverted; light is white with grey steps, not dark with the lights on.
