# Boxes

## The layers

`src/` has three layers, and an import points down:

```
core  ←  boxes  ←  main
```

- **`core`** knows no subject of this program. The test is whether another
  program could use the file unchanged: a pool, a ring buffer, the locked
  allocator, a parser of a format that a standard defines. It imports the
  standard library and nothing else of the program.
- **The boxes** are the program's subjects. They are **ordered** by the
  **layer map**, and a box imports only boxes before it in the map.
- **`main`** is the composition root. It imports any box and is imported by
  nothing.

`limits` is a box at the bottom of the map that every box above may import:
it is constants, and it is the one thing every box may know about the whole.

## A box

A box is one subject: one purpose, its own state, opaque from outside.

- **It is a folder, and a build module.** Its root file is `root.zig`, which
  is its door; a small box is that one file. A box that grows adds files
  beside it, and no importer changes, because importers name the module, not
  a file.
- **It owns its state.** Its struct holds what it was given; nothing outside
  writes its fields. A neighbour that needs to refer to something inside
  holds a handle ([one owner](../safety/memory.md#one-owner-and-handles-for-the-rest)).
- **It takes what it needs as arguments**: memory, its limits, the
  interfaces it calls, I/O. It reaches for nothing global.
- **It has the same shape as the others**: `init` that takes its memory and
  can fail, `deinit`, and after that, functions that neither allocate nor
  block.
- **Inside, its data is laid out for its loops**, not for how the subject
  is described: a struct of arrays, hot and cold apart. Callers hold
  handles, so the layout can change behind the door without them
  ([data layout](../performance/data-layout.md#boxes-by-subject-layout-by-loop)).
- **It says what it is in its first lines.** A `//!` comment at the top of
  `root.zig`: what the box is for and the rule a reader must not break. A box
  that needs more has a `README.md` in its folder.

## The door

A box's `root.zig` is its door, and the only file a neighbour reaches:

```zig
const files = @import("files");     // a neighbour: by module name, through its door
const range = @import("range.zig"); // a file of this box: by path
```

The difference is visible in the text: a name is a neighbour, a path ending
in `.zig` is home. And the compiler holds it, because each box is its own
module:

| What is tried | What the compiler says |
|---|---|
| a path out of the box's folder, `@import("../files/open.zig")` | `import of file outside module path` |
| a box the layer map did not give it, `@import("http")` from `files` | `no module named 'http' available within module 'files'` |
| `main` importing a box's inner file by path | `file exists in modules 'root' and 'http'` |

- **`pub` in `root.zig` is the box's whole surface.** Files behind it mark
  things `pub` for their siblings; only what `root.zig` re-exports leaves.
- **The door holds the box's main type and re-exports**, not a second copy of
  the logic.
- **A door exports types and functions, never mutable state.** A `pub var` is
  a global with a longer name.
- **A door's functions name their error sets**
  ([error sets are named](../safety/errors.md#error-sets-are-named)).

`main.zig` is not a door: it is the executable's root, the one file nothing
imports. A library's `root.zig` is the library's door, and the same file
`zig init` makes ([a library](../kinds/library.md#its-surface-is-the-door)).

## The layer map is the build

The map is an ordered list in `build.zig`. The build makes one module per
box, in that order, and gives each only the boxes it names — which must
already exist. The same function builds the boxes for every target and mode
the build needs — the tests, the release, a cross-compiled check:

```zig
/// The layer map: a box may import only the boxes listed before it, so no cycle can be built.
const layer_map = [_]Box{
    .{ .name = "limits", .imports = &.{} },
    .{ .name = "core", .imports = &.{} },
    .{ .name = "files", .imports = &.{ "limits", "core" } },
    .{ .name = "http", .imports = &.{ "limits", "core", "files" } },
    .{ .name = "server", .imports = &.{ "limits", "core", "files", "http" } },
};

const Box = struct { name: []const u8, imports: []const []const u8 };

fn modules(
    b: *std.Build,
    target: std.Build.ResolvedTarget,
    optimize: std.lang.Optimize,
) [layer_map.len]*std.Build.Module {
    var boxes: [layer_map.len]*std.Build.Module = undefined;
    for (layer_map, 0..) |box, box_index| {
        const module = b.createModule(.{
            .root_source_file = b.path(b.fmt("src/{s}/root.zig", .{box.name})),
            .target = target,
            .optimize = optimize,
        });
        for (box.imports) |name| module.addImport(name, boxes[layer_index(name, box_index)]);
        boxes[box_index] = module;
    }
    return boxes;
}

/// The index of `name` among the boxes below `importer_index`; a box above it is a build error.
fn layer_index(name: []const u8, importer_index: usize) usize {
    for (layer_map[0..importer_index], 0..) |box, index| {
        if (std.mem.eql(u8, box.name, name)) return index;
    }
    std.debug.panic("box '{s}' imports '{s}', which is not below it in the layer map", .{
        layer_map[importer_index].name, name,
    });
}
```

Zig itself allows two modules to import each other; this build cannot
express it, because a box can be given only what was built before it. An
upward arrow stops the build with the sentence in `layer_index`.

**When a lower box needs to tell a higher one something**, it does not import
it. It returns a value the higher one reads on its tick, or it takes an
interface — a type with one job, declared in the lower box and filled by
`main`. The arrow stays down.

**The map is a decision.** A new box is placed in it deliberately, and its
line says, in one place, everything it depends on.

## The composition root

`main.zig` is the entry point and the only place that knows every box. It:

1. reads the configuration and refuses a value outside the
   [limits](../safety/limits.md#limits-live-in-one-file);
2. creates the startup allocator, where the kind allocates;
3. builds each box in the order of the layer map, handing it its memory, its
   limits, its I/O and the boxes it uses;
4. [locks the allocator](../safety/memory.md#the-allocator-is-locked);
5. runs the loop.

```zig
var static: core.StaticAllocator = .{ .parent = std.testing.allocator };
var server = try server_box.Server.init(static.allocator(), world.network(), world.disk(), .{
    .connections_max = connections_max,
});
static.lock();
```

That is the simulation's composition root, from
[the example](../example/service.md#the-composition-root). A service's `main`
is the same lines with the real network and disk, the limits from the limits
file, and the loop after the lock; firmware's is
[`reset_handler`](../example/firmware-loop.md#the-entry-point).

**What is passed in, never reached for:**

| Dependency | Why it is passed |
|---|---|
| an allocator | so that startup is the only time one is in hand |
| the clock | so that a test can move time |
| randomness | so that a seed replays a run |
| I/O — `std.Io`, or the board | so that a test can run the whole program against a simulated world, and inject faults |
| the limits a box is sized by | so that a test can build a box of four slots |

Zig's standard library takes the same view: `std.Io` is an interface that
`main` is handed and passes on, and a file, a socket and the clock are
reached through it. They are threaded through `init` positionally, from the
most general to the most specific. A box that takes its clock as an argument
is deterministic under test for free
([a test is deterministic](../testing/README.md#a-test-is-deterministic)).

**No global mutable state.** No top-level `var`, no singleton reached by
name. A global is a dependency that no signature shows, an owner nobody can
name, and a test that cannot run twice in one process.

Firmware has two exceptions, both named and both in one place. The
hardware's registers are global by nature, and are reached only through the
board box. And static memory may be a top-level `var` in `main` — owned there
and handed to the boxes, as allocated memory would be
([firmware](../kinds/firmware.md#the-hardware-is-one-box)).

A library has no `main`: its composition root is the caller's, and its
`init` takes what `main` would have handed it
([a library](../kinds/library.md)).

## Where one box ends

A box is drawn around a subject. The questions, in order:

1. **Can its purpose be said without an "and"?** "Parses HTTP requests" is a
   box. "Parses requests and reads files" is two.
2. **Does it have state of its own?** A pool, a table, a buffer that it alone
   changes. Code with no state and no subject is a file in `core`, or a file
   inside the box that uses it.
3. **Does it change as one?** What is edited together belongs together; what
   changes for a different reason — the wire format and the cache's eviction
   — is a different box.
4. **Would the layer map still be a list?** If the new box and an old one
   need each other, the cut is in the wrong place.

A box is not drawn around a technical kind. `utils`, `types`, `helpers` and
`common` are not subjects; what is in them belongs to the box that uses it or
to `core` under a name that says what it is.

## Sizes

- **Up to about 10 boxes in the map.** Past that the map stops being
  something a person holds in their head, and the question is which boxes
  form a **group**: a folder of boxes with a `root.zig` of its own, one line
  in the outer map, and its own small map inside.
- **A file is one subject.** With its tests in it, about 500 lines is where
  the question of what to split out is asked; the split adds a file beside
  it, in the same box.
- **A function is at most 70 lines** — the one size that is a rule, not a
  signal ([a function fits on a screen](./functions.md#a-function-fits-on-a-screen)).

The first two are signals: they ask a question and fail no test. A file of
600 lines that is one state machine read top to bottom is the shape working.
