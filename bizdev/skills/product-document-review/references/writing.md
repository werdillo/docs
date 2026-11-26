# Writing

How the documents of this repository are written, so that a new one reads like
the others — whoever writes it, a person or an LLM. It describes the style the
[principles](../software/principles/web/README.md) are already written in; where
this page and those documents differ, the documents are the better example and
this page is fixed.

## In one minute

- **A rule is a sentence that states a fact**, in the present tense, with its
  reason next to it.
- **One word per thing**, the same in every document; a new word goes into a
  words page first.
- **Numbers, not adjectives** — and a number that only orients says so.
- **A rule lives in one place**; every other page links to it.
- **Every folder has a README** that says what the folder is for and lists what
  is in it.
- **An example for every rule**, and one running example per set.
- **British English, plain words, short sentences.**

## Sentences

- **State the rule as a fact.** "A box owns its data", "Every limit is a named
  constant in one file" — not "boxes should own their data", not "it is
  recommended to". *Must* is kept for what has to hold for the design to work —
  "a reaction must not undo the write"; *should*, *try to*, *ideally* are not
  used for rules.
- **Put the reason next to the rule.** A rule without its *why* is followed
  blindly or not at all; one sentence of reason is enough. "A literal number
  that bounds something anywhere else is a limit that has no name yet."
- **Lead with the point, in bold.** A paragraph or a bullet opens with the
  claim in bold, then explains it. A reader skimming the bold alone gets the
  page.
- **Present tense, impersonal.** The documents describe how things are done
  here; *you* is for the rare sentence addressed to the reader, *we* is not
  used for rules.
- **Short sentences, plain words.** One idea a sentence. A word a reader would
  look up is replaced by the plain one, or defined.
- **British spelling** — *behaviour*, *colour*, *catalogue*, *realisation*.

## Words

- **One word per thing, and the same word in every document.** A synonym used
  for variety reads as a second thing. The words are defined in a words page —
  [the shared core](./words.md), then each set's own — and used in that meaning
  only.
- **A new word is defined before it is used**: a line in the words page first,
  then the documents.
- **Say what a word is not**, when a familiar word is close: "**Feature** is not
  one of these words"; "*module* survives only in names in code". It is where
  most misreadings are stopped.
- **Names in code are in code format** — `shared`, `_processes`, `root.zig` —
  and the word for the idea is in plain text: a box, a door.

## Numbers

- **A number instead of an adjective.** "Up to about ten boxes a matrix", "a
  scale of 4, 8, 12, 16" — not "a few", not "comfortable".
- **Say what kind of number it is.** A limit that a test enforces, an orienting
  size that asks a question ("ten is a question, not a target"), or an example.
  A number with no kind is read as a hard limit.

## Rules

- **A rule lives in one place.** Its full text is in the document that owns it;
  a list, a cheatsheet or another set links to it and does not repeat it. A
  cheatsheet is "a map, not a copy".
- **A rule has a status** where a set uses them — *guarded* when a test fails
  on it, *signal* when it is an orienting size, *default* otherwise
  ([web rules](../software/principles/web/rules.md)). The status is about the
  test, not importance.
- **The exceptions are named** with the rule, not discovered later: what the
  rule does not cover, and what to do there.
- **Scope is stated.** When a set is overkill is said in it, not left to the
  reader's guess.

## Examples

- **Every rule has an example**: a table, a tree, a short piece of code, a
  sentence that passes and one that fails. An abstract rule is understood when
  its example is.
- **One running example per set.** The same small product — the shop — from
  the first page to the last, so each new rule lands on something already
  known. The names are made up, and the example says so.
- **Bad, then good, then the rule that tells them apart.** A *Not this* list —
  the mistakes the rule exists to stop, each in one line with what it really
  is: "a screen that styles a control 'just here' — that is a missing variant".
- **Code comments say why**, not what: the reason the line is there, or the
  rule it applies.

## Pages

- **A title is a name**, a few words: *Limits*, *The product document*. Headings
  inside a page are statements where they can be — *Everything has a limit*,
  *A road, not a supervisor* — so the outline alone reads as the page's claims.
- **The first paragraph says what the page is for** — usually "How …" — and
  what it is not, if that is likely to be confused.
- **A long page opens with *In one minute***: the whole page as a few bold
  bullets.
- **A page ends where its subject ends.** A page that covers two subjects is
  two pages; a page that grows past what one sitting reads gets a folder.

## Folders

- **Every folder has a README** — what the folder is for, then a table:

  | File | What it holds |
  |---|---|
  | `limits.md` | Everything has a limit, and the limits live in one file. |

  The second column is one line, often opening with the page's claim in bold.
- **A set has the same frame**: a README, `words.md`, `rules.md` — the rules in
  one numbered list —, `cheatsheet.md`, `example/`, `open-questions.md`. A set
  that is smaller keeps the README and the words.
- **The README says how to read the folder** when the order matters: what
  first, what next, what only when a question calls for it.

## Links

- **Relative links only**, to the section, not just the page:
  `[where one box ends](./structure/matrix.md#where-one-box-ends)`. They work
  the same on GitHub, in an editor and in Obsidian.
- **A link is a short phrase in brackets after the claim it supports** —
  `a box owns its data ([data](./architecture/data.md))` — not "see here".
- **A link to a shared definition replaces repeating it.** The page says what
  the word is in its own field, and links to the core.

## Open questions

What is not decided is written down, not implied — in `open-questions.md`, one
heading each: what is not settled, why it matters, and **what would settle
it**. A question leaves the list when a rule replaces it.

## Not this

- "You should consider using…" — that is a rule without its fact; state it.
- A synonym for variety — "module" on one page, "box" on the next — that is a
  second thing to the reader.
- A rule repeated in a cheatsheet with different wording — that is two rules
  that will drift apart; link to the one.
- "Fast", "clean", "a few", "comfortable" — those are numbers not written yet.
- A page with no example — that is a rule nobody has checked against a case.
- "See here", a bare URL, an absolute link into this repository — those are
  links that tell nothing, or break.
