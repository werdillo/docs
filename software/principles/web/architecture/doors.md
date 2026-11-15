# Doors and exceptions

## Boxes meet through their doors

A box reaches a neighbour through its **door**, never into its insides. The
door is the box's entry file, and it holds only `import` and `export` lines and
one declaration — the box's part. Its import lines are the box's dependencies,
its exports are what it offers its neighbours, and its part is what it gives the
layers below ([the seam](./seams.md#invert-the-dependency-at-a-seam)); reading the doors
shows how the boxes interact. A door has two faces: up, what a neighbour may
call; down, the part the composition root installs. Only the first is an API;
the part is a declaration, checked at load and not run as a step
([the part](../structure/inside-a-box.md#a-box-owns-everything-about-itself)). In another
of the allowed languages the door is that language's public surface of a
package: a Go package's exported names, a Rust module's `pub` items, a Python
package's `__init__.py`.

- **The door exports what its consumers use, and nothing else.**
- **Inside one box**, files import each other by relative path.
- **What lies below is imported by path, not through a door.** `shared` and
  `features` are common ground beneath the domains, imported from any domain,
  in full; they never import a domain, so no cycle can come from them. A box
  inside a `shared` is part of that ground: its files are imported by path,
  and an entry file there is a convenience, not a gate.
- **Domains never import each other.**
- **A process is not a neighbour.** No box calls a process; the routes that
  start one belong to it.
- **Another box's commands are called only by a process.** A box may call
  another box's queries one way, through its door; the writes a door exports from
  its `commands.ts` are imported only by the box itself and by processes
  ([`structure/processes.md`](../structure/processes.md#a-boxs-commands-are-called-only-by-a-process)).
- **A door's queries read a set.** A query takes a list of ids and returns
  them by id, so that a caller with many reads once
  ([performance](../stack/performance.md#what-the-architecture-asks)).
- **No cycle through doors.** Two doors never reach each other, directly or
  through others: that is the cycle that breaks loading. A cycle between plain
  files, with no door on it, is allowed.

## Exceptions, and their conditions

The rules above are defaults. These are the only exceptions the principles
state; each names the rule it bends, its limit, and the document that owns it.
Anything not in this table is not an exception.

| Exception | Bends | Condition | Owned by |
|---|---|---|---|
| A process, or a lower layer through a plug the owner fills, runs a box's statements in its batch | A box owns its data — the batch spans boxes | The owner builds the statements; the caller runs them, owns no table and holds no data; one batch | [A box owns its data](./data.md#a-box-owns-its-data-between-boxes-reference-by-id) |
| The domain's entry (its root entry file) skips the door | Boxes meet through their doors | It is composition, not a box — it gathers routers and lists parts; the exemption covers the door rule and the door's "only import/export lines and one declaration" rule | [The door rule, above](#boxes-meet-through-their-doors) |
| A group's entry is the way in for outsiders | Boxes meet through their own doors | For outsiders only; inside the group, its boxes use each other's own doors, one way. It holds only import and export lines, and a router that mounts its boxes' routers. On a front end it is a `routes.ts` listing the boxes' declarations, each box still declaring its own addresses in its own `routes.ts` | [`structure/matrix.md`](../structure/matrix.md#a-matrix-or-a-box-never-both) |
| A box inside a `shared` is imported by path | Boxes meet through their doors; each slice is reached through its barrel (principle 21) | `shared` is the ground below its users, not a neighbour; an entry file there is a convenience, never a gate. Its model may be read by path; its rows are written only through what it exports — an action, or the statements of a step that joins the caller's batch | [`structure/shared.md`](../structure/shared.md#how-it-is-reached) |

**Not exceptions:** a job reaching a box's internals (it is a caller like any
other, so it uses the door), and a `shared` forwarding to a box (that is the
direct link with its name hidden; the cycle case is a contract in `shared` or a
process, not a re-export).
