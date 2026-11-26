# The core words

One word per thing, and the same word in every section. These are the words
every section shares; each section adds its own on top and says what each core
word is there ([mapping](./mapping.md)).

Sources: [web words](../software/principles/web/words.md),
[low-level words](../software/principles/low-level/words.md).

| Word | What it is |
|---|---|
| **Box** | The unit of design: one subject, one purpose, its own data or state, opaque from outside. What is inside it is not part of the design level. |
| **Door** | A box's one way in for a neighbour. What it exposes is the box's whole surface; nothing behind it is reached from outside. |
| **Owner** | The one box that keeps a piece of data and changes it. Another box holds its ids, never its records. |
| **Matrix** | A set of boxes and the rule of which may reach which. Drawn as a grid, the rows and columns are the same boxes, and a cell says whether, and how, one may reach another. |
| **`shared`** | The level below a matrix's boxes: what they have in common, in the one place they all reach. At the repo scale, the `shared` deliverable holds the cross-deliverable contracts, refusal codes and event shapes every app or service imports. |
| **Process** | The level above a matrix's boxes: where several of them meet, for work that spans them. No box calls it. |
| **Layer** | A level that may use the levels below it and never those above. Imports, dependencies and references point down. |
| **Domain** | A subject of the business — `ecommerce`, `booking`, `menu`. Its boxes are drawn by the business and keep their names in every section. |
| **Group** | A box that grew past the sizing signal and became a nested matrix of sub-boxes under the same name (`catalogue/{dishes, translations}`). |
| **Deliverable** | A unit built, versioned or shipped separately — `shared` contracts, an API, a public site, an internal app, firmware, a device — carrying only boxes from the matrix. |
| **Composition root** | The one place that knows every box and puts them together. Nothing depends on it. |

**Feature** is not one of these words. It lives on in the design's name,
*feature matrix*; the unit is a box.

Domains, boxes and processes are where the business can reason; what is inside
a box is where a section's own craft begins.
