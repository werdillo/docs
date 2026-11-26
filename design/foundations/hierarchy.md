# Visual hierarchy

How a screen directs the eye so a person knows what matters first, what supports
it and what to click — in under three seconds, without reading a manual.

## In one minute

- **One primary focal point per screen** (or per horizontal band on a long
  public page); two competing focal points leave neither primary.
- **Apply emphasis in order**: position → size → contrast/luminance → weight →
  colour. Colour is the last lever, not the first.
- **One primary action per screen or region** (`1`, hard limit), and at most
  `2` accent spots on internal chrome (hard limit).
- **Pass the squint test**: blurring the screen shows at most `3` visual levels
  — primary, secondary and supporting (orienting signal).
- **Align to natural scan paths**: F-scan for dense lists and reading; Z-scan
  for landing bands, empty states and sign-in screens.

## One primary focal point

- **Every screen has one dominant element.** When a title, a banner, three
  coloured buttons and a floating tooltip all fight at the same visual weight,
  the eye stalls. Decide the one job of the screen first; everything else steps
  down behind it.
- **Long public pages get one focal point per band.** On a scrollable storefront
  or landing page ([public language](../languages/public.md#first-impression-and-hierarchy)),
  each horizontal section holds one primary claim or action, separated by clear
  vertical space (`--section-y-*`) so two bands never compete in the same
  viewport.
- **Secondary controls recede.** Quiet fills, muted borders (`--border`) and
  regular or medium text (`--fg-2`, `--muted`) hold secondary options in reach
  without pulling focus from the primary path.

## Emphasis order

**Use the five levers of visual weight in strict sequence** — reaching for a
louder lever only when the quieter ones have done their work:

| Order | Lever | How it creates priority | Tokens |
|---|---|---|---|
| `1` | **Position** | Top-left (top-right in RTL) and upper-centre read first; isolated elements draw more attention than crowded ones. | `--space-*`, `--section-y-*` |
| `2` | **Size** | Larger type or a larger container establishes rank before colour enters. | `--text-xs` … `--text-4xl` |
| `3` | **Contrast / luminance** | Darker ink (`--fg`) or a lifted surface (`--surface`) separates primary facts from secondary (`--fg-2`, `--muted`, `--meta`). | `--bg`, `--surface`, `--fg`, `--muted` |
| `4` | **Weight** | Stepping from `400` to `500` or `600` highlights labels and headings inside a dense grid ([typography](./typography.md)). | `400`, `500`, `600` |
| `5` | **Colour** | Reserved for the one primary action, active selection, focus ring and semantic status ([colour](./colour.md)). | `--accent`, `--success`, `--warn`, `--danger` |

Position and size scale across colour-blindness, dark mode and bright sunlight.
A layout whose hierarchy collapses when converted to greyscale relies on colour
too early.

## Accent budget

- **At most `1` primary filled button per screen or dialog** (hard limit). A
  second filled `--accent` button in the same region creates an unranked tie;
  demote the secondary action to a quiet fill or text button.
- **At most `2` accent spots visible on internal chrome** (hard limit, matching
  [the internal language](../languages/internal.md#calm)). In an app, `--accent`
  appears only on the active navigation selection, the single primary button or
  the active focus ring.
- **Destructive actions never share the accent slot.** Confirmations for
  irreversible actions use `--danger`, paired with a plain cancel control —
  never `--accent` next to `--danger` at equal fill weight.

## The squint test

- **Blur the screen to verify rank.** Stepping two metres back or applying a
  `4–6 px` Gaussian blur (orienting signal) strips away fine copy and reveals
  the true visual skeleton.
- **Count at most `3` distinct weight tiers** (orienting signal):
  1. **Primary** — the headline or primary action that catches the eye first.
  2. **Secondary** — section labels, key figures, card titles and navigation.
  3. **Supporting** — metadata, timestamps (`--meta`), borders (`--border-soft`)
     and quiet actions.
- **If everything stays dark and heavy under blur, the screen has no
  hierarchy.** Lower the contrast of supporting elements to `--muted` or
  `--meta`, widen gaps between groups ([spacing](./spacing.md)), or remove
  redundant boxes.

## Scan alignment

- **F-scan for dense lists, tables and prose.** Readers scan the top bar left to
  right, drop down the left edge and flick right only on rows that match their
  goal. Put the row's primary identifier in column one, align labels to a clean
  left edge (`inline-start`) and place secondary metadata and actions to the
  right (`inline-end`).
- **Z-scan for sparse screens and public hero bands.** On a landing band,
  sign-in view or empty state, the eye sweeps top-left (brand) → top-right
  (primary utility such as cart or sign-in) → diagonal to the headline → across
  to the primary action button.
- **Never scatter related anchors across opposite corners.** Keep a section's
  title, count and filter controls on one horizontal baseline so the eye does
  not ping-pong across a `1440 px` viewport.

## Example: Small shop

- **Shop site (product screen — Z-scan into F-scan):** The product photograph
  and title occupy the primary focal slot; price (`--fg`, `600`) and stock state
  sit directly beneath; one filled `--accent` button (*Add to cart*) anchors the
  decision. Dimensions, care notes and shipping terms step down to `--fg-2` and
  `--muted` below the action.
- **Admin (orders list — F-scan):** The header bar holds the screen title on the
  left and one `--accent` button (*New order*) on the right — the single filled
  accent on the screen. Each order row leads with order number and customer name
  in `--fg`, followed by date and item count in `--muted`, status badge in a
  fixed column and total aligned right. Under a squint test, only the header
  action, customer names and status column stand out; chrome recedes to quiet
  greys.

## Not this

- **Three filled accent buttons in one toolbar** — *"Save"*, *"Export"* and
  *"Create"* all in `--accent`; that breaks the `1` primary action limit and
  hides the real default.
- **Coloured headers and tinted banners on every card** — using colour before
  position and size; that is noise competing with real status badges.
- **Centred multi-column forms or tables** — breaking the left-edge scan line
  so the eye re-hunts for the start of every row.
- **Equal font size and weight for title, label and timestamp** — failing the
  squint test because all `3` tiers collapse into one flat grey block.
- **A card wrapped in a border around every list section** — adding visual
  weight to containers instead of using space and `--border-soft` hairlines.
