# Skills

How agent skills are built, kept in sync and evaluated across every section of
this repository. Every section keeps its own `skills/` folder (`bizdev/skills/`,
`design/skills/`, `software/skills/`, `hardware/skills/`), and every skill
follows the same layout so one build script and one check script guard them all.

## Layout of a skill

```text
<section>/skills/
  README.md                 ← table of skills in this section
  build.sh                  ← copies source docs into each skill's references/
  <skill-name>/
    SKILL.md                ← hand-written instructions (how to work, what to return)
    references/             ← generated copies of source documents (never edited by hand)
    evals/                  ← test cases and graders verifying the skill's behaviour
```

## Rules

- **`SKILL.md` says *how*, never *what the rules are*.** It is the one file
  written by hand: trigger description, reading order of `references/`, step-by-step
  procedure, boundaries of what the agent decides versus proposes, and output
  format. Copying rules into `SKILL.md` creates two copies that drift apart
  ([writing](./writing.md#rules)).
- **`references/` are generated, never hand-edited.** Documents in the section
  and in `shared/` remain the single source of truth. After changing any source
  document, run `./shared/scripts/build-skills.sh`; `node ./shared/scripts/check-docs.mjs`
  fails whenever a copy in `references/` is out of sync.
- **Keep `SKILL.md` short and route to `references/`.** A skill loads its
  `SKILL.md` into context first and reads only the reference files the current
  stage or task requires.
- **Every skill carries `evals/`.** Include concrete test cases with planted
  mistakes (checking that the skill catches contradictions, respects boundaries
  and never invents facts) plus short control questions to detect regressions
  when source documents are refactored.
- **Pin runtime tool versions, not copied examples.** When a skill covers a
  moving language or toolchain (such as Zig or TypeScript), `SKILL.md` instructs
  the agent to verify standard-library signatures against the project's pinned
  compiler version rather than copying outdated API calls verbatim.

## Building and checking

- `./shared/scripts/build-skills.sh` — discovers and runs every section's
  `skills/build.sh` to refresh `references/`.
- `node ./shared/scripts/check-docs.mjs` — verifies that every file and folder
  copied into `references/` matches its source byte for byte.

## Not this

- Editing a rule directly inside `skills/<name>/references/` — the next build
  overwrites it and the real document stays stale.
- Pasting 400 lines of rules into `SKILL.md` instead of copying the owning
  documents into `references/`.
- Shipping a skill with no `evals/` — an untested skill silently breaks when
  its references change.
