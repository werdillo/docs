# A service

A long-running process under an operating system. The rules were first
written for this kind, and most examples in the other documents are a
service — the [example](../example/README.md) is one, whole.

## Memory

All of it is allocated in `main`, sized from the limits, and the allocator
is locked before the first request
([the allocator is locked](../safety/memory.md#the-allocator-is-locked)).
What the OS adds — the page cache, socket buffers — is outside the program's
count, and the sketch names it separately.

## The main loop

One event loop over the OS's readiness or completion queue. Each turn takes a
bounded batch of events and does a bounded batch of each kind of work
([its own pace](../safety/control-flow.md#the-program-runs-at-its-own-pace)).
A connection is a slot in a pool, and a full pool is the answer to overload:
the listener stops accepting and the kernel's backlog refuses the rest.

- **Fail closed on protocol boundaries.** An unknown frame type, unexpected
  flag or failed check always returns an operating refusal and never falls
  through to a permissive default.
- **Mutating commands are idempotent under retry.** A client that reconnects
  after a dropped reply carries an idempotency key or sequence number so the
  service never applies the same mutation twice.

## Durability on disk

A service that keeps state on disk — a storage engine, a queue, a ledger —
treats power loss and partial writes as ordinary operating errors, just as
firmware treats flash ([settings in flash](./firmware.md#settings-in-flash)):

- **Checksum every persisted record** in pairs: compute on write, verify on
  read before trusting any field ([boundaries](../safety/boundaries.md)).
- **Atomic replacement for whole files:** write to a temporary file in the same
  directory, call `fsync` on the file, `rename` over the target, then `fsync`
  the parent directory. A crash mid-write leaves the previous file intact.
- **Write-ahead logs (WAL) for append-only state:** flush and `fsync` the log
  batch before acknowledging the write to the caller; on startup, replay up to
  the last record whose checksum holds and truncate any torn tail.
- **Failing disk calls are operating errors**, never assertions: count the
  failure, refuse new writes cleanly, and keep the in-memory state consistent
  with what actually reached disk.

## Signals and shutdown

OS signals interrupt execution asynchronously like hardware interrupts, so the
same rule applies: record and return.

- **Ignore `SIGPIPE` at startup** so writing to a peer that closed its socket
  returns `error.BrokenPipe` instead of killing the process.
- **A signal handler sets one atomic flag and returns.** `SIGTERM` and `SIGINT`
  store `.stopping` in a single `std.atomic.Value(bool)` (`.release`); they
  never log, allocate, close sockets or call into boxes.
- **Bounded graceful drain in the main loop.** When `.stopping` is observed,
  the loop stops accepting new connections, drains in-flight work up to a named
  `shutdown_timeout_ms_max` limit from `limits`, flushes durable state, frees
  startup allocations cleanly in debug/test builds, and exits.

## What a crash does

An assertion stops the process. A supervisor — the init system, a container
runtime — restarts it, and the restart is fast because startup is only
allocation and wiring. A crash is reported by the supervisor's log and a
counter, so that a rate of crashes is a number like any other.

## Its tests

The simulation is the tier this kind gains most from: the whole service
against a simulated clock, network and disk, with faults injected
([simulation](../testing/tiers.md#simulation)). The live tier is a real
process on a real port.

## Its open questions

Several cores, TLS, work that blocks, and what an operator sees
([not decided yet](../open-questions.md)).
