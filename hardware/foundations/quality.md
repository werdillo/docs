# Where quality comes from

The quality of a device is set by three things, and by all three at once:

1. **The components** — what each part is and how good it is.
2. **The circuit** — how the parts are connected, and what the design asks of
   each of them.
3. **The implementation** — how the circuit is built: the board's layout, the
   ground, the power, the wiring, the heat, the enclosure.

They do not add up; **the result is limited by the weakest of the three.** A
fine circuit with poor parts is poor. Fine parts in a poor circuit are wasted.
A fine circuit of fine parts, built badly, is no better than its build. Money
and effort spent on the strongest of the three buy nothing until the weakest
is raised.

An audio amplifier shows this better than almost anything: every flaw of every
layer ends up in the same place — the sound — and can be measured there.

## The three layers in an amplifier

### Components

What a part contributes, beyond its nominal value:

- **Active parts** — an op-amp's or a transistor's noise, its distortion, its
  bandwidth and slew rate, how it behaves near its limits.
- **Capacitors** — the type matters more than the brand. A class II ceramic
  (X7R and the like) changes its value with the voltage across it and turns
  vibration into signal, so in the signal path it adds distortion; C0G ceramics
  and film capacitors do not. Electrolytics belong in the supply and in big
  coupling and filter values, where the signal voltage across them is small.
- **Resistors** — thick-film resistors add more noise when current flows than
  thin-film or metal-film ones; in a low-level stage that is audible as hiss.
- **The power** — a transformer, a regulator or a switching supply sets the
  floor of hum and noise everything else sits on.

A part is chosen for **the stress the circuit puts on it**: the same resistor is
fine in a power-on indicator and the noisiest thing in a microphone preamp.

### The circuit

How the parts are asked to work:

- **The topology** — class A, AB or D; a discrete stage or an op-amp; where the
  gain is taken and how much in each stage.
- **Feedback** — how much, and how it is made stable. Feedback lowers
  distortion and output impedance; too much, or badly compensated, and the
  amplifier oscillates.
- **The operating points** — the bias of each stage, the headroom to the
  supply rails, how hot each part runs.
- **Rejection** — how much of the supply's ripple reaches the output, and how
  well the input refuses noise picked up on the way.

A good circuit is one that **asks little of its parts**: it does not lean on a
part at its limits, so ordinary parts measure well in it.

### The implementation

How the circuit becomes a thing:

- **Ground** — the high currents (the output stage, the speaker's return, the
  rectifier's charging pulses) must not flow through the ground the input
  stage measures against. Most hum and buzz is here, not in the parts.
- **Return paths and loops** — every current returns to where it came from; the
  area of that loop is an antenna. Small loops, a return under each trace.
- **Decoupling** — a capacitor is only as good as its distance to the pins it
  serves.
- **The feedback network** close to the amplifier's input, or the long trace
  turns a stable circuit into an oscillator.
- **Heat** — the bias of a class AB output stage must track the temperature of
  the output transistors, so the part that senses it sits on their heatsink.
- **Mechanics** — where the transformer sits and how it is turned, how the
  enclosure is grounded, where the inputs enter relative to the outputs.

The same schematic, laid out twice, can differ by tens of decibels of hum and
noise. The schematic does not show this; the board decides it.

## Which layer shows where

Every measured property is owned mostly by one layer. When a property is bad,
look there first.

| Property | Mostly set by | Usually because |
|---|---|---|
| Hum and buzz | Implementation | Ground shared with high currents; a loop; the transformer's field |
| Noise (hiss) | Components, circuit | A noisy first stage; thick-film resistors; gain taken late |
| Distortion (THD) | Circuit, components | Too little feedback, a stage near its limits; class II ceramics in the signal path |
| Oscillation, instability | Circuit, implementation | Feedback not compensated; long traces at the input; missing decoupling |
| Channel separation | Implementation | Shared ground and supply between channels |
| Power, headroom | Circuit, components | The rails and the supply's current |
| Drift, warming up | Implementation, circuit | Bias not tracking temperature; a heatsink too small |

## What follows

- **Raise the weakest layer first.** Measure, find which layer the worst
  property belongs to, and spend there. A better part does not cure a ground
  loop.
- **Design the circuit to ask little.** It is the cheapest layer to get right
  and it makes the other two forgiving.
- **The layout is part of the design.** It is drawn with the schematic, by the
  same person, not handed over afterwards
  ([KiCad](../kicad/README.md)); the enclosure is drawn with the board
  ([FreeCAD](../freecad/README.md)).
- **A claim is a measurement.** "Warmer", "more detail" are not properties;
  THD+N, the noise floor, the frequency response and channel separation are.
  A change that does not show in a measurement, or in a blind listening test,
  is not a change of quality.
- **Each layer is checked on its own.** A part against its datasheet, the
  circuit in simulation, the build on the bench — so a fault is found in the
  layer that made it.

## Beyond audio

The same three layers hold for any device: a sensor's accuracy is its
sensing element, its front end and its layout; a power supply's efficiency is
its switches, its topology and its loops. Audio is the example because there
the weakest layer is heard.
