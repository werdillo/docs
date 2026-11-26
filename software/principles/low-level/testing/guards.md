# The guards

A few checks stand where leaving the road is expensive. Four kinds do the
work, and each rule is given to the strongest one that can hold it:

1. **The compiler.** What the type system or a compile-time assertion can
   say is said there, and cannot be skipped.
2. **A running assertion.** What can only be known at run time is asserted in
   the code, and so is checked in every test and in production.
3. **The build.** What is a rule about which box may import which is held
   by `build.zig`, which builds the modules.
4. **A test that reads source.** What is a rule about text is checked by a
   test — conventionally called *tidy* — that walks `src/`.

Every rule a guard holds stays in the folder that owns it; this page
describes the **check**.

## Enforcement

| Rule | Checked by | Fails on |
|---|---|---|
| [Limits live in one file](../safety/limits.md#limits-live-in-one-file) | the compiler | a relation between two limits that no longer holds |
| [All memory is fixed before the work begins](../safety/memory.md#the-allocator-is-locked) | a running assertion | an allocation, a resize or a free after the lock |
| [Every error is handled](../safety/errors.md#every-error-is-handled) | the compiler; tidy | an unused error union; `catch {}`; `catch unreachable` with no comment on its line; `anyerror` in a door |
| [The safety checks ship](../toolchain/README.md#the-safety-checks-ship) | the build; tidy | a release step in an unsafe mode; `@setRuntimeSafety(false)` outside the known list |
| [The layers](../structure/boxes.md#the-layer-map-is-the-build) | the build; the compiler; tidy | a box that names one not below it in the layer map; an import of a box it was not given; a folder in `src/` that is not on the map |
| [The doors](../structure/boxes.md#the-door) | the compiler; tidy | a path out of a box's folder; a box's inner file imported from outside it; a `pub var` in a `root.zig` |
| [A function fits on a screen](../structure/functions.md#a-function-fits-on-a-screen) | tidy | a function longer than 70 lines |
| [Format and line length](../structure/style.md#by-the-numbers) | the formatter; tidy | a file the formatter would change; a line longer than 100 columns |
| [No dependencies by default](../toolchain/README.md#no-dependencies-by-default) | tidy | a dependency in the build manifest that is not on the recorded list |

Everything not in this table is a default, held by review.

## Layers and doors

Both are held by the build and the compiler, because each box is a module
([the layer map is the build](../structure/boxes.md#the-layer-map-is-the-build)).

- **Does it point down?** `build.zig` gives a box only boxes built before it,
  and stops with a sentence when a line of the map names one above. Zig would
  allow a cycle between modules; this build cannot make one.
- **Does it go through the door?** A box's module path is its folder, so a
  path out of it is a compile error, and a file can belong to one module
  only, so no one else can import it by path.
- **Is every box on the map?** A small tidy check compares the folders in
  `src/` with the map's names, so that a folder is not left outside every
  module, where the compiler would not see it.

**Cannot see:** an interface filled by `main` that lets a lower box call a
higher one. That is the allowed way up, and review decides whether it was
needed ([the composition root](../structure/boxes.md#the-composition-root)).

## Text rules

These read the text of each file. They are ordinary tests in a file of their
own, `tidy.zig`, that walk `src/` through `std.Io.Dir`; a reference version
is in the [example](../example/service-tests.md#the-guards).

```zig
const lines_max: u32 = 16 * 1024;

/// Text that never appears outside a test, and what to write instead.
const banned = [_]struct { text: []const u8, instead: []const u8 }{
    .{ .text = "catch {}", .instead = "handle the error, or `catch unreachable` with a reason" },
    .{ .text = "@setRuntimeSafety(false)", .instead = "a known-list entry with its benchmark" },
};

/// Exceptions, each with its reason. An entry that no longer matches fails, so the list shrinks.
const known = [_]struct { path: []const u8, rule: []const u8, reason: []const u8 }{};

/// Recorded dependencies allowed in `build.zig.zon`, each with its reason in project conventions.
const recorded_dependencies = [_][]const u8{};
```

```zig
/// Strips any trailing `//` comment and spaces so syntax checks ignore comments.
fn strip_comment(line: []const u8) []const u8 {
    const end = std.mem.indexOf(u8, line, "//") orelse line.len;
    return std.mem.trimEnd(u8, line[0..end], " \t\r");
}

/// The first line of a function longer than the limit, or null. Relies on the formatter: a
/// function ends at the first `}` with its own indentation. A function that returns a type
/// is a type's body, and its methods are counted instead.
fn tidy_function_length(source: []const u8) error{FileTooLong}!?u32 {
    var lines: [lines_max][]const u8 = undefined;
    var lines_count: u32 = 0;
    var split = std.mem.splitScalar(u8, source, '\n');
    while (split.next()) |line| {
        if (lines_count == lines_max) return error.FileTooLong;
        lines[lines_count] = line;
        lines_count += 1;
    }
    for (lines[0..lines_count], 0..) |line, start| {
        const trimmed = std.mem.trimStart(u8, line, " ");
        if (!function_begins(trimmed)) continue;
        if (function_returns_type(lines[start..lines_count])) continue;

        const indent = line.len - trimmed.len;
        const length = function_length(lines[start..lines_count], indent) orelse continue;
        if (length > function_length_max) return @intCast(start + 1);
    }
    return null;
}

fn function_returns_type(lines: []const []const u8) bool {
    for (lines) |line| {
        const code = strip_comment(line);
        if (std.mem.endsWith(u8, code, "{")) return std.mem.endsWith(u8, code, ") type {");
    }
    return false;
}

/// Checks a non-test line for `catch unreachable` without a reason, and a door (`root.zig`)
/// for `anyerror` or `pub var`.
fn check_line(line: []const u8, is_door: bool) ?[]const u8 {
    const code = strip_comment(line);
    if (std.mem.indexOf(u8, code, "catch unreachable") != null and
        std.mem.indexOf(u8, line, "//") == null)
    {
        return "`catch unreachable` requires a `//` comment on the same line stating why";
    }
    if (is_door) {
        if (std.mem.indexOf(u8, code, "anyerror") != null) return "`anyerror` in a door";
        if (std.mem.indexOf(u8, code, "pub var ") != null) return "`pub var` in a door";
    }
    return null;
}

/// Checks `build.zig` for unsafe release mode and `build.zig.zon` for unrecorded dependencies.
fn check_build_files(build_zig: []const u8, build_zon: []const u8) ?[]const u8 {
    if (std.mem.indexOf(u8, build_zig, ".fast") != null) {
        return "release mode `.fast` is forbidden; use `.safe` (or `.small` when measured)";
    }
    if (std.mem.indexOf(u8, build_zon, ".dependencies") != null) {
        if (!all_dependencies_recorded(build_zon, &recorded_dependencies)) {
            return "unrecorded dependency in `build.zig.zon`";
        }
    }
    return null;
}
```

- **Line length** counts bytes per line. A line that is one long string
  literal or a URL is the only kind worth a known-list entry.
- **Function length** counts lines from a line that begins a function to the
  line of its closing brace at the same indentation. It relies on the
  formatter's layout, which is why the format check runs first. A function
  that returns a type — a generic container — is a type's body, not a
  function's, so the guard counts the methods inside it instead. A file past
  `lines_max` fails with `error.FileTooLong` rather than asserting on file
  input.
- **Banned text** (`catch {}`, `@setRuntimeSafety(false)`) never appears
  outside a test, and each entry says what to write instead.
- **`catch unreachable` without a comment** on the same line fails: every use
  states why the error cannot occur.
- **`anyerror` or `pub var` in a `root.zig`** fails: a door names its error
  set and exports functions, not mutable state.
- **Release mode in `build.zig`** fails on `.fast`: releases ship in `.safe`
  (or `.small` when a firmware image does not fit).
- **Every folder in `src/` is on the layer map**: the test reads `build.zig`
  and looks for each folder's name there, so a folder outside every module —
  where the compiler would not see it — cannot be left behind.
- **Dependencies in `build.zig.zon`**: every entry under `.dependencies` must
  appear in `recorded_dependencies`.

**The build must not cache them.** The test's binary does not change when
the files it reads change, so the build would replay its last result and
pass a violation. The step says so:

```zig
const tidy = b.addRunArtifact(b.addTest(.{
    .root_module = root_module(b, "src/tidy.zig", target, optimize, &.{}),
}));
tidy.setCwd(b.path("."));
// It reads files the build does not know it depends on: never cache its result.
tidy.has_side_effects = true;
test_step.dependOn(&tidy.step);
```

Each check was confirmed by breaking its rule on purpose: a `catch {}`, a
folder not on the map, a function past 70 lines. A guard that has never been
seen to fail has not been shown to work.

**Cannot see:** meaning. A banned construct spelled another way passes, and
a function split at line 70 into two halves that make no sense apart passes
too. The guard holds the number; review holds the reason for it.

## The locked allocator

Not a test but a wrapper around the allocator, in `core`
([the allocator is locked](../safety/memory.md#the-allocator-is-locked)).
It is the strongest of the guards because it runs everywhere: a unit test
that builds a box, locks, and calls its functions fails the moment one of
them allocates.

**Cannot see:** memory taken behind its back — a direct `mmap`, a C
library's `malloc`. Those do not appear outside `core`, by review.

## A known list, with reasons

A guard's exceptions are a list in the test. An entry names the file and the
violation and gives the reason it stays. The guard fails on a violation that
is not on the list, **and fails on an entry that no longer matches** — so the
list only shrinks, and a fixed exception cannot quietly come back.

A guard turned on in an existing program may start from today's violations
as its list. Two guards take no list at all: the formatter and the function
length. Their value is that nobody negotiates with them.

## A guard fails loudly

A failure names the file and the line, the rule in one sentence, and what to
do instead. A guard that prints a warning and passes is not a guard: nobody
reads a warning that does not stop the command.

## The order to adopt them

Add a guard when the thing it guards first exists.

1. **The first file** → the formatter, line length and function length.
2. **The first allocation** → the locked allocator.
3. **The second box** → the layer map in `build.zig`; the doors come with it.
4. **The first limit that depends on another** → its compile-time assertion.
5. **The first release build** → the safe mode and the banned-text rules.
6. **The first dependency** → the recorded list.
