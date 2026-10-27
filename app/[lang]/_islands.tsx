"use client";

/**
 * The live-data islands — TS-WEB-0009 D1/D2/D3 as amended by DEC-0163.
 *
 * Until DEC-0163 each island was a `use cache` server component with a
 * five-minute `cacheLife`: the page's HTML regenerated with every new date,
 * the inline RSC flight payload changed with it, and its hash was in no
 * build-time CSP set — `/mitmachen` stopped hydrating 5½ minutes after a
 * deploy (#59). Now every island is a **client** component:
 *
 *  - in the prerendered HTML it is its frame at the final geometry — the
 *    title where it is known without data, the skeleton rows at the count the
 *    module's role allows, the onward link where its target is known — so
 *    the static document is the same on every request and nothing moves when
 *    the data lands (TS-WEB-0009 D7, `e2e/layout-stability.spec.ts`);
 *  - after hydration it asks this site's own BFF route (`src/lib/live/browser.ts`),
 *    which still does the upstream call, the three tiers and the CDN
 *    `Cache-Control` of TS-WEB-0003 D5;
 *  - an answer renders exactly what the server island rendered: the same
 *    shell, the same `state`/`tier`/`updatedAt`, the same conversion
 *    binding. No answer removes the module (TS-WEB-0009 D6), never an error.
 *
 * Live dates are not indexed content (owner, 2026-10-13); every other part of
 * a page stays in its static HTML.
 */

import { ConversionTracker, type ConversionBinding } from "@/src/components/conversion-tracker/conversion-tracker";
import { EventList } from "@/src/components/event-list/event-list";
import { LiveCounters } from "@/src/components/live-counters/live-counters";
import { LiveModuleFrame } from "@/src/components/live-module-frame/live-module-frame";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { PlaceExampleSet } from "@/src/components/place-example-set/place-example-set";
import { Skeleton } from "@/src/components/skeleton/skeleton";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { calendarUrl, type CalendarPlace } from "@/src/lib/live/app-handover";
import { liveRoutes, useLive, type LiveLoad } from "@/src/lib/live/browser";
import { countyLabel } from "@/src/lib/live/county-label";
import { NEARBY_RADIUS_KM } from "@/src/lib/live/widening";
import { fillTemplate } from "@/src/lib/pages/demo-content";
import { pickStoryExamples } from "@/src/lib/pages/story-examples";

import { stateOf, tierOf, toListItems } from "./_live-items";

import type { EventCategory } from "@/src/components/event-row/event-row";
import type { EventListItem, EventListRole } from "@/src/components/event-list/event-list";
import type { Locale } from "@/src/lib/i18n/locales";
import type { LiveCounters as LiveCountersData, NearbyEvents, PlaceEvents, RegionExamples } from "@/src/lib/live/types";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

/** The loading body of an event module: the frame's geometry, no spinner. */
export function moduleSkeleton(rowCount: number): ReactNode {
  return <Skeleton rows={rowCount} variant="row" />;
}

/** A handover link, armed with the module's goal when it has one (TS-WEB-0012 D4). */
function CalendarLink({
  place,
  label,
  dataCta,
  conversion,
  locale,
}: {
  /** The resolved place — its slug and geoname id make the address (DEC-0168 §5). */
  readonly place: CalendarPlace;
  readonly label: string;
  readonly dataCta?: string;
  readonly conversion?: ConversionBinding;
  /** The language of the new-tab note the calendar link carries (DEC-0169). */
  readonly locale?: Locale;
}) {
  const slug = place.slug;
  const href = calendarUrl(place);
  if (href === undefined) return null;
  const link = (
    <OutboundLink dataCta={dataCta} href={href} locale={locale} variant="secondary">
      {label}
    </OutboundLink>
  );
  if (conversion === undefined) return link;
  return (
    <ConversionTracker
      attributes={{ ...conversion.attributes, place: slug }}
      goalId={conversion.goalId}
      stage={conversion.stage}
    >
      {link}
    </ConversionTracker>
  );
}

/* ------------------------------------------------------------------ */
/* Position 1 — the dates of one place                                 */
/* ------------------------------------------------------------------ */

