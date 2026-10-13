"use client";

import { useSyncExternalStore } from "react";

import { StageCalendar, type StageEventRow } from "@/src/components/explain-stage/explain-stage";
import { liveRoutes, useLive } from "@/src/lib/live/browser";

import { toListItems } from "../_live-items";

import type { SampleRowSpec } from "./paths";
import type { ThreeOf } from "@/src/components/explain-module/explain-module";
import type { Locale } from "@/src/lib/i18n/locales";
import type { PlaceEvents } from "@/src/lib/live/types";

/**
 * The calendar panels of the explain modules' third state — TS-WEB-0022 D4's
 * graphic stage, DEC-0115, DEC-0124, rendered in the browser since DEC-0163.
 *
 * `explain-stage` carries no sample of its own: "the page passes real rows or
 * a marked sample" (DEC-0115). This module is that page-side half:
 *
 *  - **Path 1** ends in "the date is in the calendar", and the calendar it
 *    means is the one the live example shows two sections further down. It
 *    reads the *same* BFF route position 1 reads (`/api/places/{slug}/events`),
 *    so the picture and the live module can never disagree about a place's
 *    dates.
 *  - **Paths 2 and 3** take the artifact's marked sample — three rows the
 *    content authored, on the **configured reference community**, never an
 *    invented place (DEC-0068 rule 3).
 *
 * The dates of a sample row are derived from *today*, because a written date
 * ages into a picture of last year — and since the page is static HTML built
 * once (DEC-0163), "today" is the visitor's, read after hydration. The
 * prerendered panel carries the build's `referenceDate`, so the server and
 * the hydrating client render the same text and only then move to today.
 */

/** Where the three sample rows sit, counted from today. */
const SAMPLE_OFFSET_DAYS = [3, 5, 8] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

function noSubscription(): () => void {
  return () => undefined;
}

/** Today at midnight UTC in the browser; the build's reference on the server and during hydration. */
function useToday(referenceDate: string): number {
  return useSyncExternalStore(
    noSubscription,
    () => Math.floor(Date.now() / DAY_MS) * DAY_MS,
    () => Date.parse(referenceDate),
  );
}

function rowsFromSample(sample: ThreeOf<SampleRowSpec>, today: number): ThreeOf<StageEventRow> {
  const [one, two, three] = sample.map((row, index) => ({
    ...row,
    date: new Date(today + SAMPLE_OFFSET_DAYS[index] * DAY_MS).toISOString(),
  })) as [StageEventRow, StageEventRow, StageEventRow];
  return [one, two, three];
}

export interface SampleStageCalendarProps {
  readonly locale: Locale;
  /** The covered place the panel is titled with — configuration, never copy. */
  readonly place: string;
  readonly sample: ThreeOf<SampleRowSpec>;
  /** The build's day (ISO), what the prerendered HTML dates the sample from. */
  readonly referenceDate: string;
}

/**
 * The marked sample panel. `provenance="sample"` puts
 * `data-placeholder="sample-events"` on the panel and `data-demo` on every
 * row, which is what keeps it from being mistakable for the real thing
 * (DEC-0068 rule 1).
 */
export function SampleStageCalendar({ locale, place, sample, referenceDate }: SampleStageCalendarProps) {
  const today = useToday(referenceDate);
  return <StageCalendar locale={locale} place={place} provenance="sample" rows={rowsFromSample(sample, today)} />;
}

export interface LiveStageCalendarProps extends SampleStageCalendarProps {
  /** The live example's own slug — the showcase community, configuration. */
  readonly slug: string;
}

/**
 * The live panel: three real rows of the covered place the live example
 * anchors on, and the artifact's marked sample wherever that is not
 * available — still loading, an unresolvable slug, an upstream that answers
 * fewer than the three rows the square panel shows, or a mocked envelope,
 * which is a sample by definition and says so through `provenance`.
 */
export function LiveStageCalendar({ slug, locale, place, sample, referenceDate }: LiveStageCalendarProps) {
  const today = useToday(referenceDate);
  const load = useLive<PlaceEvents>(liveRoutes.placeEvents(slug, 3));
  const items = load.status === "ready" ? toListItems(load.envelope.data.events, locale) : [];

  if (load.status !== "ready" || items.length < 3) {
    return <StageCalendar locale={locale} place={place} provenance="sample" rows={rowsFromSample(sample, today)} />;
  }

  const [one, two, three] = items.slice(0, 3).map((item) => ({
    date: item.date,
    title: item.title,
    meta: item.meta,
    category: item.category,
    categoryLabel: item.categoryLabel,
  })) as [StageEventRow, StageEventRow, StageEventRow];

  return (
    <StageCalendar
      locale={locale}
      place={load.envelope.data.place.name}
      provenance={load.envelope.demo ? "sample" : "live"}
      rows={[one, two, three]}
    />
  );
}
