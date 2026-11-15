# Contracts and refusals

## A contract lives once

A shape crossing a boundary — request, response, an event — is declared once and
imported by both sides. The consumer **parses** it rather than trusting it, so a
drift surfaces as a visible parse error instead of a silent `undefined`.

- Keep the contracts in one place that both sides depend on and that depends
  on almost nothing. In a monorepo that is the contracts package; in a single
  package it is a folder. Either way it is one declaration, imported by both
  sides ([`stack/`](../stack/README.md)).
- What belongs there: a shape **or a decision** more than one side must agree
  on. Two implementations of "is this allowed" drift, and take their error
  messages with them.
- **What comes in has a size before it has a shape.** A body, an upload, a
  list inside a request and a string field each have a maximum, checked
  before the content is parsed or stored; past it, the answer is a refusal
  with its code, not a slow parse or a row too large to show. The maximums
  are part of the contract, so the client knows them too.
- **A contract grows additively.** A reader is updated before a writer stops
  sending the old shape. What counts as a break is set out below.
- **A server names a record; the client decides where it opens.** An answer
  carries a record's kind and id, never a client's address, so moving a screen
  breaks no other package.

## A break is a removal, a rename or a changed type

- **A break** is a field removed, renamed, or whose type or meaning changes. An
  added optional field is never a break: a consumer ignores what it does not know.
- **A break moves the major version.** The consumer says which major it speaks,
  and the server answers that major's shape. A request that names no major is an
  old consumer, and gets the shape it was built against.
- **The previous major is answered for a stated window** after the next one
  ships. The window is written down with the change, and the old shape is removed
  when it closes, not before.

## A wire shape is grouped by meaning

A response view groups its fields by what they are about — a buyer, a delivery,
the totals — beside `id`, with the timestamps in `meta`. Aim for about nine or
ten top-level keys. Above ten is a warning, not a failure: a soft check in the
test suite prints it. A shape that stays large on purpose is listed in that
check with its reason, and an entry no longer above the signal fails, so the
list only shrinks ([how it is checked
here](../../conventions/contracts.md#a-record-is-flat-what-is-sent-is-grouped)).

A record that mirrors a table row stays flat, and is mapped to its view at the
edge by a function (`toXView`) written field by field, so a column added to a
table is sent to no one until someone says where it belongs. A request body is
laid out in the same groups where that reads better; one that mirrors the record
it writes whole stays as large as the record, and says why in `KEPT`. The layout
is in [the conventions](../../conventions/contracts.md#a-record-is-flat-what-is-sent-is-grouped).

## Say no with a value

A rule that can refuse answers with a **value** the type system sees — a success
or a refusal — not an exception. Exceptions are for failures nobody can act on.

- **Why:** a refusal is a normal outcome; making it a value means a caller
  cannot forget to handle it.

### The shape of a refusal

A refusal has one shape at every boundary, declared once in the contracts
package: a **`code`**, a **`message`** for a person, and the fields a form needs
(which field is wrong, the record's current version on a stale write). The
answer that carries it across a boundary adds a **correlation id**.

- **A client branches on `code`, never on `message`.** Codes are a closed list,
  lower_snake_case: a few by kind — `invalid`, `forbidden`, `not_found`,
  `conflict`, `stale` — and a specific one for every outcome a client must tell
  apart (`two_factor_required`, `out_of_stock`, `slot_taken`). A code is added,
  never renamed or reused; a message may change at any time.
- **`forbidden` never reveals a record.** It answers an action the caller may
  not take on what it may see; a record the caller may not see answers
  `not_found` ([absence and denial look the same](./access.md#fail-closed)).
- **The status is the edge's.** The value a rule returns carries no transport
  status; the boundary maps each code to one, so a rule never chooses between
  404 and 409 and the mapping lives in one table.
- **A guard's failure becomes a code where it is caught.** A guard inside a
  batch fails by raising; the one place that runs the batch turns its marker
  into the matching refusal, and nothing above it matches text.
- **Every request carries a correlation id** — taken from the caller when it
  sends a sane one, minted at the edge otherwise — on the answer, in the error
  body and on every log line, so one id joins a request to its answer.

