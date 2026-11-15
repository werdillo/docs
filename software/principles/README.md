# Principles

| Set | For | Written in |
|---|---|---|
| [`web/`](./web/README.md) | Web products — an API, a front end, a client: feature matrix design, the stack, tests, screens. | TypeScript |
| [`low-level/`](./low-level/README.md) | Low-level programs — a service, firmware, a library, a tool: bounded memory, loops and failures. | Zig |

Each set is copied into a project on day one and kept for its life. Links into
`../conventions/` point at the project's own conventions folder, which exists
in the project the set is copied into, not here.

The visual side of a front end — the design language and the tokens — lives in
[`design/`](../../design/README.md); `web/ui/` holds how code builds it.
