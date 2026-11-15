# Starting a project

## Variants

- **A product UI and a content site are two front ends**, picked by audience:
  a product UI is a reactive single-page app; a site is static-first. A project
  that is both has a site and, if it needs an editor, an app.
- The stack is chosen once. A concern that looks missing is added to the
  project's [conventions](../../conventions/README.md) and to these principles
  when it is general — not swapped for a personal favourite in one project.

## Day one: the decisions to make

| Question | The answer |
|---|---|
| One language end to end? | Yes — one language and one runtime for the server, the front end and the shared package. |
| Where does it run? | On a managed platform, where it is possible. |
| What owns the data? | A database behind each box's tables; files in object storage. |
| How do the sides share a shape? | A schema library, in one contracts package. |
| Which front-end framework? | Static-first for a site; a reactive framework for a product UI. |
| Styles? | A utility layer that maps the tokens ([tokens](../../../../design/system/tokens.md)). |
| How is it checked? | One root command for types, lint and unit tests, and CI running the same steps. |
| How is structure kept? | Layer and boundary tests, written with the second box. |

## Bootstrapping checklist

1. Make one workspace with the contracts package, the server, the front end and
   any client package beside them. Keep shared versions in one central place.
2. Put the cross-boundary schemas in the contracts package **first**.
3. Server: the routes, the handlers and the data layer of each box, with the
   schemas of the routes generated from the same declarations.
4. Client: the front end on a bundler, with the kit and the tokens in place
   before the first screen ([the kit](../ui/kit.md)).
5. Write each package's one-page README (its map) and its guide (its
   rules).
6. Add the layer and boundary tests; add the shape tests once there is a shape.
7. Add the single check command at the root and in each package; wire CI to run
   it.
8. Write a box's README as you add the box, not after.

The **architecture** rules — layers, boundaries, contracts, data discipline —
are in [`architecture/`](../architecture/README.md); they do not change with the
tools. Each project keeps its realisation of this stack in its
[conventions](../../conventions/README.md).
