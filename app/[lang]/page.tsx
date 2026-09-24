import { Suspense, cache } from "react";

import { Button } from "@/src/components/button/button";
import { EmptyStateBlock } from "@/src/components/empty-state-block/empty-state-block";
import { HeroBlock, HeroContent } from "@/src/components/hero-block/hero-block";
import { MediaFrame } from "@/src/components/media-frame/media-frame";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { SearchSubmit } from "@/src/components/search-field/search-field";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { SceneBlock } from "@/src/components/scene-block/scene-block";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { fieldAt } from "@/src/lib/content/blocks";
import { pageImage } from "@/src/lib/content/images";
import { HERO_IMAGE_ID } from "@/src/lib/pages/hero-images";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot } from "@/src/lib/content/provenance";
import { ctaLabelOnly } from "@/src/lib/content/text";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { ConversionTracker } from "@/src/components/conversion-tracker/conversion-tracker";
import { EventRow } from "@/src/components/event-row/event-row";
import { fillTemplate, parseDemoProofElement } from "@/src/lib/pages/demo-content";
import { pickStoryExamples } from "@/src/lib/pages/story-examples";
import { calendarUrl } from "@/src/lib/live/app-handover";
import { placeEvents } from "@/src/lib/live/places";
import { STAGE_ZERO_ANCHOR, resolvePlaceOutcome } from "@/src/lib/pages/live-anchor";

import styles from "./_pages.module.css";

import { CountersIsland, NearbyIsland, PlaceDatesIsland, exampleRows } from "./_islands";
import { selectProof } from "./_proof";
import { PageJsonLd } from "./_structured-data";
import { pageContent } from "./_content";
import { localeFrom, pageMetadataFor } from "./_locale";
import { PageFrame } from "./_page-frame";
import { HOME_META } from "./page.meta";

import type { HeroContentProps } from "@/src/components/hero-block/hero-block";
import type { ProofCandidate } from "./_proof";
import type { Place } from "@/src/lib/live/types";
import type { RenderableImage } from "@/src/lib/content/images";
import type { ContentSlot } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * TS-WEB-0019 — `/` — home.
 *
 * Block order is TS-WEB-0019 D3 and is the DOM order below: focus block · three
 * scenes · provenance stamps · proof stream · context band · closing CTA,
 * with nothing after the closing CTA but the footer (TS-WEB-0019-A9). Blocks 3
 * and 4 come from `page.meta.ts` through `PageFrame`; this file writes
 * neither.
 *
 * **Which state renders.** TS-WEB-0019 D2 gives block 1 four states, keyed on
 * what is known about the place. S1 — nothing known — "is what is
 * prerendered and what a crawler and a JS-less visitor get" (D2, TS-WEB-0010 D8),
 * so S1 is what stands here: the place search as the dominant element, its
 * submit carrying the page's one `data-cta="primary"` (TS-WEB-0006 D4 — the job
 * is fulfilled in place, never linked). S2 and S3 arrive by island at M4
 * together with the BFF routes of TS-WEB-0008 D5.
 *
 * **What the mock rule adds.** The prototype must show every function
 * (plan/guardrails.md), so the three live modules that S1 alone would not
 * show — position 1 (dates in the place), position 2 (this week nearby) and
 * position 4 (counters) — render here in the `mocked` state with the
 * `Demo-Daten` badge their frames put on themselves, over the invented
 * `Schlatkow`. Block *structure* is therefore identical to
 * the M4 render (TS-WEB-0006-A10); only the data source changes. Each has a
 * `Mock aktiv` row in `state/open.md`.
 *
 * **Page rhythm** (SRC-0014 §Page Rhythm, checked in `page.rhythm.test.ts`):
 * PHOTO hero · COLOUR ink (the live data anchor, once) · lime-500 ·
 * paper · lime-100 · violet-500 · lime-100 · surface · paper.
 */

const ROUTE = "home" as const;

/**
 * TS-WEB-0012 D4 — `save-calendar-to-homescreen`, `stage: handover`: the click
 * that opens a place calendar on `app.*`. The page's own primary conversion
 * (`page.meta.ts`), and the only outbound handover this page has. The place
 * search submit is **not** a conversion (TS-WEB-0019 D2: "a search is not a
 * conversion"), so it stays unarmed.
 */
