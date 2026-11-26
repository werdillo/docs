# The site

**The rules.** The first HTML is the page; an address is a promise; a page
declares its head; a product UI is kept out of search
([sites](../site/README.md); [the principles](../rules.md), rules 49–54).

The guard runs on the **built site** — the HTML a visitor's first request
gets, with no script run — not on the source: what it checks is what a crawler
sees. It runs in CI after the build, against the build output or a preview of
it.

## Every page has its head

For every HTML page in the build, the guard fails on:

- **no title**, or a title another page has;
- **no description**, or a description another page has;
- **no canonical**, a relative one, one on another host, or one pointing at an
  address that redirects or is not in the build;
- **no `lang`** on the document;
- **not exactly one `h1`**;
- **an image with no `alt`** (an empty `alt` is a choice — a decorative image —
  and passes), or with no width and height;
- **structured data that does not parse**, or whose `@type` is not on the
  site's list.

The exceptions are a list of `{ page, rule, reason }`; a listed page must still
break its rule, or the entry fails. Titles and descriptions past their length
signal are reported, never failed.

Failure: `address [rule] what was found`.

```ts
const pages = await builtPages(BUILD_DIR); // every .html in the build, with its address
const found = pages.flatMap((page) => headProblems(page, pages)); // missing, duplicated, malformed
const violations = found.filter((hit) => !allowed(hit)).map((hit) => `${hit.address} [${hit.rule}] ${hit.text}`);
expect(violations).toEqual([]);
// …
```

## Every link lands

Every internal `<a href>` in every page resolves to a page in the build, or to
an address on the redirect list whose target is in the build. A link to a
redirect is reported — it costs a hop — and a link to nothing fails.

## The sitemap is the pages

The sitemap the composition root built is compared with the pages:

- every indexable page is in it, once;
- every address in it is a page in the build, answers 200, and is its own
  canonical;
- no page in it says `noindex`.

## No address is lost

The release keeps a snapshot of the addresses it answered: the sitemap's, and
the redirect and gone lists. The guard reads the snapshot of the last release
and fails on every address in it that the new build answers with nothing — no
page, no redirect, not on the gone list
([the addresses are moved forward](../site/addresses.md#the-addresses-are-moved-forward-never-dropped)).

```ts
const before = await readSnapshot(LAST_RELEASE); // addresses that answered last time
const answered = new Set([...pagesOf(build), ...redirectsOf(build), ...goneOf(build)]);
const lost = before.filter((address) => !answered.has(address));
// An address that answered once answers for ever: a page, a 301, or a 410.
expect(lost).toEqual([]);
```

## The product UI says noindex

A request to the product UI's root and to one route of each of its domains
answers with `noindex` in its headers, and the product UI's build has no
sitemap.

## What it cannot see

- **How fast a page is for real visitors.** A build has no visits; the speed
  numbers are read in the field ([speed](../site/rendering.md#speed-is-three-numbers)).
- **Whether a title is good** — only that it is there and unique.
- **Whether the structured data says what the page shows** — only that it
  parses. A page and its structured data come from the same view
  ([where it is declared](../site/pages.md#where-it-is-declared)); that is the
  guard for it.
- **Pages a server renders on request** that are not in the build. A site with
  them runs the same checks against a preview, over one address of each kind.
