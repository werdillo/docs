# Inside a box

The **micro level**: how any one box is built on its inside. It is not part of
the design; the macro level ([`structure/`](./README.md)) treats
a box as opaque and never asks how it is arranged. But the arrangement is
uniform, so that being inside one box is being inside them all.

## A box owns everything about itself

A box is self-contained: everything that is *about it* lives inside it, not in a
central place elsewhere. For one box that means:

- its **data** — on a server, the tables in its model file, not in one shared schema
  folder, with the schema moved forward by migrations from the boxes' models; on a front end, the
  state it holds and the calls that fill it;
- its **addresses** — on a server, the routes it answers; on a front end, its
  screens and their paths — declared next to it, not in one central routes file;
- its **entry in the shell** — on a front end, the box carries its own route and
  its own place in the menu, and the composition root only lists it
  ([`architecture/seams.md`](../architecture/seams.md#the-composition-root-is-the-only-place-that-knows-everything));
- its **part** — the box's downward face: a declaration of imported names and
  literals, which is checked once at load and returned unchanged, doing
  no I/O and deciding nothing; what it names lives in the box's slices. On a
  server it names the tables the box owns (a deleted tenant's rows are erased
  from them), its search source, its backup section, and the reactions it
  declares (`reacts`, or the job kinds it runs), and the timed work it runs
  (`schedule`); on a front end, its sections
  on another box's screen
  ([the seam](../architecture/seams.md#invert-the-dependency-at-a-seam));
- its **tests and its README**.

**Why a part is not a new level.** A part is not a folder, a matrix or a runtime
object: it is the name of a relation. The box has an upward face — its door,
what a neighbour may call — and a downward face, the part the composition root
installs. Its contents are business nouns. It is not a plugin, which is one
slot, and not a registration, which is the act of installing it.

The other way — all models in one folder, all routes in another, all menu links
in a third — pulls a box apart across the tree. Keeping everything in one place
is what makes a box readable and movable, and it is the inside face of the
macro rule that a box is opaque.

## The technical slices

A box is cut into **technical slices** — the *kinds* of thing a box is made of.
The names are fixed per tier, and a slice is a folder only once it holds two or
more files of its own:

| Tier | Slices inside a box |
|---|---|
| Front end | `api` (calls), `services` (pure decisions), `hooks` (state), `ui` (markup), optionally `store` |
| Server | `model` (tables), `routes`, `handlers`, `services`, optionally `middleware`, `schemas`, `types.ts` |
| Client package | `api`, `services`, `ui`, optionally `editing`, plus the entry file, `types.ts` |

**A single file is not a folder.** Until a slice has two files, its one file sits
beside the box's entry file, named for its role — `api.ts`, `services.ts`,
`hooks.ts` — and a component keeps its own name in `ui` (`OrderPage.tsx`). The
folder appears with the second file, and the box's door does not change. It is a
default held by review on both tiers, not a failing guard.

A package's guide may name one extra optional slice of its own, once, in that
guide: a box's public face, say, or the routes an outside visitor calls (the
conventions name it where a package has one). Inside such a slice each kind of
code is one file, not a subfolder: `handlers.ts` and `routes.ts`, beside its
`router.ts` and door.

So **where something is says what it is**: `orders/ui/` renders, `orders/hooks/`
holds state, `orders/services/` decides, `orders/api/` talks. Similar elements
go in the same slice folder, one subject per file. The slice names are defaults,
not a duty on every piece of state: a component may keep its own small,
self-contained logic and read data where it uses it. Extract a hook when the
state or behaviour is reused, grows into several concerns, or must outlive the
component. And they live together: a box's code, its tests and its README
sit inside the box, not in parallel trees.

## Inside a function

Micro-structure does not stop at files; how each function is shaped determines
how easily it is read and tested at the unit tier:

- **Push `if`s up and pure computation down.** Handlers and processes own
  branching, access checks and I/O; helpers in `services` stay pure and never
  reach for the database or clock on the side.
- **A function fits on a screen** — about `50–70 lines` as an orienting signal.
  Use early returns and positive conditions to keep nesting flat.
- **Names carry the model and their units; comments say why.** Avoid cryptic
  abbreviations (`timeoutMsMax`, not `tmo`); a comment explains the invariant
  or trade-off the code cannot express, never what the next line does.

## The barrel

**A slice that is a folder is reached through its entry file** that re-exports
what is in it. That file is the slice's interface; the rest of the box imports
the slice as a whole, never a file inside it by path. A slice that is one file
is imported by that file's name:

```ts
// inside a box
import { listOrders } from '../services';   // a folder: its index.ts
import * as api from '../api';              // a single file: api.ts
```

**Within one slice the files link to each other directly**, by relative path —
they are parts of one thing, not callers of it:

```ts
// services/index.ts — the barrel, re-exporting its two files
export { placeOrder } from './placeOrder';
export { cancelOrder } from './cancelOrder';
```

**The box's own entry file is its door** — the only thing outside the box sees
([`architecture/doors.md`](../architecture/doors.md#boxes-meet-through-their-doors)). It
re-exports the slices that leave; a slice still one file is re-exported by name:

```ts
// a front end's box: hooks/ is a folder, ui.tsx a file
export * from './hooks';
export * from './ui';
// `api` stays internal to the box
```

Beside the door, two files may stand when the box needs them: `commands.ts`,
the writes a process may call, which the door re-exports whole; and the files
the part names — its plugs, its timed work. On the server the door is the box's
public exports, its router among them; on
the front end it is the hooks and components. Either way it is the one named
way into the box, and everything else inside is reached relatively.

The entry file is a file name, not a role. The roles have names:

| File | Role | Holds | Read by |
|---|---|---|---|
| the box's entry file | the box's **door** | `import`/`export` lines and the box's part | neighbours; the composition root for the part |
| a slice's entry file | a **barrel** | re-exports of the slice | the box's own files |
| a domain's entry file | the domain's **entry** | the domain's routers and `domain(name, parts)` | the composition root |
| a group's entry file | the group's **entry** | the group's routers or routes | whoever is outside the group |
| a process's entry file | the process's **entry** | its router, what another process may call, and its part when it fills a registry | the domain's entry; another process, one way |
| a box's entry file inside `shared` | a **convenience** | re-exports of a box in `shared` | nobody needs it: what is below is imported by path |
| the app, or the package's entry | the **composition root** | the assembly | the runtime |

Only the first is a door. The others are barrels, entries and a convenience;
"door" is not a synonym for the entry file.

The subfolders of a slice, the size signals that call for them, and a box in one
picture are in [flat when small, and the sizes](./sizes.md).
