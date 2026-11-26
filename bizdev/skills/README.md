# Skills

Agent skills built from [`product-document/`](../product-document/README.md).

| Skill | What it does |
|---|---|
| [`product-document-intake/`](./product-document-intake/SKILL.md) | Turns raw thoughts, a brief, a transcript or a PDF into a structured Option A product folder (`01`–`04` business, optional `05`–`08` technical, `log.md`) without inventing facts, logging every gap as `Q*` with `Blocks`. |
| [`product-document-review/`](./product-document-review/SKILL.md) | Reviews a draft of a product document (folder or single file): runs its stage's gate and paper checks, catches contradictions between `01`–`04` and `05`–`08`, asks missing *What if* questions — proposing while leaving decisions to the author. |

## How a skill is built

Follows [`shared/skills.md`](../../shared/skills.md): edit the source
documents, never `references/`, then run [`build.sh`](./build.sh) (or
`./shared/scripts/build-skills.sh`). Evals follow the layout `claude plugin
eval` reads.
