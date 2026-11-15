# Doors

**The rule.** A box reaches a neighbour only through its door, one way, and
never in a cycle
([boxes meet through their doors](../architecture/doors.md#boxes-meet-through-their-doors);
[the principles](../rules.md), rule 10). Inside a group the same rule holds.

## What it checks

- **A box's door.** The resolved import is the target box's door — the index
  file of its folder; a path into the box is a violation, whether the file is a
  slice, a handler or a component.
- **A feature box.** The features layer is a shelf of boxes, not one area: a
  feature box reaches a neighbour through that neighbour's door. A domain reaches
  the features layer by path, because the shelf sits below the domains.
- **The door's contents.** Only import lines, re-exports, types (erased) and
  one declaration — the box's part — whose argument is data: names, property
  access, object and array literals. A call, a function or an operator in the
  part is a violation; the code belongs in a service the part names.
- **Cycles.** No two door files reach each other, directly or through other
  files. A cycle between plain files with no door on it is allowed.
- **A group's entry.** A group's entry and router reach the group's own boxes
  only through their doors; its `shared/` and its layer folders are its own.
- **Commands.** A box's commands file is a list of `export { … } from "./…"`
  lines. Only the box itself and a process import a command name; the door
  re-exports the commands file whole, exactly once, and names no command on
  another line. A whole-module import of a door that holds commands fails: it
  reaches them without naming them.
- **A process.** A process imports a box only through its door, never its
  routes or handlers; a door never imports a process; processes may import each
  other; a process declares no table and imports at least one box's door.
- **The overlay entry.** A composition layer may reach one named file of a box
  — an overlay's file, or a folder's entry — and nothing else in the box. The
  marker half of the overlay is readable; the overlay itself is not. The
  exception is a path in the guard's list, not a flag on the file.

A front end adds variants: a box's `api/` is reached from nothing outside the
box (a group's `shared/` from its group), a box's routes file is its second door
— a group lists the declarations, never the screens — and a box's files never
reach back through their own door. Its `services/` files are pure decisions: no
framework, no reactive sibling, no client, no DOM, no storage.

## The failure

`from → spec (past the door)`, `from ↔ to (cycle)`, and for a command,
`file imports name from spec — a command of box, which only a process may
call`. A client's door failure also names where the import landed and where the
door is:

```
shop/pages/ui/Page.tsx → ../gallery/ui/Picker (lands in shop/gallery/ui/Picker.tsx; the box's door is shop/gallery/index.ts)
```

## The template

The door check, trimmed; `moduleRefs` is the walker's import list and `fileOf`
the file a specifier loads ([the walker](./module-graph.md)).

```ts
const from = boxOf(rel);
for (const { spec } of moduleRefs(readFileSync(file, "utf8"))) {
  const target = resolve(rel, spec);
  if (!target) continue;
  const to = boxOf(target);
  const loaded = fileOf(rel, spec);
  if (!to || to === from || !loaded) continue;
  if (loaded !== `${to}/index.ts`) violations.push(`${rel} → ${spec} (past the door)`);
}
```

The door's own contents are a whitelist of top-level statements, and the part
is read as data:

```ts
const ALLOWED = /^(import\b|export\s+(type|interface)\b|export\s+(\*(\s+as\s+\w+)?|\{\})(\s+from\s+["'][^"']+["'])?$)/;
const PART = /export\s+const\s+(\w+Part)\s*=\s*declarePart\(/;
const DATA = /^[\s\w$.,:{}[\]'"]*$/;
const CODE_WORD = /\b(function|async|await|new|class|this|super|typeof|instanceof|in|void|delete|yield|return|import|export|as|satisfies)\b/;
```

## What it cannot see

- **A door that re-exports everything.** `export *` is not checked name by
  name; the commands guard covers the names that matter, the rest is review.
- **A namespace import.** `import * as x` reaches every name; a door holding
  commands fails whole-module, the rest is review.
- **A specifier built at run time**, and an alias the walker does not know.
- **A type-only door edge.** The door guard counts it — a type is still a
  dependency — while the cycle guard drops it, because it is erased.
- **A cycle through a package entry.** A door to another package is the exports
  map ([ui](./ui.md)), not this graph.
- **A group's own files.** A group is not a box, so its entry and types are
  outside the box rules; what they may hold is composition, checked by the
  entry's content rule, not by a door.
