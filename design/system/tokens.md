# Design tokens

Every value the look is made of — a colour, a size, a space, a radius, a
shadow, a duration — is a named token, structured in **three tiers** built from
the bottom up:

1. **Contract tokens** — the [OpenDesign](https://open-design.ai) semantic
   contract, shared across every product so a theme drops in unchanged and a
   person, a design tool and an agent all mean the same thing by `--muted`.
2. **Semantic extensions** — the few app-level roles the contract does not
   define (`--surface-hover`, `--panel`, `--overlay`, `--danger-soft`), derived
   from contract tokens wherever possible.
3. **Component tokens** — component-scoped variables (`--button-height-md`,
   `--input-bg`, `--row-height`, `--dialog-radius`) that alias tier-1 or tier-2
   tokens so components stay independent of raw values and one theme file tunes
   density across `internal` and `public` languages without forking components.

**Build order: tokens first, components second, interfaces third.** A new
product defines its theme tokens first, verifies their contrast and scale
against [`foundations/`](../foundations/README.md), builds its kit components
from those tokens ([`components/`](./components/README.md)), and composes every
screen from those components ([`patterns/`](../patterns/README.md)).

## One theme is one file

- **One theme source declares all three tiers** — [`tokens.json`](./tokens.json)
  as machine-readable data (W3C Design Tokens format) and one generated or
  authored theme stylesheet declaring light on the root and dark under the
  scheme selector the app uses. Nothing else declares tokens.
- **A theme starts from an OpenDesign design system** — its token file and its
  design document — and tunes the values to the product: an internal app reads
  smaller and denser than a public storefront. The values are the theme's; the
  contract names are never changed.
- **An optional slot the theme does not differentiate is an alias**, as the
  contract says: `--fg-2: var(--fg)`, never left out — a component that uses
  it always resolves.
- **Light and dark are the same names with other values.** A component never
  branches on the scheme; a `dark:` utility in a component is a token missing.

## Tier 1: OpenDesign contract names

| Role | Tokens |
|---|---|
| Surfaces | `--bg` the canvas, `--surface` a lifted container, `--surface-warm` a third tier |
| Text | `--fg` primary, `--fg-2` secondary, `--muted` subtext, `--meta` the faintest — timestamps, disabled |
| Lines | `--border` an edge, `--border-soft` a separator inside one |
| Accent | `--accent`, `--accent-on` (text on it), `--accent-hover`, `--accent-active` |
| Status | `--success`, `--warn`, `--danger` |
| Type | `--font-display`, `--font-body`, `--font-mono`; `--text-xs` … `--text-4xl`; `--leading-body`, `--leading-tight`, `--tracking-display` |
| Space | `--space-1` … `--space-12`; `--section-y-*` |
| Shape | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill` |
| Depth | `--elev-flat`, `--elev-ring`, `--elev-raised`, `--focus-ring` |
| Motion | `--motion-fast`, `--motion-base`, `--ease-standard` |
| Layout | `--container-max`, `--container-gutter-*` |

A name means what the contract says, not what a component library taught:
**`--muted` is a text colour**, not a grey fill, and **`--accent` is the brand
colour**, not a hover background.

## Tier 2: Semantic extensions

An app needs a few shared roles a marketing page does not — the fill of a
hovered or selected row, the sunken panel a sidebar sits on, the overlay behind
a dialog, soft tints behind statuses and tinted selections. These are the
theme's **extensions**:

- declared in the same file, right after the contract tokens, and listed in the
  theme's README;
- named the contract's way — a role prefix, kebab-case: `--surface-hover`,
  `--surface-selected`, `--panel`, `--overlay`, `--accent-soft`,
  `--success-soft`, `--warn-soft`, `--danger-soft`;
- **derived from contract tokens** where they can be
  (`color-mix(in oklab, var(--fg) 5%, transparent)` or
  `color-mix(in oklab, var(--danger) 12%, transparent)`), so swapping a base
  theme updates them automatically;
- few (about `6–12` — orienting signal). An extension every app needs is a name
  to propose to the OpenDesign contract.

## Tier 3: Component tokens

Component tokens bind a component's specific slots to tier-1 and tier-2 tokens,
so a component specification stays readable and a theme can switch density
(for example dense `32 px` controls in an internal admin versus `44 px` touch
controls on a public storefront) in one place:

- **Naming pattern:** `--<component>-<property>` or
  `--<component>-<part>-<property>`, kebab-case: `--button-height-md`,
  `--button-px-md`, `--button-radius`, `--input-bg`, `--input-height`,
  `--row-height`, `--dialog-bg`, `--dialog-max-w`, `--badge-height`,
  `--sidebar-width`.
- **Always alias tier 1 or tier 2 — never raw colours.** `--button-primary-bg:
  var(--accent)` and `--input-radius: var(--radius-sm)` are valid;
  `--button-primary-bg: #2563eb` is forbidden. Numeric dimensions (such as
  `--sidebar-width: 240px` or `--row-height: 36px`) stay on the `4 px` base
  grid ([spacing](../foundations/spacing.md)).
