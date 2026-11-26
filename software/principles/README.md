# Principles

| Set | For | Written in |
|---|---|---|
| [`web/`](./web/README.md) | Web products — an API, a front end, a client: feature matrix design, the stack, tests, screens. | TypeScript |
| [`low-level/`](./low-level/README.md) | Low-level programs — a service, firmware, a library, a tool: bounded memory, loops and failures. | Zig |

Each set is a central reference for people and for building agent skills; it is
not copied into each project. Project-specific choices — stack versions, roles,
secrets, theme values — live in that project's own conventions folder, named in
plain text here rather than linked by relative path.

The visual side of a front end — the design language and the tokens — lives in
[`design/`](../../design/README.md); `web/ui/` holds how code builds it.
