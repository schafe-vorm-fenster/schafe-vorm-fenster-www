import { Icon } from "../icon/icon";
import { PriceTag, type PriceDisplay, type PriceFigure } from "../price-tag/price-tag";

import type { ButtonVariant } from "../button/button";
import type { CheckItem } from "../content-fragments";
import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

import styles from "./offer-tier.module.css";

/** The three tiers, in the fixed order TS-024 D6/D6a names. */
export const OFFER_TIERS = ["community-calendar", "portalize-calendar", "portalize-enterprise"] as const;

export type OfferTierId = (typeof OFFER_TIERS)[number];

/**
 * The variant is derived from the tier, never chosen at a call site — this is
 * what makes "tier 2 never Pulse" structural rather than a matter of taste.
 */
export const OFFER_TIER_CTA_VARIANT: Record<OfferTierId, ButtonVariant> = {
  "community-calendar": "secondary",
  "portalize-calendar": "primary-light",
  "portalize-enterprise": "quiet",
};

export interface OfferTierProps {
  readonly offeringId: OfferTierId;
  readonly name: string;
  readonly audienceLine: string;
  readonly priceDisplay: PriceDisplay;
  readonly priceFigure?: PriceFigure;
  readonly checks: readonly CheckItem[];
  /** Rendered with `OFFER_TIER_CTA_VARIANT[offeringId]` — never chosen by the caller. */
  readonly primaryCta: ReactNode;
  readonly secondaryCta?: ReactNode;
  readonly footnote?: string;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 27 `offer-tier` [PROPOSED] — content type 7 `offer-tier`, TS-024 D6/D6a.
 *
 * Structure: one tier under the page's own "who is the calendar for?"
 * heading — a short argument, `price-tag`, and up to two CTAs. The group
 * order (`community-calendar`, `portalize-calendar`, `portalize-enterprise`)
 * and each tier's `data-offering` are fixed; the shared question heading
 * above all three tiers is composed by the page, not repeated here.
 * States: static; the price comes from the offering package (via `price-tag`
 * props for now, until M3 wires the real one).
 * Inherits: **not an audience selector** — no tab, toggle, radio or `select`
 * anywhere near this component. No feature matrix. Radius 0 panel, hairline
 * separation, never a floating card. Tier 2's CTA is `primary-light`, never
 * `pulse`; tier 3's is `quiet` — both derived from `offeringId`, not passed.
 * Space: `min-height` matches across a rendered group via CSS `align-items:
 * stretch` on the page's grid, so the group does not reflow when copy length
 * differs between tiers.
 * A11y: the tier name is a heading; the two CTAs carry distinguishing labels
 * ("Kalender bestellen" ≠ three identical "Mehr erfahren").
 */
export function OfferTier({
  offeringId,
  name,
  audienceLine,
  priceDisplay,
  priceFigure,
  checks,
  primaryCta,
  secondaryCta,
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
      <div className={styles.ctas}>
        {primaryCta}
        {secondaryCta}
      </div>
      {footnote ? <p className={styles.footnote}>{footnote}</p> : null}
    </div>
  );
}
