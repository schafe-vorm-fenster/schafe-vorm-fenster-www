import { EventList } from "@/src/components/event-list/event-list";
import { EventRow } from "@/src/components/event-row/event-row";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { HowtoBlock } from "@/src/components/howto-block/howto-block";
import { LiveModuleFrame } from "@/src/components/live-module-frame/live-module-frame";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { ValueStory } from "@/src/components/value-story/value-story";
import { fieldAt } from "@/src/lib/content/blocks";
import { loadPage, slot } from "@/src/lib/content/loader";
import { resolveLocale } from "@/src/lib/i18n/locales";
import { fillTemplate, splitSteps } from "@/src/lib/pages/demo-content";
import {
  DEMO_PLACE,
  demoAppHref,
  demoNearbyEvents,
  demoPlaceEvents,
} from "@/src/lib/pages/demo-data";
import { pageMetadata } from "@/src/lib/routes/metadata";

import heroPlaceholder from "@/src/generated/placeholders/dein-ort/hero.svg";

import { localeFrom } from "../_locale";
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
 * find you'" (D2, TS-020-A10). States A and B need the resolved place of
 * `/api/places/{slug}/events`, which M4 wires; nothing here fetches.
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadata(ROUTE, resolveLocale((await params).lang));
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

export default async function PlacePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = await localeFrom(params);
  const page = await loadPage(ROUTE, locale);
  const copy = PAGE_COPY[locale];
  const place = DEMO_PLACE.name[locale];

  const stateA = slot(page, "dein-ort-1-state-a");
  const stories = [
    slot(page, "dein-ort-3-story-baeckerwagen"),
    slot(page, "dein-ort-4-story-ratssitzung"),
    slot(page, "dein-ort-5-story-kultur"),
    slot(page, "dein-ort-6-story-radius"),
  ];
  const homescreen = slot(page, "dein-ort-7-homescreen");
  const permanence = slot(page, "dein-ort-8-permanence");

  const placeEvents = demoPlaceEvents(locale);
  const nearbyEvents = demoNearbyEvents(locale);

  /** One demo row per story — the snapshot rung of the example ladder (TS-020 D3). */
  const storyExamples: readonly EventListItem[] = [
    placeEvents[1], // the bakery van
    placeEvents[2], // the council meeting
    nearbyEvents[2], // the exhibition — culture, and from the surroundings
    nearbyEvents[0], // the fifteen-minute radius, a row naming its own place
  ];

  const handoverLabel = fillTemplate(stateA.cta ?? "", { place });

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
          <LiveModuleFrame
            announced
            cta={
              <OutboundLink href={demoAppHref()} variant="secondary">
                {handoverLabel}
              </OutboundLink>
            }
            headingLevel="h2"
            state="mocked"
            title={fillTemplate(stateA.fields["Headline"] ?? "", { place })}
          >
            <EventList
              items={placeEvents}
              locale={locale}
              rowCount={3}
              state="mocked"
              tone="dark"
            />
          </LiveModuleFrame>
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
                <EventRow
                  {...storyExamples[index]}
                  locale={locale}
                  state="mocked"
                />
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
          <LiveModuleFrame headingLevel="h2" state="mocked" title={copy.nearby}>
            <EventList items={nearbyEvents} locale={locale} rowCount={5} state="mocked" />
          </LiveModuleFrame>
        </SectionShell>
      </MotionReveal>

      {/* Block 2c — the homescreen block. Both instructions, always, for
          every visitor: no user-agent sniffing, no install probe (TS-020 D4).
          Its action repeats the goal and the target of block 1 in the
          secondary treatment. */}
      <MotionReveal>
        <SectionShell id="homescreen" surface="lime-500">
          <HowtoBlock
            android={{ steps: splitSteps(fillTemplate(fieldAt(homescreen.blocks, 2) ?? "", { place })) }}
            appHref={demoAppHref()}
            appLinkLabel={handoverLabel}
            headline={fieldAt(homescreen.blocks, 0) ?? ""}
            ios={{ steps: splitSteps(fillTemplate(fieldAt(homescreen.blocks, 1) ?? "", { place })) }}
          />
        </SectionShell>
      </MotionReveal>
    </PageFrame>
  );
}
