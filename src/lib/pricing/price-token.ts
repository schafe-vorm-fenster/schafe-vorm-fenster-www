/**
 * `{price:<offering-id>}` in a content field — the one way a sentence may
 * carry a price (TS-WEB-0006-A12, DEC-0145).
 *
 * `TS-WEB-0006-A12` reads: *"The only numeric price rendered anywhere is
 * `portalize-calendar`'s 480 €/year, read from the offering package."* Until
 * 2026-09-27 `/ueber-uns` typed the figure into its third village argument —
 * while the same file's author note claimed the opposite, "gelesen, nicht
 * getippt" — so a price change in the hub would have left that sentence
 * behind and nothing would have said so (state/open.md row 287).
 *
 * A sentence cannot call `offeringPrice` itself, and pulling the figure out of
 * the sentence would have cost the owner's wording. So the field keeps the
 * sentence and names the figure by its offering:
 *
 *   Deshalb kostet die Lizenz für den eigenen Kalender {price:portalize-calendar} im Jahr …
 *
 * and the page resolves it through the same node every price render already
 * uses — `offeringPrice` plus `formatPriceParts` — so the string in the
 * paragraph and the string in the price tier are formatted by one formatter in
 * one locale's rules.
 *
 * **The amount only, never the interval.** "im Jahr" / "a year" stays in the
 * sentence, because that is grammar and the author owns it; `480 €` / `€480`
 * is data and the package owns it.
 *
 * ── Why it throws ────────────────────────────────────────────────────────
 *
 * An unknown offering id and an offering that publishes no figure both throw,
 * which fails the build rather than rendering an empty gap or a `0` in a
 * sentence about money. That is `publishedFigure`'s rule (TS-WEB-0026-A4) and
 * this function does not soften it. A token left in a field that no page
 * resolves is caught from the other side, by `check:content`.
 */

import { formatPriceParts } from "@/src/components/price-tag/format";
import { OFFERING_IDS, publishedFigure } from "@/src/lib/pricing/offerings";

import type { OfferingId } from "@/src/lib/pricing/offerings";
import type { Locale } from "@/src/lib/i18n/locales";

/** `{price:portalize-calendar}` — the whole token, with the id captured. */
export const PRICE_TOKEN = /\{price:([a-z0-9-]+)\}/g;

/**
 * Every `{price:…}` token in one string, replaced by the offering's
 * currency-formatted amount in the page's locale.
 *
 * A string with no token comes back unchanged, so a caller may run every
 * field through it without asking first.
 */
export function resolvePriceTokens(text: string, locale: Locale = "de"): string {
  return text.replace(PRICE_TOKEN, (_whole, id: string) => {
    if (!(OFFERING_IDS as readonly string[]).includes(id)) {
      throw new Error(
        `{price:${id}} names no offering — the six ids are ${OFFERING_IDS.join(", ")} (TS-WEB-0006-A12)`,
      );
    }
    return formatPriceParts(publishedFigure(id as OfferingId, locale), locale).amount;
  });
}
