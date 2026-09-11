import { OG_LOCALE } from "@/src/lib/i18n/locales";

import type { Locale } from "@/src/lib/i18n/locales";

/**
 * The date parts an `event-row` shows: the mono day number, the month beneath
 * it, and the machine-readable day for `<time datetime>`.
 */
export interface EventDayParts {
  readonly day: string;
  readonly month: string;
  readonly iso: string;
}

/** Everything on this website happens in one time zone. */
export const SITE_TIME_ZONE = "Europe/Berlin";

/** `de_DE` → `de-DE`: the BCP-47 tag of the one locale table (TS-011 D6). */
const intlLocale = (locale: Locale): string => OG_LOCALE[locale].replace("_", "-");

/**
 * Splits a date into the two lines of the event row.
 *
 * Formatting goes through `Intl`, never through a hand-written month table
 * (Web Interface Guidelines), and always in `Europe/Berlin`: a fixed zone is
 * what keeps the server-rendered row identical to the hydrated one, whatever
 * the visitor's clock says.
 */
export function formatEventDay(date: string | Date, locale: Locale = "de"): EventDayParts {
  const value = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) {
    throw new RangeError(`event-row: not a date: ${String(date)}`);
  }

  const tag = intlLocale(locale);
  const day = new Intl.DateTimeFormat(tag, {
    day: "numeric",
    timeZone: SITE_TIME_ZONE,
  }).format(value);

  const month = new Intl.DateTimeFormat(tag, {
    month: "short",
    timeZone: SITE_TIME_ZONE,
  })
    .format(value)
    .replace(/\.$/, "")
    .toUpperCase();

  const iso = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: SITE_TIME_ZONE,
  }).format(value);

  return { day, month, iso };
}
