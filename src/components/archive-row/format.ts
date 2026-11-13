export const ARCHIVE_PRECISIONS = ["day", "month", "year"] as const;

export type ArchivePrecision = (typeof ARCHIVE_PRECISIONS)[number];

/**
 * The date at its stated precision — a `<time datetime>` value plus its
 * label, in the reader's own language.
 *
 * The locale was hard-wired to `de-DE`, so `/en/about/archive` dated all 31
 * rows "01. August 2026". Precision is the caller's: the media-echo entries
 * carry `YYYY`, `YYYY-MM` and `YYYY-MM-DD` alike, and a month-precision
 * entry rendered at day precision invents a first-of-the-month that no
 * source states.
 */
const DATE_LOCALE: Record<string, string> = { de: "de-DE", en: "en-GB" };

export function formatArchiveDate(
  date: string | Date,
  precision: ArchivePrecision,
  locale: string = "de",
): { iso: string; label: string } {
  const value = typeof date === "string" ? new Date(date) : date;
  const iso =
    precision === "year"
      ? String(value.getFullYear())
      : value.toISOString().slice(0, precision === "month" ? 7 : 10);
  const label = new Intl.DateTimeFormat(DATE_LOCALE[locale] ?? "de-DE", {
    timeZone: "Europe/Berlin",
    ...(precision === "year"
      ? { year: "numeric" }
      : precision === "month"
        ? { month: "long", year: "numeric" }
        : { day: "2-digit", month: "long", year: "numeric" }),
  }).format(value);
  return { iso, label };
}
