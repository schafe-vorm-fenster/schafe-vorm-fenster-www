/**
 * The JSON-LD graph of a page — TS-011 D4's table, as one function.
 *
 * The builders in `src/lib/seo/structured-data/` return nodes and are
 * deliberately unwired ("Nothing here is wired into a route — the page work
 * packages own `app/[lang]/**\/page.tsx`"). This is that wiring, in one place
 * rather than twelve: D4 fixes *which type sits on which page*, and a table
 * is how a rule like that stays checkable (`_structured-data.test.ts`).
 *
 * D4's own rules that the shape below enforces:
 *
 *  - **one `<script type="application/ld+json">` per page**, server-rendered,
 *    never injected by client JS — `jsonLdGraph` combines every node a page
 *    emits into one `@graph`;
 *  - **one entity, one representation** — `/ueber-uns` gets the
 *    `Organization` by `@id` reference, never a second full node, and
 *    `/ueber-uns/archiv`'s citation list stays microdata on the visible
 *    markup (`archive-microdata.ts`), so no `ItemList` appears here;
 *  - **404 and 500 emit nothing**, which is why they call none of this.
 *
 * Titles and descriptions come from `pageMetadata`'s own source
 * (`src/lib/routes/metadata.ts`), so the graph and the `<title>` cannot
 * disagree — D4: "structured data never says more precisely what the page
 * says vaguely."
 *
 * ### A reading D4 leaves open, recorded
 *
 * D4's table gives `/ueber-uns/archiv` "—" in the JSON-LD column while the
 * rows above it say `WebPage` on *every* page and `BreadcrumbList` on **all
 * five** second-level pages, the archive included. The archive row is read as
 * naming the page's *own* entity (the citation list, which is microdata), not
 * as cancelling the two general rows — so the archive emits `WebPage` +
 * `BreadcrumbList` in JSON-LD and its `ItemList` in microdata. Nothing is
 * described twice, which is what the one-entity rule actually asks.
 */

import { cacheLife } from "next/cache";

import { pageDescription, pageTitle } from "@/src/lib/routes/metadata";
import { canonicalUrl } from "@/src/lib/routes/routes";
import {
  breadcrumbListNode,
  calendarServiceNode,
  faqPageNode,
  jsonLdGraph,
  jsonLdScriptProps,
  organizationNode,
  organizationReference,
  regionServiceNode,
  webPageNode,
  websiteNode,
} from "@/src/lib/seo/structured-data";

import type { Locale } from "@/src/lib/i18n/locales";
import type { FaqItem } from "@/src/lib/seo/structured-data";
import type { JsonLdGraph } from "@/src/lib/seo/structured-data";
import type { RouteId } from "@/src/lib/routes/routes";

export interface PageGraphInput {
  readonly route: RouteId;
  readonly locale: Locale;
  /** A visible Q&A block on the page, where it has one (D4's `FAQPage` row). */
  readonly faq?: readonly FaqItem[];
  /** The page's own OG image, absolute (D6, reused as `primaryImageOfPage`). */
  readonly imageUrl?: string;
  /**
   * Nodes only this page can build — `/ueber-uns/archiv`'s `ItemList` is the
   * one case today. TS-028-A10 fixes it as **JSON-LD** ("JSON-LD parses as
   * one `ItemList`; `itemListElement` count equals the unfiltered visible row
   * count"), which is more specific than TS-011 D4's microdata row for that
   * page, so the per-page spec wins — and it goes into *this* graph rather
   * than a second `<script>`, because "one graph per page" is D4's rule and
   * two scripts is what the page had before.
   */
  readonly nodes?: readonly unknown[];
}

/**
 * The nodes of one page, in D4's own order. Exported so the per-page test can
 * assert the table against the builders' output without rendering a page.
 */
export async function pageGraph({
  route,
  locale,
  faq,
  imageUrl,
  nodes = [],
}: PageGraphInput): Promise<JsonLdGraph> {
  const title = pageTitle(route, locale);
  const description = pageDescription(route, locale);

  return jsonLdGraph([
    // Every page.
    webPageNode({ route, locale, title, description, ...(imageUrl ? { imageUrl } : {}) }),
    // `/` — the one full `Organization`, and the `WebSite` it belongs to.
    ...(route === "home" ? [websiteNode(locale), await organizationNode()] : []),
    // All five second-level pages (DEC-071). `breadcrumbListNode` answers
    // `undefined` for the other seven, and `jsonLdGraph` drops it.
    breadcrumbListNode(route, locale, (item) => pageTitle(item, locale)),
    // The two service pages; `/deine-region` carries no price (WEB-F-020).
    ...(route === "calendar" ? [calendarServiceNode(locale, title)] : []),
    ...(route === "region" ? [regionServiceNode(locale, title)] : []),
    // `/ueber-uns` — by reference, never a second full node.
    ...(route === "about"
      ? [
          {
            "@type": "AboutPage",
            "@id": `${canonicalUrl("about", locale)}#aboutpage`,
            about: organizationReference(),
          },
        ]
      : []),
    // Any page with a visible Q&A block.
    faqPageNode(faq ?? []),
    ...nodes,
  ]);
}

/**
 * The one script tag. A cached component: the graph is a pure function of the
 * route, the language and the imprint's identity block, none of which is a
 * request value.
 */
export async function PageJsonLd(input: PageGraphInput) {
  "use cache";
  cacheLife("max");

  const graph = await pageGraph(input);
  return <script {...jsonLdScriptProps(graph)} />;
}
