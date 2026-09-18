import { Button } from "@/src/components/button/button";
import { ConversionTracker } from "@/src/components/conversion-tracker/conversion-tracker";
import { EmptyStateBlock } from "@/src/components/empty-state-block/empty-state-block";
import { EventRow } from "@/src/components/event-row/event-row";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { HowtoBlock } from "@/src/components/howto-block/howto-block";
import { MediaFrame } from "@/src/components/media-frame/media-frame";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { ValueStory } from "@/src/components/value-story/value-story";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { fieldAt } from "@/src/lib/content/blocks";
import { pageImage } from "@/src/lib/content/images";
import { HERO_IMAGE_ID } from "@/src/lib/pages/hero-images";
import { slot } from "@/src/lib/content/loader";
import { ctaLabelOnly } from "@/src/lib/content/text";
import { fillTemplate, parseDemoProofElement, splitSteps } from "@/src/lib/pages/demo-content";
import { pickStoryExamples } from "@/src/lib/pages/story-examples";
import { STAGE_ZERO_ANCHOR, resolvePlaceOutcome } from "@/src/lib/pages/live-anchor";
import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";

import { linkHref } from "@/src/components/route-link/href";
import { calendarUrl } from "@/src/lib/live/app-handover";
import { cacheLifeProfile, cacheTags } from "@/src/lib/live/cache-profiles";
import { placeEvents, resolvePlace } from "@/src/lib/live/places";
import { href } from "@/src/lib/routes/routes";


import { NearbyIsland, PlaceDatesIsland, exampleRows } from "../_islands";
import { PageJsonLd } from "../_structured-data";
import { pageContent } from "../_content";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";
import { PLACE_META } from "./page.meta";

import type { QuoteFragment } from "@/src/components/content-fragments";
import type { ContentSlot } from "@/src/lib/content/types";
import type { EventListItem } from "@/src/components/event-list/event-list";
import type { SectionSurface } from "@/src/components/section-shell/section-shell";
import type { StoryCategoryPreference } from "@/src/lib/pages/story-examples";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-020 — `/dein-ort` — the reader's page.
 *
 * **The arc, top to bottom** (polish brief Part B, page 2): search → these
 * are the dates → *and the bakery van is in here too* → *and the council
 * meeting, and culture two villages over, and the fifteen-minute radius* →
 * put it where your apps are. Every section names its role in a kicker, and
 * the three lines between the stories are hand-offs, not claims.
 *
 * Blocks in DOM order: focus block · the live dates · four value stories, one
 * section each on alternating grounds · homescreen block · (a place is known:
 * the quiet "different place?" search) · context band · closing CTA. The last
 * two come from `page.meta.ts` through `PageFrame`.
 *
 * **What the polish pass changed, and why.** Round 3 rendered the four
 * stories as one 1320 px `paper` block — heading, paragraph, row, heading,
 * paragraph, row — with no image, no kicker and no ground change, and the
 * radius argument as a *fifth* list right after four stories that had each
 * ended in a row. The four quotes the artifact carries (Kurzweg, Zschiesche,
 * Eichler, Wendt) rendered nowhere at all. Now each story is its own
 * section with its own ground, two of the four are picture-led, story 4
 * *is* position 2 rather than being followed by it, and every story closes
 * on the testimonial that belongs to it. The quotes are `clearance: pending`
 * (Q-014) and the brief decides to render them: they are real, attributed
 * sentences from the hub, and the hardening round before go-live clears
 * them.
 *
 * **Which state renders.** TS-020 D2 resolves the place parameter five ways,
 * three of which are states of this page. Without `?ort=` and without a known
 * community the page is **S0** — "the prerendered shell, complete on its own:
 * place search dominant, stories on snapshot examples, counters may render;
 * **no empty-state markup**, no unresolved skeleton, no 'we could not find
 * you'" (D2, TS-020-A10). In S0 the live module is one row under its own
 * heading: the hero asks the visitor to search, so the module shows what an
 * answer looks like rather than answering a question nobody asked.
 *
 * In **state A** the hero already says "Das ist los in {ort}", so the
 * module's own heading is read and not seen (`titleHidden`) and the
 * conversion — the calendar handover — sits directly under the three rows.
 * In **state B** the publish offer occupies the module slot (TS-008 D4) and
 * the page's primary conversion moves to `register-as-publisher`.
 *
 * **Page rhythm:** PHOTO hero · ink (the live-data anchor, once) · paper ·
 * lime-100 · paper · surface · lime-500 · (lime-100) · surface · paper.
 */

