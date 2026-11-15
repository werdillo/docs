# Changing the look

## How a change to the look is made

A change to the kit touches many screens, so it is made the way the kit is
harvested, and checked the way a user sees it.

1. **The kit first**, in its own change, with its README and its variants.
2. **The screens next, area by area**, each area separate so the changes do not
   collide; each lists what it could not convert and why.
3. **The guard last**: the kit guard learns the new rule, with its exceptions
   listed.
4. **Checked in a real browser**: the browser suites — the stubbed one and the
   one against the real backend, since a kit swap can change a control's role or
   name that only a full screen reveals — a look at the main screens on demo
   data, and the framework's dev diagnostics compared with the previous version:
   a new warning in a new component is a bug in it, an old one is a separate
   task.

## Not this

- A screen that styles a control "just here" — that is a missing variant.
- A local helper that builds class strings for a chip or a pill — that is a
  missing component.
- A shared component that takes a subject's record — that is a feature or a box.
- A wrapper that only forwards props to one child — that is noise; use the
  child.
