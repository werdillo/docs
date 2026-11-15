# The words

> **Shared core.** The core words — box, door, owner, matrix, `shared`, process, layer, domain, composition root — are defined once for every section of this repository in [`shared/`](../../../shared/words.md). That is the source: this page applies it to its own field, and where the two disagree, `shared/` wins and this page is fixed.

One word per thing, and the same word in every document. From the outside in:

| Word | What it is |
|---|---|
| **Project** | The whole system: every package, one set of domains. |
| **Package** | A separately built part of the project — the API, a front end, a client, the contracts. |
| **Contracts package** | The package of shapes every other package imports, and the only thing packages share. A repository may name it `shared`; these documents always call it the contracts package. |
| **Layer** | A matrix at the top of a package's `src/` — `core`, `features`, a domain. |
| **Domain** | A layer that is a subject of the business (`ecommerce`, `booking`); the same in every package. |
| **Matrix** | A set of boxes, with a `shared` when they have something in common, and the rule of which box may reach which. Said when the level does not matter: a layer and a group are both matrices. |
| **Group** | A matrix inside another matrix: a folder of boxes (and its `shared`), never of slices. It may have an **entry** — an entry file and a router (a routes file on a front end) that gather its boxes for outsiders. |
| **Box** | The unit of design: one purpose, its own data, opaque from outside. It holds slices, never boxes. |
| **`shared`** | The common ground of one matrix — what its boxes have in common, below them. Always this folder, at some level. |
| **Door** | A box's entry file (`index` in TypeScript); the only way in for a neighbour. It holds import and export lines and one declaration — its part — and, when a process calls the box's writes, keeps those commands apart from its queries (on a server, a commands file beside it, re-exported whole). |
| **Query / command** | What a door exports. A query reads or computes; another box may call it, one way, never in a cycle. A command changes data; outside its own box only a process calls it. The ground below — `shared`, `features`, `core` — is not "another box": the boxes above call its exported writes. |
| **Port / adapter** | A port is a type, in the project's terms, of what the work needs from a system outside; an adapter fills it for one provider and is the only place that provider's shape is seen. |
| **Slice** | A kind of code inside a box — `routes`, `services`, `ui`… — behind its own entry file, or one file while it is one file. |
| **Process** | The level above a matrix's boxes, as `shared` is the level below: a folder in `_processes/` where several boxes meet. It imports their doors and runs their steps in one unit of work — a transaction on a server, a flow on a front end — or reads them into one answer; outside each box it is the only caller of that box's commands, and no box calls it. |
| **Event** | A fact a box writes for another to react to after the commit; its shape is a contract, its delivery is the outbox's job. |
| **Outbox** | The mechanism that holds events written with a transaction and delivers them after it. At its smallest it is a job table, one kind per reaction or family of reasons; when several boxes react to the same facts it is a box in `features` — or the lowest `shared` both sides reach — with a `reacts` registry. The notification outbox is the same shape for a message to a person. |
| **Refusal** | A rule's "no" as a value: a stable `code` from a closed list, a message for a person and the fields a form needs; the boundary adds a status and a correlation id. |
| **Part** | The downward face of a box (or of a process that fills a registry) — the data it owns (tables on a server, state on a front end), the plugs it fills and the reactions it declares (the events it reacts to, or the job kinds and the timed work it runs), declared next to it — in the box's door or the process's index — as a declaration: checked once at load, not run as a step. Read by the composition root. Not a folder, not a level; not a plugin (one slot) or a registration (the act of installing it). A domain's entry lists its parts. |
| **Composition root** | The one place in a package that assembles it — its the app, or its entry. |

**Feature** is not one of these words. It lives on in two names only: the
design's, *feature matrix*, and the layer `features` — what every domain needs
and no domain owns. A box is a box everywhere — in these documents, in the
guides and in the READMEs; *module* survives only in names in code.

Project, package, matrix, group and box are where the business can reason; a
slice is where the code begins.
