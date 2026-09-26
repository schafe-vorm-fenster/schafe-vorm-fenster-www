import { Button } from "@/src/components/button/button";
import { ComparisonTable } from "@/src/components/comparison-table/comparison-table";
import { EmbedFrame } from "@/src/components/embed-frame/embed-frame";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { Icon } from "@/src/components/icon/icon";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import {
  PriceSection,
  PriceTierRow,
  type PriceTierId,
} from "@/src/components/price-section/price-section";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { SettingRow, SettingRows } from "@/src/components/setting-row/setting-row";
import { TrustBlock } from "@/src/components/trust-block/trust-block";
import { CONTACT_SECTION_ID } from "@/src/components/contact-section/contact-section";
import { fieldAt } from "@/src/lib/content/blocks";
import { pageImage } from "@/src/lib/content/images";
import { HERO_IMAGE_ID } from "@/src/lib/pages/hero-images";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot } from "@/src/lib/content/provenance";
import { CONFIG_REPO_URL } from "@/src/lib/embed/config-repo";
import { DEFAULT_WEEKS_AHEAD, SHOWCASE_CALENDAR } from "@/src/lib/embed/portalize";
import { parseDemoProofElement } from "@/src/lib/pages/demo-content";
import { offeringPrice } from "@/src/lib/pricing/offerings";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageTitle } from "@/src/lib/routes/metadata";

import { PageJsonLd } from "../_structured-data";
import { pageContent } from "../_content";
import { selectProof } from "../_proof";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";

import { settingRows, tierChecks } from "./content";
import { pageMeta } from "./page.meta";

import { Fragment } from "react";

import pageStyles from "../_pages.module.css";

import type { IconName } from "@/src/components/icon/icon";
import type { FourComparisonRows } from "@/src/components/content-fragments";
import type { ContentBlock } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0024 — `/dein-kalender`, the 480 € page.
 *
 * Own blocks, D2 order (seven since DEC-0131 §1): focus (Pulse + the
 * equal-weight in-page link to the contact section) → contrast → embed demo →
 * embed config → tiers → proof → trust. Context band and closing CTA are
 * `PageFrame`'s, from `page.meta.ts`; the contact section is chrome
 * (DEC-0122), and it carries the page's one appointment URL (DEC-0081 §3).
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
 * The two column labels of the contrast block — the artifact's own table
 * head, read off the content rather than typed here.
 *
 * They used to be a constant in this file, reading "Mit dem Produkt" over a
 * heading "Heute — und mit dem Produkt". `SRC-0017` CG-039 fails a build on
 * both, `DEC-0106 §2` makes "today" and "with your calendar" a determination
 * rather than a placeholder, and `plan/reviews/2026-09-23/decisions.md` row
 * 10 writes the two German words. The wording is copy (DEC-0083 §1), so it
 * lives in `content/pages/dein-kalender/**` with the four rows it labels —
 * one table, one source.
 */
function comparisonLabels(table: ContentBlock | undefined): { today: string; withCalendar: string } {
  const head = table && table.kind === "table" ? table.head : [];
  return { today: head[0] ?? "", withCalendar: head[1] ?? "" };
}

/**
 * The three joints of this page, as the brief writes them. Each ties the
 * section it opens to the one before it and adds no claim of its own: the
 * page was four arguments standing next to each other with nothing between
 * them.
 */
const TRANSITIONS: Record<Locale, { embed: string; trust: string }> = {
  de: {
    embed: "So sieht das aus, wenn es bei euch steht:",
    trust: "Bleibt die Frage, wem ihr da eigentlich eure Daten gebt.",
  },
  en: {
    embed: "This is what it looks like once it sits on your site:",
    trust: "Which leaves the question of who you are actually giving your data to.",
  },
};

/**
 * The placeholder badge beside a setting the product holds but has not
 * confirmed — `setting-row`'s `marker` slot (DEC-0118). The review asks for
 * exactly this on the `Zeitraum` row ("Müssen wir bei Portalize nachsehen,
 * was wirklich geht"), so it is the owner's word, not a softening of a claim.
 * Driven from here rather than from the artifact, because which setting is
 * unconfirmed is knowledge about the product, not copy taste.
 */
const SETTING_CHECKED_MARKER: Record<Locale, string> = {
  de: "wird geprüft",
  en: "being checked",
};

/** The row index whose fact is still open upstream — `Zeitraum` / `Window`. */
const SETTING_UNCONFIRMED_INDEX = 3;

/**
 * The six settings' glyphs, in the artifact's row order — the drafts'
 * `Design -. Portalize Einstellungen 1/2.png`. A glyph is decorative
 * (`setting-row` A11y), so the order is the only thing that binds it to a
 * row; a seventh row would render without one rather than borrow a
 * neighbour's.
 */
const SETTING_ICONS: readonly IconName[] = [
  "map-pin",
  "users",
  "theater",
  "clock",
  "monitor",
  "circle-check",
];

