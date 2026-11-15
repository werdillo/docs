# The service's tests

Twenty-six tests in seven modules: one per box, the simulation and the guards. They run
in debug and in the safe mode, with one command
([the tiers](../testing/tiers.md)).

## Unit

Each function's decisions: the valid case, every error it names, and each
limit at its edge and one past it.

```zig
test "parse_path: what is inside the root, and every way out of it" {
    var path: Path = undefined;
    try parse_path(&path, "/video/intro.mp4");
    try std.testing.expectEqualStrings("/video/intro.mp4", path.slice());

    const expectError = std.testing.expectError;
    try expectError(error.PathInvalid, parse_path(&path, "/../etc/passwd"));
    try expectError(error.PathInvalid, parse_path(&path, "/video/./intro.mp4"));
    try expectError(error.PathInvalid, parse_path(&path, "/video//intro.mp4"));
    try expectError(error.PathInvalid, parse_path(&path, "/video/"));
    try expectError(error.PathInvalid, parse_path(&path, "video/intro.mp4"));
    try expectError(error.PathInvalid, parse_path(&path, "/intro%2e%2e"));
    try expectError(error.PathInvalid, parse_path(&path, "/a\x00b"));
    try expectError(error.PathInvalid, parse_path(&path, ""));
}
```

The edge of a limit is tested by building the input from the limit itself,
so the test follows when the limit changes:

```zig
var long: [limits.path_size_max + 1]u8 = @splat('a');
long[0] = '/';
try parse_path(&path, long[0..limits.path_size_max]);
try std.testing.expectError(error.PathTooLong, parse_path(&path, &long));
```

And one unit test asked a question the code had not answered — what is a
range of an empty file? `parse_range` asserts the file is not empty, so the
answer had to be decided before it is called:

```zig
test "answer_for: a range of an empty file is unsatisfiable, not an assertion" {
    try std.testing.expectError(error.RangeUnsatisfiable, answer_for(.get, "bytes=0-", 0));
    const empty = try answer_for(.get, null, 0);
    try std.testing.expectEqual(0, empty.content_size);
}
```

## Random

**A parser under generated input.** The alphabet is the parser's own
characters, so most inputs get past the first check; the oracle is the
parser's assertions, and one property of the result:

```zig
test "parse_request: no input breaks an assertion" {
    var prng: std.Random.DefaultPrng = .init(0x5eed);
    const random = prng.random();
    const alphabet = "GETHAD /abc.:-=\r\n1.HTTP/1";

    var buffer: [256]u8 = undefined;
    var request: Request = undefined;
    const rounds_max: u32 = 20_000;
    var round: u32 = 0;
    while (round < rounds_max) : (round += 1) {
        const size = random.uintLessThan(u32, buffer.len + 1);
        for (buffer[0..size]) |*byte| byte.* = alphabet[random.uintLessThan(u32, alphabet.len)];
        const result = parse_request(&request, buffer[0..size]) catch continue;
        if (result != null) try std.testing.expect(request.head_size <= size);
    }
}
```

**The same parser under the fuzzer**, from a corpus of two real requests
([the fuzzer](../testing/tiers.md#the-fuzzer)). A run of `--fuzz=20K` made
twenty thousand inputs, of which 406 took a path no earlier one had.

**A box against a model.** The pool is driven by random acquires and
releases, and a plain array of the handles held says what the pool should
contain after each step:

```zig
// The model: the handles held, in a plain array.
var held: [count]Pool(u64).Handle = undefined;
var held_count: u32 = 0;
// … each round: acquire and record, or release a random one held
try std.testing.expectEqual(held_count, pool.count_used());
```

**A failing allocator.** `init` is run with an allocator that fails at the
first allocation, then at the second, and so on; each time it must leak
nothing:

```zig
test "Pool: init leaks nothing when an allocation fails" {
    try std.testing.checkAllAllocationFailures(std.testing.allocator, init_and_deinit, .{});
}
```

## The simulation

The real boxes, wired by a second composition root to a world made of data
([simulation](../testing/tiers.md#simulation)). The world plays 48 clients
against a server of 8 connections. Each client has a behaviour and a speed:

```zig
const Behaviour = enum { whole, range, head, missing, garbage, silent, closes };
```

A `silent` client sends the first ten bytes of a request and stops; a
`closes` client sends ten bytes and goes away. Arrivals are uneven, every
speed is a seed's choice, and the clock is the simulation's: 30 seconds of
idle timeout pass in a fraction of a second.

After each run it checks what must hold however the world behaved:

```zig
try std.testing.expect(tick < ticks_max);
try std.testing.expectEqual(0, world.files_open);
for (&world.clients) |*client| try check_client(world, client);
```

— the run ended, every file opened was closed, every client was accepted
and closed, each got the status its request deserved, and a `whole` client
got every byte of its file, compared byte by byte. The allocator was locked
all the way through. A failure prints its seed:

```zig
errdefer std.debug.print("simulation failed: seed={d}\n", .{seed});
```

### Two traps it guards against

**A generator that never makes the hard case.** Speeds drawn evenly from 1
to 4,096 bytes per tick would make almost every client send its whole
request in one call, so a `closes` client would almost never leave
mid-request — and the test would pass without having tried. So speeds are
spread over orders of magnitude, and the test checks, across all seeds, that
each hard case happened:

```zig
// Spread over orders of magnitude: a uniform rate would almost never be slow.
.bytes_per_tick = @as(u32, 8) << random.uintAtMost(u5, 9),
```

```zig
// The run is worth something only if it reached each of the hard cases.
try std.testing.expect(total.refused_full > 0);
try std.testing.expect(total.timed_out > 0);
try std.testing.expect(total.closed_by_peer > 0);
try std.testing.expect(total.refused > 0);
```

A random test that cannot show it reached a case has not tested it
([random](../testing/tiers.md#random)).

**An oracle that is wrong.** The simulation decides what each client
deserves, and that decision is code too. A range from byte 10 of a 7-byte
file is unsatisfiable, so the expected answer depends on the file, as the
standard says:

```zig
// The range starts at byte 10: a shorter file cannot satisfy it.
.range => if (world.file_sizes[file] > 10) "HTTP/1.1 206" else "HTTP/1.1 416",
```

When a seed fails, the first question is which side is wrong — the server
or the oracle. The seed replays the run byte for byte while that is found
out.

## How many allocations

The server's start-up allocations are a number in a test, so a fourth is a
decision someone makes, not an accident someone finds:

```zig
test "Server.init: three allocations, all at startup" {
    var counting: std.testing.FailingAllocator = .init(std.testing.allocator, .{});
    const gpa = counting.allocator();

    // `init` only stores the network and the disk; it never calls them.
    var server = try Server.init(gpa, undefined, undefined, .{ .connections_max = 8 });
    defer server.deinit(gpa);

    // The pool, the request buffers, the active list. A fourth is a decision, not an accident.
    try std.testing.expectEqual(3, counting.allocations);
}
```

The pool is one of the three because its slots are one `std.MultiArrayList`
rather than three slices ([fewer allocations](../performance/allocations.md#fewer-allocations)).

## The guards

`tidy.zig` holds the text guards — line length, function length, banned
text, state in a door, every folder on the layer map — as tests that read
the files ([text rules](../testing/guards.md#text-rules)). They pass on the
service, and each was seen to fail on a rule broken on purpose. One case
needed a rule of its own: `Pool` is a function that returns a type, and its
body is the type's, so the guard counts the methods inside it, each well
under 70 lines, and not the function around them.