const SAVE_CALENDAR = {
  goalId: "save-calendar-to-homescreen",
  stage: "handover",
} as const;

/** The attributes S2's own handover adds beside the resolved place slug. */
const SAVE_CALENDAR_ATTRIBUTES = { route: ROUTE } as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  // `generateMetadata` must not throw `notFound()`: the metadata boundary
  // sits above `[lang]`, so a throw here escapes the shell and Next.js falls
  // back to its built-in 404. The *page* answers 404; this resolves.
  return pageMetadataFor(ROUTE, params);
}

/**
 * Fallback only — `home-12-ui-strings` carries these three short strings
 * (state/open.md row 92, row 161), read below through `uiStringsFrom`. This
 * record stands in only where a locale's slot is unreadable (`slot()`'s own
 * typed-empty-with-`reason` contract, `src/lib/content/README.md`), never as
 * the primary source.
 *
 * None of them says anything about the surface being a stand-in: Jan's
 * decision of 2026-09-18 keeps that in the frontmatter, in `data-*` and in
 * `state/open.md`.
 */
const UI_STRING_FALLBACKS: Record<
  Locale,
  {
    flyerExample: string;
    geo: string;
    datesUnit: string;
  }
> = {
  de: {
    flyerExample: "Aus dem Flyer geworden",
    geo: "Beleg aus der Region",
    datesUnit: "Termine",
  },
  en: {
    flyerExample: "Made from the flyer",
    geo: "Proof from the region",
    datesUnit: "dates",
  },
};

/** The three short UI strings, read off `home-12-ui-strings` where the slot
 * has them, falling back to the stand-ins otherwise. */
function uiStringsFrom(uiStrings: ContentSlot, locale: Locale) {
  const fallback = UI_STRING_FALLBACKS[locale];
  return {
    flyerExample: fieldAt(uiStrings.blocks, 0) ?? fallback.flyerExample,
    geo: fieldAt(uiStrings.blocks, 1) ?? fallback.geo,
    datesUnit: fieldAt(uiStrings.blocks, 2) ?? fallback.datesUnit,
  };
}

/**
 * The artifact's proof lines as relevance candidates (TS-WEB-0005).
 *
 * The attribution names the place ("… — Bürgermeister in Rubkow"), and that
 * name is what the element *covers* — `geoCommunity`, the facet the engine
 * scores. Without it every candidate would tie at country level and the
 * spread rule would have nothing to spread.
 */
function proofCandidates(proof: ContentSlot, geoLabel: string): ProofCandidate[] {
  const list = proof.blocks.find((block) => block.kind === "list");
  const items = list?.kind === "list" ? list.items : [];
  return items.map((item, index) => {
    const card = parseDemoProofElement(item, geoLabel);
    const place = card.attribution.split(", ").slice(1).join(", ").trim();
    return {
      id: `home-8-proof-stream-${index + 1}`,
      contextLine: card.contextLine,
      claim: card.claim,
      attribution: card.attribution,
      geo: { level: "snapshot" as const, label: geoLabel },
      geoCommunity: place === "" ? null : place,
      demo: isDemoSlot(proof),
    };
  });
}

/**
 * Block 1 in TS-WEB-0019 D2's four states (F-2-30), split along DEC-0078's line.
 *
 * D2 keys block 1 on **what is known about the place**, and the place is a
 * request value, so part of block 1 has to arrive through a `<Suspense>`
 * boundary — that is what keeps `/` a prerendered route (`state/open.md`
 * row 131) while still answering a stated place.
 *
 * What DEC-0078 changed is **where the line runs**. Until this round the
 * boundary's fallback was the whole of block 1, search field included, so on
 * every load of `/` — `?ort=` or not — React removed the fallback's DOM and
 * inserted the resolved branch's, and a postcode typed into the hero search
 * in the first ~350 ms went with it (row 213: present at 96 ms, gone at
 * 349 ms, 3/3 on the production build). Now the boundary carries only what
 * genuinely varies and holds no visitor input:
 *
 *  - `StatedHeroContent` — the headline · lead · CTA trio (`HeroContent`);
 *  - `StatedSubmit` — the submit button, because `data-cta="primary"` moves
 *    from the submit (S1) to the hero's CTA (S2/S3) and an attribute cannot
 *    be streamed on its own;
 *  - `StatedFocusModules` — the ink module slot and S3's widened radius.
 *
 * The `<form>`, its label and the **input** stand in the prerendered shell,
 * under `hero-block`'s own `search` slot. The input the visitor first sees
 * is the input that stays.
 */
