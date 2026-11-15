# The tools

Each tier runs on the tool that can see its edge; a tool is not a tier of its
own. Two form the cheap floor — a server's runner and a front end's — one is the
real browser, and one is the light browser an agent works in.

| Use | Tool (example) | What it sees |
|---|---|---|
| unit, behaviour on a server | the runtime's own runner | a value in, a value out |
| unit, behaviour on a front end | the framework's runner, on a DOM | the reaction a render makes |
| database | the runtime's own runner | real SQL, against a real database |
| browser | a browser-automation runner over a real browser | the screen a person sees |
| verification before hand-over | a light browser over a debugging protocol | the behaviour, while the work is being made |

## The runner

The server's runner. Unit and database tests are the same command against the
runtime the code runs on, so a test starts where the handler does and there is
no second toolchain to keep in step. The database tier keeps its own test
database below it, which keeps the run cheap on every push.

A front end's unit and behaviour tests run on the framework's runner, because
they need the framework's transform and a DOM. The runner differs; the tier does
not.

## The real browser

The browser tier, driving a real engine. The engine that renders the page is the
one a person's browser is built from, so a question about layout, spacing, a
focus ring, a font or a screenshot is answered there and nowhere else. **It is
the truth for how a screen looks**, and the only place a rendering-dependent
assertion belongs. A spec names roles and accessible names, so a pass says the
screen's contract held where it was rendered.

## The light browser

A light browser is a debugging-protocol server, started once and left running. It
starts in a moment and keeps its pages between calls, so an agent uses it as its
feedback loop — open the running dev server, read the accessibility tree, click a
control, check the state the page now shows — and as the quick scripted check
beside it. It is not the gate and not a second opinion on the look: **a real
browser answers anything rendering-dependent**.

| Use the light browser for | Ask the real browser instead |
|---|---|
| did the page load; does the control exist; did the state change | how it looks, where it sits, whether it overflows |
| the roles and names a flow passes through | a rendering-dependent assertion in a spec |
| a look while editing | the browser tier's verdict |

A runner that can only speak its own protocol cannot connect to a light browser
that speaks another, so the browser suites stay on the real engine. The light
browser's limits and its setup are in the project's convention
([testing](../../conventions/testing.md)).

## The loop

1. Edit the code.
2. Verify against the running app in the light browser: the screens and flows the
   change touched, read and clicked until the behaviour is what was asked for.
3. Anything only a render can answer goes to the browser tier, on the real engine.
4. Hand over the final shape — the reviewer sees the result, not every iteration.

The light browser shortens the distance between a change and a look at it; it
does not move the gate. The browser tier and the one command that checks
everything still decide ([rule 41](../rules.md)), and the commands for a project
are in its [testing convention](../../conventions/testing.md).
