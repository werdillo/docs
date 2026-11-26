# The principles

Each rule carries a status: *guarded* when a test in
[enforcement](./architecture/enforcement.md) fails on it, *signal* when it is an
orienting size, and *default* otherwise. A default is followed unless a reason
says otherwise; a signal asks a question and fails no test. Status is about
the test, not importance.

Grouped by what they are about. Each is expanded in the folder or file named.

## Architecture — [`architecture/`](./architecture/README.md)

1. **Invert the dependency at a seam** — define a registry or port a higher
   layer fills, rather than importing upward; a third party is reached through
   a port its user owns, filled by one adapter per provider, and every call
   to it has a timeout and a retry count. *(default)*
2. **The composition root is the only place that knows everything** *(guarded)*;
   every box declares itself, and the root lists the declarations.
3. **A contract lives once**, at the boundary, and a consumer parses it;
   what comes in has a maximum size, checked before it is parsed.
   *(default)*
4. **Say no with a value**, not an exception — a refusal with a stable code; the
   boundary maps the code to a status. *(default)*
5. **Fail closed** *(guarded)* — the owner decides access, every read is scoped,
   absence and denial look the same, and a secret is writer-only.
6. **A reader sees a view, never a row** *(guarded; the key count is a signal)*
   — a public read is field by field; a list is a summary and a detail is the
   full shape; and a view is **grouped**: aim for about 9–10 top-level keys —
   `id`, `meta` and the business blocks. A flat record is never sent.
7. **Atomic writes are one transaction; racing writes are versioned** — and a
   write that reaches outside the database answers for it. *(default)*
8. **A box owns its data; between boxes, reference by id** *(guarded)* — on a
   server, its tables: no cross-box foreign key or join, and so nothing cascades
   between boxes.
9. **Long work is a job, never a request** *(guarded)* — idempotent, retried,
   dead-lettered.
10. **Boxes meet through their doors** *(guarded)* — a box reaches a neighbour only through
    its entry file, which holds only import and export lines and its part;
    inside a box, files import each other by relative path. `shared` and `features` lie
    below the domains and are imported from domains by path; peer boxes inside
    `features` still meet through their doors. Domains never import each
    other, another box's commands are called only by a process, and no
    cycle runs through doors. A domain's or a group's entry is composition,
    and exempt.

## Macro — [`structure/`](./structure/README.md)

11. **The code is a set of matrices** *(guarded)* — the layers of a package's `src/`,
    usually `core ← features ← domains` (a front end adds `components`), each a
    matrix of boxes, the layers related by the arrows. `core` and `features`
    depend on the type of package; the domains are the same in every package,
    so one name is the whole address of a box.
12. **A box is opaque at the macro level**: you reason about what it is for and
    which other boxes it may reach, not how it is built. *(default)*
13. **Boxes interact by the first step that works**: inside one box; through
    the lowest `shared` they all reach (preferred — common and stable, never
    coordination); through another box's door for a read (one way, never in a
    cycle, a cost each time); and a **process** above them for any write that
    spans boxes, or when direct links pile up
    ([`structure/processes.md`](./structure/processes.md)). *(default)*
