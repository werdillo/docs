# Colour

How colour is authored, tested for contrast, assigned to semantic roles and
balanced across light and dark themes so every surface stays legible and calm.

## In one minute

- **Author palettes in OKLCH**, so equal steps of lightness (`L`) and chroma
  (`C`) look visually consistent across every hue.
- **Enforce hard contrast floors**: WCAG `4.5:1` for normal text, `3:1` for
  large text and UI controls/borders; APCA `Lc ≥ 60` for body text and
  `Lc ≥ 75` for dense `13–14 px` UI text (hard test limits).
- **Follow the 60 / 30 / 10 achromatic-first balance** (orienting signal):
  neutral canvas and lifted greys carry `90%` of the screen; brand and status
  colours stay at or below `10%`.
- **Use OpenDesign semantic tokens** (`--accent`, `--success`, `--warn`,
  `--danger`), and never use colour alone to communicate state (hard test
  limit).
- **Design light and dark as equals**: dark mode elevates by luminance on soft
  off-black, never pure `#000000` and never an inverted light palette.

## Perceptual colour with OKLCH

- **Define theme tokens in OKLCH (`oklch(L C H)`)** in the single theme file
  ([tokens](../system/tokens.md#one-theme-is-one-file)). In HSL, yellow at
  `50%` lightness reads bright while blue at `50%` reads dark; in OKLCH,
  changing hue `H` while holding `L` and `C` constant preserves perceived
  brightness, making status badges (`--success`, `--warn`, `--danger`) balance
  at equal visual weight.
- **Derive tints and hovers perceptually.** Theme extensions such as
  `--surface-hover` or `--danger-soft` mix contract tokens in `oklab`
  (`color-mix(in oklab, var(--danger) 12%, transparent)`) so soft fills stay
  clean without shifting muddy or grey.
- **No raw colour literals in components** (hard limit). Every colour reaches a
  component through a named token utility ([tokens](../system/tokens.md#how-code-reaches-a-token));
  an inline hex or `oklch()` inside a screen is a missing token.

## Hard contrast floors

Contrast is verified in both light and dark modes on every foreground/background
token pair — including `--muted`, `--meta`, button text (`--accent-on`), input
borders (`--border-strong`) and focus rings (`--focus-ring`)
([contrast is a kit token](../../software/principles/web/ui/accessibility.md#contrast-is-a-kit-token)).

| Target | WCAG 2.1 minimum | APCA minimum | Kind |
|---|---|---|---|
| Normal text (`< 24 px`, or `< 18.67 px` at `600`) | `4.5:1` | `Lc ≥ 60` (`16 px+` body) | Hard test limit |
| Small dense UI text (`12–14 px`, `400–500`) | `4.5:1` | `Lc ≥ 75` | Hard test limit |
| Large text (`≥ 24 px`, or `≥ 18.67 px` at `600`) | `3:1` | `Lc ≥ 45` | Hard test limit |
| UI controls, field borders, meaningful icons, focus ring | `3:1` | — | Hard test limit |
| Disabled controls and purely decorative hairlines (`--border-soft`) | Exempt | Exempt | Named exception |

- **Check both WCAG and APCA.** WCAG 2.1 is the legal baseline; APCA accounts
  for polarity (light text on dark surfaces vs dark text on light surfaces) and
  font size, catching low-readability combinations such as white text on bright
  orange or faint grey text at `13 px` in dark mode.
- **Placeholder text is not an exception when it carries instructions.** If a
  user must read a placeholder or `--meta` timestamp to act, it meets `4.5:1`.

## Achromatic-first balance (60 / 30 / 10)

**Greys and surface steps do the structural work; chromatic colour stays rare**
(orienting signal):

- **`60%` primary canvas (`--bg`)** — clean off-white or pure white in light
  mode, soft off-black in dark mode.
- **`30%` secondary surfaces and neutral hierarchy** — lifted containers
  (`--surface`, `--surface-warm`), hairlines (`--border`, `--border-soft`),
  secondary ink (`--fg-2`, `--muted`, `--meta`) and quiet fills.
- **`≤ 10%` chromatic colour** — `--accent` for the primary action, active
  selection and focus, plus `--success`, `--warn` and `--danger` strictly where
  state demands attention.

Keeping `90%` of the viewport neutral ensures that when a red `--danger` error
or an amber `--warn` banner appears, a user spots it immediately without
competition.

## Semantic colour roles

Every chromatic token owns one meaning across the entire product:

| Token | Meaning | Paired text / soft tint |
|---|---|---|
| `--accent` | Primary action, active selection, focus ring | `--accent-on` on filled `--accent`; soft tint for selected rows |
| `--success` | Confirmed completion, healthy state, in-stock positive | High-contrast text on soft green tint or solid fill |
| `--warn` | Caution, pending review, low stock, expiring state | Dark ink or dark-tuned amber text (yellow-on-white fails contrast) |
| `--danger` | Error, failed write, destructive confirmation, out-of-stock block | High-contrast white or red ink depending on fill; never reused for marketing |

- **Never use colour alone to communicate state** (hard test limit). Roughly
  `8%` of men and `0.5%` of women have colour-vision deficiency; every coloured
  dot, badge, input error or chart series pairs colour with a text label, a
  distinct icon or a pattern.
- **Never repurpose a status token for decoration.** A marketing badge in
  `--danger` red reads as an error; a chart using `--success` green for neutral
  category data implies positive performance.

## Light and dark as equals

- **Dark mode is designed from scratch, never inverted from light.** Simply
  flipping lightness turns subtle borders harsh, makes saturated accents vibrate
  and flips elevation upside down ([internal language](../languages/internal.md#light-and-dark-are-equal)).
- **Use soft off-black, never pure `#000000`, for dark canvases** (hard limit).
  Pure black paired with pure `#ffffff` ink (`21:1` contrast) triggers halation
  — text halos that blur for readers with astigmatism. Set `--bg` around
  `OKLCH L = 0.13–0.16` (orienting range) and `--fg` around `L = 0.92–0.95`.
- **Elevate by luminance in dark mode.** Shadows vanish against dark surfaces;
  each lifted layer steps lighter in `L` — `--bg` (`L ≈ 0.14`) → `--surface`
  (`L ≈ 0.18`) → `--surface-warm` or floating menus (`L ≈ 0.22`, example) —
  reinforced by a subtle `1 px` `--border` hairline.
- **Desaturate accents slightly in dark mode.** High-chroma hues (`C > 0.20`)
  that feel crisp on white vibrate on dark charcoal; lower chroma by `10–20%`
  and raise lightness `L` slightly so `--accent` stays legible against dark
  surfaces (orienting signal).
- **Single-mode exception for public sites.** Internal apps always support both
  light and dark equally; a public brand site may author one mode intentionally
  when its photography requires it ([public language](../languages/public.md#responsive-fast-and-shareable)).
  Where both modes exist, both obey every rule on this page.

## Example: Small shop

- **Admin (order statuses across light and dark):** *Paid* pairs `--success`
  with a check icon and the word *"Paid"*; *Awaiting transfer* pairs `--warn`
  with a clock icon; *Cancelled* pairs `--danger` with a cross icon. In light
  mode, the orders list sits on a cool grey canvas (`--bg`) with white detail
  cards (`--surface`). In dark mode, the canvas sits at `oklch(0.14 0.005 260)`,
  detail cards step up to `oklch(0.18 0.005 260)` and dialogs to
  `oklch(0.22 0.006 260)` with `1 px` `--border` hairlines.
- **Shop site (catalogue tile & checkout):** Neutral photography and warm white
  (`--bg`, `--surface-warm`) occupy over `90%` of the page; `--accent` appears
  only on *Place order* (`--accent-on` verified at `5.2:1`, `Lc 78`). *Sold out*
  appears as a text label with a muted pill rather than a red border alone.

## Not this

- **Pure `#000000` background with `#ffffff` body text** — causes halation; use
  soft off-black (`L = 0.13–0.16`) and off-white ink (`L = 0.92–0.95`).
- **A status column showing only coloured `8 px` dots** — fails colour-blind
  users; pair every dot with an icon or a visible status word.
- **`--muted` grey text at `2.8:1` contrast** — "subtle" is not an excuse to
  break the `4.5:1` and `Lc ≥ 75` floor; fix the token in the theme file.
- **White text on bright yellow `--warn` badges** — fails both WCAG (`~1.9:1`)
  and APCA; use dark ink on a soft amber fill or a deeper amber ink on light
  surfaces.
- **Hard-coding `dark:bg-zinc-900` inside a component** — a missing token; light
  and dark swap values in the theme file behind the same semantic name.
