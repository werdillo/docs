# Matrices and boxes

## The matrix

At the design level **a box is opaque** — a unit you reason about abstractly:
what it is *for*, and which other boxes it may reach. That is the whole content
of the matrix. Drawn, a small one reads like this:

| may reach → | `shared` | `products` | `carts` | `orders` |
|---|---|---|---|---|
| **`_processes`** | yes | door | door | door |
| **`products`** | yes | | | |
| **`carts`** | yes | door | | |
| **`orders`** | yes | | | |

A row is everything one box may depend on; a column is everything that depends
on one box. Every box reaches `shared` below it and nothing reaches the
processes above; an empty cell is "no"; each "door" between two boxes is a
direct link, and a cost.

**What is inside a box is not part of the matrix** — that is the micro level,
and the matrix says nothing about it. This is what lets the design be read at
all: at the top the boxes are named and connected, and only then does it matter
how each is built.

### Sizing

This is the matrix size the rest of the documents link to.

Up to about **10 boxes per matrix, including `shared`**. Past that the matrix
stops being readable — introduce sub-boxes or split off a new layer, rather
than growing the grid. The number is an orienting size, not a linter: it is the
signal that a level is missing.

Ten is a question, not a target or a lint limit. A matrix at ten boxes is not
"full", and eleven fails no test; the count asks which level is missing. No
number here is enforced.

### Where one box ends

A box is drawn around a **subject**, not around a kind of code. Three signs
that a line is in the right place:

- **One sentence says what it is for**, without an "and". A purpose that needs
  "and" is two boxes.
- **It owns its data.** On a server, the records it keeps are written only by
  it; another box holds their ids, never their rows. On a front end, the state
  it holds is its own; another box asks through the door, never writes it.
- **It changes as one.** A request from the business lands in one box, or in
  the same box across the packages; a change that always touches two boxes says
  the line between them is wrong.

These are questions about the business, not the code, which is why the boxes can
be drawn before a line is written, and argued over by people who will never
read it.

### A matrix or a box, never both

A folder is one of two things. A **matrix** holds boxes, and a `shared` when
they have something in common: at
the top of a package's `src/` it is a **layer**, and nested inside another matrix
it is a **group**. A **box** holds its technical slices
([`inside-a-box.md`](./inside-a-box.md)). A folder with both boxes and slices in
it is a box that has started to grow sub-boxes without saying so: split it into
a group, and move its own code into a box or the group's `shared`.

This is the line between the levels: above it everything is matrices and boxes,
and only a box has an inside. `_processes` is the marked third case — the level
above the boxes ([processes](./processes.md)), which is neither a matrix of its
own nor a box.

**A group may have an entry**: a way in for outsiders, and the place
that mounts its boxes' entry points (on a server, an entry file and a
router), which gather the group for whoever is outside it — holding only
import and export lines, as a domain's entry does for the domain. On a front end
the entry is a `routes.ts` listing its boxes' declarations, while each box still
declares its own addresses in its own `routes.ts`. It is composition, not a box:
inside the group, its boxes reach each other through their own doors, one way,
never through the entry.

**In a domain on a server, a folder with no records of its own is not a box.** One that only
reads two or more boxes to answer is a [process](./processes.md) that reads; a
box of a domain is drawn around data it keeps. A box below the domains — a seam
in `features`, a primitive in `core` — may keep none. A front-end box is the same subject as its
server twin; it may keep no records itself, but it is that box's screen.

## The same box, the same place

**The domain layers are the same in every package**; `core` and `features` are
not — they are what a package of its type runs on, and a front end's differ
from a server's. A domain box keeps its name and its place **across the
packages**. The same box is `<domain>/<box>` in the API, in the
front end, in the contracts and in a client, so one is found from the other
without a search. Only the labels a person sees — a menu item, a URL — are free
to differ; the folders are not.

```
contracts/src/<domain>/<box>/   ← the shapes both sides agree on
api/src/<domain>/<box>/         ← the rules and the data
admin/src/<domain>/<box>/       ← the screens
client/src/<domain>/<box>.ts       ← what a site calls
```

What it gives:

- **One name is the whole address.** To know a box's name is to know where all
  of it lives, in every package; a person, a reviewer or an agent finds the
  other side by path, not by search.
- **A box is reasoned about once.** The matrix of a domain — its boxes and who
  may reach whom — is the same in every package, so it is designed once and
  read the same way by the business and by every tier.
- **A change has a visible footprint.** A box changed end to end is the same
  folder in each package; a diff that touches `products` in one package and not
  in another is a question worth asking.
- **Drift shows.** A box present on one side and missing on the other is seen
  in a directory listing, not discovered in production.
- **A new package is cheap.** A new tier — a mobile app, a second client — starts
  by adding the same folders; its map is already drawn.
- **A box moves whole.** Splitting a domain out, or dropping a box, is the same
  path deleted or moved in every package.

What exists on one side only — a screen with no box of its own on the server, a
box no client calls — simply has no twin; the rule is that a twin, where there
is one, has the same path.