const ROUTE = "place" as const;

/**
 * **Cache Components: this route blocks on purpose** (TS-009 D1, the dynamic
 * layer). TS-020 D2 keys five page states on `?ort=`, and TS-020-A10 requires
 * stage 0 to render with JavaScript disabled and with **no unresolved
 * skeleton** — so the request value is read in the page rather than behind a
 * `<Suspense>` boundary whose fallback a JS-less visitor would never get
 * past. `instant = false` is the framework's own marker for "allowed to
 * block". Content and every live module below stay cached, so the
 * per-request work is a cache read and a slug lookup. `state/open.md`.
 */
export const instant = false;

/**
 * TS-012 D4 — `save-calendar-to-homescreen`, `stage: handover`: every click
 * that opens this place's calendar on `app.*`. Three of them in state A (the
 * module's onward link, the homescreen block's action, the closing block),
 * all the same goal at the same stage, each fired by its own click — never
 * on render.
 */
const SAVE_CALENDAR = {
  goalId: "save-calendar-to-homescreen",
  stage: "handover",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadataFor(ROUTE, params);
}

/**
 * Fallback only. `dein-ort-0-state-s0` carries S0's own headline, the nearby
 * module's place-agnostic heading, the search hint and the line that hands
 * the reader over to the live module (state/open.md row 93, row 161);
 * `searchLabel` and `genericPlace` have no field in that slot and stay
 * generated (Dummy-Content, `state/open.md`) — `genericPlace` fills state
 * A/B's own `{place}` template when no place is resolved yet, which is a
 * different sentence from S0's dedicated headline below.
 */
const PAGE_COPY: Record<
  Locale,
  {
    genericPlace: string;
    nearby: string;
    searchLabel: string;
    searchHint: string;
  }
> = {
  de: {
    genericPlace: "deinem Ort",
    nearby: "Diese Woche in der Nähe",
    searchLabel: "Deine Postleitzahl",
    searchHint: "Suche nach Ortsnamen kommt noch dazu — bis dahin reicht die Postleitzahl.",
  },
  en: {
    genericPlace: "your place",
    nearby: "This week nearby",
    searchLabel: "Your postcode",
    searchHint: "Search by place name is coming — until then, the postcode works fine.",
  },
};

/**
 * The four stories, in the order the artifact writes them and the page reads
 * them — the ground each stands on, the photograph it is led by where one
 * exists, and the categories its live example prefers.
 *
 * The grounds alternate by construction (`paper → lime-100 → paper →
 * surface`), which is what stops four arguments in a row from reading as one
 * long block; `rhythm.ts` checks the whole sequence in the page's own test.
 */
interface StorySection {
  readonly slotId: string;
  readonly quoteSlotId: string;
  readonly id: string;
  readonly surface: SectionSurface;
  /**
   * A story is led by a photograph **or** by a live date, never by both: a
   * picture, a row and a quote is three pieces of evidence for one argument,
   * and four stories built that way are a 3 000 px wall. Two picture-led and
   * two date-led, alternating, is the rhythm the brief asks for.
   */
  readonly imageId?: string;
  /** Which categories this story's live example prefers, best first. */
  readonly categories?: StoryCategoryPreference;
}

