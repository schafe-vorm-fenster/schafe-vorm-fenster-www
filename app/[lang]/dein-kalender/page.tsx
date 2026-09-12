import { Button } from "@/src/components/button/button";
import { ComparisonTable } from "@/src/components/comparison-table/comparison-table";
import { ConversionTracker } from "@/src/components/conversion-tracker/conversion-tracker";
import { EmbedFrame } from "@/src/components/embed-frame/embed-frame";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { OfferTier, OFFER_TIER_CTA_VARIANT } from "@/src/components/offer-tier/offer-tier";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { TrustBlock } from "@/src/components/trust-block/trust-block";
import { fieldAt } from "@/src/lib/content/blocks";
import { pageImage } from "@/src/lib/content/images";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot } from "@/src/lib/content/provenance";
import { BRIEFING_URL } from "@/src/lib/live/briefing";
import { parseDemoProofElement } from "@/src/lib/pages/demo-content";
import { offeringPrice } from "@/src/lib/pricing/offerings";
import { pageTitle } from "@/src/lib/routes/metadata";

import { PageJsonLd } from "../_structured-data";
import { pageContent } from "../_content";
import { selectProof } from "../_proof";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";

import { pageMeta } from "./page.meta";

import type { FourComparisonRows } from "@/src/components/content-fragments";
import type { ContentBlock } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-024 — `/dein-kalender`, the 480 € page.
 *
 * Own blocks, D2 order: focus (Pulse + equal-weight briefing) → contrast →
 * embed demo → tiers → proof → trust. Context band and closing CTA are
 * `PageFrame`'s, from `page.meta.ts`.
 */

const ROUTE = "calendar" as const;

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

/**
 * Strips a field's trailing `→ target` or `` `/path` `` note — the content
 * artifact's own documentation of where a CTA points, not copy to display.
 */
