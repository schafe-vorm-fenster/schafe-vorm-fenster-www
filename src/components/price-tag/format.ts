import type { Locale } from "@/src/lib/i18n/locales";

/** The four ways a price may be shown — TS-WEB-0006 D10, distinct from `DataState`:
 * this is what the *offering* permits, never what late data does to a page. */
export const PRICE_DISPLAYS = ["priced", "on-request", "permanent", "withheld"] as const;

export type PriceDisplay = (typeof PRICE_DISPLAYS)[number];

export interface PriceFigure {
  readonly amount: number;
  readonly currency?: string;
  readonly interval?: "year" | "month";
  /** e.g. "zzgl. USt." — the net qualifier the figure is never shown without. */
  readonly vatNote?: string;
}

const INTERVAL_LABEL: Record<"de" | "en", Record<"year" | "month", string>> = {
  de: { year: "Jahr", month: "Monat" },
  en: { year: "year", month: "month" },
};

export interface PriceParts {
  /** The currency-formatted amount — "480 €". */
  readonly amount: string;
  /** The interval word in the page's language — "Jahr", "year". */
  readonly interval?: string;
  readonly vatNote?: string;
}

/**
 * The figure's parts, so a renderer that sets the amount at the display-mono
 * size and the qualifier beside it (`price-tier-row`) reads the same locale
 * rules as the one-string form below — never a second formatter.
 */
export function formatPriceParts(figure: PriceFigure, locale: Locale = "de"): PriceParts {
  const amount = new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", {
    style: "currency",
    currency: figure.currency ?? "EUR",
    maximumFractionDigits: 0,
  }).format(figure.amount);

  return {
    amount,
    interval: figure.interval ? INTERVAL_LABEL[locale][figure.interval] : undefined,
    vatNote: figure.vatNote,
  };
}

/**
 * One readable string for the figure and its qualifier (TS-WEB-0006 D10 a11y) —
 * "480 € / Jahr, zzgl. USt." rather than three separately-styled fragments a
 * screen reader would announce out of order.
 */
export function formatPriceFigure(
  figure: PriceFigure,
  locale: Locale = "de",
): string {
  const parts = formatPriceParts(figure, locale);
  const interval = parts.interval ? ` / ${parts.interval}` : "";
  const vat = parts.vatNote ? `, ${parts.vatNote}` : "";

  return `${parts.amount}${interval}${vat}`;
}