interface FocusCopy {
  readonly locale: Locale;
  /**
   * The hero photograph from the page's image inventory, or `undefined` while
   * none exists — in which case `photo-surface` renders the "Foto gesucht"
   * hatch, which is a conversion rather than a gap (DEC-0068, SRC-0014).
   */
  readonly hero?: RenderableImage;
  /** S1's hero headline and the search module in both treatments. */
  readonly s1Headline: string;
  readonly search: (primary: boolean) => ReactNode;
  /** The submit control's label, already resolved — `StatedSubmit` renders it. */
  readonly submitLabel: string;
  /** S2 — `home-2-place-dates`: `{place}` headline and app-handover label. */
  readonly datesHeadline: string;
  readonly datesCta: string;
  /** S3 — `home-3-place-empty`: radius heading, invitation, publish label. */
  readonly nearbyHeading: string;
  readonly invitation: string;
  readonly publishCta: string;
  /** `home-9-counters`: what the one figure under the rows is a figure of. */
  readonly countersLabel: string;
}

/** The artifact writes the invitation as two sentences; the first is the headline. */
function splitInvitation(text: string): { headline: string; lead?: string } {
  const cut = text.indexOf(". ");
  if (cut === -1) return { headline: text };
  return { headline: text.slice(0, cut + 1).trim(), lead: text.slice(cut + 1).trim() };
}

/**
 * What `?ort=` resolves to, for block 1 — read once per request.
 *
 * DEC-0078 splits block 1 across three boundaries, and all three need the same
 * answer. `cache()` is what keeps that one geo lookup and one dates read:
 * the three components below call this with the same `searchParams` promise,
 * so React returns the same in-flight promise to each.
 *
 * S4 — "a search resolved to an uncovered place" — carries *nothing* on `/`
 * per D2: the search navigates away instead (`/dein-ort` classifies and
 * forwards, TS-WEB-0008 D7). So an uncovered value answers the S1 shape here, and
 * TS-WEB-0019-A5's "`/` itself renders no uncovered place as data" holds by
 * construction.
 */
const focusState = cache(
  async (
    searchParams: Promise<Record<string, string | string[] | undefined>>,
  ): Promise<{ readonly place?: Place; readonly hasDates?: boolean }> => {
    const outcome = await resolvePlaceOutcome((await searchParams)["ort"]);
    if (outcome.kind !== "covered") return {};
    const envelope = await placeEvents({ slug: outcome.place.slug, rowCount: 3 });
    return { place: outcome.place, hasDates: (envelope?.data.events.length ?? 0) > 0 };
  },
);

/**
 * The hero's headline · lead · CTA trio in whichever of TS-WEB-0019 D2's states
 * the place resolves to — the one function both branches of the hero's
 * boundary call, so the reserved space cannot drift between them.
 */
function heroContentFor(copy: FocusCopy, place?: Place, hasDates?: boolean): HeroContentProps {
  // S1 — nothing known. No CTA node: the search below the trio carries the
  // page's primary, and an empty `cta` slot renders no box at all.
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
        attributes={{ ...SAVE_CALENDAR_ATTRIBUTES, place: place.slug }}
        goalId={SAVE_CALENDAR.goalId}
        stage={SAVE_CALENDAR.stage}
      >
        <OutboundLink
          dataCta="primary"
          href={calendarUrl(place)}
          locale={copy.locale}
          variant="secondary"
        >
          {fillTemplate(copy.datesCta, values)}
        </OutboundLink>
      </ConversionTracker>
    ),
  };
}

