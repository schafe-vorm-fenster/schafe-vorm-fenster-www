import { PriceBand, type PriceBandProps } from "./price-band";
import { SectionShell } from "../section-shell/section-shell";

import type { ReactNode } from "react";

import styles from "./price-section.module.css";

export { PriceBand, type PriceBandProps } from "./price-band";
export {
  PRICE_TIER_CTA_VARIANT,
  PRICE_TIERS,
  PriceTierRow,
  type PriceTierCta,
  type PriceTierCtaVariant,
  type PriceTierId,
  type PriceTierRowProps,
} from "./price-tier-row";

export interface PriceSectionProps extends Omit<PriceBandProps, "headingId" | "className"> {
  /** The band headline's id — the section's `aria-labelledby`. */
  readonly headingId: string;
  /** The stable `data-block` id the page's composition sheet names (`tiers`, TS-WEB-0024 D2). */
  readonly dataBlock?: string;
  readonly id?: string;
  /** The three `price-tier-row`s, in the order `PRICE_TIERS` fixes. */
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * `price-section` [PROPOSED] — SRC-0014 §Page Rhythm, TS-WEB-0024 D6.
 *
 * Structure: **one** `paper` section — the `lime-500` band on top (kicker,
 * headline, one framing line), the tier rows beneath it. The section runs
 * uncontained so the band can run edge to edge; the band and the row group
 * each bring their own `.container`.
 * States: none.
 * Inherits: `section-shell`'s ground and rhythm. Because the three tiers are
 * rows inside this one section, it counts as a single `paper` section in
 * `checkRhythm()` and does not trip the consecutive-ground rule.
 * Space: the band carries the section step above the rows; each row carries
 * its own, divided by the hairline.
 * A11y: a `section` named by the band's `h2`.
 */
export function PriceSection({
  headingId,
  dataBlock,
  id,
  kicker,
  headline,
  framing,
  children,
  className,
}: PriceSectionProps) {
  return (
    <SectionShell
      className={[styles.section, className].filter(Boolean).join(" ")}
      contained={false}
      dataBlock={dataBlock}
      id={id}
      labelledBy={headingId}
      surface="paper"
    >
      <PriceBand framing={framing} headingId={headingId} headline={headline} kicker={kicker} />
      <div className={["container", styles.rows].join(" ")}>{children}</div>
    </SectionShell>
  );
}
