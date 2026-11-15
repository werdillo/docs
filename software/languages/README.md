# Languages

A guide to each language worth knowing. **TypeScript** and **Zig** are the main
ones and are covered in depth; the rest are introductions — enough to read the
language, see what it is good at, and build something small.

| Language | Depth | Principles it carries |
|---|---|---|
| [TypeScript](./ts/README.md) | Main | [web](../principles/web/README.md) |
| [Zig](./zig/README.md) | Main | [low-level](../principles/low-level/README.md) |
| [Go](./go/README.md) | Introduction | — |
| [Python](./python/README.md) | Introduction | — |
| [Odin](./odin/README.md) | Introduction | — |
| [Rust](./rust/README.md) | Introduction | — |

This list is what to learn. Which languages a *project* may be written in is a
separate list, in [the web stack](../principles/web/stack/README.md#allowed-languages).

## The shape of a guide

A **main** guide:

1. **Why this language** — what it is for here, when to pick it, the version.
2. **Basics** — syntax, types, control flow, modules.
3. **The core ideas** — what makes the language itself (Zig: comptime,
   allocators, error unions; TypeScript: the type system, narrowing, generics).
4. **Toolchain** — build, test, format, lint, packages.
5. **Libraries** — the ones chosen, and why.
6. **In the principles** — how the principles set is written in this language.
7. **Pitfalls.**

An **introduction**:

1. **Why it is worth knowing** — what it does better than TypeScript or Zig.
2. **The core ideas**, compared with TypeScript or Zig.
3. **A small project**, start to finish.
4. **Where to go next.**
