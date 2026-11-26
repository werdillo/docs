# Sites

How a public site is built so that it is **found, read and shared** — by search
engines, by link previews, by the people who arrive from them. A site is the
static-first front end for an audience that is not signed in
([two front ends](../stack/layers-and-slices.md)); a product UI behind a sign-in
is not a site, and none of this applies to it except the rule that keeps it out
of search.

Being found is not a pass made at the end. It is decided by the same things the
architecture already decides: what a page's address is, what its first HTML
holds, what it declares about itself, and who owns each of those. A site built
to these rules needs no separate SEO work later; one built without them needs
it on every page.

## In one minute

- **The first HTML is the page.** The content, the links and the metadata are
  in the response, not added by a script — a crawler that runs no script still
  sees the whole page ([rendering](./rendering.md)).
- **An address is a promise.** Readable, stable, one per content. An address
  that once answered never becomes a silent 404: it redirects for ever, or says
  it is gone ([addresses](./addresses.md)).
- **A page declares its head** — title, description, canonical address,
  language, social preview, structured data — beside the page, from the data it
  shows ([pages](./pages.md)).
- **The composition root assembles what crawlers read** — the sitemap, robots,
  feeds — from those declarations; nothing is listed by hand.
- **A product UI is not a site**: it is kept out of search, whole.
- **Speed is measured where people are**, against three numbers
  ([rendering](./rendering.md#speed-is-three-numbers)).

## In this folder

| File | What it holds |
|---|---|
| [`addresses.md`](./addresses.md) | **An address is a promise** — how an address is made, who owns it, and what happens when it changes or goes. |
| [`pages.md`](./pages.md) | **A page declares its head** — the metadata every public page carries, where it is declared, and what the composition root builds from it. |
| [`rendering.md`](./rendering.md) | **The first HTML is the page** — what is in the response, what a script may add, the product UI kept out, and the three speed numbers. |

The test that guards them is [the site guard](../guards/site.md).

## How it is checked

- **On every build**, by [the site guard](../guards/site.md): every page has its
  head, every internal link lands, the sitemap matches the pages, and no address
  that answered before is lost.
- **In the field**, by the search engines' own consoles: what is indexed, what
  is excluded and why, and the speed numbers measured on real visits. The
  consoles are checked after each release that changes addresses, and monthly
  otherwise.
- **By a person**, with the first HTML of a new kind of page read once — the
  response itself, with scripts off — before the kind is copied.
