import type { Locale } from "@/src/lib/i18n/locales";

/** The four ways a price may be shown — TS-006 D10, distinct from `DataState`:
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

/**
 * One readable string for the figure and its qualifier (TS-006 D10 a11y) —
 * "480 € / Jahr, zzgl. USt." rather than three separately-styled fragments a
 * screen reader would announce out of order.
 */
export function formatPriceFigure(
  figure: PriceFigure,
  locale: Locale = "de",
): string {
  const amount = new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", {
    style: "currency",
    currency: figure.currency ?? "EUR",
    maximumFractionDigits: 0,
  }).format(figure.amount);

  const interval = figure.interval
    ? ` / ${INTERVAL_LABEL[locale][figure.interval]}`
    : "";
  const vat = figure.vatNote ? `, ${figure.vatNote}` : "";

  return `${amount}${interval}${vat}`;
}
