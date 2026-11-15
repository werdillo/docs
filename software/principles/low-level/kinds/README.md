# Kinds of program

The rules hold for every kind of program; the kind decides how each is
realised. Four kinds cover most of what is written in Zig, and a program is
usually one of them — or a service or firmware built on libraries of its own.

| File | Kind |
|---|---|
| [`service.md`](./service.md) | A long-running process under an OS: a server, a daemon, a proxy, a storage engine. |
| [`firmware.md`](./firmware.md) | A program that is the only thing on its hardware: a microcontroller, no OS or a small RTOS. |
| [`library.md`](./library.md) | Code another program builds in: no `main`, the caller's memory, the caller's loop — and a WebAssembly module, whose caller is a host. |
| [`tool.md`](./tool.md) | A program that starts, does one job and exits: a CLI, a converter, a generator. |

## One rule, four realisations

| Rule | Service | Firmware | Library | Tool |
|---|---|---|---|---|
| **Memory is fixed before the work begins** | allocated at startup, sized from the limits; the allocator is locked | static, at compile time; the linker's map is the budget | the caller's: given at `init`, never asked for again | allocated at startup from the size of the job, or an arena freed at exit |
| **The main loop** | an event loop over the OS's readiness or completions | a super-loop, woken by interrupts or a timer | the caller's; the library offers a `tick` or a bounded step | none, or one over the input, bounded by its size |
| **"The outside"** | clients, the network, the disk, the operator | sensors, buses, radios, a user's buttons, power | the caller's arguments and the data it hands in | the command line, the files, the environment |
| **What a crash does** | the process exits; a supervisor restarts it | the panic handler records why, and the chip resets | the caller's program stops — so a library asserts only on its own invariants | the tool exits with a message and a non-zero code |
| **Resources in the sketch** | network, disk, memory, CPU | flash, RAM, cycles per deadline, power, bus bandwidth | what it costs its caller per call, and what it holds | input size, memory, wall time |
| **Global state** | none | the hardware, in one box; what an interrupt shares, in one place | none — two instances in one process must work | none |
| **The real-world tier** | a real kernel, a real port | the real board: hardware in the loop | the caller's own tests, and an example program | a real file system and a real shell |

Whatever the kind, the program's own logic is in boxes that do not know the
kind: a parser, a state machine, a protocol. They take their memory, their
clock and their I/O as arguments, and so run unchanged in a unit test on the
developer's machine, in a simulation, and on the target.
