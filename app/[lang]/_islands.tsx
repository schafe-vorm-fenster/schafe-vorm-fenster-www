/**
 * The live-data islands — TS-009 D1/D2/D3, one module per file section.
 *
 * TS-009 D1 splits every page into a **prerendered shell** and a set of
 * **cached islands**. This file is the islands: each one is a `use cache`
 * component that calls exactly one interface module of `src/lib/live/`,
 * reads its envelope, and renders the module's shell in the state the
 * envelope dictates (`src/lib/live/README.md` → "The three tiers, and the
 * state each shell receives").
 *
 * Three rules the shapes below enforce rather than document:
 *
 *  - **A request value never enters an island.** `?ort=` and every header
 *    are read in the page, outside the cache boundary, and handed down as a
 *    prop (TS-009 D2). An island takes strings and numbers, which is also
 *    what makes the prop set the cache key.
 *  - **`cacheLife` and `cacheTag` come from one table.** The numbers are
 *    TS-003 D5's, in `src/lib/live/cache-profiles.ts`, and the BFF routes
 *    send the same two numbers as `Cache-Control` — an island and its route
 *    cannot disagree about what "5 minutes" means.
 *  - **A module that has nothing is removed, never zeroed** (TS-009 D6).
 *    Counters answer `undefined` when both fallback tiers are exhausted, and
 *    `null` is what this file returns for that.
 *
 * Every island is rendered inside a `<Suspense>` whose fallback is the
 * module's own skeleton at its final geometry (TS-009 D7) — `moduleSkeleton`
 * below builds it, so the shell and the island cannot drift apart.
 */

import { cacheLife, cacheTag } from "next/cache";

import { Button } from "@/src/components/button/button";
import {
  ConversionTracker,
  type ConversionBinding,
} from "@/src/components/conversion-tracker/conversion-tracker";
import { EmptyStateBlock } from "@/src/components/empty-state-block/empty-state-block";
import { EventList } from "@/src/components/event-list/event-list";
import { LiveCounters } from "@/src/components/live-counters/live-counters";
import { LiveModuleFrame } from "@/src/components/live-module-frame/live-module-frame";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { PlaceExampleSet } from "@/src/components/place-example-set/place-example-set";
import { Skeleton } from "@/src/components/skeleton/skeleton";
import { OG_LOCALE } from "@/src/lib/i18n/locales";
import { fillTemplate } from "@/src/lib/pages/demo-content";
import { pickStoryExamples } from "@/src/lib/pages/story-examples";
import { calendarUrl } from "@/src/lib/live/app-handover";
import { cacheLifeProfile, cacheTags } from "@/src/lib/live/cache-profiles";
import { categoryLabel, categoryTone } from "@/src/lib/live/categories";
import { nearestPlace } from "@/src/lib/live/place-index";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { liveCounters } from "@/src/lib/live/counters";
import { nearbyEvents } from "@/src/lib/live/nearby";
import { placeEvents } from "@/src/lib/live/places";
import { countyLabel } from "@/src/lib/live/county-label";
import { regionExamples } from "@/src/lib/live/region";

import type { EventCategory } from "@/src/components/event-row/event-row";
import type { EventListItem, EventListRole } from "@/src/components/event-list/event-list";
import type { DataState } from "@/src/components/data-state";
import type { Locale } from "@/src/lib/i18n/locales";
import type { LiveEnvelope, LiveEvent } from "@/src/lib/live/types";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

/**
 * Envelope → the `state` a shell takes. One function, so no page re-derives
 * the badge or the freshness rule (`src/lib/live/README.md`'s table).
 */
export function stateOf(envelope: {
  readonly stale: boolean;
  readonly demo: boolean;
}, empty = false): DataState {
  if (empty) return "empty";
  if (envelope.stale) return "degraded";
  if (envelope.demo) return "mocked";
  return "ready";
}

/** Tier 2 and tier 3 render different words; tier 1 renders none. */
function tierOf(envelope: LiveEnvelope<unknown>): "stale" | "snapshot" {
  return envelope.tier === "snapshot" ? "snapshot" : "stale";
}

