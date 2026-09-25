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
import { HERO_IMAGE_ID } from "@/src/lib/pages/hero-images";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot } from "@/src/lib/content/provenance";
import { DEFAULT_WEEKS_AHEAD, SHOWCASE_CALENDAR } from "@/src/lib/embed/portalize";
import { BRIEFING_URL } from "@/src/lib/live/briefing";
import { parseDemoProofElement } from "@/src/lib/pages/demo-content";
import { offeringPrice } from "@/src/lib/pricing/offerings";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageTitle } from "@/src/lib/routes/metadata";

import { PageJsonLd } from "../_structured-data";
import { pageContent } from "../_content";
import { selectProof } from "../_proof";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";

import { pageMeta } from "./page.meta";

import pageStyles from "../_pages.module.css";

import type { FourComparisonRows } from "@/src/components/content-fragments";
import type { ContentBlock } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0024 — `/dein-kalender`, the 480 € page.
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

/**
 * The German heading read "Heute gegen mit dem Produkt" — not a sentence in
 * any language, in 38 px, on the page that asks for 480 €. The dash joins
 * the two columns the four rows below compare; "gegen" was a literal
 * translation of "versus" that German does not take in front of a
 * preposition.
 */
const CONTRAST_LABELS: Record<Locale, { today: string; withProduct: string; heading: string }> = {
  de: { today: "Heute", withProduct: "Mit dem Produkt", heading: "Heute — und mit dem Produkt" },
  en: { today: "Today", withProduct: "With the product", heading: "Today — and with the product" },
};

/**
 * The three joints of this page, as the brief writes them. Each ties the
 * section it opens to the one before it and adds no claim of its own: the
 * page was four arguments standing next to each other with nothing between
 * them.
 */
const TRANSITIONS: Record<Locale, { embed: string; tiers: string; trust: string }> = {
  de: {
    embed: "So sieht das aus, wenn es bei euch steht:",
    tiers: "Was das kostet, hängt nur davon ab, wo der Kalender stehen soll.",
    trust: "Bleibt die Frage, wem ihr da eigentlich eure Daten gebt.",
  },
  en: {
    embed: "This is what it looks like once it sits on your site:",
    tiers: "What it costs depends only on where the calendar is going to sit.",
    trust: "Which leaves the question of who you are actually giving your data to.",
  },
};

/**
 * G-5 — the outbound disclosure leaves the button's label.
 *
 * "(öffnet neuen Tab) · Daten gehen an Google" rendered inside the pill and
 * made the secondary a three-line block that outweighed the page's own
 * primary. The new-tab half stays, written out, under the control; the data
 * half belongs to the trust block further down, which links the privacy
 * statement that actually says it.
 */
const BRIEFING_DISCLOSURE: Record<Locale, string> = {
  de: "Öffnet Google Kalender in einem neuen Tab.",
  en: "Opens Google Calendar in a new tab.",
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
  demo: { de: "Rückmeldung", en: "Feedback" },
  sourced: { de: "Rückmeldung", en: "Feedback" },
};