export interface PlaceDatesIslandProps {
  /**
   * A geo-api slug. `undefined` while the page does not know the place yet —
   * the module then stays in its loading frame and asks nothing.
   */
  readonly slug: string | undefined;
  /**
   * The place's geoname id where the page knows it without asking — with
   * `slug`, the calendar link of the loading frame (DEC-0168 §5). The
   * answered frame takes both from the envelope's own place.
   */
  readonly communityId?: string;
  /**
   * `true` while the page's place is not established (DEC-0168): the frame
   * stands exactly as prerendered and nothing is asked, so no other place's
   * rows fill it in the meantime.
   */
  readonly held?: boolean;
  /**
   * The place's name where the page knows it without asking — the showcase
   * community, or a place the page already resolved. It fills the title and
   * lets the onward link stand in the loading frame, so the frame does not
   * grow when the rows land.
   */
  readonly placeName?: string;
  readonly locale: Locale;
  /** The module's own heading, already naming its radius. `{place}` is filled in. */
  readonly titleTemplate: string;
  readonly rowCount?: number;
  /**
   * The list's role, which caps its rows (polish brief G-2): `illustrative`
   * three, `answering` five, `story` one.
   */
  readonly role?: EventListRole;
  readonly tone?: "light" | "dark";
  readonly headingLevel?: "h2" | "h3";
  /** Forwarded to `live-module-frame`: `split` is head 1–4, list 5–12 from `xl`. */
  readonly layout?: "stack" | "split";
  /** Read, not seen — where the block above already carries this sentence as the page's `h1`. */
  readonly titleHidden?: boolean;
  /**
   * Which categories a **story-capped** module would rather show, best
   * first. Ignored unless the list is capped to one row; position 1 stays
   * chronological, always.
   */
  readonly prefer?: readonly EventCategory[];
  /** The app handover's label. `{place}` is filled in; omitted means no CTA. */
  readonly ctaTemplate?: string;
  /** The conversion marker for the module's own handover (G-5). */
  readonly ctaDataCta?: string;
  /** `true` where arriving content changes the page's meaning (`/dein-ort`). */
  readonly announced?: boolean;
  /** The goal this module's app handover completes (TS-WEB-0012 D4). */
  readonly conversion?: ConversionBinding;
}

