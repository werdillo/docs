# Boundaries: wire formats, C FFI and secrets

How bytes cross the edge of a Zig program — onto a network, disk or radio, into
or out of C/C++ code, and when holding secret keys or tokens. Every boundary
rule extends [parsing input once](./errors.md#input-is-parsed-once-at-the-boundary)
and [sized types](./limits.md).

## In one minute

- **Never transmit a raw in-memory struct layout.** Serialise and deserialise
  with explicit byte order (`.little` or `.big`), a fixed version field,
  explicit length checks and a checksum where corruption is possible.
- **Every C library stops at one box's door.** No `@cImport` type or `[*c]`
  pointer crosses a door; C memory is bounded from outside; C errors map to a
  named Zig error set.
- **When exporting a C ABI**, every caller pointer and length is untrusted
  outside input — return an error code, never panic on caller mistakes.
- **Secrets are compared in constant time and zeroed on exit**, never left on
  the stack or logged.

## Wire and disk formats

A struct in memory belongs to one compiler and one CPU's endianness. Sending
`@mem.asBytes(&my_struct)` over a socket, radio or file hides padding bytes,
breaks across architectures and leaves no way to evolve the format.

- **Name the byte order once.** Pick `.little` or `.big` for the protocol and
  read/write integers explicitly with `std.mem.readInt` and `std.mem.writeInt`
  into a fixed-size buffer.
- **Carry a magic number and version byte.** Reject an unknown magic or
  unsupported version as an operating error before reading the payload. Removing,
  resizing or changing the meaning of a field bumps the version; additive fields
  claim reserved zeroed bytes only when older readers safely ignore them.
- **Check length before slicing, and verify checksums in pairs.** Compute the
  checksum on encode and verify it on decode before trusting any field
  ([in pairs](./assertions.md#in-pairs)).
- **No implicit padding.** Every byte in the frame is accounted for; reserved
  bytes are zeroed on write and checked or explicitly ignored on read.

```zig
pub const Header = struct {
    pub const magic: u32 = 0x4E4F_4445; // "NODE"
    pub const version_current: u8 = 1;
    pub const wire_size: u32 = 12;

    version: u8,
    kind: u8,
    payload_size: u16,
    sequence: u32,

    pub fn encode(self: Header, out: *[wire_size]u8) void {
        std.mem.writeInt(u32, out[0..4], magic, .little);
        out[4] = self.version;
        out[5] = self.kind;
        std.mem.writeInt(u16, out[6..8], self.payload_size, .little);
        std.mem.writeInt(u32, out[8..12], self.sequence, .little);
    }

    pub fn decode(bytes: *const [wire_size]u8) DecodeError!Header {
        if (std.mem.readInt(u32, bytes[0..4], .little) != magic) return error.BadMagic;
        const version = bytes[4];
        if (version != version_current) return error.UnsupportedVersion;
        return .{
            .version = version,
            .kind = bytes[5],
            .payload_size = std.mem.readInt(u16, bytes[6..8], .little),
            .sequence = std.mem.readInt(u32, bytes[8..12], .little),
        };
    }
};
```

## C and C++ FFI

Zig talks to C cleanly, which makes it tempting to let C habits leak into the
whole codebase. One box contains every boundary:

- **One box wraps the C library.** Only that box calls `@cImport` (recorded in
  the dependency list — [toolchain](../toolchain/README.md#no-dependencies-by-default)).
  Its door exposes plain Zig slices, sized integers and a named error set; no
  `[*c]`, `c_int` or raw C handle crosses the door.
- **Bound C's memory from outside.** Where the C library accepts custom
  allocation hooks or a caller-provided workspace, pass a fixed buffer sized
  from `limits`. Where it calls `malloc` directly, cap the maximum input size
  and active handle count before calling into C, and note the exception in the
  project's conventions.
- **Check every C return code and pointer immediately.** Translate `NULL`,
  negative return values and `errno` into the door's named error set, and pair
  every resource acquisition with `errdefer` / `defer` to call the C destroy
  function.
- **Null-terminated strings end at the boundary.** Convert bounded slices to
  sentinel-terminated copies inside a fixed scratch buffer when calling C, and
  measure C strings with `std.mem.sliceTo` against a maximum length — never
  unbounded `strlen`.
- **Exporting a C ABI from a Zig library** reverses the boundary: caller
  pointers may be `null`, lengths may exceed `limits`, and a panic crashes the
  host process. Validate every argument and return explicit integer status
  codes, reserving assertions strictly for the library's own internal
  invariants ([a library](../kinds/library.md#what-it-asserts)).

## Secrets in memory

Whenever a service, library or firmware handles authentication tokens, MACs,
keys or passwords:

- **Compare in constant time.** Use `std.crypto.timing_safe.eql` — never
  `std.mem.eql`, whose early exit leaks matching prefix length through timing.
- **Zero secret buffers before leaving scope.** Pair every secret stack or pool
  buffer with `defer std.crypto.secureZero(u8, &secret);` so the compiler
  cannot optimise the wipe away.
- **Never format secrets into logs or panic messages.** Redact keys and tokens
  at the type level (custom `format` prints `"[redacted]"`).

## Not this

- Sending `@mem.asBytes(&struct_value)` over TCP or radio without explicit
  endianness and a version byte — it breaks silently on a different CPU or
  after adding one field.
- Importing `@cImport` in three different boxes — C types spread across the
  codebase and cannot be swapped or simulated.
- Calling `std.mem.eql` on an HMAC or session token — that is a timing oracle.
- Asserting `ptr != null` on a pointer passed from a C caller — return an
  explicit `InvalidArgument` status code instead.
