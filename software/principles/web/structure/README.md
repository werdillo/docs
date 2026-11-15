# Structure

The architecture, in one idea: the code is **a set of matrices** that interact
by rules. A matrix is a set of boxes and the rule of which may reach which —
drawn as a grid, the rows and the columns are the same boxes, and a cell says
whether the row's box may reach the column's, and how. Around its boxes a
matrix has two levels: **`shared`** below them, what they have in common, and
**`_processes`** above them, where several of them meet. A package's `src/` is
divided into **layers** — usually `core`, `features` and the domains — and each
layer is a matrix. A matrix can also sit inside another, as a **group**, so the
same shape repeats at every level.

This folder is the **macro level**: what a matrix and a layer are, how the
boxes inside one interact, and how matrices interact with each other. The
**micro level** — how one box is built on the inside — is
[`inside-a-box.md`](./inside-a-box.md), and it is a separate concern.

**A matrix is not a package.** In a monorepo a package is a separate project
that shares the repository (the API, the admin, a client, the contracts). A
package's `src/` holds **layers**, and each layer is a matrix; a matrix inside a
layer is a group. A matrix is neither the package nor the whole `src/`.

## In this folder

| File | What it holds |
|---|---|
| [`matrix.md`](./matrix.md) | A matrix and its boxes: the sizes, where a box ends, and the same place in every package. |
| [`interaction.md`](./interaction.md) | How boxes, matrices and packages interact, how a box moves between levels, and the shape the rules share. |
| [`shared.md`](./shared.md) | The level below the boxes: what goes into it, how it is reached and changed. |
| [`processes.md`](./processes.md) | The level above the boxes: what a process is, how it is built — its line, its participants, what it may not do — where several boxes meet, and when one is added. |
| [`reactions.md`](./reactions.md) | A reaction that must not undo the write: events and the outbox. |
| [`inside-a-box.md`](./inside-a-box.md) | How one box is built: what it owns, its slices and its door. |
| [`sizes.md`](./sizes.md) | When a box, a slice or a file is flat, and when it is grouped into subfolders. |
