/**
 * The legal anchor registry — TS-004 D8, DEC-039.
 *
 * **These anchors are permanent.** Once published they are linked from
 * contracts, invoices, app screens, printed material and third-party records.
 * An anchor is never renamed and never removed; a retired section keeps its
 * anchor with a pointer to its successor. New sections append.
 *
 * The anchors are localized like path segments (TS-004 D3a) and stable
 * across languages in *meaning*: `/rechtliches#impressum` and
 * `/legal#imprint` are the same section.
 */

import type { Locale } from "../i18n/locales";

export const LEGAL_SECTION_IDS = [
  "imprint",
  "privacy",
  "accessibility",
  "terms",
  "communityGuidelines",
  "dataProcessing",
] as const;

export type LegalSectionId = (typeof LEGAL_SECTION_IDS)[number];

/** Anchor per section and language, in registry order (TS-004 D8). */
export const LEGAL_ANCHORS: Readonly<
  Record<LegalSectionId, Readonly<Record<Locale, string>>>
> = {
  imprint: { de: "impressum", en: "imprint" },
  privacy: { de: "datenschutz", en: "privacy" },
  accessibility: { de: "barrierefreiheit", en: "accessibility" },
  terms: { de: "nutzungsbedingungen", en: "terms" },
  communityGuidelines: { de: "community-richtlinien", en: "community-guidelines" },
  dataProcessing: { de: "auftragsverarbeitung", en: "data-processing" },
};

export function legalAnchor(section: LegalSectionId, locale: Locale): string {
  return LEGAL_ANCHORS[section][locale];
}