const STORIES: readonly StorySection[] = [
  {
    slotId: "dein-ort-3-story-baeckerwagen",
    quoteSlotId: "dein-ort-3-story-baeckerwagen-demo-testimonial",
    id: "story-baeckerwagen",
    surface: "paper",
    imageId: "dein-ort-story-baeckerwagen",
  },
  {
    slotId: "dein-ort-4-story-ratssitzung",
    quoteSlotId: "dein-ort-4-story-ratssitzung-demo-testimonial",
    id: "story-ratssitzung",
    surface: "lime-100",
    // "Gemeindeleben" first: the council meeting's own category upstream,
    // then the institutional tone. A supply date under a story about being
    // heard before the vote would be an example of nothing.
    categories: ["social", "official"],
  },
  {
    slotId: "dein-ort-5-story-kultur",
    quoteSlotId: "dein-ort-5-story-kultur-demo",
    id: "story-kultur",
    surface: "paper",
    imageId: "dein-ort-story-kultur",
  },
];

/** Story 4 — the radius, which carries position 2 as its own example. */
const RADIUS_STORY = {
  slotId: "dein-ort-6-story-radius",
  quoteSlotId: "dein-ort-6-story-radius-demo-testimonial",
} as const;

/**
 * The testimonial a story closes on, read off its own proof-card slot.
 *
 * The artifacts write one line — `„…" — Elisabeth Kurzweg, Bäckerei Kurzweg
 * (2022)` — and two of the four slots carry a second field beside it, so the
 * quote is found by its quotation mark rather than by its position. The
 * wording is the hub record's, unchanged and untranslated: a testimonial is
 * quoted in the language it was given in.
 */
