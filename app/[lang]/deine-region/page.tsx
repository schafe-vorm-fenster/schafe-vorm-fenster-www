
import { Button } from "@/src/components/button/button";
import { EmbedFrame } from "@/src/components/embed-frame/embed-frame";
import { FeatureBenefit } from "@/src/components/feature-benefit/feature-benefit";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { PriceTag } from "@/src/components/price-tag/price-tag";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { pageImage } from "@/src/lib/content/images";
import { HERO_IMAGE_ID } from "@/src/lib/pages/hero-images";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot, slotState } from "@/src/lib/content/provenance";
import { ctaLabelOnly, interpolate } from "@/src/lib/content/text";
import { parseDemoProofElement } from "@/src/lib/pages/demo-content";
import { STAGE_ZERO_ANCHOR } from "@/src/lib/pages/live-anchor";
import { pageTitle } from "@/src/lib/routes/metadata";
import { offeringPrice } from "@/src/lib/pricing/offerings";
import { SHOWCASE_CALENDAR } from "@/src/lib/embed/portalize";
import { BRIEFING_URL } from "@/src/lib/live/briefing";
import { genericCountyLabel } from "@/src/lib/live/county-label";
import { ConversionTracker } from "@/src/components/conversion-tracker/conversion-tracker";
import { dictionary } from "@/src/lib/i18n/dictionary";

import { CountersIsland, RegionExamplesIsland } from "../_islands";
import { PageJsonLd } from "../_structured-data";
import { pageContent } from "../_content";
import { selectProof } from "../_proof";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";

import { pageMeta } from "./page.meta";

import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0026 — `/deine-region` — the region page.
 *
 * Composition (`plan/component-inventory.md` §4, TS-WEB-0026 D2, as the polish
 * brief's page 8 orders it): focus (hero — headline and the one primary CTA,
 * the briefing quiet beneath it) → the territory question, which is where
 * the hero's own lead sentence now stands → what is already live here →
 * embed demo → what the district tier adds → proof (3) → band + closing
 * (rendered by `PageFrame` from `page.meta.ts`, TS-WEB-0006 D2).
 *
 * **The inline quote form is gone** (brief page 8, item 2). It stood on this
 * page *and* on `/deine-region/angebot`, so the argument page ended in a
 * five-field form whose "Absenden" was followed by a second button reading
 * "Angebot anfragen" — two controls, one action, and ~800 px of form between
 * the proof and the page's own closing CTA. This page is the argument; the
 * form is the form. `/deine-region` is still the quote surface TS-WEB-0016 D1 row
 * S2 names, through the CTA that opens it.
 *
 * [ASSUMPTION] The composition sheet's block-1 component list also names a
 * `scene-block mechanism="embed"`. The content artifact gives one embed
 * heading only (slot 4, used there for the dedicated demo), so a second,
 * duplicate scene instance in block 1 would restate block 4 with no
 * authored content of its own. D7's three-part scene shape (opener → one
 * mechanism → one concrete instance) is carried by the hero's own copy
 * (the Aha-Frage as the opener, the embedded system named in the lead) and
 * by block 4's `embed-frame`, which is the one concrete instance — never
 * rendered twice. Recorded in `state/open.md` rather than building an
 * unbacked second scene.
 *
 * D3: no map anywhere — no `ratio-map`, no map library, no map image, no
 * "Karte folgt" caption; every module labels itself by administrative scope
 * only (no distance language in the UI, TS-WEB-0026-A2).
 */

const ROUTE = "region" as const;

/**
 * The labels this page needs and no artifact carries. German-only before
 * round 3, which is how `/en/your-region` ended up half-translated (F-2-33);
 * generated copy in the tone of voice, `Dummy-Content` in `state/open.md`.
 */
const PAGE_COPY: Record<
  Locale,
  {
    briefingLabel: string;
    proofHeading: string;
    proofLabel: string;
    closingHeading: string;
    quoteFallback: string;
    territorySketchAlt: string;
    interimFallback: string;
    embedFallback: string;
  }
> = {
  de: {
    // Fallbacks only — `deine-region-1-focus` carries the real wording now,
    // so the quiet briefing link and the closing heading are authored copy
    // rather than strings typed into a page file.
    briefingLabel: "Lieber erst sprechen? Kennenlerngespräch buchen",
    proofHeading: "Was Landkreise und Institutionen sagen",
    proofLabel: "Beleg",
    closingHeading: "Sollen wir euch ein Angebot rechnen?",
    quoteFallback: "Angebot anfragen",
    territorySketchAlt: "Gebietsschnitt eines Landkreises",
    interimFallback: "So sieht das heute schon aus: Orte, die schon dabei sind",
    embedFallback: "So sieht die Einbindung aus",
  },
  en: {
    briefingLabel: "Rather talk first? Book an intro call",
    proofHeading: "What counties and institutions say",
    proofLabel: "Proof",
    closingHeading: "Shall we put a quote together for you?",
    quoteFallback: "Request a quote",
    territorySketchAlt: "Outline of a county territory",
    interimFallback: "This is what it already looks like: places that are already on board",
    embedFallback: "This is what the embed looks like",
  },
};