/** The hero trio for a stated place — the resolved branch of boundary 1. */
async function StatedHeroContent({
  copy,
  searchParams,
}: {
  readonly copy: FocusCopy;
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { place, hasDates } = await focusState(searchParams);
  return <HeroContent {...heroContentFor(copy, place, hasDates)} />;
}

/**
 * The hero search's submit — boundary 2, and the reason it exists.
 *
 * TS-WEB-0006 D3 allows exactly one `data-cta="primary"` per page and TS-WEB-0019 D2
 * moves it: in S1 it is this submit, in S2/S3 it is the hero's own CTA. An
 * attribute cannot be streamed on its own, so the *button* is what varies,
 * and the `<form>`, the label and the input around it stay in the shell
 * (DEC-0078). `SearchSubmit` renders both branches, so they are the same
 * 44 px pill in the same place and the swap moves nothing.
 */
async function StatedSubmit({
  copy,
  searchParams,
}: {
  readonly copy: FocusCopy;
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { place } = await focusState(searchParams);
  return <SearchSubmit dataCta={place === undefined ? "primary" : undefined} label={copy.submitLabel} />;
}

/**
 * Block 1's module slot — boundary 3. The ink section is the same section in
 * every state (the page rhythm and TS-WEB-0019-A9's DOM order do not move when
 * the state does); S3 adds the widened radius under it.
 */
function FocusModules({
  copy,
  place,
  hasDates,
}: {
  readonly copy: FocusCopy;
  /** The resolved community, or `undefined` for S1 — never the raw parameter. */
  readonly place?: Place;
  readonly hasDates?: boolean;
}) {
  const { locale } = copy;
  const words = dictionary(locale);
  // S3, with the place carried through the narrowing so the widened module
  // below can take its coordinate.
  const emptyPlace = place !== undefined && hasDates === false ? place : undefined;
  const empty = emptyPlace !== undefined;
  const values = { place: place?.name ?? "" };

  return (
    <>
      {/* Block 1′ — the live dates of a known place. The one `ink` section of
          the page rhythm, and the anchor the live data sits on. In S3 the
          slot carries the publish invitation instead of an empty date box
          ("Position 1 is not left blank", TS-WEB-0008 D4). */}
      <MotionReveal>
        <SectionShell
          id="place-dates"
          kicker={empty ? undefined : words.kickers.liveAnswer}
          surface="ink"
        >
          {empty ? (
            <EmptyStateBlock
              announced
              cta={copy.search(false)}
              headline={splitInvitation(fillTemplate(copy.invitation, values)).headline}
              lead={splitInvitation(fillTemplate(copy.invitation, values)).lead}
              pulse={false}
            />
          ) : (
            <PlaceDatesIsland
              conversion={SAVE_CALENDAR}
              ctaTemplate={place === undefined ? copy.datesCta : undefined}
              locale={locale}
              role="illustrative"
              rowCount={3}
              slug={place?.slug ?? STAGE_ZERO_ANCHOR.slug}
              titleTemplate={copy.datesHeadline}
              tone="dark"
            />
          )}
          {/* Block 2d — the counter, where it means something: directly under
              the live rows it is the size of the thing those three dates came
              out of. It stood on a violet band of its own between the scenes
              and the proof, next to an origin sentence and a link, and the
              one number on the page was the smallest thing in it (polish
              brief, page 1, fix 5). TS-WEB-0019 D3 asks for it "inline in 2b or
              2c, no section of its own" — this is that, one block earlier. */}
          <div className={styles.counters} id="live-counters">
            <p>{copy.countersLabel}</p>
            {/* TS-WEB-0019-A14 / Q-0037: only the counted figure. `places` and
                `updatesToday` have no `/api/stats` field, so the band shows
                one slot rather than an estimate. */}
            <CountersIsland locale={locale} show={["dates"]} />
          </div>
        </SectionShell>
      </MotionReveal>

      {/* TS-WEB-0019 D5, position 2: "this week nearby" is block 1's **S3**
          module, and only S3's. Round 3 rendered it in every state, so the
          page opened on two five-row lists with the same titles in both —
          1.6 phone screens of near-identical rows before a single argument
          was made (polish brief, page 1, fix 2). Where dates exist, widening
          the radius answers nothing the list above has not; where they do
          not, it is the whole answer, and `/dein-ort` carries the radius
          argument for everyone else. Its shell names its own radius — never
          the place name (TS-WEB-0008 D1). */}
      {emptyPlace ? (
        <MotionReveal>
          <SectionShell id="nearby" kicker={words.kickers.widerRadius} surface="surface-2">
            <NearbyIsland
              lat={emptyPlace.lat}
              lng={emptyPlace.lng}
              locale={locale}
              role="answering"
              rowCount={5}
              titleTemplate={copy.nearbyHeading}
            />
          </SectionShell>
        </MotionReveal>
      ) : null}
    </>
  );
}

/** The module slot for a stated place — the resolved branch of boundary 3. */
async function StatedFocusModules({
  copy,
  searchParams,
}: {
  readonly copy: FocusCopy;
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { place, hasDates } = await focusState(searchParams);
  return <FocusModules copy={copy} hasDates={hasDates} place={place} />;
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  /** Read only inside the `<Suspense>` boundary below — never awaited here. */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await localeFrom(params);
  const words = dictionary(locale);
  const page = await pageContent(ROUTE, locale);

  const hero = slot(page, "home-1-search-hero");
  const dates = slot(page, "home-2-place-dates");
  const nearby = slot(page, "home-3-place-empty");
  const sceneWhatsapp = slot(page, "home-4-scene-whatsapp");
  const sceneEmbed = slot(page, "home-5-scene-embed");
  const sceneProvenance = slot(page, "home-6-scene-provenance");
  const stamps = slot(page, "home-7-provenance-stamps");
  const proof = slot(page, "home-8-proof-stream");
  const counters = slot(page, "home-9-counters");
  const band = slot(page, "home-10-context-band");
  const closingCta = slot(page, "home-11-closing-cta");
  const uiStrings = slot(page, "home-12-ui-strings");
  const demo = uiStringsFrom(uiStrings, locale);

  // Field labels are translated, so the n-th block is the contract, not the
  // label (TS-WEB-0007, `src/lib/content/README.md`). `Headline` is one of the few
  // labels both locales share.
  // The page's image inventory (`images:` in the artifact's frontmatter):
  // one entry per image, carrying its own alt text and provenance. An entry
  // with no file yet resolves to `undefined`, and the module renders its
  // honest "Foto gesucht" state (DEC-0068).
  const sceneEmbedImage = pageImage(page, "home-scene-embed");
  const sceneProvenanceImage = pageImage(page, "home-scene-provenance");

  const searchPlaceholder = fieldAt(hero.blocks, 1);
  const searchHint = fieldAt(hero.blocks, 3);
  const proofKicker = fieldAt(proof.blocks, 0);

  /**
   * The one live row the WhatsApp scene shows as its outcome — cached rather
   * than suspended, because it stands inside prose (TS-WEB-0020 D3's snapshot
   * rung, the same shape `/dein-ort`'s stories use).
   */
  const rows = await exampleRows(
    STAGE_ZERO_ANCHOR.slug,
    STAGE_ZERO_ANCHOR.lat,
    STAGE_ZERO_ANCHOR.lng,
    locale,
  );
  const [flyerRow] = pickStoryExamples(
    // Position 1 prints the first three; the scene takes one the reader has
    // not just scrolled past.
    [...rows.place.slice(3), ...rows.nearby],
    [["social", "culture", "fest"]],
  );

  /**
   * TS-WEB-0005 through, not around: gate · score · rotate · order · count, at
   * DEC-0048's home count of **5**. Home is stage 0 — its search hands a place
   * to `/dein-ort`, it never takes one itself — so no `placeSlug` goes in and
   * the whole selection stays inside the prerendered shell.
   */
  const proofSelection = await selectProof({
    routeId: ROUTE,
    locale,
    focusJob: "know-what-is-on",
    surface: "home",
    candidates: proofCandidates(proof, demo.geo),
  });

  /**
   * The one primary conversion of the page (TS-WEB-0006 D3, TS-WEB-0019 D2 S1): the
   * search submit itself. The same module, same submit label and same
   * target repeats as the closing block — TS-WEB-0019-A10's "same target and
   * label as the block-1 primary of the current state" — without the marker,
   * which exists exactly once.
   */
  const submitLabel = hero.cta ?? words.search.submit;

  const search = (primary: boolean) => (
    <PlaceSearch
      typeahead
      hint={searchHint}
      id={primary ? "ort-suche-fokus" : "ort-suche-abschluss"}
      label={searchPlaceholder ?? ""}
      locale={locale}
      placeholder={searchPlaceholder}
      // DEC-0078: the hero instance is the one whose `data-cta="primary"`
      // moves with the place, so only that instance hands its submit to a
      // boundary. The closing block's copy keeps the plain default.
      submit={
        primary ? (
          <Suspense fallback={<SearchSubmit dataCta="primary" label={submitLabel} />}>
            <StatedSubmit copy={focusCopy} searchParams={searchParams} />
          </Suspense>
        ) : undefined
      }
      submitLabel={submitLabel}
      to="place"
      tone={primary ? "dark" : "light"}
    />
  );

  const focusCopy: FocusCopy = {
    locale,
    hero: pageImage(page, HERO_IMAGE_ID.home),
    s1Headline: hero.fields["Headline"] ?? "",
    search,
    submitLabel,
    datesHeadline: dates.fields["Headline"] ?? "",
    datesCta: dates.cta ?? "",
    nearbyHeading: fieldAt(nearby.blocks, 0) ?? "",
    invitation: fieldAt(nearby.blocks, 1) ?? "",
    publishCta: ctaLabelOnly(nearby.cta ?? fieldAt(nearby.blocks, 2) ?? "") ?? "",
    countersLabel: fieldAt(counters.blocks, 0) ?? "",
  };

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={{
        variant: "module",
        node: search(false),
        heading: fieldAt(closingCta.blocks, 0),
        reassurance: fieldAt(closingCta.blocks, 1),
      }}
      contextBandHeading={fieldAt(band.blocks, 0)}
      locale={locale}
      meta={HOME_META}
    >
      {/* Block 1 and its module slot, in whichever of TS-WEB-0019 D2's states the
          place parameter resolves to. The fallback **is** S1 — the
          prerendered shell — and S2/S3 stream over it. */}
      {/* DEC-0078 — the hero's photograph, its kicker and the **search module**
          are the prerendered shell; only the headline · lead · CTA trio
          arrives through a boundary. The input a visitor sees at first paint
          is therefore the input she keeps typing into (row 213). */}
      <HeroBlock
        content={
          <Suspense fallback={<HeroContent {...heroContentFor(focusCopy)} />}>
            <StatedHeroContent copy={focusCopy} searchParams={searchParams} />
          </Suspense>
        }
        id="focus-block"
        // F-2-33: the surface badges itself out of the dictionary, so it
        // needs the page's language or it badges an English page in German.
        locale={locale}
        notDepicting={focusCopy.hero?.notDepicting}
        placeholderId={focusCopy.hero?.placeholderId}
        search={focusCopy.search(true)}
        src={focusCopy.hero?.src}
        wideSrc={focusCopy.hero?.wideSrc}
      />
      <Suspense fallback={<FocusModules copy={focusCopy} />}>
        <StatedFocusModules copy={focusCopy} searchParams={searchParams} />
      </Suspense>
      {/* Block 2a — three scenes, one mechanism each (TS-WEB-0006 D7), in the
          `direct`/stage-0 order of TS-WEB-0019 D3a. The trait-dependent order is
          a runtime property of TS-WEB-0010 and lands with the stages at M4. */}
      <MotionReveal>
        <SectionShell
          id="scene-1"
          kicker={fieldAt(sceneWhatsapp.blocks, 2)}
          surface="lime-500"
          transition={fieldAt(sceneWhatsapp.blocks, 3)}
        >
          <SceneBlock
            body={fieldAt(sceneWhatsapp.blocks, 1)}
            instance={
              flyerRow === undefined ? null : (
                <>
                  {/* The outcome, not a list (polish brief, page 1, fix 3):
                      one real date, under the line that says what it is. It
                      is picked out of what position 1 has **not** already
                      shown, and out of the categories a printed flyer is
                      actually about — the module took the place's next date
                      whatever it was, which put "Gelber Sack" under "made
                      from the flyer", twice on one screen. */}
                  <h3 className={styles.instanceHeading}>{demo.flyerExample}</h3>
                  <EventRow {...flyerRow} locale={locale} state={rows.demo ? "mocked" : "ready"} />
                </>
              )
            }
            locale={locale}
            mechanism="whatsapp"
            opener={fieldAt(sceneWhatsapp.blocks, 0) ?? ""}
          />
        </SectionShell>
      </MotionReveal>

      <MotionReveal>
        <SectionShell
          id="scene-2"
          kicker={fieldAt(sceneEmbed.blocks, 2)}
          surface="surface-2"
          transition={fieldAt(sceneEmbed.blocks, 3)}
        >
          <SceneBlock
            body={fieldAt(sceneEmbed.blocks, 1)}
            instance={
              <MediaFrame
                alt={sceneEmbedImage?.alt ?? ""}
                className={styles.sceneMedia}
                locale={locale}
                notDepicting={sceneEmbedImage?.notDepicting}
                placeholderId={sceneEmbedImage?.placeholderId}
                ratio="feature"
                src={sceneEmbedImage?.src}
                state={sceneEmbedImage ? undefined : "empty"}
              />
            }
            locale={locale}
            mechanism="embed"
            opener={fieldAt(sceneEmbed.blocks, 0) ?? ""}
          />
        </SectionShell>
      </MotionReveal>

      <MotionReveal>
        <SectionShell
          id="scene-3"
          kicker={fieldAt(sceneProvenance.blocks, 2)}
          surface="paper"
          transition={fieldAt(sceneProvenance.blocks, 3)}
        >
          <SceneBlock
            body={fieldAt(sceneProvenance.blocks, 1)}
            instance={
              <MediaFrame
                alt={sceneProvenanceImage?.alt ?? fieldAt(sceneProvenance.blocks, 0) ?? ""}
                className={styles.sceneMedia}
                locale={locale}
                notDepicting={sceneProvenanceImage?.notDepicting}
                placeholderId={sceneProvenanceImage?.placeholderId}
                ratio="feature"
                src={sceneProvenanceImage?.src}
              />
            }
            /* Block 2b — the origin stamp, where it belongs: in the scene
               that is about where this comes from. It stood on a violet band
               of its own between the scenes and the proof, mixing the origin
               sentence, the live counter and a link to `/ueber-uns` into one
               block with three unrelated jobs (polish brief, page 1, fix 5).
               The counter moved up to the live rows it is a figure of; the
               sentence and the link are this scene's, and the page is one
               section shorter for it. */
            locale={locale}
            mechanism="provenance"
            opener={fieldAt(sceneProvenance.blocks, 0) ?? ""}
          />
          <p className={styles.stamp} id="provenance-stamps">
            {fieldAt(stamps.blocks, 0)}
          </p>
          <Button locale={locale} onward to="about" variant="quiet">
            {(fieldAt(stamps.blocks, 1) ?? "").split("→")[0]?.trim()}
          </Button>
        </SectionShell>
      </MotionReveal>

      {/* Block 2c — the proof stream. Exactly five elements (DEC-0048); while
          no selection is cleared (Q-0014/Q-0045) the five demo cards the
          content artifact itself carries stand in, each badged. */}
      <MotionReveal>
        <SectionShell
          id="proof-stream"
          kicker={words.kickers.evidence}
          labelledBy="proof-stream-heading"
          surface="lime-100"
        >
          <h2 id="proof-stream-heading">{proofKicker}</h2>
          <ProofStream label={proofKicker}>
            {proofSelection.entries.map((entry, position) =>
              entry.kind === "item" ? (
                <ProofCard
                  attribution={entry.candidate.attribution}
                  claim={entry.candidate.claim}
                  contextLine={entry.candidate.contextLine}
                  /* G-7: one emphasis per stream. The first element opens it
                     at sub-head size; the rest are hairline rows with no
                     fill — five identical cards read as one grey block, not
                     as breadth. And the geo badge goes: every card here
                     already names its own source in the line above it, so
                     the badge was the same word five times. */
                  emphasis={position === 0 ? "feature" : "compact"}
                  key={entry.candidate.id}
                  locale={locale}
                  state={entry.state}
                />
              ) : (
                // An unfilled position weakens the claim; it never shortens
                // the stream (SRC-0001 §4, DEC-0048).
                <EmptyProofSlot key={`empty-${position}`} />
              ),
            )}
          </ProofStream>
        </SectionShell>
      </MotionReveal>

    </PageFrame>
    </>
  );
}