function testimonialOf(source: ContentSlot): QuoteFragment | undefined {
  const line = source.blocks.find(
    (block) => block.kind === "field" && /^[„"“]/.test(block.value),
  );
  if (line?.kind !== "field") return undefined;

  const { claim, contextLine, attribution } = parseDemoProofElement(line.value, "");
  if (claim === "" || contextLine === "") return undefined;
  return {
    text: claim,
    attribution: contextLine,
    ...(attribution === "" ? {} : { role: attribution }),
  };
}

/**
 * TS-020 D4 — the homescreen block, which names a place and links the app.
 *
 * Cached per slug: everything it renders is a function of the resolved place
 * and the artifact's own instructions, so it belongs on the cache side of
 * TS-009 D1 rather than in the request-bound half.
 */
interface HomescreenCopy {
  readonly locale: Locale;
  readonly headline: string;
  readonly ios: string;
  readonly android: string;
  readonly ctaTemplate: string;
  readonly genericPlace: string;
}

async function Homescreen({ slug, locale, headline, ios, android, ctaTemplate, genericPlace }: HomescreenCopy & { readonly slug: string }) {
  "use cache";
  cacheLife(cacheLifeProfile("activePlaces"));
  cacheTag(cacheTags.places());

  const place = await resolvePlace(slug);
  const name = place?.name ?? genericPlace;

  return (
    <HowtoBlock
      android={{ steps: splitSteps(fillTemplate(android, { place: name })) }}
      // No resolved place, no app link: an unresolved place has no handover
      // (TS-008 D9) and the founding route carries it instead.
      appHref={place ? calendarUrl(place) : href("placeStart", locale)}
      // Only a resolved place is a calendar handover; the founding route is
      // a different goal and is not armed here.
      conversion={
        place ? { ...SAVE_CALENDAR, attributes: { place: place.slug } } : undefined
      }
      appLinkLabel={fillTemplate(ctaTemplate, { place: name })}
      // The iPhone steps stand open and Android is one tap away: both
      // instructions are in the DOM for every visitor, under every user
      // agent, and the block is ~280 px shorter on a phone for it.
      collapsed={["android"]}
      headline={headline}
      ios={{ steps: splitSteps(fillTemplate(ios, { place: name })) }}
      // F-2-33: the screenshot frames badge themselves out of the dictionary.
      locale={locale}
    />
  );
}

export default async function PlacePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await localeFrom(params);
  const words = dictionary(locale);
  const page = await pageContent(ROUTE, locale);
  // The hero photograph from the page's image inventory; `undefined` while
  // none exists, and the surface renders its "Foto gesucht" hatch instead.
  const heroImage = pageImage(page, HERO_IMAGE_ID.place);
  const fallbackCopy = PAGE_COPY[locale];
  const stateS0 = slot(page, "dein-ort-0-state-s0");
  const s0Headline = fieldAt(stateS0.blocks, 0);
  const copy = {
    ...fallbackCopy,
    nearby: fieldAt(stateS0.blocks, 1) ?? fallbackCopy.nearby,
    searchHint: fieldAt(stateS0.blocks, 3) ?? fallbackCopy.searchHint,
    /** S0's hand-off from the search field into the module below it. */
    s0Transition: fieldAt(stateS0.blocks, 4),
  };

  /**
   * The one request value this page has, resolved once, outside every cache
   * boundary (TS-009 D2) — and read in the **page**, not behind a
   * `<Suspense>`.
   *
   * That makes `/dein-ort` a dynamic route rather than a prerendered shell,
   * and it is the honest shape for this page: TS-020 D2 keys *five* states on
   * the place parameter, and TS-020-A10 requires stage 0 to render with
   * JavaScript disabled and with **no unresolved skeleton**. A `<Suspense>`
   * boundary buys the shell back only by paying with a skeleton a JS-less
   * visitor never gets past — which is precisely what A10 forbids. The
   * shell/island split still holds underneath: content and every live module
   * are cached (`_content.ts`, `_islands.tsx`), so the per-request work is a
   * cache read and a slug lookup, not an upstream call.
   */
  const outcome = await resolvePlaceOutcome((await searchParams)["ort"]);

  /**
   * TS-020 D2 row 5 and TS-008 D7 row 3: a place geo-api has no community for
   * is **not this page**. One hop, the query carried verbatim (TS-021 D4
   * re-validates it on arrival), and the founding path finally has its entry.
   *
   * A value the validator *dropped* takes the other row — S0 at 200, no
   * redirect (TS-020-A9) — because nothing has been established about it.
   */
  if (outcome.kind === "uncovered") {
    redirect(linkHref("placeStart", { locale, query: { ort: outcome.query } }));
  }

  const stated = outcome.kind === "covered" ? outcome.place : undefined;
  const anchor = stated ?? STAGE_ZERO_ANCHOR;

  /**
   * Which of TS-020 D2's three states renders. The empty state is TS-008 D4's
   * trigger — a **covered** place whose window is empty — so the page has to
   * know the answer before block 1 is composed: state B moves the primary
   * conversion to publishing (D4), which is a decision about the page, not
   * about one module (F-2-61). The lookup is the same cached call the island
   * makes, so the second read costs a cache hit.
   */
  const statedDates = stated === undefined ? undefined : await placeEvents({ slug: stated.slug, rowCount: 3 });
  const emptyState = statedDates?.data.publishInvitation === true;

  const stateA = slot(page, "dein-ort-1-state-a");
  const stateB = slot(page, "dein-ort-2-state-b");
  const homescreen = slot(page, "dein-ort-7-homescreen");
  const permanence = slot(page, "dein-ort-8-permanence");
  const radiusStory = slot(page, RADIUS_STORY.slotId);

  /**
   * The example rows the stories borrow from the live modules — the
   * "snapshot rung of the example ladder" of TS-020 D3, cached rather than
   * suspended: the rows stand *inside* prose, where a skeleton would read as
   * a broken paragraph rather than as arriving data.
   *
   * Position 1 prints the first three of `rows.place` and story 4 the first
   * five of `rows.nearby`, so the stories pick out of what is left — see
   * `story-examples.ts` for why an example must not be a row the reader has
   * just scrolled past.
   */
  const rows = await exampleRows(
    STAGE_ZERO_ANCHOR.slug,
    STAGE_ZERO_ANCHOR.lat,
    STAGE_ZERO_ANCHOR.lng,
    locale,
  );
  /**
   * The pool, in order of preference: what position 1 did not print, then
   * what story 4 will not print, then — only if the window is thin — the
   * rows those two modules do show, deduplicated. A page whose place has
   * three dates in its window still gets an example; it just cannot get an
   * unseen one.
   */
  const pool: EventListItem[] = [];
  for (const row of [...rows.place.slice(3), ...rows.nearby.slice(5), ...rows.nearby, ...rows.place]) {
    if (!pool.some((seen) => seen.id === row.id)) pool.push(row);
  }
  /** Only the stories that show a row ask for one — a picture-led story must not eat one. */
  const rowStories = STORIES.filter((story) => story.categories !== undefined);
  const picked = pickStoryExamples(
    pool,
    rowStories.map((story) => story.categories ?? []),
  );
  const storyExamples = new Map(rowStories.map((story, index) => [story.id, picked[index]]));

  /**
   * TS-008 D4's conversion moment, as block 1's own module slot (F-2-61).
   *
   * The offer is the page's **primary** conversion in state B, so the marker
   * sits here and the search below is demoted (TS-008 D4, TS-008-A6); its
   * target is `register-as-publisher`'s own route, carrying the resolved slug
   * (TS-023 D5); and the place name comes from the resolved geo-api
   * community, never from the raw parameter.
   */
  const publishOffer =
    emptyState && stated !== undefined
      ? {
          /** The `h1`: SRC-002's own sentence, which belongs to this page and to no other. */
          headline: fillTemplate(stateB.fields["Headline"] ?? "", { place: stated.name }),
          ctaLabel: ctaLabelOnly(stateB.cta ?? "") ?? "",
          /**
           * The offer's own line, over the button — in the module slot and
           * again in the closing block, which is what "the closing block
           * repeats the primary conversion" means (TS-006 D6). The `h1` says
           * what is true about the place; this says what one date would do,
           * and the two are not the same sentence twice.
           */
          offer: fillTemplate(fieldAt(stateB.blocks, 2) ?? "", { place: stated.name }),
          slug: stated.slug,
        }
      : undefined;

  const homescreenCopy = {
    locale,
    headline: fieldAt(homescreen.blocks, 0) ?? "",
    ios: fieldAt(homescreen.blocks, 1) ?? "",
    android: fieldAt(homescreen.blocks, 2) ?? "",
    ctaTemplate: stateA.cta ?? "",
    genericPlace: copy.genericPlace,
  } as const;

  const search = (primary: boolean) => (
    <PlaceSearch
      typeahead
      hint={copy.searchHint}
      id={primary ? "ort-suche-fokus" : "ort-suche-abschluss"}
      label={copy.searchLabel}
      locale={locale}
      placeholder={copy.searchLabel}
      submitDataCta={primary ? "primary" : undefined}
      to="place"
      tone={primary ? "dark" : "light"}
    />
  );

  /**
   * The page's conversion once a place is known: the calendar handover,
   * repeated verbatim in the closing block (TS-006 D6). It is a link off
   * this origin, so the closing block takes it as a module rather than as a
   * route id — and it takes the **primary treatment** there, like every
   * other page's closing button: as `outbound-link`'s secondary pill it was
   * white on the closing block's own paper and read as indented body text
   * rather than as the thing the page ends on. `data-cta="repeat"` keeps it
   * inside the contrast sweep and out of the one-primary-per-page count
   * (TS-006 D6).
   */
  const handover =
    stated === undefined || publishOffer !== undefined ? undefined : (
      <ConversionTracker
        attributes={{ ...SAVE_CALENDAR, place: stated.slug }}
        goalId={SAVE_CALENDAR.goalId}
        stage={SAVE_CALENDAR.stage}
      >
        <Button
          dataCta="repeat"
          href={calendarUrl(stated)}
          locale={locale}
          onward
          variant="primary-light"
        >
          {fillTemplate(stateA.cta ?? "", { place: stated.name })}
        </Button>
      </ConversionTracker>
    );

  /** The closing block, in whichever state the page is in (G-6, TS-006 D6). */
  const closing =
    publishOffer !== undefined
      ? ({
          to: "register",
          label: publishOffer.ctaLabel,
          query: { ort: publishOffer.slug },
          heading: publishOffer.offer || undefined,
          // The permanence promise is cleared content (`community-calendar`
          // `price.note`, publicly committed since 2022), so it may stand.
          reassurance: fieldAt(permanence.blocks, 0),
        } as const)
      : ({
          variant: "module",
          node: handover ?? search(false),
          heading: fieldAt(permanence.blocks, 1),
          reassurance: fieldAt(permanence.blocks, 0),
        } as const);

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={closing}
      contextBandHeading={fieldAt(slot(page, "dein-ort-9-context-band").blocks, 0)}
      locale={locale}
      meta={PLACE_META}
    >
      {/* Block 1 — the focus block. The `h1` names the place in every state
          and at the same DOM position (TS-020 D5); S0 has no resolved place,
          so the artifact's own sentence carries a generic one instead of
          claiming a village. The search is the conversion only while no
          place is known — once one is, the calendar handover under the rows
          is (G-5), and in state B the publishing offer. */}
      <HeroBlock
        cta={stated === undefined ? search(true) : undefined}
        headline={
          publishOffer?.headline ??
          (stated === undefined
            ? // TS-020 D2 / state/open.md row 93: S0 names no place at all, so
              // it gets its own authored sentence rather than state A's
              // "Das ist los in …" template filled with a generic word.
              (s0Headline ?? fillTemplate(stateA.fields["Headline"] ?? "", { place: copy.genericPlace }))
            : fillTemplate(stateA.fields["Headline"] ?? "", { place: stated.name }))
        }
        id="focus-block"
        // F-2-33: the hero's `photo-surface` badges itself out of the
        // dictionary — without the page's language it marks an English page
        // in German.
        locale={locale}
        notDepicting={heroImage?.notDepicting}
        placeholderId={heroImage?.placeholderId}
        src={heroImage?.src}
        wideSrc={heroImage?.wideSrc}
        // `place-name` is the 50 px display role of SRC-014 §Typography,
        // right for "Das ist los in X"; S0's and state B's full sentences
        // take the Display role instead. Neither is clamped any more (G-8).
        variant={publishOffer === undefined && stated !== undefined ? "place-name" : undefined}
      />

      {/* Block 1, the module slot: TS-008 position 1. `role="status"` is the
          region TS-009 D7 announces the focus-job shift in — it is the frame,
          not the rows, that carries it. In state B the slot carries the
          publish offer instead of an empty date box ("Position 1 is not left
          blank", TS-008 D4) — rendered here rather than inside the cached
          island, because its target carries the resolved slug and its marker
          is the page's primary conversion. */}
      <MotionReveal>
        <SectionShell
          id="place-dates"
          kicker={publishOffer === undefined ? words.kickers.liveAnswer : undefined}
          surface="ink"
          transition={stated === undefined ? copy.s0Transition : undefined}
        >
          {publishOffer === undefined ? (
            <PlaceDatesIsland
              announced
              conversion={SAVE_CALENDAR}
              // S0 shows what an answer looks like — one row, no handover to
              // a place the visitor never asked about. State A answers, and
              // its handover is the page's conversion.
              ctaDataCta={stated === undefined ? undefined : "primary"}
              ctaTemplate={stated === undefined ? undefined : (stateA.cta ?? "")}
              locale={locale}
              // S0's single row is an illustration of "what's on", so it
              // shows the village's own life where the window has some:
              // "so sieht das aus, wenn ein Ort dabei ist" answered by the
              // next bin collection illustrates the wrong thing.
              prefer={stated === undefined ? ["social", "culture", "fest", "official"] : undefined}
              role={stated === undefined ? "story" : "illustrative"}
              rowCount={stated === undefined ? 1 : 3}
              slug={anchor.slug}
              titleHidden={stated !== undefined}
              titleTemplate={stateA.fields["Headline"] ?? ""}
              tone="dark"
            />
          ) : (
            <EmptyStateBlock
              announced
              cta={
                <Button
                  dataCta="primary"
                  locale={locale}
                  onward
                  query={{ ort: publishOffer.slug }}
                  to="register"
                  variant="primary-light"
                >
                  {publishOffer.ctaLabel}
                </Button>
              }
              headline={publishOffer.offer || publishOffer.headline}
            />
          )}
        </SectionShell>
      </MotionReveal>

      {/* Block 2a — the four value stories, one section each. Each opens on
          its role, hands over from the one before it in a single line, shows
          one real date, and closes on the testimonial that belongs to it. */}
      {STORIES.map((story) => {
        const content = slot(page, story.slotId);
        const image = story.imageId === undefined ? undefined : pageImage(page, story.imageId);
        const example = storyExamples.get(story.id);

        return (
          <MotionReveal key={story.id}>
            <SectionShell
              dataBlock="value-story"
              id={story.id}
              kicker={words.kickers.whyItMatters}
              surface={story.surface}
              transition={fieldAt(content.blocks, 2)}
            >
              <ValueStory
                aspect={fieldAt(content.blocks, 0) ?? ""}
                example={
                  example === undefined ? undefined : (
                    <EventRow
                      {...example}
                      locale={locale}
                      state={rows.demo ? "mocked" : "ready"}
                    />
                  )
                }
                exampleLevel="snapshot"
                exampleVariant="row"
                headingLevel="h2"
                media={
                  image === undefined ? undefined : (
                    <MediaFrame
                      alt={image.alt}
                      locale={locale}
                      notDepicting={image.notDepicting}
                      placeholderId={image.placeholderId}
                      ratio="feature"
                      src={image.src}
                    />
                  )
                }
                testimonial={testimonialOf(slot(page, story.quoteSlotId))}
                whyItMatters={fieldAt(content.blocks, 1) ?? ""}
              />
            </SectionShell>
          </MotionReveal>
        );
      })}

      {/* Story 4 *is* TS-008 position 2: the fifteen-minute radius, argued in
          prose and then shown as the five rows from around here, every row
          naming its own place (TS-008 D1). Before the polish pass the module
          stood on its own after the stories, which made it a fifth list. */}
      <MotionReveal>
        <SectionShell
          dataBlock="value-story"
          id="nearby"
          kicker={words.kickers.widerRadius}
          surface="surface"
          transition={fieldAt(radiusStory.blocks, 2)}
        >
          <ValueStory
            aspect={fieldAt(radiusStory.blocks, 0) ?? ""}
            example={
              <NearbyIsland
                conversion={SAVE_CALENDAR}
                headingLevel="h3"
                lat={anchor.lat}
                lng={anchor.lng}
                locale={locale}
                role="answering"
                rowCount={5}
                titleTemplate={copy.nearby}
              />
            }
            exampleLevel="surrounding"
            exampleVariant="module"
            headingLevel="h2"
            testimonial={testimonialOf(slot(page, RADIUS_STORY.quoteSlotId))}
            whyItMatters={fieldAt(radiusStory.blocks, 1) ?? ""}
          />
        </SectionShell>
      </MotionReveal>

      {/* Block 2c — the homescreen block. Both instructions, always, for
          every visitor: no user-agent sniffing, no install probe (TS-020 D4).
          Its action repeats the goal and the target of block 1 in the
          secondary treatment. */}
      <MotionReveal>
        <SectionShell id="homescreen" kicker={words.kickers.howItWorks} surface="lime-500">
          <Homescreen slug={anchor.slug} {...homescreenCopy} />
        </SectionShell>
      </MotionReveal>

      {/* The search, once a place is known: not the page's conversion any
          more, so it is a quiet line above the band rather than the block
          the page ends on. In S0 it is the conversion, and the closing block
          carries it instead. */}
      {stated === undefined ? null : (
        <MotionReveal>
          <SectionShell
            density="tight"
            id="other-place"
            labelledBy="other-place-heading"
            surface="lime-100"
          >
            <h2 id="other-place-heading">{fieldAt(permanence.blocks, 2)}</h2>
            {search(false)}
          </SectionShell>
        </MotionReveal>
      )}
    </PageFrame>
    </>
  );
}