- **Scoped to the component that owns them.** `--input-border` is read only by
  the field components, never borrowed by a dialog or badge.
- **Keep the surface small.** Only promote a value to a component token when it
  differs across variants, density modes (`internal` vs `public`) or themes —
  otherwise read the tier-1/tier-2 token directly.

| Component group | Key component tokens | Internal default | Public default |
|---|---|---|---|
| Button | `--button-height-sm / md / lg`, `--button-radius` | `28 / 32 / 36 px`, `--radius-md` | `36 / 44 / 48 px`, `--radius-md` |
| Field / Input | `--input-height`, `--input-bg`, `--input-border`, `--input-radius` | `32 px`, `--surface`, `--border`, `--radius-sm` | `44 px`, `--surface`, `--border`, `--radius-sm` |
| List row / Tile | `--row-height`, `--row-px`, `--tile-radius` | `36 px`, `--space-3`, `--radius-lg` | `44 px`, `--space-4`, `--radius-lg` |
| Dialog / Sheet | `--dialog-bg`, `--dialog-radius`, `--dialog-max-w`, `--dialog-confirm-w` | `--surface`, `--radius-lg`, `560 px`, `400 px` | `--surface`, `--radius-lg`, `560 px`, `400 px` |
| Badge / Chip | `--badge-height`, `--badge-radius` | `20 px`, `--radius-pill` | `24 px`, `--radius-pill` |
| Navigation chrome | `--sidebar-width`, `--header-height`, `--nav-item-height` | `240 px`, `48 px`, `32 px` | `—`, `64 px`, `44 px` |

## How code reaches a token

- **The utility layer maps tier-1 and tier-2 tokens once** — the utility
  framework's theme turns `--surface` into `bg-surface`, `--muted` into
  `text-muted`, `--radius-md` into `rounded-md`, `--motion-fast` into a
  duration. Components read utilities or their own component custom properties;
  raw hex or pixel values never appear in a component or screen.
- **No raw values.** A hex, an `oklch()`, a pixel font size or a hand-made
  shadow in a component is a token missing, added to the theme, not typed in
  place.
- **The framework's own palette is switched off**, so a built-in colour class
  such as `bg-blue-500` does not exist — the theme's names are the only colours
  there are.

The kit decides which token a component uses
([the kit](../../software/principles/web/ui/kit.md)); a screen reaches none of
them directly and passes only component variants.

## Not this

- Writing a raw hex inside a component token (`--badge-danger-bg: #fee2e2`) —
  alias `--danger-soft` so dark mode and theme swaps never break.
- Inventing fifty component tokens for one button when five cover every
  variant and density change.
- Letting a screen override `--button-bg` inline — add a named variant to the
  component instead.
