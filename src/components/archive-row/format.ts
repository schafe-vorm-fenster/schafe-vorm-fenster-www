export const ARCHIVE_PRECISIONS = ["day", "month", "year"] as const;

export type ArchivePrecision = (typeof ARCHIVE_PRECISIONS)[number];

/** The date at its stated precision — a `<time datetime>` value plus its label. */
export function formatArchiveDate(
  date: string | Date,
  precision: ArchivePrecision,
): { iso: string; label: string } {
  const value = typeof date === "string" ? new Date(date) : date;
  const iso =
    precision === "year"
      ? String(value.getFullYear())
      : value.toISOString().slice(0, precision === "month" ? 7 : 10);
  const label = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    ...(precision === "year"
      ? { year: "numeric" }
      : precision === "month"
        ? { month: "long", year: "numeric" }
        : { day: "2-digit", month: "long", year: "numeric" }),
  }).format(value);
  return { iso, label };
}
