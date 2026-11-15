# The layers and slices you will usually see

The architecture sets the rules; this is the shape they take in a package. Two
axes are worth keeping apart:

- **Layers** run through `src/`: a front end usually has
  `core ← components ← features ← domains`; a server has
  `core ← features ← domains`; the contracts package has `core` plus one folder
  per domain. A layer is a matrix of boxes.
- **Slices** sit inside one box. They are the kinds of code it is made of, and
  a box uses only the ones it needs.

| Tier | Usual slices | What each is for |
|---|---|---|
| Front end | `api/`, `services/`, `hooks/`, `ui/`, optionally `store/` | `api` talks; `services` decides; `hooks` holds reactive state; `store` is the factory of a store for one edited shape; `ui` renders |
| Server | `model`, `routes/`, `handlers/`, `services/`, optionally `schemas/`, `middleware`, `types.ts` | `model` owns tables; `routes` names addresses; `handlers` read requests; `services` decide; the optional slices hold their own kind of detail |
| Client package | `api/`, `services/`, `ui/`, optionally `editing/`, plus `types.ts` | `api` talks; `services` decide without network or DOM; `ui` renders; `editing` is the package's editor surface |

Around the slices, a box usually has an index file — its door — and a README.
A front-end box also has `routes.ts` when it owns addresses; the file is not a
slice. `store/` and the optional server slices are added when their subject
appears, not to make the tree look complete.

A small box can be flat: `api.ts`, `hooks.ts`, `ui.tsx` in its root is the same
box before it needs folders. When a slice grows, it groups files into subject
subfolders behind its still-single index file; when a box grows past the size
signal, it splits into boxes. The sizes and the barrel rule are in
[`structure/sizes.md`](../structure/sizes.md#flat-when-small-and-the-sizes).

The stack does not add a slice; it only says what a slice is made of. A guide
may name one extra optional slice of its own, and
[the rule for it](../structure/inside-a-box.md#the-technical-slices) is there.

**Two front ends, one per audience.** A *product* UI — an admin, a dashboard, an
app — is a reactive single-page app. A *content or marketing site* is
static-first, with a client runtime only where a page asks for one. Both build
against the same contracts package; neither ships the other's runtime. Pick by
audience, not by taste. The frameworks a repository uses are in its conventions.
