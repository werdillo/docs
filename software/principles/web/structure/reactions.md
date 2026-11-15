# A reaction that must not undo the write

A process is not the only way one box learns what another did. Three mechanisms,
chosen by what must happen when the second one fails:

| The second box… | Mechanism | When it runs |
|---|---|---|
| is part of the same decision | a step in the process | in the batch |
| sends something to a person | a message in the notification outbox | after the commit |
| reacts inside the system, and its failure must not undo the write | an event in the event outbox, handled by a job | after the commit |

The third is for loyalty points, a search index, a read model — a reaction that
must not make the sale fail. The box that owns the fact writes the event in the
same batch as the fact: `queueEvent(db, orderPlaced(order))` is one more
statement, so the event and the order land together or not at all. A box that
reacts declares it in its part: one entry per event, with the event and the
handler — `{ event: ORDER_PLACED, handle: onOrderPlaced }`. Its `reacts` is a
registry, filled by the parts at startup, as search's sources are. At its full
size, the outbox is a box in `features` (or the lowest `shared` both sides
reach), because it owns the events table and the delivery state, and neither
side imports the other. A job delivers due events after the commit: at least
once, retried with backoff, dead-lettered; the handler is idempotent by the
event's id, writing its marker with its effect in one batch. A failed reaction leaves the sale alone — it is
already committed — and is retried or parked. A direct call is not this: it runs
in the caller's request, and its failure is the caller's failure.

**A job table is an outbox at the smallest size.** The event is the job's
input, the handler is its step, and the job's row is its delivery state. One
job kind per reaction (or per family of reasons) is enough until several boxes
react to the same facts; the `reacts` registry is what makes one outbox serve
them all. The rule is the same at both sizes: the event is written with the
write, handled after it, and retried.

What a consumer may count on, and what it may not:

- **No order.** Delivery is at least once and may repeat or reorder events of
  one record. A handler is correct in any order: its effect does not depend on
  order (adding an order's points), or it compares a version the event carries
  and ignores an older one (setting a status).
- **Not at once.** An event is handled when the delivery job next runs; on this
  stack a cron runs it every minute, so a reaction lands a minute or two after
  the write. What the person who made the write must see in the answer is not
  an event: it is a step in the process.

The event's shape is a contract: in the contracts package when the producer and
the consumer are in different domains or packages, in the lowest `shared` when
they are in one matrix
([a contract lives once](../architecture/contracts.md#a-contract-lives-once)).

**Two outboxes, one shape.** The notification outbox
([the shop's receipt](../example/processes.md#6-the-receipt-a-message-queued-with-the-order))
and the event outbox are the same mechanism — written in the batch, delivered
after the commit, at least once, retried, parked. They are two boxes because
what they deliver to differs, and so does what each keeps: a notification goes
to a provider and a person, and keeps its template, its channel and the
provider's answer, which staff read and queue again; an event goes to handlers
inside the system, and the outbox keeps the event and its attempts while each
handler keeps its own marker. One table for both would hold the columns of each
and the states of neither.
