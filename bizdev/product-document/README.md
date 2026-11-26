# The product document

One folder per product, split cleanly into two halves around the line in
[`shared/words.md`](../../shared/words.md):

- **Business half (`01`–`04`)** — written in **business words only**, owned by
  the product's owner: context, behaviour, matrix and launch. Its job is to
  **find the mistakes on paper** — a logical gap, a word read two ways, a case
  nobody thought of — before they become a redrawn screen or rewritten code.
- **Technical half (`05`–`08`, optional)** — written by design and engineering
  after Gate 4 (or used to park technical notes extracted from a raw brief):
  design, architecture, verification and delivery plan. It **never silently
  mutates `01`–`04`**.
- **Log (`log.md`)** — assumptions, decisions and open questions kept across
  both halves.

Any numbered file (`01`–`08`) starts as a single Markdown file and turns into a
folder under the same name once it grows past one sitting (~200–250 lines). To
share the document with a non-technical reader as one file, compile it with
`node ./shared/scripts/bundle-product-doc.mjs <folder> --business` (or `--all`).

| Path | What it holds |
|---|---|
| [`template/`](./template/README.md) | The folder template (`01`–`04` business, optional `05`–`08` technical, `log.md`, `README.md`) to copy and fill in. |
| [`guide.md`](./guide.md) | How to fill each section: the questions to ask, the four business gates, and how `05`–`08` connect. |
| [`review.md`](./review.md) | How an LLM works with a draft — both **Intake** (raw notes/PDF → structure) and **Review** (checks, gaps and proposals). |
| [`example/`](./example/README.md) | The template filled in for Small shop — the first version that [the web example](../../software/principles/web/example/README.md) builds — with both halves and what the paper checks caught. |

## People decide, an LLM structures and reviews

The product's decisions belong to people. An LLM works in two clear modes
([review and intake](./review.md)):

1. **Intake (structuring)** — turns free-form notes, a brainstorm or a PDF into
   `01`–`04` (parking technical/rollout details in `05`–`08`), translating tech
   jargon into business words without inventing a single missing fact or target,
   and logging every gap in `log.md`.
2. **Review** — runs the current stage's gate, asks missing *What if* rows,
   catches words read two ways and matrix flaws, and proposes fixes for the
   author to accept or reject.

| | Who |
|---|---|
| Business half (`01`–`04`) | People own and decide; an LLM structures from raw notes, asks and proposes |
| Section 12 — Checks on paper | An LLM drafts; people confirm what it found |
| Gates 1–4 | An LLM reports; people decide the stage is passed |
| Technical half (`05`–`08`, optional) | Design and engineering write after Gate 4 |
| `log.md` Decisions | People only |

## The stages

The business half is filled in four stages, in order. Each ends with a **gate**
in [the guide](./guide.md), and `README.md` records which gate last passed.

| Stage | File | Sections | It answers | Passes to |
|---|---|---|---|---|
| **1. Context** | `01-context.md` | 1–5 | Is the problem worth solving, how do we measure success, what is in/out, and what boundaries hold? | Behaviour |
| **2. Behaviour** | `02-behaviour.md` | 6–9 | Who acts and how they enter, the business words, what each role does, and what must always hold. | Matrix |
| **3. Matrix** | `03-matrix.md` | 10–12 | Domains, boxes, common capabilities, processes, lifecycles, and the paper checks that it holds together. | Launch |
| **4. Launch** | `04-launch.md` | 13–15 | Deliverables, the first end-to-end slice, and pilot/launch criteria. | Technical half (`05`–`08`), design and build |

`log.md` (assumptions, decisions, open questions) lives beside `README.md` from
stage 1 through production.

## The rules

- **The matrix is the product.** Everything before `03-matrix.md` is the reason
  for it; everything after it is read from it. A screen or a folder with no box
  in the matrix is a question for `03-matrix.md`, not for design or code.
- **One name, everywhere.** A box named `shop/carts` here is `shop/carts` in
  design and in every package of the code. A name changes here first.
- **One word, one meaning.** A business word is used in the meaning section 7
  gives it — here, on the screens and in the code.
- **Every scenario lands, every box serves.** Each scenario is carried by a box
  or a process; each box carries at least one scenario.
- **A check is not skipped.** A check that finds nothing costs minutes; one
  skipped costs the misunderstanding it would have found.
- **The document lives.** When `05`–`08`, design or code finds that a box must
  split, move or merge, `03-matrix.md` changes first with a line in `log.md`
  Decisions — then design and code follow.
- **Business words only in `01`–`04`.** No tables, endpoints, components or
  frameworks in the business half. Technical choices belong in `05`–`08`.
