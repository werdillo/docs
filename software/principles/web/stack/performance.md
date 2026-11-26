# Performance

Most of a request's time goes on waiting for something else, such as the
database, another service or the next request in a chain. Almost none of it goes
on the code's own work. Code is written so that this waiting is small from the
start.

Speed is never bought with the readability or reliability of the code. A rule
here that costs either is broken on purpose, and a sentence beside the code says
why.

## The cost model

| Cost | What makes it grow | The rule against it |
|---|---|---|
| **Round trips** | A query per item, or awaits that run one after another | Read in sets, and send independent reads together |
| **Rows read** | A scan where an index can serve, or a read with no bound | An index behind every hot filter, and a limit on every list |
| **Bytes** | Whole rows read where a few columns would do | Select what the caller uses |
| **Repeated work** | The same lookup made twice in one request | Compute once per request, and pass it down |
| **Client weight** | Code a screen does not need, loaded up front | Load per screen, and load heavy parts on demand |

A managed database bills by rows read and answers over the network. That makes
round trips and rows read the two costs that count first.

## What the architecture asks

Isolated boxes make each round trip visible: a box reads only its own data, and
reaches a neighbour's through a door. Written one record at a time, that becomes
a query per item. Written for sets, it costs no more than a join would. Five
rules keep it the second way.

1. **A door reads a set.** A query a door exports takes a list of ids and returns
   a map by id. One record is the same call with a list of one. A loop over a
   door is then a mistake that is easy to see, not the natural way to write it.
2. **A process reads in waves, then writes once.** First it sends the reads that
   do not depend on each other, together. Then it sends the reads that need
   their results. Last, all the boxes' statements go as one batch. The number
   of waves is the latency, and a process keeps it to what the data truly needs.
3. **What a request shares is read once, at the door.** The caller, their grants
   and the project's settings are read by the first layer that needs them, and
   put on the request's context. A box below takes them from there and never
   reads them again.
4. **A hot read across boxes gets a read model, not a join.** When a screen
   reads several boxes on every request and the waves become the cost, a box of
   its own keeps the combined view. It is fed by the boxes' events after their
   writes commit. Until then, a process assembles it from set-reading doors.
5. **A door states its cost.** A door, or a process, that a list or a hot path
   calls has a test against a real database. The test counts its statements for
   a set of N and asserts a number that does not grow with N.

## On the server

- **No query inside a loop.** A view of many rows reads each related table once,
  for the whole set: `WHERE id IN (…)` or a join inside the box. Then it
  assembles the rows in memory. A view of one row is the same code run on a set
  of one, so the two cannot drift.
- **Independent reads go together.** Two reads that do not depend on each other
  run in parallel, or in one batch. An `await` that waits for a value it never
  uses is a waterfall.
- **A list built from data is sliced.** An engine caps how many values one
  statement can bind. An `IN (…)` over a list that grows with the data is
  therefore sent in slices below that cap. Such a list works in development and
  fails the day the data grows.
- **Every list has a bound.** A list endpoint takes a page and a limit, and has
  a maximum. No read returns "all of them" unless the set is bounded by nature,
  such as a project's languages. A count is taken in SQL, not by reading the rows.
- **Every hot filter has an index.** The columns of a frequent `WHERE` and
  `ORDER BY` lead an index, tenant column first. A function applied to an indexed
  column hides the column from its index. So a value is stored in the form it is
  compared in, such as an email lower-cased on write. Where that cannot be done,
  the index is built on the same expression. A new query on a growing table has
  its plan read once.
- **Select what the caller uses.** A list does not read the large columns, such
  as rich text, JSON documents or images, that only the detail view shows.
- **Per request, once.** The caller's identity, grants and the project's
  settings are read once, at the door, and handed down on the request's context.
  A handler does not read them again. A value derived from them that only some
  paths need is computed lazily, and at most once.
- **One aggregate query, not a query per group.** Counts and sums per group come
  from one `GROUP BY`. Where each group needs its own condition, as in facets
  that exclude their own filter, the statements go in one batch.
- **Writes that belong together go in one batch.** One batch is one round trip
  and one transaction. A write per line, sent one at a time, is neither.

## On the client

- **Load per screen.** Each screen is its own chunk, loaded when it is opened.
  A large library, such as an editor, drag and drop or an icon set, is loaded by
  the screens that use it, when they use it.
- **No request waterfalls.** What a screen reads from its address starts
  together. A request waits only for a value it needs from another.
- **Page what can grow.** A screen whose list grows with the data reads one page
  from the server, and keeps the page in the address. Where a screen truly needs
  the whole set, it reads the largest page the server allows and fetches the
  rest in parallel, with a small cap on how many requests run at once.
- **Keep what is drawn while the next loads.** A move to another screen waits
  for that screen's first data, and the previous screen stays until it lands. A
  wait past a short delay is shown as a thin progress mark, never as a blank.
- **Start the work on intent.** A link that is pointed at or focused starts the
  work of the screen behind it, once per target. A control that destroys data is
  never started this way.
- **Return to the last data at once.** A screen that was just read is drawn from
  what was kept for it, and asked again behind the drawing. A refresh that follows
  a write asks the server, not what was kept.
- **Read reference data once.** Small lists that every screen uses, such as
  languages, categories and types, are read once per session and refreshed when
  they change. They are not re-read on every navigation.
- **Refresh what is shown.** After a write, the screen refreshes the data it
  draws, not a larger set that nothing on screen reads.
- **No quadratic work in a render.** A lookup inside a loop uses a map built
  once, outside the loop.
- **Public pages ship no editing code.** A visitor gets the page and the little
  script it needs. Tooling for editors loads only in an editing session.
- **Images are sized.** An image is requested at the width it is shown at, with
  its dimensions given so the layout does not move, and below the fold it loads
  lazily.

## Caching

A response is cached only where staleness is a decision someone has made. How
long a guest may see an old price or old stock is a business answer, not a
technical one. For example, if the business sets that window at one minute, a
shared response is cached for up to a minute and no longer than that window is
promised; a response that depends on the visitor is never cached. The rule that
puts each read on one side is in the project's conventions — API.

## How it is checked

- A test that runs against a real database counts statements where the count is
  the point. For example, a page of N costs no more than a fixed number of
  queries. Such a test fails when a loop of queries comes back.
- A query that relies on an index has its plan read when it is written, and
  again when it changes.
- The engine's own limits are tested past their edge. A test passes more values
  than one statement can bind, so the slicing is proven.
- The client's bundle is measured when a dependency is added. A library that
  lands in the first load needs a reason.
