# Design

How products look and behave, written precisely enough that a person or an
agent can design and verify a screen from it: numbers instead of adjectives,
tokens as data, components and screens as specifications.

It uses the words of [`shared/`](../shared/README.md): a domain is a section of
the navigation, a box is the screens of one subject, and a cross-box write is a
flow ([mapping](../shared/mapping.md),
[from matrix to screens](./process/from-matrix.md)).

## Build order: tokens → components → interfaces

Every product's interface is built strictly from the bottom up:

1. **Tokens first** ([`system/tokens.md`](./system/tokens.md),
   [`tokens.json`](./system/tokens.json)) — start from the OpenDesign contract,
   add the few semantic extensions the app needs, and bind component-scoped
   tokens tuned to the product's language (`internal` or `public`), verified
   against [`foundations/`](./foundations/README.md).
2. **Components second** ([`system/components/`](./system/components/README.md))
   — build every kit component from those tokens, with fixed anatomy, variants,
   six control states and keyboard behaviour.
3. **Interfaces third** ([`process/`](./process/README.md),
   [`patterns/`](./patterns/README.md)) — assemble screens for each box and
   process in `bizdev/` using only kit components and canonical screen shapes,
   covering all nine screen states.

## How to read this folder

1. Start with [`words.md`](./words.md) and [`rules.md`](./rules.md) for the
   vocabulary and numbered rules.
2. Read [`foundations/`](./foundations/README.md) for the numbers that every
   token and screen obeys.
3. Read [`system/`](./system/README.md) to set up the three-tier tokens and
   the component kit.
4. Pick the [`languages/`](./languages/README.md) page (`internal` or
   `public`), then use [`process/`](./process/README.md) and
   [`patterns/`](./patterns/README.md) to turn a product document into screens.
5. Keep [`cheatsheet.md`](./cheatsheet.md) open while designing or reviewing a
   screen.

## What is in here

| Path | What it holds |
|---|---|
| [`words.md`](./words.md) | Core words applied to design, plus design's own vocabulary. |
| [`rules.md`](./rules.md) | The numbered design rules, each with its status and owning page. |
| [`cheatsheet.md`](./cheatsheet.md) | One-screen checklist for turning a handoff into a verified screen. |
| [`open-questions.md`](./open-questions.md) | What is not settled yet, and what would settle it. |
| [`process/`](./process/README.md) | From product matrix to screens, the nine states, and interface copy. |
| [`foundations/`](./foundations/README.md) | Measurable principles for any product — hierarchy, typography, colour, spacing, motion, accessibility. |
| [`languages/`](./languages/README.md) | A design language per kind of product — `internal` (dense daily tools) and `public` (sites and storefronts). |
| [`system/`](./system/README.md) | The design system — OpenDesign tokens and component specifications. |
| [`patterns/`](./patterns/README.md) | The six canonical screen shapes (`list`, `record`, `form`, `settings`, `canvas`, `flow`) and cross-cutting surfaces. |
| [`references/`](./references/README.md) | Bad-versus-good examples, including anti-AI-slop comparisons. |
| [`skills/`](./skills/README.md) | Agent skills built from the folders above. |

How a front end builds this in code is in
[`software/principles/web/ui/`](../software/principles/web/ui/README.md).
