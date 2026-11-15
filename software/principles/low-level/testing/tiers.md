# The tiers

Each tier guards one edge, and no tier re-tests the one below it.

## Unit

**Guards:** one function's decisions.

A `test` block beside the function, named for the function and for what it
shows. It covers the valid cases, each error the function names, and the
edge between them:

```zig
test "parse_range: the valid, the invalid, and the edge between them" {
    const expectEqual = std.testing.expectEqual;
    const expectError = std.testing.expectError;

    try expectEqual(Range{ .offset = 0, .size = 100 }, try parse_range("bytes=0-99", 100));
    try expectEqual(Range{ .offset = 99, .size = 1 }, try parse_range("bytes=99-", 100));
    try expectEqual(Range{ .offset = 10, .size = 90 }, try parse_range("bytes=10-5000", 100));

    try expectError(error.RangeUnsatisfiable, parse_range("bytes=100-", 100));
    try expectError(error.RangeMalformed, parse_range("bytes=5-4", 100));
    try expectError(error.RangeMalformed, parse_range("", 100));
}
```

- **Tests use the testing allocator**, which fails the test on a leak or a
  double free.
- **A box is built small.** Its limits are arguments, so a test makes a pool
  of two slots and fills it in three lines.
- **Initialisation is tested against failing allocation**:

  ```zig
  test "Pool: init leaks nothing when an allocation fails" {
      try std.testing.checkAllAllocationFailures(std.testing.allocator, init_and_deinit, .{});
  }
  ```

**Cannot see:** what happens when functions meet, and any input nobody
thought of.

## Random

**Guards:** one box under input nobody wrote down.

A loop that generates inputs from a seed, drives a box with them, and lets
the box's own assertions say whether it is still correct. Where a simple
model of the box exists — a hash map for a cache, a plain array for a pool —
the test runs both and compares.

- **The generator is shaped like the input.** Uniform random bytes are
  rejected at the first check and test nothing after it. A good generator
  makes mostly-valid input with one thing wrong, and swarms: each run turns
  some kinds of operation off entirely, so that rare combinations get their
  turn.
- **The loop is bounded** by a number of rounds, like any other loop.
- **A failure prints the seed**, and the seed alone reproduces it.
- **The oracle is the assertions.** A box with few assertions gets little
  from this tier; that is the strongest practical argument for writing them
  ([what an assertion is for](../safety/assertions.md#what-an-assertion-is-for)).

A random test proves the presence of bugs, not their absence. It comes after
the understanding, not in place of it.

### The fuzzer

Zig has a coverage-guided fuzzer built in. A test hands it a function of one
input; under `zig build test` the function runs on the corpus, and under
`zig build test --fuzz` the fuzzer mutates inputs and keeps those that reach
new code. It finds what a hand-shaped generator would not think to make.

```zig
test "parse_request: fuzzed" {
    try std.testing.fuzz({}, parse_request_fuzz_one, .{ .corpus = &.{
        "GET /video/intro.mp4 HTTP/1.1\r\nRange: bytes=0-99\r\n\r\n",
        "HEAD /a HTTP/1.1\r\n\r\n",
    } });
}

/// One input from the fuzzer. The oracle is the parser's own assertions, and one property.
fn parse_request_fuzz_one(_: void, smith: *std.testing.Smith) anyerror!void {
    var buffer: [limits.request_buffer_size]u8 = undefined;
    const size = smith.slice(&buffer);
    var request: Request = undefined;
    const parsed = parse_request(&request, buffer[0..size]) catch return;
    if (parsed != null) try std.testing.expect(request.head_size <= size);
}
```

- **The corpus is a few valid inputs**, so mutation starts from the shape of
  the real thing rather than from noise.
- **The oracle is the same**: the assertions inside, and a property of the
  result. A parser with few assertions gets little from a fuzzer.
- **A run has a bound**: `--fuzz=20K` stops after twenty thousand runs.
  The fuzzer is for a parser at the boundary — a request, a frame, a file
  format — where the input is the outside's and can be anything; a box's
  logic is better served by a shaped generator and a model.

**Cannot see:** faults in the world, and time.

## Simulation

**Guards:** the whole program, when the world misbehaves.

The real boxes, wired by a second composition root that hands them a
simulated world: a clock, and a network and a disk for a service, or a board
for firmware. The simulation owns time: nothing waits,
so hours of timeouts pass in seconds. And it owns failure — on a seeded
schedule it makes the world do what the world does:

- a connection that sends one byte and stops;
- a client that reads slower than it asked to be sent;
- a read that returns less than was asked for, or an error;
- a file that changes size mid-response;
- more connections than the pool holds, all at once;
- on a board: a sensor that returns noise or nothing, a bus that times out,
  interrupts that arrive faster than the loop drains them.

What it checks is what must hold however the world behaves: no assertion
breaks, the allocator stays locked, every connection is eventually released,
the counters add up, and a well-behaved client still gets the right bytes
while its neighbours misbehave.

It is the tier that is expensive to build and it is built early, because the
I/O interface it needs shapes every box. A program whose boxes call the
kernel directly cannot have this tier added later without rewriting them.

**Cannot see:** whether the real kernel behaves as the simulated one does.

## Live

**Guards:** the boundary with the real system.

A few tests that start the real program on a real port and a real directory
and talk to it as a client would — or, for firmware, flash it to a real board
and drive it from the host: hardware in the loop. They check only what the simulation had to
assume: that the system calls are used correctly, that a file really reaches
a socket intact, that the limits the program was given are ones the machine
grants.

It is small on purpose. A decision already proven by a unit test is not
checked again through a socket.

**Cannot see:** rare timings — it sees the ones that happened to occur.

## Benchmarks are not a tier

A benchmark measures and a test decides. A benchmark lives beside the code
with its budget ([a claim is a number](../performance/measuring.md#a-claim-is-a-number))
and has its own command, because its answer depends on the machine and a
gate must not.
