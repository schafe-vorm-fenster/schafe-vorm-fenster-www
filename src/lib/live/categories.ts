/**
 * Upstream category id → the design system's six event categories.
 *
 * The website's row badge has **six** tones (`src/components/event-row`);
 * events-api classifies into **five** ids
 * (`packages/rural-event-types/src/rural-event-category.types.ts`:
 * `community-life`, `education-health`, `everyday-supply`, `culture-tourism`,
 * `unknown`). The two vocabularies are not the same list, so the mapping is
 * written down here once rather than guessed at each render — before this
 * module every real event fell through to `neighbouring`, because the code
 * compared an events-api id against the design system's own names and never
 * matched one.
 *
 * | events-api id | tone | why |
 * | --- | --- | --- |
 * | `community-life` | `social` | "Gemeindeleben": Vereinstreffen, Feuerwehr, Sport, Gemeindevertretung |
 * | `culture-tourism` | `culture` | the same subject under both names |
 * | `everyday-supply` | `merchants` | "Versorgung" — the design system's own word for this tone |
 * | `education-health` | `official` | Volkshochschule, Arbeitsamt, Bibliothek, Impfzentrum — the institutional tone |
 * | `unknown`, absent, anything new | `neighbouring` | the table's own "everything else" tone |
 *
 * `fest` has **no events-api id**. It is not assigned here and no real event
 * can carry it — inventing a rule ("a title containing 'fest'") would be a
 * classification the ecosystem did not make. `state/open.md` row 6 carries it.
 *
 * The **label** is the upstream vocabulary's own short name, not a word this
 * repository invents: German from `rural-event-category.ts`, English from the
 * same file's `en` localization.
 */

import type { EventCategory } from "@/src/components/event-row/event-row";
import type { Locale } from "@/src/lib/i18n/locales";

export const EVENTS_API_CATEGORY_IDS = [
  "community-life",
  "education-health",
  "everyday-supply",
  "culture-tourism",
  "unknown",
] as const;

export type EventsApiCategoryId = (typeof EVENTS_API_CATEGORY_IDS)[number];

interface CategoryRow {
  readonly tone: EventCategory;
  readonly label: Readonly<Record<Locale, string>>;
}

const CATEGORY_TABLE: Readonly<Record<EventsApiCategoryId, CategoryRow>> = {
  "community-life": { tone: "social", label: { de: "Gemeindeleben", en: "Community life" } },
  "education-health": { tone: "official", label: { de: "Bildung & Gesundheit", en: "Education & health" } },
  "everyday-supply": { tone: "merchants", label: { de: "Versorgung", en: "Everyday supply" } },
  "culture-tourism": { tone: "culture", label: { de: "Kultur & Tourismus", en: "Culture & tourism" } },
  unknown: { tone: "neighbouring", label: { de: "Sonstiges", en: "Other" } },
};

/** The row every unmapped and every missing id lands on. */
const FALLBACK = CATEGORY_TABLE.unknown;

function rowFor(id: string | undefined): CategoryRow {
  if (id === undefined) return FALLBACK;
  return CATEGORY_TABLE[id as EventsApiCategoryId] ?? FALLBACK;
}

/** The badge tone of an events-api category id. */
export function categoryTone(id: string | undefined): EventCategory {
  return rowFor(id).tone;
}

/** The words beside the tone — the upstream vocabulary's own short name. */
export function categoryLabel(id: string | undefined, locale: Locale): string {
  return rowFor(id).label[locale];
}
