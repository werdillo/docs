# The words in each section

What each core word ([words](./words.md)) is in each section. A product
document draws the matrix in the first column; every column after it is what
that matrix becomes.

| Core word | Product | Design | Web | Low-level |
|---|---|---|---|---|
| **Domain** | A subject of the business | A section of the navigation | A layer in `src/` — `src/<domain>/`, the same in every package | — none: one program, one stack of boxes |
| **Box** | A capability, in one sentence without "and" | The screens of one subject | A folder `<domain>/<box>/`, the same path in every package | A folder in `src/` and a build module |
| **Door** | What the capability offers others | — | Its entry file — `index.ts` in TypeScript, the public surface in other languages | Its `root.zig`; what is `pub` |
| **Owner** | Who is the source of truth for a piece of data | The one screen where a thing is edited | The box whose tables or state hold it | The box that holds the state, and frees it |
| **`shared`** | What every capability of a domain relies on | The design system and the patterns | A `shared/` folder of a matrix | A low subject box (such as `board` in firmware), when several boxes share subject types |
| **Process** | A business process across capabilities | A flow across subjects' screens | `_processes/` above a matrix's boxes | A box higher in the layer map, or `main` |
| **Layer** | — | Foundations ← system ← screens | `core ← features ← domains ← app` (a front end adds `components` between `core` and `features`) | `limits ← core ← boxes ← main`, the layer map in `build.zig` |
| **Composition root** | The product document itself | The navigation | `app` | `main` |

Each section's own documents are the full text:
[web](../software/principles/web/words.md),
[low-level](../software/principles/low-level/words.md). Product adopts these words as
they are written. The design column is a first draft: whether design reasons
in the matrix, and how far, is still open.

**Hardware** is not mapped yet: one capability can touch the board, the body
and the firmware at once, and how a box is drawn there is an open question.
