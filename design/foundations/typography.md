# Typography

How type is chosen, weighted, sized and spaced so interfaces scan fast and
long-form copy reads without fatigue across desktop and phone viewports.

## In one minute

- **Typeface caps**: at most `1` UI typeface for internal apps (`--font-body`,
  plus `--font-mono` for code and IDs); at most `2` for public sites
  (`--font-display` + `--font-body`, plus `--font-mono` if needed) — hard limits.
- **3-weight scale**: regular `400`, medium `500`, semibold `600` — never
  ExtraBold (`800`) or Black (`900`) in UI chrome (hard limit).
- **Body size floors**: `13–14 px` in dense internal apps, `16–18 px` on public
  reading surfaces (orienting ranges); `12 px` hard minimum for readable UI
  text, with `11 px` reserved only for tracked uppercase micro-labels (hard test
  limit).
- **Line-height ratios**: `1.45–1.6` for body text (`--leading-body`),
  `1.1–1.25` for headings (`--leading-tight`) — orienting ranges.
- **Measure**: `45–75` characters per line (`45–75 ch`) for prose (orienting
  range).
- **`tabular-nums` everywhere numbers compare**: tables, prices, counts, timers
  and timestamps (hard test limit).

## Typeface budget

- **Internal apps use `1` sans-serif typeface** (hard limit) via `--font-body`,
  defaulting to the platform system UI face or one neutral neo-grotesque
  ([internal language](../languages/internal.md#the-look)). Consistency across
  controls matters more than typographic personality.
- **Public sites use at most `2` typefaces** (hard limit): one expressive
  `--font-display` face for headings paired with one neutral `--font-body` face
  for reading and UI controls ([public language](../languages/public.md#first-impression-and-hierarchy)).
  Pairing two similar sans-serifs creates tension without contrast; when a
  second face adds no clear distinction, stay on `1`.
- **Monospace is a functional role, not a decorative slot.** `--font-mono` is
  reserved for code snippets, order/record IDs, API keys, keyboard shortcuts and
  hex tokens. It does not count against the `1` or `2` prose face cap, and is
  never used for paragraphs or marketing headings.

## A 3-weight scale

**UI typography uses exactly `3` weights** (hard limit) so weight differences
stay unmistakable without muddying dense screens:

| Weight | Value | Role |
|---|---|---|
| Regular | `400` | Body copy, table cell values, field input text, long descriptions. |
| Medium | `500` | Field labels, navigation items, button labels, badges, table column headers. |
| Semibold | `600` | Screen titles, section headings, primary totals, active emphasis. |

- **Never use `700`, `800` or `900` in application UI.** Heavy display weights
  fill in counters at `13–16 px`, blur on non-Retina screens and overpower
  adjacent controls. Public marketing display headlines (`≥ 32 px`) are the only
  named exception where a theme's `--font-display` may step up to `700`.
- **Never use weights below `400` (`100–300`) for body or UI text** (hard limit).
  Thin and Light strokes drop below readable luminance on standard displays and
  fail contrast checks even when their colour values pass.

## Size floors and scale

Every font size comes from the OpenDesign scale (`--text-xs` … `--text-4xl`,
[tokens](../system/tokens.md#tier-1-opendesign-contract-names)), never raw pixel values in a component.

- **Dense internal body: `13–14 px`** (orienting range). Secondary metadata
  steps down to `12 px`; screen titles sit at `15–18 px` inside the header bar
  rather than as hero banners ([internal language](../languages/internal.md#dense)).
- **Public reading body: `16–18 px`** (orienting range). Visitors read
  paragraphs at arm's length on phones and laptops; `16 px` prevents iOS Safari
  auto-zoom on focused form inputs as well as reading strain.
- **Hard floor: `12 px` for readable UI text** (hard test limit). Nothing a user
  must read — hints, timestamps, table metadata, error text, footer links — goes
  below `12 px`.
- **One named exception: `11 px` uppercase micro-labels** (hard test limit),
  used only for compact section overlines or table headers set in `500` weight
  with `+0.04em` to `+0.08em` tracking (`letter-spacing`) and full `4.5:1`
  contrast. Never set sentence-case prose at `11 px`.

## Line-height and tracking

- **Body text uses `1.45–1.6` line-height** (`--leading-body`, orienting range).
  Short UI labels and single-line controls use `1.2–1.35` so buttons and table
  rows stay crisp; multi-line descriptions and articles stay at `1.5–1.6` so the
  eye tracks cleanly from the end of one line to the start of the next.
- **Headings use `1.1–1.25` line-height** (`--leading-tight`, orienting range).
  Large type with body line-height breaks a two-line heading apart into
  disconnected stripes.
- **Tighten display tracking slightly; never squeeze small text.** Display
  headings (`≥ 28 px`) use subtle negative tracking (`--tracking-display`,
  typically `-0.015em` to `-0.03em`, orienting signal). Body text stays at `0`,
  and uppercase micro-labels add `+0.04em` to `+0.08em` tracking.

## Reading measure

- **Prose lines stay between `45` and `75` characters** (`45–75 ch`, orienting
  range; `65 ch` is the typical target, example). Lines longer than `75 ch`
  cause the eye to lose its place on the return sweep; lines shorter than
  `45 ch` break rhythm with excessive hyphenation and line breaks.
- **Apply `max-width: 65ch` to text blocks inside wide layouts**, including
  product descriptions, help callouts, confirmation messages and activity
  comments — even when the surrounding container spans `1200 px`
  ([spacing](./spacing.md)).

## Tabular numerals

- **Every numeric column, price, count, badge counter, timer and timestamp sets
  `font-variant-numeric: tabular-nums`** (hard test limit). Proportional figures
  give `1` a narrower advance width than `8`, making currency columns wobble and
  live counters jitter horizontally as digits tick.
- **Align numeric columns right** (`text-align: end`) in tables and summaries so
  decimal points and currency positions line up vertically down the column.

## Text expansion and overflow (localisation)

- **Design for `20–35%` text expansion** (orienting signal). Translated labels
  in Russian, German or French routinely run a third longer than English
  (*"Cancel order"* → *"Отменить заказ"*, *"In stock"* → *"В наличии"*). Never
  fix the width of buttons, tabs, badges or navigation items to the exact width
  of an English word.
- **Declare overflow behaviour per slot.** Single-line list cells, breadcrumbs
  and sidebar items set `min-width: 0`, truncate with an ellipsis
  (`text-overflow: ellipsis`) and expose the full string in a tooltip or record
  view; headings, form labels, hints and error messages wrap cleanly onto a
  second line rather than clipping mid-word.

## Example: Small shop

- **Shop site (product page):** `--font-display` at `32 px` (`600`,
  `line-height: 1.15`, `--tracking-display: -0.02em`) for the ceramic mug title;
  `--font-body` at `16 px` (`400`, `line-height: 1.55`, `max-width: 60ch`) for
  the description; price `£28.00` in `18 px` (`600`, `tabular-nums`).
- **Admin (orders list):** Single `--font-body` face at `14 px` (`400`,
  `line-height: 1.4`) for customer names; column headers at `11 px` uppercase
  (`500`, `+0.05em` tracking) in `--muted`; order IDs (`#ORD-0412`) in
  `--font-mono` at `13 px`; dates (`26 Nov 14:05`) and totals (`£142.50`) set
  with `tabular-nums` and right-aligned.

## Not this

- **Four font families on one storefront** — a script logo font, a display
  serif, a geometric heading sans and a body sans; that exceeds the `2`-face
  limit and slows first paint.
- **`900` Black buttons and `300` Light helper text** — breaking the `3`-weight
  scale so buttons shout while helper copy vanishes.
- **`10 px` grey timestamps and legal notes** — below the `12 px` readable floor
  and illegible on standard desktop monitors.
- **Proportional figures in a prices table** — `£111.00` sitting narrower than
  `£888.00` so totals fail to align vertically.
- **Full-width `130 ch` paragraphs across a `1440 px` screen** — exceeding the
  `75 ch` measure cap and forcing horizontal head movement to read one sentence.
