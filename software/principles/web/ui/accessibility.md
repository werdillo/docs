# Accessible by construction

The primitive library carries the behaviour; the kit keeps it intact
([the kit](./kit.md)). A screen inherits its accessibility; it does not add it
back.

- **The role says what a control does.** A single choice among a few is a radio
  group, a set of independent toggles is pressed buttons, page sections are
  tabs — whatever they look like.
- **Every control has a name.** An icon-only button requires a label; a field's
  hidden parts are named after the field ("Primary hex", not "Hex").
- **A name is a contract.** Browser tests find controls by role and name, so a
  refactor keeps names identical, and a test that breaks on a name change is
  telling the truth.
- **A static label is not a live region.** Only a message the user must hear
  announces itself.

## Keyboard is the second pointer

- Every action reachable by mouse is reachable by keyboard.
- Tab order follows the screen's reading order.
- A dialog traps focus and returns it to the trigger.
- Escape closes what it opened.

## Focus is visible and managed

- The kit draws the focus ring; a screen never removes it.
- After a delete, a save or a route change, focus moves to the thing that
  changed or to the heading, not to the top of the page by default.

## Contrast is a kit token

Text and control contrast is decided in the kit's tokens, in light and dark,
never per screen. A muted token that fails contrast is a kit bug.

## Motion is optional

A transition that carries meaning also has a reduced-motion form. Nothing
essential depends on an animation.

## Errors are announced and attached

- A field error is tied to its field.
- A form summary is a live region.
- The first invalid field takes focus on submit.

## Targets are big enough

A control's hit area is the kit's, not the icon's. An icon-only button has a
name and a target a thumb can hit.

## Tests find what a person can name

Browser tests find controls by role and name, so a control with no role or no
name cannot be tested and shows up as soon as a test is written for it. An
automated accessibility scan is advisory; finding by role and name is the habit
that keeps the kit honest.

## Language and direction

Language and direction are set at the root. A mixed-direction string is marked,
not guessed.
