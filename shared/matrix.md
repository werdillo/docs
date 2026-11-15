# The matrix

Sources: [web — matrices and boxes](../software/principles/web/structure/matrix.md),
[web — interaction](../software/principles/web/structure/interaction.md),
[low-level — boxes](../software/principles/low-level/structure/boxes.md).

## A box

A box is drawn around a **subject**, not around a kind of work. Three signs
that a line is in the right place:

- **One sentence says what it is for**, without an "and". A purpose that needs
  "and" is two boxes.
- **It owns its data.** What it keeps, only it changes; another box holds its
  ids and asks through its door.
- **It changes as one.** A request from the business lands in one box; a change
  that always touches two boxes says the line between them is wrong.

These are questions about the business, not about code or screens, which is why
the boxes can be drawn before anything is built, and argued over by people who
will never read the code.

## A matrix

At the design level a box is **opaque**: what it is for, and which other boxes
it may reach. That is the whole content of the matrix.

| may reach → | `shared` | `products` | `carts` | `orders` |
|---|---|---|---|---|
| **process** | yes | door | door | door |
| **`products`** | yes | | | |
| **`carts`** | yes | door | | |
| **`orders`** | yes | | | |

A row is everything one box depends on; a column is everything that depends on
one box. An empty cell is "no"; each "door" is a direct link, and a cost.

**Up to about ten boxes a matrix**, `shared` included. It is a question, not a
limit: past it, a level is missing — a group of boxes inside a box, or a new
layer.

## How boxes interact

By the first step that works, each only when the one before it does not:

1. **Inside one box** — what changes together lives together.
2. **Through `shared`** — what boxes have in common goes down, into the lowest
   place they all reach.
3. **Through another box's door, to read** — one way, never in a cycle.
4. **Through a process above them** — always for a change that spans boxes, and
   when direct links pile up or would make a cycle.

`shared` and a process are the same idea in two directions: **what is common
goes down, into the one place all its users reach; what connects them goes up,
into the one place that reaches them all.** The same rule holds at every scale —
between boxes, between layers, between whole parts of a system — which is why
the shape is recognised everywhere.

## How a box moves

A box sits where its users are, and moves when they change, keeping its name:

- **Down, when it is shared** — to the `shared` its users all reach.
- **Further down, when it stops knowing a subject** — to the base layer that
  knows no subject at all.
- **Into a group, when it grows** — a box past the sizes becomes a matrix of
  boxes under the same name.

## The same box, the same name

A box keeps its name in every section and every part: the box `booking/slots`
in the product document is the `booking/slots` screens in design and the
`booking/slots` folder in each package of the code. One name is the whole
address; a box present in one place and missing in another shows in a listing.
What each section makes of it is in [mapping](./mapping.md).
