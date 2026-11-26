# Writes

**The rule.** Only the owner writes its tables, and a box's data is reached by
id, never by a foreign key or a join across boxes
([a box owns its data](../architecture/data.md#a-box-owns-its-data-between-boxes-reference-by-id);
[the principles](../rules.md), rule 8). Three guards hold the data edges, and
a fourth holds who declares a table.

## No foreign key

A file that declares a table with a key (a reference or a foreign-key call) may
import only from its own box. Between boxes a table holds the other's **id**,
never a foreign key, so the database carries no dependency the import tests
cannot see.

The check is on the file, not the column: if the file names a foreign key at
all, every import it makes must resolve inside its own box. It over-reports
a file that declares a key and imports a neighbour's table for an unrelated
reason — split the file. The alternative is a parser that knows which column
points where, and the import is the fact that matters.

Failure: `file → specifier`.

## No foreign join

A query never joins across boxes. The guard reads every join call and the
nearest source call before it, maps both local names to their tables (an import,
an alias, or a declaration in the file), maps each table to its owner, and fails
when the two owners differ. Both sides are resolved, so a table imported through
a door is the same table as the one declared in its model.

Failure: `file: owner.left ⋈ owner.right`.

```ts
for (const [left, right] of joins(source)) {
  const leftOwner = owners.get(tables.get(left) ?? left);
  const rightOwner = owners.get(tables.get(right) ?? right);
  if (!leftOwner || !rightOwner || leftOwner === rightOwner) continue;
  const pair = [`${leftOwner}.${left}`, `${rightOwner}.${right}`].sort().join(" ⋈ ");
  violations.add(`${rel}: ${pair}`);
}
```

An answer that needs several boxes reads each and joins in memory — in the box
that owns the answer, or in a process ([processes](../structure/processes.md)).

## No foreign write

Only the owner writes its tables. Owners come from each table declaration; a
table is known **by its name**, so a door's re-export is the same table. A write
is a statement on that name — an insert, an update or a delete call, a chunked
insert helper, a soft delete or restore helper, or — in a file that uses the
shared crud helpers — the table a cleanup config names. A process owns no table
and writes none: it gets statements from the boxes.

The write pattern, trimmed. A dependency entry in a cleanup config names a table
only to check that it exists, so it is a read.

```ts
function writePattern(local: string, cleanupFile: boolean): RegExp {
  return new RegExp(
    `(?:\\.(?:insert|update|delete)\\(\\s*${escapeRegExp(local)}\\b` +
    `|insertChunked\\(\\s*db\\s*,\\s*${escapeRegExp(local)}\\b` +
    // The shared helpers take the table as an argument: a soft delete,
    // a restore, and the table of a cleanup config write it too. A
    // dependency entry names a table only to check it exists (`id:`/`what:`,
    // not `where:`), so it is a read.
    (cleanupFile
      ? `|(?:softDelete|restoreSoft)\\(\\s*${escapeRegExp(local)}\\b` +
        `|\\btable:\\s*${escapeRegExp(local)}\\s*,(?!\\s*(?:id|what)\\s*:)`
      : "") +
    `)`,
  );
}
```

**A table held in a variable is the same table.** An object's `table: products`,
destructured later as `{ table }`, or `const x = products`: the guard follows the
binding and treats every table the name can stand for as written. One name may
stand for several tables when it is a list's field.

```ts
for (const [local, tables] of tableHolders(source, owners)) {
  if (!writePattern(local, cleanupFile).test(source)) continue;
  for (const table of tables) {
    const owner = owners.get(table)!;
    if (processOf(rel) || owner !== writer) found.add(`${writer} → ${owner}.${table}`);
  }
}
```

Failure: `writer → owner.table`. The list of known violations only shrinks, and
an entry with a domain on either side may not be listed at all — a domain is
checked strictly ([the hardest test](../architecture/enforcement.md#the-hardest-test-owned-writes)).
What the write pass cannot see is there too.

## Every table declared by one part

The install step learns a box's tables from its part. So every table declared by
a domain — or by any other layer that owns data, such as `features` — is listed
by exactly one part:

- **undeclared** — a table no part lists is owned by nothing: no project
  cleanup, no backup, no erase.
- **declared twice** — a table two parts list is owned twice, and a cleanup or
  an export runs it twice.
- **source twice** — the same SQL name declared in two files.

Failure: the three lists, each asserted empty.

## What it cannot see

- **Raw SQL in a string.** It lives in the owner's box; review holds it.
- **A table reached as a property or by a computed name.** The table is named at
  the write site; review holds it.
- **A trigger that writes another table.** A trigger lives in the owner's
  schema; one that writes another box's table is a review question.
- **A helper that takes a table and is not on the list.** It joins the list when
  it is written; until then it is a hole.
- **A join in raw SQL or a subquery** — the join guard reads the query builder's
  chain, not SQL text.
- **A table declared without a name string** — the owner-parts rule reads the
  declaration's name argument.
