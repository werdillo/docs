# Helpers and guards

Two shared things make a suite readable: the helpers that build its data, and
the lists a guard keeps of what it lets through. Both are declared once, at the
level of their subjects.

## Helpers live once

A seed or fixture helper is part of the testing vocabulary, declared at the
level of its subjects and imported by every test that needs it:

| Helper | Level | Builds |
|---|---|---|
| a row by the model's names | the `core` testing module | one row of any table, defaults from the schema |
| a project or a tenant | the box that owns it, in its `testing/` entry | the record every domain's tests need |
| an entity with its relations | the domain's `shared/testing` | a product with its variants, or the equivalent |
| a stubbed answer | a browser suite's `fixtures` | the backend as the screen expects it, and a knob per answer |

The row helper inserts directly, by the model's own property names, so a
fixture reads like the code and survives a column rename the compiler points
at. It says **what data the test needs**; how the row is built stays in one
place.

**Why:** a schema change reaches one helper, not every test. The failure mode is
the opposite: dozens of files each writing their own `INSERT`, where a column
rename leaves half of them green and half red for no reason.

## Setup across boxes

A test is outside the runtime graph, so it may read another box's files to set
up its data. The exemption is **written down** where the structure guards read
the graph: the layers and boundaries guards name test files as exempt, and the
owned-writes guard names the helpers that write a table. A silent exception is
indistinguishable from a hole.

A test that reaches another box prefers its **fixture over its handler**.
Calling another box's handler as setup borrows behaviour the test is not about:
a change to that handler breaks tests that never meant to test it, and the test
stops saying what data it needs. The helper inserts the row the test names.

## Guards fail loudly

A guard is a test on a rule, not on behaviour. Its exceptions are a **known
list**: each entry names the violation and the reason it stays, and the guard
fails in both directions — a violation not on the list fails, and an entry that
no longer matches fails too. That is what makes the list shrink: the change that
fixes a violation removes its entry in the same commit.

**A test that can pass while the code is broken is not a test.** A guard asserts
the thing it names, not merely that the suite ran. A deliberate soft signal — a
size, an advisory, a measurement that should not fail a build — says so in its
header, so no one mistakes it for a guard.

**A guard is seen to fail before it is trusted.** When one is written, its
rule is broken on purpose once — an import across a door, a table with no
part, a route with no gate — and the failure is read: it names the file and
the rule, and says what to do instead. A guard that has never been seen to
fail has not been shown to work; it may be reading the wrong files, or a
result kept from an earlier run.

**Why:** an exception without a reason becomes the new rule, and a guard that
cannot fail is a comment. The structure guards themselves — layers, boundaries,
cycles, schema, owned writes and the rest — are in
[enforcement](../architecture/enforcement.md).
