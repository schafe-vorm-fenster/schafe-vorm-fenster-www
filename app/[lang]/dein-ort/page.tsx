import { Button } from "@/src/components/button/button";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { StoryStage, type StageStory } from "@/src/components/story-stage/story-stage";
import { ValueStory } from "@/src/components/value-story/value-story";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { fieldAt } from "@/src/lib/content/blocks";
import { pageImage } from "@/src/lib/content/images";
import { HERO_IMAGE_ID } from "@/src/lib/pages/hero-images";
import { slot } from "@/src/lib/content/loader";
import { ctaLabelOnly } from "@/src/lib/content/text";
import { fillTemplate, parseDemoProofElement } from "@/src/lib/pages/demo-content";

import { PageJsonLd } from "../_structured-data";
import { pageContent } from "../_content";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";
import { PLACE_META } from "./page.meta";
import {
  OnlyInStateB,
  PlaceClosing,
  PlaceHero,
  PlaceHomescreen,
  PlaceHop,
  PlaceModuleSlot,
  PlaceNearby,
  StoryExample,
  type PlaceCopy,
} from "./place-islands";
import { RADIUS_STORY, STORIES } from "./stories";

import type { QuoteFragment } from "@/src/components/content-fragments";
import type { ContentSlot } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0020 — `/dein-ort` — the reader's page.
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
 * (Q-0014) and the brief decides to render them: they are real, attributed
 * sentences from the hub, and the hardening round before go-live clears
 * them.
 *
 * **Which state renders.** TS-WEB-0020 D2 resolves the place parameter five ways,
 * three of which are states of this page. The page is prerendered once
 * (DEC-0163), so its HTML is **S0** — "the prerendered shell, complete on its
 * own: place search dominant, stories on snapshot examples, counters may
 * render; no empty-state markup, no unresolved skeleton, no 'we could not
 * find you'" (D2, TS-WEB-0020-A10). `?ort=` is read in the browser
 * (`place-islands.tsx`): a covered place moves the page to **state A** (the
 * hero says "Das ist los in {ort}", the module's own heading is read and not
 * seen, the calendar handover under the rows is the conversion) or to
 * **state B** (the publish offer occupies the module slot, TS-WEB-0008 D4, and
 * the primary conversion moves to `register-as-publisher`). An uncovered
 * value never reaches the page: the proxy answers it with a 307 to the
 * founding page (`place-hop.ts`). The live rows themselves load from the BFF
 * in every state.
 *
 * Without JavaScript the page is S0 for every `?ort=` — the owner dropped the
 * no-JS requirement for the place states on 2026-10-13 (DEC-0163 §4).
 *
 * **Page rhythm:** PHOTO hero · ink (the live-data anchor, once) · paper ·
 * lime-100 · paper · surface · lime-500 · (lime-100) · surface · paper.
 */

const ROUTE = "place" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadataFor(ROUTE, params);
}

/**
 * Fallback only. `dein-ort-0-state-s0` carries S0's own headline, the nearby
 * module's place-agnostic heading, the search placeholder (the hint until
 * issue #20 moved its instruction into the field) and the line that hands
 * the reader over to the live module (state/open.md row 93, row 161);
 * `genericPlace` has no field in that slot and stays generated
 * (Dummy-Content, `state/open.md`) — it fills state A/B's own `{place}`
 * template when no place is resolved yet, which is a different sentence from
 * S0's dedicated headline below. The search field's label, placeholder and
 * hint have **no** page-level fallback: `place-search` falls through to the
 * dictionary's `search` block, the one place TS-WEB-0008-A16 keeps under
 * check (DEC-0079 §1 — no surface of the search names a postcode).
 */
const PAGE_COPY: Record<Locale, { genericPlace: string; nearby: string }> = {
  de: { genericPlace: "deinem Ort", nearby: "Diese Woche in der Nähe" },
  en: { genericPlace: "your place", nearby: "This week nearby" },
};

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

