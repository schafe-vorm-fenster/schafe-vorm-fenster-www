/**
 * The county's written-out name — F-2-73 (the English half of F-2-63).
 *
 * `RegionExamples.county` is geo-api's **identifier** (`geoname.900001`), and
 * `types.ts` says so. Block 3 of `/deine-region` nevertheless interpolates it
 * into a heading, because the content template asks for a county by name:
 * `{landkreis}` in German, `{county}` in English. F-2-63 filled the German
 * slot with a generic phrase at page level and stopped there, so the English
 * page still read "examples from geoname.900001" — a raw internal identifier
 * as visitor copy, the same leak class as F-2-35.
 *
 * The fix is here rather than in a second per-locale ternary on the page:
 * one function turns whatever the live layer knows about a county into
 * something a visitor can read, in her language, and an identifier can no
 * longer reach a heading by any route.
 *
 * TS-026 D4 decides what the generic phrase *means*: without an anchor no
 * county name is asserted. So an unresolved county does not become "the
 * county" — it becomes "your region", which claims nothing.
 */

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";

/**
 * geo-api's identifier shape — a source prefix and a numeric id, e.g.
 * `geoname.900001`. Anchored and numeric on the right so a real county name
 * that happens to carry a full stop ("Landkreis St. Wendel") is not caught.
 */
const GEO_IDENTIFIER = /^[a-z][a-z0-9-]*\.\d+$/i;

export function isGeoIdentifier(value: string): boolean {
  return GEO_IDENTIFIER.test(value.trim());
}

/** What a heading says where no county may be asserted (TS-026 D4). */
export function genericCountyLabel(locale: Locale): string {
  return dictionary(locale).live.genericCounty;
}

/**
 * A county as visitor copy: its own name where one is known, and the
 * language's generic phrase where the live layer only has an identifier — or
 * nothing at all.
 */
export function countyLabel(county: string | undefined, locale: Locale): string {
  const trimmed = county?.trim() ?? "";
  if (trimmed === "" || isGeoIdentifier(trimmed)) return genericCountyLabel(locale);
  return trimmed;
}
