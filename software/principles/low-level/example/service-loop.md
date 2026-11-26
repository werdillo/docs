# The loop

The server owns every connection. Each is a slot in the pool and a 16 KiB
slice of one buffer allocated at startup, and it moves through three states:

```
reading ──request complete──▶ sending_head ──head sent──▶ sending_body ──body sent──▶ closed
   │                                │                                         ▲
   └──refused: the head is a status─┴──── no body (HEAD, a refusal) ──────────┘
```

Every state can also end in a timeout or a closed peer.

## The tick

```zig
/// One turn of the loop: a bounded amount of each kind of work, then back to waiting.
pub fn tick(server: *Server, now_ms: u64) void {
    server.accept_batch(now_ms);
    server.serve_batch(now_ms);
    assert(server.active_count == server.pool.count_used());
}
```

Two batches, each with its own limit, and an assertion that the two records
of how many connections are open — the active list and the pool — agree
([no aliases](../safety/memory.md#smallest-scope-no-aliases)).

```zig
fn accept_batch(server: *Server, now_ms: u64) void {
    var accepted: u32 = 0;
    while (accepted < limits.accepts_per_tick_max) : (accepted += 1) {
        const handle = server.pool.acquire() orelse {
            server.counters.refused_full += 1;
            break;
        };
        const socket = server.network.accept() orelse {
            server.pool.release(handle);
            break;
        };
        // … the connection starts in `.reading`
    }
    assert(accepted <= limits.accepts_per_tick_max);
}
```

A slot is taken before a connection is accepted. When the pool is full the
loop stops asking: the kernel's backlog holds the rest, and refuses past its
own limit. Overload is a counter, not a crash
([what happens at a limit](../safety/limits.md#what-happens-at-a-limit)).

```zig
fn serve_batch(server: *Server, now_ms: u64) void {
    const steps_max = @min(server.active_count, limits.events_per_tick_max);
    var steps: u32 = 0;
    while (steps < steps_max) : (steps += 1) {
        if (server.active_count == 0) break;
        if (server.cursor >= server.active_count) server.cursor = 0;

        const position = server.cursor;
        if (server.step(server.active[position], now_ms)) {
            server.cursor += 1;
        } else {
            server.close(position);
        }
    }
}
```

The cursor goes round the active connections, so that with 4,096 open and
256 steps per tick each one is reached in turn and none is starved.

## One function branches

```zig
/// The parent: all branching on a connection's state is here. False when it is done.
fn step(server: *Server, handle: Handle, now_ms: u64) bool {
    const connection = server.pool.get(handle);
    assert(now_ms >= connection.active_ms);
    if (now_ms - connection.active_ms > limits.idle_timeout_ms) {
        server.counters.timed_out += 1;
        return false;
    }
    const progress = switch (connection.state) {
        .reading => server.step_read(handle),
        .sending_head => server.step_send_head(handle),
        .sending_body => server.step_send_body(connection),
    } catch {
        server.counters.closed_by_peer += 1;
        return false;
    };
    if (progress.moved) connection.active_ms = now_ms;
    return !progress.done;
}
```

The timeout, the states, a closed peer and the activity clock are decided
here and nowhere else. The helpers each do one state's work and report what
happened; none of them knows there are other states
([push `if`s up](../structure/functions.md#push-ifs-up-and-fors-down)). The
`switch` has no `else`: a fourth state is a compile error here.

## The control plane

When a request is complete, everything about the answer is decided at once:

```zig
/// The control plane: once per request, every decision made and checked here.
fn respond(
    server: *Server,
    connection: *Connection,
    buffer: []u8,
    request: *const http.Request,
) void {
    const file = server.disk.open(&request.path) catch |err| {
        return server.refuse(connection, buffer, answer.status_for(err));
    };
    const file_size = server.disk.size(file);
    const method = request.method;
    const decided = answer.answer_for(method, request.range, file_size) catch |err| {
        server.disk.close(file);
        return server.refuse(connection, buffer, answer.status_for(err));
    };
    // … `write_head` into `buffer`, then the connection moves to `.sending_head`
}
```

The decision itself is a pure function, tested without a server:

```zig
/// Pure: the decision, with nothing sent. `range_value` is the client's header, unparsed.
pub fn answer_for(
    method: http.Method,
    range_value: ?[]const u8,
    file_size: u64,
) AnswerError!Answer {
    const body = method == .get;
    const value = range_value orelse {
        return .{ .status = .ok, .range = null, .content_size = file_size, .body = body };
    };
    if (file_size == 0) return error.RangeUnsatisfiable;

    const range = try http.parse_range(value, file_size);
    assert(range.offset + range.size <= file_size);
    // … `.partial_content`, with the range
}
```

`parse_range` asserts that the file is not empty, because a range of nothing
is meaningless. So the empty file is answered before it is called: a client
asking for a range of an empty file gets `416`, not a crash
([its test](./service-tests.md#unit)).

## The data plane

```zig
/// The data plane: hands a chunk of the file to the network and decides nothing.
fn step_send_body(
    server: *Server,
    connection: *Connection,
) network_zig.TransferError!Progress {
    assert(connection.body_sent < connection.body_size);
    const remaining = connection.body_size - connection.body_sent;
    const chunk: u32 = @intCast(@min(remaining, limits.send_chunk_size_max));

    const size = try server.network.send_file(
        connection.socket,
        connection.file.?,
        connection.body_offset + connection.body_sent,
        chunk,
    );
    assert(size <= chunk);
    connection.body_sent += size;
    return .{ .moved = size > 0, .done = connection.body_sent == connection.body_size };
}
```

No parsing, no status, no file lookup: those were the control plane's. It
runs once per chunk for as long as the body flows, and what it relies on —
that the range is inside the file — was asserted where the range was made.
The two assertions are a pair
([in pairs](../safety/assertions.md#in-pairs)).

## One place where every failure is answered

```zig
/// The one place that says what the client is told for each failure. No `else`: a new error
/// in any box's set fails to compile here until someone decides its answer.
pub fn status_for(err: AnswerError) http.Status {
    return switch (err) {
        error.HeaderTooLarge, error.HeadersTooMany => .request_header_fields_too_large,
        error.MethodNotAllowed => .method_not_allowed,
        error.VersionNotSupported => .http_version_not_supported,
        error.RequestMalformed, error.RangeMalformed => .bad_request,
        error.PathInvalid, error.PathTooLong, error.PathTooDeep => .bad_request,
        // Outside the root looks the same as missing: a client learns nothing about the disk.
        error.FileNotFound, error.PathOutsideRoot => .not_found,
        error.RangeUnsatisfiable => .range_not_satisfiable,
    };
}
```

`AnswerError` is the union of the error sets of three boxes. A path outside
the root and a missing file get the same answer: a client learns nothing
about what exists where it may not look. A new error in
any of them stops the build here until someone decides what the client is
told ([error sets are named](../safety/errors.md#error-sets-are-named)).

Two kinds of failure never reach it: a closed peer and a timeout. Nobody is
there to answer, so they are counted and the connection is closed.

## Closing

```zig
fn close(server: *Server, position: u32) void {
    assert(position < server.active_count);
    const handle = server.active[position];
    const connection = server.pool.get(handle);

    if (connection.file) |file| server.disk.close(file);
    server.network.close(connection.socket);
    server.pool.release(handle);

    server.active_count -= 1;
    server.active[position] = server.active[server.active_count];
}
```

Every path out of a connection ends here — a response sent, a refusal sent,
a timeout, a closed peer — so what a connection holds is released in one
place. The simulation checks that nothing is left open after every run.

Next: [the tests](./service-tests.md).
