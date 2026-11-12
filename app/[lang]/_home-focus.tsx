"use client";

/**
 * Block 1 of `/` in TS-WEB-0019 D2's states — read in the browser since
 * DEC-0163.
 *
 * D2 keys block 1 on what is known about the place. Until DEC-0163 the page
 * read `?ort=` on the server inside three `<Suspense>` boundaries, which made
 * every load of `/` a per-request render whose streamed RSC payload no
 * build-time CSP hash could cover (#59). The page is static now: its HTML is
 * **S1** — "what is prerendered and what a crawler and a JS-less visitor get"
 * (D2, TS-WEB-0010 D8) — and these three components move it to S2/S3 once
 * `place-state.ts` has an answer. They render through the same functions in
 * every state, so the reserved space cannot drift between them.
 *
 * Since issue 143 (DEC-0194) the stage carries no place search of its own: the
 * search moved into "Dein digitaler Dorfkalender." (`DorfkalenderIntro`), and
 * what is left here is the hero's trio and S3's module.
 */

import { Button } from "@/src/components/button/button";
import { ConversionTracker } from "@/src/components/conversion-tracker/conversion-tracker";
import { HeroContent, type HeroContentProps } from "@/src/components/hero-block/hero-block";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { calendarUrl } from "@/src/lib/live/app-handover";
import { useActivePlace } from "@/src/lib/pages/active-place";
import { fillTemplate } from "@/src/lib/pages/demo-content";

import { NearbyIsland } from "./_islands";
import { NearbySection, nearbyHead } from "./_nearby-section";


import type { Locale } from "@/src/lib/i18n/locales";
import type { Place } from "@/src/lib/live/types";

/**
 * TS-WEB-0012 D4 — `save-calendar-to-homescreen`, `stage: handover`: the click
 * that opens a place calendar on `app.*`. The page's own primary conversion.
 */
const SAVE_CALENDAR = { goalId: "save-calendar-to-homescreen", stage: "handover" } as const;

/** The copy block 1 needs in every state — strings only, they cross into the browser. */
export interface HomeFocusCopy {
  readonly locale: Locale;
  readonly s1Headline: string;
  /** S2 — `home-2-place-dates`: `{place}` headline and app-handover label. */
  readonly datesHeadline: string;
  readonly datesCta: string;
  /** S3 — `home-3-place-empty`: radius heading, invitation, publish label. */
  readonly nearbyHeading: string;
  readonly invitation: string;
  readonly publishCta: string;
}

/** The artifact writes the invitation as two sentences; the first is the headline. */
function splitInvitation(text: string): { headline: string; lead?: string } {
  const cut = text.indexOf(". ");
  if (cut === -1) return { headline: text };
  return { headline: text.slice(0, cut + 1).trim(), lead: text.slice(cut + 1).trim() };
}

/**
 * The state block 1 is in, off the page's one active place (DEC-0168): S1
 * until a place is **chosen**. `example` is the showcase community the module
 * speaks about while nobody has chosen one; `held` is everything before the
 * page knows which of the two it is — the prerendered frame, asking nothing.
 */
function useFocus(): {
  readonly place?: Place;
  readonly hasDates?: boolean;
  readonly example?: Place;
  readonly held: boolean;
} {
  const active = useActivePlace();
  if (active.kind === "chosen") {
    // Dates still loading reads as S2 — the place is known, and the module
    // below fills in; an empty answer moves on to S3.
    return { place: active.place, hasDates: active.dates.status === "known" ? active.dates.hasDates : true, held: false };
  }
  if (active.kind === "example") return { example: active.place, held: false };
  return { held: true };
}

function heroContentFor(copy: HomeFocusCopy, place?: Place, hasDates?: boolean): HeroContentProps {
  // S1 — nothing known. No CTA node: the search carries the page's primary.
  if (place === undefined) return { headline: copy.s1Headline };

  const values = { place: place.name };

  // S3 — covered, no dates. The primary conversion is publishing, and it is
  // a link: "on `/` the shift stays a link" (TS-WEB-0019 D2, open point 2).
  if (hasDates === false) {
    const invitation = splitInvitation(fillTemplate(copy.invitation, values));
    return {
      headline: invitation.headline,
      lead: invitation.lead,
      cta: (
        <Button
          dataCta="primary"
          locale={copy.locale}
          onward
          query={{ ort: place.slug }}
          to="register"
          variant="primary-light"
        >
          {copy.publishCta}
        </Button>
      ),
    };
  }

  // S2 — the app handover, carrying the place slug as its one attribute
  // (TS-WEB-0012 D4 rule 3).
  return {
    headline: fillTemplate(copy.datesHeadline, values),
    cta: (
      <ConversionTracker
        attributes={{ route: "home", place: place.slug }}
        goalId={SAVE_CALENDAR.goalId}
        stage={SAVE_CALENDAR.stage}
      >
        <OutboundLink dataCta="primary" href={calendarUrl(place) ?? ""} locale={copy.locale} variant="secondary">
          {fillTemplate(copy.datesCta, values)}
        </OutboundLink>
      </ConversionTracker>
    ),
  };
}

/** The hero's headline · lead · CTA trio. */
export function HomeHeroContent({ copy }: { readonly copy: HomeFocusCopy }) {
  const { place, hasDates } = useFocus();
  return <HeroContent {...heroContentFor(copy, place, hasDates)} />;
}

/**
 * Block 1's S3 module: "this week nearby" under a covered place that has no
 * dates of its own (TS-WEB-0019 D5, position 2 — block 1's **S3** module, and
 * only S3's). The ink section above it is no longer this file's: since issue 143 it
 * is "Dein digitaler Dorfkalender." (`DorfkalenderIntro`), the same section in
 * every state, so the page rhythm and TS-WEB-0019-A9's DOM order do not move
 * when the state does.
 */
export function HomeNearby({ copy }: { readonly copy: HomeFocusCopy }) {
  const { place, hasDates } = useFocus();
  const { locale } = copy;
  const emptyPlace = place !== undefined && hasDates === false ? place : undefined;

  return emptyPlace ? (
    <NearbySection>
      <NearbyIsland
        {...nearbyHead(locale)}
        anchor={emptyPlace}
        locale={locale}
        point={{ lat: emptyPlace.lat, lng: emptyPlace.lng }}
        role="answering"
        rowCount={5}
        titleTemplate={copy.nearbyHeading}
      />
    </NearbySection>
  ) : null;
}
