# Internal tool references: Linear UX × Apple palette

How two real-world benchmarks combine to define
[the internal design language](../languages/internal.md): **Linear** for speed,
structure and interaction ergonomics; **Apple's macOS system apps (HIG)** for
colour palette, neutral surface hierarchy, translucent chrome and tactile
control feel.

## What to take — and what to leave behind

### Linear (UX and workflow benchmark)

| Take | Leave behind |
|---|---|
| **Four disciplined screen shapes** (`list`, `record`, `settings`, `canvas`) inside one constant shell (Rule 29). | Linear's dark-purple/indigo brand mood when the product uses an Apple-neutral palette. |
| **Dense aligned grid-lists** showing ~20 rows on a laptop, with shared columns and hairline separators (Rule 30). | Issue-tracker-specific jargon (*cycles*, *triage*, *sub-issues*) — every screen uses the business words from `bizdev` section 6 (Rule 8). |
| **Keyboard-first ergonomics**: `⌘K` command palette, `↑`/`↓` (`j`/`k`), `Enter`, `x` select, `Esc`, type-to-filter in every dropdown (Rule 20). | Hiding essential beginner actions behind shortcuts alone — every shortcut is also visible in a menu item and tooltip. |
| **Instant optimistic writes** on status, toggles and renames with clean rollback, plus quiet *Undo* toasts instead of confirmation modals (Rule 22). | Copying Linear's exact sidebar tree — navigation order belongs to the product's own domains and daily workflow (Rule 21). |
| **Header bar + Filter / Display bar + floating bulk bar** — secondary actions tucked in one `…` menu, at most one primary button (Rule 11). | Custom bespoke layouts invented per screen. |

### Apple macOS / HIG system apps (colour palette and material benchmark)

| Take | Leave behind |
|---|---|
| **Calm achromatic neutrals**: crisp white (`--surface`) over quiet off-white canvas (`--bg`) in light mode; soft near-black (`#1c1c1e`-range OKLCH) with luminance-lifted surfaces in dark mode (Rules 15, 20). | Heavy skeuomorphism or glassmorphism on content — translucency belongs only on floating chrome (sidebar, menus, popovers), never on data rows or forms. |
| **Clear, high-contrast system accent and semantic palette**: one clean blue (or brand) `--accent` with crisp `--accent-on`, paired with unmistakable `--success` green, `--warn` amber and `--danger` red mapped to OpenDesign tokens ([`tokens.json`](../system/tokens.json)). | Using platform-specific native widgets that break cross-platform web keyboard navigation or ignore OpenDesign token names (Rule 25). |
| **Tactile control feel**: soft grey fills instead of bordered outlines on secondary buttons, segmented tracks with a white hairline thumb, pill switches, accent focus rings, subtle lit top edge on primary controls. | Over-rounding dense admin tables or shrinking text below the `13 px` internal readability floor (Rule 13). |
| **Selection tint** (`--surface-selected` with full-strength `--fg` text) instead of loud solid-colour row fills that reduce legibility. | Low-contrast translucent text that drops below `4.5:1` WCAG contrast (Rule 14). |

## Concrete bad versus good comparisons

### 1. List screen: aligned grid-list vs card soup (Rules 16, 30)

- **Bad:** Each order in `shop/orders` sits inside its own white card with a
  drop shadow, 16 px margin, two-line heading, four coloured pills and three
  outline buttons — only 4 orders fit on a laptop screen and prices do not
  align vertically.
- **Good:** One continuous list container with `36 px` rows separated by
  `--border-soft` hairlines, shared columns (order number, shopper, soft-tinted
  status badge, right-aligned `tabular-nums` total in `£`, date), showing ~20
  orders at once. Selecting rows raises a single floating bulk bar at the
  bottom ([list](../patterns/list.md)).

### 2. Accent budget: one action vs accent overload (Rules 11, 15)

- **Bad:** Blue header bar, blue sidebar icons, three blue buttons in the
  toolbar (*Export*, *Filter*, *Restock*), and blue links on every column — the
  eye has no focal point.
- **Good:** Achromatic `--panel` sidebar and `--bg` header bar; secondary
  actions (*Filter*, *Display*, *Export*) use soft `--surface-hover` fills or
  sit inside `…`; `--accent` appears only on the single primary button
  (*Add product*), the active sidebar tint, and the keyboard focus ring
  ([hierarchy](../foundations/hierarchy.md)).

### 3. Record layout: split column vs nested card boxes (Rules 16, 29)

- **Bad:** An order screen wraps the title in a card, wraps each line item in a
  card inside another card, and puts status, dates and buttons in a third stack
  of cards below the fold.
- **Good:** Header bar with breadcrumb (`Orders / #1042`), prev/next arrows and
  `…` menu; wide main column with in-place title, clean line-item table and
  activity feed; right properties panel grouping status, customer and dates
  inside calm white `--surface` cards on `--bg` canvas
  ([record](../patterns/record.md)).

### 4. Reversible vs irreversible feedback (Rules 22, 33)

- **Bad:** Archiving a draft or toggling an option opens a centred modal asking
  *"Are you sure?"* with *OK / Cancel*, training staff to click *OK* without
  reading — even when an actually destructive dialog appears.
- **Good:** Reversible actions apply instantly and show a `5–8 s` corner toast
  with *Undo*. Narrow top-third confirmation dialogs (`400 px`) appear **only**
  for irreversible acts (*Cancel order #1042* — *"Cancelling returns 3 items to
  stock and emails the shopper."* with *Keep order* and `danger` *Cancel
  order*) ([dialog](../system/components/dialog.md)).

### 5. Theme implementation in code (Rules 25–28)

- **Bad:** Hardcoding Apple hex codes (`#007AFF`, `#1C1C1E`) or Tailwind's
  `bg-blue-500 dark:bg-zinc-900` inside components and screens.
- **Good:** Putting the Apple-inspired OKLCH values once in
  [`tokens.json`](../system/tokens.json) under OpenDesign contract names
  (`--accent`, `--bg`, `--surface`), binding density in component tokens
  (`--button-height-md`, `--row-height`), and having screens pass only kit
  variants (`variant="primary"`, `tone="danger"`).
