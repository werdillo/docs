# Schema

**The rule.** The schema is the models moved forward by migrations
([the principles](../rules.md), rule 37). A change to a model is a numbered
migration, written as the diff from the previous snapshot; the first migration
is the frozen baseline and is never regenerated. A model changed without its
migration fails here, not as a missing column at run time. The commands that
write migrations are in the project's conventions — API.

## What it checks

Two schemas: the one the stored migrations lead to (the latest snapshot the
generator wrote), and the one the models describe now. They must be equal once
their random ids are set aside. The snapshot is the generator's own output, so
the database the tests and the deploy create is the one the code describes.

## The failure

The two differ; the message names the command that writes the missing
migration. There is no list of exceptions: a model change ships with its migration.

## Two branches, one number

Two branches that each add a migration both take the next number. The branch
merged second drops its migration file and its snapshot, then generates the
migration again on top of the first, from the merged models. That is safe only
while no database has run the file. Once one has, the file and its snapshot are
frozen and are never renumbered.

## The template

The guard is the latest stored snapshot against the models, ids aside — the
message names the command that writes the migration:

```ts
assertEquals(sameSchema(latest.snapshot, await modelSnapshot(latest.snapshot)), true, "… run the migration command with a name");
```

## What it cannot see

- **A migration that is wrong while the snapshot is right.** A second test applies
  every migration in order to an empty database and compares it with the models;
  a hand-written migration that drifts from the snapshot is caught there, not by
  this guard.
- **A database that was never generated** — an empty file and an empty model set
  agree; the first table is what makes the guard real.
- **A query that assumes a column neither the model nor the file has.** The
  guard proves the file matches the models, not that the code matches either.
