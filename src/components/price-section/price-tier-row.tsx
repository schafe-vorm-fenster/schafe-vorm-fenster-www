import { Button, type ButtonVariant } from "../button/button";
import { Icon, type IconName } from "../icon/icon";
import { formatPriceParts } from "../price-tag/format";

import type { CheckItem } from "../content-fragments";
import type { LinkOptions } from "../route-link/href";
import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";
import type { OfferingPrice } from "@/src/lib/pricing/offerings";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./price-tier-row.module.css";

/** The three tiers, in the fixed order TS-WEB-0024 D6/D6a names. */
export const PRICE_TIERS = ["community-calendar", "portalize-calendar", "portalize-enterprise"] as const;

export type PriceTierId = (typeof PRICE_TIERS)[number];

/** The two weights a tier CTA may take — Pulse is not among them (DEC-0082 B). */
export type PriceTierCtaVariant = Extract<ButtonVariant, "secondary" | "primary-light">;

/**
 * The weight is derived from the tier, never chosen at a call site — this is
 * what makes "secondary · primary-light · secondary, never Pulse" (TS-WEB-0024 D6, D3)
 * structural rather than a matter of taste. The drafts' ink pill on tier 1
 * and Pulse on tier 2 are the two named deviations that are not built.
 */
export const PRICE_TIER_CTA_VARIANT: Record<PriceTierId, PriceTierCtaVariant> = {
  "community-calendar": "secondary",
  "portalize-calendar": "primary-light",
  "portalize-enterprise": "secondary",
};

/** The glyph in each tier's icon well — where the calendar runs (D6a), from the 2026-09-23 drafts. */
const PRICE_TIER_ICON: Record<PriceTierId, IconName> = {
  "community-calendar": "house",
  "portalize-calendar": "globe",
  "portalize-enterprise": "map-pin",
};

/** A tier's one CTA — a route target and a label; the rung is secondary (DEC-0082 §4). */
export interface PriceTierCta extends Omit<LinkOptions, "locale"> {
  readonly label: string;
  /** Tier 1 → `takePart`, tier 2 → `order`, tier 3 → `region` (TS-WEB-0024 D6). */
  readonly to: RouteId;
  /** `secondary` by default (TS-WEB-0006-A18); `primary` is not a value this slot can take. */
  readonly dataCta?: "secondary" | "equal-weight";
  /** The 24 px `arrow-right` — on by default, every tier CTA leads onward. */
  readonly onward?: boolean;
}

export interface PriceTierRowProps {
  readonly offeringId: PriceTierId;
  /** The mono kicker beside the icon well — where the calendar runs. */
  readonly kicker: string;
  readonly title: string;
  /** `offeringPrice(offeringId, locale)` — the row never types a figure. */
  readonly price: OfferingPrice;
  /** The three ✓ lines; a short argument, not a feature matrix. */
  readonly checks: readonly CheckItem[];
  /**
   * `data-demo="true"` on the check list, for check lines that are still a
   * placeholder — `DEC-0068`'s first guardrail wants the marking **in the
   * markup**, so a build can enumerate what needs replacing, and the check
   * list is the smallest element that holds exactly those lines. The caller
   * derives it from the slot the lines come from (`isDemoSlot`) and never
   * hard-codes it; a row whose checks are the owner's passes nothing.
   */
  readonly checksDemo?: boolean;
  /** Exactly one. There is no second slot. */
  readonly cta: PriceTierCta;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * `price-tier-row` [PROPOSED] — content type 7, TS-WEB-0024 D6/D6a,
 * `specs/contracts/design-system-contract.md` ("three rows in one section,
 * `line` hairline between them"). Replaces the per-tier panel of
 * `offer-tier`.
 *
 * Structure: a 40 px `lime-100` icon well with a `lime-800` glyph beside a
 * mono kicker; the title; the price — the figure at `displayMono` with its
 * qualifier beside it, or the permanence / on-request statement where the
 * offering publishes no figure (TS-WEB-0006 D10); three check rows divided by
 * `line` hairlines; **one** CTA, rendered here from a route target so a
 * second one cannot be passed.
 * States: none — the price is the offering's publication state, not late
 * data.
 * Inherits: the CTA's weight from `offeringId` (secondary · primary-light ·
 * secondary, never Pulse); radius 0; a 1 px `line` hairline between rows, never
 * a 2 px lime rule and never three sections.
 * Space: the figure line is reserved at the display-mono height so a digit
 * count or a currency change never reflows the row.
 * A11y: the title is an `h3`; the figure and its qualifier are one
 * paragraph, read in order; the well's glyph is decorative.
 */
export function PriceTierRow({
  offeringId,
  kicker,
  title,
  price,
  checks,
  checksDemo,
  cta,
  locale = "de",
  className,
}: PriceTierRowProps) {
  const variant = PRICE_TIER_CTA_VARIANT[offeringId];

  return (
    <div
      className={[styles.row, className].filter(Boolean).join(" ")}
      data-cta-variant={variant}
      data-offering={offeringId}
    >
      <p className={styles.kicker}>
        <span className={styles.well}>
          <Icon name={PRICE_TIER_ICON[offeringId]} />
        </span>
        {kicker}
      </p>
      <h3 className={styles.title}>
        {titleLines(title).map((line) => (
          <span className={styles.titleLine} key={line}>
            {line}
          </span>
        ))}
      </h3>
      <PriceLine locale={locale} price={price} />
      <ul className={styles.checks} data-demo={checksDemo ? "true" : undefined}>
        {checks.map((check) => (
          <li className={check.emphasis ? styles.checkEmphasis : styles.check} key={check.text}>
            <Icon name="check" />
            {check.text}
          </li>
        ))}
      </ul>
      <div className={styles.cta}>
        <Button
          dataCta={cta.dataCta ?? "secondary"}
          hash={cta.hash}
          locale={locale}
          onward={cta.onward ?? true}
          query={cta.query}
          to={cta.to}
          variant={variant}
        >
          {cta.label}
        </Button>
      </div>
    </div>
  );
}

/**
 * Break the title at the authored ` / ` — the fixed two-line break of every
 * tier heading (DEC-0205). Each line is a block, followed by a space inside
 * the text so the heading still reads as one phrase.
 */
function titleLines(title: string): string[] {
  const lines = title.split(" / ").map((line) => line.trim());
  return lines.map((line, index) => (index < lines.length - 1 ? `${line} ` : line));
}

/**
 * All three tiers show a figure line at the same size (DEC-0205): "0 €",
 * "480 €", "Auf Anfrage", each with a small explanation beneath. The figures
 * come from the offering import; a tier that publishes none shows the
 * on-request statement. One paragraph, so a screen reader reads figure and
 * explanation in order.
 */
function PriceLine({ price, locale }: { readonly price: OfferingPrice; readonly locale: Locale }) {
  const words = dictionary(locale).price;

  let main: string;
  let note: string;
  if (price.display === "priced" && price.figure !== undefined) {
    const parts = formatPriceParts(price.figure, locale);
    main = parts.amount;
    note = [parts.interval ? words.perYear : undefined, parts.vatNote].filter(Boolean).join(", ");
  } else if (price.display === "permanent" && price.figure !== undefined) {
    main = formatPriceParts(price.figure, locale).amount;
    note = words.permanentNote;
  } else {
    main = words.onRequest;
    note = words.onRequestNote;
  }

  return (
    <p className={styles.price}>
      <span className={styles.figure}>{main}</span>
      <span className={styles.qualifier}>{note}</span>
    </p>
  );
}
