# Layers

**The rule.** A package's `src/` is a stack of layers, and imports point down it
([the code is a set of matrices](../rules.md), rule 11;
[the matrix](../structure/matrix.md#the-matrix)).

## What it checks

Every source file of every layer, every import that lands in a layer of the
same package, and whether the target layer is in the source layer's allowed
list. An import that lands outside the package's layers — a library, a script,
a config — is not an edge. Tests are exempt: they read across the layers to set
up their data
([a test is not in the runtime graph](../testing/README.md#a-test-is-not-in-the-runtime-graph)).

The allowed arrows are a **map the package declares for itself**, and the guard
reads it rather than assuming one shape for every package. A front end adds
`components` between `core` and `features`; a client adds `app` to the list.
What must not differ between packages is the direction — the arrows point one
way, and a domain never imports another domain.

One variant also pins that each layer the map names is a folder, so a renamed
layer fails instead of leaving a row that walks nothing.

## The failure

`from → specifier`, one line per crossed arrow, asserted against an empty list:

```
shop/pages/handlers/create.ts → ../../booking/slots/open
```

## The template

The map and the walk, trimmed. A front end's and a client's differ in their
`ALLOWED` values and the import forms they read; the loop is the same.

```ts
const ALLOWED: Record<string, string[]> = {
  core: [],
  features: ["core"],
  settings: ["core", "features"],
  audience: ["core", "features"],
  cms: ["core", "features", "settings", "audience"],
  shop: ["core", "features", "settings", "audience"],
  booking: ["core", "features", "settings", "audience"],
};

/** The top-level folder an import lands in, or null for a library. */
function layerOf(from: string, spec: string): string | null {
  if (spec.startsWith("#/")) return spec.slice(2).split("/")[0]!;
  if (!spec.startsWith(".")) return null;
  const parts = from.split("/").slice(0, -1);
  for (const part of spec.split("/")) {
    if (part === "..") parts.pop();
    else if (part !== ".") parts.push(part);
  }
  return parts[0] ?? null;
}

for (const [layer, allowed] of Object.entries(ALLOWED)) {
  for (const file of files(`${SRC}${layer}`)) {
    const rel = file.slice(SRC.length);
    if (rel.includes("/tests/")) continue;
    for (const [, spec] of readFileSync(file, "utf8").matchAll(/(?:from|import)\s*\(?\s*"([^"]+)"/g)) {
      const target = layerOf(rel, spec!);
      if (!target || target === layer || allowed.includes(target)) continue;
      if (!(target in ALLOWED) && target !== "app") continue;
      if (EXCEPTIONS.has(`${rel} → ${target}`)) continue;
      violations.push(`${rel} → ${spec}`);
    }
  }
}
```

`EXCEPTIONS` is empty where the map already holds; it is the shape an adopted
project's known list takes ([guards fail loudly](../testing/helpers.md#guards-fail-loudly)).

## What it cannot see

- **A new top-level folder that is not in the map.** The guard walks the layers
  it knows; a new layer is a row, and the folder-existence check catches a row
  whose folder was renamed away.
- **A specifier built at run time.** `import(variable)` is not an edge.
- **A type-only import.** It is counted: a layer that names another layer's type
  still depends on it ([the walker](./module-graph.md)). The cycle guard is the
  one that drops types, because an erased edge cannot break loading.
- **A re-export that hides the target.** The specifier is what is checked, so
  importing a barrel inside an allowed layer that re-exports a forbidden one
  passes. The doors guard covers the same edge for boxes; a layer that
  re-exports upward is review.
- **The box rules inside a layer.** A feature box reaching another feature box,
  a domain reaching another domain's box — those are [doors](./doors.md).
