---
name: product-document-intake
description: Turn raw product thoughts, a rough brief, meeting notes, a voice transcript or a PDF into a structured feature-matrix product folder (`README.md`, `01-context.md` through `04-launch.md` for business, optional `05-design.md` through `08-plan.md` for technical craft, and `log.md`) without inventing facts, targets or decisions. Use whenever someone drops messy product notes, an unstructured PRD or a PDF and asks to structure, convert, draft or turn it into a product document ("оформи в продуктовый документ", "разложи по шаблону", "преврати заметки в структуру", "structure this brief"). People decide; this skill structures, separates business from tech, and surfaces every gap as a numbered open question.
---

# Structuring raw product notes into a product document (Intake)

People often start with free-form thoughts, a PDF brief or meeting notes that
mix business ideas, database tables, UI blocks and rollout timelines. Your job
is to turn that raw input into a clean, balanced product folder that both
business owners and developers can read — **without silently inventing a single
fact, target, metric or business decision**, and **without dropping useful
technical details**.

## References

All in `references/`. Everything you need is copied here.

| Path | Read it |
|---|---|
| `guide.md` | Always. Exact questions, rules and gates for `01`–`04`, `05`–`08` and `log.md`. |
| `template/` | Always. Copy its structure (`README.md`, `01`–`04`, optional `05`–`08`, `log.md`). |
| `matrix.md` | When drawing `03-matrix.md` — the three signs of a box, interaction ladder, parallel waves. |
| `words.md` | When checking core vocabulary (`box`, `door`, `owner`, `shared`, `process`, `group`, `deliverable`). |
| `example/` | To calibrate depth, tone and how Small shop splits business (`01`–`04`) from technical (`05`–`08`). |
| `writing.md` | For style discipline: short sentences, plain words, one term per thing, numbers instead of adjectives. |

## How to structure raw input

Write the output in **the language of the source input**.

1. **Inventory every fact in the source.** Read the entire input (notes, doc or
   PDF) and sort each item into three buckets:
   - **Business substance** (`01`–`04`) — problem, cost, evidence, value,
     scope, constraints (tenancy, GDPR/legal, failure fallback, device floor),
     roles & access, words, scenarios, rules, deliverables, pilot terms.
   - **Technical & delivery substance** (`05`–`08`) — screen lists/UI states,
     DB entities, stack choices, search/AI pipelines, security/backup details,
     demo checklists, phased milestones.
   - **Assumptions, settled decisions and unknowns** (`log.md`) — assign stable
     IDs `A1…`, `D1…`, `Q1…` (with `Blocks: Gate 1 · Gate 3 · E2 · Pilot`).

2. **Create only the files the input supports.**
   - Always create `README.md`, `01-context.md` and `log.md`.
   - Create `02-behaviour.md`, `03-matrix.md` and `04-launch.md` when the source
     contains scenarios, domain nouns or deliverables — mark proposed matrix
     boundaries clearly as proposals for the owner to confirm.
   - Create `05-design.md`, `06-architecture.md`, `07-verification.md` and
     `08-plan.md` **only** when the source actually contains technical, design,
     verification or roadmap substance (or the user explicitly asks to draft
     them). Never fabricate empty technical speculation for an idea-only brief.

3. **Keep `01`–`04` strictly in business words.**
   - Move every database table name, framework, vector engine, endpoint or
     implementation phrase into `06-architecture.md` (or `05`/`07`/`08`).
   - Express the underlying business rule in `02-behaviour.md` (`R1`, `R2`…)
     in plain business language.

4. **Enforce clean behaviour and matrix rules.**
   - **Evidence honesty:** distinguish past facts (hours spent, money lost,
     real incidents) from compliments (*"friends liked it"*) or unsourced
     landing-page figures (mark unsourced numbers *unverified*).
   - **One scenario = one role and one goal.** If the input says *"staff
     updates status and guest watches live"*, split it into two scenarios linked
     by the lifecycle.
   - **Include `shared` contracts** as a deliverable in `04-launch.md` (and
     freeze its door & event contracts in `06-architecture.md`) whenever
     multiple apps or services share contracts.
   - **Run section 12 paper checks immediately** (`12.1`–`12.5`) whenever you
     draft `03-matrix.md` — every gap caught (missing cancel actor, stuck
     pending state, missing GDPR retention window) goes into `12.5 Found on
     paper` and into `log.md` as a numbered `Q*` with `Blocks`.

5. **Structure `08-plan.md` for parallel execution** (when a roadmap/stages
   exist in the input):
   - Break phases into epochs (`E1`, `E2`…) and atomic tasks (`E1.1`, `E1.2`…)
     with `Wave` (`serial A` freeze `shared`/doors → `parallel B` disjoint
     `Owns` → `serial C` wire `app/` + full regression), `Reads`, `Owns`,
     `Depends on` and `Done when`.
   - Assume the principle skills listed in `README.md` (`design`,
     `software/principles/web` or `low-level`) are installed — never repeat
     their generic rules in `05`–`08`.

6. **Optionally compile a single shareable file.** If the user asks for one
   compiled Markdown document as well as the folder, run
   `node ./shared/scripts/bundle-product-doc.mjs <folder> --business` (for
   business readers) or `--all` (for the full package), keeping the folder as
   the single source of truth.

## What you never do

- **Never invent facts, numbers, targets, dates or evidence.** Where the input
  lists metrics without targets or leaves a stop condition blank, write an
  explicit placeholder (`[To confirm with owner]`) and add a `Q*` row in
  `log.md`.
- **Never silently drop details from the input.** Technical entities, demo
  checklists and pilot plans go cleanly into `05`–`08`.
- **Never mark a gate as passed.** Set `Status` in `README.md` to Draft until
  the owner confirms proposals and closes blocking `Q*` items.

## What you return

1. The list of files created (with line counts or brief role of each file).
2. The top findings caught on paper (`12.5`) and the blocking open questions
   (`Q*` in `log.md`) that need the owner's answers before moving forward.
