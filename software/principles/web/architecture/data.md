# Data and long work

## Atomic writes are one transaction; racing writes are versioned

On a server the unit is the transaction below; a front end writes through one
call into it, never a half-update of its own.

- A multi-statement write that must not half-apply goes through **one
  transaction**. A guard that must hold at write time is a statement *inside*
  it, not a read before it.
- A write that can race carries **the version it read**; a mismatch is a
  distinct answer (a conflict), not a silent overwrite. A race the write named
  as retriable is the same batch run again on a rebuilt plan; when the retries
  run out, it is that answer.
- **A write that reaches outside the database answers for it.** A step that
  writes and then calls beyond the database — a provider, a webhook, a host —
  carries the compensation for that call's failure as statements like any
  other: owned by the writer, guarded by a condition, run next to the write.
  It runs even when the step then refuses: a refusal is an answer, not a
  reason to leave the row behind. An exception is for failures nobody can act
  on, and the compensation still runs before it is thrown.
- **One read per page, never one per row** — collect ids, read together, join
  in memory. Each read is a round trip; a page of fifty rows must not be fifty
  of them.

On this stack the transaction is a batch of statements prepared in advance, and
nothing inside it can read a value and decide. That is why a write reads first,
carries its guards as statements, and why a box hands a process the
*statements* of its step rather than running them —
[`stack/where-it-shows.md`](../stack/where-it-shows.md#where-the-stack-shows-through).

## A box owns its data; between boxes, reference by id

In code the boxes are separated by imports. On a server the data they own is
tables in one schema, and a foreign key or a join from one box's table to
another's is a **dependency no import test can see**. On a front end the same
rule is about state: a box owns the state it holds, and another box holds an id
or asks through the door, never a second source of truth for it.

- **On a server, inside a box**, foreign keys and joins are free.
- **Only the owner writes its data.** On a server that means its tables: a door
  may export a table so others can read it; a write to it — from a process or
  a plug — is a statement the owner exports and the caller runs.
- **On a server, between boxes**, a table holds the other box's **id**, never a
  foreign key to it, and a query never joins across boxes. An answer that needs several
  boxes reads each and joins in memory — in the box that owns the answer, or in
  a process ([processes](../structure/processes.md)).
- **Where history matters, freeze a copy** — an order freezes its lines rather
  than pointing at a product that may change.
- **Nothing cascades between boxes.** Deleting a row deletes that row, and a
  box that holds its id meets the absence when it reads. What the absence
  means is that box's decision, made on purpose: a list **leaves it out** (a
  wishlist of products), a step that acts on it **refuses and names it**
  (placing an order with a product that is gone — so the holder keeps a name
  to show), and what must not lose it **froze a copy** (the order's lines).
- **Soft delete is a state, erasure is a write, dropping a box is a migration.**
  A soft-deleted row is still the owner's row; the owner decides which reads see
  it, and other boxes see only the owner's view. Erasing personal data is a
  write by the owner that removes or rewrites the fields and keeps the row and
  its id. Dropping a box is: remove its part from the domain's list, drop its
  tables (a migration that drops them),
  delete its folders in every package, and remove its plugs; the ids other
  boxes hold become absences, and each box already knows what its absence
  means. A frozen copy is a copy too: the box that owns it
  erases it as well.
- **Deleting a whole tenant** is the one delete that spans boxes: each box's
  part declares the tables it owns, and their rows are erased by the tenant's
  id ([the seam](./seams.md#invert-the-dependency-at-a-seam)).
- **Every box declares the personal data it keeps.** Its part's `personal` field
  names what a person's export reads (`find`) and what their erasure writes
  (`erase`), and a record kept on purpose says so. A column that names a person
  and sits in no declared table fails the column walk, so a new box cannot keep a
  name or an email that no export or erasure reaches
  (the project's conventions — architecture).

## One meaning, one name, one field

A field is read far more often than it is written, by people who did not
design it. Its name is the only documentation they are sure to see.

- **One meaning has one name everywhere** — in every table, in the wire shape,
  on every front end. Two names for one thing make a reader wonder what the
  difference is; there is none to find.
- **One name has one meaning.** A bare name that two boxes mean differently
  (`status` for an order and for a payment) is qualified in both, so neither
  has to be read in context.
- **One question has one field.** Two fields that together decide one thing —
  a status *and* an on/off switch that must both say yes before a customer sees
  a record — are two places to forget. The record keeps one, and what the other
  meant becomes one of its values.
- **The names come from a short fixed list** for what every box has: an order
  among siblings, an on/off switch, a moment, who did it, which variety. The
  list is written down once (in the project's conventions — docs and naming),
  so a new table takes its words from it rather than inventing near-synonyms.
- **A rename moves the data**, never drops it: the migration renames the column,
  and anything a value must become on the way is a data step in the same
  migration.

## Long work is a job, never a request

Work that outlives a request — an import, a mailing, an export, a call to a slow
third party — is a **job**. A request answers quickly; the job runs in the
background and records its result. A job is **idempotent** (it may run twice) and
**retried with backoff**, and one that keeps failing goes to a **dead letter**
rather than retrying forever. An event written with a transaction and delivered
after it goes through the event outbox, and its delivery is a job like any
other
([a reaction that must not undo the
write](../structure/reactions.md#a-reaction-that-must-not-undo-the-write)).

**Timed work is declared by its owner.** Work that runs on a clock — a sweep, a
reminder, a due publish, polling a third party — is declared in the part of the
box or process that owns it: a name, what to run, and what must run first. The
clock belongs to the composition root, which runs what the parts declare and
names no box; one entry failing is logged and does not stop the others.

## A log line is one structured record

A log line is one structured record: a level, a named event, the request's
correlation id and the tenant, and fields — never a secret or a person's data.
Errors are logged once, where they are handled.
