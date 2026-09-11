/** TS-011 D4 — structured-data builders. See `README.md` for how a page wires one in. */

export {
  BREADCRUMB_ROUTES,
  breadcrumbListNode,
} from "./breadcrumb";
export type { BreadcrumbListNode } from "./breadcrumb";

export { faqPageNode } from "./faq";
export type { FaqItem, FAQPageNode } from "./faq";

export {
  ORGANIZATION_ID,
  organizationNode,
  organizationReference,
} from "./organization";
export type { OrganizationNode } from "./organization";

export { jsonLdGraph, jsonLdScriptProps } from "./render";
export type { JsonLdGraph, JsonLdScriptProps } from "./render";

export { calendarServiceNode, regionServiceNode } from "./service";
export type { OfferNode, ServiceNode } from "./service";

export { webPageNode } from "./webpage";
export type { WebPageInput, WebPageNode } from "./webpage";

export { WEBSITE_ID, websiteNode } from "./website";
export type { WebSiteNode } from "./website";

export {
  citationWorkProps,
  itemListProps,
  listItemProps,
  NAME_ITEMPROP,
  PUBLISHER_ITEMPROP,
  URL_ITEMPROP,
} from "./archive-microdata";
export type { MicrodataAttrs } from "./archive-microdata";
