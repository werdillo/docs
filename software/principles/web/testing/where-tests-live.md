# Where a test lives

**A test lives where the behaviour lives.** The tree says what a test covers
before the test is read, and a box that moves takes its tests with it. A test
parked at the side is a second map of the code, and the two drift.

| What | Where its tests sit |
|---|---|
| a box | a tests folder beside its slices |
| a process | a tests folder on its line, under the process |
| the composition root | the root's own tests, over the assembly |
| a contract | where its consumer reads it |
| a box in `shared` | with the box, below the boxes that use it |

- **A box owns its tests** — beside its code, with its data, its addresses and
  its README, never in a central tests tree
  ([a box owns everything about itself](../structure/inside-a-box.md#a-box-owns-everything-about-itself)).
- **A process owns the tests of its line** — its steps in order, what a refusal
  leaves behind, and the rollback that spans its boxes. A box's own decisions are
  already covered below it.
- **The composition root's tests guard the assembly** — that every box is
  declared, that the routes, plugs and parts line up. They test the gathering,
  not a box's behaviour.
- **A contract's tests live where the consumer reads it** — the reader parses
  the real producer's answers, so a drift fails where it would be felt.
- **A suite that boots the whole app is one suite at the package root.** Browser
  and live tests drive the app as a whole, so they sit in one folder whose
  subfolders mirror the boxes. The path still names the box; the runner is why
  the suite is not inside it.
- **Nothing else at the side.**

## Size

A tests folder follows the box's size rule: flat while it is small, and past
about 7–9 files it groups them by subject — a folder per checkout, per record
kind — the same signal as code
([flat when small](../structure/sizes.md#flat-when-small-and-the-sizes)). Grouping
is the whole shape; a tests folder needs no barrel, because it has no interface.
A heap of forty files named after verbs is a second tree by another name.

## Naming

- **The file names its subject** — the theme draft, the line quantities — never
  a generic name such as "services" or "utils".
- **The suffix marks the tier**, so the cost of running it is read from the name
  before the file opens. The suffixes a project uses are in the project's
  conventions — testing.
- **The folder says where it sits**: a line-quantity write test in an orders box's
  tests folder is that box's write.
- **The same basename in two boxes is fine** — the path is the address.
  Ambiguity is a flat-namespace problem, not a test problem.
