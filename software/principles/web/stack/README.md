# Stack

The **languages** a project may be written in are few. A project chooses **one
stack** for its language and keeps the choice in its conventions; this page says
what the stack must provide, and names tools only as examples.

## Allowed languages

- **TypeScript** — the default; most projects are TypeScript, and the qualities
  below are most easily met with it.
- **Go**
- **Zig** — for **WebAssembly** and native code: a wasm module a project needs
  is written in Zig, and an existing C or C++ library is reached through it.
- **Python**
- **Rust**

TypeScript is the default by a wide margin; another language is for a project or
a component where it genuinely fits better. Five are enough for almost any task:
C and C++ are not on the list because Zig compiles and links them natively, and
a JVM or .NET language would add a second runtime without adding a capability.
The [architecture](../architecture/README.md) does not change with the language;
the stack does, and it is chosen by the same qualities.

## What a stack must provide

The stack is **fixed once per project**, so a new project starts from it instead
of re-deciding. These are the qualities it keeps. Each is a default; the example
tools are one way of meeting it, and the project's
[conventions](../../conventions/README.md) say which ones it uses.

1. **One runtime and one type system, end to end.** One toolchain runs install,
   scripts, tests and the type checker, so there is no second one to keep in
   step; types hold from the database row to the browser. *(e.g. a single
   TypeScript runtime with its own package manager and checker)*
2. **One source of truth for a shape.** A schema library declares each shape
   once: the producer serialises against it, the consumer parses against it, and
   one declaration gives both the runtime check and the static type
   ([contracts](../architecture/contracts.md#a-contract-lives-once)). *(e.g. zod)*
3. **The schema is the models moved forward by migrations.** The models in code
   are the source; each change to them is a numbered migration written from the
   diff, and an applied migration is never edited
   ([schema](../guards/schema.md)). *(e.g. an ORM over SQLite)*
4. **Managed primitives** over self-run infrastructure: storage, compute and
   files that the platform runs, deployed from the repository, so the project
   runs and secures nothing itself. ([data](../architecture/data.md))
5. **Ship nothing to a client it does not need.** A compiled, fine-grained UI
   framework for a product screen; static output by default, with a client
   runtime only where a page asks for one.
6. **One copy of anything with identity.** One workspace, versions pinned in one
   central place, a lockfile committed; a library that keeps state is loaded
   once.
7. **Configuration where the tool reads it.** A tool that reads its config from
   its own directory keeps it there; shared versions live in one central place.
8. **One command checks everything, and CI runs the same steps.** One command
   runs the type check, lint and unit tests of every package; browser tests are
   a separate tier ([testing](../testing/README.md)).
9. **Operate by default.** The platform holds the secrets and the managed data,
   and every public write has a limit.

## A library built for an older framework

A library whose framework adapter targets an older major version may not
install as it ships: its adapter imports what the newer version removed. Its
framework-free core is used as it is, and the adapter is ported onto that core
inside the project's own `core` layer. The port mirors the original's logic and
names, so a later diff against it reads easily, and the folder's README says
what it mirrors and why.

## Choices and their traps

The stack a project chose, with its versions and the traps found in it, is in
its conventions: [`conventions/stack.md`](../../conventions/stack.md).

## In this folder

| File | What it holds |
|---|---|
| [`layers-and-slices.md`](./layers-and-slices.md) | The shape the layers and slices take in a package. |
| [`where-it-shows.md`](./where-it-shows.md) | Where the stack shows through the rules, and how a guard works. |
| [`performance.md`](./performance.md) | How code is written so that it is fast from the start. |
| [`monorepo.md`](./monorepo.md) | The monorepo and the contracts package. |
| [`starting.md`](./starting.md) | The variants, the day-one decisions and the bootstrapping checklist. |
| [`mobile-desktop.md`](./mobile-desktop.md) | The mobile and desktop shells. |
