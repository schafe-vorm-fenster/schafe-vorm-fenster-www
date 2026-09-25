/**
 * `Service` (+ `Offer`) nodes — TS-WEB-0011 D4 / D4a.
 *
 * D4a: the licence is per organisation and per year, net, however many places
 * that organisation covers. `valueAddedTaxIncluded: false` states the net
 * half; `referenceQuantity.unitText` names the organisation as the scope —
 * "structured data never says more precisely what the page says vaguely",
 * so the visible copy must carry the same two qualifiers (that page's own
 * concern, not this builder's).
 *
 * `name` is the caller's page title (content, D5) — this module never
 * invents copy.
 */

import { ORGANIZATION_ID } from "./organization";

import { publishedFigure } from "@/src/lib/pricing/offerings";
import { canonicalUrl } from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";

export interface OfferNode {
  readonly "@type": "Offer";
  readonly priceSpecification: {
    readonly "@type": "UnitPriceSpecification";
    /** Read from the offering package through `offerings.ts` — never a literal here (TS-WEB-0024-A11). */
    readonly price: number;
    readonly priceCurrency: string;
    /** D4a: the net half of the two missing qualifiers. */
    readonly valueAddedTaxIncluded: false;
    /** UN/CEFACT: `ANN` per year, `MON` per month — derived from the figure's interval. */
    readonly unitCode: "ANN" | "MON";
    readonly referenceQuantity: {
      readonly "@type": "QuantitativeValue";
      readonly value: 1;
      /** D4a: the scope half — the organisation, not the place. */
      readonly unitText: "Organisation";
    };
  };
}

export interface ServiceNode {
  readonly "@type": "Service";
  readonly "@id": string;
  readonly name: string;
  readonly provider: { readonly "@id": string };
  readonly offers?: OfferNode;
}

/**
 * The one figure the site publishes, from the same import every page reads
 * (TS-WEB-0024-A11: "the JSON-LD `Offer` reads from the same import"). The
 * package declares `vat: excluded`, which is what `valueAddedTaxIncluded:
 * false` states; the locale does not matter here because only the number,
 * the currency and the interval are emitted.
 */
const CALENDAR_FIGURE = publishedFigure("portalize-calendar");

const CALENDAR_OFFER: OfferNode = {
  "@type": "Offer",
  priceSpecification: {
    "@type": "UnitPriceSpecification",
    price: CALENDAR_FIGURE.amount,
    priceCurrency: CALENDAR_FIGURE.currency ?? "EUR",
    valueAddedTaxIncluded: false,
    unitCode: CALENDAR_FIGURE.interval === "month" ? "MON" : "ANN",
    referenceQuantity: {
      "@type": "QuantitativeValue",
      value: 1,
      unitText: "Organisation",
    },
  },
};

/** D4 `/dein-kalender`: `Service` + the D4a `Offer`. */
export function calendarServiceNode(locale: Locale, name: string): ServiceNode {
  return {
    "@type": "Service",
    "@id": `${canonicalUrl("calendar", locale)}#service`,
    name,
    provider: { "@id": ORGANIZATION_ID },
    offers: CALENDAR_OFFER,
  };
}

/** D4 `/deine-region`: `Service` **without** any price or `Offer` (BUS-WEB-0015, FUN-WEB-0202). */
export function regionServiceNode(locale: Locale, name: string): ServiceNode {
  return {
    "@type": "Service",
    "@id": `${canonicalUrl("region", locale)}#service`,
    name,
    provider: { "@id": ORGANIZATION_ID },
  };
}
