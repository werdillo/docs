# The module graph

Every guard asks the same two questions before its own: **which file does this
import load**, and **which box and layer does that file sit in**. They are
answered once, by the walker the guards share, and each guard adds only its
edge.

**Why one walker.** A guard that re-parsed the tree would answer "what is a box"
its own way, and two answers drift. One walker means every guard, a new alias is added once, and a change to the shape of a layer
reaches every test at once ([a rule lives once](../rules.md)).

## What it does

- **Collects files.** A recursive walk of `src/`, yielding every `.ts` file.
  Nothing is skipped at collection: a guard names the tests and helpers it
  exempts, so the exemption is visible where it applies.
- **Resolves a specifier.** A relative path resolves against the importing
  file; the package alias (`#/`) resolves against `src/`; anything else is a
  library and resolves to `null`. A trailing `.ts` and `/index` are normalized,
  so `./door` and `./door/index.ts` (in code) are the same target.
- **Loads the file.** The target is a file (`<target>.ts`) or a folder's entry
  (`<target>/index.ts`); a specifier that resolves to neither is not an edge in
  this graph.
- **Assigns a layer.** The first segment of a `src/` path. The package's own map
  says which arrows between layers are allowed ([layers](./layers.md)).
- **Assigns a box.** The nearest folder above the file that has an index file —
  a box's folder, the one that also holds its README and its slices — and
  is not a technical slice, not under `shared/`, and not an underscore folder. A
  folder whose subfolder is itself a box is a **group**, not a box; the group's
  own files belong to no box. Nothing inside a slice is a box.
- **Assigns a module.** The folder a file belongs to for data: the path up to
  the first technical layer, with the segment after `shared/` read as a feature
  name. Two files with the same module own the same tables.

## The template

Trimmed to its shape from the walker; the imports are elided, and `isFile` and
`isGroup` are its helpers for "a file exists" and "a folder holds boxes".

```ts
export function* files(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) yield* files(path);
    else if (entry.name.endsWith(".ts")) yield path;
  }
}

/** The `src/` path an import specifier points at, or null for a library. */
export function resolve(from: string, spec: string): string | null {
  if (spec.startsWith("#/")) return spec.slice(2);
  if (!spec.startsWith(".")) return null;
  const parts = from.split("/").slice(0, -1);
  for (const part of spec.split("/")) {
    if (part === "..") parts.pop();
    else if (part !== ".") parts.push(part);
  }
  return parts.join("/").replace(/\.ts$/, "").replace(/\/index$/, "");
}

/** The `src/` file an import of `spec` from `rel` loads, or null for a library or a missing file. */
export function fileOf(rel: string, spec: string): string | null {
  const target = resolve(rel, spec);
  if (!target) return null;
  if (isFile(`${SRC}${target}.ts`)) return `${target}.ts`;
  if (isFile(`${SRC}${target}/index.ts`)) return `${target}/index.ts`;
  return null;
}
```

The box assignment is the same walk, one question later:

```ts
/**
 * The innermost box a `src/` path sits in. A group is not a box: its own files (entry,
 * `router.ts`, `types.ts`) belong to none, and its boxes are the units that meet. Nothing
 * inside a slice is one either, so `handlers/admin/` is part of its box.
 */
export function boxOf(path: string): string | null {
  const parts = path.replace(/\.ts$/, "").split("/");
  if (!FEATURE_TREES.includes(parts[0]!)) return null;
  let box: string | null = null;
  for (let n = 2; n <= parts.length; n++) {
    const prefix = parts.slice(0, n);
    if (prefix.some((part) => part.startsWith("_") || LAYER_FOLDERS.has(part))) continue;
    const dir = prefix.join("/");
    if (isFile(`${SRC}${dir}/index.ts`) && !isGroup(dir)) box = dir;
  }
  return box;
}
```

## Re-export chains

Resolving a specifier gives the file, not the declaration. When a guard needs
the declaration — a command's name, a job kind, a handler — it follows
`export * from`, named re-exports and imports to the file that declares it, and
stops when it has been somewhere before. A door re-exports; the declaration is
behind it ([doors](./doors.md)).

## What it cannot see

- **A specifier built at run time.** `import(name)` where `name` is a variable:
  the graph is static, and a computed import is not an edge.
- **An alias it does not know.** One alias is resolved (`#/`); a second one is
  added here, not in each guard.
- **A file outside `src/`.** The walker reads one package's source, so a
  package's own exports map is a different guard ([ui](./ui.md)).
- **A dependency's inside.** A library resolves to `null`; its structure is not
  this project's.
- **An extension it does not walk.** The walk is `.ts`; a package that draws in
  another extension adds it in one place.
