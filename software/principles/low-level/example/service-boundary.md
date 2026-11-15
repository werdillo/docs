# The boundary

Everything a client sends is checked once, where it becomes a type, and not
again ([input is parsed once](../safety/errors.md#input-is-parsed-once-at-the-boundary)).

| Bytes from the client | Checked against | Becomes | When wrong |
|---|---|---|---|
| the head | `request_header_size_max`, `request_headers_count_max` | `Request` | `431` |
| the method | the two the service knows | `enum { get, head }` | `405` |
| the version | `HTTP/1.1` | — | `505` |
| the path | size, depth, allowed bytes, no `.` or `..` or empty segment | `files.Path` | `400` |
| the `Range` header | the file's size | `http.Range` | `400` or `416` |
| the path, on the disk | the kernel, beneath the root, no symlinks | an open file | `404` |

## A path that can only be inside the root

`files` owns the path, because `files` is what opens it. A `Path` is built by
one function, and the disk opens nothing else:

```zig
/// The client's bytes become a `Path`, or an error. Percent-encoding is refused, not decoded.
pub fn parse_path(target: *Path, raw: []const u8) PathError!void {
    if (raw.len == 0) return error.PathInvalid;
    if (raw.len > limits.path_size_max) return error.PathTooLong;
    if (raw[0] != '/') return error.PathInvalid;
    for (raw) |byte| {
        if (!byte_allowed(byte)) return error.PathInvalid;
    }

    var depth: u32 = 0;
    var segments = std.mem.splitScalar(u8, raw[1..], '/');
    while (segments.next()) |segment| {
        if (depth == limits.path_depth_max) return error.PathTooDeep;
        depth += 1;
        if (segment.len == 0) return error.PathInvalid;
        if (std.mem.eql(u8, segment, ".")) return error.PathInvalid;
        if (std.mem.eql(u8, segment, "..")) return error.PathInvalid;
    }
    assert(depth > 0);
    assert(depth <= limits.path_depth_max);

    @memcpy(target.bytes[0..raw.len], raw);
    target.size = @intCast(raw.len);
}
```

- **The size comes first**, before the content is looked at.
- **The loop over segments is bounded** by the depth limit, not only by the
  input ([every loop has a bound](../safety/control-flow.md#every-loop-has-a-bound)).
- **Refusing is simpler than decoding.** A `%` is not an allowed byte, so no
  decoded `..` can slip past the check. A service that must accept encoded
  names decodes here, into the same type, before the same checks.
- **The `Path` is a copy** in a fixed array, not a slice of the request
  buffer: the buffer is reused for the response while the path is still
  needed.

The disk is an interface whose `open` takes a `*const Path`. Bytes that did
not pass through `parse_path` have no way to reach it.

## Inside the root at the moment of opening

`parse_path` proves the text stays inside the root. It cannot prove the
file does: a symlink under the root can point anywhere, and `..` is not
needed to follow it. So the check is made again where it matters — when the
file is opened — by the kernel, which sees the real directories. On Linux
that is `openat2` with `RESOLVE_BENEATH`; the standard library has the
call's number but not its argument, so the adapter declares it:

```zig
/// `struct open_how` from the kernel's `openat2(2)`; the standard library has the call's number
/// but not its argument.
const OpenHow = extern struct { flags: u64, mode: u64, resolve: u64 };

const resolve_no_magiclinks: u64 = 0x02;
const resolve_no_symlinks: u64 = 0x04;
const resolve_beneath: u64 = 0x08;
```

```zig
/// The kernel resolves the path beneath the root and refuses any symlink on the way,
/// so the check holds at the moment of opening, not only when the path was parsed.
fn open(context: *anyopaque, path: *const Path) root.OpenError!root.File {
    const relative = path.slice()[1..]; // `RESOLVE_BENEATH` refuses an absolute path.
    assert(relative.len < limits.path_size_max);
    var name: [limits.path_size_max:0]u8 = undefined;
    @memcpy(name[0..relative.len], relative);
    name[relative.len] = 0;

    var how: OpenHow = .{
        .flags = @as(u32, @bitCast(linux.O{ .ACCMODE = .RDONLY, .CLOEXEC = true })),
        .mode = 0,
        .resolve = resolve_beneath | resolve_no_symlinks | resolve_no_magiclinks,
    };
    const result = linux.syscall4(
        .openat2,
        @as(usize, @bitCast(@as(isize, from(context).root_fd))),
        @intFromPtr(&name),
        @intFromPtr(&how),
        @sizeOf(OpenHow),
    );
    return switch (linux.errno(result)) {
        .SUCCESS => @fromBackingInt(@intCast(result)),
        .XDEV, .LOOP => error.PathOutsideRoot,
        else => error.FileNotFound, // A disk error is a missing file to the client.
    };
}
```

- **The path is made relative**, because `RESOLVE_BENEATH` refuses an
  absolute one; the root is the directory the descriptor names.
- **A symlink anywhere on the way is refused**, not followed and checked. A
  service that must follow symlinks inside its root uses `RESOLVE_IN_ROOT`
  instead, and says why.
- **Escaping is its own error**, `PathOutsideRoot`, so it can be counted; the
  client gets the same `404` as for a missing file
  ([one switch](./service-loop.md#one-place-where-every-failure-is-answered)).
  A new error in `OpenError` would not compile until that switch answered it.
- **It is compiled for Linux on every machine**: the build has a step that
  compiles this adapter for `x86_64-linux`, so it cannot rot on a laptop
  that never runs it.

The two checks are a pair: the parser's, on the bytes, and the kernel's, on
the disk ([in pairs](../safety/assertions.md#in-pairs)). Opening a file can
block on a slow disk; where that call runs is an open question
([work that blocks](../open-questions.md#work-that-blocks)).

## A request, or not yet

The head arrives in pieces. `parse_request` answers one of three things: an
error, "not yet" — `null` — or a filled `Request`:

```zig
/// Null while the head is incomplete. `buffer` is what has arrived so far.
pub fn parse_request(target: *Request, buffer: []const u8) RequestError!?void {
    const head_end = std.mem.indexOf(u8, buffer, "\r\n\r\n") orelse {
        if (buffer.len >= limits.request_header_size_max) return error.HeaderTooLarge;
        return null;
    };
    const head_size = head_end + 4;
    if (head_size > limits.request_header_size_max) return error.HeaderTooLarge;

    var lines = std.mem.splitSequence(u8, buffer[0..head_end], "\r\n");
    const request_line = lines.next() orelse return error.RequestMalformed;
    try parse_request_line(target, request_line);

    target.range = null;
    var headers_count: u32 = 0;
    while (lines.next()) |line| {
        if (headers_count == limits.request_headers_count_max) return error.HeadersTooMany;
        headers_count += 1;
        const header = try parse_request_header(line);
        if (std.ascii.eqlIgnoreCase(header.name, "range")) target.range = header.value;
    }
    target.head_size = @intCast(head_size);
    assert(target.head_size <= buffer.len);
}
```

The `Range` header is kept unparsed. Whether `bytes=10-99` is satisfiable
depends on the file's size, which is known only after the file is opened —
so the range is parsed there, once, and not twice.

Its error set joins the path's, and the door names it:

```zig
pub const RequestError = error{
    HeaderTooLarge,
    HeadersTooMany,
    MethodNotAllowed,
    RequestMalformed,
    VersionNotSupported,
} || files.PathError;
```

## A range inside the file

`parse_range` is shown whole in [errors](../safety/errors.md#input-is-parsed-once-at-the-boundary).
What matters here is its last two lines:

```zig
assert(range.size > 0);
assert(range.offset + range.size <= file_size);
```

From the moment a `Range` exists, it is a range inside the file. The code
that sends the body asserts it, and does not test it
([the data plane](./service-loop.md#the-data-plane)).

One decision is a choice, not the standard's: a malformed `Range` is refused
with `400`. HTTP allows a server to ignore it and send the whole file; this
one refuses, so that a client's mistake is visible to the client.

## What leaves

The response head is written into the connection's buffer by one function,
which asserts its own consistency and turns a buffer that is too small into
an error, not an overflow:

```zig
/// Writes the status line and headers into `buffer`; returns the slice written.
pub fn write_head(buffer: []u8, head: ResponseHead) error{ResponseHeadTooLarge}![]const u8 {
    if (head.range) |range| {
        assert(head.status == .partial_content);
        assert(range.size == head.content_size);
    } else {
        assert(head.status != .partial_content);
    }

    var writer: std.Io.Writer = .fixed(buffer);
    write_head_fields(&writer, head) catch return error.ResponseHeadTooLarge;
    return writer.buffered();
}
```

What leaves is `writer.buffered()` — the bytes written, never the whole
buffer, which still holds the end of the request
([a buffer is fully written](../safety/memory.md#a-buffer-is-fully-written)).

Next: [the loop](./service-loop.md).
