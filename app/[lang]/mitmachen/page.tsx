import { ArchiveBlock } from "@/src/components/archive-block/archive-block";
import { Button } from "@/src/components/button/button";
import { ExplainModule } from "@/src/components/explain-module/explain-module";
import {
  StageChat,
  StageImage,
  StageRegistration,
} from "@/src/components/explain-stage/explain-stage";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { HintBanner } from "@/src/components/hint-banner/hint-banner";
import { ObjectionList } from "@/src/components/objection-list/objection-list";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { RouteLink } from "@/src/components/route-link/route-link";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { StatusBadge } from "@/src/components/status-badge/status-badge";
import { contactHref } from "@/src/lib/contact/contact-channels";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { fieldAt } from "@/src/lib/content/blocks";
import { pageImage } from "@/src/lib/content/images";
import { HERO_IMAGE_ID } from "@/src/lib/pages/hero-images";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot, slotState } from "@/src/lib/content/provenance";
import { parseDemoProofElement } from "@/src/lib/pages/demo-content";
import { STAGE_ZERO_ANCHOR } from "@/src/lib/pages/live-anchor";
import { SHOWCASE_COMMUNITY } from "@/src/lib/live/showcase";
import { standardSources } from "@/src/lib/pricing/standard-sources";
import { pageTitle } from "@/src/lib/routes/metadata";

import { PlaceDatesIsland } from "../_islands";
import { selectProof } from "../_proof";
import { PageJsonLd } from "../_structured-data";
import { pageContent } from "../_content";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";

import { REFERENCE_PLACE, selectExamplePlace } from "./example-place";
import { pageMeta } from "./page.meta";
import { listAt, splitCoreDetail, threeSampleRows, threeSteps } from "./paths";
import { LiveStageCalendar, SampleStageCalendar } from "./stage-islands";

