# Toolchain

The tools a project fixes once. Every tool has a cost — to install, to learn,
to keep working, to trust — so there are few of them, and the first choice
for a new job is the tool already in hand.

## One language, one pinned toolchain

- **The program, its build, its scripts and its tests are Zig.** The build is
  `build.zig`; a script is a Zig file run by the build, not a shell script
  beside it. A script in the project's language is type-checked, runs the
  same on every machine, and is read by people who already know the
  language.
- **One compiler version, written in the tree.** The build manifest names the
  version it requires, and the build refuses another. Zig is still changing
  between versions, so "a recent Zig" is not a version.
- **An upgrade is one change**, made on purpose, that touches nothing else.
- **What is not Zig is listed.** A tool the project cannot avoid — a
  container build, a load generator — is named in the README with the reason,
  and is never needed by the one command.

## No dependencies by default

A dependency is code that ships in the program and was read by nobody on the
project. It brings its own allocation habits, its own error handling, its own
idea of a limit — usually none — and its own supply chain. For a small,
long-running service the cost is paid for the whole life of the program.

- **The default is none**, beyond the Zig toolchain and its standard library.
- **Each one is a recorded decision**: its name, what it is for, why it is
  not written here, and what in it has been read. The record is a list in the
  project's conventions, and a guard compares the build manifest to it
  ([enforcement](../testing/guards.md#enforcement)).
- **It is pinned by hash**, which the build manifest does by itself.
- **It sits behind a box.** One box imports it and gives the rest of the
  program the project's own types, so that it can be replaced, and so that
  the rules it does not follow stop at that box's door.
- **What it allocates is bounded from outside**: it is given an allocator
  over a fixed buffer, during startup.

The cases that honestly earn a place are narrow and known: cryptography and
TLS, a codec, a compression format — code where writing it oneself is the
larger risk. That question is open for TLS in particular
([not decided yet](../open-questions.md#tls-and-the-dependency-rule)).

## The safety checks ship

Zig has four build modes (`std.lang.Optimize`), and they differ in what
happens when the code is wrong.

| Mode | A failed assertion, an overflow, an index out of bounds |
|---|---|
| `.debug` | panics, with a trace |
| **`.safe`** | panics, with a trace — and the code is optimised |
| `.fast`, `.small` | undefined behaviour |

- **The release is built `.safe`** — `.preferred_optimize_mode = .safe` in
  `build.zig`, so that `-Drelease` means it. In the unsafe modes an assertion is
  not merely skipped: the compiler is told the condition holds and optimises
  on that promise, so a broken one corrupts instead of stopping.
- **The checks are not switched off locally.** `@setRuntimeSafety(false)` is
  allowed in a known list of hot loops, each with a benchmark that shows the
  check was the cost and a test that covers the loop's bounds.
- **Tests run in the mode that ships**, as well as in `.debug`.
- **Firmware that does not fit in `.safe`** is built `.small`, and that is
  a measured decision in the project's conventions, with the panic handler
  defined and the most important checks written explicitly
  ([firmware](../kinds/firmware.md#what-a-crash-does)).
- **Zig has no warnings to turn on** — an unused variable and an ignored
  error are errors. The equivalent discipline is not to silence them:
  `_ = value;` is for a parameter an interface forces on the function, not
  for a result nobody looked at.

## One command checks everything

One command, at the root, is the gate:

```sh
zig build check
```

It runs, in order: the formatter in check mode; the build, in the mode that
ships; the unit and random tests from the fixed seed; a short simulation; the
guards. It must pass before a change is called done, and its result is what
gets reported — not "should work".

- **It is reproducible.** The same tree gives the same answer on every
  machine: a fixed seed, no network, no clock.
- **It is fast enough to run before every commit.** What is slow has its own
  command — the long random runs, the live tests, the benchmarks.
- **CI runs the same commands**, never a second script that drifts from them.

## What a project fixes

These documents hold the rules; a project's conventions hold its answers:
the compiler version, the limits, the layer map, the dependency list, the
targets it builds for — a chip and its board among them — and the commands
beside the gate. Cross-compiling is the compiler's own; a target is an
option of the build, not a second toolchain.
