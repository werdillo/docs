# Assertions

## What an assertion is for

An assertion states what must be true if the code is correct. A broken one
means the code is wrong, and the only correct answer to wrong code is to
stop: a program that carries on past a broken invariant is computing with
values it does not understand.

- **It turns a correctness bug into a crash.** Corruption that would have
  spread quietly becomes a stop with a line number. A crash is recoverable —
  the process restarts, the chip resets; a wrong byte sent to a client or a
  wrong value sent to a motor is not. What a crash does is the
  [kind's](../kinds/README.md#one-rule-four-realisations).
- **It multiplies what a test finds.** A random test only notices a bug that
  breaks something it checks. With assertions in the code, every invariant is
  checked on every run of every test.
- **It is documentation that cannot go stale.** A comment that says "never
  null here" is a hope; an assertion is a fact, or a failure.

## Never on input

An assertion is for a **programmer's error**. What a client sends, what a
disk or a sensor returns, what the operator configured — the outside is
allowed to be wrong, and that is an **operating error**: a value, handled
([two kinds of failure](./errors.md#two-kinds-of-failure)).

The test is who could have caused it. If a client can break the condition by
sending the right bytes, asserting on it hands the client a way to stop the
server. Past the boundary, where input has become the program's own types,
the same condition *is* asserted — now it says the parser did its job.

## Where they go

- **A function's arguments**: what it requires of its caller. A function does
  not work blindly on data it has not checked.
- **A function's result**, before it is returned: what it promises.
- **An invariant of a structure**, after it is changed: the count still
  matches, the state is one of the legal ones.
- **The other branch**: where an `if` has no `else` because the other case
  cannot happen, the `else` asserts that.
- **Something critical and surprising**, in place of a comment — an assertion
  that is obviously true to its author and not to the next reader.

**About two per function, on average.** It is a signal, not a quota: a
function with none is asked what it assumes, and a pure three-line helper may
honestly assume nothing. No test counts them.

**An assertion is a net, not the understanding.** The order is: build a
precise model of the code, write the model down as assertions, write the code
and the comments so that a reviewer can check both, and only then let the
tests look for where the model was wrong.

## In pairs

For a property worth enforcing, find two places to assert it, on two
different paths. The second catches what the first one's author got wrong.

- Before a block is written to disk, and after it is read back.
- Where a handle is given out, and where it is taken back.
- In the function that computes a size, and in the one that uses it.

## Both spaces

Assert what is expected — the **positive space** — and what must never be
seen — the **negative space**. Bugs live where data crosses from one to the
other.

```zig
const range: Range = .{
    .offset = first,
    .size = @min(last, file_size - 1) - first + 1,
};
assert(range.size > 0);
assert(range.offset + range.size <= file_size);
```

The first says the range is something; the second says it is not too much.
The same pairing is why a test tries invalid data and not only valid
([the negative space](../testing/README.md#the-negative-space)).

## At compile time

A relation between constants, a struct's size, the fit of a type into a
buffer — these are checked before the program exists:

```zig
comptime {
    assert(request_header_size_max <= request_buffer_size);
    assert(path_size_max < request_header_size_max);
}
```

A compile-time assertion costs nothing at run time and cannot be missed by a
test. It checks the design itself: the relations a future change would break
without anyone noticing.

## How they are written

- **One condition per assertion.** `assert(a); assert(b);`, not
  `assert(a and b);` — it reads more easily and the failure says which.
- **An implication is a one-line `if`**: `if (a) assert(b);`.
- **`std.debug.assert`, imported once per file** as `assert`.
- **No side effect inside.** The condition only reads.
- **`unreachable` is an assertion** that control cannot arrive here, and is
  held to the same rule: only where the code itself guarantees it, never
  where input could arrive.
- **An expensive check** — a walk of a whole structure — is a function named
  for what it verifies, called under a constant that the tests turn on.

## They ship

Assertions stay on in the release. In Zig a failed `assert` in a safe build
is a panic with a trace; in an unsafe build it is undefined behaviour, which
is worse than not having written it. So the release is built safe
([the safety checks ship](../toolchain/README.md#the-safety-checks-ship)).

The cost is real and small, and it is paid in the control plane, which runs
once per job. In the data plane, where it would be paid per byte, the
check is made once per batch, at the edge of the loop
([control plane and data plane](../performance/planes.md#control-plane-and-data-plane)).
