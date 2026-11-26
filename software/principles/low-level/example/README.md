# Examples

Two programs, end to end: a service and a firmware. Each is small enough to
hold in a few pages and real enough to meet every rule. Every quote compiles
and passes its tests with Zig 0.17.1 — in the safe mode as well as in debug,
and the firmware also for a Cortex-M4 — but the projects it was cut from are
not part of these documents: the pages are the example, not a template to
copy. A `// …` marks where a quote is trimmed.

| Page | What it shows |
|---|---|
| [`service.md`](./service.md) | **A media file server** — the sketch, the tree, the layer map, the limits, the composition root. |
| [`service-boundary.md`](./service-boundary.md) | Bytes from a client become a path, a request and a range — or a refusal. |
| [`service-loop.md`](./service-loop.md) | The tick: accept, read, answer, send, time out; the two planes; one switch for every failure. |
| [`service-tests.md`](./service-tests.md) | Unit tests, random tests against a model, and a simulation that found two real gaps. |
| [`firmware.md`](./firmware.md) | **A sensor node** — the sketch, the tree, the board interface, the interrupt and its ring buffer. |
| [`firmware-loop.md`](./firmware-loop.md) | The super-loop, fixed-point filtering, a frame on the air, the registers, a crash that survives a reset. |
| [`firmware-tests.md`](./firmware-tests.md) | The host board, a simulated minute, and the image measured in both modes. |

## What to read for what

| Rule | Shown best in |
|---|---|
| everything has a limit, in one file | [service limits](./service.md#the-limits), [firmware limits](./firmware.md#the-limits) |
| memory fixed before the work begins | [the composition root](./service.md#the-composition-root), [static memory](./firmware-loop.md#the-entry-point) |
| input parsed once, at the boundary | [the boundary](./service-boundary.md) |
| assertions in pairs | [a range, made and used](./service-loop.md#the-data-plane) |
| every error handled, in one place | [one switch](./service-loop.md#one-place-where-every-failure-is-answered) |
| the program's own pace | [the tick](./service-loop.md#the-tick), [the interrupt](./firmware.md#the-interrupt-records-the-loop-works) |
| push `if`s up | [the parent step](./service-loop.md#one-function-branches) |
| one owner, handles | [the pool](./service.md#the-pool) |
| the hardware in one box | [the chip's board](./firmware-loop.md#the-registers) |
| deterministic tests, negative space | [the simulation](./service-tests.md#the-simulation) |

## What they leave out

The service has no real network adapter here: it runs against the
simulation, because how it sits on io_uring is an open question
([`std.Io` on io_uring](../open-questions.md#stdio-on-io_uring-and-the-tick)).
It also leaves out TLS, keep-alive, several ranges in one request and caching
headers. The firmware's register addresses are placeholders, and its linker
script and vector table are the chip's — MicroZig or the vendor's — not
shown.
