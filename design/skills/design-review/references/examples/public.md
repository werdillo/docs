# Public site references: editorial clarity vs AI slop

How strong real-world public sites and storefronts — disciplined editorial
commerce (such as Aesop or Apple product pages) and clear technical product
sites (such as Stripe's documentation and product pages) — contrast with
generic AI-generated templates ([public language](../languages/public.md)).

## What to take from strong public benchmarks

| Benchmark quality | What to take | What to leave behind |
|---|---|---|
| **Apple product / store pages** | Generous section rhythm (`--section-y-*`), crisp product photography on quiet surfaces, one clear headline + price + primary CTA per band, unmistakable visual hierarchy (Rules 11, 23). | Heavy scroll-jacked WebGL animations that hurt mobile speed and break `prefers-reduced-motion` (Rule 18). |
| **Editorial indie storefronts (e.g. ceramics / studio shops)** | Locked aspect-ratio catalogue grids (`4:3` or `4:5`), honest material photography, concise facts on the tile (name, price, stock) and craft story on the `record`, clear shipping/payment notes beside the buy button (Rules 23, 30). | Low-contrast artistic grey text (`< 4.5:1`), tiny `11 px` links, or hidden navigation that makes mobile buying hard (Rules 13, 14). |
| **Clear SaaS & developer sites (e.g. Stripe docs / Linear marketing)** | Real UI previews instead of abstract illustrations, scannable `45–75 ch` prose measure, `16–18 px` body text, direct comparison tables with real numbers (Rules 12, 13, 24). | Over-engineered animated background meshes on a site whose job is simply to explain and convert. |

## Concrete bad versus good comparisons (anti-AI-slop)

### 1. Opening band above the fold (Rules 11, 23, 24)

- **Bad (AI slop):** Dark navy background with glowing purple-to-cyan radial
  blobs, floating glassmorphic pill *"✨ Next-Gen Pottery Experience"*, `64 px`
  gradient headline, three competing buttons (*Get Started*, *Watch Demo*,
  *Learn More*), and an abstract 3D sphere.
- **Good (Small shop):** Quiet `--bg` / `--surface-warm` band, one clear `h1`
  (*"Wheel-thrown stoneware, made in small batches"*), one two-line subhead,
  one filled `--accent` CTA (*Browse catalogue*), and one crisp photograph of
  the actual ceramics with reserved aspect ratio (`CLS = 0`).

### 2. Feature or product grid (Rules 16, 24, 30)

- **Bad (AI slop):** Three-column grid of identical bordered cards, each with a
  pastel circle icon and generic adjectives (*"Fast Delivery"*, *"Premium
  Quality"*, *"Trusted by Thousands"*); or a product grid where vertical and
  horizontal photos push titles and prices onto jagged baselines.
- **Good:** A locked `4:3` product grid showing photo, title (*Speckled
  stoneware mug*), right-aligned or cleanly aligned `tabular-nums` price
  (`£24.00`) and honest stock state (*In stock* / *Sold out*), with a `44 px`
  minimum tap area on mobile ([list-row](../system/components/list-row.md)).

### 3. Text over imagery (Rules 14, 23)

- **Bad:** White `14 px` text placed directly across a bright sunlit ceramic
  photograph — contrast drops below `2:1` and becomes unreadable on mobile.
- **Good:** Place text on a solid `--surface` or `--surface-warm` panel beside
  or below the photo; when overlaying text on photography is genuinely needed,
  add a dark scrim guaranteeing at least `4.5:1` contrast across the entire
  text bounding box ([colour](../foundations/colour.md)).

### 4. Checkout flow and trust (Rules 9, 23, 32)

- **Bad:** Clicking *Buy* forces account creation with 12 fields, hides
  delivery and payment rules in a tiny footer modal, and labels the submit
  button *Submit*.
- **Good:** Guest checkout `flow` (`3` clear steps: review cart → contact &
  address → confirm), plain note right under the button (*"Paid by bank
  transfer after placing — instructions arrive by email"*), and a width-locked
  *Place order* button that switches to *Placing order…* on click
  ([flow](../patterns/flow.md)).

### 5. Social proof and numbers (Rule 24)

- **Bad:** *"Trusted by 10,000+ happy customers"* paired with AI-generated headshots
  and generic five-star cards.
- **Good:** Either real, verified facts (*"Fired in batches of 15–20 pieces;
  dispatched within 3 working days"*) or no proof block at all — honesty builds
  more trust than fabricated widgets.
