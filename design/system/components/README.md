# Components

Specifications for the core kit components, built strictly from the three-tier
tokens in [`tokens.md`](../tokens.md) and [`tokens.json`](../tokens.json).
Screens compose these components and pass only named variants — never raw
values, never direct token classes
([the kit](../../../software/principles/web/ui/kit.md)).

## Structure of every specification

Every file in this folder follows the same seven sections so a person or an
agent builds the exact same component:

1. **Anatomy** — the named parts of the component.
2. **Variants** — the named props a screen may pass (`tone`, `size`, `kind`).
3. **States** — all six control states (`default`, `hover`, `focus`, `pressed`,
   `disabled`, `error / loading`).
4. **Tokens** — the OpenDesign contract, extension and component tokens it
   reads.
5. **Keyboard and accessibility** — focus, keys and ARIA contracts.
6. **When to use and when not to** — boundaries against neighbouring
   components.
7. **Not this** — common mistakes the specification forbids.

## The kit

| File | Components |
|---|---|
| [`button.md`](./button.md) | **Button** and **Icon button** — primary, secondary, ghost, danger; width-locked busy state. |
| [`field.md`](./field.md) | **Field**, **Input**, **Textarea** and **Select / Combobox** — top-aligned labels, inline errors, blur/submit validation. |
| [`choice.md`](./choice.md) | **Segmented track**, **Tabs**, **Switch**, **Checkbox** and **Radio** — options on a track, binary toggles, selections. |
| [`badge.md`](./badge.md) | **Status badge**, **Tag** and **Filter chip** — semantic tones with non-colour cues. |
| [`list-row.md`](./list-row.md) | **List row**, **Grid column** and **Card tile** — internal dense rows and public aspect-locked tiles. |
| [`dialog.md`](./dialog.md) | **Dialog**, **Confirmation dialog**, **Drawer / Sheet** and **Popover** — floating overlays with focus traps. |
| [`feedback.md`](./feedback.md) | **Toast**, **Inline banner**, **Empty state** and **Skeleton** — quiet undo, contextual refusal, zero-shift loading. |
| [`navigation.md`](./navigation.md) | **Sidebar**, **Header bar**, **Breadcrumb**, **Overflow menu**, **Command palette (`⌘K`)** and **Public nav bar**. |
