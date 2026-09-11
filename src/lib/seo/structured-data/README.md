# Structured data — TS-011 D4

Builders, not pages: this folder returns plain JSON-LD node objects (and, for
the archive, microdata prop objects). Nothing here is wired into a route —
the page work packages own `app/[lang]/**/page.tsx` and decide when to call
these, per D4's table of which type sits on which page.

## Wiring a page

One `<script type="application/ld+json">` per page, combining every node it
emits (D4: "one graph per page"):

```tsx
import {
  jsonLdGraph,
  jsonLdScriptProps,
  webPageNode,
  calendarServiceNode,
} from "@/src/lib/seo/structured-data";

export default async function CalendarPage({ params }: PageProps) {
  const locale = resolveLocale((await params).lang);
  const title = pageTitle("calendar", locale); // content, not invented here
  const description = pageDescription("calendar", locale);

  const graph = jsonLdGraph([
    webPageNode({ route: "calendar", locale, title, description }),
    calendarServiceNode(locale, title),
  ]);

  return (
    <>
      <script {...jsonLdScriptProps(graph)} />
      {/* … page body … */}
    </>
  );
}
```

## Which type on which page (D4's table)

| Page | Nodes |
| --- | --- |
| every page | `webPageNode()` |
| `/` | `webPageNode()` + `websiteNode()` + `organizationNode()` (the one full `Organization` node) |
| `placeStart`, `register`, `order`, `regionQuote`, `archive` (the five second-level pages) | + `breadcrumbListNode(route, locale, titleFor)` |
| `/dein-kalender` | + `calendarServiceNode(locale, title)` |
| `/deine-region` | + `regionServiceNode(locale, title)` |
| `/ueber-uns` | + `organizationReference()` inside a custom node, never a second `Organization` |
| any page with a visible Q&A block | + `faqPageNode(items)` — **or** microdata on the block, never both (one-entity rule) |
| `/ueber-uns/archiv` | **no JSON-LD** — spread `itemListProps()`/`listItemProps()`/`citationWorkProps()` from `archive-microdata.ts` onto the existing list markup instead |
| `/rechtliches`, 404, 500 | `webPageNode()` only (404/500: omit even that per D4) |

## The one-entity rule (TS-011-A6)

An entity described in JSON-LD is never also described in microdata on the
same page. In practice: every page above emits JSON-LD *or* the archive's
microdata, never a page that does both for the same node. There is no
automated cross-check for this in the library (it would need the actual
rendered page); a page wiring both a `<script>` and microdata attributes on
the same conceptual entity is the review-time check.

## Organization identity (`organization-data.ts`)

Read from `content/legal/imprint.md` at request time — D4: "no identity
data is written into code or into this spec." It is a targeted parse of the
current §5 DDG block, not a general content-schema reader (the content
pipeline's typed legal frontmatter has not landed, state/open.md rows
59/60); a wording change to `imprint.md`'s §5 block is this module's parsing
risk to absorb, not a silent break elsewhere. `organizationIdentity()` is
cached for the process — call `resetOrganizationIdentityCache()` only in
tests.

## Price qualifiers (D4a)

`calendarServiceNode`'s `Offer.priceSpecification` states the net half
(`valueAddedTaxIncluded: false`) and the scope half
(`referenceQuantity.unitText: "Organisation"`) that a bare `price: 480`
would leave ambiguous. The page's **visible copy** must state the same two
qualifiers — "structured data never says more precisely what the page says
vaguely" — but that copy is the page's own content, not this builder's.

## Not built here

- **Rich Results / schema.org validator runs (TS-011-A5)** are a tool-level
  acceptance check against a deployed page, not a unit test.
- **Per-page wiring** into `app/[lang]/**/page.tsx` — owned by the page work
  packages, using this library.
