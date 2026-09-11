import { formatPriceFigure, type PriceDisplay, type PriceFigure } from "./format";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./price-tag.module.css";

export type { PriceDisplay, PriceFigure };

export interface PriceTagProps {
  readonly display: PriceDisplay;
  /** Required when `display` is `"priced"`. */
  readonly figure?: PriceFigure;
  /** The free tier's permanence statement — not a price (TS-006 D10). */
  readonly permanentLabel?: string;
  readonly onRequestLabel?: string;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 29 `price-tag` [PROPOSED] — TS-006 D10, TS-018 D3.
 *
 * Structure: the only component that renders a price. It takes the figure as
 * a typed prop rather than reading a package directly — the content pipeline
 * (M3) is what will resolve `@schafe-vorm-fenster/offerings` into this shape,
 * so no page or component ever types a literal figure.
 * States: not the D-9 vocabulary — a price is static content, not late data.
 * Its own four states are the offering's publication state (TS-006 D10):
 *   priced      → the figure with its net qualifier and interval;
 *   on-request  → "auf Anfrage" — no figure, no range, no "ab";
 *   permanent   → the free tier's permanence statement, not a price;
 *   withheld    → nothing.
 * Inherits: mono type role for the figure.
 * Space: a fixed-height slot (one line reserved) so a currency or digit-count
 * change never reflows the tier around it.
 * A11y: the figure and its qualifier are one readable string, never split
 * across separately-announced elements.
 */
export function PriceTag({
  display,
  figure,
  permanentLabel = "Dauerhaft kostenfrei",
  onRequestLabel = "Auf Anfrage",
  locale = "de",
  className,
}: PriceTagProps) {
  const classes = [styles.tag, className].filter(Boolean).join(" ");

  if (display === "withheld") return <span className={classes} />;

  if (display === "permanent") {
    return <p className={classes}>{permanentLabel}</p>;
  }

  if (display === "on-request") {
    return <p className={classes}>{onRequestLabel}</p>;
  }

  if (!figure) return <p className={classes}>{onRequestLabel}</p>;

  return <p className={classes}>{formatPriceFigure(figure, locale)}</p>;
}
