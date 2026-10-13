"use client";

/**
 * `/dein-ort`'s state-dependent parts — TS-WEB-0020 D2's states, resolved in
 * the browser since DEC-0163.
 *
 * The page is prerendered once: its HTML is **S0**, complete on its own —
 * search dominant, the stories, the band, the closing block (D2,
 * TS-WEB-0020-A10). When `?ort=` names a covered place, `place-state.ts`
 * establishes it after hydration and these components move the page to
 * **state A** (the place has dates) or **state B** (it has none: TS-WEB-0008
 * D4's publish offer). Each one renders the same component in every state,
 * so the frames stand where the HTML put them.
 *
 * Until DEC-0163 the page read `?ort=` on the server and blocked
 * (`instant = false`), which made every visit a per-request render whose
 * flight payload no build-time CSP hash could cover (#59). The rule that
 * `/dein-ort` works without JavaScript went with it — dropped by the owner on
 * 2026-10-13 (DEC-0163 §4): without JavaScript the page is S0 for every
 * `?ort=`, and the proxy's 307 still sends an uncovered value to the founding
 * page before any HTML is served (`place-hop.ts`, TS-WEB-0021-A7).
 */

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/src/components/button/button";
import { ClosingCta, ClosingCtaModule } from "@/src/components/closing-cta/closing-cta";
import { ConversionTracker } from "@/src/components/conversion-tracker/conversion-tracker";
import { EmptyStateBlock } from "@/src/components/empty-state-block/empty-state-block";
import { EventList } from "@/src/components/event-list/event-list";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { HowtoBlock } from "@/src/components/howto-block/howto-block";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { linkHref } from "@/src/components/route-link/href";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { calendarUrlForSlug } from "@/src/lib/live/app-handover";
import { liveRoutes, useLive } from "@/src/lib/live/browser";
import { SHOWCASE_COMMUNITY } from "@/src/lib/live/showcase";
import { fillTemplate, splitSteps } from "@/src/lib/pages/demo-content";
import { usePlaceState, type PlaceState } from "@/src/lib/pages/place-state";
import { selectStoryExamples } from "@/src/lib/pages/story-examples";

import { NearbyIsland, PlaceDatesIsland } from "../_islands";
import { toListItems } from "../_live-items";

import { STORIES } from "./stories";

import type { Locale } from "@/src/lib/i18n/locales";
import type { LiveEvent, NearbyEvents, Place, PlaceEvents } from "@/src/lib/live/types";
import type { ReactNode } from "react";

/**
 * TS-WEB-0012 D4 — `save-calendar-to-homescreen`, `stage: handover`: every click
 * that opens this place's calendar on `app.*`, fired by its own click.
 */
const SAVE_CALENDAR = { goalId: "save-calendar-to-homescreen", stage: "handover" } as const;

/** The anchor every live module speaks about: the stated place, else the showcase community. */
interface Anchor {
  readonly slug: string;
  readonly name: string;
  readonly lat: number;
  readonly lng: number;
}

const SHOWCASE_ANCHOR: Anchor = {
  slug: SHOWCASE_COMMUNITY.slug,
  name: SHOWCASE_COMMUNITY.name,
  lat: SHOWCASE_COMMUNITY.lat,
  lng: SHOWCASE_COMMUNITY.lng,
};

/** Which of D2's three states renders: S0, A or B. */
type PageState =
  | { readonly kind: "s0" }
  | { readonly kind: "a"; readonly place: Place }
  | { readonly kind: "b"; readonly place: Place };

function pageStateOf(state: PlaceState): PageState {
  if (state.kind !== "covered") return { kind: "s0" };
  // State B is TS-WEB-0008 D4's trigger — a covered place whose window is empty.
  return state.publishInvitation ? { kind: "b", place: state.place } : { kind: "a", place: state.place };
}

function usePageState(): PageState {
  return pageStateOf(usePlaceState());
}

function anchorOf(state: PageState): Anchor {
  return state.kind === "s0" ? SHOWCASE_ANCHOR : state.place;
}

/**
 * TS-WEB-0020 D2 row 5 and TS-WEB-0008 D7 row 3: an uncovered place is **not
 * this page**. The proxy hops before any HTML (`place-hop.ts`); this is the
 * second line for a client navigation that never passed through it.
 */
export function PlaceHop({ locale }: { readonly locale: Locale }) {
  const state = usePlaceState();
  const router = useRouter();
  const target = state.kind === "uncovered" ? linkHref("placeStart", { locale, query: { ort: state.query } }) : undefined;
  useEffect(() => {
    if (target !== undefined) router.replace(target);
  }, [router, target]);
  return null;
}

