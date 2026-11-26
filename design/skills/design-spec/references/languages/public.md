# The public design language

How a **public site** behaves and looks — a landing page, a storefront, a
editorial or documentation site built for visitors who arrive from search or a
shared link and decide in seconds whether to read, buy or leave. An internal
admin or back office follows [the internal language](./internal.md) instead.

How the code renders and serves a public site — first HTML, addresses, heads
and Core Web Vitals — is in
[`software/principles/web/site/`](../../software/principles/web/site/README.md).
This page owns the visual and behavioural craft on top of it.

## In one minute

- **Clarity above the fold**: within `3 seconds` on a `360 px` phone or a
  laptop, a visitor sees what this is, who it is for, and the one action to
  take.
- **Generous rhythm, readable type**: `16–18 px` body text, `45–75 ch` prose
  measure, clear section breaks via `--section-y-*`, never cramped like an
  admin table.
- **Mobile-first, zero layout shift**: designed at `360 px` first, every image
  has an explicit aspect ratio, and every touch target is at least `44 × 44 px`.
- **Honest imagery and real content**: photography, product shots or real UI
  previews — never stock filler or decorative gradients.
- **One primary action per section**, using the brand's `--accent` token;
  everything secondary stays quiet.

## First impression and hierarchy

- **One promise above the fold.** The opening band carries one headline (`h1`),
  one short subhead (at most two lines), one primary action button, and one
  concrete visual (the product itself, a real photograph, or the catalogue).
  Never stack a banner, a carousel, three competing buttons and a newsletter
  popup before the visitor reads one sentence.
- **Visual identity through type, colour and photography — not chrome.** A
  public site may pair one expressive `--font-display` face for headings with
  a neutral `--font-body` face for reading, and uses `--surface-warm` or
  editorial spacing to give the brand character while keeping controls plain
  and predictable ([typography](../foundations/typography.md)).
- **One focal point per band.** Each horizontal section answers one question
  (what it is, what is for sale, how it works, proof, next step) separated by
  generous vertical rhythm (`--section-y-*`, typically `64–120 px` on desktop,
  `40–64 px` on mobile — orienting signal).

## Navigation and structure

- **Shallow, scannable header.** Top navigation holds the brand mark, `3–6`
  top-level links (orienting signal), and at most one utility or action (for
  example the cart link with item count on a storefront). No multi-level mega
  menus unless a catalogue genuinely has dozens of categories.
- **Clean mobile navigation.** Below `768 px`, links collapse cleanly into a
  single accessible menu button with a full-height drawer or sheet; the primary
  visitor action (such as the cart icon on a shop) stays visible in the bar.
- **Predictable footer.** Contact, policies, essential links and legal
  information live in a structured footer, never hidden behind scripts or
  modals.

## Storefronts and content grids

Illustrated on Small shop's **Shop site**
([design spec](../../bizdev/product-document/example/05-design.md)):

- **Locked aspect ratios on every card.** All product images in a catalogue
  grid share one explicit ratio (`4:3`, `1:1` or `4:5`) so rows align cleanly
  and Cumulative Layout Shift stays `0`.
- **Essential facts on the tile, details on the record.** A catalogue tile
  shows image, product name, price (`tabular-nums`) and stock status (*In
  stock* / *Sold out*) — nothing else. Full descriptions, dimensions and care
  notes belong on the `record` screen ([list](../patterns/list.md),
  [record](../patterns/record.md)).
- **Zero-friction path to buy.** Adding to a cart gives immediate quiet
  confirmation (updating the cart count and offering *View cart*) without
  hijacking the scroll position; placing an order follows the linear `flow`
  pattern ([flow](../patterns/flow.md)) with no forced account creation when
  guest checkout suffices.
- **Trust signals sit next to the decision.** Delivery terms, payment method
  (for Small shop: *"Paid by bank transfer after placing"*), and return rules
  sit right below *Place order*, not buried only in a footer link.

## Responsive, fast and shareable

- **Mobile-first layout.** Design for `360–390 px` width first, then expand
  to tablet (`768 px`) and desktop (`1200–1280 px` container max via
  `--container-max`). Nothing scrolls horizontally at `360 px` or at `200%`
  zoom ([spacing](../foundations/spacing.md)).
- **Touch targets and spacing.** Every link, button, filter chip and quantity
  stepper meets the `44 × 44 px` touch minimum with at least `8 px` between
  adjacent controls.
- **Light and dark policy.** Unlike internal apps — where both light and dark
  are always equal — a public brand site **may intentionally choose one
  authored mode** (light-only or dark-only) when its photography and brand
  require it. If it offers both modes, both are designed with equal care
  ([colour](../foundations/colour.md)).
- **Share previews are designed.** OpenGraph and social cards (`1200 × 630 px`)
  carry the page's real title, the brand mark and one clear visual — never a
  cropped logo or an empty grey box.

## Not this

- **Generic AI-generated SaaS look** — purple-to-cyan gradients, glowing dark
  blobs, floating glassmorphic cards with meaningless sparkles, and three-column
  walls of identical icon cards saying *"Fast"*, *"Secure"*, *"Reliable"*.
- **Unreadable text over photography** — placing white body text directly over
  a busy photo without a scrim or solid panel meeting `4.5:1` contrast.
- **Auto-playing carousels and scroll-jacking** — carousels hide content after
  slide one and break keyboard/screen-reader flow; scroll-jacking breaks
  browser physics.
- **Dense admin chrome on a storefront** — `13 px` table rows, sidebars and
  `⌘K` palettes belong in [the internal language](./internal.md), not on a
  public shop.
- **Fake proof** — stock-photo avatars, invented quotes or unverified counters
  destroy credibility faster than having no testimonials section at all.
