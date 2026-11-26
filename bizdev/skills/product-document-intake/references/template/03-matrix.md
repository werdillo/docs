# Stage 3 — Matrix

## 10. The matrix

### 10.1 Domains

*The subjects of the business. They never reach into each other.*

| Domain | The subject, in one sentence |
|---|---|
| | |

### 10.2 Boxes

*One table per domain. A purpose in one sentence without "and"; up to about
ten boxes a domain. When one box grows several lifecycles, split it into a
named box group (`<group>/<sub-box>`).*

**Domain `<domain>`**

| Box | What it is for | What it keeps | What it lets others read |
|---|---|---|---|
| | | | |

**`shared`** — *what every box of this domain relies on and none owns:*

### 10.3 Common capabilities

*What every domain needs and no domain owns — accounts, media, payments,
notifications, analytics. Each is a box too.*

| Capability | What it is for | Used by |
|---|---|---|
| | | |

### 10.4 Processes

*Where several boxes meet. Named as a verb and its object. Note live updates
in Afterwards when a screen must reflect the change without reloading.*

| Process | Scenario | The line — boxes (and capabilities read), in order | All or nothing? | Afterwards (reactions & live updates) |
|---|---|---|---|---|
| | S… | | *yes / no* | *reactions that must not undo it; live pushes* |

### 10.5 The grid

*One grid per domain: may the row reach the column, and how. Common
capabilities sit below every domain and are reached by processes or boxes that
declare them in 10.3.*

| may reach → | `shared` | `<box>` | `<box>` |
|---|---|---|---|
| **processes** | yes | | |
| **`<box>`** | yes | | |

## 11. Lifecycles

*For every thing a box keeps that changes state. Each transition is a scenario.*

**`<thing>`** — kept by `<box>`

| From | To | By | Final? |
|---|---|---|---|
| — | | S… | |

## 12. Checks on paper

### 12.1 Scenarios → carriers

| Scenario | Carried by |
|---|---|
| S1 | |

### 12.2 Things → scenarios

*Every thing kept: what creates it, changes it, ends it. An empty cell is a
missing scenario or a decision that it never happens.*

| Thing | Created by | Changed by | Ends by |
|---|---|---|---|
| | | | |

### 12.3 Roles → actions

| Action | `<role>` | `<role>` |
|---|---|---|
| S1 | | |

### 12.4 Walkthrough

*Each cross-box scenario (and any scenario with rules or state changes), step by
step, through the matrix. Every step names its box or process, the thing it
changes, its lifecycle transition and the rules it keeps.*

**S1.**

| Step | Box or process | Changes | Transition | Rules |
|---|---|---|---|---|
| 1 | | | | |

### 12.5 Found on paper

*What the checks caught, and where each was fixed.*

| Found | By which check | Fixed in |
|---|---|---|
| | | |
