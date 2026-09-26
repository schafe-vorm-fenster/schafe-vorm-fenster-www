import { cacheLife, cacheTag } from "next/cache";

import { StageCalendar, type StageEventRow } from "@/src/components/explain-stage/explain-stage";
import { cacheLifeProfile, cacheTags } from "@/src/lib/live/cache-profiles";
import { placeEvents } from "@/src/lib/live/places";

import { toListItems } from "../_islands";

import type { SampleRowSpec } from "./paths";
import type { ThreeOf } from "@/src/components/explain-module/explain-module";
import type { Locale } from "@/src/lib/i18n/locales";

/**
 * The calendar panels of the explain modules' third state — TS-WEB-0022 D4's
 * graphic stage, DEC-0115, DEC-0124.
 *
 * `explain-stage` carries no sample of its own: "the page passes real rows or
 * a marked sample" (DEC-0115). This module is that page-side half, and it is
 * two components because the two cases are different facts:
 *
 *  - **Path 1** ends in "the date is in the calendar", and the calendar it
 *    means is the one the live example shows two sections further down. It
 *    therefore reads the *same* interface module (`placeEvents`, TS-WEB-0008
 *    position 1) through the *same* cache profile, so the picture and the
 *    live module can never disagree about a place's dates.
 *  - **Paths 2 and 3** end in "new, moved, cancelled" and "new dates land in
 *    the calendar", which no live window reliably shows at any given minute.
 *    They take the artifact's marked sample instead — three rows the content
 *    authored, on the **configured reference community**, never an invented
 *    place (DEC-0068 rule 3).
 *
 * Both are `use cache` components, for the reason TS-WEB-0009 D2 gives: the
 * page is prerendered, the slug is a prop rather than a request value, and a
 * cached component's props are its cache key. The dates of a sample row are
 * derived here rather than written into the artifact, because a written date
 * ages into a picture of last year.
 */

/** Where the three sample rows sit, counted from the day the cache entry is built. */
const SAMPLE_OFFSET_DAYS = [3, 5, 8] as const;

function dayAfter(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function rowsFromSample(sample: ThreeOf<SampleRowSpec>): ThreeOf<StageEventRow> {
  const [one, two, three] = sample.map((row, index) => ({
    ...row,
    date: dayAfter(SAMPLE_OFFSET_DAYS[index]),
  })) as [StageEventRow, StageEventRow, StageEventRow];
  return [one, two, three];
}

export interface SampleStageCalendarProps {
  readonly locale: Locale;
  /** The covered place the panel is titled with — configuration, never copy. */
  readonly place: string;
  readonly sample: ThreeOf<SampleRowSpec>;
}

/**
 * The marked sample panel. `provenance="sample"` puts
 * `data-placeholder="sample-events"` on the panel and `data-demo` on every
 * row, which is what keeps it from being mistakable for the real thing
 * (DEC-0068 rule 1).
 */
export async function SampleStageCalendar({ locale, place, sample }: SampleStageCalendarProps) {
  "use cache";
  cacheLife("days");
  return <StageCalendar locale={locale} place={place} provenance="sample" rows={rowsFromSample(sample)} />;
}

export interface LiveStageCalendarProps extends SampleStageCalendarProps {
  /** The live example's own slug, resolved outside the cache boundary. */
  readonly slug: string;
}

/**
 * The live panel: three real rows of the covered place the live example
 * anchors on, and the artifact's marked sample wherever that is not
 * available — an unresolvable slug, an upstream that answers fewer than the
 * three rows the square panel shows, or a mocked envelope, which is a sample
 * by definition and says so through `provenance`.
 */
export async function LiveStageCalendar({
  slug,
  locale,
  place,
  sample,
}: LiveStageCalendarProps) {
  "use cache";
  cacheLife(cacheLifeProfile("dates"));
  cacheTag(cacheTags.dates(slug));

  const envelope = await placeEvents({ slug, window: "upcoming", rowCount: 3 });
  const items = envelope === undefined ? [] : toListItems(envelope.data.events, locale);

  if (envelope === undefined || items.length < 3) {
    return <StageCalendar locale={locale} place={place} provenance="sample" rows={rowsFromSample(sample)} />;
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
      place={envelope.data.place.name}
      provenance={envelope.demo ? "sample" : "live"}
      rows={[one, two, three]}
    />
  );
}
