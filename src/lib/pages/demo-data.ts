/**
 * The labelled dummy data the prototype's live modules render — the mock
 * rule of `plan/guardrails.md`.
 *
 * "Every missing external endpoint or component is built as a mock
 * delivering dummy data — never as a hole, never as a bare empty state …
 * Dummy data is obviously fictitious and labeled as such in the UI (a
 * `Demo-Daten` badge); it never contains real persons, customers, or
 * real-looking testimonials."
 *
 * M4 wires `/api/places/{slug}/events`, `/api/nearby`, `/api/places/search`
 * and `/api/stats` (TS-008 D2) behind the same module interfaces the pages
 * already render. Until then every one of those modules is handed the rows
 * below in the `mocked` state, which is what puts the `Demo-Daten` badge on
 * the module frame (`src/components/data-state.ts`). Nothing here is fetched,
 * and no row claims a real place: every name is a `Beispiel…`/`Example …`
 * construction, and every place name that is *not* one of these comes from
 * geo-api at M4 (WEB-F-024).
 *
 * Rows in `state/open.md`: `Mock aktiv` per module.
 */

import { APP_ORIGIN } from "@/src/lib/routes/routes";

import type { EventListItem } from "@/src/components/event-list/event-list";
import type { Locale } from "@/src/lib/i18n/locales";

/** The one invented place every demo module speaks about. */
export const DEMO_PLACE = {
  slug: "musterdorf",
  name: { de: "Beispielgemeinde Musterdorf", en: "Example municipality Musterdorf" },
  county: { de: "Beispielkreis Musterkreis", en: "Example district Musterkreis" },
} as const;

/** Where a demo calendar handover points — the app host, never a real slug. */
export function demoAppHref(slug: string = DEMO_PLACE.slug): string {
  return `${APP_ORIGIN}/${slug}`;
}

/**
 * The counter figure of TS-008 position 4. A figure is a claim, so this one
 * is only ever rendered inside a module marked `Demo-Daten`; `/api/stats`
 * replaces it at M4, and Q-037 keeps the other two figures absent rather
 * than estimated (TS-019-A14).
 */
export const DEMO_DATE_COUNT = 1234;

/**
 * Demo rows are dated relative to the render so they never read as "last
 * year". The pages are prerendered, so the dates freeze at build time — an
 * accepted property of a labelled demo, and one more reason the badge is
 * not optional.
 */
function inDays(days: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

interface DemoRow {
  readonly offset: number;
  readonly title: Record<Locale, string>;
  readonly meta: Record<Locale, string>;
  readonly category: EventListItem["category"];
  readonly categoryLabel: Record<Locale, string>;
}

const PLACE_ROWS: readonly DemoRow[] = [
  {
    offset: 2,
    title: { de: "Dorffest am Anger", en: "Village fête on the green" },
    meta: { de: "14:00 · Beispielgemeinde Musterdorf", en: "2 pm · Example municipality Musterdorf" },
    category: "fest",
    categoryLabel: { de: "Fest", en: "Fête" },
  },
  {
    offset: 4,
    title: { de: "Bäckerwagen am Dorfplatz", en: "Bakery van on the village square" },
    meta: { de: "08:30 · Beispielgemeinde Musterdorf", en: "8:30 am · Example municipality Musterdorf" },
    category: "merchants",
    categoryLabel: { de: "Versorgung", en: "Supplies" },
  },
  {
    offset: 9,
    title: { de: "Sitzung der Gemeindevertretung", en: "Municipal council meeting" },
    meta: { de: "19:00 · Beispielgemeinde Musterdorf", en: "7 pm · Example municipality Musterdorf" },
    category: "official",
    categoryLabel: { de: "Amtlich", en: "Official" },
  },
];

const NEARBY_ROWS: readonly DemoRow[] = [
  {
    offset: 1,
    title: { de: "Chorprobe im Gemeindehaus", en: "Choir rehearsal at the parish hall" },
    meta: { de: "18:00 · Beispieldorf Musterhagen", en: "6 pm · Example village Musterhagen" },
    category: "culture",
    categoryLabel: { de: "Kultur", en: "Culture" },
  },
  {
    offset: 2,
    title: { de: "Sprechstunde der Gemeinde", en: "Municipal open hours" },
    meta: { de: "10:00 · Beispielort Musterberg", en: "10 am · Example place Musterberg" },
    category: "official",
    categoryLabel: { de: "Amtlich", en: "Official" },
  },
  {
    offset: 3,
    title: { de: "Ausstellung im Schlosspark", en: "Exhibition in the castle park" },
    meta: { de: "11:00 · Beispielgemeinde Musterstein", en: "11 am · Example municipality Musterstein" },
    category: "culture",
    categoryLabel: { de: "Kultur", en: "Culture" },
  },
  {
    offset: 5,
    title: { de: "Übungsabend der Feuerwehr", en: "Fire brigade practice evening" },
    meta: { de: "19:30 · Beispieldorf Musterhagen", en: "7:30 pm · Example village Musterhagen" },
    category: "social",
    categoryLabel: { de: "Gemeinschaft", en: "Community" },
  },
  {
    offset: 6,
    title: { de: "Wochenmarkt", en: "Weekly market" },
    meta: { de: "09:00 · Beispielstadt Musterwalde", en: "9 am · Example town Musterwalde" },
    category: "merchants",
    categoryLabel: { de: "Versorgung", en: "Supplies" },
  },
];

function rows(source: readonly DemoRow[], locale: Locale): EventListItem[] {
  return source.map((row) => ({
    id: `${row.category}-${row.offset}`,
    date: inDays(row.offset),
    title: row.title[locale],
    meta: row.meta[locale],
    category: row.category,
    categoryLabel: row.categoryLabel[locale],
  }));
}

/** TS-008 position 1 — the next 3 dates of the known place, as demo rows. */
export function demoPlaceEvents(locale: Locale): EventListItem[] {
  return rows(PLACE_ROWS, locale);
}

/** TS-008 position 2 — 5 dates nearby, each naming its own place. */
export function demoNearbyEvents(locale: Locale): EventListItem[] {
  return rows(NEARBY_ROWS, locale);
}

/** TS-008 position 3 — the small set of active example places (DEC-034). */
export function demoExamplePlaces(locale: Locale): readonly string[] {
  return locale === "de"
    ? ["Beispieldorf Musterhagen", "Beispielort Musterberg", "Beispielstadt Musterwalde"]
    : ["Example village Musterhagen", "Example place Musterberg", "Example town Musterwalde"];
}
