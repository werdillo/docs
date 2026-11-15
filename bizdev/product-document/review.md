# Reviewing a draft with an LLM

People write the document; an LLM reviews it. The review finds what a careful
reader would find — gaps, contradictions, ambiguous words, unasked questions —
and proposes fixes. It does not make the product's decisions.

## What the reviewer does

- **Runs the checks** of the current stage's gate ([guide](./guide.md)), and
  the checks of section 11 once the matrix exists.
- **Asks the *What if* rows** a scenario left empty, and the ones the table
  does not list but the scenario invites.
- **Finds words read two ways** — the same word in two meanings, or two words
  for one thing — and proposes a line for section 6.
- **Reads the matrix against [the shared rules](../../shared/matrix.md)** — the
  three signs of a box, one owner per thing, changes across boxes only through
  a process, no cycle in the grid.
- **Tightens the language**: shorter sentences, one term per thing, business
  words only.

## What the reviewer does not do

- **It does not decide.** Scope, a rule, the line between two boxes, a price, a
  target — it may propose, and says so; the author decides.
- **It does not invent facts.** No numbers, evidence, users or quotes the draft
  does not have. A missing fact is a question to the author.
- **It does not rewrite whole sections.** It proposes changes the author can
  accept one by one, each pointing at a section and a line.
- **It does not write decisions (14).** It may propose that a change deserves
  one.

## What it returns

A list of findings, the most serious first. Each finding:

| Field | What it holds |
|---|---|
| **Where** | The section and line — `7 · S3 · What if`, `9.2 · carts`. |
| **Check** | Which check found it — a gate item, a section 11 check, a shared rule, *Words*. |
| **Found** | What is wrong or missing, in one sentence. |
| **Proposed** | The change, written as it would read in the document — or a question, when only the author knows. |
| **Kind** | *gap* · *contradiction* · *ambiguity* · *style* |

Then, on its own line: **whether the gate passes**, and if not, which items
still fail.

## The prompt

Give the reviewer this, with the draft and the files it names:

```text
You are reviewing a product document. People wrote it; you review it.

Read: the draft; bizdev/product-document/guide.md; shared/words.md;
shared/matrix.md. The draft's status says which stage it is in.

1. Run every check of the current stage's gate in the guide, and — from
   stage 3 on — the checks of section 11.
2. For every scenario, ask the What if rows left empty, and any case the
   scenario invites that the table does not list.
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
