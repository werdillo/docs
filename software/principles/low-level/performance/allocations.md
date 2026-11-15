# Allocations

Memory is fixed before the work begins
([memory](../safety/memory.md#all-memory-is-fixed-before-the-work-begins)).
This page is the second question: how many pieces it is taken in, and how
that count is kept honest.

## Fewer allocations

The answer is as few as the design allows.

- **One allocation per structure, not per item.** A pool is one block of
  slots, not an allocation per slot; a struct of arrays is one block for all
  its fields — `std.MultiArrayList` allocates once — not one slice per field
  ([an example](../example/service.md#the-pool)).
- **Few structures, each large.** Several things with the same lifetime and
  the same count can share an allocation. Each allocation is a failure path
  at startup, an `errdefer`, a line in `deinit`, and a piece of memory the
  allocator has to place — fewer are simpler, start faster and fragment less.
- **No hidden allocations.** A standard-library call that takes an allocator
  allocates; one that takes a buffer does not. In the working path, the
  second kind: `std.Io.Writer.fixed` over the connection's buffer, not
  `std.fmt.allocPrint`; a list with its capacity set at startup and filled
  with `appendAssumeCapacity`, not one that grows.
- **The count is a number in a test.** A test counts what `init` allocates,
  with `std.testing.FailingAllocator`, and asserts it; a new allocation is
  then a decision someone makes in review
  ([an example](../example/service-tests.md#how-many-allocations)).
- **Where the design truly needs allocation while it works**, it is an
  arena or a fixed buffer per job, reset when the job ends — one allocation
  at startup, many cheap ones inside it, none returned to the system
  ([memory](../safety/memory.md#all-memory-is-fixed-before-the-work-begins)).
