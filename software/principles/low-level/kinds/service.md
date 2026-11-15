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
