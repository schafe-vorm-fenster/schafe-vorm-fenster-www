import { formatPriceFigure, type PriceDisplay, type PriceFigure } from "./format";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./price-tag.module.css";

export type { PriceDisplay, PriceFigure };

export interface PriceTagProps {
  readonly display: PriceDisplay;
  /** Required when `display` is `"priced"`. */
  readonly figure?: PriceFigure;
  /** The free tier's permanence statement — not a price (TS-WEB-0006 D10). */
  readonly permanentLabel?: string;
  readonly onRequestLabel?: string;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 29 `price-tag` [PROPOSED] — TS-WEB-0006 D10, TS-WEB-0018 D3.
 *
 * Structure: the only component that renders a price. It takes the figure as
 * a typed prop rather than reading a package directly — the content pipeline
 * (M3) is what will resolve `@schafe-vorm-fenster/offerings` into this shape,
 * so no page or component ever types a literal figure.
 * States: not the D-9 vocabulary — a price is static content, not late data.
 * Its own four states are the offering's publication state (TS-WEB-0006 D10):
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
  permanentLabel,
  onRequestLabel,
  locale = "de",
  className,
}: PriceTagProps) {
  const classes = [styles.tag, className].filter(Boolean).join(" ");
  // F-2-33: both labels were German literals in this component body, so the
  // free tier on `/en/your-calendar` read "Dauerhaft kostenfrei" and the
  // enterprise tier "Auf Anfrage". A page may still override them; the
  // fallback follows the page's language rather than the author's.
  const words = dictionary(locale).price;
  const permanent = permanentLabel ?? words.permanent;
  const onRequest = onRequestLabel ?? words.onRequest;

  if (display === "withheld") return <span className={classes} />;

  if (display === "permanent") {
    return <p className={classes}>{permanent}</p>;
  }

  if (display === "on-request") {
    return <p className={classes}>{onRequest}</p>;
  }

  if (!figure) return <p className={classes}>{onRequest}</p>;

  return <p className={classes}>{formatPriceFigure(figure, locale)}</p>;
}
