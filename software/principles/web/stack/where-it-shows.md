# Where the stack shows through

The architecture is stated without tools, but two of its shapes come from the
stack: a database without interactive transactions, and a request with a
budget. On another stack the rule stays; the shape may not.

- **The transaction is a batch.** Some databases have no interactive
  transaction: a batch of statements prepared in advance runs as one, and
  nothing inside it can read a value and decide. So a write that must not
  half-apply reads first; a condition that must still hold at write time is a
  guard statement that fails the whole batch ([how a guard works](#how-a-guard-works));
  and a failed guard is retried from fresh reads. That is why a box hands a
  process the *statements* of its step instead of running them
  ([processes](../structure/processes.md#how-it-works)), and why a message queued
  with a write is one more statement in the batch. With interactive
  transactions the reads could sit inside; the rule — one transaction, its
  guards inside it — would not change. The cost is in the doors: a box that
  exports statements exports its data layer's type with them, so a change of
  database reaches the doors, not only the models.
- **A request has a budget.** On a platform where each query is a round trip
  and one invocation may make only so many, "one read per page, never one per
  row" ([`architecture/data.md`](../architecture/data.md#atomic-writes-are-one-transaction-racing-writes-are-versioned))
  keeps a list page inside it.

The door — a box's index file — is TypeScript's shape of a rule every language
has; the door rule says what it is elsewhere
([`architecture/doors.md`](../architecture/doors.md#boxes-meet-through-their-doors)).

## How a guard works

A batch cannot branch, so a condition that must still hold when the write lands
is a statement placed before it. SQLite has no `RAISE` outside a trigger, but an
invalid JSON path does raise, and its message carries the path:

```sql
SELECT CASE
  WHEN NOT (<condition>) THEN json_extract('{}', '$CART_CLOSED')
END
```

If the condition holds, the `THEN` branch is not evaluated and the statement
returns a `NULL`. If it fails, the path is invalid, the statement raises, the
batch is rolled back, and the message carries the path. The caller looks for a
marker, an upper-case token no ordinary message contains, **as a substring** of
the message — never the whole text, whose wording belongs to the engine and may
differ between builds. A batch stops at the first guard that fails; the marker,
not the statement order, tells the caller which condition refused.

Two things the guard relies on are engine behaviour rather than a documented
promise: that an invalid path raises, and that a `CASE` branch not taken is not
evaluated. Both are pinned by a test on D1 itself, which runs with the checks,
so a change of engine fails there ([how this repository tests it](../../conventions/stack.md#the-guard-on-d1)).

The read before the batch decides what to try; the guard decides whether it
lands. The two are not interchangeable: a guard is an invariant at write time,
not a second read. What the read fixes — a price, a set of lines, a product that
exists — stays as it was read unless a guard says otherwise.
