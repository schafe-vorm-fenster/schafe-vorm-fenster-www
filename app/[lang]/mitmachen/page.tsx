import { Button } from "@/src/components/button/button";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { ObjectionList } from "@/src/components/objection-list/objection-list";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { PublishingPath } from "@/src/components/publishing-path/publishing-path";
import { RouteLink } from "@/src/components/route-link/route-link";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { fieldAt } from "@/src/lib/content/blocks";
import { pageImage } from "@/src/lib/content/images";
import { HERO_IMAGE_ID } from "@/src/lib/pages/hero-images";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot, slotState } from "@/src/lib/content/provenance";
import { parseDemoProofElement } from "@/src/lib/pages/demo-content";
import { STAGE_ZERO_ANCHOR } from "@/src/lib/pages/live-anchor";
import { pageTitle } from "@/src/lib/routes/metadata";

import { PlaceDatesIsland } from "../_islands";
import { selectProof } from "../_proof";
import { PageJsonLd } from "../_structured-data";
import { pageContent } from "../_content";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";

import { REFERENCE_PLACE, selectExamplePlace } from "./example-place";
import { pageMeta } from "./page.meta";

import type { Step } from "@/src/components/content-fragments";
import type { ContentBlock } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0022 — `/mitmachen`, the publishing entry.
 *
 * Own blocks, in D2 order: hero (scene) → objections → three publishing
 * paths → live example (ink, the page's single dark section, D10) → proof.
 * The context band and the closing CTA are block 3/4 of TS-WEB-0006 D2 and are
 * rendered by `PageFrame` from `page.meta.ts` — this page never renders them
 * itself.
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

/** Ordered-list step items → the `Step` fragment `publishing-path` takes. */
function stepsOf(items: readonly string[]): Step[] {
  return items.map((body, index) => ({ index: index + 1, title: body, body: "" }));
}

/**
 * `<channel> — <the one concrete way it fails>` when the copy carries the
 * em-dash split (3 of 5 items); otherwise the whole sentence stands as the
 * failure and the channel names itself from context. Content is TS-WEB-0022 D3's;
 * this two-part rendering split is [PROPOSED], a UI decision only.
 */
function splitObjection(text: string): { channel: string; failure: string } {
  const dash = text.split(" — ");
  if (dash.length >= 2) return { channel: dash[0], failure: dash.slice(1).join(" — ") };
  return { channel: text, failure: "" };
}

/**
 * The section's name. It used to be "Drei Wege, die Termine zu uns zu
 * bringen", which now stutters against the transition line above it — that
 * sentence is the one that says "three", and it says it better.
 */
const PATHS_LABEL: Record<Locale, string> = {
  de: "So kommen eure Termine rein",
  en: "How your dates get in",
};

/**
 * The hinge of the page, and the one line the brief found missing: the
 * objections end on "and you have no time for a new tool", and the three
 * paths only answer that if something says they are not a new tool. It adds
 * no claim — the three mechanisms below are the claim.
 */
const PATHS_TRANSITION: Record<Locale, string> = {
  de: "Deshalb gibt es drei Wege rein, und alle drei sind Wege, die ihr schon geht.",
  en: "So there are three ways in, and all three are ways you already take.",
};

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
  const pathCalendar = slot(page, "mitmachen-4-path-calendar");
  const pathWebsite = slot(page, "mitmachen-5-path-website");
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
  const heroCtaLabel = fieldAt(hero.blocks, 2) ?? "";

  // TS-WEB-0003 D2 declares this page's LCP element to be the WhatsApp scene
  // image, which is the hero itself (`data-block="scene"` below). The entry
  // carries `lcp: true`, and `photo-surface` turns that into the preload a
  // CSS background image can actually carry.
  const heroImage = pageImage(page, HERO_IMAGE_ID.takePart);
  const whatsappImage = pageImage(page, "mitmachen-path-whatsapp");
  // `mitmachen-path-calendar` and `mitmachen-path-website` stay declared in
  // the artifact's `images:` block — they are real, credited photographs and
  // the credits page cites them — but the page no longer renders them: one
  // photograph across the three paths, not three (brief, page 4, item 4).

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
           * The hero is the question and the button, and nothing else
           * (brief, page 4, item 1). With the lead inside it the primary
           * conversion sat 777 px down a 640 px screen on the narrowest
           * phone the suite measures — the page's one call to action, below
           * the fold, on the page whose whole job is that call.
           *
           * The sentence is not cut: it stands one section lower as the
           * hand-off into the objections (`transition` below), where G-3
           * wants "one line tying this section to the one before it". It
           * answers the hero's question there, and the objection heading
           * under it then says why that is not enough today.
           */
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
        transition={fieldAt(hero.blocks, 1)}
      >
        {/* Three channels and the sentence the block ends on — the two
            objections about the organiser herself are one line now, not two
            more 21 px rows with a `circle-x` beside them (brief, page 4,
            item 2). `proofSlot={false}`: G-9 struck the reserved proof
            position, which after the badge removal was a blank rectangle
            under a list of bad news. The objections are the audience's own
            words; they need no third-party evidence. */}
        <ObjectionList
          closing={fieldAt(objections.blocks, 1)}
          headline={fieldAt(objections.blocks, 0) ?? ""}
          items={listItems(objections.blocks).map(splitObjection)}
          proofSlot={false}
        />
      </SectionShell>

      {/*
          One path per section, on its own ground — polish brief G-4.

          The three of them stood in a single `surface-2` section that
          measured 2035 px at 390 px, 2.4 phone screens, in which each path
          opened with a sub-head flush against the step list of the path
          above it. Nothing told the reader she had reached the next way in.
          Three grounds, three ordinals and one kicker on the first do, and
          no section is over the 1270 px budget any more.

          `surface-2 → lime-100 → surface-2` rather than three neutrals: the
          page's own rhythm test (TS-WEB-0022-A16) forbids three consecutive
          sections of one colour family, and `objections` above is already
          `paper`. */}
      <SectionShell
        dataBlock="wege"
        kicker={dictionary(locale).kickers.howItWorks}
        labelledBy="wege-heading"
        surface="surface-2"
        transition={PATHS_TRANSITION[locale]}
      >
        <h2 id="wege-heading">{PATHS_LABEL[locale]}</h2>
        <PublishingPath
          headline={fieldAt(pathWhatsapp.blocks, 0) ?? ""}
          locale={locale}
          mechanism="whatsapp"
          mediaAlt={whatsappImage?.alt}
          mediaNotDepicting={whatsappImage?.notDepicting}
          mediaPlaceholderId={whatsappImage?.placeholderId}
          mediaSrc={whatsappImage?.src}
          ordinal={1}
          steps={stepsOf(listItems(pathWhatsapp.blocks))}
        />
      </SectionShell>

      <SectionShell
        dataBlock="wege"
        label={fieldAt(pathCalendar.blocks, 0)}
        surface="lime-100"
      >
        {/* One photograph across all three paths, not three (brief, page 4,
            item 4): a wall calendar and a desk say nothing the three steps
            under them do not, and the two extra `ratio-feature` frames were
            half a phone screen each. The WhatsApp path keeps its picture
            because the flyer on the shelter wall *is* the mechanism. */}
        <PublishingPath
          headline={fieldAt(pathCalendar.blocks, 0) ?? ""}
          locale={locale}
          mechanism="calendar-connection"
          ordinal={2}
          steps={stepsOf(listItems(pathCalendar.blocks))}
        />
      </SectionShell>

      <SectionShell
        dataBlock="wege"
        label={fieldAt(pathWebsite.blocks, 0)}
        surface="surface-2"
      >
        <PublishingPath
          availability="alpha"
          availabilityLabel={fieldAt(pathWebsite.blocks, 1)}
          headline={fieldAt(pathWebsite.blocks, 0) ?? ""}
          locale={locale}
          mechanism="website-import"
          ordinal={3}
          steps={stepsOf(listItems(pathWebsite.blocks))}
        />
      </SectionShell>

      <SectionShell
        dataBlock="beispiel"
        kicker={dictionary(locale).kickers.liveAnswer}
        label={exampleTitle}
        surface="ink"
      >
        {/* D5's live example, now off the shared live-data layer rather than
            a page-local row list (`state/open.md` row 128): the same
            `placeEvents()` interface `/dein-ort` and `/` use, so this module
            degrades, caches and demo-labels exactly like every other one. */}
        <PlaceDatesIsland
          announced
          locale={locale}
          rowCount={3}
          slug={exampleSlug === REFERENCE_PLACE.slug ? STAGE_ZERO_ANCHOR.slug : exampleSlug}
          titleTemplate={exampleTitle}
          tone="dark"
        />
      </SectionShell>

      {/* The lime ground moved one section down, to the cross-reference: the
          rhythm rule this page's own test checks (TS-WEB-0022-A16, D10) forbids
          three consecutive `neutral`-family sections, and `PageFrame` appends
          `surface` (band) and `paper` (closing) after the aside. */}
      <SectionShell
        dataBlock="beleg"
        // No kicker: the `evidence` alias resolves to the h2's own words and
        // doubled it (DEC-0120 §5); T-12 picks `customers` once it can be marked.
        labelledBy="beleg-heading"
        surface="surface-2"
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

      {/* The one cross-reference this page may carry (TS-WEB-0022 D9), out of
          path 3 and into a block of its own — inside the path it read as a
          fourth step of "your website as the source" (brief, page 4, item
          5). One sentence, a quiet link, unchanged wording, and it stands
          where a reader who has seen the whole publishing argument may
          legitimately discover that hers is a different job. */}
      <SectionShell
        as="aside"
        dataBlock="verweis"
        density="tight"
        label={CROSS_REFERENCE_LABEL[locale]}
        surface="lime-100"
      >
        <p>
          {(fieldAt(pathWebsite.blocks, 3) ?? "").split("→")[0].trim()}{" "}
          <RouteLink locale={locale} to="calendar">
            {pageTitle("calendar", locale)}
          </RouteLink>
        </p>
      </SectionShell>
    </PageFrame>
    </>
  );
}