/** `LiveEvent` → the row shape `event-list` takes. The one mapping (TS-005 owns the vocabulary). */
export function toListItems(
  events: readonly LiveEvent[],
  locale: Locale,
): EventListItem[] {
  const time = new Intl.DateTimeFormat(OG_LOCALE[locale].replace("_", "-"), {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  });
  return events.map((event) => {
    const category = categoryTone(event.categoryId);
    const starts = new Date(event.startsAt);
    const clock = Number.isNaN(starts.getTime()) ? undefined : time.format(starts);
    return {
      id: event.id,
      date: event.startsAt,
      title: event.title,
      // Every row names its own place — the rule that lets a widened module
      // stand beside a narrow one without lying (TS-008 D1). The place comes
      // **first**: the meta line is one line of 76 px and ellipsises at its
      // end, and with the clock in front a row from the next village over
      // read "13:…" on a phone — the one word the rule is about, cut.
      meta: [event.placeName, clock].filter(Boolean).join(" · "),
      category,
      categoryLabel: categoryLabel(event.categoryId, locale),
    };
  });
}

/** The `<Suspense>` fallback of an event module: the frame's geometry, no spinner. */
export function moduleSkeleton(rowCount: number): ReactNode {
  return <Skeleton rows={rowCount} variant="row" />;
}

/* ------------------------------------------------------------------ */
/* Position 1 — the dates of one place                                 */
/* ------------------------------------------------------------------ */

export interface PlaceDatesIslandProps {
  /** A geo-api slug, resolved outside the cache boundary (TS-009 D2). */
  readonly slug: string;
  readonly locale: Locale;
  /** The module's own heading, already naming its radius. `{place}` is filled in. */
  readonly titleTemplate: string;
  readonly rowCount?: number;
  /**
   * The list's role, which caps its rows (polish brief G-2): `illustrative`
   * three, `answering` five, `story` one. The module may ask its source for
   * more dates than it is allowed to print; the rest stay behind the
   * calendar link.
   */
  readonly role?: EventListRole;
  readonly tone?: "light" | "dark";
  readonly headingLevel?: "h2" | "h3";
  /** Read, not seen — where the block above already carries this sentence as the page's `h1`. */
  readonly titleHidden?: boolean;
  /**
   * Which categories a **story-capped** module would rather show, best
   * first. A list of one row is an illustration, and the next date in the
   * window is not always one: "a place like yours has something in it"
   * illustrated by a bin collection is an argument against itself. Ignored
   * unless the list is capped to one row, where order is not the module's
   * promise; position 1 stays chronological, always.
   */
  readonly prefer?: readonly EventCategory[];
  /** The app handover's label. `{place}` is filled in; omitted means no CTA. */
  readonly ctaTemplate?: string;
  /**
   * The conversion marker for the module's own handover, where the page's
   * primary conversion *is* this link — on `/dein-ort` in state A the hero
   * above carries the place name and the offer sits under the three rows, so
   * the marker travels with it (G-5). A string, never a node: an island's
   * props are its cache key.
   */
  readonly ctaDataCta?: string;
  /** `true` where arriving content changes the page's meaning (`/dein-ort`). */
  readonly announced?: boolean;
  /**
   * The goal this module's app handover completes (TS-012 D4). The island
   * arms the link itself and adds the resolved place slug as the one
   * attribute — a slug is fine, a form value is not (D4 rule 3).
   */
  readonly conversion?: ConversionBinding;
  /**
   * The publish invitation of TS-008 D4, as the page's own copy — **strings
   * only**. A cached component's props are its cache key, so a `ReactNode`
   * here would be a non-serializable argument ("Unexpected cache miss after
   * cache warming phase"); the island builds the button itself.
   */
  readonly invitation?: {
    readonly headline: string;
    readonly lead?: string;
    readonly ctaLabel: string;
    readonly ctaTo: RouteId;
  };
}

