import gebietsschnitt from "@/src/generated/placeholders/deine-region/gebietsschnitt.svg";
import heroImage from "@/src/generated/placeholders/deine-region/hero.svg";

import { Button } from "@/src/components/button/button";
import { EmbedFrame } from "@/src/components/embed-frame/embed-frame";
import { EnvoyFormMount } from "@/src/components/envoy-form-mount/envoy-form-mount";
import { FeatureBenefit } from "@/src/components/feature-benefit/feature-benefit";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { PriceTag } from "@/src/components/price-tag/price-tag";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { ResponsePromise } from "@/src/components/response-promise/response-promise";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot, slotState } from "@/src/lib/content/provenance";
import { ctaLabelOnly, interpolate, splitQuoteAttribution } from "@/src/lib/content/text";
import { STAGE_ZERO_ANCHOR } from "@/src/lib/pages/live-anchor";
import { pageTitle } from "@/src/lib/routes/metadata";
import { assetSrc } from "@/src/lib/content/asset-src";
import { offeringPrice } from "@/src/lib/pricing/offerings";
import { BRIEFING_RECIPIENT, BRIEFING_URL } from "@/src/lib/live/briefing";
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
 * TS-026 — `/deine-region` — the region page.
 *
 * Composition (`plan/component-inventory.md` §4, TS-026 D2): focus (hero +
 * primary CTA + briefing) → territory question → interim module (examples +
 * search, no county count today, Q-037) → embed demo → what it adds → proof
 * (3, demo — Q-014) → quote CTA + response promise (withheld, D5) → band +
 * closing (rendered by `PageFrame` from `page.meta.ts`, TS-006 D2).
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
 * only (no distance language in the UI, TS-026-A2).
 */

const ROUTE = "region" as const;

const CONTACT_EMAIL = "jan@schafe-vorm-fenster.de";

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
    proofContext: string;
    proofGeo: string;
    missingProof: string;
    closingHeading: string;
    quoteFallback: string;
    territorySketchAlt: string;
    interimFallback: string;
    embedFallback: string;
  }
