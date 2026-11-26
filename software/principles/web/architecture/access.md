# Access and views

## Fail closed

- **The owner of the data decides access**, at the boundary, once — not at each
  call site.
- **Every read is scoped** to its tenant, so a bare id cannot reach another's
  row.
- **Absence and denial look the same:** a foreign record reads as "not found",
  so a "no" does not reveal that it exists.
- **A secret is writer-only.** A read returns a type, a count or a mask; the
  value goes only to a caller who may write the record that holds it. A list
  never carries it — the value belongs to the detail a writer opens; history,
  export and backup require write because restore needs the value.
- **Secrets are compared in constant time and redacted from logs.** Webhook
  signatures, API keys and opaque tokens are checked with a constant-time
  comparison (`timingSafeEqual`), never `===`; loggers and error serializers
  redact tokens and credentials by default so a secret never reaches a log line
  or response body.
- **Every public write is limited.** An unthrottled public write is a way to
  take a service down from a laptop.
- **A gate belongs to the router that is mounted.** A router mounted outside its
  gated parent carries its own gate, so the gate travels with the router rather
  than the prefix it happens to sit under; the mount audit proves each mounted
  router's own table is covered
  ([gates](../guards/gates.md#a-gate-belongs-to-the-router-that-is-mounted)).
- **An act on the whole tenant asks the highest level.** Restoring or importing
  everything, connecting an integration, issuing a token: these need the
  tenant's admin level, not write on one section; what touches one section stays
  with that section's grant. A token or export never reaches further than the
  person who makes it.

## Roles are named maps; grants are the check

A role is a named access map the organisation keeps. It is a way to write grants
in bulk, not a second check: the gate reads only the per-section grants
(the project's conventions — architecture).

- **Assigning a role** writes its map as the member's sections on the project,
  and records the role beside them. The record exists only while the role is held.
- **Editing a role** rewrites the grants of every holder in the batch that
  changes the role.
- **A hand edit** of a member's sections forgets the role, so the member shows as
  "Custom". The record must say what the grants are.
- **An invitation** carries a role or a map, never both, and applies it when the
  invitee sets a password, not when it is sent.

## A reader sees a view, never a row

Build what a reader gets **field by field**, so a column added later stays
private until someone decides it belongs. A stored row is the whole record; an
answer — public or admin — is a chosen subset of it.

**A list is a view of a row, not the row.** A list endpoint returns what a
person scans by; a detail endpoint returns the full shape its reader needs.
Sharing one shape between a list and an editor makes every list carry the
editor's payload, including fields no list screen reads. A paged list answers
`{ data, meta }`; a list small enough to send whole answers `{ data }`. A caller
that needs every page follows `meta`, never assumes one page is the table.

**A view is grouped.** Its top level gathers what a reader sees by subject —
`id`, `meta`, and the business blocks (`buyer`, `delivery`, `totals`) — and aims
for **about 9–10 keys**: `id`, `meta` and up to eight groups. A record may be
flat inside, as a table's row is; on the wire it is never flat. A top level past
9–10 is a sign that a group is missing, not that the answer is large.

This is a **soft signal**: a shape above the range is reported, not enforced. It
is not a guardrail, and no test fails on it.
