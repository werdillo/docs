# Where each rule comes from

Two documents stand behind the safety rules here, and both are worth reading
whole:

- **The Power of Ten** — Gerard J. Holzmann, NASA/JPL, *Rules for Developing
  Safety-Critical Code* ([PDF](https://spinroot.com/gerard/pdf/P10.pdf)). Ten
  rules for C, each chosen because a tool can check it.
- **TigerStyle** — TigerBeetle's coding style
  ([upstream](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md)).
  The Power of Ten carried into Zig and extended with performance, naming and
  tooling. A copy is kept here, unedited, as
  [`tiger-style.md`](./tiger-style.md); TigerBeetle publishes it under the
  Apache License 2.0. When the two differ, upstream is the source, and the
  copy is replaced whole, never edited.

The structure — boxes, doors, layers, a composition root, guards — is feature
matrix design, reduced to what one executable needs.

The numbers below are the rules in [`rules.md`](../rules.md).

## The Power of Ten

| # | The rule, for C | Here | In Zig |
|---|---|---|---|
| 1 | Simple control flow: no `goto`, `setjmp`, recursion | 2 | The language has no `goto` or `setjmp`; recursion is the part left to hold. |
| 2 | Every loop has a fixed upper bound | 3 | A named limit in the loop's condition; the event loop is the marked exception. |
| 3 | No dynamic allocation after initialisation | 5 | Allocators are explicit parameters, so the rule can be enforced by locking one. |
| 4 | A function fits on one printed page — about 60 lines | 19 | 70 lines, counted by a guard. |
| 5 | At least two assertions per function, side-effect free | 8, 9 | `std.debug.assert`; an average and a signal, not a count per function. |
| 6 | Data declared at the smallest scope | 7 | `const` by default, declared at first use. |
| 7 | Check every return value; validate every parameter | 10, 8 | The compiler refuses an ignored error union; the ways around it are banned. Parameters are asserted. |
| 8 | Limited use of the preprocessor | 22 | There is no preprocessor; the equivalent temptation is comptime. |
| 9 | One level of pointer dereference; no function pointers | 6 | One level; handles between boxes; function pointers only inside a named interface. |
| 10 | Compile with every warning on, and no warnings; analyse daily | 14, 32, 36 | Zig has errors, not warnings. The rule becomes: ship the safe mode, do not silence the checks, and run one command. |

## TigerStyle

| TigerStyle | Here |
|---|---|
| Safety, performance, developer experience, in that order | 1 |
| Zero technical debt | 43 |
| Simple, explicit control flow; minimal abstractions | 2 |
| Put a limit on everything | 3, 4 |
| Explicitly sized types | 12 |
| Assertions: density, pairs, positive and negative space, compile time | 8, 9 |
| Static allocation at startup | 5 |
| Smallest scope; no duplicated variables or aliases | 7 |
| 70 lines; push `if`s up and `for`s down; pure leaves | 19, 20 |
| Do not react directly to external events; run at your own pace | 13 |
| Split compound conditions; state invariants positively | 2 |
| All errors must be handled | 10 |
| Always say why | 31 |
| Pass options explicitly at the call site | 14 |
| Back-of-the-envelope sketches; four resources, two characteristics | 24, 25 |
| Control plane and data plane; batching | 26, 27 |
| Mechanical sympathy; be explicit; hot loops as stand-alone functions | 28 |
| Naming: nouns and verbs, no abbreviations, units last, names that line up | 30 |
| Order in a file; fields, types, methods | 33 |
| Simpler signatures and return types; `*const` over 16 bytes; in-place initialisation | 21 |
| Buffer bleeds; grouping allocation with its `defer` | 5, 6 |
| Index, count and size; explicit division | 12 |
| `zig fmt`, 4 spaces, 100 columns, braces | 32 |
| Zero dependencies | 35 |
| Zig for tooling and scripts | 34 |
| Simulation testing; test exhaustively, with invalid data | 38, 39, 40 |

## Data-oriented design

TigerStyle asks for mechanical sympathy and batching but does not spell out
how data is laid out. [`performance/data-layout.md`](../performance/data-layout.md)
does, after:

- Mike Acton, *Data-Oriented Design and C++*, CppCon 2014 — the data is the
  problem, and where there is one there are many.
- Andrew Kelley, *A Practical Guide to Applying Data-Oriented Design*,
  Handmade Seattle 2021 — smaller items, struct of arrays, and a list per
  state, as the Zig compiler applies them.
- Richard Fabian, *Data-Oriented Design* — the book, with existence-based
  processing and hot and cold data.

## Where these documents depart

Each departure is deliberate and small.

- **`usize` is allowed where the language indexes.** TigerStyle avoids it
  everywhere. Slices and their lengths are `usize` in Zig; here it stays at
  that edge and anything stored or sent has a sized type (rule 12).
- **Function pointers are allowed inside a named interface.** The Power of
  Ten bans them. Zig's allocator is one, and so is any I/O interface that
  makes simulation possible; the ban is kept for loose ones (rule 6).
- **Assertion density is a signal.** Both sources state a minimum. A quota
  produces assertions written to meet it; here a function with none is asked
  what it assumes (rule 8).
- **Comments are short.** TigerStyle asks for prose; here a comment is a
  sentence or two of why, and longer reasoning goes in the box's README
  (rule 31).
- **No dependencies *by default*.** TigerStyle's policy is absolute. A
  service that must speak TLS or decode a format may need one, so each is a
  recorded exception behind a box (rule 35).
- **Structure is added.** Neither source says where code goes. The layers,
  boxes and doors come from feature matrix design (rules 15–18, 23), and so
  do the statuses — *guarded*, *signal*, *default* — and the guards with
  their shrinking lists (rules 41, 42).
- **Data layout and SIMD are added.** The rules for laying data out for a
  loop come from data-oriented design, above; the rules for vector loops —
  a scalar oracle, the tail, the checks per lane — are these documents' own
  (rules 22, 28).

Where these documents follow TigerStyle against the wider Zig habit:
functions and files are `snake_case`, not `camelCase` and `TitleCase.zig`
([case](../structure/naming.md#case)).
