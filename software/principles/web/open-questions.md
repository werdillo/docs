# Not decided yet

Gaps in these principles: what they do not settle, named so that the gap is
visible instead of implied. Each says what would settle it, and leaves the list
when a rule replaces it. What a project has not built is not here; it is one
line in that project's roadmap.

## Environments and secrets per environment

No rule says how a project's environments differ (local, staging, production),
or where each environment's secrets come from. The stack asks for managed
primitives (for example, platform secrets and managed storage) and stops there.
What would settle it: a rule
for how each environment's configuration and secrets are bound, so that none is
written into the tree.

## What knows the application but no subject

The standard-library test for `core`
([the layers](./structure/interaction.md#how-matrices-interact-with-each-other))
leaves one kind of code without a place: what knows *this* application but no
subject — the session and its tokens, the client of the project's own API, the
project being worked in, the access map, the frame a screen publishes into. It
sits in `core` today because it is below every feature, yet no other program
could use it unchanged. What would settle it: whether that is a layer of its
own between `core` and `features` (an application runtime), or part of `app`,
and which way its arrows run.
