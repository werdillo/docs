# Measuring

A claim about speed is a number, and a number comes from a benchmark with a
budget. This page is how one is written.

## A claim is a number

- **"Faster" is a benchmark**, with its input, its machine and its result
  written beside it. A change made for speed without one is a change made for
  taste.
- **A benchmark states its budget** — the number it must stay under — and
  lives in the tree beside what it measures, so that it runs again when the
  code changes.
- **Measure the whole and the tail.** Throughput hides stalls; the 99th
  percentile and the maximum are where an unbounded thing shows itself.
- **A measurement that contradicts the sketch is a finding.** Either the
  design is not what was built, or the model was wrong; both are worth
  knowing before the next decision is made on it.

### A benchmark

A benchmark is a small program with its budget, run by a step of its own in
the mode that ships:

```zig
/// About 350 ns measured on an Apple M-series core, with room for noise. A slower machine
/// sets its own budget in its conventions.
const budget_ns_per_request: u64 = 500;
const warmup_rounds: u32 = 10_000;
const rounds: u32 = 1_000_000;
```

```zig
pub fn main(init: std.process.Init) !void {
    var request: http.Request = undefined;
    for (0..warmup_rounds) |_| try parse_one(&request);

    const start = std.Io.Clock.awake.now(init.io);
    for (0..rounds) |_| try parse_one(&request);
    const elapsed = start.durationTo(std.Io.Clock.awake.now(init.io));

    const ns_per_request: u64 = @intCast(@divTrunc(elapsed.nanoseconds, rounds));
    std.debug.print("parse_request: {d} ns per request, budget {d}\n", .{
        ns_per_request, budget_ns_per_request,
    });
    if (ns_per_request > budget_ns_per_request) return error.OverBudget;
}

fn parse_one(request: *http.Request) !void {
    // The input is opaque to the optimiser, so the work cannot be folded away.
    var bytes: []const u8 = head;
    std.mem.doNotOptimizeAway(&bytes);
    const parsed = try http.parse_request(request, bytes);
    std.debug.assert(parsed != null);
    std.mem.doNotOptimizeAway(request);
}
```

```zig
// Benchmarks run in the mode that ships, whatever mode the tests use.
const bench_boxes = modules(b, target, .safe);
const bench = b.addRunArtifact(b.addExecutable(.{
    .name = "bench",
    .root_module = root_module(b, "bench/parse_request.zig", target, .safe, &bench_boxes),
}));
bench.has_side_effects = true;
b.step("bench", "Run the benchmarks against their budgets").dependOn(&bench.step);
```

- **The clock is `std.Io.Clock.awake`**, a monotonic clock reached through
  the I/O `main` is handed.
- **A warm-up comes first**, so the measurement does not include the first
  touches of the code and the data.
- **`std.mem.doNotOptimizeAway`** on the input and the output, so the
  optimiser cannot fold the work into a constant.
- **The budget fails the step.** Measured three times, the parser took 353
  to 376 ns per request on the machine it was written on, and the budget is
  500 — room for noise, not for a regression. A budget is set from a
  measurement; one set before it is a guess, and passes or fails for the
  wrong reason.
- **It is not cached** (`has_side_effects`), because a cached result is a
  measurement of yesterday. It is not in the one command either: its answer
  depends on the machine, and a gate must not
  ([benchmarks are not a tier](../testing/tiers.md#benchmarks-are-not-a-tier)).
