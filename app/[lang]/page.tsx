import { Button } from "@/src/components/button/button";
import { ExplainModule } from "@/src/components/explain-module/explain-module";
import { StageChat, StageFlyerPhoto } from "@/src/components/explain-stage/explain-stage";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { MediaFrame } from "@/src/components/media-frame/media-frame";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { SceneBlock } from "@/src/components/scene-block/scene-block";
import { WebCalendarOverlay } from "@/src/components/web-calendar-overlay/web-calendar-overlay";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { fieldAt } from "@/src/lib/content/blocks";
import { pageImage } from "@/src/lib/content/images";
import { HERO_IMAGE_ID } from "@/src/lib/pages/hero-images";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot } from "@/src/lib/content/provenance";
import { ctaLabelOnly } from "@/src/lib/content/text";
import { SHOWCASE_COMMUNITY } from "@/src/lib/live/showcase";
import { parseDemoProofElement } from "@/src/lib/pages/demo-content";

/*
 * The WhatsApp scene's mechanism is the same explain module as path 01 of
 * `/mitmachen` (DEC-0109 §1, DEC-0110 §1), fed from the same kind of slot.
 * These four are that page's pure readers and its cached calendar panel —
 * imported rather than copied, so the picture the two pages show of one path
 * cannot drift apart and the step-line contract ("exactly three", D4) is
 * enforced by one tested function. Nothing here is edited by this page.
 */
import { listAt, threeSampleRows, threeSteps } from "./mitmachen/paths";
import { LiveStageCalendar } from "./mitmachen/stage-islands";


import { buildDay } from "./_build-day";
import { FlyerExample, HomeFocusModules, HomeHeroContent, HomeSubmit, type HomeFocusCopy } from "./_home-focus";
import { PlacePhotoLayer } from "./_place-photo";
import { selectProof } from "./_proof";
import { PageJsonLd } from "./_structured-data";
import { pageContent } from "./_content";
import { localeFrom, pageMetadataFor } from "./_locale";
import { PageFrame } from "./_page-frame";
import { HomeScenes } from "./_scenes";
import { HOME_META } from "./page.meta";

import type { ProofCandidate } from "./_proof";
import type { ContentSlot } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0019 — `/` — home.
 *
 * Block order is TS-WEB-0019 D3 and is the DOM order below: focus block ·
 * three scenes, the `whatsapp` one wrapping the explain module (D3a,
 * DEC-0110) and the `provenance` one carrying block 2b · proof stream ·
 * context band · closing CTA, with nothing after the closing CTA inside
 * `main`; the contact section and the footer follow it as chrome
 * (TS-WEB-0019-A9, DEC-0081 §2, `_chrome.tsx`). Blocks 3 and 4 come from
 * `page.meta.ts` through `PageFrame`; this file writes neither.
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
 * show — position 1 (dates in the place) and position 2 (this week nearby) —
 * render here in the `mocked` state with the
 * `Demo-Daten` badge their frames put on themselves, over the invented
 * `Schlatkow`. Block *structure* is therefore identical to
 * the M4 render (TS-WEB-0006-A10); only the data source changes. Each has a
 * `Mock aktiv` row in `state/open.md`.
 *
 * **Page rhythm** (SRC-0014 §Page Rhythm, checked in `page-rhythm.test.ts` by
 * hand and in the home walk's own rhythm test against the DOM): PHOTO hero ·
 * COLOUR ink (the live data anchor) · [surface-2 — S3's widened radius, and
 * only S3's] · paper · lime-100 · violet-500 · lime-100 · surface (the context
 * band) · ink. The three scenes of 2a are the paper · lime-100 · violet-500
 * run: the scene that carries the module is **light**, because the module's
 * active step disc is `lime-500` and "a fill on a light ground means active"
 * (DEC-0129 §11 — it stood on `lime-500` until 2026-09-26, where the disc
 * measured 1.00:1). The second `ink` is the
 * closing search block — the one further ink section a page may carry, and
 * it is the last section (DEC-0117), because a search field has no other
 * legal ground (SRC-0014 §Search field).
 */

const ROUTE = "home" as const;

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
 * Fallback only — `home-12-ui-strings` carries these two short strings
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
  }
