# A media file server

A [service](../kinds/service.md) that answers `GET` and `HEAD` for files
under one root, with an optional single byte range. Nothing else.

## The sketch

Before any code ([sketch before building](../performance/sketch.md#sketch-before-building)):

- **How many.** 4,096 connections at once; at most 64 new ones per tick.
- **How big.** A request's head fits in 8 KiB, with at most 32 headers. A
  path is at most 1,024 bytes and 16 segments deep.
- **Where the cost is.** The network link bounds throughput. The body goes
  from the file to the socket in the kernel, in chunks of at most 256 KiB, so
  a connection's own memory is only a buffer for the request: 16 KiB.
- **What it adds up to.** 4,096 × 16 KiB = 64 MiB, allocated once.
- **What it refuses.** A connection past the pool, a head past 8 KiB, a path
  that leaves the root or is percent-encoded, a method that is not `GET` or
  `HEAD`, a version that is not 1.1, a connection idle for 30 seconds.

Every number in that list becomes a line in the limits file.

## The tree

```
build.zig                 ← the layer map: limits, core, files, http, server
src/
  main.zig                ← entry point and composition root
  simulation.zig          ← the second composition root: a simulated network, disk and clock
  tidy.zig                ← the text guards
bench/
  parse_request.zig       ← a benchmark with its budget
  limits/root.zig         ← every limit, and the relations between them
  core/
    root.zig              ← door: Pool, StaticAllocator
    pool.zig
    static_allocator.zig
  files/
    root.zig              ← door: Path, parse_path, Disk, LinuxDisk
    path.zig
    disk_linux.zig        ← the real disk: openat2, beneath the root
    linux_check.zig       ← compiles the adapter for Linux on any machine
  http/
    root.zig              ← door: Request, parse_request, Range, parse_range, write_head
    request.zig
    range.zig
    response.zig
  server/
    root.zig              ← door: Server, Network, Counters
    server.zig            ← the tick and the connection's states
    answer.zig            ← pure: a request and a file's size → what to send
    network.zig           ← the interface the network is passed in through
```

Each folder is a box and a module
([the layer map is the build](../structure/boxes.md#the-layer-map-is-the-build)).
The map, in `build.zig`:

```zig
const layer_map = [_]Box{
    .{ .name = "limits", .imports = &.{} },
    .{ .name = "core", .imports = &.{} },
    .{ .name = "files", .imports = &.{ "limits", "core" } },
    .{ .name = "http", .imports = &.{ "limits", "core", "files" } },
    .{ .name = "server", .imports = &.{ "limits", "core", "files", "http" } },
};
```

`http` knows `files`, because a request carries a confined path; `files`
knows nothing of HTTP. `server` uses all of them and is used by none.

## The limits

```zig
//! Every limit of the service, in one file. A number that bounds something is named here.
const std = @import("std");
const assert = std.debug.assert;

pub const connections_max: u32 = 4096;
pub const accepts_per_tick_max: u32 = 64;
pub const events_per_tick_max: u32 = 256;
pub const request_header_size_max: u32 = 8 * 1024;
pub const request_buffer_size: u32 = 16 * 1024;
pub const request_headers_count_max: u32 = 32;
pub const path_size_max: u32 = 1024;
pub const path_depth_max: u32 = 16;
pub const send_chunk_size_max: u32 = 256 * 1024;
pub const idle_timeout_ms: u64 = 30 * std.time.ms_per_s;

comptime {
    assert(accepts_per_tick_max <= connections_max);
    assert(events_per_tick_max >= accepts_per_tick_max);
    assert(request_header_size_max <= request_buffer_size);
    assert(path_size_max < request_header_size_max);
    assert(path_depth_max * 2 <= path_size_max);
}

/// What the process allocates at startup, known before it runs.
pub const memory_size_max: u64 = @as(u64, connections_max) * request_buffer_size;
```

Each relation is one a future change could break without noticing. The
last one says a path of the deepest allowed nesting (`/a/a/…`) still fits
its size limit, so `PathTooDeep` and `PathTooLong` cannot contradict each
other ([limits live in one file](../safety/limits.md#limits-live-in-one-file)).

## The pool

`core` holds a pool of any `T`: it knows no connection, so another program
could use it unchanged. It allocates once and gives out handles
([one owner](../safety/memory.md#one-owner-and-handles-for-the-rest)):

```zig
pub fn init(gpa: std.mem.Allocator, count: u32) !Self {
    assert(count > 0);

    var slots: std.MultiArrayList(Slot) = try .initCapacity(gpa, count);
    for (0..count) |position| {
        const free: u32 = count - 1 - @as(u32, @intCast(position));
        slots.appendAssumeCapacity(.{ .item = undefined, .used = false, .free = free });
    }
    return .{ .slots = slots, .free_count = count };
}

/// Null when the pool is full: the caller refuses, it does not grow the pool.
pub fn acquire(pool: *Self) ?Handle {
    if (pool.free_count == 0) return null;

    pool.free_count -= 1;
    const index = pool.slots.items(.free)[pool.free_count];
    const used = pool.slots.items(.used);
    assert(!used[index]);
    used[index] = true;
    return @fromBackingInt(@intCast(index));
}
```

Every slot's item, its `used` flag and its place in the free list are one
`std.MultiArrayList`, so the whole pool is one allocation
([fewer allocations](../performance/allocations.md#fewer-allocations)). The `used`
array is there for the assertions: a handle that is released twice, or used
after release, stops the program at the line that did it.

## The composition root

`main` builds the boxes in the order of the map and locks the allocator
before the loop ([the composition root](../structure/boxes.md#the-composition-root)).
The simulation, which does exist, does the same with a simulated world:

```zig
var static: core.StaticAllocator = .{ .parent = std.testing.allocator };
var server = try server_box.Server.init(static.allocator(), world.network(), world.disk(), .{
    .connections_max = connections_max,
});
static.lock();
```

`Server.init` takes the network and the disk as interfaces, and the number
of connections as an option, so the simulation runs the real server with a
pool of eight — small enough to fill. `main` differs only in what it hands
over: the real network and disk, and `limits.connections_max`.

Next: [the boundary](./service-boundary.md).
