# The same place

**The rule.** The domain layers are the same in every package, and a box keeps
its name and its path across them, so one name is the whole address
([the same box, the same place](../structure/matrix.md#the-same-box-the-same-place)).

## What it checks

Every box under the domain trees of each package, against the server package's
paths:

- a folder is a box when it is not a technical slice;
- a file is a box when its folder has no index file — a package may hold a box as
  one file;
- a path that exists in the server is the reference; a path that does not, but
  whose last segment exists in the same domain elsewhere, is a violation.

What exists on one side only has no twin and is not checked. Only the twin's
path is the rule; a menu label, a URL and a screen's words are free to differ.

Failure: `<package>:<path> is <reference>:<other>`, one line per twin in the
wrong place, with the message: move it to the server's path, or name it in the
known list with the reason it stays.

## The template

The comparison, trimmed; `boxes()` collects each package's paths and `server` is
the reference set.

```ts
const check = (label: string, paths: string[]) => {
  for (const path of paths) {
    if (path === "" || server.has(path)) continue;
    const domain = path.split("/")[0];
    const elsewhere = (byName.get(path.split("/").at(-1)!) ?? []).filter((other) => other.split("/")[0] === domain);
    for (const other of elsewhere) violations.push(`${label}:${path} is server:${other}`);
  }
};
// called once per package, with the reference set from the server
```

## The known divergences

The known list maps each divergence to its reason, and fails when an entry no
longer matches. Two shapes of entry are possible:

- a front end starts a process where the server keeps it under a group, so the
  screen's routes have no group of their own;
- the contracts hold one file of shapes, not the process's folder, so the same
  process reads as a different path there.

Each is a difference in the **level** a package needs, not in the box's name;
the entry is the place to argue with, and it comes off when the levels agree.
A project's list, and whether it is empty, is in its convention.

## What it cannot see

- **A box that exists on one side only.** By design: no twin, no rule.
- **Two boxes with the same name in one domain.** The comparison is by last
  segment, so the wrong twin can match; the path is the address, and a repeated
  name is the ambiguity.
- **A box renamed on both sides at once.** Both sides agree, so the guard
  passes; the name is a decision, not a drift.
- **A package that is not on the list.** Add it where the check runs; the guard
  knows the packages it compares.
- **A group or a process folder.** The walk counts every non-slice folder as a
  box, groups included; the path rule still holds for them, and the name is what
  is compared.
- **A box's insides.** This is the macro path only; a slice's shape is
  [inside a box](../structure/inside-a-box.md).