/**
 * The proof stream's context line and geo badge, per `isDemoSlot` — never a
 * the same words in either case — the difference reaches `data-demo` only
 * (Jan, 2026-09-18) — for the real, sourced
 * quotes `deine-region-6-proof-demo` carries today (state/open.md row 50,
 * row 162). `PROOF_CONTEXT_FALLBACK` is used only where a quote's own
 * attribution has no organisation name to show (`parseDemoProofElement`).
 */
const PROOF_CONTEXT_FALLBACK: Record<"demo" | "sourced", Record<Locale, string>> = {
  demo: { de: "Rückmeldung", en: "Feedback" },
  sourced: { de: "Rückmeldung", en: "Feedback" },
};


export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadataFor(ROUTE, params);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);
  const heroImage = pageImage(page, HERO_IMAGE_ID.region);
  const territoryImage = pageImage(page, "deine-region-gebietsschnitt");
  const copy = PAGE_COPY[locale];
  const words = dictionary(locale);

  const focus = slot(page, "deine-region-1-focus");
  const territory = slot(page, "deine-region-2-territory");
  const interim = slot(page, "deine-region-3-interim");
  const embedDemo = slot(page, "deine-region-4-embed-demo");
  const whatItAdds = slot(page, "deine-region-5-was-dazukommt");
  // `deine-region-6-proof` (real, sourced-empty-by-design) carries no cleared
  // reference case (Q-0014) — the demo slot below stands in per the mock rule.
  const proofDemo = slot(page, "deine-region-6-proof-demo");

  const enterprise = offeringPrice("portalize-enterprise");

  // D4: stage 0 (no county anchor, Q-0032) — the honest render this work
  // package can ship without a geo/BFF integration: examples and search
  // stand, the county-scoped heading and counter stay generic/absent
  // (TS-WEB-0026-A10). The interim ranking (D4, Q-0037) is mocked accordingly.
  // F-2-63: at stage 0 the heading carries **no county slot at all**. It used
  // to keep `{county}` for the island to fill, and the island filled it with
  // whatever `county` it was handed — the stage-0 anchor's raw geo-api id —
  // so block 3 read "Beispiele aus dem Landkreis geoname.900001": a county
  // asserted with no anchor (TS-WEB-0026-A10, TS-WEB-0026 D4) *and* an internal
  // identifier rendered as visitor copy. The county-scoped heading returns
  // with the anchor it needs, not before.
  // F-2-73: the German template's slot is `{landkreis}`, the English one's
  // is `{county}` — F-2-63 filled the first and left the second, so the
  // English heading still took whatever the island handed it (the stage-0
  // anchor's raw geo-api id). All three slot names are filled here, from the
  // one place that decides what an unresolved county is called.
  // Polish brief page 8, item 3: at stage 0 the heading must not name a
  // county at all. Filling `{landkreis}` with a generic label produced
  // "Orte im Landkreis deiner Region" — the fallback string showing through,
  // and not a county. The artifact now carries a second, county-free
  // heading for exactly this state; the templated one returns with the
  // anchor it needs, not before.
  const genericCounty = genericCountyLabel(locale);
  const interimFallbackHeading =
    fieldAt(interim.blocks, 3) ??
    interpolate(fieldAt(interim.blocks, 0), {
      landkreis: genericCounty,
      county: genericCounty,
      "county-or-organization": genericCounty,
    }) ??
    copy.interimFallback;

  const quoteItems = proofDemo.blocks.filter((block) => block.kind === "list");
  const proofIsDemo = isDemoSlot(proofDemo);
  const proofFallbackContext = PROOF_CONTEXT_FALLBACK[proofIsDemo ? "demo" : "sourced"][locale];
  const quotes =
    quoteItems[0]?.kind === "list"
      ? quoteItems[0].items.map((item) => parseDemoProofElement(item, proofFallbackContext))
      : [];

  /**
   * TS-WEB-0005 through, not around: DEC-0048's **3** inline positions, selected by
   * the engine. This route takes no place parameter — the visitor's own place
   * is `/dein-ort`'s subject, not this page's — so the selection is stage 0
   * and stays inside the prerendered shell.
   */
  const proofSelection = await selectProof({
    routeId: ROUTE,
    locale,
    focusJob: "run-our-own-calendar",
    surface: "inline",
    candidates: quotes.map((quote, index) => ({
      id: `deine-region-6-proof-demo-${index + 1}`,
      contextLine: quote.contextLine,
      claim: quote.claim,
      attribution: quote.attribution,
      // G-7: no badge. Every one of these cards names its source in the
      // context line, and the badge beside it read "BELEG" — the same word
      // the line under it already carried.
      geoCounty: quote.attribution.split(", ").slice(1).join(", ").trim() || null,
      demo: proofIsDemo,
    })),
  });

  const ctaLabel = ctaLabelOnly(fieldAt(focus.blocks, 2)) ?? copy.quoteFallback;
  const briefingLabel = fieldAt(focus.blocks, 3) ?? copy.briefingLabel;
  const briefingDisclosure = fieldAt(focus.blocks, 4);
  const closingHeading = fieldAt(focus.blocks, 5) ?? copy.closingHeading;
  // G-5: the same quiet line in the hero and in the closing block, so the
  // second way forward is recognisably the same one both times.
  const briefingLink = (
    <ConversionTracker
      attributes={{ route: ROUTE }}
      goalId="request-product-briefing"
      stage="handover"
    >
      <OutboundLink
        disclosure={briefingDisclosure}
        href={BRIEFING_URL}
        locale={locale}
        newTab
        variant="quiet"
      >
        {briefingLabel}
      </OutboundLink>
    </ConversionTracker>
  );

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={{
        to: "regionQuote",
        label: ctaLabel,
        heading: closingHeading,
        // D5/A7: no response-time wording anywhere while C11 is open — the
        // constant is deliberately `null` and a reassurance is not invented
        // to fill the line.
        reassurance: undefined,
        footer: briefingLink,
      }}
      contextBandHeading={undefined}
      locale={locale}
      meta={pageMeta}
    >
      {/* Block 1 — focus: the Aha question and the one primary CTA, with the
          briefing quiet underneath (G-5). The hero used to carry its lead
          sentence as well, and the briefing as a full-width white pill three
          lines tall whose label held its own disclosures — so the secondary
          outweighed the primary and the photograph had 156 px of a 693 px
          box. The lead now opens block 2, where it is the answer to the
          question the heading asks. */}
      <MotionReveal>
        <HeroBlock
          headline={fieldAt(focus.blocks, 0) ?? pageTitle(ROUTE, locale)}
          id="fokus"
          // F-2-33: the hero's `photo-surface` badges itself out of the
          // dictionary — without the page's language it marks an English
          // page in German.
          locale={locale}
          focal={heroImage?.focal}
          notDepicting={heroImage?.notDepicting}
          placeholderId={heroImage?.placeholderId}
          src={heroImage?.src}
          wideSrc={heroImage?.wideSrc}
          cta={
            <>
              <Button
                dataCta="primary"
                icon="arrow-right"
                locale={locale}
                to="regionQuote"
                variant="primary-dark"
              >
                {ctaLabel}
              </Button>
              {/* F-2-32: the one configured value of TS-WEB-0016 D7, never a
                  second URL pasted per page. */}
              {briefingLink}
            </>
          }
          state={slotState(focus)}
        />
      </MotionReveal>

      {/* Block 2 — the territory question (colour, sober), opening with the
          sentence that used to sit in the hero. */}
      <SectionShell
        dataBlock="gebietsfrage"
        kicker={words.kickers.objection}
        labelledBy="gebietsfrage"
        surface="paper"
      >
        <MotionReveal>
          <h2 id="gebietsfrage">{fieldAt(territory.blocks, 0)}</h2>
          <p>{fieldAt(focus.blocks, 1)}</p>
          <p>{fieldAt(territory.blocks, 1)}</p>
        </MotionReveal>
      </SectionShell>

      {/* Block 3 — what is already live here: the one swappable interim
          module (D3/D4) — examples, search; no county count until Q-0037,
          no distance language anywhere (A2). */}
      {/* `label`, not `labelledBy`: `live-module-frame` renders its own
          heading with no id to point to. */}
      <SectionShell
        dataBlock="bestand"
        kicker={words.kickers.liveAnswer}
        label={interimFallbackHeading}
        surface="ink"
        transition={fieldAt(interim.blocks, 4)}
      >
        <MotionReveal>
          {/* The examples come off `regionExamples()` — TS-WEB-0008 position 3 at
              county scope, DEC-0034's designed set rather than a place list.
              The stage-0 anchor is the `<Suspense>` fallback, `?ort=` streams
              the visitor's own county over it. */}
          <RegionExamplesIsland
            county={STAGE_ZERO_ANCHOR.county}
            locale={locale}
            max={6}
            titleTemplate={interimFallbackHeading}
          />
          {/* The search stands *beside* the module, so the block never
              collapses when the ranking has nothing (TS-WEB-0008 D1, DEC-0034). */}
          <PlaceSearch
            typeahead
            hint={words.search.hint}
            label={fieldAt(interim.blocks, 2) ?? words.search.label}
            locale={locale}
            to="place"
            // F-3-R2: the block is an `ink` section, and the light tone's
            // muted hint is `neutral-muted` on ink — 2.9:1. The dark tone
            // renders the hint in paper, which is what `place-search` already
            // provides for exactly this ground.
            tone="dark"
          />
          {/* D4's county-scoped figure: counted or absent, never estimated
              (FUN-WEB-0041). `places` has no `/api/stats` field (Q-0037), so the
              band renders the one figure that is counted. */}
          <CountersIsland locale={locale} show={["dates"]} />
        </MotionReveal>
      </SectionShell>

      {/* Block 4 — the product: embed demo, position 1' (TS-WEB-0008 D6). `label`,
          not `labelledBy`: `embed-frame` renders its own heading with no id
          to point to. */}
      <SectionShell
        dataBlock="einbindung"
        kicker={words.kickers.howItWorks}
        label={fieldAt(embedDemo.blocks, 0) ?? copy.embedFallback}
        surface="surface-2"
      >
        <MotionReveal>
          <EmbedFrame
            heading={fieldAt(embedDemo.blocks, 0) ?? copy.embedFallback}
            locale={locale}
            // The **real** showcase calendar, the same organizer
            // `/dein-kalender` embeds (`src/lib/embed/portalize.ts`). This
            // page used to pass an id that resolves to nothing upstream, so
            // the single most persuasive module on it was a lilac rectangle
            // carrying the widget's own red German error paragraph — on the
            // English page too. G-9: this section does not ship empty.
            mountId="deine-region-portalize-widget"
            organizerId={SHOWCASE_CALENDAR.organizerId}
            ratio="feature"
            state={slotState(embedDemo, "degraded")}
          />
        </MotionReveal>
      </SectionShell>

      {/* Block 5 — what it adds over the 480 € tier. `feature-benefit`'s own
          `mediaSrc` carries the image at `ratio-feature` (D2) — a
          full-bleed `photo-surface` wrapping the whole block would both
          duplicate `feature-benefit`'s own `<h3>` heading with a second,
          identical page heading and reserve a full-viewport-width box for
          what the design system treats as a small inline image beside a
          proof-card-style claim (`media-frame`, contained, not full-bleed;
          the same non-photo classification `proof-card`'s own inline image
          already gets for the page-rhythm rule). No real asset for this
          work package: a generated DEC-0068 placeholder
          (`placeholders.manifest.json`), deliberately labelled
          "Gebietsschnitt", never "Karte"/map — D3 forbids a placeholder
          shaped like a map anywhere on this page, which is also why the
          pre-existing `deine-region/karte` placeholder (labelled
          "Kartenausschnitt") is not used here; see `state/open.md`. */}
      {/* `label`, not `labelledBy`: `feature-benefit` renders its own
          heading with no id to point to. */}
      <SectionShell
        dataBlock="was-dazukommt"
        kicker={words.kickers.price}
        label={fieldAt(whatItAdds.blocks, 0) ?? ""}
        surface="paper"
      >
        <MotionReveal>
          <FeatureBenefit
            benefit={fieldAt(whatItAdds.blocks, 1) ?? ""}
            feature={fieldAt(whatItAdds.blocks, 0) ?? ""}
            locale={locale}
            mediaAlt={territoryImage?.alt ?? copy.territorySketchAlt}
            mediaSrc={territoryImage?.src}
          />
          <p>{fieldAt(whatItAdds.blocks, 2)}</p>
          <PriceTag display={enterprise.display} figure={enterprise.figure} locale={locale} />
        </MotionReveal>
      </SectionShell>

      {/* Block 6 — proof at this level (D7): three demo cards, Q-0014 —
          no cleared reference case for a delivered territory exists. */}
      <SectionShell
        dataBlock="beleg"
        kicker={words.kickers.evidence}
        labelledBy="beleg"
        surface="lime-100"
      >
        <MotionReveal>
          <h2 id="beleg">{copy.proofHeading}</h2>
          <ProofStream label={copy.proofLabel}>
            {proofSelection.entries.map((entry, position) =>
              entry.kind === "item" ? (
                <ProofCard
                  attribution={entry.candidate.attribution}
                  claim={entry.candidate.claim}
                  contextLine={entry.candidate.contextLine}
                  geo={entry.candidate.geo}
                  key={entry.candidate.id}
                  locale={locale}
                  state={entry.state}
                />
              ) : (
                <EmptyProofSlot key={`empty-${position}`} />
              ),
            )}
          </ProofStream>
        </MotionReveal>
      </SectionShell>

    </PageFrame>
    </>
  );
}
