# Sidebar, header bar, breadcrumb, overflow menu, command palette and public nav

The chrome that frames every screen and carries the navigation declared by the
composition root ([internal](../../languages/internal.md#navigation),
[public](../../languages/public.md#navigation-and-structure)).

## Anatomy

### Internal app frame
- **Sidebar** — width `--nav-sidebar-width` (`240 px`), sunken `--panel` fill
  (translucent material where supported), grouped by domain in daily-use order,
  rare setup items folded at the end; active row highlighted in
  `--surface-selected` with full-strength `--fg` text.
- **Header bar** — height `--nav-header-height` (`48 px`), bottom hairline
  `--border-soft`; holds screen title (or breadcrumb on a `record`), exact
  count, view switch, overflow `…` menu for secondary actions, and at most one
  `primary` button on the right.
- **Command palette (`⌘K`)** — floating top-third dialog (`--dialog-max-w`,
  `--elev-raised`), single search input at top, grouped results below (current
  screen's actions first, then navigation and records).

### Public nav bar
- **Header** — height `--nav-header-height` (`64 px` via public override),
  constrained to `--container-max`; brand mark on left, `3–6` top-level links,
  single utility/CTA (such as cart count) on right; collapses cleanly to a
  drawer button below `768 px` while keeping the primary visitor action
  visible.

## Variants

| Component | Variants | Role |
|---|---|---|
| `Sidebar` | `expanded` · `collapsed` | Persistent frame for `internal` deliverables; collapses to drawer below `1024 px`. |
| `HeaderBar` | `list` · `record` · `settings` · `canvas` | Matches the active screen shape (`title + count + CTA` on list; `breadcrumb + prev/next + …` on record). |
| `OverflowMenu` | `default` | Collects secondary and destructive actions into one `…` popover so header bars stay uncluttered. |
| `CommandPalette` | `global` | `⌘K` / `Ctrl+K` fast search and action runner in internal tools. |
| `PublicNav` | `default` | Shallow responsive header for `public` deliverables. |

## States

1. **Default** — quiet achromatic chrome (`--panel`, `--fg-2`).
2. **Hover** — nav items take `--surface-hover` (`--motion-fast`).
3. **Focus** — `:focus-visible` ring (`--focus-ring`) on every link, fold
   toggle and menu item.
4. **Active / current** — `aria-current="page"`, `--surface-selected` fill and
   `--fg` medium weight.
5. **Disabled / hidden** — items a role lacks access to are omitted by the
   composition root, never shown greyed out.
6. **Searching (`⌘K`)** — filters live as you type, showing a filtered-empty
   state when no command or record matches.

## Tokens

| Tier | Tokens |
|---|---|
| Contract | `--bg`, `--surface`, `--fg`, `--fg-2`, `--muted`, `--border`, `--border-soft`, `--elev-raised`, `--focus-ring`, `--container-max`, `--space-2`, `--space-3`, `--space-4`, `--motion-fast` |
| Extensions | `--panel`, `--surface-hover`, `--surface-selected`, `--overlay` |
| Component | `--nav-sidebar-width`, `--nav-header-height`, `--nav-item-height`, `--nav-item-radius`, `--dialog-max-w` |

## Keyboard and accessibility

- Semantic `<nav aria-label="...">`, `<header>` and `<main>` landmarks, plus a
  skip-to-content link as the first focusable element on public sites.
- `⌘K` / `Ctrl+K` opens the command palette from anywhere; `↑`/`↓` moves
  selection, `Enter` executes, `Esc` closes and restores focus.
- Breadcrumbs use `<nav aria-label="Breadcrumb">` with an ordered list and
  `aria-current="page"` on the current record.

## When to use and when not to

- **Use `Sidebar` + `HeaderBar` + `CommandPalette`** for `internal` tools.
- **Use `PublicNav`** for `public` sites and storefronts — never ship an
  internal sidebar or `⌘K` palette on a public storefront.

## Not this

- Putting ten top-level links and three buttons into a public site header.
- Rendering a giant `36 px` hero banner inside an internal app instead of
  placing the screen title cleanly in the `48 px` `HeaderBar`.
- Letting each box append itself to the sidebar in arbitrary import order — the
  composition root declares the order once.
