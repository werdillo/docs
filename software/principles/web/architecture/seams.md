# Seams and the composition root

## Invert the dependency at a seam

A lower layer sometimes has to work with what sits above it: search has to find
a domain's records, a backup has to save them, deleting a tenant has to delete
them. Do **not** import upward. The lower layer defines a **seam** — a registry
and the type of what may be put in it, "tell me how to search you" — and reads
only what was put there. It is one more kind of I/O a box does: as it answers a
route, it answers a registry.

- **Why:** the arrow stays down, and the lower layer works when the higher one
  is not there.
- **A violation looks like:** a box in `features` that has to `import` a
  domain to ask it a question.
- **When:** only when the arrow would otherwise point the wrong way, or the
  lower layer must work without the higher one. A dependency that already
  points down is imported, plainly.

**The shape of it.** A box says what it puts into registries below in its
**part**, declared in its door
([inside a box](../structure/inside-a-box.md#a-box-owns-everything-about-itself)); the
domain's entry lists its parts; the composition root installs the domains once.
On a server of this stack:

```ts
// the lower layer: the registry and the type of what may be put in it
export type SearchSource = { find(scope, text): Promise<Hit[]> };

// a box: its part, declared in its door
export const ordersPart = part({ section: "shop", tables: [orders, orderLines, payments], search: [orderSearch] });

// a domain: its parts, in order
export const shop = domain("shop", [productsPart, ordersPart /* … */]);

// the composition root: once, at startup
install([settings, content, shop, booking]);
```

The part names its access section once; everything it plugs in answers to it, so
a box's access is read in one place.

The domain's list is the order its parts are installed in. Where a person sees
an order — a backup's sections, a search's results — a part declares its rank
for that registry rather than leaving it to the list. A front end does the same
with the plugs as a field of each box's declaration, installed from its one
list. How the parts are joined and ranked is the project's own, in its
[conventions](../../conventions/architecture.md#registries-how-a-shared-thing-reaches-a-domain-without-importing-it).

**What a box does to its own data stays on its router.** An operation one box
can carry out alone — exporting or restoring its own records — is routes the box
registers on its own router with one call, so its own gate decides who may. A
registry serves only what spans every box: the whole-tenant copy, the search
across domains.

## What a person does lives with the person

A person's act on a thing — a review, a comment, a saved item, a filter on the
people list — is a box of its own in the people's matrix. The act is the same
whatever it is about, so the box owns the rows; the thing belongs to a domain, so
each box declares, in its part, the **kinds** it lets people act on, with what only the
domain knows: whether the subject exists, how it is titled, and what counts as
proof of use. A row names only its kind and id; a kind nobody registered is
refused, and a subject that does not exist may not be acted on. The admin side
has the same shape: a domain plugs its sections, its rows and its report pages,
and the composition root installs them. How it is kept here is in
[the conventions](../../conventions/architecture.md#acts-of-people).

## A third party is reached through a port

A system outside the project — a marketplace read, a payment provider, a push
service, a mail sender — is reached through a **port**: a type that says, in the
project's own terms, what the work needs from it ("listings for this query
since this time", "deliver this message to this device"). The side that needs
the work owns the port; each provider is an **adapter** that fills it.

- **The provider's shape stops at the adapter.** The adapter talks the
  provider's protocol and parses its answers into the port's types
  ([a contract lives once](./contracts.md#a-contract-lives-once)); nothing
  beyond it sees a provider's field, status or error.
- **What knows no subject goes to `core`** — an HTTP client, retries, a rate
  limiter, an HTML or feed parser. What knows one provider is its adapter.
- **One provider, one user:** the adapter is a file inside the box that uses
  it. **Several providers, or several users:** the port is a registry, each
  adapter is a box that fills it through its part, and the box that uses the
  port names no provider — adding one is a box and a line in its domain's list.
- **A provider's own data is the adapter's** — credentials, a cursor, a raw
  copy kept for replay — declared in its part like any box's records.
- **Every call has a bound.** An adapter's call to a provider has a timeout,
  and a retry has a count; both are named constants beside the adapter, not
  defaults of the HTTP client. A provider that hangs then costs one timeout,
  not a request held open until the platform kills it, and a retry that
  keeps failing ends in an answer — or in the job's dead letter
  ([long work](./data.md#long-work-is-a-job-never-a-request)).
- **Calling a provider is long work when it may be slow**, so it runs as a job
  or as timed work ([long work](./data.md#long-work-is-a-job-never-a-request)),
  and a message to a person goes through the notification outbox
  ([reactions](../structure/reactions.md#a-reaction-that-must-not-undo-the-write)).

**Inside a group** the same seam breaks a cycle between two boxes, with the
contract in the group's `shared`
([breaking a cycle](../structure/shared.md#breaking-a-cycle-with-a-contract)).

## The composition root is the only place that knows everything

One place per package assembles it — its the app, or its entry. Every box
**declares itself** next to its own code; the root only **lists** the
declarations and derives the rest from that list, so nothing can disagree with
it.

- **Why:** a central "pages" file and a central "routes" file drift apart; one
  list cannot.
- **Day one:** make the list the single source of the package's shape.

What a declaration holds depends on the package:

| Package | A box declares | The root lists, and derives |
|---|---|---|
| Front end | its addresses, the access section that guards them, its menu entry | the boxes, in menu order → the route tree, the menu, the access map |
| Server | its router, and its part — the tables it owns, its plugs and its timed work | the routers → the mounted routes; each domain's list of parts → every registry, filled by one `install([...])` |

[`example/day-one.md`](../example/day-one.md#3-declare-then-list) shows both in code. A
domain's root entry file is that domain's entry — it gathers its boxes'
routers — never a composition root.