/** The benefit band's source pills, in the drafts' order — decorative glyphs beside the artifact's words. */
const SOURCE_ICONS: readonly IconName[] = ["smartphone", "calendar-days", "globe"];

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
  // The embed slot is two sentences and a heading now (review R-kalender-9):
  // "Das ist der Kalender von [Ort]. Er zeigt genau das, was dort in den
  // nächsten Wochen ansteht." Everything the settings decide moved into its
  // own slot with its own block, which is what `embed-config` is
  // (TS-WEB-0024 D2 as amended, DEC-0131 §1).
  const embedParagraphs = embedDemo.blocks.flatMap((block) =>
    block.kind === "paragraph" ? [block.text] : [],
  );
  const embedConfig = slot(page, "dein-kalender-3b-embed-config");
  const configParagraphs = embedConfig.blocks.flatMap((block) =>
    block.kind === "paragraph" ? [block.text] : [],
  );
  const configSources = (fieldAt(embedConfig.blocks, 1) ?? "")
    .split("·")
    .map((value) => value.trim())
    .filter((value) => value !== "");
  const configSettings = settingRows(embedConfig.blocks);
  const tiers = slot(page, "dein-kalender-4-tiers");
  // The three check lines per tier are the drafts', not the owner's: their
  // own slot, `provenance: generated; demo: true`, one row in state/open.md
  // (DEC-0068, DEC-0131 §3).
  const tierCheckSlot = slot(page, "dein-kalender-4-tiers-checks-demo");
  const checks = tierChecks(tierCheckSlot.blocks);
  const proofDemo = slot(page, "dein-kalender-5-proof-demo");
  const trust = slot(page, "dein-kalender-6-trust");
  const closing = slot(page, "dein-kalender-7-closing");
  const contextBand = slot(home, "home-10-context-band");

  const table = contrast.blocks.find((block) => block.kind === "table");
  const labels = comparisonLabels(table);
  const comparisonRows: FourComparisonRows =
    table && table.kind === "table" && table.rows.length === 4
      ? (table.rows.map((row) => ({ today: row[0] ?? "", withProduct: row[1] ?? "" })) as unknown as FourComparisonRows)
      : [
          { today: "", withProduct: "" },
          { today: "", withProduct: "" },
          { today: "", withProduct: "" },
          { today: "", withProduct: "" },
        ];

  /**
   * The tiers, in the order `TS-WEB-0024 D6/D6a` fixes, each with the one CTA
   * `DEC-0082 §4` allows it. Weight is not chosen here: `PriceTierRow`
   * derives quiet · primary-light · quiet from the offering id, so a call
   * site cannot put Pulse on a tier (A3, A8).
   */
  const tierRows: readonly {
    readonly offeringId: PriceTierId;
    readonly kicker: string;
    readonly title: string;
    readonly cta: { readonly label: string; readonly to: "takePart" | "order" | "region" };
  }[] = [
    {
      offeringId: "community-calendar",
      kicker: fieldAt(tiers.blocks, 2) ?? "",
      title: fieldAt(tiers.blocks, 3) ?? "",
      cta: { label: withoutArrow(fieldAt(tiers.blocks, 4)), to: "takePart" },
    },
    {
      offeringId: "portalize-calendar",
      kicker: fieldAt(tiers.blocks, 5) ?? "",
      title: fieldAt(tiers.blocks, 6) ?? "",
      cta: { label: withoutArrow(fieldAt(tiers.blocks, 7)), to: "order" },
    },
    {
      offeringId: "portalize-enterprise",
      kicker: fieldAt(tiers.blocks, 9) ?? "",
      title: fieldAt(tiers.blocks, 10) ?? "",
      /**
       * The link names where it goes, and nothing else. "Weiter zu Kalender
       * für euer ganzes Gebiet" wrapped to two centred lines in a column of
       * otherwise left-aligned controls (brief, page 6, item 3), and the
       * tier's own title already says which territory this is.
       */
      cta: { label: pageTitle("region", locale), to: "region" },
    },
  ];

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
        /* No quiet second way under the button any more. It was a second
           carrier of the appointment URL, and DEC-0081 §3 gives that URL one
           place on a page: the contact section's first action row, which
           stands directly below this block (TS-WEB-0024-A15). */
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
              {/* The consult half no longer leaves the site: it is an in-page
                  link to this page's own contact section, where appointment,
                  WhatsApp, phone and mail stand together and where the
                  conversion is measured (TS-WEB-0024 D3, DEC-0081 §3). It
                  carries no `ConversionTracker` — a click inside a document
                  is navigation, and counting it would count one intent twice
                  (DEC-0081 §4, TS-WEB-0024-A15) — and no outbound
                  disclosure, because nothing outbound happens here. */}
              <Button
                dataCta="equal-weight"
                hash={CONTACT_SECTION_ID}
                locale={locale}
                to={ROUTE}
                variant="secondary"
              >
                {briefingLabel}
              </Button>
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
        {/* Kicker "Warum es heute hakt" over a title that says what goes —
            the CG-005 / CG-018 split, with the review's own headline. */}
        <ComparisonTable
          headline={fieldAt(contrast.blocks, 0)}
          rows={comparisonRows}
          todayLabel={labels.today}
          withProductLabel={labels.withCalendar}
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

      {/* `WAS HILFT EUCH DAS?` over a title that states what goes — the
          calendar above shows the mechanism, and this block answers the
          question a municipality, a Verein or a Stiftung actually has about
          it: whether it decides what stands in it. Its own `data-block`
          since DEC-0131 §1 — TS-WEB-0024 D2 lists seven blocks now, because
          squeezing the settings back into `embed-demo` is what measured
          1772 px at 390 px (G-4).

          `paper`, not `surface-2`: the grey-greens are the old world's
          ground and never carry positive content (SRC-0014 §Page Rhythm),
          and the review says the settings looked "angestaubt" for exactly
          that reason. The band inside runs edge to edge, so the section is
          uncontained and each part brings its own container. */}
      <SectionShell
        contained={false}
        dataBlock="embed-config"
        kicker={dictionary(locale).kickers.whyItMatters}
        labelledBy="embed-config-heading"
        surface="paper"
      >
        <div className="container">
          <h2 id="embed-config-heading">{fieldAt(embedConfig.blocks, 0)}</h2>
          <p className={pageStyles.configLead}>{configParagraphs[0]}</p>
        </div>

        {/* The benefit band: where the dates come from, and the one place
            they all land. `lime-500` — the fresh ground the review asks for,
            and the pills are the sources in the visitor's own words. */}
        <div className={pageStyles.benefitBand} data-surface="lime-500">
          <div className="container">
            <ul className={pageStyles.sourcePills}>
              {configSources.map((source, index) => (
                <li className={pageStyles.sourcePill} key={source}>
                  {SOURCE_ICONS[index] ? <Icon name={SOURCE_ICONS[index]} size={18} /> : null}
                  {source}
                </li>
              ))}
            </ul>
            <p className={pageStyles.benefitTarget}>
              <Icon name="arrow-right" size={24} />
              <span className={pageStyles.targetPill}>
                <Icon name="monitor" size={18} />
                {fieldAt(embedConfig.blocks, 2)}
              </span>
            </p>
            <p className={pageStyles.benefitLine}>{configParagraphs[1]}</p>
          </div>
        </div>

        <div className="container">
          <h3 className={pageStyles.settingsHeading}>{fieldAt(embedConfig.blocks, 3)}</h3>
          <SettingRows>
            {configSettings.map((row, index) => (
              <SettingRow
                core={row.core}
                example={row.example}
                icon={SETTING_ICONS[index] ?? "info"}
                key={row.title}
                marker={
                  index === SETTING_UNCONFIRMED_INDEX ? SETTING_CHECKED_MARKER[locale] : undefined
                }
                tags={row.tags}
                title={row.title}
              />
            ))}
          </SettingRows>
          {/* The config repo the review points at. No record in this
              repository names its URL, so the link is configured or it does
              not render — never a dead link on the page that asks for 480 €
              (DEC-0131 §4, state/open.md). */}
          {CONFIG_REPO_URL ? (
            <p className={pageStyles.configLink}>
              <OutboundLink href={CONFIG_REPO_URL} locale={locale} newTab>
                {fieldAt(embedConfig.blocks, 4)}
              </OutboundLink>
            </p>
          ) : null}
        </div>
      </SectionShell>

      {/* One `paper` section with the `lime-500` head band on top and the
          three tiers as rows beneath it, divided by a hairline — never three
          sections, never a 2 px lime rule (SRC-0014 §Page Rhythm, DEC-0118).
          The framing line the band carries is the transition this section
          used to render twice. */}
      <PriceSection
        dataBlock="tiers"
        framing={fieldAt(tiers.blocks, 1) ?? ""}
        headingId="tiers-heading"
        headline={fieldAt(tiers.blocks, 0) ?? ""}
        kicker={dictionary(locale).kickers.price}
      >
        {tierRows.map((tier) => (
          <Fragment key={tier.offeringId}>
            <PriceTierRow
              checks={checks[tier.offeringId] ?? []}
              cta={{ label: tier.cta.label, to: tier.cta.to }}
              kicker={tier.kicker}
              locale={locale}
              offeringId={tier.offeringId}
              price={offeringPrice(tier.offeringId, locale)}
              title={tier.title}
            />
            {/* D7 — the one sentence that names the product, at the tier
                where the price is read. `price-tier-row` has no body-copy
                slot (T-06), so it stands directly under the row it belongs
                to, inside the tiers block (DEC-0131 §3). */}
            {tier.offeringId === "portalize-calendar" ? (
              <p className={pageStyles.tierNote}>{fieldAt(tiers.blocks, 8)}</p>
            ) : null}
          </Fragment>
        ))}
      </PriceSection>

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
        // Customer proof: the placeholder kicker, marked (DEC-0120 §5).
        kicker={dictionary(locale).kickers.customers}
        kickerDemo
        labelledBy="proof-heading"
        // `lime-100`, not `paper`: the price section above it is one paper
        // section now (DEC-0118), and `embed-config` above that is a third —
        // three neutral grounds in a row is the one rhythm rule this
        // composition can break (`rhythm.test.ts`).
        surface="lime-100"
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