> = {
  de: {
    briefingLabel: "Termin für ein Kennenlerngespräch buchen",
    proofHeading: "Was Landkreise und Institutionen sagen",
    proofLabel: "Beleg",
    proofContext: "Beispielhafte Rückmeldung",
    proofGeo: "Beispielregion",
    missingProof: "Für diese Aussage ist noch kein freigegebener Beleg hinterlegt.",
    closingHeading: "Bereit für euer Gebiet?",
    quoteFallback: "Angebot anfragen",
    territorySketchAlt: "Platzhalter: Gebietsschnitt",
    interimFallback: "So sieht das heute schon aus: Beispiele",
    embedFallback: "So sieht die Einbindung aus: ein Beispiel",
  },
  en: {
    briefingLabel: "Book a slot to get to know each other",
    proofHeading: "What counties and institutions say",
    proofLabel: "Proof",
    proofContext: "Example feedback",
    proofGeo: "Example region",
    missingProof: "No cleared proof is on file for this claim yet.",
    closingHeading: "Ready for your territory?",
    quoteFallback: "Request a quote",
    territorySketchAlt: "Placeholder: territory outline",
    interimFallback: "This is what it looks like today: examples",
    embedFallback: "This is what the embed looks like: an example",
  },
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
  const copy = PAGE_COPY[locale];
  const words = dictionary(locale);

  const focus = slot(page, "deine-region-1-focus");
  const territory = slot(page, "deine-region-2-territory");
  const interim = slot(page, "deine-region-3-interim");
  const embedDemo = slot(page, "deine-region-4-embed-demo");
  const whatItAdds = slot(page, "deine-region-5-was-dazukommt");
  // `deine-region-6-proof` (real, sourced-empty-by-design) carries no cleared
  // reference case (Q-014) — the demo slot below stands in per the mock rule.
  const proofDemo = slot(page, "deine-region-6-proof-demo");

  const enterprise = offeringPrice("portalize-enterprise");

  // D4: stage 0 (no county anchor, Q-032) — the honest render this work
  // package can ship without a geo/BFF integration: examples and search
  // stand, the county-scoped heading and counter stay generic/absent
  // (TS-026-A10). The interim ranking (D4, Q-037) is mocked accordingly.
  // F-2-63: at stage 0 the heading carries **no county slot at all**. It used
  // to keep `{county}` for the island to fill, and the island filled it with
  // whatever `county` it was handed — the stage-0 anchor's raw geo-api id —
  // so block 3 read "Beispiele aus dem Landkreis geoname.900001": a county
  // asserted with no anchor (TS-026-A10, TS-026 D4) *and* an internal
  // identifier rendered as visitor copy. The county-scoped heading returns
  // with the anchor it needs, not before.
  // F-2-73: the German template's slot is `{landkreis}`, the English one's
  // is `{county}` — F-2-63 filled the first and left the second, so the
  // English heading still took whatever the island handed it (the stage-0
  // anchor's raw geo-api id). All three slot names are filled here, from the
  // one place that decides what an unresolved county is called.
  const genericCounty = genericCountyLabel(locale);
  const interimFallbackHeading =
    interpolate(fieldAt(interim.blocks, 0), {
      landkreis: genericCounty,
      county: genericCounty,
      "county-or-organization": genericCounty,
    }) ?? copy.interimFallback;

  const quoteItems = proofDemo.blocks.filter((block) => block.kind === "list");
  const quotes =
    quoteItems[0]?.kind === "list"
      ? quoteItems[0].items.map((item) => splitQuoteAttribution(item))
      : [];

  /**
   * TS-005 through, not around: DEC-048's **3** inline positions, selected by
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
      contextLine: copy.proofContext,
      claim: quote.claim,
      attribution: quote.attribution,
      geo: { level: "region" as const, label: copy.proofGeo },
      geoCounty: quote.attribution.split(", ").slice(1).join(", ").trim() || null,
      demo: isDemoSlot(proofDemo),
    })),
  });

  const ctaLabel = ctaLabelOnly(fieldAt(focus.blocks, 2)) ?? copy.quoteFallback;

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={{ to: "regionQuote", label: ctaLabel, reassurance: undefined }}
      contextBandHeading={undefined}
      locale={locale}
      meta={pageMeta}
    >
      {/* Block 1 — focus: hero, primary CTA, briefing link (photo, ratio-hero). */}
      <MotionReveal>
        <HeroBlock
          headline={fieldAt(focus.blocks, 0) ?? pageTitle(ROUTE, locale)}
          id="fokus"
          lead={fieldAt(focus.blocks, 1)}
          // F-2-33: the hero's `photo-surface` badges itself out of the
          // dictionary — without the page's language it marks an English
          // page in German.
          locale={locale}
          notDepicting
          placeholderId="deine-region/hero"
          src={assetSrc(heroImage)}
          cta={
            <>
              <Button dataCta="primary" locale={locale} to="regionQuote" variant="primary-light">
                {ctaLabel}
              </Button>
              {/* F-2-32: the one configured value of TS-016 D7, never a
                  second URL pasted per page. */}
              <ConversionTracker
                attributes={{ route: ROUTE }}
                goalId="request-product-briefing"
                stage="handover"
              >
                <OutboundLink
                  href={BRIEFING_URL}
                  locale={locale}
                  newTab
                  recipient={BRIEFING_RECIPIENT}
                  variant="secondary"
                >
                  {copy.briefingLabel}
                </OutboundLink>
              </ConversionTracker>
            </>
          }
          state={slotState(focus)}
        />
      </MotionReveal>

      {/* Block 2 — the territory question (colour, sober). */}
      <SectionShell labelledBy="gebietsfrage" surface="paper">
        <MotionReveal>
          <h2 id="gebietsfrage">{fieldAt(territory.blocks, 0)}</h2>
          <p>{fieldAt(territory.blocks, 1)}</p>
        </MotionReveal>
      </SectionShell>

      {/* Block 3 — what is already live here: the one swappable interim
          module (D3/D4) — examples, search; no county count until Q-037,
          no distance language anywhere (A2). */}
      {/* `label`, not `labelledBy`: `live-module-frame` renders its own
          heading with no id to point to. */}
      <SectionShell label={interimFallbackHeading} surface="ink">
        <MotionReveal>
          {/* The examples come off `regionExamples()` — TS-008 position 3 at
              county scope, DEC-034's designed set rather than a place list.
              The stage-0 anchor is the `<Suspense>` fallback, `?ort=` streams
              the visitor's own county over it. */}
          <RegionExamplesIsland
            county={STAGE_ZERO_ANCHOR.county}
            locale={locale}
            max={6}
            titleTemplate={interimFallbackHeading}
          />
          {/* The search stands *beside* the module, so the block never
              collapses when the ranking has nothing (TS-008 D1, DEC-034). */}
          <PlaceSearch
            hint={words.search.hint}
            label={fieldAt(interim.blocks, 2) ?? words.search.label}
            locale={locale}
            to="place"
          />
          {/* D4's county-scoped figure: counted or absent, never estimated
              (WEB-F-041). `places` has no `/api/stats` field (Q-037), so the
              band renders the one figure that is counted. */}
          <CountersIsland locale={locale} show={["dates"]} />
        </MotionReveal>
      </SectionShell>

      {/* Block 4 — the product: embed demo, position 1' (TS-008 D6). `label`,
          not `labelledBy`: `embed-frame` renders its own heading with no id
          to point to. */}
      <SectionShell
        label={fieldAt(embedDemo.blocks, 0) ?? copy.embedFallback}
        surface="surface-2"
      >
        <MotionReveal>
          <EmbedFrame
            heading={fieldAt(embedDemo.blocks, 0) ?? copy.embedFallback}
            locale={locale}
            organizerId="demo-landkreis"
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
          work package: a generated DEC-068 placeholder
          (`placeholders.manifest.json`), deliberately labelled
          "Gebietsschnitt", never "Karte"/map — D3 forbids a placeholder
          shaped like a map anywhere on this page, which is also why the
          pre-existing `deine-region/karte` placeholder (labelled
          "Kartenausschnitt") is not used here; see `state/open.md`. */}
      {/* `label`, not `labelledBy`: `feature-benefit` renders its own
          heading with no id to point to. */}
      <SectionShell label={fieldAt(whatItAdds.blocks, 0) ?? ""} surface="paper">
        <MotionReveal>
          <FeatureBenefit
            benefit={fieldAt(whatItAdds.blocks, 1) ?? ""}
            feature={fieldAt(whatItAdds.blocks, 0) ?? ""}
            locale={locale}
            mediaAlt={copy.territorySketchAlt}
            mediaSrc={assetSrc(gebietsschnitt)}
          />
          <p>{fieldAt(whatItAdds.blocks, 2)}</p>
          <PriceTag display={enterprise.display} figure={enterprise.figure} locale={locale} />
        </MotionReveal>
      </SectionShell>

      {/* Block 6 — proof at this level (D7): three demo cards, Q-014 —
          no cleared reference case for a delivered territory exists. */}
      <SectionShell labelledBy="beleg" surface="lime-100">
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
                <EmptyProofSlot key={`empty-${position}`} sentence={copy.missingProof} />
              ),
            )}
          </ProofStream>
        </MotionReveal>
      </SectionShell>

      {/* Block 7 — quote CTA + response promise (D5: constant is null while
          C11 is unanswered — no response-time wording anywhere, A7). */}
      <SectionShell labelledBy="angebot-cta" surface="lime-100">
        <MotionReveal>
          <h2 id="angebot-cta">{copy.closingHeading}</h2>
          {/* F-2-48 / TS-016-A2: D1 row S2 names **both** `/deine-region` and
              `/deine-region/angebot` as quote surfaces, and the mount was
              absent here — the `request-licence-quote` path began with a link
              to a form rather than with the form. The dedicated page stays;
              this is the in-place instance D1 asks for. */}
          <EnvoyFormMount
            context={{ goal: "request-licence-quote" }}
            conversion={{ goalId: "request-licence-quote", stage: "completed" }}
            fallbackEmail={CONTACT_EMAIL}
            kind="quote"
            locale={locale}
            sourceRoute={ROUTE}
          />
          <Button locale={locale} to="regionQuote" variant="secondary">
            {ctaLabel}
          </Button>
          <ResponsePromise />
        </MotionReveal>
      </SectionShell>

    </PageFrame>
    </>
  );
}
