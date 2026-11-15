# The product document

One document per product, from the first idea to the matrix that design and
code are built from. Its job is to **find the mistakes on paper** — a logical
gap, a word read two ways, a case nobody thought of — before they become a
screen redrawn or code rewritten, and to leave everyone who reads it with the
same picture of the product.

It is written in the words of [`shared/`](../../shared/README.md): the product
is drawn as **domains**, **boxes** and **processes**, and those names become the
screens in design and the folders in code
([mapping](../../shared/mapping.md)).

| File | What it holds |
|---|---|
| [`template.md`](./template.md) | The document to copy and fill in. |
| [`guide.md`](./guide.md) | How to fill each section: the questions to ask, and the gate that says a stage is done. |
| [`review.md`](./review.md) | How an LLM reviews a draft: what it checks, what it may and may not change, the prompt to give it. |
| [`example.md`](./example.md) | The template filled in for a small shop — the same shop that [the web example](../../software/principles/web/example/README.md) builds — with what the checks found in its first draft. |

## People write, an LLM polishes

The document is written by people: the problem, the scope, the scenarios and
the matrix are decisions, and a decision is made by someone who answers for
it. An LLM is a reviewer. It runs the checks, asks the *What if* questions
nobody asked, finds the word used two ways and the state with no way out, and
proposes a fix — which the author accepts, changes or rejects
([review](./review.md)).

| | Who |
|---|---|
| Sections 1–10 — the description | People write; an LLM asks and proposes |
| Section 11 — the checks | An LLM drafts; people confirm what it found |
| Gates | An LLM reports; people decide the stage is passed |
| Decisions (14) | People only |

## The stages

The document is filled in four stages, in order. Each ends with a **gate** — a
short check in [the guide](./guide.md) — and the document's status says which
gate it last passed.

| Stage | Sections | It answers | Passes to |
|---|---|---|---|
| **1. Idea** | 1–2 | Is there a problem worth solving? | Discovery |
| **2. Discovery** | 3–8 | Who has it, what changes for them, what is in and out, the words, what they do, what must always hold. | The matrix |
| **3. Matrix** | 9–11 | What the product is made of — domains, boxes, processes, lifecycles — and the checks that it holds together. | Handoff |
| **4. Handoff** | 12 | What design draws and what is built, box by box. | Design, then software or hardware |

Sections 13–15 — assumptions, decisions, open questions — are kept from the
first stage to the last.

## The rules

- **The matrix is the product.** Everything before it is the reason for it;
  everything after it is read from it. A screen or a folder with no box in the
  matrix is a question for this document, not for design or code.
- **One name, everywhere.** A box named `shop/carts` here is `shop/carts` in
  design and in every package of the code. A name changes here first.
- **One word, one meaning.** A business word is used in the meaning section 6
  gives it — here, on the screens and in the code.
- **Every scenario lands, every box serves.** Each scenario is carried by a box
  or a process; each box carries at least one scenario.
- **A check is not skipped.** A check that finds nothing costs minutes; one
  skipped costs the misunderstanding it would have found.
- **The document lives.** When design or code finds that a box must split, move
  or merge, the matrix is changed here, with a line in the decisions — then
  design and code follow.
- **Business words only.** No tables, endpoints, components or frameworks. If a
  sentence needs one, it belongs to the stage after this document.
