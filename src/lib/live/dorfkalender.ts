/**
 * The five fixed places of the drawn phone in "Dein digitaler Dorfkalender." —
 * issue issue 143, DEC-0194.
 *
 * The phone is not a list sorted by date but five **slots**, one per legend
 * entry. Each slot looks for the next real date of its category in the
 * recognised place; where there is none, the slot shows its fixed default row
 * (the dictionary's `dorfkalender.defaults`). Slots are filled one by one, so
 * real and default rows may stand side by side, and the order is the legend's,
 * never the calendar's.
 *
 * The four categories are `categories.ts`'s own ids — nothing is mapped here
 * that table does not already hold:
 *
 * | slot | legend | events-api id |
 * | --- | --- | --- |
 * | 1 | Versorgung | `everyday-supply` |
 * | 2 | Gemeindeleben | `community-life` |
 * | 3 | Bildung & Gesundheit | `education-health` |
 * | 4 | Kultur & Tourismus | `culture-tourism` |
 * | 5 | In den Nachbarorten | any category, another place than the recognised one |
 *
 * Pure: no fetch, no React. The island that calls it is
 * `src/components/dorfkalender-intro/`.
 */

import { OG_LOCALE } from "@/src/lib/i18n/locales";

import { categoryLabel } from "./categories";

import type { EventsApiCategoryId } from "./categories";
import type { Locale } from "@/src/lib/i18n/locales";
import type { LiveEvent } from "./types";

/** The geometry the legend is computed from (issue issue 143, "Gleichmäßige Positionierung"). */
export const PHONE_GEOMETRY = {
  /** The whole device, px. */
  width: 300,
  height: 580,
  /** Metal frame 6 px + black rim 4 px: where the display starts. */
  rim: 10,
  header: 150,
  row: 82,
} as const;

/** One slot of the phone, in legend order. */
export type SlotKind =
  | { readonly kind: "category"; readonly category: EventsApiCategoryId }
  | { readonly kind: "neighbours" };

export const SLOTS: readonly SlotKind[] = [
  { kind: "category", category: "everyday-supply" },
  { kind: "category", category: "community-life" },
  { kind: "category", category: "education-health" },
  { kind: "category", category: "culture-tourism" },
  { kind: "neighbours" },
];

/**
 * The vertical centre of each legend entry, from the header height, the row
 * height and the display rim — entry 0 is the photo header, 1–5 the rows. The
 * legend is computed, never placed by hand.
 */
export function legendCenters(
  geometry: Pick<typeof PHONE_GEOMETRY, "rim" | "header" | "row"> = PHONE_GEOMETRY,
  rows = SLOTS.length,
): number[] {
  const { rim, header, row } = geometry;
  return [rim + header / 2, ...Array.from({ length: rows }, (_, index) => rim + header + row * index + row / 2)];
}

/** What one row of the phone prints. */
export interface PhoneRow {
  /** Two letters. */
  readonly weekday: string;
  readonly day: number;
  /** `HH:MM`, or `undefined` for an all-day date. */
  readonly time?: string;
  readonly place: string;
  readonly title: string;
  /** `real` rows come from the calendar, `default` ones from the dictionary. */
  readonly source: "real" | "default";
}

export interface DefaultRow {
  readonly weekday: string;
  readonly day: number;
  readonly time: string;
  readonly place: string;
  readonly title: string;
}

function parts(starts: Date, locale: Locale): { weekday: string; day: number; time: string } {
  const tag = OG_LOCALE[locale].replace("_", "-");
  const zone = "Europe/Berlin";
  const weekday = new Intl.DateTimeFormat(tag, { weekday: "short", timeZone: zone })
    .format(starts)
    .replace(/\./gu, "")
    .slice(0, 2);
  const day = Number(new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: zone }).format(starts));
  const time = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: zone,
  }).format(starts);
  return { weekday, day, time };
}

/** A `LiveEvent` as a phone row, or `undefined` for one with no readable start. */
export function rowOf(event: LiveEvent, locale: Locale, fallbackPlace: string): PhoneRow | undefined {
  const starts = new Date(event.startsAt);
  if (Number.isNaN(starts.getTime())) return undefined;
  const { weekday, day, time } = parts(starts, locale);
  return {
    weekday,
    day,
    // An all-day date has no hour: its stored start is midnight UTC, which
    // would print a time nobody set.
    time: event.allDay ? undefined : time,
    place: event.placeName ?? fallbackPlace,
    title: event.title,
    source: "real",
  };
}

function byStart(a: LiveEvent, b: LiveEvent): number {
  return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
}

/**
 * The five rows, one per slot.
 *
 * `own` are the recognised place's dates, `nearby` the dates around it. Slots
 * 1–4 take the earliest of `own` carrying that slot's category; slot 5 the
 * earliest of `nearby` that is not the place's own. `now` is not read: both
 * lists are the BFF's "upcoming" window already.
 */
export function pickRows(args: {
  readonly own: readonly LiveEvent[];
  readonly nearby: readonly LiveEvent[];
  readonly communityId: string;
  readonly placeName: string;
  readonly defaults: readonly DefaultRow[];
  readonly locale: Locale;
}): PhoneRow[] {
  const { own, nearby, communityId, placeName, defaults, locale } = args;
  const ownSorted = [...own].sort(byStart);
  // Another place than the recognised one: by community where the date names
  // it, by the place's name where it does not.
  const foreign = [...nearby]
    .filter((event) =>
      event.communityId !== undefined
        ? event.communityId !== communityId
        : event.placeName !== undefined && event.placeName !== placeName,
    )
    .sort(byStart);

  return SLOTS.map((slot, index) => {
    const pool = slot.kind === "category" ? ownSorted.filter((event) => event.categoryId === slot.category) : foreign;
    for (const event of pool) {
      const row = rowOf(event, locale, placeName);
      if (row !== undefined) return row;
    }
    const fallback = defaults[index];
    return { ...fallback, source: "default" as const };
  });
}

/** The six legend labels in order: the place, the four categories, the neighbours. */
export function legendLabels(locale: Locale, words: { legendPlace: string; legendNeighbours: string }): string[] {
  return [
    words.legendPlace,
    ...SLOTS.map((slot) => (slot.kind === "category" ? categoryLabel(slot.category, locale) : words.legendNeighbours)),
  ];
}
