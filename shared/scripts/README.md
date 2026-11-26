# Scripts

Repository-wide build and verification scripts.

| File | What it holds |
|---|---|
| [`build-skills.sh`](./build-skills.sh) | Runs every section's `skills/build.sh` to refresh `references/` from the source documents. |
| [`check-docs.mjs`](./check-docs.mjs) | Checks folder READMEs, relative Markdown links and heading anchors, `references/` sync, British spelling and rule phrasing. |
| [`bundle-product-doc.mjs`](./bundle-product-doc.mjs) | Compiles a product document folder (`01`–`04` business or `01`–`08` full, plus `log.md`) into one clean Markdown file for sharing or PDF export. |
