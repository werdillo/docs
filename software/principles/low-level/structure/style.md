# Style

How the code reads. Style is not decoration: a name that says its unit
prevents a bug, and a line that fits the screen is a line that gets read.
Each rule here is kept because it serves safety, performance or the next
reader — in that order. Names have a page of their own,
[`naming.md`](./naming.md).

## Comments say why

- **A comment says what the code cannot**: why it is this way, the trap, the
  constraint, the "never". What the code does is the code's job.
- **One or two sentences.** A comment that needs a page is a design that
  belongs in the box's README, with a line in the code pointing at it.
- **A sentence**: a capital letter, a full stop, a space after the slashes. A
  short remark at the end of a line may be a phrase.
- **`//!` at the top of a file says what the file is for**; `///` on a public
  declaration says what it promises and what the caller must not do.
- **No history.** Not what it used to be, not who asked, not a date. That is
  the commit's.
- **An assertion in place of a comment** where the statement can be checked
  ([where they go](../safety/assertions.md#where-they-go)).
- **A test says how it tests.** A line at its top with the goal and the
  method, so that a reader can skip it or follow it.

## By the numbers

| Rule | Value | Why |
|---|---|---|
| Formatter | `zig fmt`, always | nobody argues about layout |
| Line length | at most 100 columns | two files side by side on one screen, nothing behind a scrollbar |
| Indentation | 4 spaces | the formatter's; visible at a distance |
| Function length | at most 70 lines | [it fits on a screen](./functions.md#a-function-fits-on-a-screen) |
| Braces | on every `if` that does not fit on one line | no statement silently outside its branch |

To wrap a long signature, call or literal, add a trailing comma and let the
formatter lay it out. The line and function limits have no exceptions list;
the others are the formatter's and cannot be broken.

## Commits

A commit message is read later by someone looking for a reason, so it gives
one: what changed, in a line, and why, in a few. A pull request's description
is not stored in the repository and does not replace it.

## What style is not

It is not a place to be clever. Between two ways to write something, the one
a tired reader gets right is the better one — which is usually the longer
name, the split condition and the extra assertion.