> = {
  de: {
    flyerExample: "Aus dem Flyer geworden",
    geo: "Beleg aus der Region",
  },
  en: {
    flyerExample: "Made from the flyer",
    geo: "Proof from the region",
  },
};

/** The two short UI strings, read off `home-12-ui-strings` where the slot
 * has them, falling back to the stand-ins otherwise. */
function uiStringsFrom(uiStrings: ContentSlot, locale: Locale) {
  const fallback = UI_STRING_FALLBACKS[locale];
  return {
    flyerExample: fieldAt(uiStrings.blocks, 0) ?? fallback.flyerExample,
    geo: fieldAt(uiStrings.blocks, 1) ?? fallback.geo,
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
 * Block 1 in TS-WEB-0019 D2's four states (F-2-30), split along DEC-0078's
 * line — and since DEC-0163 resolved in the browser (`_home-focus.tsx`). The
 * page is prerendered once: its HTML is S1, and the hero's trio, the submit
 * and the module slot move to S2/S3 after hydration when `?ort=` names a
 * covered place. The `<form>`, its label and the input stand in this shell,
 * so the input a visitor first sees is the input that stays (row 213).
 */
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeFrom(params);
  const words = dictionary(locale);
  const page = await pageContent(ROUTE, locale);

  const hero = slot(page, "home-1-search-hero");
  const dates = slot(page, "home-2-place-dates");
  const nearby = slot(page, "home-3-place-empty");
  const sceneWhatsapp = slot(page, "home-4-scene-whatsapp");
  const whatsappSteps = slot(page, "home-4a-scene-whatsapp-steps-demo");
  const sceneEmbed = slot(page, "home-5-scene-embed");
  const sceneProvenance = slot(page, "home-6-scene-provenance");
  const stamps = slot(page, "home-7-provenance-stamps");
  const proof = slot(page, "home-8-proof-stream");
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
  const proofKicker = fieldAt(proof.blocks, 0);

  /** The build's day — what the sample panel is dated from in the static HTML (DEC-0163). */
  const referenceDate = await buildDay();

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
      stage
      typeahead
      id={primary ? "ort-suche-fokus" : "ort-suche-abschluss"}
      // Issue #20: the placeholder carries the instruction and the helper
      // line is gone, so the field's name comes from the dictionary ("Dein
      // Ort") — the visible hint goes, the field's label does not.
      locale={locale}
      placeholder={searchPlaceholder}
      // DEC-0078: the hero instance is the one whose `data-cta="primary"`
      // moves with the place, so only that instance hands its submit to a
      // boundary. The closing block's copy keeps the plain default.
      submit={primary ? <HomeSubmit copy={focusCopy} /> : undefined}
      submitLabel={submitLabel}
      to="place"
      /*
       * Both instances take the dark treatment, because both stand on a
       * dark ground: the hero over its scrim, the closing block on `ink`.
       * SRC-0014 §"Search field" has exactly two variants and no third —
       * "a search field only ever sits on a photo surface or on the `ink`
       * section" — and the closing block shipped white on white, which is
       * the defect that rule was rewritten for.
       */
      tone="dark"
    />
  );

  const heroImage = pageImage(page, HERO_IMAGE_ID.home);
  const focusCopy: HomeFocusCopy = {
    locale,
    s1Headline: hero.fields["Headline"] ?? "",
    submitLabel,
    datesHeadline: dates.fields["Headline"] ?? "",
    datesCta: dates.cta ?? "",
    handoffQuestion: fieldAt(dates.blocks, 2) ?? "",
    handoffCta: fieldAt(dates.blocks, 3) ?? "",
    nearbyHeading: fieldAt(nearby.blocks, 0) ?? "",
    invitation: fieldAt(nearby.blocks, 1) ?? "",
    publishCta: ctaLabelOnly(nearby.cta ?? fieldAt(nearby.blocks, 2) ?? "") ?? "",
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
        /* The one further `ink` section a page may carry, and it is the
           page's last (SRC-0014 §Page Rhythm, DEC-0117): a search field has
           no other legal ground, so the reader meets the same shape here
           that she met in the hero. */
        surface: "ink",
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
        content={<HomeHeroContent copy={focusCopy} />}
        focal={heroImage?.focal}
        heroSize="home"
        id="focus-block"
        // F-2-33: the surface badges itself out of the dictionary, so it
        // needs the page's language or it badges an English page in German.
        locale={locale}
        aiEdited={heroImage?.aiEdited} notDepicting={heroImage?.notDepicting}
        // DEC-0167 — with a place, the stage shows that place's photograph.
        photoLayer={<PlacePhotoLayer locale={locale} ownPhotoPlace={heroImage?.place} />}
        placeholderId={heroImage?.placeholderId}
        search={search(true)}
        src={heroImage?.src}
        wideSrc={heroImage?.wideSrc}
      />
      <HomeFocusModules copy={focusCopy} search={search(false)} />
      {/* Block 2a — three scenes, one mechanism each (TS-WEB-0006 D7), all
          three declaring `data-block="scene"` (TS-WEB-0019-A6). The record
          below is written in the `direct` order of TS-WEB-0019 D3a, and
          `HomeScenes` is what re-orders it per entry trait: the read of the
          proxy's handover sits inside a `<Suspense>` boundary whose fallback
          **is** this order, so the shell stays prerendered and a visitor
          without an entry context sees it unchanged (`_scenes.tsx`, DEC-0140).
          The record's keys are the mechanisms, so no trait can reach inside a
          scene, and none changes which one carries the module (D3a).

          Each block carries exactly one CTA at secondary treatment, pointing
          at the page that owns its job (D3a, DEC-0082 §4). In the `whatsapp`
          block that CTA is the **module's own** and the scene adds none —
          "wrapping does not double the CTA" (DEC-0110 §1). */}
      <HomeScenes
        scenes={{
          whatsapp: (
            <>
              <MotionReveal>
                <SectionShell
                  dataBlock="scene"
                  id="scene-1"
                  kicker={fieldAt(sceneWhatsapp.blocks, 1)}
                  /* A light ground, because the module inside it only reads on one.
                     The active step's disc is `lime-500` and the two inactive ones
                     are `surface` — "a fill on a light ground means active"
                     (design-system contract `active-step`,
                     website-design-system.md:560), and the step rows are divided by
                     the `line` hairline, which the brand tokens themselves note
                     disappears on a lime ground (1.27:1). On `lime-500` the active
                     disc was 1.00:1 against its own section and the *inactive* discs
                     were the only visible ones, which inverts the state reading.
                     TS-WEB-0019 D3a assumes exactly this: "the active step is
                     `lime-500` on a light ground" (DEC-0129 §11). */
                  surface="paper"
                  transition={fieldAt(sceneWhatsapp.blocks, 2)}
                >
                  {/* No body: the module's three step lines say what the paragraph
                      said, and a line that repeats the previous one is cut, not
                      softened (SRC-0017 CG-007/CG-016 — the review asks for exactly
                      this substitution). It is also what brings the section back
                      inside the 1270 px budget of polish brief G-4. */}
                  <SceneBlock
                    instance={
                      /* The outcome, not a list (polish brief, page 1, fix 3):
                         one real date, under the line that says what it is,
                         loaded in the browser (DEC-0163, `_home-focus.tsx`). */
                      <FlyerExample heading={demo.flyerExample} locale={locale} />
                    }
                    locale={locale}
                    mechanism="whatsapp"
                    /* D7 item 2 — the mechanism, rendered by the module of
                       TS-WEB-0022 D4, unchanged as a component (DEC-0110 §1). Its
                       `data-demo` wrapper marks the three step lines, which are the
                       2026-09-23 draft's and nobody's writing yet; the module title
                       and the CTA label are `/mitmachen`'s own wording and are
                       over-marked with them, the same trade the path modules take. */
                    module={
                      <div data-demo={isDemoSlot(whatsappSteps) ? "true" : undefined} data-scene-module="">
                        <ExplainModule
                          cta={{
                            label: ctaLabelOnly(sceneWhatsapp.cta ?? "") ?? "",
                            locale,
                            onward: true,
                            to: "takePart",
                          }}
                          locale={locale}
                          mechanism="whatsapp"
                          ordinal={1}
                          stage={[
                            // State 1 — the flyer photographed with the phone, drawn:
                            // an illustration of the step rather than the grey panel
                            // that stood in for a photograph nobody took (issue #26,
                            // DEC-0161).
                            <StageFlyerPhoto key="1" />,
                            <StageChat
                              key="2"
                              locale={locale}
                              reply={fieldAt(whatsappSteps.blocks, 1) ?? ""}
                              time={fieldAt(whatsappSteps.blocks, 2) ?? ""}
                            />,
                            // State 3 — "the date is in the calendar", and the
                            // calendar it means is the one this page's live rows come
                            // from: the same interface module through the same cache
                            // profile, so the picture and the live block above it can
                            // never disagree about a place's dates (DEC-0115).
                            <LiveStageCalendar
                              key="3"
                              locale={locale}
                              place={SHOWCASE_COMMUNITY.name}
                              referenceDate={referenceDate}
                              sample={threeSampleRows(
                                listAt(whatsappSteps.blocks, 1),
                                "home-4a-scene-whatsapp-steps-demo",
                              )}
                              slug={SHOWCASE_COMMUNITY.slug}
                            />,
                          ]}
                          steps={threeSteps(
                            listAt(whatsappSteps.blocks, 0),
                            "home-4a-scene-whatsapp-steps-demo",
                          )}
                          title={fieldAt(sceneWhatsapp.blocks, 3) ?? ""}
                        />
                      </div>
                    }
                    opener={fieldAt(sceneWhatsapp.blocks, 0) ?? ""}
                  />
                </SectionShell>
              </MotionReveal>
            </>
          ),
          embed: (
            <>
              {/* The embed scene's photograph runs full-bleed: the section gives up
                  its container and the scene puts it back around everything but the
                  instance. A photograph framed by the section's 16 px padding is a
                  picture in a mount and the section stops being a surface (SRC-0014
                  §"Section grounds carry rhythm, not meaning"). The ground moved with
                  it — `surface-2` is one of the sober greys the design system keeps
                  for the municipal argument and for inactive things, and this is
                  solution content, which takes a fresh ground. `lime-100` and not
                  `paper`, because the scene before it is now `paper` for its module's
                  sake: with the S3 widening block (`surface-2`) above them, three
                  neutral grounds would stand in a row and `checkRhythm`'s family rule
                  allows two (DEC-0129 §11). */}
              <MotionReveal>
                <SectionShell
                  contained={false}
                  dataBlock="scene"
                  id="scene-2"
                  kicker={fieldAt(sceneEmbed.blocks, 2)}
                  surface="lime-100"
                  transition={fieldAt(sceneEmbed.blocks, 3)}
                >
                  <SceneBlock
                    bleed
                    body={fieldAt(sceneEmbed.blocks, 1)}
                    cta={
                      <Button
                        dataCta="secondary"
                        locale={locale}
                        onward
                        to="calendar"
                        variant="secondary"
                      >
                        {ctaLabelOnly(sceneEmbed.cta ?? "") ?? ""}
                      </Button>
                    }
                    instance={
                      /* #32, DEC-0162 §5: a drawing of the website calendar lies
                         over the town-hall photograph, so the scene says "a
                         calendar on your website" at a glance. The drawing is
                         decorative; the photograph's `alt` names both. */
                      <WebCalendarOverlay>
                        <MediaFrame
                          alt={sceneEmbedImage?.alt ?? ""}
                          locale={locale}
                          aiEdited={sceneEmbedImage?.aiEdited} notDepicting={sceneEmbedImage?.notDepicting}
                          placeholderId={sceneEmbedImage?.placeholderId}
                          /* 16 : 9 across the section's whole width — the review's own
                             shape for this photograph ("auf die volle Breite in 16:9
                             oder 21:9 ziehen"); `map` is that ratio token. */
                          ratio="map"
                          sizes="100vw"
                          src={sceneEmbedImage?.src}
                          state={sceneEmbedImage ? undefined : "empty"}
                        />
                      </WebCalendarOverlay>
                    }
                    locale={locale}
                    mechanism="embed"
                    opener={fieldAt(sceneEmbed.blocks, 0) ?? ""}
                  />
                </SectionShell>
              </MotionReveal>
            </>
          ),
          provenance: (
            <>
              {/* Block 2b — where this comes from. The scene *is* the provenance
                  block since the polish pass (page 1, fix 5): the origin stamp that
                  used to stand under it as its own element is gone, because "gebaut"
                  and "betrieben" about this product are on the copy guide's avoid
                  list (CG-033, CG-040) and the 2026-09-22 review strikes the stamp.
                  What the slot still carries is the way to `/ueber-uns`, which is
                  this scene's one secondary CTA — a button, not a link, because the
                  review asked for one (DEC-0129). The scene carries no kicker: "Wo
                  das herkommt" is on the avoid list and the review names no
                  replacement, so the heading carries the scene alone. */}
              <MotionReveal>
                <SectionShell
                  /* #35, DEC-0162 §6: the photograph runs to the edge like the
                     embed scene's — "Images inside a colour section run
                     full-bleed" (SRC-0014 §Section grounds). The section gives
                     up its container and the scene puts it back around the text. */
                  contained={false}
                  dataBlock="scene"
                  id="scene-3"
                  /* TS-WEB-0019 D3's own rhythm column for block 2b: COLOUR violet. */
                  surface="violet-500"
                  transition={fieldAt(sceneProvenance.blocks, 2)}
                >
                  <SceneBlock
                    bleed
                    body={fieldAt(sceneProvenance.blocks, 1)}
                    cta={
                      <Button dataCta="secondary" locale={locale} onward to="about" variant="secondary">
                        {ctaLabelOnly(fieldAt(stamps.blocks, 0) ?? "") ?? ""}
                      </Button>
                    }
                    instance={
                      <MediaFrame
                        alt={sceneProvenanceImage?.alt ?? fieldAt(sceneProvenance.blocks, 0) ?? ""}
                        locale={locale}
                        aiEdited={sceneProvenanceImage?.aiEdited} notDepicting={sceneProvenanceImage?.notDepicting}
                        placeholderId={sceneProvenanceImage?.placeholderId}
                        /* Full width at every tier, 16 : 9 like the embed scene's
                           photograph: 7 : 5 across a desktop viewport would be
                           taller than the screen. */
                        ratio="map"
                        sizes="100vw"
                        src={sceneProvenanceImage?.src}
                      />
                    }
                    locale={locale}
                    mechanism="provenance"
                    opener={fieldAt(sceneProvenance.blocks, 0) ?? ""}
                  />
                </SectionShell>
              </MotionReveal>
            </>
          ),
        }}
      />

      {/* Block 2c — the proof stream. Exactly five elements (DEC-0048); while
          no selection is cleared (Q-0014/Q-0045) the five demo cards the
          content artifact itself carries stand in, each badged. */}
      <MotionReveal>
        <SectionShell
          id="proof-stream"
          kicker={words.kickers.othersSay}
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
