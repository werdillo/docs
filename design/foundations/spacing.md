# Spacing and layout

How space groups related items, separates sections, adapts across viewports and
sizes interactive targets so every screen feels structured and effortless to
hit.

## In one minute

- **4 px base grid**: every margin, padding and gap comes from the OpenDesign
  scale (`4, 8, 12, 16, 24, 32, 48, 64` px mapped to `--space-1` …
  `--space-12`, hard limit).
- **Law of Proximity**: spacing between separate groups is at least `1.5–2×`
  larger than spacing inside a group (hard rule).
- **Bounded container widths**: `520–600 px` for forms and settings, `65–75 ch`
  for prose, `1200–1440 px` (`--container-max`) for wide layouts (orienting
  ranges).
- **Mobile-first floor**: `360 px` minimum viewport with `0 px` horizontal
  overflow (hard test limit).
- **Hit targets**: `32–36 px` control height on dense desktop chrome (orienting
  range); `44 × 44 px` minimum touch target with `≥ 8 px` between adjacent
  targets (hard test limit).
- **Optical alignment**: adjust asymmetric shapes by `1–2 px` where geometric
  centring looks crooked.

## The 4 px base grid

Every spatial value snaps to multiples of `4 px` via OpenDesign tokens
([tokens](../system/tokens.md#tier-1-opendesign-contract-names)):

| Token | Value | Typical use (examples) |
|---|---|---|
| `--space-1` | `4 px` | Label-to-input gap, icon-to-text gap inside compact chips |
| `--space-2` | `8 px` | Gap between adjacent buttons or controls, tight list item padding |
| `--space-3` | `12 px` | Dense internal card padding, control horizontal padding |
| `--space-4` | `16 px` | Standard container gutter, gap between form fields |
| `--space-6` | `24 px` | Card internal padding, gap between form groups, desktop gutter |
| `--space-8` | `32 px` | Gap between major regions inside an app screen |
| `--space-10` | `48 px` | Mobile section breaks (`--section-y-*`) |
| `--space-12` | `64 px` | Desktop section breaks (`--section-y-*`), empty-state breathing room |

- **No arbitrary pixel gaps.** Spacing values such as `13 px`, `19 px` or
  `27 px` break visual rhythm and point to missing scale discipline (hard
  limit).
- **One named half-step: `2 px`** — permitted only for micro-adjustments such as
  badge vertical padding, focus ring offset or optical alignment of an icon next
  to text.

## Law of Proximity

**Elements that belong together sit closer to each other than to neighbouring
groups** — with the outer gap strictly `1.5–2×` the inner gap (hard rule):

- **Label to its own field**: `4–6 px` (`--space-1`); **one field to the next
  field**: `16–20 px` (`--space-4`, `≥ 2.5×`).
- **Heading to its own paragraph**: `8–12 px` (`--space-2` / `--space-3`);
  **previous paragraph to the next heading**: `24–32 px` (`--space-6` /
  `--space-8`, `≥ 2×`).
- **Card internal padding**: always equal to or larger than the gap between
  items inside the card. When inner gaps exceed outer padding, elements visually
  spill out of their container.

Respecting proximity lets space replace boxes and borders: two well-spaced
groups read cleanly without wrapping each one in a card.

## Container max widths

Unbounded containers stretch lines and scatter related controls across ultrawide
monitors. Cap width by content job (orienting ranges):

| Surface type | Max width | Why |
|---|---|---|
| Single-column forms, settings, confirmations | `520–600 px` | Keeps labels, inputs and validation errors inside one gaze. |
| Long-form prose, articles, descriptions | `65–75 ch` | Enforces readable line measure ([typography](./typography.md#reading-measure)). |
| Standard public pages and storefront grids | `1200–1280 px` (`--container-max`) | Fits `3–4` catalogue columns comfortably without giant tiles. |
| Wide dashboards, boards and tables | `1440 px` (or full-bleed fluid) | Lets dense columns breathe while pinning horizontal padding via `--container-gutter-*`. |

## Responsive breakpoints and mobile-first floor

- **Design at `360 px` first, then expand.** Every screen — public storefront
  and responsive app view alike — renders at `360 px` width with `0 px`
  unintended horizontal scroll (hard test limit). Wide data tables that cannot
  stack wrap inside their own local scroll container rather than overflowing the
  page.
- **Standard breakpoints** (orienting signals):

| Breakpoint | Width | Typical shift |
|---|---|---|
| Mobile base | `360 px` | Single column, `16 px` gutter, bottom or drawer navigation, `44 px` targets |
| Small / large phone | `640 px` | `2`-column compact product grids, side-by-side short form fields (e.g. postcode + city) |
| Tablet | `768 px` | Header links expand out of drawer, `2–3` column grids, `24 px` gutter |
| Laptop | `1024 px` | Persistent sidebar on internal apps, `2`-column record + properties panel |
| Desktop | `1280 px` | Full `--container-max`, `3–4` column storefront grids |

- **Preserve aspect ratios across breakpoints.** Every image and media container
  declares an explicit `aspect-ratio` so resizing or loading never shifts layout
  below it (`CLS = 0`).

## Interactive hit targets

A control's clickable area belongs to the component kit, never shrunk down to
the bounding box of a `16 px` icon
([targets are big enough](../../software/principles/web/ui/accessibility.md#targets-are-big-enough)).

- **Touch targets: `44 × 44 px` minimum** (hard test limit) on all public sites,
  mobile viewports and touch-capable controls, with at least `8 px`
  (`--space-2`) separating adjacent targets so a thumb never hits a neighbour.
- **Dense desktop internal controls: `32–36 px` height** (orienting range) for
  buttons, inputs and selects in toolbars and forms, stepping down to a `28 px`
  compact floor (hard limit) only for high-density table row actions and filter
  chips where keyboard shortcuts also apply.
- **Invisible hit-area expansion.** Where a visual icon or close button looks
  `20–24 px`, pad its button element (or use a hit-area pseudo-element) out to
  the full `32 px` desktop or `44 px` touch target so visuals stay light without
  punishing accuracy.

## Optical alignment

Geometric maths and human perception disagree on asymmetric shapes. Correct by
`1–2 px` (example) when a mathematically centred element looks off:

- **Play triangles and right-pointing chevrons** carry visual weight on their
  flat vertical edge; nudge `1–2 px` toward the point so the shape feels centred
  inside a circle or square button.
- **Icons paired with uppercase or cap-height text** align to the optical centre
  of the letters, not the full descender box of the font.
- **Rounded corners nested inside rounded corners** obey concentric radii:
  `inner radius = outer radius - padding` (for example, `--radius-lg` `12 px`
  card with `4 px` inset uses `--radius-md` `8 px` on the selected row inside).

## Example: Small shop

- **Shop site (mobile `360 px` checkout):** Single column with `16 px`
  (`--space-4`) side gutters; field labels sit `4 px` (`--space-1`) above
  `44 px`-tall inputs; fields stack with `16 px` (`--space-4`) between them;
  *Delivery address* and *Payment note* separate by `32 px` (`--space-8`); the
  *Place order* button spans full width at `48 px` height. Zero horizontal
  overflow.
- **Admin (settings screen on `1280 px` laptop):** Settings column caps at
  `560 px` inside the main area; each row holds a `32 px`-tall control on the
  right; rows inside a group separate by `12 px` (`--space-3`); separate setting
  groups divide by `32 px` (`--space-8`).

## Not this

- **Equal `16 px` spacing everywhere** — `16 px` between a label and its input
  and `16 px` between that input and the next label breaks the Law of Proximity
  so every label floats halfway between two fields.
- **`16 × 16 px` clickable icon buttons on mobile** — fails the `44 × 44 px`
  touch target floor and causes repeated mistaps on filter chips and cart
  steppers.
- **A `1400 px`-wide checkout form** — stretching a `Postcode` input across a
  wide monitor breaks the `520–600 px` form cap and separates labels from
  validation errors.
- **Horizontal page scroll at `360 px` width** — caused by an unconstrained
  `600 px` table or fixed-width hero image; violates the mobile-first floor.
- **Nested `12 px` radius inside a `12 px` radius with `8 px` padding** — leaves
  pinched corners instead of concentric geometry (`12 - 8 = 4 px`).
