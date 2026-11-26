# <Product name>

| | |
|---|---|
| **Status** | Idea · Discovery · Matrix · Handoff — *the last gate passed* |
| **Owner** | *who decides* |
| **Updated** | *YYYY-MM-DD* |

*How to fill each section, and the gate at the end of each stage, is in
[the guide](./guide.md). Delete these italic prompts as you go.*

---

## Stage 1 — Idea

### 1. The idea

*One paragraph. Then the statement:*

> For **<who>**, who **<the problem>**, **<product>** is a **<kind of
> product>** that **<what it changes>**. Unlike **<what they do today>**, it
> **<the difference that matters>**.

### 2. The problem

| | |
|---|---|
| **Who has it** | |
| **How they solve it today** | |
| **What it costs them** | *time, money, risk — a number where there is one* |
| **Why now** | |
| **Evidence** | *conversations, data, your own experience — and how much of each* |

---

## Stage 2 — Discovery

### 3. The people

*Everyone who acts in the product, including the product itself for timed
work. A role here becomes a role with grants in code.*

| Role | Who they are | What they come for | How often |
|---|---|---|---|
| | | | |

### 4. Value and success

| Outcome | Measured by | Target | By when |
|---|---|---|---|
| | | | |

**We stop or rethink if:** *the result that would say the idea is wrong.*

### 5. Scope

| In the first version | Later | Not this product |
|---|---|---|
| | | |

### 6. Words

*Every word of the business that two people could read differently. One
meaning each; the code and the screens use the same word.*

| Word | Means | Does not mean |
|---|---|---|
| | | |

### 7. Scenarios

*What the people of section 3 do, in their words. One scenario, one goal.*

#### S1. <Goal, as a verb and its object>

- **Who:** *a role from section 3*
- **Starts when:** *the trigger*
- **Steps:** 1. … 2. … 3. …
- **Ends with:** *what is true afterwards*
- **Must not:** *what may never happen — each becomes a rule in section 8*
- **What if:**

  | Case | Then |
  |---|---|
  | *it is done twice* | |
  | *two people do it at once* | |
  | *it stops halfway* | |
  | *what it relies on changed meanwhile* | |
  | *something outside fails* | |
  | *they change their mind* | |

### 8. Rules

*What must always be true, whatever the scenario. Numbered, so a scenario, a
screen or a test can point at one.*

| Rule | Must always be true | Kept by |
|---|---|---|
| R1 | | *a box or process — filled in at stage 3* |

---

## Stage 3 — Matrix

### 9. The matrix

#### 9.1 Domains

*The subjects of the business. They never reach into each other.*

| Domain | The subject, in one sentence |
|---|---|
| | |

#### 9.2 Boxes

*One table per domain. A purpose in one sentence without "and"; up to about
ten boxes a domain.*

**Domain `<domain>`**

| Box | What it is for | What it keeps | What it lets others read |
|---|---|---|---|
| | | | |

**`shared`** — *what every box of this domain relies on and none owns:*

#### 9.3 Common capabilities

*What every domain needs and no domain owns — accounts, files, payments,
notifications. Each is a box too.*

| Capability | What it is for | Used by |
|---|---|---|
| | | |

#### 9.4 Processes

*Where several boxes meet. Named as a verb and its object.*

| Process | Scenario | The line — boxes, in order | All or nothing? | Afterwards |
|---|---|---|---|---|
| | S… | | *yes / no* | *reactions that must not undo it* |

#### 9.5 The grid

*One grid per domain: may the row reach the column, and how.*

| may reach → | `shared` | `<box>` | `<box>` |
|---|---|---|---|
| **processes** | yes | | |
| **`<box>`** | yes | | |

### 10. Lifecycles

*For every thing a box keeps that changes state. Each transition is a scenario.*

**`<thing>`** — kept by `<box>`

| From | To | By | Final? |
|---|---|---|---|
| — | | S… | |

### 11. Checks on paper

#### 11.1 Scenarios → carriers

| Scenario | Carried by |
|---|---|
| S1 | |

#### 11.2 Things → scenarios

*Every thing kept: what creates it, changes it, ends it. An empty cell is a
missing scenario or a decision that it never happens.*

| Thing | Created by | Changed by | Ends by |
|---|---|---|---|
| | | | |

#### 11.3 Roles → actions

| Action | `<role>` | `<role>` |
|---|---|---|
| S1 | | |

#### 11.4 Walkthrough

*Each cross-box scenario (and any scenario with rules or state changes), step by
step, through the matrix. Every step names its box or process, the thing it
changes, its lifecycle transition and the rules it keeps.*

**S1.**

| Step | Box or process | Changes | Transition | Rules |
|---|---|---|---|---|
| 1 | | | | |

#### 11.5 Found on paper

*What the checks caught, and where each was fixed.*

| Found | By which check | Fixed in |
|---|---|---|
| | | |

---

## Stage 4 — Handoff

### 12. What is drawn and built

#### 12.1 To design

| Box or process | Screens | Pattern | Who sees it |
|---|---|---|---|
| `<domain>/<box>` | | *list · record · form · settings · canvas · flow* | |

**Navigation:** *one section per domain, in this order:*

**Public pages' target queries:** *for a public site, the searches each public
page answers (delete if there is no public site).*

#### 12.2 To build

| Deliverable | Kind | Carries |
|---|---|---|
| | *API · front end · client · firmware · device* | *all domains / which boxes* |

**First slice:** *the boxes and processes built first, and the scenario they
complete end to end.*

---

## Kept throughout

### 13. Assumptions

| Assumption | If wrong | How we test it | Status |
|---|---|---|---|
| | | | *open · holds · wrong* |

### 14. Decisions

| Date | Decision | Why | Changes |
|---|---|---|---|
| | | | *the sections it touched* |

### 15. Open questions

- *A question, who answers it, by when.*
