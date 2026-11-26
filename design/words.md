# Words

One word per thing, the same on every page of `design/`. The core words —
box, door, owner, matrix, `shared`, process, layer, composition root, domain —
are defined once in [`shared/words.md`](../shared/words.md) and applied to
design in [`shared/mapping.md`](../shared/mapping.md).

## Core words in design

| Word | What it is in design |
|---|---|
| **Domain** | A top-level section of the navigation. |
| **Box** | The screens of one subject (`list`, `record`, `form`, `settings`). |
| **Owner** | The one screen where a piece of data is edited; other screens read it or link to its owner. |
| **`shared`** | The design system (tokens, kit components) and shared patterns below every box's screens. |
| **Process** | A `flow` (for a cross-box write) or a composite `list`/`canvas` (for a cross-box read). |
| **Layer** | `foundations ← system ← patterns ← screens`. |
| **Composition root** | The application shell and navigation declaration that places every domain and box in order. |

## Design's own words

| Word | What it is |
|---|---|
| **Design language** | The complete look and behaviour of one kind of product — `internal` or `public` ([languages](./languages/README.md)). |
| **Token** | A named design value from the OpenDesign contract (`--surface`, `--fg`, `--accent`, `--space-4`, `--motion-fast`) — never a raw hex or pixel in a screen ([tokens](./system/tokens.md)). |
| **Extension** | A tier-2 app-specific semantic token declared after the OpenDesign contract in the same theme file (`--surface-hover`, `--panel`, `--danger-soft`), derived from contract tokens where possible. |
| **Component token** | A tier-3 component-scoped variable (`--button-height-md`, `--input-bg`, `--row-height`, `--dialog-radius`) that aliases tier-1 or tier-2 tokens so density and theme changes never fork components ([tokens](./system/tokens.md#tier-3-component-tokens)). |
| **Component** | One reusable piece of the UI kit with fixed anatomy, variants, control states and tokens ([components](./system/components/README.md)). |
| **Variant** | A named option on a component (`tone="danger"`, `size="sm"`) — the only way a screen chooses appearance. |
| **Screen shape** | One of the six canonical page layouts: `list`, `record`, `form`, `settings`, `canvas`, `flow` ([patterns](./patterns/README.md)). |
| **Surface** | Either a luminance tier (`--bg`, `--surface`, `--surface-warm`) or a cross-cutting overlay shared by all shapes (empty state, dialog, drawer, popover, bulk bar, toast — [surfaces](./patterns/surfaces.md)). |
| **State** | One of the nine screen states (default, loading, empty, error, no-access, pending/optimistic, dirty, stale/conflict, undoable success) or six control states ([states](./process/states.md)). |
| **Focal point** | The single element on a screen or band that draws the eye first ([hierarchy](./foundations/hierarchy.md)). |
| **Chrome** | The frame around content — sidebar, header bar, filter bar, tabs, footers. Quiet by default so content leads. |
| **Measure** | The width of a line of reading text, measured in characters (`45–75 ch`, [typography](./foundations/typography.md)). |
| **Microcopy** | Every word on a screen — labels, buttons, empty states, hints, error messages — written in the business's own vocabulary ([copy](./process/copy.md)). |
| **AI slop** | Generic, decorative visual filler (purple gradients, glowing blobs, cards inside cards, fake KPI widgets, stock icon walls) that signals unthought design instead of solving a scenario. |

## What is not a word here

- **Detail** is not a screen shape here; the canonical word is **record** (so
  `bizdev/`, `design/` and `web/` name the same shape).
- **Screen** is used for any view of a box or process; **page** is kept for a
  public URL served by a site ([sites](../software/principles/web/site/README.md)).
- **Mockup** is a picture; a **specification** names the box, language, shape,
  states, copy and kit components precisely enough to build and test.
