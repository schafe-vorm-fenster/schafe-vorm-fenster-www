/**
 * Price display data for the offerings this page-implementation work package
 * touches — TS-WEB-0006 D10 ("the price string is read from the offering package
 * rather than typed into copy, so one place changes it").
 *
 * `price-tag` and `origin-story` already take the resolved figure as a typed
 * prop rather than importing `@schafe-vorm-fenster/offerings` themselves
 * (`state/open.md` #54): that package is a devDependency (content-pipeline
 * tooling) today, not a registered runtime dependency, and the loader
 * architecture (`src/lib/content/loader.ts`) deliberately never opens a hub
 * package at request time (TS-WEB-0007 D3) — "no hub package, no GTM artefact, no
 * registry". This module is the single, small, page-implementation-owned
 * place that stands in for the M3 content-pipeline resolver #54 asks for:
 * one table, transcribed from the offering packages' own frontmatter
 * (`node_modules/@schafe-vorm-fenster/offerings/*.offering.md`, read once
 * while building this work package, not imported at runtime), so a page
 * never types a price literal itself.
 *
 * [PROPOSED] — TS-WEB-0006 D10 leaves sourcing open; this is this work package's
 * reading, consistent with the already-shipped `price-tag`/`origin-story`
 * contract. Replaced wholesale once the real content-pipeline resolver
 * (`state/open.md` #54) lands.
 */

import type { PriceDisplay, PriceFigure } from "@/src/components/price-tag/price-tag";
import type { Locale } from "@/src/lib/i18n/locales";

export type OfferingId =
  | "community-calendar"
  | "portalize-calendar"
  | "portalize-enterprise"
  | "custom-data-integration";

export interface OfferingPrice {
  readonly display: PriceDisplay;
  readonly figure?: PriceFigure;
}

/**
 * Transcribed from each offering's `price` / `price_status` / `promotion`
 * frontmatter. `portalize-enterprise` carries a real figure (4000) in the
 * package, but `price_status: on-request` means `publishablePrice` is
 * `false` (TS-WEB-0018 D2/D3, TS-WEB-0026 D6) — the figure is never read here, on
 * purpose, so a template mistake cannot print it (TS-WEB-0026-A4).
 */
const OFFERING_PRICES: Readonly<Record<OfferingId, OfferingPrice>> = {
  "community-calendar": { display: "permanent" },
  "portalize-calendar": {
    display: "priced",
    figure: { amount: 480, currency: "EUR", interval: "year", vatNote: "zzgl. USt." },
  },
  "portalize-enterprise": { display: "on-request" },
  "custom-data-integration": { display: "on-request" },
};

/**
 * The net qualifier a figure is never shown without, per locale. The table
 * above transcribes the package's own German `vat: excluded` note, and an
 * English page read "€480 / year, zzgl. USt." until this pass — the same
 * F-2-33 failure mode as every other German literal that outlived its page.
 */
const VAT_NOTE: Readonly<Record<Locale, string>> = {
  de: "zzgl. USt.",
  en: "excl. VAT",
};

/** The one place a page reads an offering's price display (TS-WEB-0006 D10). */
export function offeringPrice(offering: OfferingId, locale: Locale = "de"): OfferingPrice {
  const price = OFFERING_PRICES[offering];
  if (price.figure === undefined) return price;
  return { ...price, figure: { ...price.figure, vatNote: VAT_NOTE[locale] } };
}

/** TS-WEB-0026 D6 / TS-WEB-0018 D2/D3 — true only for a `price_status: fixed` offering. */
export function publishablePrice(offering: OfferingId): boolean {
  return OFFERING_PRICES[offering].display === "priced";
}
