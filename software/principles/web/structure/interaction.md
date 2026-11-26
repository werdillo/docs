# Interaction

## How boxes interact inside a matrix

Two boxes interact by the first of these that works — each step only when the
one before it does not:

1. **Inside one box** — the default: what changes together lives together.
2. **Through `shared`** — the preferred way between boxes: what they have in
   common goes into a **`shared`**, always the lowest one that all the boxes
   involved can reach.
3. **Directly, through another box's door, to read** — the only direct link
   there is: one box calls another's queries **through its entry file**, never into its
   internals (services, handlers, model). The link shows in the door: its import
   lines are the box's dependencies, and its exports are what the sibling
   offers. It runs **one way, never in a cycle**, and a link that is not
   justified is a step 4 in disguise.
4. **Through a process above them** — always for a write that spans boxes, and
   for reads when direct links pile up or one would make a cycle: the boxes meet in
   a process that imports their doors and does what is between them
   ([processes](./processes.md)).

`shared` and a process are the same idea in two directions: what the boxes have
in common goes down, into the one place they all reach; what connects them goes
up, into the one place that reaches them all. A direct link is a cost each time;
many of them between the same boxes are the sign that a step 4 is missing. And
a direct link is a query: another box's commands are called only by a process
([commands](./processes.md#a-boxs-commands-are-called-only-by-a-process)).

A reaction that must not undo the write is not a fifth step in this ladder. It
is an event, queued with the write and handled after the commit, with the
reaction declared in a part
([a reaction that must not undo the write](./reactions.md#a-reaction-that-must-not-undo-the-write)).

### The levels around the boxes

`shared` below the boxes and the processes above them have a document each:
[`shared.md`](./shared.md) — what goes into it, what never does, how it breaks a
cycle, how it is reached and changed — and [`processes.md`](./processes.md).

**The domains are peers** and never reach into one another; what they have in
common moves out of them, into `features` or a layer of the project's own.

## How matrices interact with each other

The layers are matrices, and a matrix that is a layer obeys the **arrow rules**
rather than the grid: a layer may use the ones below it and never the ones above,
with `app` composing them. A matrix nested inside another — a group — is not a
layer: its boxes obey the matrix rules, one level down. The base is the same
everywhere:

```
core ← features ← domains          app composes them
```

- **`core`** — the infrastructure the package runs on; it knows no subject.
- **`features`** — what every domain needs and no domain owns (accounts, files,
  search, notifications). Its boxes are boxes like any other; the name is the
  layer's.
- **The domains** — the project's subjects (`ecommerce`, `booking`, `cms`…):
  peers, never reaching into one another.

`core` and `features` belong to the package and differ by its type; the domains
belong to the project and are the same everywhere.

**`core` is the package's standard library.** Like a language's, it does not
know which program is written on it:

- **The test: could it ship as a package of its own and serve another program
  unchanged?** A combo parser, a debounce, a batch write, a sortable list pass;
  anything that names a page, an order or a project does not, and moves up.
- **Its words are general** — a shortcut, a delay, a guard, a transaction —
  never a subject's.
- **It changes least and is used most**, so it holds what is hard to get right
  and must behave the same everywhere, not what might be handy one day. A thing
  enters `core` when a second subject needs it and it has stopped knowing the
  first ([a box moves down](#how-a-box-moves-between-levels)).

A type of package adds a layer of its own where it needs one, in the same order.
These are examples, not a list to fill:

| Package | Its layers |
|---|---|
| API | `core ← features ← domains`, `app` wires the routes, the jobs, the registrations |
| Front end | `core ← components ← features ← domains` — `components` is the UI kit, with no subject |
| Contracts | `core ← features ← domains` — the shapes only; nothing runs |
| Client package | `core ← features ← domains`, `app` the entry points a site imports |

A project may also put a layer of its own between `features` and the domains,
when something is read by every domain and owned by none — a project-wide
configuration layer, say. A package keeps only the layers it has; the order of
the rest does not change.

## How packages interact with each other

The packages are the outermost level, and the same rule holds there: **packages
do not import each other; what they share is the contracts package**, the
common ground of the whole project. The API and a front end agree on a shape by
both importing it from the contracts, never by one reading the other's code.

- The contracts package depends on nothing of the project's, so every package can
  reach it and none is pulled in with it.
- A package that runs another — a client's tests against the real server — does
  it as a tool, from its tests, not from what it ships.
- A shape that two packages need and the contracts do not have is added to the
  contracts; it is not copied, and it is not imported sideways.

## How a box moves between levels

A box is put where its users are, and moves when they change:

- **Down, when it is shared.** A box one domain built and a second now needs
  moves down out of the domain — to the `shared` the two can both reach, or to
  `features` when every domain needs it. It is not imported across from the
  first domain.
- **Further down, when it stops knowing a subject.** What no longer says
  anything about the business — a client, a format, a primitive — goes further
  down to `core`.
- **Into a group, when it grows.** A box past the sizes becomes a group of boxes
  with a `shared` of its own, under the same name and path.

A box keeps its name when it moves, and in every package at once: it is the same
box, at the level its users now share. This is how the system grows by levels
instead of into one heap.

## Three rules, one shape

The whole design has three kinds of rule:

- **Between the packages** — the contracts package, and nothing else.
- **Between the layers** — the arrow rules.
- **Between the boxes of a matrix** — `shared` below them first, then another
  box's door for a read (the only direct link), a process above them for every
  write that spans them and when links pile up.

They are the same rule at a different scale — *what is common lives below, in
the one place all its users can reach; what connects them lives above, in the
one place that reaches them all* — which is why the shape is recognised
everywhere.

## In one picture

```
src/                         ← the layers of one package
  core/                      ← a layer: a matrix of boxes
  components/                ← a layer (a front end only)
  features/                  ← a layer
  ecommerce/                 ← a layer (a domain)
    shared/                  ← its common ground
    sales/                   ← a group: a matrix, its boxes and its shared
    products/                ← a group
    _processes/              ← above its boxes: where they meet
  booking/                   ← a layer (a domain)
  app/                       ← the composition of the layers
```

How a box is built inside is [`inside-a-box.md`](./inside-a-box.md).
