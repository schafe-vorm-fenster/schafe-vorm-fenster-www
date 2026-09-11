import { Button } from "@/src/components/button/button";
import { ComparisonTable } from "@/src/components/comparison-table/comparison-table";
import { ConversionTracker } from "@/src/components/conversion-tracker/conversion-tracker";
import { EmbedFrame } from "@/src/components/embed-frame/embed-frame";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { OfferTier, OFFER_TIER_CTA_VARIANT } from "@/src/components/offer-tier/offer-tier";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { TrustBlock } from "@/src/components/trust-block/trust-block";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { resolveLocale } from "@/src/lib/i18n/locales";
import { BRIEFING_URL } from "@/src/lib/live/briefing";
import { offeringPrice } from "@/src/lib/pricing/offerings";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { pageContent } from "../_content";
import { localeFrom } from "../_locale";
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
  return pageMetadata(ROUTE, resolveLocale((await params).lang));
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

const BRIEFING_LABEL: Record<Locale, string> = {
  de: "Beratungstermin buchen",
  en: "Book a briefing",
};

const PROOF_LABEL: Record<Locale, string> = { de: "Belege", en: "Proof" };

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);
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

  const demoQuotes = listItems(proofDemo.blocks).map((line) => {
    const match = /^„(.+)"\s*—\s*(.+?)(?:\s*\(Bild:.*\)|\s*\(image:.*\))?$/.exec(line);
    return match ? { claim: match[1], attribution: match[2] } : { claim: line, attribution: "" };
  });

  const focusHeadline = fieldAt(focus.blocks, 0) ?? "";
  const orderLabel = withoutArrow(fieldAt(focus.blocks, 1));
  const briefingLabel = withoutArrow(fieldAt(focus.blocks, 2)) || BRIEFING_LABEL[locale];

  return (
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
          {demoQuotes.map((quote) => (
            <ProofCard
              attribution={quote.attribution}
              claim={quote.claim}
              contextLine={locale === "de" ? "Beispielhafte Rückmeldung" : "Example feedback"}
              geo={{ level: "snapshot", label: locale === "de" ? "Beispiel" : "Example" }}
              image={{ alt: "" }}
              key={quote.claim}
              locale={locale}
              state="mocked"
            />
          ))}
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
              label: locale === "de" ? "Datenschutz" : "Data protection",
              // TS-024-A19: operations/AI stay unpublished — no hub record
              // names either (D10), and A19 blocks any sentence without
              // one. The content artifact's `derived_from: []` demo
              // sentences are intentionally not rendered here (documented
              // tension with the prototype completeness override — see
              // `state/open.md`).
              body: withoutArrow(fieldAt(trust.blocks, 1)),
            },
          ]}
        />
      </SectionShell>
    </PageFrame>
  );
}
