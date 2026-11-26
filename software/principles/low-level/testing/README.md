# Testing

A test is part of the thing it tests. In Zig that is literal: a `test` block
sits in the file, beside the function, and moves and dies with it. A few
tiers guard different edges, from one function's decision to the real system,
and each stays at its own edge.

**Tests are a tool, not a dogma.** A test that has lost its subject is
removed the same day. What is not negotiable is the small set of
[guards](./guards.md) that stand where leaving the road is expensive, and the
discipline that makes every other test worth having: it is deterministic, and
it looks where the bugs are.

## In one line

**A test lives in the file it tests, replays from one seed, and spends most
of its effort on what must not happen.**

## Where a test lives

| Behaviour | Its tests |
|---|---|
| a function | `test` blocks in its file |
| a box as a whole | `test` blocks in its door |
| the whole program | the simulation, beside `main` |
| a rule of these documents | the guards, in one file beside `main` |

A file's tests are found by the same path as its code, and a failing one
names the file. A helper used by several files' tests is in `core`, under a
name that says it is for tests, and is not compiled into the release.

## The tiers

| Tier | Guards | Runs |
|---|---|---|
| **unit** | one function's decisions: the valid, the invalid, the edge | in the one command |
| **random** | one box under thousands of generated inputs, with its assertions as the oracle | in the one command, from a fixed seed; longer and with fresh seeds, continuously |
| **simulation** | the whole program against a simulated world — a clock, a network and a disk, or a board — with faults injected | the same |
| **live** | the boundary with the real system — a real kernel and socket, or the real board | its own command |

One edge per tier. A decision is proven once, by a unit test where it is
made. The random tier adds what nobody thought to write down; the simulation
adds what only shows when boxes meet under failure; the live tier adds only
what a simulation cannot say — that the real system behaves as the simulated
one was told it does. Details are in [`tiers.md`](./tiers.md).

## A test is deterministic

A test that fails once and passes on the next run has found a bug and thrown
it away. So nothing in a test depends on the moment it ran:

- **Time is passed in.** A box reads a clock it was given; a test gives it
  one that moves when told.
- **Randomness is passed in**, from a generator made from one **seed**.
- **I/O is passed in.** A test gives a box a network, a disk or a board that
  are data structures, and decides what they answer and when they fail.
- **The seed is printed on failure and can be given back.** The same seed is
  the same run, to the byte.

This is why those dependencies are parameters and not globals
([the composition root](../structure/boxes.md#the-composition-root)). The
one command uses a fixed seed, so that it fails only when the code changed;
fresh seeds are tried by a run that is allowed to find something new.

## The negative space

Most bugs are not in what the code does with good input. They are in what it
does with bad input, at a limit, and when something fails
([both spaces](../safety/assertions.md#both-spaces)). A test goes there on
purpose:

- **Invalid input**, in every way the parser names an error for — and random
  bytes, to find the ways it does not.
- **Each limit at its edge**: one below, exactly at, one above.
- **Every error path**: each error a function can return is caused by some
  test, and what the function left behind is checked.
- **An allocation that fails.** Initialisation is run with an allocator that
  fails at the first allocation, then the second, and so on, and must leak
  nothing each time.
- **Valid data becoming invalid**: a file that shrinks while it is being
  sent, a connection that closes mid-header.

```zig
test "parse_range: no input breaks an assertion" {
    var prng: std.Random.DefaultPrng = .init(seed());
    const random = prng.random();

    var buffer: [32]u8 = undefined;
    const alphabet = "bytes=-0123456789 x";
    const rounds_max: u32 = 10_000;
    var round: u32 = 0;
    while (round < rounds_max) : (round += 1) {
        const size = random.uintLessThan(u32, buffer.len + 1);
        for (buffer[0..size]) |*byte| byte.* = alphabet[random.uintLessThan(u32, alphabet.len)];
        const file_size = random.intRangeAtMost(u64, 1, 1 << 40);

        const range = parse_range(buffer[0..size], file_size) catch continue;
        try std.testing.expect(range.offset + range.size <= file_size);
    }
}
```

The alphabet is the parser's own characters, so that most inputs get past
the first check. Random bytes would test only the first `if`.

## One command

The gate is one command: format, build, every unit and random test from the
fixed seed, a short simulation, and the guards
([one command checks everything](../toolchain/README.md#one-command-checks-everything)).
The long runs and the live tier have their own commands beside it, and CI
runs those same commands.

## In this folder

| File | What it holds |
|---|---|
| [`tiers.md`](./tiers.md) | What each tier guards, how a random test and a simulation are built, and what each cannot see. |
| [`guards.md`](./guards.md) | The enforcement table: what checks each guarded rule, the failure it reports, and what it cannot see. |
