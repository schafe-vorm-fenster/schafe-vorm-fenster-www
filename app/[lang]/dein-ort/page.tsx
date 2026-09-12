import { Button } from "@/src/components/button/button";
import { EmptyStateBlock } from "@/src/components/empty-state-block/empty-state-block";
import { EventRow } from "@/src/components/event-row/event-row";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { HowtoBlock } from "@/src/components/howto-block/howto-block";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { ValueStory } from "@/src/components/value-story/value-story";
import { fieldAt } from "@/src/lib/content/blocks";
import { pageImage } from "@/src/lib/content/images";
import { slot } from "@/src/lib/content/loader";
import { ctaLabelOnly } from "@/src/lib/content/text";
import { fillTemplate, splitSteps } from "@/src/lib/pages/demo-content";
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

import type { EventListItem } from "@/src/components/event-list/event-list";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-020 — `/dein-ort` — the reader's page.
 *
 * Blocks per TS-020 D1, in DOM order: focus block · four value stories ·
 * this week nearby · homescreen block · context band · closing CTA. Blocks 3
 * and 4 come from `page.meta.ts` through `PageFrame`.
 *
 * **Which state renders: S0.** TS-020 D2 resolves the place parameter five
 * ways, three of which are states of this page. Without `?ort=` and without
 * a known community the page is **S0** — "the prerendered shell, complete on
 * its own: place search dominant, stories on snapshot examples, counters may
 * render; **no empty-state markup**, no unresolved skeleton, no 'we could not
 * find you'" (D2, TS-020-A10).
 *
 * S0 is literally the **prerendered shell**: the two live modules are cached
 * islands anchored on the stage-0 reference community, and they sit in the
 * `<Suspense>` *fallback* position. `?ort=` is read only inside the boundary
 * (`StatedPlaceDates`/`StatedNearby`, `_islands.tsx`), so state A and state B
 * stream over a page that was already complete without them — which is what
 * keeps this route prerenderable while still answering a stated place
 * (TS-009 D1/D2, TS-010 D8).
 *
 * Consequences of S0 that this file makes explicit:
 *
 *  - the one `data-cta="primary"` sits on the **search submit**, which is
 *    TS-006 D4's own row for "no location known"; the calendar handover of
 *    TS-020 D4 cannot be exercised while no place is known;
 *  - `empty-state-block` is **not** rendered — it is state B's, and A10
 *    forbids empty-state markup in S0. The one `himbeere` element of the
 *    design system belongs to that block, so S0 spends none;
 *  - the live modules render their `mocked` state over
 *    `Beispielgemeinde Musterdorf`, badged `Demo-Daten` (the mock rule),
 *    so both are visible as the functions they are.
 *
 * **The four value stories render three-part.** Every testimonial candidate
 * is `usage_rights: unverified` (Q-014), and TS-020-A6 is explicit: no quote
 * component, no attributed sentence, no paraphrase anywhere in blocks 2a.
 * The content artifact additionally ships four *generated* demo testimonials
 * (state/open.md #47) — rendering them would violate A6, so they stay
 * unrendered and the contradiction is an open row, not a silent choice.
 *
 * **Page rhythm:** PHOTO hero · ink (the live-data anchor, once) · paper ·
 * lime-100 · lime-500 · surface · paper.
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
 * that opens this place's calendar on `app.*`. Two of them on this page (the
 * module's onward link and the homescreen block's action), both the same
 * goal at the same stage, each fired by its own click — never on render.
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
 * Fallback only. `dein-ort-0-state-s0` now carries S0's own headline, the
 * nearby module's place-agnostic heading, its example badge and the search
 * hint (state/open.md row 93, row 161); `searchLabel` and `genericPlace`
 * have no field in that slot and stay generated (Dummy-Content,
 * `state/open.md`) — `genericPlace` fills state A/B's own `{place}`
 * template when no place is resolved yet, which is a different sentence
 * from S0's dedicated headline below.
 */
const PAGE_COPY: Record<
  Locale,
  {
    genericPlace: string;
    nearby: string;
    example: string;
    searchLabel: string;
    searchHint: string;
  }