/** The copy every state needs — strings only, they cross into the browser. */
export interface PlaceCopy {
  readonly locale: Locale;
  /** S0's own headline (`dein-ort-0-state-s0`). */
  readonly s0Headline: string;
  /** State A's `{place}` headline — also the module's own title. */
  readonly aHeadline: string;
  /** State A's calendar handover label, `{place}` filled in. */
  readonly aCta: string;
  /** State B's `h1`, `{place}` filled in. */
  readonly bHeadline: string;
  readonly bCtaLabel: string;
  /** State B's offer line, over the button and in the closing block. */
  readonly bOffer: string;
  /** S0's hand-off from the search into the module. */
  readonly s0Transition?: string;
}

export interface PlaceHeroProps {
  readonly copy: PlaceCopy;
  /** S0's search — the page's primary conversion while no place is known. */
  readonly s0Search: ReactNode;
  /** State A's "search another place" (issue #23) — the same module, no primary marker. */
  readonly aSearch: ReactNode;
  readonly image: {
    readonly src?: string;
    readonly wideSrc?: string;
    readonly focal?: { readonly x: number; readonly y: number };
    readonly notDepicting?: boolean;
    readonly placeholderId?: string;
  };
}

/**
 * Block 1 — the focus block. The `h1` names the place in every state and at
 * the same DOM position (TS-WEB-0020 D5); S0 has its own authored sentence.
 */
export function PlaceHero({ copy, s0Search, aSearch, image }: PlaceHeroProps) {
  const state = usePageState();
  const headline =
    state.kind === "s0"
      ? copy.s0Headline
      : state.kind === "b"
        ? fillTemplate(copy.bHeadline, { place: state.place.name })
        : fillTemplate(copy.aHeadline, { place: state.place.name });

  return (
    <HeroBlock
      cta={state.kind === "s0" ? s0Search : undefined}
      focal={image.focal}
      headline={headline}
      id="focus-block"
      locale={copy.locale}
      notDepicting={image.notDepicting}
      placeholderId={image.placeholderId}
      search={state.kind === "a" ? aSearch : undefined}
      src={image.src}
      // `place-name` is the 50 px display role, right for "Das ist los in X";
      // S0's and state B's full sentences take the Display role instead.
      variant={state.kind === "a" ? "place-name" : undefined}
      wideSrc={image.wideSrc}
    />
  );
}

/**
 * Block 1's module slot: TS-WEB-0008 position 1. In state B the slot carries
 * the publish offer instead of an empty date box ("Position 1 is not left
 * blank", TS-WEB-0008 D4), and its marker is the page's primary conversion.
 */
export function PlaceModuleSlot({ copy }: { readonly copy: PlaceCopy }) {
  const state = usePageState();
  const words = dictionary(copy.locale);
  const anchor = anchorOf(state);

  return (
    <SectionShell
      id="place-dates"
      kicker={state.kind === "b" ? undefined : words.kickers.liveAnswer}
      surface="ink"
      transition={state.kind === "s0" ? copy.s0Transition : undefined}
    >
      {state.kind === "b" ? (
        <EmptyStateBlock
          announced
          cta={
            <Button
              dataCta="primary"
              locale={copy.locale}
              onward
              query={{ ort: state.place.slug }}
              to="register"
              variant="primary-light"
            >
              {copy.bCtaLabel}
            </Button>
          }
          headline={fillTemplate(copy.bOffer, { place: state.place.name }) || fillTemplate(copy.bHeadline, { place: state.place.name })}
        />
      ) : (
        <PlaceDatesIsland
          announced
          conversion={SAVE_CALENDAR}
          // S0 shows what an answer looks like — one row, no handover to a
          // place the visitor never asked about. State A answers, and its
          // handover is the page's conversion (G-5).
          ctaDataCta={state.kind === "s0" ? undefined : "primary"}
          ctaTemplate={state.kind === "s0" ? undefined : copy.aCta}
          locale={copy.locale}
          placeName={anchor.name}
          prefer={state.kind === "s0" ? ["social", "culture", "fest", "official"] : undefined}
          role={state.kind === "s0" ? "story" : "illustrative"}
          rowCount={state.kind === "s0" ? 1 : 3}
          slug={anchor.slug}
          titleHidden={state.kind !== "s0"}
          titleTemplate={copy.aHeadline}
          tone="dark"
        />
      )}
    </SectionShell>
  );
}

/** Story 4's example — TS-WEB-0008 position 2 around the page's anchor. */
export function PlaceNearby({ locale, titleTemplate }: { readonly locale: Locale; readonly titleTemplate: string }) {
  const anchor = anchorOf(usePageState());
  return (
    <NearbyIsland
      anchorSlug={anchor.slug}
      conversion={SAVE_CALENDAR}
      headingLevel="h3"
      locale={locale}
      point={{ lat: anchor.lat, lng: anchor.lng }}
      role="answering"
      rowCount={5}
      titleTemplate={titleTemplate}
    />
  );
}

