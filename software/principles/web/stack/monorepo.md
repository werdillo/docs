# The monorepo and the contracts package — recommended, not required

Most projects are a **monorepo**: a few packages that share the repository —
the API, the front end, the clients — with **one package holding the
contracts** (named `shared` or `contracts` in the repository; the contracts
package in these documents). Its single source of truth is the set of schemas
in one schema library (for example zod). Both sides depend on it and parse
against it, so a shape crossing the boundary is declared once
([`architecture/`](../architecture/README.md), "A contract lives once"), and its
folders mirror the box paths of the other packages — so the same box is found
in the same place everywhere.

It is **not required**. A single-package project keeps the contracts in a folder
instead, and that is fine. In a monorepo the separate package is simply the
convenient home: it depends on almost nothing, and both sides import it.
