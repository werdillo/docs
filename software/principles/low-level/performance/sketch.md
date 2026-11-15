# The sketch

Before a design is written, its cost is estimated, and the estimate decides
where to look first. This page is the arithmetic.

## Sketch before building

Before a design is written, its cost is estimated on the back of an envelope:
each of the **target's resources**, in its **two characteristics** —
bandwidth and latency, or budget and deadline. On a server the resources are
network, disk, memory and CPU; on a chip, flash, RAM, cycles, power and the
buses ([a firmware sketch](../example/firmware.md#the-sketch)); for a library,
what each call costs its caller.

For a media server asked to stream to 4,000 clients:

| Resource | Bandwidth | Latency |
|---|---|---|
| **Network** | 4,000 × 8 Mbit/s = 32 Gbit/s — more than one 25 Gbit link; the limit is the link, or the bitrate | first byte: one round trip plus one disk read |
| **Disk** | 4 GB/s read if nothing is cached; an NVMe gives 3–7 | a cold read: ~100 µs on NVMe, ~10 ms on a spinning disk |
| **Memory** | 4,000 × 64 KiB buffers ≈ 250 MiB; the page cache takes the rest | a cache miss: ~100 ns |
| **CPU** | copying 4 GB/s through user space is a core or more; handing the file to the kernel is close to none | one system call: ~1 µs; 4,000 per tick is 4 ms |

A sketch like this takes ten minutes and already says where the design is
decided: the network link bounds everything, the bytes should not pass
through user space, and a system call per connection per tick is affordable
while one per small packet would not be. It also produces the first draft of
the [limits file](../safety/limits.md#limits-live-in-one-file).

The aim is to be roughly right — within 90% of the best design — not exact.
The numbers are orders of magnitude, written down, so that a later
measurement has something to disagree with.

## The slowest resource first

On a server: network, then disk, then memory, then CPU. Each is slower than
the next by orders of magnitude, so a saving at the slow end is worth more.
On a chip the order is set by the sketch — often power first, then a bus,
then cycles.

**Weighted by how often.** A fast resource used a million times costs more
than a slow one used once: a cache miss in the inner loop can outweigh a disk
read per request. The order says where to look first, the arithmetic says
where the time is.