> = {
  de: {
    genericPlace: "deinem Ort",
    nearby: "Diese Woche in der Nähe",
    example: "Beispiel",
    searchLabel: "Deine Postleitzahl",
    searchHint: "Suche nach Ortsnamen kommt noch dazu — bis dahin reicht die Postleitzahl.",
  },
  en: {
    genericPlace: "your place",
    nearby: "This week nearby",
    example: "Example",
    searchLabel: "Your postcode",
    searchHint: "Search by place name is coming — until then, the postcode works fine.",
  },
};


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
  const page = await pageContent(ROUTE, locale);
  // The hero photograph from the page's image inventory; `undefined` while
  // none exists, and the surface renders its "Foto gesucht" hatch instead.
  const heroImage = pageImage(page, "dein-ort-hero");
  const fallbackCopy = PAGE_COPY[locale];
  const stateS0 = slot(page, "dein-ort-0-state-s0");
  const s0Headline = fieldAt(stateS0.blocks, 0);
  const copy = {
    ...fallbackCopy,
    nearby: fieldAt(stateS0.blocks, 1) ?? fallbackCopy.nearby,
    example: fieldAt(stateS0.blocks, 2) ?? fallbackCopy.example,
    searchHint: fieldAt(stateS0.blocks, 3) ?? fallbackCopy.searchHint,
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
   * is **not this page**. Before F-2-30 the `uncovered` outcome was produced
   * by `src/lib/live/places.ts` and consumed by nothing, so a resident typing
   * her own uncovered postcode was shown a village she had never heard of and
   * told what was on there. One hop, the query carried verbatim (TS-021 D4
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
  const stories = [
    slot(page, "dein-ort-3-story-baeckerwagen"),
    slot(page, "dein-ort-4-story-ratssitzung"),
    slot(page, "dein-ort-5-story-kultur"),
    slot(page, "dein-ort-6-story-radius"),
  ];
  const homescreen = slot(page, "dein-ort-7-homescreen");
  const permanence = slot(page, "dein-ort-8-permanence");

  // The story examples are real rows off the live layer, cached rather than
  // suspended: they stand inside prose, where a skeleton would read as a
  // broken paragraph rather than as arriving data (TS-020 D3's example
  // ladder, snapshot rung).
  const rows = await exampleRows(
    STAGE_ZERO_ANCHOR.slug,
    STAGE_ZERO_ANCHOR.lat,
    STAGE_ZERO_ANCHOR.lng,
    locale,
  );
  const storyExamples: readonly (EventListItem | undefined)[] = [
    rows.place[1],
    rows.place[2],
    rows.nearby[2],
    rows.nearby[0],
  ];

  /**
   * TS-008 D4's conversion moment, as block 1's own module slot (F-2-61).
   *
   * Three things the round-2 render got wrong and this composition fixes:
   *
   *  - the offer is the page's **primary** conversion in state B, so the
   *    marker sits here and the search below is demoted (TS-008 D4,
   *    TS-008-A6);
   *  - its target is `register-as-publisher`'s own route, carrying the
   *    resolved slug — TS-023 D5 names "the `/dein-ort` empty state" as one
   *    of the four surfaces `?ort=` arrives at `/mitmachen/registrieren`
   *    from, and only a resolved community slug ever travels (TS-008 D4);
   *  - the lead is the artifact's own sentence, not the `→ \`/mitmachen\``
   *    routing note that stood next to the CTA label and shipped its
   *    backticks and its arrow as visitor copy.
   *
   * The place name comes from the resolved geo-api community, never from the
   * raw parameter (TS-008 D4).
   */
  const publishOffer =
    emptyState && stated !== undefined
      ? {
          headline: fillTemplate(stateB.fields["Headline"] ?? "", { place: stated.name }),
          ctaLabel: ctaLabelOnly(stateB.cta ?? "") ?? "",
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

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      heroPhoto={heroImage?.src !== undefined}
      closing={
        // TS-020 D2, block 4: the closing CTA repeats block 1's primary of
        // the *current* state — the publishing offer in B, the search
        // everywhere else (TS-006 D6).
        publishOffer === undefined
          ? {
              variant: "module",
              node: search(false),
              // The permanence promise is cleared content (`community-calendar`
              // `price.note`, publicly committed since 2022), so it may stand.
              reassurance: fieldAt(permanence.blocks, 0),
            }
          : {
              to: "register",
              label: publishOffer.ctaLabel,
              query: { ort: publishOffer.slug },
              reassurance: fieldAt(permanence.blocks, 0),
            }
      }
      contextBandHeading={fieldAt(slot(page, "dein-ort-9-context-band").blocks, 0)}
      locale={locale}
      meta={PLACE_META}
    >
      {/* Block 1 — the focus block. The `h1` is the place name in every
          state and at the same DOM position (TS-020 D5); S0 has no resolved
          place, so the artifact's own sentence carries a generic one instead
          of claiming a village. In state B the search is demoted: the one
          `data-cta="primary"` moves to the publishing offer below (TS-008
          D4). */}
      <HeroBlock
        cta={search(publishOffer === undefined)}
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
        // `place-name` clamps to two display lines, which is right for
        // "Das ist los in X" and wrong for state B's full sentence.
        variant={publishOffer === undefined ? "place-name" : undefined}
      />

      {/* Block 1, the module slot: TS-008 position 1. `role="status"` is the
          region TS-009 D7 announces the focus-job shift in — it is the frame,
          not the rows, that carries it. In state B the slot carries the
          publish offer instead of an empty date box ("Position 1 is not left
          blank", TS-008 D4) — rendered here rather than inside the cached
          island, because its target carries the resolved slug and its marker
          is the page's primary conversion. */}
      <MotionReveal>
        <SectionShell id="place-dates" surface="ink">
          {publishOffer === undefined ? (
            <PlaceDatesIsland
              announced
              conversion={SAVE_CALENDAR}
              ctaTemplate={stateA.cta ?? ""}
              locale={locale}
              rowCount={3}
              slug={anchor.slug}
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
              headline={publishOffer.headline}
            />
          )}
        </SectionShell>
      </MotionReveal>

      {/* Block 2a — the four value stories. All four always render; the
          testimonial slot is absent, not empty, while no quote is cleared. */}
      <MotionReveal>
        {/* No heading of its own: each story is its own `h2`, so the section
            introduces nothing the stories do not already say. */}
        <SectionShell id="value-stories" surface="paper">
          {stories.map((story, index) => (
            <ValueStory
              aspect={fieldAt(story.blocks, 0) ?? ""}
              example={
                storyExamples[index] === undefined ? undefined : (
                  <EventRow
                    {...storyExamples[index]}
                    locale={locale}
                    state={rows.demo ? "mocked" : "ready"}
                  />
                )
              }
              exampleLabel={copy.example}
              exampleLevel="snapshot"
              exampleVariant="row"
              headingLevel="h2"
              key={story.id}
              whyItMatters={fieldAt(story.blocks, 1) ?? ""}
            />
          ))}
        </SectionShell>
      </MotionReveal>

      {/* Block 2b — TS-008 position 2, under its own radius label, every row
          naming its own place. */}
      <MotionReveal>
        <SectionShell id="nearby" surface="lime-100">
          <NearbyIsland
            lat={anchor.lat}
            lng={anchor.lng}
            locale={locale}
            rowCount={5}
            titleTemplate={copy.nearby}
          />
        </SectionShell>
      </MotionReveal>

      {/* Block 2c — the homescreen block. Both instructions, always, for
          every visitor: no user-agent sniffing, no install probe (TS-020 D4).
          Its action repeats the goal and the target of block 1 in the
          secondary treatment. */}
      <MotionReveal>
        <SectionShell id="homescreen" surface="lime-500">
          <Homescreen slug={anchor.slug} {...homescreenCopy} />
        </SectionShell>
      </MotionReveal>
    </PageFrame>
    </>
  );
}