/**
 * One story's live example (DEC-0152): picked out of the anchor's
 * surroundings, strictly by D3's category, never a row position 1 or story 4
 * already prints. Every story computes the same joint pick from the same
 * three answers (fetched once, `browser.ts`) and shows its own slot of it.
 */
export function StoryExample({ storyId, locale }: { readonly storyId: string; readonly locale: Locale }) {
  const anchor = anchorOf(usePageState());
  const dates = useLive<PlaceEvents>(liveRoutes.placeEvents(anchor.slug, 12));
  const near = useLive<NearbyEvents>(liveRoutes.nearby(anchor.lat, anchor.lng));
  const pool = useLive<{ readonly events: readonly LiveEvent[] }>(liveRoutes.placeExamples(anchor.slug));

  if (dates.status === "loading" || near.status === "loading" || pool.status === "loading") {
    return <EventList items={[]} locale={locale} reserve rowCount={1} state="loading" />;
  }
  if (pool.status !== "ready") return null;

  const shownRows = [
    ...(dates.status === "ready" ? toListItems(dates.envelope.data.events, locale).slice(0, 3) : []),
    ...(near.status === "ready" ? toListItems(near.envelope.data.events, locale).slice(0, 5) : []),
  ];
  const shown = new Set(shownRows.flatMap((row) => row.id ?? []));
  const rowStories = STORIES.flatMap((story) => (story.example === undefined ? [] : [story]));
  const picked = selectStoryExamples(
    pool.envelope.data.events,
    rowStories.map((story) => story.example!),
    shown,
  );
  const index = rowStories.findIndex((story) => story.id === storyId);
  const event = index === -1 ? undefined : picked[index];
  if (event === undefined) return null;
  const [item] = toListItems([event], locale);
  if (item === undefined) return null;

  return <EventList items={[item]} locale={locale} reserve rowCount={1} state={pool.envelope.demo ? "mocked" : "ready"} />;
}

export interface HomescreenCopy {
  readonly locale: Locale;
  readonly headline: string;
  readonly ios: string;
  readonly android: string;
  readonly ctaTemplate: string;
}

/**
 * TS-WEB-0020 D4 — the homescreen block, which names a place and links the
 * app: the stated place, or the showcase community in S0.
 */
export function PlaceHomescreen({ locale, headline, ios, android, ctaTemplate }: HomescreenCopy) {
  const anchor = anchorOf(usePageState());
  const appHref = calendarUrlForSlug(anchor.slug, { resolved: true }) ?? "";

  return (
    <HowtoBlock
      android={{ steps: splitSteps(fillTemplate(android, { place: anchor.name })) }}
      appHref={appHref}
      appLinkLabel={fillTemplate(ctaTemplate, { place: anchor.name })}
      // The iPhone steps stand open and Android is one tap away: both
      // instructions are in the DOM for every visitor, under every user agent.
      collapsed={["android"]}
      conversion={{ ...SAVE_CALENDAR, attributes: { place: anchor.slug } }}
      headline={headline}
      ios={{ steps: splitSteps(fillTemplate(ios, { place: anchor.name })) }}
      locale={locale}
    />
  );
}

/** Children that stand in state B only — the quiet "different place?" line. */
export function OnlyInStateB({ children }: { readonly children: ReactNode }) {
  return usePageState().kind === "b" ? <>{children}</> : null;
}

export interface PlaceClosingProps {
  readonly copy: PlaceCopy;
  /** The permanence promise (cleared content) and the module heading. */
  readonly reassurance?: string;
  readonly moduleHeading?: string;
  /** S0's closing search — the module repeated (TS-WEB-0006 D6). */
  readonly s0Search: ReactNode;
}

/** The closing block, in whichever state the page is in (G-6, TS-WEB-0006 D6). */
export function PlaceClosing({ copy, reassurance, moduleHeading, s0Search }: PlaceClosingProps) {
  const state = usePageState();

  if (state.kind === "b") {
    const offer = fillTemplate(copy.bOffer, { place: state.place.name });
    return (
      <ClosingCta
        heading={offer || undefined}
        label={copy.bCtaLabel}
        locale={copy.locale}
        query={{ ort: state.place.slug }}
        reassurance={reassurance}
        to="register"
      />
    );
  }

  const node =
    state.kind === "a" ? (
      <ConversionTracker
        attributes={{ ...SAVE_CALENDAR, place: state.place.slug }}
        goalId={SAVE_CALENDAR.goalId}
        stage={SAVE_CALENDAR.stage}
      >
        <Button
          dataCta="repeat"
          href={calendarUrlForSlug(state.place.slug, { resolved: true })}
          locale={copy.locale}
          onward
          variant="primary-light"
        >
          {fillTemplate(copy.aCta, { place: state.place.name })}
        </Button>
      </ConversionTracker>
    ) : (
      s0Search
    );

  return (
    <ClosingCtaModule heading={moduleHeading} reassurance={reassurance}>
      {node}
    </ClosingCtaModule>
  );
}
