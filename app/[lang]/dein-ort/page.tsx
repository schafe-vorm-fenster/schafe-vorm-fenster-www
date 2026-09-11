import { EventRow } from "@/src/components/event-row/event-row";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { HowtoBlock } from "@/src/components/howto-block/howto-block";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { ValueStory } from "@/src/components/value-story/value-story";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { ctaLabelOnly } from "@/src/lib/content/text";
import { fillTemplate, splitSteps } from "@/src/lib/pages/demo-content";
import { STAGE_ZERO_ANCHOR, resolveAnchorPlace } from "@/src/lib/pages/live-anchor";
import { readPlaceParameter } from "@/src/lib/pages/place-parameter";
import { cacheLife, cacheTag } from "next/cache";

import { calendarUrl } from "@/src/lib/live/app-handover";
import { cacheLifeProfile, cacheTags } from "@/src/lib/live/cache-profiles";
import { resolvePlace } from "@/src/lib/live/places";
import { href } from "@/src/lib/routes/routes";

import heroPlaceholder from "@/src/generated/placeholders/dein-ort/hero.svg";

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
 * The copy S0 needs and the artifact does not carry — it writes state A and
 * state B, both of which name a place. Generated, in the tone of voice, with
 * a `Dummy-Content` row in `state/open.md`.
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
  const copy = PAGE_COPY[locale];

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
  const stated = await resolveAnchorPlace(readPlaceParameter((await searchParams)["ort"]));
  const anchor = stated ?? STAGE_ZERO_ANCHOR;

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
   * TS-008 D4's conversion moment, as the module's own empty state: a
   * **covered** place with no dates yet gets the publish invitation in the
   * module slot, and the focus job shifts (`page.meta.ts`'s `emptyState`).
   */
  const invitation = {
    // `{place}` stays a template: the island fills it with the place the
    // envelope resolved, which is the only place name this page may claim.
    headline: stateB.fields["Headline"] ?? "",
    lead: fieldAt(stateB.blocks, 1),
    ctaLabel: ctaLabelOnly(stateB.cta ?? "") ?? "",
    ctaTo: "takePart",
  } as const;

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
      closing={{
        variant: "module",
        node: search(false),
        // The permanence promise is cleared content (`community-calendar`
        // `price.note`, publicly committed since 2022), so it may stand.
        reassurance: fieldAt(permanence.blocks, 0),
      }}
      locale={locale}
      meta={PLACE_META}
    >
      {/* Block 1 — the focus block. The `h1` is the place name in every
          state and at the same DOM position (TS-020 D5); S0 has no resolved
          place, so the artifact's own sentence carries a generic one instead
          of claiming a village. */}
      <HeroBlock
        cta={search(true)}
        headline={fillTemplate(stateA.fields["Headline"] ?? "", { place: copy.genericPlace })}
        id="focus-block"
        notDepicting
        placeholderId="dein-ort/hero"
        src={heroPlaceholder.src}
        variant="place-name"
      />

      {/* Block 1, the module slot: TS-008 position 1. `role="status"` is the
          region TS-009 D7 announces the focus-job shift in — it is the frame,
          not the rows, that carries it. */}
      <MotionReveal>
        <SectionShell id="place-dates" surface="ink">
          <PlaceDatesIsland
            announced
            conversion={SAVE_CALENDAR}
            ctaTemplate={stateA.cta ?? ""}
            invitation={invitation}
            locale={locale}
            rowCount={3}
            slug={anchor.slug}
            titleTemplate={stateA.fields["Headline"] ?? ""}
            tone="dark"
          />
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