14. **Up to about 10 boxes per matrix, including `shared`** — the
    [sizing signal](./structure/matrix.md#sizing). *(signal)*
15. **A box is drawn around a subject** — one purpose without an "and", its own
    data, and it changes as one. *(default)*
16. **A folder holds boxes or slices, never both** — a folder of boxes is a
    matrix, a folder of slices is a box (`_processes`, the level above the
    boxes, is the marked third case). *(default)*
17. **Packages share only the contracts package**; they never import each other.
    *(default)*
18. **A box sits where its users are** — down to the `shared` they share (or
    `features` when every domain needs it) when a second one needs it, further
    down to `core` when it stops knowing a subject, and it keeps its name when
    it moves. *(default)*

## Micro — [`structure/`](./structure/README.md)

19. **A box owns everything about itself** — its data (`model` on a server,
    state on a front end), its addresses, its menu entry, its part (what it puts
    into the registries below), its tests and docs — in one place, not in a
    central one. *(default)*
20. **A box is cut into technical slices** — `api`, `services`, `hooks`, `ui` on
    the front end; `handlers`, `routes`, `services`, `model` on the server.
    *(default)*
21. **Each slice is reached through its barrel**, or is one file;
    files inside a slice link to each other directly by relative path, and the
    box's own entry file is its door. *(default)*
22. **≤ ~4–6 file-subjects stays flat; a file is ~50–150 lines; a slice past
    ~7–9 files may group them into subject subfolders** — the
    [sizes](./structure/sizes.md#flat-when-small-and-the-sizes). *(signal)*

## Screens — [`ui/`](./ui/README.md)

23. **A screen composes the kit; the kit owns the look** *(guarded)* — no raw
    control, table or styled tag in a screen, only layout classes; sizes,
    colours, widths and states are the kit's.
24. **Text is one component with a fixed scale** of about nine variants; its
    colour is inherited unless a kit tone variant is named (e.g. `tone="muted"`,
    `tone="danger"`), never a raw value or direct colour utility. *(default)*
25. **A state is a variant chosen from data** — a `status → variant` map, never
    a class string; a variant never needs overriding. *(default)*
26. **The kit grows from repetition** — three of the same markup become a kit
    variant or part, kit first, then the screens. *(default)*
27. **Layout is the kit's too** — a field stacks its own label, control and hint;
    field grids, form actions, lists, card bodies, page widths and dialog sizes
    are named parts, and no width is typed by hand. *(default)*
28. **A screen reads top-down** — the exported component shows the shape, named
    private components follow; a file may hold several components and exports
    one; depth is the signal, not length. *(default)*
29. **Data is read where it is shown**; a hook is for state that is reused,
    shared or outlives the component. *(default)*
30. **Accessible by construction** — the role says what a control does, every
    control has a name, and a name is a contract browser tests rely on.
    *(default)*

31. **The look is tokens with OpenDesign names** — every colour, size, space,
    radius, shadow and duration is a token of the OpenDesign contract, one theme
    file declares them all, and no raw value is typed outside it
    ([tokens](../../../design/system/tokens.md)). *(default)*
32. **An internal system is calm and dense** —
    achromatic chrome, one accent for the primary action, focus and selection;
    hierarchy by luminance and weight; app-sized text and rows. Linear is the
    reference for behaviour (its menus, density, keyboard and screen shapes),
    while the look is the product's own — never a copy of Linear's
    ([the design language](../../../design/languages/internal.md)). *(default)*
33. **Four screen shapes** — a list, a record with its properties panel,
    settings, a canvas — inside one frame; a fifth is a question for the kit.
    *(default)*
34. **Keyboard first, instant feel** — ⌘K finds and does, lists move by key,
    a safe write shows at once and a reversible one is undone, not confirmed.
    *(default)*

## Stack — [`stack/`](./stack/README.md)

**Allowed languages:** TypeScript (the default), Go, Zig (for WebAssembly),
Python, Rust. A stack must provide the qualities below whatever its tools; the
tools a project uses to provide them are in the project's conventions — stack.
These are the qualities:

35. **One runtime and one type system, end to end.** *(default)*
36. **One schema language types and validates every shape**, on both sides of
    a boundary. *(default)*
37. **The schema is the models moved forward by migrations** *(guarded)* — a
    change to a model is a numbered migration written from the diff, a frozen
    baseline is never regenerated, and the latest snapshot must equal the models.
    ([schema](./guards/schema.md))
38. **Prefer managed primitives** over self-run infrastructure. *(default)*
39. **Ship nothing to a client it does not need** *(guarded)* — plain TypeScript
    stays separate from framework UI, and a package exports only its promised
    names ([ui guards](./guards/ui.md)).
40. **One copy of anything with identity**; versions pinned in one place.
    *(default)*
41. **One command checks everything**, reproducibly, and CI runs the same steps.
    *(default)*

*Recommended, not required:* most projects are a **monorepo**, with one
contracts package holding the schemas both sides import
([`stack/`](./stack/README.md)).

*Examples, not requirements — mobile and desktop:* a native-shell framework
(NativeScript, Capacitor) for mobile; a GPU-rendered framework (GPUIX) or a
desktop shell (Electrobun) for the desktop ([`stack/`](./stack/README.md)).

## The road

42. **Guardrails where leaving the road is expensive** — a test for those few
    places; everything else is a signpost, and a signpost that misleads is
    changed. *(default)*
43. **Docs describe the code as it is** — no dates, no phases, no history. A
    gap in these principles is listed in [not decided yet](./open-questions.md);
    what a project has not built is one line in its roadmap. *(default)*
44. **A rule lives once.** Repo-wide, per package, per box; everything else
    links. *(default)*

## Tests — [`testing/`](./testing/README.md)

45. **Tests live where the behaviour lives** — a box's tests beside its slices,
    a process's on its line, the composition root's over the assembly, a
    contract's where its consumer reads it. *(default)*
46. **Each tier guards one edge, and no tier re-tests one below it** — a box's
    decisions, a write against a real database, a screen's contract, the real
    backend at the boundary. *(default)*
47. **Test helpers live once**, at the level of their subjects; a test's setup
    uses them, not another box's handlers. *(default)*
48. **A guard fails loudly, and its exceptions only shrink** — a known list
    carries a reason and fails when an entry no longer matches; a soft signal
    says so in its header. *(default)*

## Sites — [`site/`](./site/README.md)

49. **The first HTML is the page** *(guarded)* — the content, the links and the
    metadata are in the response, not added by a script
    ([rendering](./site/rendering.md)).
50. **An address is a promise** *(guarded)* — readable, stable, one per content;
    an address that once answered redirects for ever or says it is gone
    ([addresses](./site/addresses.md)).
51. **A page declares its head** *(guarded)* — title, description, canonical
    address, language, social preview and structured data live beside the page,
    from the data it shows ([pages](./site/pages.md)).
52. **The composition root assembles what crawlers read** *(guarded)* — the
    sitemap, `robots.txt` and feeds are built from those declarations, never
    listed by hand ([pages](./site/pages.md#what-the-composition-root-builds)).
53. **A product UI is not a site: it is kept out of search, whole** *(guarded)*
    — every route answers `noindex` and the build carries no sitemap
    ([rendering](./site/rendering.md#a-product-ui-is-kept-out-of-search)).
54. **Speed is measured where people are, against three numbers** — LCP, INP and
    CLS at the 75th percentile of real visits
    ([rendering](./site/rendering.md#speed-is-three-numbers)). *(signal)*
