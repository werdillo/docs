# Flat when small, and the sizes

The slices are the general shape; a box that is still small skips them. These
are the size signals the rest of the documents link to.

- **A box of about 4–6 file-subjects or fewer stays flat** — its files in its
  root, and a slice of one file is that file (`api.ts`, not a folder around an entry file),
  imported the same way (`../api`). A box with one operation may be three
  files.
- **A slice of about 7–9 files or more may group them into subject subfolders**
  (above).
- **A file is about 50–150 lines.** Shorter is often a file that did not need to
  be separate; longer is a file doing more than one thing.
- **A UI component is split by what it holds, not by its length**: when its
  markup holds logic that belongs in `hooks` or `services` (derived state, a pure
  computation, load and save orchestration), or when a part is used somewhere
  else. Several private components may share its file.
- **A UI file may hold several components and exports exactly one** — the
  blocks of a screen sit below it as named private components
  ([a screen reads top-down](../ui/screen-files.md#a-screen-reads-top-down)).
  A tiny part with a single user in the same folder lives in that user's file.
  A route page loaded lazily, and a part a box exports through its door, stay
  files of their own.

They are signals, not rules: when a box, a slice or a file crosses one, the
question is which level is missing, not how to fit the code in. A small box
that is flat is the shape working, not a deviation from it.

The numbers — 50–150 lines, 4–6 file-subjects, 7–9 files — are questions about
a missing level, not targets to fill or lint limits to trip. A file at 160
lines asks what should be split out; a box at seven file-subjects asks whether
it has grown. No test fails on a count.

## Subfolders inside a slice

A slice that has grown keeps its entry file as the interface but groups its
files into **subfolders by subject** — the slice's barrel re-exports the lot,
now from beneath it:

```ts
// the slice's entry file — still the one door to the slice
export { getOrder } from './records/getOrder';
export { placeOrder } from './checkout/placeOrder';
export { beginPayment } from './payments/beginPayment';
```

The subfolders need **no barrel of their own**: they are grouping, not a new
public surface, and the slice's entry file remains the one door. Reach for a
subfolder when a slice has passed the size signal below, and ask whether some
of them belong together under a name — `payments/`, `records/`, `checkout/`,
`variants/`. A slice whose files are all one subject stays flat even past that;
the split is by subject, not by count.

In `ui/` a component that is split out of its file becomes a folder of its own,
with `index.tsx` as its entry and its parts beside it, imported as `'./Board'`;
the split is made for one of the reasons above, not for the line count.

## In one picture

```
shop/products/                  ← a box
  index.ts                   ← its door (what leaves the box)
  api/                       ← a slice
    index.ts                 ← the slice's barrel
    listBlocks.ts            ← one subject per file
  hooks/
    index.ts
    blocks.ts
  ui/
    index.ts
    BlocksListPage.tsx
  README.md
```

and the same box when it is still small:

```
shop/tags/                    ← a box, flat
  index.ts
  api.ts
  hooks.ts
  ui.tsx
  README.md
```

and a slice that has grown groups its files, with the barrel still the one door:

```
orders/handlers/             ← a slice with many files
  index.ts                   ← the barrel: re-exports the lot
  records/
    getOrder.ts
    listOrders.ts
  payments/
    beginPayment.ts
  checkout/
    placeOrder.ts
```
