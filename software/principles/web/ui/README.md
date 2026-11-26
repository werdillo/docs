# Screens and the UI kit

How a front end's screens are built so that every one of them looks, reads and
behaves the same — and stays that way as it grows. It is the `ui/` slice of a
front-end box ([inside a box](../structure/inside-a-box.md#the-technical-slices)) and the
`components` layer below the domains
([the layers](../structure/interaction.md#how-matrices-interact-with-each-other)),
seen from the screen.

The idea in one line: **a screen composes the kit; the kit owns the look.** A
screen says *what* is on it — a list of returns, a form with two fields, a save
button — and never *how it is drawn*. Sizes, colours, spacing, widths and
states belong to the kit, chosen once, so a screen cannot drift from the others
and a change to the look is made in one place. The kit draws with tokens named
by the OpenDesign contract; an internal system uses Linear as the reference for
behaviour, while keeping the look the product's own.

## In this folder

| File | What it holds |
|---|---|
| [`design/languages/internal.md`](../../../../design/languages/internal.md) | *(in `design/`)* How an internal system looks and behaves — calm, dense, four screen shapes, keyboard first, instant — with Linear as the reference. |
| [`design/system/tokens.md`](../../../../design/system/tokens.md) | *(in `design/`)* The look as tokens with OpenDesign names: one theme file, the names, extensions, how code reaches them. |
| [`kit.md`](./kit.md) | The kit is the only place that draws, how it grows, and the layout parts it holds. |
| [`screen-files.md`](./screen-files.md) | How a screen file is arranged to be read. |
| [`accessibility.md`](./accessibility.md) | The roles and names the kit keeps intact. |
| [`changing-the-look.md`](./changing-the-look.md) | How a change to the look is made, and what is not allowed. |
