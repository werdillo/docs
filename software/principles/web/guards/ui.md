# Screens and the package's surface

**The rules.** A screen composes the kit and the kit owns the look
([the kit is the only place that draws](../ui/kit.md#the-kit-is-the-only-place-that-draws);
[the principles](../rules.md), rule 23); a package ships nothing to a client
it does not need ([the principles](../rules.md), rule 39).

## Kit usage

The guard walks every component file outside the kit's folder and fails on:

- **a raw control or styled tag** — `button`, `table`, `select`, `textarea`,
  `label`, `a`, `img`, and `input` unless it is a file or hidden input — and on
  the kit's own raw class builder;
- **a text size on any element or kit component** — a size is a variant of the
  kit's text component, never a class;
- **an inline `style`**, an `!` utility, a hand-typed page width, a width on a
  dialog's content, and a raw or direct colour utility (a screen picks a kit
  tone variant such as `tone="muted"` or `tone="danger"`, never a palette colour
  or direct token).

The exceptions are a list of `{ file, rule, reason }`; a listed file must still
break its rule, or the entry fails. The kit's names are in the project's
conventions — front end.

Failure: `file:line [rule] text`.

```ts
const allowed = (hit: { file: string; rule: Rule }) => ALLOWED.some((a) => a.file === hit.file && a.rule === hit.rule);
const violations = found
  .filter((hit) => !allowed(hit))
  .map((hit) => `${hit.file}:${hit.line} [${hit.rule}] ${hit.text}`);
expect(violations).toEqual([]);

// A listed exception that no longer breaks its rule is stale: remove it.
const stale = ALLOWED.filter((a) => !found.some((hit) => hit.file === a.file && hit.rule === a.rule)).map(
  (a) => `${a.file} [${a.rule}]`,
);
expect(stale).toEqual([]);
```

## The package's two halves

A client package can have a half a site's build uses as it stands — plain
TypeScript — and a half only the framework can load — components, and anything
under a `ui` folder. Plain TypeScript never reaches into the second; the
package's entries are the seam that may. A component reaching a component is the
normal case; a service or a call taking the framework's component into a context
that has none is not.

Failure: `plainFile → component`.

```ts
// The framework's own component extension, and the ui folder.
const isFrameworkOnly = (path: string) => path.endsWith(FRAMEWORK_EXTENSION) || /(^|\/)ui\//.test(path);
for (const file of sources(SRC)) {
  const path = relative(SRC, file);
  if (!isPlain(path) || isEntry(path) || /\/tests\//.test(path)) continue;
  for (const [, spec] of readFileSync(file, "utf8").matchAll(/(?:from|import)\s*\(?\s*["'](\.{1,2}\/[^"']+)["']/g)) {
    const target = relative(SRC, resolve(dirname(file), spec!));
    if (isFrameworkOnly(target)) offenders.push(`${path} → ${target}`);
  }
}
```

## The exports map's names

Every entry of the package's `exports` is imported and its **runtime** names
compared with a sorted list. A name a site can import is a promise the next
version keeps, so adding or removing one is an edit here too. Types are erased,
so a module of only types has no runtime names.

Failure: the two arrays differ; the diff names the added or missing export.

```ts
const runtimeNames = (module: object) => Object.keys(module).sort();

it("the package's root entry exports what a site is meant to use, and nothing it is not", () => {
  expect(runtimeNames(mod)).toEqual([
    // … the promised names, sorted
  ]);
});
```

## What it cannot see

- **A control built by a helper outside the kit.** The guard reads markup, so
  the tag it would catch is already inside the helper — which is where it
  belongs only if the helper is the kit's.
- **A raw tag inside a string.** It is reported even though it draws nothing;
  the exception list is the escape hatch for a genuine one.
- **A class built at run time.** Only string literals in an attribute are read;
  a class chosen from data is invisible.
- **A palette the pattern does not name.** The colour rule names the built-in
  palette; a custom one is added to the pattern or is review.
- **A type's shape.** The surface guard compares names, not the types behind
  them; a changed signature is the compiler's.
- **An import through an alias.** The two-halves guard follows relative
  specifiers; a package alias is added to its resolver in one place.
