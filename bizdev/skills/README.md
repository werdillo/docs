# Skills

Agent skills built from [`product-document/`](../product-document/README.md).

| Skill | What it does |
|---|---|
| [`product-document-review/`](./product-document-review/SKILL.md) | Reviews a draft of a product document: runs its stage's gate and the checks on paper, asks the *What if* questions nobody asked, finds words read two ways — and proposes, leaving every decision to the author. |

## How a skill is built

- **`SKILL.md`** is the skill's own instructions — how to work, what to return.
  It is the one file written by hand, and it says *how*, never *what the rules
  are*.
- **`references/`** are copies of the documents the skill works from. They are
  never edited here: change the document, then run [`build.sh`](./build.sh). A
  link inside a copy points back into this repository.
- **`evals/`** are test cases — a draft with planted mistakes, and what a good
  review of it finds — in the layout `claude plugin eval` reads.
