# Memory

## All memory is fixed before the work begins

Every pool, buffer and table is sized from the
[limits](./limits.md#limits-live-in-one-file) and fixed once. Nothing is
allocated, resized or freed while the program works. Where the memory comes
from depends on the [kind](../kinds/README.md):

| Kind | Fixed by |
|---|---|
| a service | allocation in `main`, then the allocator is locked |
| firmware | the compiler and the linker: static `var`s of fixed size |
| a library | the caller, at `init`; no operation after it allocates |
| a tool | allocation in `main`, sized from the job |

What this removes:

- **Use-after-free and double free in the working path** — nothing is freed.
- **Allocation failure in the middle of the work** — it can only happen at
  startup, where the answer is simple: the program does not start.
- **Fragmentation and latency spikes** from the allocator.
- **Unbounded growth** — memory is the sum of the limits, and it is known
  before the program runs.

What it asks is that the design considers every use of memory up front. That
is the second effect, and the larger one: a design that had to name its
buffers is simpler than one that allocates wherever it finds a need.

**A per-request scratch space is still static.** Each connection owns a fixed
buffer from the pool; a request that needs temporary space uses a
fixed-buffer allocator over that buffer and resets it when the request ends.
The backing memory was allocated at startup, so the rule holds.

**The allocator's name says its lifetime.** `gpa` for the general allocator
that needs a matching `free`, `arena` for one freed all at once, `scratch`
for a per-request buffer. A parameter named `allocator` tells the reader
nothing about who frees.

**The stack is memory too.** No recursion keeps its depth bounded by the
code; where the stack is small and fixed, as on a chip, how much is used is
measured ([firmware](../kinds/firmware.md#memory-is-static)).

## The allocator is locked

Where memory is allocated at startup, the rule is held by the allocator
itself. `main` wraps the startup allocator;
after the last box is built it locks the wrapper, and from then on an
allocation is a programmer's error:

```zig
/// Wraps the startup allocator. After `lock`, an allocation is a programmer's error.
pub const StaticAllocator = struct {
    parent: Allocator,
    state: enum { init, locked, deinit } = .init,

    pub fn lock(static: *StaticAllocator) void {
        assert(static.state == .init);
        static.state = .locked;
    }

    fn alloc(context: *anyopaque, size: usize, alignment: Alignment, ret_addr: usize) ?[*]u8 {
        const static: *StaticAllocator = @ptrCast(@alignCast(context));
        assert(static.state == .init);
        return static.parent.rawAlloc(size, alignment, ret_addr);
    }

    // … `resize` and `remap` assert the same; `free` asserts the state is not `.locked`.
};
```

The wrapper is used in the tests too, so a box that allocates late fails its
own test, not a night in production. The third state lets a clean shutdown
free what startup allocated.

## One owner, and handles for the rest

Each piece of memory has one owner: the box that allocated it. Only the owner
changes it, and only the owner gives it back.

Another box that needs to refer to it holds a **handle** — an index into the
owner's pool, wrapped in a type of its own so that it cannot be confused with
another index or with a count:

```zig
/// A fixed set of `T`, allocated once. Its users hold a `Handle`, never a pointer.
pub fn Pool(comptime T: type) type {
    return struct {
        /// One allocation for every slot: the item, whether it is in use, and the free list.
        slots: std.MultiArrayList(Slot),
        free_count: u32,

        pub const Handle = enum(u32) { _ };
        const Slot = struct { item: T, used: bool, free: u32 };
        const Self = @This();

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

        pub fn release(pool: *Self, handle: Handle) void {
            const index = pool.index_of(handle);
            assert(pool.free_count < pool.slots.len);

            pool.slots.items(.used)[index] = false;
            pool.slots.items(.item)[index] = undefined;
            pool.slots.items(.free)[pool.free_count] = index;
            pool.free_count += 1;
        }

        // … `get`, and the assertions behind every handle
    };
}
```

A handle is half the size of a pointer, can be bounds-checked on every use,
can be written to a log, and cannot dangle into freed memory — the worst it
can do is name a slot that was reused, and where that matters the handle
carries a generation that the owner checks.

## Sharing between threads, cores and interrupts

One owner per piece of state holds across threads too, and it is what keeps
them simple: a thread owns its state and shares nothing by default.

- **Threads are started at startup, and their number is a limit.** No thread
  is spawned while the program works; a pool of workers is sized like any
  other pool. Each has its own memory, handed to it by `main`.
- **What is shared is named, and in one place.** A queue between two
  threads, a ring buffer between an interrupt and the loop, a counter read by
  a monitor — each is a type of its own whose comment says who writes and
  who reads ([the interrupt and its ring buffer](../example/firmware.md#the-interrupt-records-the-loop-works)).
- **Messages, not shared structures.** A thread hands work to another as a
  value or a handle through a bounded queue, and does not touch it after. A
  structure two threads write is the case to design out first.
- **One producer, one consumer, where it can be.** Each side owns one index
  and only reads the other's; no lock is needed, and the code is short
  enough to check by reading.
- **Every atomic names its ordering, and the reason is beside it.** An
  `.acquire` load pairs with a `.release` store, and the pair is what makes
  the data written before the store visible after the load. An ordering is
  not chosen by habit, and `.seq_cst` is not a way to stop thinking.
- **No lock in the data plane.** In the control plane a lock is allowed when
  the time it is held is bounded and short, and it is never held across I/O
  or a call into another box.
- **An interrupt is a thread that cannot wait.** It never takes a lock the
  loop may hold; it records and returns, and what it shares with the loop is
  one of the structures above.

How a service divides its work and its limits across cores is not decided
yet ([more than one core](../open-questions.md#more-than-one-core)).

## Pointers are restricted

- **One level.** A pointer to a struct, a slice of items. A pointer to a
  pointer is a design that wants a handle.
- **A pointer does not outlive the call it was passed to**, unless the type
  it is stored in says who owns the target. A box stores a handle, not a
  neighbour's pointer.
- **A slice over a `[*]` pointer.** A many-item pointer has no length to
  check; it appears only at the edge of a system call or a C interface, and
  becomes a slice on the next line.
- **A function pointer appears only in a named interface** — an allocator, an
  I/O completion, a pluggable back end — declared as a type with one job.
  A loose function pointer makes the control flow unreadable and a call graph
  unbuildable.
- **`*const` for a large argument that is not to be copied**
  ([simple signatures](../structure/functions.md#simple-signatures)).

## Smallest scope, no aliases

- **A variable is declared at the smallest scope that works**, and as late as
  it can be. Fewer names in scope are fewer names to misuse. `const` unless
  it changes.
- **A value is computed or checked next to where it is used.** A check at the
  top of a function and a use forty lines below is a gap in which the value
  can change — a place-of-check to place-of-use bug.
- **No second name for the same state.** A field copied into a local, or a
  count kept beside the slice it counts, are two values that must agree and
  one day will not. Where a copy is truly needed for speed, an assertion says
  they are equal.
- **`undefined` is set before it is read, on the next lines.** A safe build
  fills it with a pattern so that a read is loud.

## Large values are built in place

A large struct is initialised through a pointer to where it will live, not
returned by value:

```zig
fn init(target: *LargeStruct) !void {
    target.* = .{
        // …
    };
}
```

A value returned from `init` is built on the callee's stack and copied to the
caller's, which doubles the stack it needs and moves the struct — and a
struct that holds pointers into itself must not move. In-place initialisation
is viral: if one field needs it, the struct that holds the field needs it too.

## A buffer is fully written

A buffer overflow writes past the end. Its opposite reads what was never
written: a buffer reused for a shorter message, or a struct sent with its
padding, carries the previous occupant's bytes to the next reader.

- **What leaves the program is the slice that was written**, `buffer[0..size]`,
  never the whole buffer.
- **A struct written to a socket or a disk has no padding** — it is `extern`
  or `packed`, with its size asserted at compile time — or is zeroed first.
- **A buffer returned to a pool keeps no promise about its contents**, and
  the next user treats it as `undefined`.

## Allocation and release sit together

A resource is acquired and its release is written on the next line, as
`defer` or `errdefer`, with a blank line before the acquisition and after the
release. A leak is then a missing line a reader can see:

```zig
var pool = try Pool.init(gpa, options.connections_max);
errdefer pool.deinit(gpa);

const buffers = try gpa.alloc(u8, options.connections_max * limits.request_buffer_size);
errdefer gpa.free(buffers);

const active = try gpa.alloc(Handle, options.connections_max);
errdefer gpa.free(active);
```
