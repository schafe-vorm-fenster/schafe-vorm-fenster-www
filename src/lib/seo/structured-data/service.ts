/**
 * `Service` (+ `Offer`) nodes — TS-011 D4 / D4a.
 *
 * D4a: 480 € is per organisation and per year, net, however many places
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

import { canonicalUrl } from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";

export interface OfferNode {
  readonly "@type": "Offer";
  readonly priceSpecification: {
    readonly "@type": "UnitPriceSpecification";
    readonly price: 480;
    readonly priceCurrency: "EUR";
    /** D4a: the net half of the two missing qualifiers. */
    readonly valueAddedTaxIncluded: false;
    readonly unitCode: "ANN";
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

const CALENDAR_OFFER: OfferNode = {
  "@type": "Offer",
  priceSpecification: {
    "@type": "UnitPriceSpecification",
    price: 480,
    priceCurrency: "EUR",
    valueAddedTaxIncluded: false,
    unitCode: "ANN",
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

/** D4 `/deine-region`: `Service` **without** any price or `Offer` (WEB-F-020). */
export function regionServiceNode(locale: Locale, name: string): ServiceNode {
  return {
    "@type": "Service",
    "@id": `${canonicalUrl("region", locale)}#service`,
    name,
    provider: { "@id": ORGANIZATION_ID },
  };
}