export async function PlaceDatesIsland({
  slug,
  locale,
  titleTemplate,
  rowCount = 3,
  role,
  tone,
  headingLevel = "h2",
  titleHidden = false,
  prefer,
  ctaTemplate,
  ctaDataCta,
  announced = false,
  conversion,
  invitation,
}: PlaceDatesIslandProps) {
  "use cache";
  cacheLife(cacheLifeProfile("dates"));
  cacheTag(cacheTags.dates(slug));

  // A module that gets to choose its row has to be given more than one to
  // choose from: `prefer` picks out of the window, so it asks for the window
  // rather than for the single row it prints.
  const envelope = await placeEvents({
    slug,
    window: "upcoming",
    rowCount: prefer === undefined ? rowCount : Math.max(rowCount, 12),
  });
  // An unresolved place is a different page state entirely, never an empty
  // module (`src/lib/live/README.md`). The page's own shell already stands.
  if (envelope === undefined) return null;

  const { data, fetchedAt } = envelope;
  const empty = data.events.length === 0;
  const title = fillTemplate(titleTemplate, { place: data.place.name });
  const items =
    role === "story" && prefer !== undefined
      ? pickStoryExamples(toListItems(data.events, locale), [prefer]).filter(
          (item): item is EventListItem => item !== undefined,
        )
      : toListItems(data.events, locale);

  return (
    <LiveModuleFrame
      announced={announced || data.publishInvitation}
      cta={
        // State B suppresses the calendar handover: a covered place with no
        // dates shifts the focus job to publishing (TS-008 D4, TS-020 D2),
        // and an "open the calendar" link beside "nothing is in it yet" is
        // the one offer that state must not carry.
        ctaTemplate === undefined || (empty && invitation !== undefined) ? undefined : conversion === undefined ? (
          <OutboundLink dataCta={ctaDataCta} href={calendarUrl(data.place)} variant="secondary">
            {fillTemplate(ctaTemplate, { place: data.place.name })}
          </OutboundLink>
        ) : (
          <ConversionTracker
            attributes={{ ...conversion.attributes, place: data.place.slug }}
            goalId={conversion.goalId}
            stage={conversion.stage}
          >
            <OutboundLink dataCta={ctaDataCta} href={calendarUrl(data.place)} variant="secondary">
              {fillTemplate(ctaTemplate, { place: data.place.name })}
            </OutboundLink>
          </ConversionTracker>
        )
      }
      headingLevel={headingLevel}
      locale={locale}
      state={stateOf(envelope)}
      tier={tierOf(envelope)}
      title={title}
      titleHidden={titleHidden}
      updatedAt={fetchedAt}
    >
      <EventList
        emptyState={
          invitation === undefined ? undefined : (
            <EmptyStateBlock
              // The frame already carries `role="status"` (`announced`), and
              // the shift is announced **once** — `empty-state-block`'s own
              // contract for exactly this case.
              announced={false}
              cta={
                <Button locale={locale} onward to={invitation.ctaTo} variant="primary-light">
                  {invitation.ctaLabel}
                </Button>
              }
              headline={fillTemplate(invitation.headline, { place: data.place.name })}
              lead={invitation.lead}
            />
          )
        }
        items={items}
        locale={locale}
        role={role}
        rowCount={rowCount}
        state={empty ? "empty" : stateOf(envelope)}
        tone={tone}
      />
    </LiveModuleFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Position 2 — this week nearby                                       */
/* ------------------------------------------------------------------ */

export interface NearbyIslandProps {
  readonly lat: number;
  readonly lng: number;
  readonly locale: Locale;
  /** Names its own radius — never the place name (TS-008 D1). `{radius}` is the km figure. */
  readonly titleTemplate: string;
  readonly rowCount?: number;
  /** The list's role, which caps its rows (G-2) — position 2 is the `answering` five. */
  readonly role?: EventListRole;
  readonly headingLevel?: "h2" | "h3";
  /**
   * The goal this module's calendar link completes (TS-012 D4: *every* click
   * that opens a place calendar on `app.*`). Position 2's own link went
   * unarmed, so one of the four handovers on `/dein-ort` fired nothing —
   * measured, not reviewed.
   */
  readonly conversion?: ConversionBinding;
}

export async function NearbyIsland({
  lat,
  lng,
  locale,
  titleTemplate,
  rowCount = 5,
  role,
  headingLevel = "h2",
  conversion,
}: NearbyIslandProps) {
  "use cache";
  cacheLife(cacheLifeProfile("dates"));
  cacheTag(cacheTags.places());

  const envelope = await nearbyEvents({ lat, lng, rowCount });
  const { data, fetchedAt } = envelope;
  // TS-008 D1: zero rows nearby removes the module rather than showing an
  // empty list — the page's other blocks carry the screen.
  if (data.events.length === 0) return null;

  // The list is an example, not the calendar: three rows on a phone, five on
  // a desktop, and the rest behind one handover. The link is built from the
  // covered community the coordinate sits in — a `Place` out of the community
  // index, never a slug assembled from a request value (TS-008 D9).
  const anchor = nearestPlace({ lat, lng });

  return (
    <LiveModuleFrame
      cta={
        anchor === undefined ? undefined : conversion === undefined ? (
          <OutboundLink href={calendarUrl(anchor)} variant="secondary">
            {dictionary(locale).live.allDates}
          </OutboundLink>
        ) : (
          <ConversionTracker
            attributes={{ ...conversion.attributes, place: anchor.slug }}
            goalId={conversion.goalId}
            stage={conversion.stage}
          >
            <OutboundLink href={calendarUrl(anchor)} variant="secondary">
              {dictionary(locale).live.allDates}
            </OutboundLink>
          </ConversionTracker>
        )
      }
      headingLevel={headingLevel}
      locale={locale}
      state={stateOf(envelope)}
      tier={tierOf(envelope)}
      title={fillTemplate(titleTemplate, { radius: String(data.radiusKm) })}
      updatedAt={fetchedAt}
    >
      <EventList
        capOnPhone
        items={toListItems(data.events, locale)}
        locale={locale}
        role={role}
        rowCount={rowCount}
        state={stateOf(envelope)}
      />
    </LiveModuleFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Position 3 — active example places in a county (DEC-034)            */
/* ------------------------------------------------------------------ */

export interface RegionExamplesIslandProps {
  readonly county: string;
  readonly locale: Locale;
  /** `{county}` is filled in — with a written-out label, never an id (F-2-73). */
  readonly titleTemplate: string;
  readonly max?: number;
  readonly headingLevel?: "h2" | "h3";
}

export async function RegionExamplesIsland({
  county,
  locale,
  titleTemplate,
  max = 6,
  headingLevel = "h2",
}: RegionExamplesIslandProps) {
  "use cache";
  cacheLife(cacheLifeProfile("activePlaces"));
  cacheTag(cacheTags.placesInCounty(county));

  const envelope = await regionExamples({ county, max });
  const { data, fetchedAt } = envelope;
  // DEC-034: a designed set, never a place list — and absent, never empty.
  if (data.examples.length === 0) return null;

  return (
    <LiveModuleFrame
      headingLevel={headingLevel}
      locale={locale}
      state={stateOf(envelope)}
      tier={tierOf(envelope)}
      // F-2-73: `data.county` is geo-api's identifier, not a name. Filling
      // the slot with it put "examples from geoname.900001" in block 3's
      // heading on `/en/your-region`. `countyLabel` answers a label or the
      // language's generic phrase — an id can no longer reach a heading.
      title={fillTemplate(titleTemplate, { county: countyLabel(data.county, locale) })}
      updatedAt={fetchedAt}
    >
      <PlaceExampleSet
        examples={data.examples.map((example) => ({
          label: example.name,
          to: "place" as const,
          query: { ort: example.slug },
        }))}
        locale={locale}
        max={max}
        state={stateOf(envelope)}
      />
    </LiveModuleFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Position 4 — the live counters                                      */
/* ------------------------------------------------------------------ */

export interface CountersIslandProps {
  readonly locale: Locale;
  /** Only the figures this surface is allowed to claim (TS-008 D8, WEB-F-041). */
  readonly show?: readonly ("dates" | "places" | "updatesToday")[];
  readonly className?: string;
}

export async function CountersIsland({
  locale,
  show = ["dates", "places", "updatesToday"],
  className,
}: CountersIslandProps) {
  "use cache";
  cacheLife(cacheLifeProfile("counters"));
  cacheTag(cacheTags.stats());

  const envelope = await liveCounters();
  // TS-009 D6: both fallback tiers exhausted removes the band. Never a zero,
  // never an estimate.
  if (envelope === undefined) return null;

  const { data } = envelope;
  const wanted = new Set(show);

  return (
    <LiveCounters
      className={className}
      dates={wanted.has("dates") ? data.dates : undefined}
      locale={locale}
      places={wanted.has("places") ? data.places : undefined}
      state={stateOf(envelope)}
      updatesToday={wanted.has("updatesToday") ? data.updatesToday : undefined}
    />
  );
}

/**
 * The example rows a static block borrows from the live modules — the
 * "snapshot rung of the example ladder" of TS-020 D3, where a value story
 * shows one real row instead of an invented one.
 *
 * Cached, not suspended: the rows stand *inside* prose, so a skeleton there
 * would read as a broken paragraph rather than as arriving data.
 */
export async function exampleRows(
  slug: string,
  lat: number,
  lng: number,
  locale: Locale,
): Promise<{
  readonly place: readonly EventListItem[];
  readonly nearby: readonly EventListItem[];
  readonly demo: boolean;
}> {
  "use cache";
  cacheLife(cacheLifeProfile("dates"));
  cacheTag(cacheTags.dates(slug));

  // More rows than any one module prints: `/dein-ort` shows three of the
  // place's dates at position 1 and five nearby in story 4, and the value
  // stories pick their own example out of what is left — a story that
  // repeats a row the reader has just scrolled past is not an example, it
  // is the same list again (polish brief, page 2).
  const [dates, near] = await Promise.all([
    placeEvents({ slug, window: "upcoming", rowCount: 12 }),
    nearbyEvents({ lat, lng, rowCount: 12 }),
  ]);

  return {
    place: dates === undefined ? [] : toListItems(dates.data.events, locale),
    nearby: toListItems(near.data.events, locale),
    demo: (dates?.demo ?? false) || near.demo,
  };
}
