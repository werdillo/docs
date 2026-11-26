# Architecture

The umbrella over the whole design. The code is **feature matrices**: a
package's `src/` is divided into **layers**, each layer is a matrix of boxes,
and a matrix inside another is a **group**. That shape has two levels, each
with a document of its own:

- **Macro** — the matrices, the boxes and how they interact:
  [`structure/`](../structure/README.md).
- **Micro** — how one box is built on the inside:
  [`structure/inside-a-box.md`](../structure/inside-a-box.md).

This folder holds the rest: how the levels are held together (seams and the
composition root), and the rules a box obeys **wherever it sits** — contracts,
doors, data. The rules are stated without tools; where the [stack](../stack/README.md)
gives one of them its shape, the rule says so and links there.

The principles are numbered once, in [the principles](../rules.md); this folder
expands them, and [`example/`](../example/README.md) shows them in code.

## In this folder

| File | What it holds |
|---|---|
| [`seams.md`](./seams.md) | The seam a lower layer defines, and the composition root that lists the declarations. |
| [`contracts.md`](./contracts.md) | A contract declared once at the boundary, and a refusal as a value. |
| [`access.md`](./access.md) | Who decides access, and what a reader is shown instead of a row. |
| [`data.md`](./data.md) | Writes as one transaction, a box's own data, one name per meaning, and long work as a job. |
| [`doors.md`](./doors.md) | The door between boxes, and the exceptions the rules state. |
| [`enforcement.md`](./enforcement.md) | The table of the tests that guard the expensive edges, and the owned-writes test. |

The tests behind that table are described in [`../guards/`](../guards/README.md).
