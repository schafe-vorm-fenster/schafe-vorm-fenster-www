import { Button } from "@/src/components/button/button";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { ObjectionList } from "@/src/components/objection-list/objection-list";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { PublishingPath } from "@/src/components/publishing-path/publishing-path";
import { RouteLink } from "@/src/components/route-link/route-link";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { slotState } from "@/src/lib/content/provenance";
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
 * TS-022 — `/mitmachen`, the publishing entry.
 *
 * Own blocks, in D2 order: hero (scene) → objections → three publishing
 * paths → live example (ink, the page's single dark section, D10) → proof.
 * The context band and the closing CTA are block 3/4 of TS-006 D2 and are
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
 * failure and the channel names itself from context. Content is TS-022 D3's;
 * this two-part rendering split is [PROPOSED], a UI decision only.
 */
function splitObjection(text: string): { channel: string; failure: string } {
  const dash = text.split(" — ");
  if (dash.length >= 2) return { channel: dash[0], failure: dash.slice(1).join(" — ") };
  return { channel: text, failure: "" };
}

/**
 * The demo proof items of `mitmachen-7-proof-demo`: an ordered list of
 * `„<claim>" — <attribution>` lines (state/open.md Dummy-Content #49).
 */
function parseDemoQuote(line: string): { claim: string; attribution: string } {
  const match = /^„(.+)"\s*—\s*(.+)$/.exec(line);
  if (!match) return { claim: line, attribution: "" };
  return { claim: match[1], attribution: match[2] };
}

const PATHS_LABEL: Record<Locale, string> = {
  de: "Drei Wege, die Termine zu uns zu bringen",
  en: "Three ways to get your dates to us",
};

const PROOF_LABEL: Record<Locale, string> = {
  de: "Was andere sagen",
  en: "What others say",
};

const PROOF_CONTEXT_LINE: Record<Locale, string> = {
  de: "Beispielhafte Rückmeldung",
  en: "Example feedback",
};

const GEO_SNAPSHOT_LABEL: Record<Locale, string> = { de: "Beispiel", en: "Example" };

/** SRC-001 §4: an unfilled position weakens the claim, it never shortens the stream. */
const MISSING_PROOF: Record<Locale, string> = {
  de: "Für diese Aussage ist noch kein freigegebener Beleg hinterlegt.",
  en: "No cleared proof is on file for this claim yet.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);
  const home = await pageContent("home", locale);

  const hero = slot(page, "mitmachen-1-hero");
  const objections = slot(page, "mitmachen-2-objections");
  const pathWhatsapp = slot(page, "mitmachen-3-path-whatsapp");
  const pathCalendar = slot(page, "mitmachen-4-path-calendar");
  const pathWebsite = slot(page, "mitmachen-5-path-website");
  const example = slot(page, "mitmachen-6-beispiel");
  const proofDemo = slot(page, "mitmachen-7-proof-demo");
  const contextBand = slot(home, "home-10-context-band");

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
   * TS-005 through, not around: the inline surface is **3** positions
   * (DEC-048), gated, scored, rotated and ordered by the engine. The demo
   * quotes pass the clearance gate carrying their flag and come back as the
   * `mocked` state, which is what badges each card.
   */
  const proofSelection = await selectProof({
    routeId: ROUTE,
    locale,
    focusJob: "publish-our-dates",
    surface: "inline",
    candidates: listItems(proofDemo.blocks).map((line, index) => {
      const quote = parseDemoQuote(line);
      const place = quote.attribution.split(", ").slice(1).join(", ").trim();
      return {
        id: `mitmachen-7-proof-demo-${index + 1}`,
        contextLine: PROOF_CONTEXT_LINE[locale],
        claim: quote.claim,
        attribution: quote.attribution,
        geo: { level: "snapshot" as const, label: GEO_SNAPSHOT_LABEL[locale] },
        geoCommunity: place === "" ? null : place,
        demo: true,
      };
    }),
  });
  const heroCtaLabel = fieldAt(hero.blocks, 2) ?? "";

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={{
        to: "register",
        label: heroCtaLabel,
        // TS-022-A11: with the backing element unavailable at build time
        // (Open points — the 2022 commitment has no `proof/` element), the
        // permanence promise is absent rather than reworded, even though
        // the content artifact carries a generated placeholder sentence
        // under the prototype completeness override (state/open.md #45).
        // Recorded as a content/spec tension in `state/open.md`, not
        // silently resolved by rendering it.
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
          lead={fieldAt(hero.blocks, 1)}
          state={slotState(hero)}
        />
      </div>

      <SectionShell dataBlock="objections" label={fieldAt(objections.blocks, 0)} surface="paper">
        <ObjectionList
          headline={fieldAt(objections.blocks, 0) ?? ""}
          items={listItems(objections.blocks).map(splitObjection)}
        />
      </SectionShell>

      <SectionShell dataBlock="wege" labelledBy="wege-heading" surface="surface-2">
        <h2 id="wege-heading">{PATHS_LABEL[locale]}</h2>
        <PublishingPath
          headline={fieldAt(pathWhatsapp.blocks, 0) ?? ""}
          mechanism="whatsapp"
          steps={stepsOf(listItems(pathWhatsapp.blocks))}
        />
        <PublishingPath
          headline={fieldAt(pathCalendar.blocks, 0) ?? ""}
          mechanism="calendar-connection"
          steps={stepsOf(listItems(pathCalendar.blocks))}
        />
        <PublishingPath
          availability="alpha"
          availabilityLabel={fieldAt(pathWebsite.blocks, 1)}
          headline={fieldAt(pathWebsite.blocks, 0) ?? ""}
          mechanism="website-import"
          steps={stepsOf(listItems(pathWebsite.blocks))}
        />
        <aside>
          <p>
            {(fieldAt(pathWebsite.blocks, 3) ?? "").split("→")[0].trim()}{" "}
            <RouteLink locale={locale} to="calendar">
              {pageTitle("calendar", locale)}
            </RouteLink>
          </p>
        </aside>
      </SectionShell>

      <SectionShell dataBlock="beispiel" label={exampleTitle} surface="ink">
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

      {/* `lime-100`, not `paper`: `PageFrame` appends `surface` (band) then
          `paper` (closing) after this section — three consecutive `neutral`-
          family sections would break the rhythm rule this page's own test
          checks (TS-022-A16, D10). */}
      <SectionShell dataBlock="beleg" labelledBy="beleg-heading" surface="lime-100">
        <h2 id="beleg-heading">{PROOF_LABEL[locale]}</h2>
        <ProofStream label={PROOF_LABEL[locale]}>
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
              <EmptyProofSlot key={`empty-${position}`} sentence={MISSING_PROOF[locale]} />
            ),
          )}
        </ProofStream>
      </SectionShell>
    </PageFrame>
    </>
  );
}