const PROOF_GEO_LABEL: Record<"demo" | "sourced", Record<Locale, string>> = {
  demo: { de: "Beleg", en: "Reference" },
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
  const heroImage = pageImage(page, HERO_IMAGE_ID.calendar);
  const home = await pageContent("home", locale);

  const focus = slot(page, "dein-kalender-1-focus");
  const contrast = slot(page, "dein-kalender-2-contrast");
  const embedDemo = slot(page, "dein-kalender-3-embed-demo");
  // Slot 3 carries three things beside its heading: the paragraph that
  // explains the embedded calendar, the label of its settings list, and the
  // settings themselves as `key: value` lines (`src/lib/content/README.md`'s
  // block grammar — a field with an empty value is a heading for what
  // follows).
  // Two paragraphs now, not one: the first says the calendar below is real,
  // the second says what the settings decide. They stand in two sections —
  // the embed section measured 1772 px, a screen and a half over G-4's
  // budget, with a nine-line paragraph above the box and a six-row settings
  // list below it.
  const embedParagraphs = embedDemo.blocks.flatMap((block) =>
    block.kind === "paragraph" ? [block.text] : [],
  );
  const embedConfigLabel =
    embedDemo.blocks.flatMap((block) =>
      block.kind === "field" && block.value === "" ? [block.label] : [],
    )[0] ?? "";
  const embedConfig = embedDemo.blocks
    .flatMap((block) => (block.kind === "list" ? block.items : []))
    .flatMap((item) => {
      const separator = item.indexOf(":");
      return separator === -1
        ? []
        : [{ key: item.slice(0, separator).trim(), value: item.slice(separator + 1).trim() }];
    });
  const tiers = slot(page, "dein-kalender-4-tiers");
  const proofDemo = slot(page, "dein-kalender-5-proof-demo");
  const trust = slot(page, "dein-kalender-6-trust");
  const closing = slot(page, "dein-kalender-7-closing");
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

  const portalizePrice = offeringPrice("portalize-calendar", locale);
  const tier1Ctas = fieldAt(tiers.blocks, 4)?.split("·").map((s) => s.trim()) ?? [];
  /**
   * The link names where it goes, and nothing else. "Weiter zu Kalender für
   * euer ganzes Gebiet" wrapped to two centred lines in a column of
   * otherwise left-aligned controls (brief, page 6, item 3); the tier's own
   * title above it already says "für eine ganze Region", so repeating that
   * as the label would put the same four words twice in one card.
   */
  const tier3Cta = pageTitle("region", locale);

  /**
   * TS-WEB-0005 through, not around: DEC-0048's **3** inline positions beside the
   * claim, selected by the engine rather than by file order.
   *
   * `dein-kalender-5-proof-demo` is `provenance: sourced` (state/open.md
   * row 48, row 162), not `generated` — three real, named quotes, clearance
   * pending (Q-0014). `demo` and every displayed label are therefore read off
   * the slot (`isDemoSlot`), never hard-coded: a real quote no longer comes
   * back `mocked`, and only a genuinely generated quote would still badge
   * itself in `data-demo`; the words a visitor reads are the same either
   * way (Jan, 2026-09-18).
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
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={{
        to: "order",
        label: orderLabel,
        heading: fieldAt(closing.blocks, 0),
        /* The equal-weight second way, as a quiet link rather than a second
           pill: G-5 allows one primary treatment per screenful, and this one
           belongs to the order. */
        footer: (
          <ConversionTracker
            attributes={{ route: ROUTE }}
            goalId="request-product-briefing"
            stage="handover"
          >
            <OutboundLink
              disclosure={BRIEFING_DISCLOSURE[locale]}
              href={BRIEFING_URL}
              locale={locale}
              newTab
              variant="quiet"
            >
              {fieldAt(closing.blocks, 2)}
            </OutboundLink>
          </ConversionTracker>
        ),
      }}
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
                  disclosure={BRIEFING_DISCLOSURE[locale]}
                  href={BRIEFING_URL}
                  locale={locale}
                  newTab
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
          focal={heroImage?.focal}
          notDepicting={heroImage?.notDepicting}
          placeholderId={heroImage?.placeholderId}
          src={heroImage?.src}
          wideSrc={heroImage?.wideSrc}
        />
      </div>

      <SectionShell
        dataBlock="contrast"
        kicker={dictionary(locale).kickers.objection}
        surface="paper"
      >
        <ComparisonTable
          headline={CONTRAST_LABELS[locale].heading}
          rows={comparisonRows}
          todayLabel={CONTRAST_LABELS[locale].today}
          withProductLabel={CONTRAST_LABELS[locale].withProduct}
        />
      </SectionShell>

      {/*
          The most persuasive module on the page, and for a long time the most
          expensive defect on the site: an empty lilac rectangle where the
          embedded calendar was meant to be. It is the real Portalize widget
          now, showing the real calendar of three neighbouring villages — so
          it gets the room it deserves and nothing else in its section.

          The settings that produce it stand one section lower (G-4): the two
          together measured 1772 px, a screen and a half over budget, and the
          config list read as fine print under the picture rather than as the
          answer to "but can we decide what is in it?". */}
      <SectionShell
        dataBlock="embed-demo"
        kicker={dictionary(locale).kickers.howItWorks}
        surface="violet-500"
        transition={TRANSITIONS[locale].embed}
      >
        <EmbedFrame
          copy={embedParagraphs[0]}
          heading={fieldAt(embedDemo.blocks, 0) ?? ""}
          locale={locale}
          // The real calendar of Schlatkow, Schmatzin and Wolfradshof —
          // `src/lib/embed/portalize.ts` records which one and why.
          organizerId={SHOWCASE_CALENDAR.organizerId}
          ratio="map"
          showBranding={SHOWCASE_CALENDAR.branding}
          state="ready"
          weeksAhead={DEFAULT_WEEKS_AHEAD}
        />
      </SectionShell>

      {/* `WARUM DAS ZÄHLT`, not a second `SO FUNKTIONIERT ES`: the calendar
          above shows the mechanism, and this section answers the question a
          municipality actually has about it — whether it decides what stands
          in it. G-3's vocabulary is closed, and this is the entry that
          names that role. */}
      <SectionShell
        dataBlock="embed-config"
        kicker={dictionary(locale).kickers.whyItMatters}
        labelledBy="embed-config-heading"
        surface="surface-2"
      >
        <h2 id="embed-config-heading">{fieldAt(embedDemo.blocks, 1)}</h2>
        <p>{embedParagraphs[1]}</p>
        <dl aria-label={embedConfigLabel} className={pageStyles.configList}>
          {embedConfig.map(({ key, value }) => (
            <div className={pageStyles.configRow} key={key}>
              <dt className={pageStyles.configKey}>{key}</dt>
              <dd className={pageStyles.configValue}>{value}</dd>
            </div>
          ))}
        </dl>
      </SectionShell>

      <SectionShell
        dataBlock="tiers"
        kicker={dictionary(locale).kickers.price}
        labelledBy="tiers-heading"
        surface="lime-100"
        transition={TRANSITIONS[locale].tiers}
      >
        <h2 id="tiers-heading">{fieldAt(tiers.blocks, 0) ?? TIERS_QUESTION_FALLBACK[locale]}</h2>
        <div className={pageStyles.tierGroup}>
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
                <OutboundLink
                  disclosure={BRIEFING_DISCLOSURE[locale]}
                  href={BRIEFING_URL}
                  locale={locale}
                  newTab
                  variant="quiet"
                >
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
              <Button
                locale={locale}
                onward
                size="compact"
                to="region"
                variant={OFFER_TIER_CTA_VARIANT["portalize-enterprise"]}
              >
                {tier3Cta}
              </Button>
            }
            priceDisplay="on-request"
          />
        </div>
      </SectionShell>

      {/* G-9 and G-7 together. The three cards carried an image slot with no
          cleared image behind it: three identical 143 px bands in a row,
          which also broke the design system's own "no two photo surfaces
          adjacent" rule. The slot is gone — a mayor's portrait is not a
          photo-contribution occasion — and the stream is one feature card
          over two hairline rows, without the `Beleg` badge each card already
          repeats in its own source line. 1176 px becomes about a third of
          that. */}
      <SectionShell
        dataBlock="proof"
        kicker={dictionary(locale).kickers.evidence}
        labelledBy="proof-heading"
        surface="paper"
      >
        <h2 id="proof-heading">{PROOF_LABEL[locale]}</h2>
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

      <SectionShell
        dataBlock="trust"
        kicker={dictionary(locale).kickers.trust}
        surface="lime-100"
        transition={TRANSITIONS[locale].trust}
      >
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
              // TS-WEB-0024-A19 / state/open.md row 163, row 19: the slot now carries a
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
