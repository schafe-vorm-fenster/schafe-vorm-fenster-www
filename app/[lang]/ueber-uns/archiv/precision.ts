import type { ArchivePrecision } from "@/src/components/archive-row/archive-row";

/**
 * How precisely a media-echo entry states its own date.
 *
 * The package's `date` field is `YYYY`, `YYYY-MM` or `YYYY-MM-DD`, and the
 * content artifact's table carries it verbatim. `archive-row` defaults to
 * `day`, which is how 20 of the 31 rows came to be dated "01. <month>
 * <year>": a first-of-the-month that no outlet ever published on. The shape
 * of the string is the precision, so it is read rather than assumed.
 */
export function archivePrecision(date: string): ArchivePrecision {
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) return "day";
  if (/^\d{4}-\d{2}$/.test(date)) return "month";
  return "year";
}
