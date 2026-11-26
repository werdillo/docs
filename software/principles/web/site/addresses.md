# Addresses

## An address is a promise

Once a page's address is public, it is in search results, in links on other
sites, in bookmarks and in messages. None of those can be changed from here. So
an address is treated like a contract: made with care, kept stable, and never
dropped without an answer.

## How an address is made

- **Readable, from the content's name.** `/products/blue-mug`, not
  `/p?id=8412`. Lowercase, words joined by hyphens, no file extension.
- **One address per content.** A page reachable at two addresses — with and
  without a trailing slash, with a tracking parameter, by id and by name — is
  two pages to a search engine, competing with each other. One is the address;
  every other form redirects to it, or names it as canonical
  ([pages](./pages.md#the-head)).
- **One host.** The site answers on one host and one scheme — `https`, with or
  without `www`, decided once — and every other form redirects to it.
- **A list's pages have addresses.** Page 2 of a catalogue is `?page=2`, a real
  address with its own content, not a button that replaces the list by script.
  A filter or a sort that makes no page worth finding on its own is canonical to
  the unfiltered list.
- **The address is a label, not the box's path.** A box keeps its name in every
  package ([the same box, the same place](../structure/matrix.md#the-same-box-the-same-place));
  the address a person sees is free to differ — `/mugs/blue` for a page of
  `shop/products` — and is chosen for the reader.

## The box owns its addresses

The address of a page is data of the box that owns the content: `products`
keeps each product's slug, as it keeps its name. A slug that changes keeps its
old values, so the old address can still be answered — and the owner is the
only box that knows them.

The routes that answer a box's pages are declared in the box's own routes file,
as every route is; the site's composition root gathers them
([pages](./pages.md#what-the-composition-root-builds)).

## When an address changes or goes

An address that answered once answers for ever, with one of three:

| The content | The answer |
|---|---|
| is still there, at a new address | **301** — a permanent redirect to the new address, in one step, never a chain |
| is gone, and something else takes its place | **301** to the closest replacement — the product that succeeds it, the category it was in |
| is gone, and nothing takes its place | **410** — gone, on purpose |

**404** is for an address that never existed. A missing page that answers 200
with "not found" in its body — a soft 404 — is never served: the status says
what the page says.

**A temporary state is not a change of address.** A product out of stock keeps
its page, with 200, and says it is out of stock — in the text and in its
structured data ([pages](./pages.md#structured-data)). A product withdrawn for
good has its address answered by the table above.

In the [example shop](../example/README.md): when the owner withdraws a
product, its page answers 301 to its category — the decision is the product
owner's, written in the product document — and its slug stays reserved, so no
new product takes the address.

## The addresses are moved forward, never dropped

Like the schema ([schema](../guards/schema.md)), the set of public addresses is
moved forward by changes, and no change drops one silently. Each release keeps
a snapshot of every address it answered; [the site guard](../guards/site.md#no-address-is-lost)
fails when an address in the last snapshot answers 404 in the new build and is
on no redirect or gone list.

## Not this

- An address with an id and nothing else — a page nobody can read before
  opening it.
- A redirect to the home page for everything that moved — that is a soft 404 to
  a search engine, and a lost visitor to a person.
- A chain of redirects — each hop costs time, and some crawlers stop following.
- A slug regenerated when a name is edited, with nothing kept — every link to
  the old address breaks the moment the name is fixed.
