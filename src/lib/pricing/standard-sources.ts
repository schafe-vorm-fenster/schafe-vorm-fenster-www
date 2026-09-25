/**
 * The standard sources of the price boundary — TS-WEB-0022 D11, DEC-0107 §3.
 *
 * "A source the platform already supports publishes free." Which sources
 * those are is **owned by the offering record**
 * (`node_modules/@schafe-vorm-fenster/offerings/community-calendar.offering.md`,
 * lines 111–113: a WordPress plugin, a common council information system
 * (Ratsinformationssystem), and an ICS feed; lines 230–234 declare the list
 * owned there). This module transcribes that list the way `offerings.ts`
 * transcribes the prices — read once while building, held against the
 * package by `standard-sources.test.ts`, never imported at request time
 * (TS-WEB-0007 D3) and never listed in a page.
 *
 * The cooperations (`kirche-mv.de`, VEVG Karlsburg, the Volkshochschulen)
 * are **not** standard sources and never appear here (D11, DEM-0067).
 */

import type { Locale } from "@/src/lib/i18n/locales";

export const STANDARD_SOURCE_IDS = ["wordpress-plugin", "ratsinformationssystem", "ics-feed"] as const;

export type StandardSourceId = (typeof STANDARD_SOURCE_IDS)[number];

export interface StandardSource {
  readonly id: StandardSourceId;
  /** The name shown, per locale — the package's own term, not a sentence. */
  readonly label: Readonly<Record<Locale, string>>;
  /** The phrase the offering record uses, for the test that holds this list against it. */
  readonly packagePhrase: string;
}

const STANDARD_SOURCES: readonly StandardSource[] = [
  {
    id: "wordpress-plugin",
    label: { de: "WordPress-Plugin", en: "WordPress plugin" },
    packagePhrase: "WordPress plugin",
  },
  {
    id: "ratsinformationssystem",
    label: { de: "Ratsinformationssystem", en: "Council information system (Ratsinformationssystem)" },
    packagePhrase: "council information system",
  },
  {
    id: "ics-feed",
    label: { de: "ICS-Feed", en: "ICS feed" },
    packagePhrase: "ICS feed",
  },
];

/** The one place a banner reads the standard-source list (TS-WEB-0022-A17). */
export function standardSources(): readonly StandardSource[] {
  return STANDARD_SOURCES;
}
