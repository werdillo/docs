# Pages

## A page declares its head

What a search result, a link preview or a reader's tab shows is not written
into a layout by hand. Each kind of page declares it, next to the page, from
the data the page shows — so it is never missing, never stale, and never the
same on two pages.

## The head

Every public page carries:

| What | Rule |
|---|---|
| **Title** | Unique on the site; the page's own subject first, the site's name last. About 50–60 characters is what a result shows — a signal, not a limit. |
| **Description** | One or two sentences that say what the page offers, written for the person choosing a result. About 150–160 characters; unique. |
| **Canonical address** | The page's one address, absolute, on the one host ([addresses](./addresses.md#how-an-address-is-made)). Every page names one — itself, unless it is a variant of another. |
| **Language** | `lang` on the document. A page in several languages lists each version and a default (`hreflang`, both ways). |
| **Robots** | Indexed by default. `noindex` for a page that is not worth finding on its own — internal search results, a thin filter, a thank-you page — and such a page is not in the sitemap. |
| **Social preview** | Open Graph title, description, image and type. The image is 1200 × 630 and made for the page, not the site's logo. |
| **One `h1`** | The page's subject, in the text. Headings below it follow in order. |

And, where the page shows something a search engine understands:

## Structured data

JSON-LD with the schema.org type of what the page shows — a `Product` with its
`Offer` (price, currency, availability), an `Article`, a `BreadcrumbList`, the
site's `Organization` on the home page. **It says what the page shows, and only
that.** A price, a rating or an availability in the structured data and not on
the page is a misrepresentation, and search engines treat it as one.

## Where it is declared

The head of a kind of page is a **declaration in the box that owns the page** —
a part, as its routes and its tables are
([part](../words.md)). It is a function from the page's view to its head:

```ts
// shop/products/ui/productPage.head.ts — the head of a product page, from the view it shows
export const productPageHead: HeadOf<ProductView> = (product) => ({
  title: `${product.name} — ${site.name}`,
  description: product.summary,
  canonical: addressOf.product(product.slug),
  image: product.images[0] && previewImage(product.images[0]),
  // The availability here is the one the page prints: both come from the same view.
  structuredData: productSchema(product),
});
```

- **From the view, never a second read.** The head uses the data the page
  already has; a head that reads again can say something the page does not.
- **The kit draws it.** The tags are written by one component of the kit, so a
  page cannot forget one and no page writes them by hand
  ([the kit is the only place that draws](../ui/kit.md#the-kit-is-the-only-place-that-draws)).
- **The words are the business's.** A title uses the words the product
  document gave the subject ([words](../../../../bizdev/product-document/template.md)),
  and the searches the page answers are named there too.

## What the composition root builds

The site's composition root reads every box's page declarations and builds,
at build time:

- **the sitemap** — every indexable page, with the date its content last
  changed (not the build date). Past 50,000 addresses it is split, with an
  index;
- **`robots.txt`** — what may be crawled, and where the sitemap is. It never
  blocks the styles or scripts a page needs to render, and it is not used to
  hide a page: a page kept out of search says `noindex`;
- **feeds**, where the site has them.

None of them is a file edited by hand. A page that exists and is missing from
the sitemap, or an address in the sitemap that no page answers, is a failing
build ([the site guard](../guards/site.md)).

## Not this

- One title for every page, or a title template with nothing of the page in it.
- A description generated from the first words of the body — it is navigation
  text, nearly always.
- Metadata set by a script after the page loads — many crawlers and every link
  preview never see it.
- Structured data copied from another page, or claiming what the page does not
  show.
- A canonical pointing at the home page, or at a page that redirects.
