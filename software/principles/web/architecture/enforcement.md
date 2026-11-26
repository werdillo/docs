# Enforcement

Write these the day the structure exists, and they will keep it:

| Test | Fails when |
|---|---|
| Layers | an import points the wrong way |
| Boundaries | a box reaches another by something other than its door — inside a group too |
| Cycles | two boxes reach each other (inside a group too), or a `shared` reaches a box |
| Commands | a box imports another box's command — a name in its `commands.ts`, which the door re-exports whole — anywhere outside `_processes/` |
| Schema | the latest migration snapshot and the models disagree |
| Cross-box keys | a foreign key points at another box's table |
| Foreign joins | a query joins tables owned by different boxes |
| Owned writes | a table is written by a file outside its owner — directly, through a re-export, or through a helper on the test's list |
| Table declarations | a table is declared by no part, by two parts, or with the same SQL name in two files |
| Public surface | an exported name is not on the promised list |
| Two halves | plain TypeScript imports a framework-only component or a file under `ui/` |
| Views *(behaviour guard)* | a list carries a field the list does not show, or a read returns a secret to a caller who may not write it (tested beside each box, not in `guards/`) |
| Same place | a box of one package sits at a different path in another |
| Access | a route no gate covers, or a public write with no limit |
| Mounts | a mounted router that does not carry its own gate, so moving it would leave its routes behind |
| Jobs | long work answers a request again instead of queueing a job |
| Kit usage | a screen file outside the UI kit holds a raw control or table, a text size on an HTML tag, an `!important` utility, a hand-typed page width or a direct colour utility ([screens](../ui/kit.md#the-kit-is-the-only-place-that-draws)) |
| Site | a built page lacks its head, an internal link misses, the sitemap drifts from the pages, a published address is lost, or a product UI lacks `noindex` ([site](../guards/site.md)) |

Each row is documented, with what its test checks and what it cannot see, in
[`guards/`](../guards/README.md).

They are the guardrails: few, where leaving the road is expensive. Everything
else in these documents is a signpost.

## The hardest test: owned writes

The rule is "only the owner writes its tables". The test is a static pass over
the source, not a runtime proxy, and whatever the tool, it does four things:

1. **Owners.** Every table declaration maps the table to the box whose file
   declares it.
2. **Names.** In every non-test file, each imported table is known by its name,
   so a door's re-export is the same table.
3. **Writes.** An insert, update or delete on that name is a write — and so is
   the table handed to a helper that writes it (a chunked insert, a soft
   delete), which the test lists by name.
4. **Verdict.** A write from a file outside the owner, or from any process,
   fails as `writer → owner.table`. A list of known violations may start it
   part-way, and only shrinks.

**What it does not see**, and what covers each:

- a helper that takes a table and is not on the test's list — a helper that
  writes a table it is handed is added to the list when it is written;
- raw SQL in a string — raw SQL lives in the owner's box; review holds it;
- a table reached as a property or by a computed name — the table is named at
  the write site; review holds it;
- a trigger that writes another table — a trigger lives in the owner's schema;
  one that writes another box's table is a review question.

It is a guardrail, not a proof: it catches the direct and the re-exported write,
and the rest is the rule plus review. How a project implements it is in the
project's conventions.