import type { ExplainModuleProps } from "@/src/components/explain-module/explain-module";
import type { ContentBlock } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0022 — `/mitmachen`, the publishing entry.
 *
 * Own blocks, in D2 order: hero (the page's one scene) → objections → the
 * `wege` slot, which is the three **bare** explain modules plus the price
 * boundary and the one cross-reference D9 allows → live example (ink, the
 * page's single dark section, D10) → proof. The context band and the closing
 * CTA are block 3/4 of TS-WEB-0006 D2 and are rendered by `PageFrame` from
 * `page.meta.ts` — this page never renders them itself.
 *
 * Three things changed with DEC-0124 and are worth saying here, because each
 * of them looks like a mistake from the outside:
 *
 *  - **The path blocks are `explain-module`s and carry no scene.** On `/` the
 *    scene wraps the module because the module *is* the job introduction;
 *    here the hero is, so wrapping them would mint three openers and three
 *    instances (DEC-0110 §3, D4 "One appearance", A4).
 *  - **One `wege` slot, three sections.** D2 counts one slot and A17 wants
 *    the banner "inside the publishing-path slot"; G-4 caps a section at 1.5
 *    phone screens and `e2e/section-budget.spec.ts` holds it. Three grounds
 *    carry one slot: the kicker, the heading and the sub-line stand once, on
 *    the first, and all three sections are `data-block="wege"`.
 *  - **The step lines are marked `data-demo`.** They are the design drafts'
 *    wording, not the owner's (`*-steps-demo` slots, DEC-0068, state/open.md).
 *    The marking sits on a wrapper around the module rather than on its `ol`,
 *    because the component exposes no hook for it and it is not this task's
 *    file.
 */

const ROUTE = "takePart" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadataFor(ROUTE, params);
}

function listItems(blocks: readonly ContentBlock[]): string[] {
  return blocks.flatMap((block) => (block.kind === "list" ? block.items : []));
}

const PROOF_LABEL: Record<Locale, string> = {
  de: "Was andere sagen",
  en: "What others say",
};

/** The accessible name of the cross-reference aside, which carries no heading. */
const CROSS_REFERENCE_LABEL: Record<Locale, string> = {
  de: "Anderes Angebot",
  en: "A different offering",
};

/**
 * `mitmachen-7-proof-demo` is `provenance: sourced` (state/open.md row 49,
 * row 162), not `generated` — three real institutions that publish
 * themselves. `demo` and every displayed label are read off the slot
 * (`isDemoSlot`), never hard-coded; `PROOF_CONTEXT_FALLBACK` is used only
 * where a quote's own attribution has no organisation name to show instead
 * (`parseDemoProofElement`).
 */
const PROOF_CONTEXT_FALLBACK: Record<"demo" | "sourced", Record<Locale, string>> = {
  demo: { de: "Rückmeldung", en: "Feedback" },
  sourced: { de: "Rückmeldung", en: "Feedback" },
};

const GEO_SNAPSHOT_LABEL: Record<"demo" | "sourced", Record<Locale, string>> = {
  demo: { de: "Beleg", en: "Reference" },
  sourced: { de: "Beleg", en: "Reference" },
};

/**
 * The module, with its step lines marked as what they are.
 *
 * `data-demo="true"` on the wrapper, not on a word: the title and the CTA
 * label are the review's own wording, the three step lines are the drafts'
 * (`state/open.md`). Marking the wrapper over-reaches by two strings and is
 * the honest direction to over-reach in — a reviewer enumerating
 * `[data-demo]` finds the module that holds the placeholder.
 */
function PathModule({ demo, ...module }: ExplainModuleProps & { readonly demo: boolean }) {
  return (
    <div data-demo={demo ? "true" : undefined} data-path-module="">
      <ExplainModule {...module} />
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);

  const hero = slot(page, "mitmachen-1-hero");
  const objections = slot(page, "mitmachen-2-objections");
  const pathWhatsapp = slot(page, "mitmachen-3-path-whatsapp");
  const whatsappSteps = slot(page, "mitmachen-3a-path-whatsapp-steps-demo");
  const pathCalendar = slot(page, "mitmachen-4-path-calendar");
  const calendarSteps = slot(page, "mitmachen-4a-path-calendar-steps-demo");
  const pathWebsite = slot(page, "mitmachen-5-path-website");
  const websiteSteps = slot(page, "mitmachen-5a-path-website-steps-demo");
  const example = slot(page, "mitmachen-6-beispiel");
  const proofDemo = slot(page, "mitmachen-7-proof-demo");
  const closing = slot(page, "mitmachen-8-closing");
  // The band's own kicker (state/open.md row 95, row 161), not home's.
  const contextBand = slot(page, "mitmachen-9-context-band");

  /**
   * The heading keeps its `{…}` slot: the island fills it with the place the
   * envelope actually resolved, which is the only name this page may claim.
   *
   * `selectExamplePlace()` (D5's own decision function, unit-tested) still
   * owns *which* place — its stage-0 answer is the configured reference
   * community `gross-kiesow`. That slug resolves only against the **real**
   * geo-api, and this environment has no read token, so the module would
   * render nothing at all. The stage-0 anchor stands in until the token
   * exists; both slugs go through the same `resolvePlace()` call, so the
   * swap is one constant. `state/open.md`.
   */
  const exampleTitle = (fieldAt(example.blocks, 0) ?? "").replace(
    /\{[^}]+\}/,
    "{place}",
  );
  const exampleSlug = selectExamplePlace(undefined).slug;
  const liveSlug =
    exampleSlug === REFERENCE_PLACE.slug ? STAGE_ZERO_ANCHOR.slug : exampleSlug;

  /**
   * TS-WEB-0005 through, not around: the inline surface is **3** positions
   * (DEC-0048), gated, scored, rotated and ordered by the engine. The three
   * quotes are real (sourced, clearance pending), so `demo` and every
   * displayed label come off `isDemoSlot(proofDemo)`, not a hard-coded flag.
   */
  const proofIsDemo = isDemoSlot(proofDemo);
  const proofSelection = await selectProof({
    routeId: ROUTE,
    locale,
    focusJob: "publish-our-dates",
    surface: "inline",
    candidates: listItems(proofDemo.blocks).map((line, index) => {
      const quote = parseDemoProofElement(
        line,
        PROOF_CONTEXT_FALLBACK[proofIsDemo ? "demo" : "sourced"][locale],
      );
      const place = quote.attribution.split(", ").slice(1).join(", ").trim();
      return {
        id: `mitmachen-7-proof-demo-${index + 1}`,
        contextLine: quote.contextLine,
        claim: quote.claim,
        attribution: quote.attribution,
        geo: {
          level: "snapshot" as const,
          label: GEO_SNAPSHOT_LABEL[proofIsDemo ? "demo" : "sourced"][locale],
        },
        geoCommunity: place === "" ? null : place,
        demo: proofIsDemo,
      };
    }),
  });

  const heroCtaLabel = fieldAt(hero.blocks, 3) ?? "";

  // TS-WEB-0003 D2 declares this page's LCP element to be the WhatsApp scene
  // image, which is the hero itself (`data-block="scene"` below). The entry
  // carries `lcp: true`, and `photo-surface` turns that into the preload a
  // CSS background image can actually carry.
  const heroImage = pageImage(page, HERO_IMAGE_ID.takePart);
  // `mitmachen-path-whatsapp`, `-calendar` and `-website` stay declared in the
  // artifact's `images:` block — they are real, credited photographs and the
  // credits page cites them — but no path renders one any more. The review is
  // explicit about the WhatsApp one ("Das Foto ist Quatsch"): what belongs in
  // state 1 is a hand holding a phone over a flyer, which nobody has shot, so
  // the stage shows `media-frame`'s "Foto gesucht" hatch instead of a bus
  // shelter (DEC-0068 rule 2, state/open.md).

  const objectionLists = [listAt(objections.blocks, 0), listAt(objections.blocks, 1)];

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={{
        to: "register",
        label: heroCtaLabel,
        heading: fieldAt(closing.blocks, 0),
        /*
         * TS-WEB-0022-A11 asks for a cleared backing before the permanence
         * promise ships, and the artifact now names one: the offering
         * record `community-calendar` calls free access "a public
         * commitment, not a pricing decision that can be quietly
         * reversed", and the 2022 Nordkurier entry records the same
         * sentence in public. The slot is `provenance: sourced` with both
         * in its `derived_from`, so the sentence is rendered word for word
         * rather than withheld. What stays open is only whether a `proof/`
         * element of its own gets minted (`state/open.md` #17) — a
         * bookkeeping question, not a clearance one.
         */
        reassurance: fieldAt(closing.blocks, 2),
      }}
      contextBandHeading={fieldAt(contextBand.blocks, 0)}
      locale={locale}
      meta={pageMeta}
    >
      <div data-block="scene" data-mechanism="whatsapp">
        <HeroBlock
          cta={
            <Button dataCta="primary" locale={locale} onward to="register">
              {heroCtaLabel}
            </Button>
          }
          headline={fieldAt(hero.blocks, 0) ?? ""}
          id="hero"
          /*
           * The opener is two short statements, which is what the review
           * asked for in place of the question ("Lieber zwei Sätze, und als
           * Aussage statt mit Fragezeichen"): the `h1` carries the first, the
           * lead the second. Both are inside CG-020's and CG-021's budgets —
           * the question they replace was one 66-character line — so the
           * primary conversion stays above the fold at 360 × 640 (A2), which
           * is the constraint that removed the old lead in the first place.
           */
          lead={fieldAt(hero.blocks, 1)}
          // F-2-33: the hero's `photo-surface` badges itself out of the
          // dictionary — without the page's language it marks an English
          // page in German.
          locale={locale}
          focal={heroImage?.focal}
          notDepicting={heroImage?.notDepicting}
          placeholderId={heroImage?.placeholderId}
          priority={heroImage?.priority}
          src={heroImage?.src}
          state={slotState(hero)}
          wideSrc={heroImage?.wideSrc}
        />
      </div>

      <SectionShell
        dataBlock="objections"
        kicker={dictionary(locale).kickers.objection}
        label={fieldAt(objections.blocks, 0)}
        surface="paper"
        transition={fieldAt(hero.blocks, 2)}
      >
        {/* The upper half of the 2026-09-23 draft: the three people who do not
            hear about the date today, and the proof slot. The slot is back —
            D3 requires one beside the block, "visibly empty if nothing
            clears", and the specification carries the truth over the polish
            brief's G-9 (DEC-0104, DEC-0124). */}
        <ObjectionList
          headline={fieldAt(objections.blocks, 0) ?? ""}
          items={[]}
          reach={objectionLists[0].map((line) => {
            const { core, detail } = splitCoreDetail(line);
            return { title: core, detail };
          })}
        />
      </SectionShell>

      {/* The lower half, on the archive ground: *what does not work today*,
          and nothing else (SRC-0014 §Archive block, DEC-0117). Its own
          section, because the two halves together measure 1627 px at 390 px
          and G-4 caps a section at 1270 — `e2e/section-budget.spec.ts` is
          what measures it. One objection block, two sections; the rhythm test
          counts both (DEC-0124). */}
      <SectionShell dataBlock="archiv" label={fieldAt(objections.blocks, 1)} surface="archive">
        <ArchiveBlock
          closing={fieldAt(objections.blocks, 2)}
          ground="own"
          items={objectionLists[1].map((line) => {
            const { core, detail } = splitCoreDetail(line);
            return { core, detail };
          })}
          kicker={fieldAt(objections.blocks, 1)}
        />
      </SectionShell>

      {/*
          The `wege` slot — one slot, three grounds.

          `paper → lime-100 → paper`: solution content takes a fresh ground,
          and `surface-2` is one of the sober greys the design system keeps
          for the municipal argument and for inactive things ("grey-green
          never carries positive content", SRC-0014 §Section grounds). The
          three of them used to stand in a single `surface-2` block of
          2035 px, which is the violation `e2e/section-budget.spec.ts` was
          written for. */}
      <SectionShell
        dataBlock="wege"
        kicker={fieldAt(pathWhatsapp.blocks, 0)}
        labelledBy="wege-heading"
        surface="paper"
      >
        <h2 id="wege-heading">{fieldAt(pathWhatsapp.blocks, 1)}</h2>
        <p data-wege-subline>{fieldAt(pathWhatsapp.blocks, 2)}</p>
        <PathModule
          cta={{
            // The number is the hub's, through the generated file — never a
            // number typed on a page (TS-WEB-0016 D13, TS-WEB-0016-A16), and
            // no `?text` prefill exists for it (D14 §6).
            href: contactHref("whatsapp"),
            icon: "smartphone",
            label: fieldAt(pathWhatsapp.blocks, 4) ?? "",
            newTab: true,
          }}
          demo={isDemoSlot(whatsappSteps)}
          mechanism="whatsapp"
          ordinal={1}
          stage={[
            <StageImage
              alt=""
              key="1"
              locale={locale}
            />,
            <StageChat
              key="2"
              locale={locale}
              reply={fieldAt(whatsappSteps.blocks, 1) ?? ""}
              time={fieldAt(whatsappSteps.blocks, 2) ?? ""}
            />,
            // State 3 is "the date is in the calendar", and the calendar it
            // means is the live example two sections down — the same
            // interface module, the same cache profile (DEC-0115).
            <LiveStageCalendar
              key="3"
              locale={locale}
              place={SHOWCASE_COMMUNITY.name}
              sample={threeSampleRows(
                listAt(calendarSteps.blocks, 1),
                "mitmachen-4a-path-calendar-steps-demo",
              )}
              slug={liveSlug}
            />,
          ]}
          steps={threeSteps(
            listAt(whatsappSteps.blocks, 0),
            "mitmachen-3a-path-whatsapp-steps-demo",
          )}
          title={fieldAt(pathWhatsapp.blocks, 3) ?? ""}
        />
      </SectionShell>

      <SectionShell dataBlock="wege" label={fieldAt(pathCalendar.blocks, 0)} surface="lime-100">
        <PathModule
          cta={{
            label: fieldAt(pathCalendar.blocks, 1) ?? "",
            locale,
            onward: true,
            to: "register",
          }}
          demo={isDemoSlot(calendarSteps)}
          mechanism="calendar-connection"
          ordinal={2}
          stage={[
            <StageImage alt="" key="1" locale={locale} />,
            <StageRegistration
              address={fieldAt(calendarSteps.blocks, 1) ?? ""}
              key="2"
              locale={locale}
            />,
            <SampleStageCalendar
              key="3"
              locale={locale}
              place={SHOWCASE_COMMUNITY.name}
              sample={threeSampleRows(
                listAt(calendarSteps.blocks, 1),
                "mitmachen-4a-path-calendar-steps-demo",
              )}
            />,
          ]}
          steps={threeSteps(
            listAt(calendarSteps.blocks, 0),
            "mitmachen-4a-path-calendar-steps-demo",
          )}
          title={fieldAt(pathCalendar.blocks, 0) ?? ""}
        />
      </SectionShell>

      <SectionShell dataBlock="wege" label={fieldAt(pathWebsite.blocks, 0)} surface="paper">
        {/* The availability badge is the hub record's, not a copy decision:
            it goes when `community-calendar` stops saying alpha, and not
            before (D4 "Honest availability"). It sits beside the module
            rather than inside it — the component's shape is fixed by D4 and
            carries no badge slot. */}
        <p data-path-availability="alpha">
          <StatusBadge availability="alpha" label={fieldAt(pathWebsite.blocks, 1)} />
        </p>
        <PathModule
          cta={{
            label: fieldAt(pathWebsite.blocks, 2) ?? "",
            locale,
            onward: true,
            to: "register",
          }}
          demo={isDemoSlot(websiteSteps)}
          mechanism="website-import"
          ordinal={3}
          stage={[
            <StageImage alt="" key="1" locale={locale} />,
            <StageRegistration
              address={fieldAt(websiteSteps.blocks, 1) ?? ""}
              key="2"
              locale={locale}
            />,
            <SampleStageCalendar
              key="3"
              locale={locale}
              place={SHOWCASE_COMMUNITY.name}
              sample={threeSampleRows(
                listAt(websiteSteps.blocks, 1),
                "mitmachen-5a-path-website-steps-demo",
              )}
            />,
          ]}
          steps={threeSteps(
            listAt(websiteSteps.blocks, 0),
            "mitmachen-5a-path-website-steps-demo",
          )}
          title={fieldAt(pathWebsite.blocks, 0) ?? ""}
        />

        {/* D11 / A17 — one banner, at the end of the slot, after the third
            path. It states the boundary of BUS-WEB-0017 and enumerates the
            offering record's standard sources; no figure, no `data-cta`, no
            conversion (DEC-0107 §3). */}
        <HintBanner locale={locale} sources={standardSources()}>
          <p>{fieldAt(pathWebsite.blocks, 3)}</p>
        </HintBanner>
      </SectionShell>

      {/* D9 — exactly one link to `/dein-kalender`, in an `aside`, at the end
          of slot 3. Its own block rather than a fourth step of "your website
          as the source" (polish brief, page 4, item 5), but inside the slot
          the determination puts it in (DEC-0124). */}
      <SectionShell
        as="aside"
        dataBlock="verweis"
        density="tight"
        label={CROSS_REFERENCE_LABEL[locale]}
        surface="lime-100"
      >
        <p>
          {(fieldAt(pathWebsite.blocks, 4) ?? "").split("→")[0].trim()}{" "}
          <RouteLink locale={locale} to="calendar">
            {pageTitle("calendar", locale)}
          </RouteLink>
        </p>
      </SectionShell>

      <SectionShell
        dataBlock="beispiel"
        kicker={dictionary(locale).kickers.liveAnswer}
        label={exampleTitle}
        surface="ink"
      >
        {/* D5's live example, off the shared live-data layer rather than a
            page-local row list (`state/open.md` row 128): the same
            `placeEvents()` interface `/dein-ort` and `/` use, so this module
            degrades, caches and demo-labels exactly like every other one —
            and like path 1's third stage state, which reads it too. */}
        <PlaceDatesIsland
          announced
          locale={locale}
          rowCount={3}
          slug={liveSlug}
          titleTemplate={exampleTitle}
          tone="dark"
        />
      </SectionShell>

      <SectionShell
        dataBlock="beleg"
        // Customer proof: `customers` is the placeholder kicker, marked on its
        // element (DEC-0120 §5, state/open.md row 234).
        kicker={dictionary(locale).kickers.customers}
        kickerDemo
        labelledBy="beleg-heading"
        // Lime rather than a grey: the frame appends `surface` (band) and
        // `paper` (closing) after this section, and three neutral sections in
        // a row is the rule this page's own rhythm test checks (A16, D10).
        surface="lime-100"
      >
        <h2 id="beleg-heading">{PROOF_LABEL[locale]}</h2>
        {/* G-7: one emphasis per stream. The first card opens it at sub-head
            size, the rest are hairline rows — three identical filled cards
            read as one block rather than as three institutions. No `geo`
            badge either: every card here already names its source in its
            own context line, and `BELEG` beside `Stiftung Lebendiges Lehre`
            is the same word twice. */}
        <ProofStream label={PROOF_LABEL[locale]} layout="rows">
          {proofSelection.entries.map((entry, position) =>
            entry.kind === "item" ? (
              <ProofCard
                attribution={entry.candidate.attribution}
                claim={entry.candidate.claim}
                contextLine={entry.candidate.contextLine}
                emphasis={position === 0 ? "feature" : "compact"}
                key={entry.candidate.id}
                locale={locale}
                state={entry.state}
              />
            ) : (
              <EmptyProofSlot key={`empty-${position}`} />
            ),
          )}
        </ProofStream>
      </SectionShell>
    </PageFrame>
    </>
  );
}