function withoutArrow(text: string | undefined): string {
  return (text ?? "").split(/→|`/)[0].trim();
}

const CONTRAST_LABELS: Record<Locale, { today: string; withProduct: string; heading: string }> = {
  de: { today: "Heute", withProduct: "Mit dem Produkt", heading: "Heute gegen mit dem Produkt" },
  en: { today: "Today", withProduct: "With the product", heading: "Today versus with the product" },
};

const TIERS_QUESTION_FALLBACK: Record<Locale, string> = {
  de: "Wo soll der Kalender stehen?",
  en: "Where should the calendar live?",
};

const TRUST_HEADLINE: Record<Locale, string> = {
  de: "Wie eure Daten hier behandelt werden",
  en: "How your data is handled here",
};

const TRUST_PRIVACY_LABEL: Record<Locale, { privacy: string; dataProcessing: string }> = {
  de: { privacy: "Datenschutzerklärung", dataProcessing: "Auftragsverarbeitung" },
  en: { privacy: "Privacy policy", dataProcessing: "Data processing agreement" },
};

const TRUST_SUBJECT_LABEL: Record<Locale, { dataProtection: string; operations: string }> = {
  de: { dataProtection: "Datenschutz", operations: "Betrieb" },
  en: { dataProtection: "Data protection", operations: "Operations" },
};

const BRIEFING_LABEL: Record<Locale, string> = {
  de: "Beratungstermin buchen",
  en: "Book a briefing",
};

const PROOF_LABEL: Record<Locale, string> = { de: "Belege", en: "Proof" };

/** Fallback context line — used only where a quote's own attribution carries
 * no organisation name to show instead (`parseDemoProofElement`). */
const PROOF_FALLBACK_CONTEXT: Record<"demo" | "sourced", Record<Locale, string>> = {
  demo: { de: "Beispielhafte Rückmeldung", en: "Example feedback" },
  sourced: { de: "Rückmeldung", en: "Feedback" },
};

const PROOF_GEO_LABEL: Record<"demo" | "sourced", Record<Locale, string>> = {
  demo: { de: "Beispiel", en: "Example" },
  sourced: { de: "Beleg", en: "Reference" },
};

/** Strips the artifact's own "(Bild: …)" / "(image: …)" documentation note
 * — never copy to display — before the shared quote parser runs. */
function withoutImageNote(line: string): string {
  return line.replace(/\s*\((?:Bild|image):[^)]*\)\s*$/i, "");
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);
  const heroImage = pageImage(page, "dein-kalender-hero");
  const home = await pageContent("home", locale);

  const focus = slot(page, "dein-kalender-1-focus");
  const contrast = slot(page, "dein-kalender-2-contrast");
  const embedDemo = slot(page, "dein-kalender-3-embed-demo");
  const tiers = slot(page, "dein-kalender-4-tiers");
  const proofDemo = slot(page, "dein-kalender-5-proof-demo");
  const trust = slot(page, "dein-kalender-6-trust");
  const contextBand = slot(home, "home-10-context-band");

  const table = contrast.blocks.find((block) => block.kind === "table");
  const comparisonRows: FourComparisonRows =
    table && table.kind === "table" && table.rows.length === 4
      ? (table.rows.map((row) => ({ today: row[0] ?? "", withProduct: row[1] ?? "" })) as unknown as FourComparisonRows)
      : [
          { today: "", withProduct: "" },
          { today: "", withProduct: "" },
          { today: "", withProduct: "" },
          { today: "", withProduct: "" },
        ];

  const portalizePrice = offeringPrice("portalize-calendar");
  const tier1Ctas = fieldAt(tiers.blocks, 4)?.split("·").map((s) => s.trim()) ?? [];
  const tier3Cta = `${withoutArrow(fieldAt(tiers.blocks, 13))} ${pageTitle("region", locale)}`.trim();

  /**
   * TS-005 through, not around: DEC-048's **3** inline positions beside the
   * claim, selected by the engine rather than by file order.
   *
   * `dein-kalender-5-proof-demo` is `provenance: sourced` (state/open.md
   * row 48, row 162), not `generated` — three real, named quotes, clearance
   * pending (Q-014). `demo` and every displayed label are therefore read off
   * the slot (`isDemoSlot`), never hard-coded: a real quote no longer comes
   * back `mocked`, and only a genuinely generated quote would still badge
   * itself and use the "Beispielhafte Rückmeldung" wording.
   */
  const proofIsDemo = isDemoSlot(proofDemo);
  const proofSelection = await selectProof({
    routeId: ROUTE,
    locale,
    focusJob: "run-our-own-calendar",
    surface: "inline",
    candidates: listItems(proofDemo.blocks).map((line, index) => {
      const card = parseDemoProofElement(
        withoutImageNote(line),
        PROOF_FALLBACK_CONTEXT[proofIsDemo ? "demo" : "sourced"][locale],
      );
      const place = card.attribution.split(", ").slice(1).join(", ").trim();
      return {
        id: `dein-kalender-5-proof-demo-${index + 1}`,
        contextLine: card.contextLine,
        claim: card.claim,
        attribution: card.attribution,
        geo: {
          level: "snapshot" as const,
          label: PROOF_GEO_LABEL[proofIsDemo ? "demo" : "sourced"][locale],
        },
        geoCommunity: place === "" ? null : place,
        demo: proofIsDemo,
      };
    }),
  });

  const focusHeadline = fieldAt(focus.blocks, 0) ?? "";
  const orderLabel = withoutArrow(fieldAt(focus.blocks, 1));
  const briefingLabel = withoutArrow(fieldAt(focus.blocks, 2)) || BRIEFING_LABEL[locale];

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={{ to: "order", label: orderLabel }}
      contextBandHeading={fieldAt(contextBand.blocks, 0)}
      locale={locale}
      meta={pageMeta}
    >
      <div data-block="focus">
        <HeroBlock
          cta={
            <>
              <Button dataCta="primary" locale={locale} onward to="order" variant="pulse">
                {orderLabel}
              </Button>
              <ConversionTracker
                attributes={{ route: ROUTE }}
                goalId="request-product-briefing"
                stage="handover"
              >
                <OutboundLink
                  dataCta="equal-weight"
                  href={BRIEFING_URL}
                  newTab
                  recipient="Google"
                  variant="secondary"
                >
                  {briefingLabel}
                </OutboundLink>
              </ConversionTracker>
            </>
          }
          headline={focusHeadline}
          id="hero"
          // F-2-33: the hero's `photo-surface` badges itself out of the
          // dictionary — without the page's language it marks an English
          // page in German.
          locale={locale}
          notDepicting={heroImage?.notDepicting}
          placeholderId={heroImage?.placeholderId}
          src={heroImage?.src}
          wideSrc={heroImage?.wideSrc}
        />
      </div>

      <SectionShell dataBlock="contrast" surface="paper">
        <ComparisonTable
          headline={CONTRAST_LABELS[locale].heading}
          rows={comparisonRows}
          todayLabel={CONTRAST_LABELS[locale].today}
          withProductLabel={CONTRAST_LABELS[locale].withProduct}
        />
      </SectionShell>

      <SectionShell dataBlock="embed-demo" surface="violet-500">
        <EmbedFrame
          heading={fieldAt(embedDemo.blocks, 0) ?? ""}
          // F-2-33: the mocked mount's `Demo-Daten` badge reads the language.
          locale={locale}
          organizerId="demo-organizer"
          ratio="map"
          state="mocked"
        />
      </SectionShell>

      <SectionShell dataBlock="tiers" surface="lime-100">
        <h2>{fieldAt(tiers.blocks, 0) ?? TIERS_QUESTION_FALLBACK[locale]}</h2>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <OfferTier
            audienceLine={fieldAt(tiers.blocks, 3) ?? ""}
            checks={[]}
            locale={locale}
            name={fieldAt(tiers.blocks, 1) ?? ""}
            offeringId="community-calendar"
            primaryCta={
              <Button locale={locale} to="place" variant={OFFER_TIER_CTA_VARIANT["community-calendar"]}>
                {tier1Ctas[0] ?? ""}
              </Button>
            }
            priceDisplay="permanent"
            secondaryCta={
              tier1Ctas[1] ? (
                <Button
                  locale={locale}
                  to="takePart"
                  variant={OFFER_TIER_CTA_VARIANT["community-calendar"]}
                >
                  {tier1Ctas[1]}
                </Button>
              ) : undefined
            }
          />

          <OfferTier
            audienceLine={fieldAt(tiers.blocks, 7) ?? ""}
            checks={[]}
            locale={locale}
            name={fieldAt(tiers.blocks, 5) ?? ""}
            offeringId="portalize-calendar"
            primaryCta={
              <Button
                locale={locale}
                to="order"
                variant={OFFER_TIER_CTA_VARIANT["portalize-calendar"]}
              >
                {fieldAt(tiers.blocks, 8)}
              </Button>
            }
            priceDisplay={portalizePrice.display}
            priceFigure={portalizePrice.figure}
            secondaryCta={
              <ConversionTracker
                attributes={{ route: ROUTE }}
                goalId="request-product-briefing"
                stage="handover"
              >
                <OutboundLink href={BRIEFING_URL} newTab recipient="Google">
                  {fieldAt(tiers.blocks, 9)}
                </OutboundLink>
              </ConversionTracker>
            }
          />

          <OfferTier
            audienceLine={fieldAt(tiers.blocks, 12) ?? ""}
            checks={[]}
            locale={locale}
            name={fieldAt(tiers.blocks, 10) ?? ""}
            offeringId="portalize-enterprise"
            primaryCta={
              <Button locale={locale} to="region" variant={OFFER_TIER_CTA_VARIANT["portalize-enterprise"]}>
                {tier3Cta}
              </Button>
            }
            priceDisplay="on-request"
          />
        </div>
      </SectionShell>

      <SectionShell dataBlock="proof" labelledBy="proof-heading" surface="paper">
        <h2 id="proof-heading">{PROOF_LABEL[locale]}</h2>
        <ProofStream label={PROOF_LABEL[locale]}>
          {proofSelection.entries.map((entry, position) =>
            entry.kind === "item" ? (
              <ProofCard
                attribution={entry.candidate.attribution}
                claim={entry.candidate.claim}
                contextLine={entry.candidate.contextLine}
                geo={entry.candidate.geo}
                image={{ alt: "" }}
                key={entry.candidate.id}
                locale={locale}
                state={entry.state}
              />
            ) : (
              <EmptyProofSlot
                key={`empty-${position}`}
                locale={locale}
                sentence={
                  locale === "de"
                    ? "Für diese Aussage ist noch kein freigegebener Beleg hinterlegt."
                    : "No cleared proof is on file for this claim yet."
                }
              />
            ),
          )}
        </ProofStream>
      </SectionShell>

      <SectionShell dataBlock="trust" surface="lime-100">
        <TrustBlock
          dataProcessingLabel={TRUST_PRIVACY_LABEL[locale].dataProcessing}
          headline={fieldAt(trust.blocks, 0) ?? TRUST_HEADLINE[locale]}
          locale={locale}
          privacyLabel={TRUST_PRIVACY_LABEL[locale].privacy}
          subjects={[
            {
              id: "data-protection",
              label: TRUST_SUBJECT_LABEL[locale].dataProtection,
              body: withoutArrow(fieldAt(trust.blocks, 1)),
            },
            {
              // TS-024-A19 / state/open.md row 163, row 19: the slot now carries a
              // sourced operations sentence naming a hub record
              // (`people@0.3.6#jan-henrik-hempel`,
              // `proof@0.3.5#in-operation-since-2018`), so it ships. AI use
              // stays unpublished — no hub record names it yet (D10), and
              // A19 blocks any sentence without one; the content artifact's
              // `derived_from: []` demo sentence for it is deliberately not
              // read here.
              id: "operations",
              label: TRUST_SUBJECT_LABEL[locale].operations,
              body: withoutArrow(fieldAt(trust.blocks, 2)),
            },
          ]}
        />
      </SectionShell>
    </PageFrame>
    </>
  );
}