export default async function PlacePage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeFrom(params);
  const words = dictionary(locale);
  const page = await pageContent(ROUTE, locale);
  // The hero photograph from the page's image inventory; `undefined` while
  // none exists, and the surface renders its "Foto gesucht" hatch instead.
  const heroImage = pageImage(page, HERO_IMAGE_ID.place);
  const fallbackCopy = PAGE_COPY[locale];
  const stateS0 = slot(page, "dein-ort-0-state-s0");
  const stateA = slot(page, "dein-ort-1-state-a");
  const stateB = slot(page, "dein-ort-2-state-b");
  const homescreen = slot(page, "dein-ort-7-homescreen");
  const permanence = slot(page, "dein-ort-8-permanence");
  const radiusStory = slot(page, RADIUS_STORY.slotId);

  /** S0's placeholder — "Tipp den Ortsnamen ein" (issue #20); `undefined` lets the module use the dictionary's. */
  const s0Placeholder = fieldAt(stateS0.blocks, 3);
  /** State A's "Suche nach einem anderen Ort …" (issue #23). */
  const aPlaceholder = fieldAt(stateA.blocks, 2) ?? s0Placeholder;

  /**
   * Every state's copy, read once here — strings only, because the state is
   * chosen in the browser (`place-islands.tsx`). TS-WEB-0020 D2 / state/open.md
   * row 93: S0 names no place at all, so it gets its own authored sentence
   * rather than state A's "Das ist los in …" filled with a generic word.
   */
  const copy: PlaceCopy = {
    locale,
    s0Headline:
      fieldAt(stateS0.blocks, 0) ??
      fillTemplate(stateA.fields["Headline"] ?? "", { place: fallbackCopy.genericPlace }),
    aHeadline: stateA.fields["Headline"] ?? "",
    aCta: stateA.cta ?? "",
    /** The `h1` of state B: SRC-0002's own sentence. */
    bHeadline: stateB.fields["Headline"] ?? "",
    bCtaLabel: ctaLabelOnly(stateB.cta ?? "") ?? "",
    /**
     * The offer's own line, over the button — in the module slot and again
     * in the closing block, which is what "the closing block repeats the
     * primary conversion" means (TS-WEB-0006 D6).
     */
    bOffer: fieldAt(stateB.blocks, 2) ?? "",
    s0Transition: fieldAt(stateS0.blocks, 4),
  };

  /**
   * The place search, in the stage treatment of issue #20 (TS-WEB-0020-A18).
   * `hero` is the instance in block 1 — S0's conversion and state A's
   * "Suche nach einem anderen Ort …" (issue #23) — and `primary` says whether
   * it carries the page's one `data-cta="primary"`, which it does only in S0:
   * once a place is known the calendar handover under the rows is the
   * conversion (G-5).
   */
  const search = ({
    hero,
    primary,
    placeholder,
  }: {
    readonly hero: boolean;
    readonly primary: boolean;
    readonly placeholder?: string;
  }) => (
    <PlaceSearch
      stage
      typeahead
      id={hero ? "ort-suche-fokus" : "ort-suche-abschluss"}
      locale={locale}
      placeholder={placeholder}
      submitDataCta={primary ? "primary" : undefined}
      to="place"
      tone={hero ? "dark" : "light"}
    />
  );

  /** DEC-0153 — the stage's stories, read off the three story slots. */
  const stage = slot(page, "dein-ort-2b-story-stage");
  const stageStories: StageStory[] = STORIES.map((story) => {
    const content = slot(page, story.slotId);
    const image = story.imageId === undefined ? undefined : pageImage(page, story.imageId);
    const quote = testimonialOf(slot(page, story.quoteSlotId));
    return {
      id: story.id,
      time: fieldAt(content.blocks, 5) ?? "",
      tab: fieldAt(content.blocks, 6) ?? "",
      icon: story.icon,
      headline: fieldAt(content.blocks, 7) ?? fieldAt(content.blocks, 0) ?? "",
      body: fieldAt(content.blocks, 8) ?? fieldAt(content.blocks, 1) ?? "",
      ...(quote ? { quote } : {}),
      ...(image
        ? { photo: { src: image.stageSrc ?? image.src, ...(image.anchor ? { anchor: image.anchor } : {}) } }
        : {}),
      // A date-led story's live example (TS-WEB-0020 D3, A14, DEC-0152),
      // picked in the browser from the anchor's surroundings (DEC-0163).
      ...(story.example ? { example: <StoryExample locale={locale} storyId={story.id} /> } : {}),
    };
  });

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
      <PlaceHop locale={locale} />
    <PageFrame
      closing={{
        variant: "module",
        bare: true,
        node: (
          <PlaceClosing
            copy={copy}
            moduleHeading={fieldAt(permanence.blocks, 1)}
            // The permanence promise is cleared content (`community-calendar`
            // `price.note`, publicly committed since 2022), so it may stand.
            reassurance={fieldAt(permanence.blocks, 0)}
            s0Search={search({ hero: false, primary: false, placeholder: s0Placeholder })}
          />
        ),
      }}
      contextBandHeading={fieldAt(slot(page, "dein-ort-9-context-band").blocks, 0)}
      locale={locale}
      meta={PLACE_META}
    >
      {/* Block 1 — the focus block, in whichever state the place resolves to. */}
      <PlaceHero
        aSearch={search({ hero: true, primary: false, placeholder: aPlaceholder })}
        copy={copy}
        image={{
          src: heroImage?.src,
          wideSrc: heroImage?.wideSrc,
          focal: heroImage?.focal,
          notDepicting: heroImage?.notDepicting,
          placeholderId: heroImage?.placeholderId,
        }}
        s0Search={search({ hero: true, primary: true, placeholder: s0Placeholder })}
      />

      {/* Block 1, the module slot: TS-WEB-0008 position 1. `role="status"` is the
          region TS-WEB-0009 D7 announces the focus-job shift in. */}
      <MotionReveal>
        <PlaceModuleSlot copy={copy} />
      </MotionReveal>

      {/* Story 4 *is* TS-WEB-0008 position 2: the fifteen-minute radius, argued in
          prose and then shown as the five rows from around here, every row
          naming its own place (TS-WEB-0008 D1). */}
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
            example={<PlaceNearby locale={locale} titleTemplate={fieldAt(stateS0.blocks, 1) ?? fallbackCopy.nearby} />}
            exampleLevel="surrounding"
            exampleVariant="module"
            headingLevel="h2"
            testimonial={testimonialOf(slot(page, RADIUS_STORY.quoteSlotId))}
            whyItMatters={fieldAt(radiusStory.blocks, 1) ?? ""}
          />
        </SectionShell>
      </MotionReveal>

      {/* Block 2a — the story stage (DEC-0153): the three single-category
          stories as one module, "ein Tag im Dorf". Each hour carries its
          picture or colour, its quote and one live date of its own category
          (TS-WEB-0020 D3, A14). */}
      <MotionReveal>
        <StoryStage
          action={
            <Button href="#focus-block" onward variant="primary-light">
              {fieldAt(stage.blocks, 3) ?? ""}
            </Button>
          }
          calendarLabel={fieldAt(stage.blocks, 6) ?? ""}
          headline={fieldAt(stage.blocks, 1) ?? ""}
          id="story-stage"
          kicker={fieldAt(stage.blocks, 0) ?? ""}
          lead={fieldAt(stage.blocks, 2)}
          nextTemplate={fieldAt(stage.blocks, 4) ?? "{time}"}
          pickerLabel={fieldAt(stage.blocks, 7) ?? ""}
          restartLabel={fieldAt(stage.blocks, 5) ?? ""}
          stories={stageStories}
        />
      </MotionReveal>

      {/* Block 2c — the homescreen block. Both instructions, always, for
          every visitor: no user-agent sniffing, no install probe (TS-WEB-0020 D4). */}
      <MotionReveal>
        <SectionShell id="homescreen" kicker={words.kickers.howItWorks} surface="lime-500">
          <PlaceHomescreen
            android={fieldAt(homescreen.blocks, 2) ?? ""}
            ctaTemplate={stateA.cta ?? ""}
            headline={fieldAt(homescreen.blocks, 0) ?? ""}
            ios={fieldAt(homescreen.blocks, 1) ?? ""}
            locale={locale}
          />
        </SectionShell>
      </MotionReveal>

      {/* The search, once a place is known and has no dates: state B's stage
          carries the publishing offer and no search, so this quiet line above
          the band is where "a different place?" lives. State A keeps the
          search in the stage itself (issue #23); S0's closing block is the
          search. */}
      <OnlyInStateB>
        <MotionReveal>
          <SectionShell density="tight" id="other-place" labelledBy="other-place-heading" surface="lime-100">
            <h2 id="other-place-heading">{fieldAt(permanence.blocks, 2)}</h2>
            {search({ hero: false, primary: false, placeholder: aPlaceholder })}
          </SectionShell>
        </MotionReveal>
      </OnlyInStateB>
    </PageFrame>
    </>
  );
}
