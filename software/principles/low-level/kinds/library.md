# A library

Code another program builds in. It has no `main`, no loop of its own and no
right to stop the program it runs in for any reason but its own bug. Its
rules are the same; its composition root is the caller's.

## Memory is the caller's

- **The caller gives memory at `init`** — an allocator, or better a buffer —
  and the library takes everything it will ever need then. An operation after
  `init` does not allocate, so the caller can lock its allocator with the
  library inside ([the allocator is locked](../safety/memory.md#the-allocator-is-locked)).
- **Its sizes are the caller's limits.** The library's `init` takes an
  options struct of the counts it is sized by, and documents what each costs
  in bytes; its own limits file holds only the ranges those may fall in.
- **No global state.** Two instances in one process, in one test, must work.

## Its loop is the caller's

A library that has ongoing work offers a bounded step — a `tick` that does at
most a batch — and the caller decides when to call it
([its own pace](../safety/control-flow.md#the-program-runs-at-its-own-pace)).
It does not start a thread, and it does not block unless that is its whole
purpose and its name says so.

## What it asserts

The caller's arguments are the library's outside, and the caller's program is
what stops if an assertion breaks. So:

- **What the caller can get wrong through a public function is an error
  value**, named in the door's error set
  ([error sets are named](../safety/errors.md#error-sets-are-named)).
- **A precondition that only a broken caller would miss** — a handle used
  after `deinit`, a buffer smaller than the documented size — is asserted,
  and the door's comment says so. Breaking it is the caller's bug.
- **The library's own invariants** are asserted as everywhere.

## Its surface is the door

The library's root file is its door: what it marks `pub` is the whole API,
and the build exposes that one file as the module others import. A change to
it is a change to every caller, and it is written with that care.

## A WebAssembly module

A module for WebAssembly is a library whose caller is a host — a browser, a
JavaScript runtime, a plug-in system — and the rules hold with the host in
the caller's place. It is built for `wasm32-freestanding`: no OS, no files,
no clock unless the host imports one.

- **Its memory is its own linear memory, fixed at compile time.** The host
  writes the input into a buffer the module exports and reads the output
  from another; nothing is allocated, and the memory does not grow while it
  works:

  ```zig
  /// The module's memory is its own, fixed at compile time; the host reaches it only here.
  /// Top-level `var` is valid here: WebAssembly linear memory is per-instance, so two
  /// instances share no state.
  var input: [input_size_max]u8 = undefined;
  var output: [output_size_max]u8 = undefined;
  ```

- **The host's arguments are the outside.** A size past the buffer is an
  error value the host can read, not an assertion:

  ```zig
  /// Returns the size written to `output`, or zero when `input_size` is past the limit.
  export fn run(input_size: u32) u32 {
      if (input_size > input_size_max) return 0; // The host's argument: an error, not an assertion.
      const source = input[0..input_size];
      for (output[0..input_size], source) |*target, byte| target.* = std.ascii.toUpper(byte);
      assert(input_size <= output_size_max);
      return input_size;
  }
  ```

- **A crash is a trap.** A broken assertion or a safety check stops the
  call, and the host sees a runtime error; there is no one to print to, so
  the panic handler is `@trap()`.
- **The safety checks still ship, and their messages are the cost.** The
  module above, built three ways:

  | Build | Size |
  |---|---|
  | `.safe`, `std.debug.FullPanic` with a handler that traps | 20,668 bytes |
  | `.safe`, `std.debug.no_panic` | 7,215 bytes |
  | `.small` | 239 bytes |

  `FullPanic` formats a message for every check, which a trap then throws
  away; `std.debug.no_panic` keeps every check as a bare trap — an index
  past an array is still `RuntimeError: unreachable`, not a read past it.
  The standard library describes `no_panic` as for testing, so a project
  that ships it says so in its conventions, with the size that made it worth
  it ([the safety checks ship](../toolchain/README.md#the-safety-checks-ship)).
- **The exports are the door.** What the module exports is its whole
  surface, named and sized like a library's public functions; the host's
  side of each is written once, next to the module's build.

## Dependencies

A library adds its dependencies to every program that uses it, so the rule
of none by default is firmer here
([no dependencies](../toolchain/README.md#no-dependencies-by-default)).
