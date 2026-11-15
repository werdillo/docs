# Design tokens

Every value the look is made of — a colour, a size, a space, a radius, a
shadow, a duration — is a named token, and the names are the
[OpenDesign](https://open-design.ai) token contract, published with its own
schema for them.
The names are decided outside any one project, so a theme from any OpenDesign
design system drops in, and a person, a design tool and an agent all mean the
same thing by `--muted`.

## One theme is one file

- **One theme file declares every token in the contract** — its required layers
  and its optional slots — light on the root, dark under the scheme selector the
  app uses. Nothing else declares them.
- **A theme starts from an OpenDesign design system** — its token file and its
  design document — and tunes the values to the product: an app reads smaller and
  denser than the marketing page the system was taken from. The values are the
  theme's; the names are never changed.
- **An optional slot the theme does not differentiate is an alias**, as the
  contract says: `--fg-2: var(--fg)`, never left out — a component that uses
  it must always resolve.
- **Light and dark are the same names with other values.** A component never
  branches on the scheme; a `dark:` utility in a component is a token
  missing.

## The names

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

## What the contract does not have: extensions

An app needs a few values a page does not — the fill of a hovered or selected
row, the sunken panel a sidebar sits on, the overlay behind a dialog, a soft
tint behind a status. These are the theme's **extensions**:

- declared in the same file, after the contract's tokens, and listed in the
  theme's README;
- named the contract's way — a role prefix, kebab-case: `--surface-hover`,
  `--surface-selected`, `--panel`, `--overlay`, `--danger-soft`;
- **derived from contract tokens** where they can be
  (`color-mix(in oklab, var(--fg) 5%, transparent)`), so a new theme does not
  have to set them;
- few. Shared components may use them because the app has one theme file; an
  extension every app needs is a name to propose to the contract.

## How code reaches a token

- **The utility layer maps each token once** — the utility framework's theme turns
  `--surface` into `bg-surface`, `--muted` into `text-muted`, `--radius-md`
  into `rounded-md`, `--motion-fast` into a duration. Components use the
  utilities; `var(--…)` is written only in the theme config and the global
  sheets.
- **No raw values.** A hex, an `oklch()`, a pixel font size or a hand-made
  shadow in a component is a token missing, added to the theme, not typed in
  place.
- **The framework's own palette is switched off**, so a built-in colour class
  such as `bg-blue-500` does not exist — the theme's names are the only colours
  there are.

The kit decides which token a part uses ([the kit](../../software/principles/web/ui/kit.md)); a screen
reaches none of them directly.
