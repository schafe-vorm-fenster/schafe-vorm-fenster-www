import { Icon } from "../icon/icon";
import { PRICE_TIER_CTA_VARIANT, PRICE_TIERS } from "../price-section/price-tier-row";
import { PriceTag, type PriceDisplay, type PriceFigure } from "../price-tag/price-tag";

import type { CheckItem } from "../content-fragments";
import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

import styles from "./offer-tier.module.css";

/**
 * @deprecated Replaced by `price-section` (`PriceTierRow`, DEC-0118). The
 * order and the weight table are that module's now; these names re-export
 * them so the one page still composing the panel (`/dein-kalender`, T-13)
 * keeps compiling until it moves. Delete this folder once it has.
 */
export const OFFER_TIERS = PRICE_TIERS;

export type OfferTierId = (typeof OFFER_TIERS)[number];

/**
 * @deprecated See `PRICE_TIER_CTA_VARIANT`. Quiet · primary-light · quiet —
 * TS-WEB-0024 D6 as amended 2026-09-25; the earlier `secondary` on tier 1 was
 * the review's, not the determination's.
 */
export const OFFER_TIER_CTA_VARIANT = PRICE_TIER_CTA_VARIANT;

export interface OfferTierProps {
  readonly offeringId: OfferTierId;
  readonly name: string;
  readonly audienceLine: string;
  readonly priceDisplay: PriceDisplay;
  readonly priceFigure?: PriceFigure;
  readonly checks: readonly CheckItem[];
  /** The one CTA — rendered with `OFFER_TIER_CTA_VARIANT[offeringId]`, never chosen by the caller. */
  readonly primaryCta: ReactNode;
  readonly footnote?: string;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 27 `offer-tier` — **deprecated**, superseded by `price-tier-row`
 * (`src/components/price-section/`, TS-WEB-0024 D6 as amended 2026-09-25).
 *
 * What changed and why the panel is on its way out: D6 fixes **exactly one
 * CTA per tier** (DEC-0082 §4) and the weights quiet · primary-light · quiet.
 * This panel used to offer a `secondaryCta` slot and mapped tier 1 to
 * `secondary`; both are gone — one CTA per tier is structural now, and the
 * weight table is shared with the row that replaces this.
 *
 * Structure: one tier — name, audience line, `price-tag`, check rows, one
 * CTA. States: static. Inherits: not an audience selector; no feature
 * matrix; radius 0. Space: stretches to the group's height. A11y: the tier
 * name is a heading.
 */
export function OfferTier({
  offeringId,
  name,
  audienceLine,
  priceDisplay,
  priceFigure,
  checks,
  primaryCta,
  footnote,
  locale,
  className,
}: OfferTierProps) {
  return (
    <div
      className={[styles.tier, className].filter(Boolean).join(" ")}
      data-cta-variant={OFFER_TIER_CTA_VARIANT[offeringId]}
      data-offering={offeringId}
    >
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.audience}>{audienceLine}</p>
      <PriceTag className={styles.price} display={priceDisplay} figure={priceFigure} locale={locale} />
      <ul className={styles.checks}>
        {checks.map((check) => (
          <li className={check.emphasis ? styles.checkEmphasis : styles.check} key={check.text}>
            <Icon name="check" />
            {check.text}
          </li>
        ))}
      </ul>
      <div className={styles.ctas}>{primaryCta}</div>
      {footnote ? <p className={styles.footnote}>{footnote}</p> : null}
    </div>
  );
}
