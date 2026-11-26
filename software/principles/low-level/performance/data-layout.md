# Data layout

A program is code that turns data into other data, and on a modern machine
what costs most is moving the data to the code — a cache miss, a bus
transfer, a page from flash. So the layout of the data decides the cost more
than the code that walks it. This page is data-oriented design as these
rules use it. TigerStyle asks for the same thing as mechanical sympathy and
batching, without spelling out the layout; its sources are in
[`sources/`](../sources/README.md#data-oriented-design).

## Know the data

Before a structure is drawn, the sketch says, for each kind of thing:

- **how many** — the limit, from the limits file;
- **how big** — the size of one, which a compile-time assertion will hold;
- **who reads which field, and how often** — once per request, or every
  tick for every item.

The third question is the one a design usually skips, and the one that
decides the layout ([sketch before building](./sketch.md#sketch-before-building)).

## Where there is one, there are many

A function that handles one item is called in a loop, and the loop's cost is
paid per call: the branches, the pointer chasing, the setup. A function over
a slice does the setup once and runs straight through
([push `for`s down](../structure/functions.md#push-ifs-up-and-fors-down)).
So the data a loop reads is a slice, and the function takes it:

```zig
/// The hot loop: a slice of one field, no `self`. Writes the indexes that expired into `expired`.
fn find_expired(active_ms: []const u64, now_ms: u64, timeout_ms: u64, expired: []u32) u32 {
    assert(expired.len >= active_ms.len);
    var expired_count: u32 = 0;
    for (active_ms, 0..) |active, index| {
        assert(now_ms >= active);
        if (now_ms - active > timeout_ms) {
            expired[expired_count] = @intCast(index);
            expired_count += 1;
        }
    }
    assert(expired_count <= active_ms.len);
    return expired_count;
}
```

Primitive arguments, no `self`: the compiler need not prove that nothing
else changes the fields, and the reader sees every input
([be explicit in the hot path](./planes.md#be-explicit-in-the-hot-path)).

## Boxes by subject, layout by loop

The two rules meet here, and each keeps its own ground.

- **Code is split into boxes by subject** ([boxes](../structure/boxes.md#a-box)).
- **Inside a box, its data is laid out for the loops that read it.** Which
  fields sit together, which go to an array of their own, what is split into
  hot and cold — the box's choice, invisible outside.
- **Handles are what make this possible.** A neighbour holds an index, not a
  pointer to a struct, so the owner can turn an array of structs into a
  struct of arrays without a single caller changing
  ([one owner](../safety/memory.md#one-owner-and-handles-for-the-rest)).
- **A hot loop that needs the data of several boxes is a signal.** Either the
  loop belongs to one of them and the others hand it what it needs once per
  batch, or the boundary is in the wrong place. A hot loop that calls through
  a door per item is the case to fix first.

## A struct of arrays where a loop reads one field

When a loop reads one field of every item, an array of structs brings every
other field into the cache with it. A struct of arrays keeps each field in
its own array, and the loop reads only the one it needs. Zig's standard
library has it as `std.MultiArrayList`:

```zig
const Connections = std.MultiArrayList(Connection);
```

```zig
var connections: Connections = try .initCapacity(gpa, connections_max);
const details = try gpa.alloc(ConnectionDetail, connections_max);
const expired = try gpa.alloc(u32, connections_max);
static.lock();
```

```zig
const expired_count = find_expired(connections.items(.active_ms), 63_000, 30_000, expired);
```

- **Its capacity is fixed at startup**, and items are added with
  `appendAssumeCapacity`, which never allocates. The test that shows it runs
  with the allocator locked
  ([all memory is fixed before the work begins](../safety/memory.md#all-memory-is-fixed-before-the-work-begins)).
- **`items(.field)` is a plain slice**, which is what the hot loop takes.
- **It is chosen for a loop**, not by default. An item read whole, once, is
  simpler as a struct.

## Hot and cold

Fields read every tick and fields read once per request do not share a
struct. The cold ones go to an array of their own, at the same index:

```zig
/// The hot fields of a connection: what the loop reads every tick.
const Connection = struct {
    active_ms: u64,
    body_sent: u64,
    socket: u32,
    state: State,

    const State = enum(u8) { reading, sending_head, sending_body };
};

/// The cold fields: read once per request. Same index as the hot ones.
const ConnectionDetail = struct {
    path: [256]u8,
    path_size: u32,
    file_size: u64,
};
```

With the cold fields inside, a `Connection` is 296 bytes instead of 24 —
more than twelve times larger — and every tick's loop would pay for bytes it
never looks at.

## Smaller items

More items per cache line, or per kilobyte of a chip's RAM:

- **An index, not a pointer.** A `u32` handle is half a pointer on a 64-bit
  machine and can be checked against its pool.
- **The smallest type that holds the range.** `enum(u8)` for a state; a
  sized integer from the limits, not `usize`
  ([sized types](../safety/limits.md#sized-types)).
- **Fields ordered by alignment, and the size asserted:**

  ```zig
  comptime {
      // Fields ordered by alignment: no padding inside, and the size is a fact, not a guess.
      assert(@sizeOf(Connection) == 24);
  }
  ```

  A field added later that breaks the layout breaks the build, and the
  person adding it decides whether the cost is worth it.
- **Flags as bits.** Many booleans over many items are a bit set
  (`std.bit_set`), not a `bool` field in each.

## A list per state, instead of a state field

A loop that branches on each item's state pays a branch per item, and the
branches are hard to predict when states are mixed. When one state is what a
loop is for, the items in that state are kept in a list of their own, and
moving between states is moving between lists:

```zig
/// One list per state, so the loop over a state has no branch on it.
const Lists = struct {
    reading: [8]u32 = undefined,
    reading_count: u32 = 0,
    sending: [8]u32 = undefined,
    sending_count: u32 = 0,

    fn move_to_sending(lists: *Lists, position: u32) void {
        assert(position < lists.reading_count);
        assert(lists.sending_count < lists.sending.len);
        lists.sending[lists.sending_count] = lists.reading[position];
        lists.sending_count += 1;
        lists.reading_count -= 1;
        lists.reading[position] = lists.reading[lists.reading_count];
    }
};
```

The loop over senders then reads only senders. It is the
[push `if`s up](../structure/functions.md#push-ifs-up-and-fors-down) rule
applied to data: the decision is made once, when an item changes state, not
on every pass. The cost is an invariant to keep — an item is in exactly one
list — which is asserted where items move.

The [example service](../example/service-loop.md#one-function-branches)
keeps a state field and a `switch`, which is right at its scale. This is the
step to take when a measurement says the branch per item is the cost.

## The data plane takes comptime parameters

An interface through a table of function pointers is an indirect call the
compiler cannot inline. In the control plane that cost is nothing; in a loop
over every sample it is the loop. So the data plane takes what it calls as a
comptime parameter:

```zig
/// The data plane takes its filter as a comptime type: the call is direct and can be inlined.
fn filter_block(comptime Filter: type, filter: *Filter, samples: []i16) void {
    for (samples) |*sample| sample.* = filter.step(sample.*);
}
```

The control plane keeps its interfaces — the board, the network, the disk —
where one call does a lot of work and the indirection is what lets a test
pass in a simulated world ([comptime](../structure/functions.md#comptime-for-what-is-known-before-the-program-runs)).

## On a chip

A small microcontroller changes what layout is for, not whether it matters.
A Cortex-M4 has no data cache of its own, so a struct of arrays buys little
in cache lines. What it buys there is size — RAM is kilobytes — and
contiguity: a buffer that DMA fills or drains is one contiguous array of
samples, aligned as the peripheral requires, never a field scattered across
structs. The questions are the same; the sketch's numbers are different
([firmware](../kinds/firmware.md)).

## How it is checked

- **A layout change is made for a loop that a measurement named**, with the
  benchmark beside it ([a claim is a number](./measuring.md#a-claim-is-a-number)).
- **Sizes are asserted at compile time**, so a layout cannot drift unseen.
- **Invariants between parallel arrays are asserted** where they change: the
  same count in each, an item in exactly one list.
