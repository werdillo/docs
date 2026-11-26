# Working with an LLM: intake and review

People own the product's decisions; an LLM works in two distinct modes:

1. **Intake (structuring)** — turns raw notes, a transcript or a PDF into the
   folder layout (`01`–`04` business, optional `05`–`08` technical, `log.md`).
2. **Review** — audits an existing draft against its stage's gate, the paper
   checks and [the shared matrix rules](../../shared/matrix.md).

In both modes the boundary is identical: **the LLM proposes and asks; the
author decides.**

## Mode 1 — Intake (raw notes → structured folder)

When the input is an unstructured brief, brainstorm or PDF:

- **Extract every real fact** into the right file: business intent, scope,
  constraints, roles, scenarios, rules and matrix into `01`–`04`; technical
  stack, DB entities, UI details, test checklists and rollout phases into
  `05`–`08` so nothing useful is dropped and `01`–`04` stay free of tech
  jargon.
- **Translate technical nouns into business words** in `01`–`04` (for example
  `ProductTranslation` and `pgvector` belong in `06-architecture.md`, while
  `02-behaviour.md` states the business rule behind them).
- **Never invent missing facts.** Missing targets, evidence, stop conditions or
  edge-case rules become explicit `[To confirm]` markers and entries in
  `log.md` Open questions.
- **Mark every proposed matrix split clearly** as a proposal for the owner, and
  run the section 12 paper checks immediately to surface gaps in `12.5`.
- **Keep the folder as the source of truth**; if a non-technical reader wants
  one file, compile it with `shared/scripts/bundle-product-doc.mjs`.

## Mode 2 — Review (draft → findings)

### What the reviewer does

- **Runs the checks** of the current stage's gate ([guide](./guide.md)), and
  the checks of section 12 once the matrix exists.
- **Asks the *What if* rows** a scenario left empty, and the ones the table
  does not list but the scenario invites.
- **Checks one-role-per-scenario** and **access modes** in section 6.
- **Finds words read two ways** — the same word in two meanings, or two words
  for one thing — and proposes a line for section 7.
- **Reads the matrix against [the shared rules](../../shared/matrix.md)** — the
  three signs of a box, one owner per thing, changes across boxes only through
  a process, no cycle in the grid.
- **Tightens the language**: shorter sentences, one term per thing, business
  words only in `01`–`04`.

### What the reviewer does not do

- **It does not decide.** Scope, a rule, the line between two boxes, a price, a
  target — it may propose, and says so; the author decides.
- **It does not invent facts.** No numbers, evidence, users or quotes the draft
  does not have. A missing fact is a question to the author.
- **It does not rewrite whole sections.** It proposes changes the author can
  accept one by one, each pointing at a file, section and line.
- **It does not write `log.md` Decisions.** It may propose that a change
  deserves one.

### What review returns

A list of findings, the most serious first. Each finding:

| Field | What it holds |
|---|---|
| **Where** | The file, section and item — `02-behaviour.md · 8 · S3 · What if`, `03-matrix.md · 10.2 · carts`. |
| **Check** | Which check found it — a gate item, a section 12 check, a shared rule, *Words*. |
| **Found** | What is wrong or missing, in one sentence. |
| **Proposed** | The change, written as it would read in the document — or a question, when only the author knows. |
| **Kind** | *gap* · *contradiction* · *ambiguity* · *style* |

Then, on its own line: **whether the gate passes**, and if not, which items
still fail.

## The review prompt

Give the reviewer this, with the draft and the files it names:

```text
You are reviewing a product document. People wrote it; you review it.

Read: the draft (either the product folder — README.md, log.md, 01-context.md
through 04-launch.md and any optional 05–08 files — or a single-file draft);
bizdev/product-document/guide.md; shared/words.md; shared/matrix.md. The
draft's status says which stage it is in.

1. Run every check of the current stage's gate in the guide, and — from
   stage 3 on — the checks of section 12.
2. For every scenario, verify it serves one role's goal, ask the What if rows
   left empty, and ask any case the scenario invites that the table does not
   list.
3. Find words used in two meanings, or two words for one thing.
4. From stage 3 on, check the matrix against shared/matrix.md: the three signs
   of a box, one owner per thing, changes across boxes only through a process,
   no cycle in the grid, every lifecycle state reached and left or final.

Do not decide scope, rules, boxes or targets — propose, and say it is a
proposal. Do not invent numbers, evidence or users — ask. Do not rewrite whole
sections. Return a list of findings, most serious first, each with: Where,
Check, Found, Proposed, Kind (gap, contradiction, ambiguity, style). End with
whether the gate passes, and which items still fail.
```

The same instructions, as a skill an agent loads by itself, are
[`product-document-review`](../skills/product-document-review/SKILL.md).
