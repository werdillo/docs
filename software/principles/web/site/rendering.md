# Rendering

## The first HTML is the page

A search engine that runs scripts runs them later, and not always; a link
preview, most other crawlers and every reader with a slow phone see the first
response long before any script. So the first HTML holds the page:

- **the content** — the text, the headings, the images with their `alt`;
- **the links** — real `<a href>` to real addresses, so every page is reachable
  by following links from the home page;
- **the head** ([pages](./pages.md#the-head)).

A site is static-first: each page is built ahead of time where its content
allows, and rendered on the server where it does not
([two front ends](../stack/layers-and-slices.md)). A script **adds** to a page
that already works — a cart count, a gallery, a filter — and never **is** the
page.

## What a script may add

- **Interaction on content that is already there.** A gallery over images in
  the HTML; a filter over a list that is in the HTML, with each filter an
  address when it is worth finding.
- **What depends on the visitor.** A cart, a greeting, a price in their
  currency — drawn after the page, in a place kept for it so nothing moves.
- **Not** a page's text, its links, its title or its structured data.

## A product UI is kept out of search

The admin, a dashboard, an app behind a sign-in: its pages answer `noindex`
(as a response header, so it covers every route at once), it has no sitemap,
and the site links to its sign-in page only. Its addresses are behind the gate
anyway ([access](../architecture/access.md)); `noindex` keeps the sign-in page
and anything public by mistake out of results.

## Speed is three numbers

Search engines measure the speed of real visits, and so do people. Three
numbers, at the 75th percentile of visits, on phones and on desktops apart:

| Number | What it measures | Good at |
|---|---|---|
| **LCP** — largest contentful paint | When the main content is shown | ≤ 2.5 s |
| **INP** — interaction to next paint | How fast the page answers a tap | ≤ 200 ms |
| **CLS** — cumulative layout shift | How much the page jumps as it loads | ≤ 0.1 |

The rules that meet them are mostly the ones already in
[performance](../stack/performance.md#on-the-client); for a site in particular:

- **The main image is known early.** The largest image above the fold is in
  the HTML, never lazy, and fetched first; images below the fold load lazily.
- **Every image and embed keeps its place.** Width and height are given, so
  nothing moves when it arrives; a slot for what the visitor's data fills in is
  sized ahead.
- **Fonts do not hide or move text.** Few faces, served by the site, with
  text shown in a fallback until they arrive and a fallback sized to match.
- **No script on the path to the first paint** that the page does not need for
  it; third-party scripts load after the page, and each is a decision with a
  name beside it.

The numbers are a **signal**: a page past one is a question for the next
release, measured in the field, not a test that fails a build — a build has no
real visits.

## Not this

- A site built as a single-page app, with an empty body until the script runs.
- Links made of buttons with click handlers — a crawler follows no click.
- "Load more" as the only way to reach older items — what is never linked is
  never found.
- A cookie banner or an interstitial that covers the content on arrival.
