# The tiers

Each tier guards one edge and costs more than the one below it. Put a test at
the lowest tier that can see what it asserts, and let the higher tiers add only
what the lower ones cannot.

| Tier | Guards | Runs |
|---|---|---|
| Unit, behaviour | a box's decisions: a service, a draft ↔ wire conversion, what a guard derives | every push |
| Database | a write against a real (test) database: the unit of work, its guards and its races | every push |
| Browser | a screen's contract: what renders, and the roles and names the code may rely on | every push |
| Live | the boundary with the real backend: what it really answers and really refuses | every push |

## Unit and behaviour

The cheapest tier and the one to reach for first. It guards a box's decision
with no I/O: a value in, a value out, the branch that broke named in the
failure. It proves the decision, not that the decision reaches storage, and not
that a screen shows it.

**A pure decision is also tried on generated input.** Examples written by
hand test what someone thought of. For a decision with no I/O — a price
with its discounts and tax, availability across dates, a slug, a parser at
the boundary — a test also generates many inputs from a seed and compares
the decision with a plainer version of it, an **oracle**: a slower
formula, a loop where the code uses an index, the rule as the business
states it.

- **One seed decides the run**, fixed in the gate so that it fails only when
  the code changed; a failure prints its seed, and that seed replays it.
- **The generator is shaped like the input** — mostly valid, with one thing
  wrong — or every input is refused at the first check and nothing behind it
  is tried.
- **The test shows it reached the hard cases**: across its seeds it counts
  the refusals, the limits hit and the empty results, and fails if one never
  happened. A random test that cannot show it reached a case has not tested
  it.
- **When it fails, the oracle is suspect too.** It is code; the seed replays
  the run while which side is wrong is found out.

A front end's behaviour tests still run on a DOM even when they draw no markup:
without one the framework loads its server build, where a write is inert, so a
test would see a save that ran and changed nothing. That is the harness, not a
higher tier.

## Database

A database test runs real SQL against a real (test) database built from the
schema, never a mock: a mock cannot disagree with the engine. It exercises the
**unit of work**, not one statement — the write and its guards in one transaction,
the rollback when a guard refuses, the race when two writes carry the same
version. The decision was proven below; this tier proves it lands, or refuses, as
one.

## Browser

A browser test guards a screen's **contract**: that the screen renders, and that
its controls keep the roles and accessible names the code and a person rely on.
A name in a spec is a promise — renaming a control without a reason breaks
something a keyboard user would also feel. It also covers what exists only after
a render: a drag, a picker, a rule refused as it is typed.

Behind a stub, the browser tier proves the screen and never the wire. A stub
answers in the shape the front end expects, so it cannot say whether the backend
sends that shape or accepts what the screen saves.

## Live

The live tier guards the **boundary with the real backend**, on a seeded
database: what it really answers, and what it really refuses. It is the only
tier where the stub is gone. A contract test is this tier seen from a consumer —
a client reading the real producer — so a change to a shape the two exchange
needs it.

## One expensive edge per tier

The rule that keeps four tiers from becoming four copies:

- **A lower tier's assertion is not repeated higher up.** The higher tier adds
  the one fact only it can see, not a second proof of a decision already covered.
- **A stubbed suite cannot stand in for the live one.** They assert different
  edges, so passing the stub says nothing about the real answer.
- **When a higher tier fails, ask which edge moved** — not how to make the test
  pass by copying the lower assertion into it. Each tier is slower and harder to
  diagnose; a duplicated assertion turns one failure into four and hides the
  layer that broke.

## A flake is reproduced before it is fixed

A test that fails only sometimes is fixed only once its failure is reproduced:
throttle the CPU, repeat the test until it fails, and probe the page at that
moment. Never with a retry or a sleep, which hide the timing the test was wrong
about. The cause is fixed where a user can hit it, in the component and not in
the spec. Until a flake is reproduced, it is recorded as one, not called fixed.
