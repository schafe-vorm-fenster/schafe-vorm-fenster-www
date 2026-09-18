/**
 * The stand-in data the prototype's live modules render — the mock rule of
 * `plan/guardrails.md` as Jan restated it on 2026-09-18: the marking lives
 * in frontmatter, `data-*` attributes and `state/open.md`, never in rendered
 * copy.
 *
 * M4 wires `/api/places/{slug}/events`, `/api/nearby`, `/api/places/search`
 * and `/api/stats` (TS-008 D2) behind the same module interfaces the pages
 * already render. Until then every one of those modules is handed the rows
 * below in the `mocked` state, which is what puts `data-demo="true"` on the
 * module frame (`src/components/data-state.ts`). Nothing here is fetched.
 * Place names are real municipalities of Vorpommern-Greifswald that the
 * brand's own sources already name; the real ones come from geo-api at M4
 * (WEB-F-024).
 *
 * Rows in `state/open.md`: `Mock aktiv` per module.
 */

import { APP_ORIGIN } from "@/src/lib/routes/routes";

import type { EventListItem } from "@/src/components/event-list/event-list";
import type { Locale } from "@/src/lib/i18n/locales";

/** The one place every stand-in module speaks about. */
export const DEMO_PLACE = {
  slug: "schlatkow",
  name: { de: "Schlatkow", en: "Schlatkow" },
  county: { de: "Vorpommern-Greifswald", en: "Vorpommern-Greifswald" },
} as const;

/** Where a stand-in calendar handover points — the app host. */
export function demoAppHref(slug: string = DEMO_PLACE.slug): string {
  return `${APP_ORIGIN}/${slug}`;
}

/**
 * The counter figure of TS-008 position 4. A figure is a claim, so this one
 * is only ever rendered inside a module carrying `data-demo="true"`;
 * `/api/stats` replaces it at M4, and Q-037 keeps the other two figures
 * absent rather than estimated (TS-019-A14).
 */
export const DEMO_DATE_COUNT = 1234;

/**
 * Rows are dated relative to the render so a list never reads as "last
 * year". The pages are prerendered, so the dates freeze at build time — an
 * accepted property, recorded as a `Mock aktiv` row rather than shown.
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
    title: { de: "Feuerwehrfest am Gerätehaus", en: "Fire brigade fête at the engine house" },
    meta: { de: "14:00 · Schlatkow", en: "2 pm · Schlatkow" },
    category: "fest",
    categoryLabel: { de: "Fest", en: "Fête" },
  },
  {
    offset: 4,
    title: { de: "Bäckerwagen am Dorfplatz", en: "Bakery van on the village square" },
    meta: { de: "08:30 · Schlatkow", en: "8:30 am · Schlatkow" },
    category: "merchants",
    categoryLabel: { de: "Versorgung", en: "Supplies" },
  },
  {
    offset: 9,
    title: { de: "Gemeindevertretersitzung, öffentlich", en: "Municipal council meeting, open to the public" },
    meta: { de: "19:00 · Schlatkow", en: "7 pm · Schlatkow" },
    category: "official",
    categoryLabel: { de: "Amtlich", en: "Official" },
  },
];

const NEARBY_ROWS: readonly DemoRow[] = [
  {
    offset: 1,
    title: { de: "Line-Dance-Gruppe im Gemeindehaus", en: "Line dancing at the parish hall" },
    meta: { de: "18:00 · Schmatzin", en: "6 pm · Schmatzin" },
    category: "culture",
    categoryLabel: { de: "Kultur", en: "Culture" },
  },
  {
    offset: 2,
    title: { de: "Sprechstunde der Gemeinde", en: "Municipal open hours" },
    meta: { de: "10:00 · Rubkow", en: "10 am · Rubkow" },
    category: "official",
    categoryLabel: { de: "Amtlich", en: "Official" },
  },
  {
    offset: 3,
    title: { de: "Führung im Wasserschloss", en: "Guided tour of the moated castle" },
    meta: { de: "11:00 · Quilow", en: "11 am · Quilow" },
    category: "culture",
    categoryLabel: { de: "Kultur", en: "Culture" },
  },
  {
    offset: 5,
    title: { de: "Seniorenkaffee im Vereinsheim", en: "Seniors' coffee at the clubhouse" },
    meta: { de: "15:00 · Schmatzin", en: "3 pm · Schmatzin" },
    category: "social",
    categoryLabel: { de: "Gemeinschaft", en: "Community" },
  },
  {
    offset: 6,
    title: { de: "Blutspende im Dorfgemeinschaftshaus", en: "Blood donation at the village hall" },
    meta: { de: "16:00 · Groß Kiesow", en: "4 pm · Groß Kiesow" },
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

/** TS-008 position 1 — the next 3 dates of the known place. */
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
    ? ["Schmatzin", "Rubkow", "Quilow"]
    : ["Schmatzin", "Rubkow", "Quilow"];
}