export function PlaceDatesIsland({
  slug,
  communityId,
  held = false,
  placeName,
  locale,
  titleTemplate,
  rowCount = 3,
  role,
  tone,
  headingLevel = "h2",
  titleHidden = false,
  layout = "stack",
  prefer,
  ctaTemplate,
  ctaDataCta,
  announced = false,
  conversion,
}: PlaceDatesIslandProps) {
  // A module that gets to choose its row has to be given more than one to
  // choose from: `prefer` picks out of the window, so it asks for the window.
  const asked = prefer === undefined ? rowCount : Math.max(rowCount, 12);
  const load = useLive<PlaceEvents>(slug === undefined || held ? undefined : liveRoutes.placeEvents(slug, asked));

  // An unresolved place is a different page state entirely, never an empty
  // module (`src/lib/live/README.md`). The page's own shell already stands.
  if (load.status === "absent") return null;

  if (load.status === "loading") {
    const name = placeName ?? "";
    return (
      <LiveModuleFrame
      reserveMarks
        announced={announced}
        cta={
          ctaTemplate !== undefined && slug !== undefined && communityId !== undefined && placeName !== undefined ? (
            <CalendarLink
              conversion={conversion}
              dataCta={ctaDataCta}
              label={fillTemplate(ctaTemplate, { place: name })}
              locale={locale}
              place={{ slug, communityId }}
            />
          ) : undefined
        }
        headingLevel={headingLevel}
        layout={layout}
        locale={locale}
        skeleton={<EventList items={[]} locale={locale} reserve role={role} rowCount={rowCount} state="loading" />}
        state="loading"
        title={fillTemplate(titleTemplate, { place: name })}
        titleHidden={titleHidden}
      >
        {null}
      </LiveModuleFrame>
    );
  }

  const { envelope } = load;
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
      reserveMarks
      layout={layout}
      announced={announced || data.publishInvitation}
      cta={
        ctaTemplate === undefined ? undefined : (
          <CalendarLink
            conversion={conversion}
            dataCta={ctaDataCta}
            label={fillTemplate(ctaTemplate, { place: data.place.name })}
            locale={locale}
            place={data.place}
          />
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
        items={items}
        locale={locale}
        reserve
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
  /** The coordinate the radius is drawn around; `undefined` while the page does not know it. */
  readonly point: { readonly lat: number; readonly lng: number } | undefined;
  /**
   * The covered community the coordinate belongs to — the calendar link's
   * target. A resolved place, never one assembled from a request value
   * (TS-WEB-0008 D9).
   */
  readonly anchor?: CalendarPlace;
  readonly locale: Locale;
  /** Names its own radius — never the place name (TS-WEB-0008 D1). `{radius}` is the km figure. */
  readonly titleTemplate: string;
  readonly rowCount?: number;
  /** The list's role, which caps its rows (G-2) — position 2 is the `answering` five. */
  readonly role?: EventListRole;
  readonly headingLevel?: "h2" | "h3";
  /** The goal this module's calendar link completes (TS-WEB-0012 D4). */
  readonly conversion?: ConversionBinding;
}

export function NearbyIsland({
  point,
  anchor,
  locale,
  titleTemplate,
  rowCount = 5,
  role,
  headingLevel = "h2",
  conversion,
}: NearbyIslandProps) {
  const load = useLive<NearbyEvents>(point === undefined ? undefined : liveRoutes.nearby(point.lat, point.lng));
  if (load.status === "absent") return null;

  const cta =
    anchor === undefined ? undefined : (
      <CalendarLink
        conversion={conversion}
        label={dictionary(locale).live.allDates}
        locale={locale}
        place={anchor}
      />
    );

  if (load.status === "loading") {
    return (
      <LiveModuleFrame
      reserveMarks
        cta={cta}
        headingLevel={headingLevel}
        locale={locale}
        skeleton={
          <EventList items={[]} locale={locale} reserve="loading" role={role} rowCount={rowCount} state="loading" />
        }
        state="loading"
        title={fillTemplate(titleTemplate, { radius: String(NEARBY_RADIUS_KM) })}
      >
        {null}
      </LiveModuleFrame>
    );
  }

  const { envelope } = load;
  const { data, fetchedAt } = envelope;
  // TS-WEB-0008 D1: zero rows nearby removes the module rather than showing an
  // empty list — the page's other blocks carry the screen.
  if (data.events.length === 0) return null;

  return (
    <LiveModuleFrame
      reserveMarks
      cta={cta}
      headingLevel={headingLevel}
      locale={locale}
      state={stateOf(envelope)}
      tier={tierOf(envelope)}
      title={
        // TS-WEB-0008 D3 as amended 2026-10-27 (issue #83): the list is filled
        // with the dates after this week where the week is thin, and then its
        // heading says so instead of claiming a week its rows leave.
        data.window === "upcoming"
          ? dictionary(locale).live.nearbyUpcoming
          : fillTemplate(titleTemplate, { radius: String(data.radiusKm) })
      }
      updatedAt={fetchedAt}
    >
      <EventList
        items={toListItems(data.events, locale)}
        locale={locale}
        // The skeleton reserves the five rows; the answer takes the height of
        // the rows it has. This list stands below the fold, so the collapse is
        // no visible shift — and a kept reserve was empty space (issue #83).
        reserve="loading"
        role={role}
        rowCount={rowCount}
        state={stateOf(envelope)}
      />
    </LiveModuleFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Position 3 — active example places in a county (DEC-0034)            */
/* ------------------------------------------------------------------ */

export interface RegionExamplesIslandProps {
  readonly county: string;
  readonly locale: Locale;
  /** `{county}` is filled in — with a written-out label, never an id (F-2-73). */
  readonly titleTemplate: string;
  readonly max?: number;
  readonly headingLevel?: "h2" | "h3";
}

export function RegionExamplesIsland({
  county,
  locale,
  titleTemplate,
  max = 6,
  headingLevel = "h2",
}: RegionExamplesIslandProps) {
  const load = useLive<RegionExamples>(liveRoutes.regionExamples(county, max));
  if (load.status === "absent") return null;

  if (load.status === "loading") {
    return (
      <LiveModuleFrame
      reserveMarks
        headingLevel={headingLevel}
        locale={locale}
        skeleton={<PlaceExampleSet examples={[]} locale={locale} max={max} reserve state="loading" />}
        state="loading"
        title={fillTemplate(titleTemplate, { county: countyLabel(county, locale) })}
      >
        {null}
      </LiveModuleFrame>
    );
  }

  const { envelope } = load;
  const { data, fetchedAt } = envelope;
  // DEC-0034: a designed set, never a place list — and absent, never empty.
  if (data.examples.length === 0) return null;

  return (
    <LiveModuleFrame
      reserveMarks
      headingLevel={headingLevel}
      locale={locale}
      state={stateOf(envelope)}
      tier={tierOf(envelope)}
      // F-2-73: `data.county` is geo-api's identifier, not a name —
      // `countyLabel` answers a label or the language's generic phrase.
      title={fillTemplate(titleTemplate, { county: countyLabel(data.county, locale) })}
      updatedAt={fetchedAt}
    >
      <PlaceExampleSet
        examples={data.examples.map((example) => ({
          label: example.name,
          to: "place" as RouteId,
          query: { ort: example.slug },
        }))}
        locale={locale}
        max={max}
        reserve
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
  /** Only the figures this surface is allowed to claim (TS-WEB-0008 D8, FUN-WEB-0041). */
  readonly show?: readonly ("dates" | "places" | "updatesToday")[];
  readonly className?: string;
}

export function CountersIsland({ locale, show = ["dates", "places", "updatesToday"], className }: CountersIslandProps) {
  return <CountersView className={className} load={useLive<LiveCountersData>(liveRoutes.stats())} locale={locale} show={show} />;
}

/**
 * What the counters band renders for one load state — the island's whole
 * branch, separate from the fetch so the chain from `/api/stats` to the page
 * can be rendered in a test (TS-WEB-0018-A12).
 */
export function CountersView({
  load,
  locale,
  show = ["dates", "places", "updatesToday"],
  className,
}: CountersIslandProps & { readonly load: LiveLoad<LiveCountersData> }) {
  // TS-WEB-0009 D6: both fallback tiers exhausted removes the band (`/api/stats`
  // answers 204). Never a zero, never an estimate.
  if (load.status === "absent") return null;
  if (load.status === "loading") {
    return <LiveCounters className={className} loadingSlots={show.length} locale={locale} state="loading" />;
  }

  const { envelope } = load;
  const wanted = new Set(show);

  return (
    <LiveCounters
      className={className}
      dates={wanted.has("dates") ? envelope.data.dates : undefined}
      locale={locale}
      places={wanted.has("places") ? envelope.data.places : undefined}
      state={stateOf(envelope)}
      updatesToday={wanted.has("updatesToday") ? envelope.data.updatesToday : undefined}
    />
  );
}
