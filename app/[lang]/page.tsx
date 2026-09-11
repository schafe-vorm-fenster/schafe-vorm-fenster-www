import { Button } from "@/src/components/button/button";
import { EventList } from "@/src/components/event-list/event-list";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { LiveCounters } from "@/src/components/live-counters/live-counters";
import { LiveModuleFrame } from "@/src/components/live-module-frame/live-module-frame";
import { MediaFrame } from "@/src/components/media-frame/media-frame";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { SceneBlock } from "@/src/components/scene-block/scene-block";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { loadPage, slot } from "@/src/lib/content/loader";
import { slotState } from "@/src/lib/content/provenance";
import { resolveLocale } from "@/src/lib/i18n/locales";
import { fillTemplate, parseDemoProofElement } from "@/src/lib/pages/demo-content";
import {
  DEMO_DATE_COUNT,
  DEMO_PLACE,
  demoAppHref,
  demoNearbyEvents,
  demoPlaceEvents,
} from "@/src/lib/pages/demo-data";
import { pageMetadata } from "@/src/lib/routes/metadata";

import heroPlaceholder from "@/src/generated/placeholders/home/hero.svg";
import portraitPlaceholder from "@/src/generated/placeholders/ueber-uns/gruender.svg";

import styles from "./_pages.module.css";

import { localeFrom } from "./_locale";
import { PageFrame } from "./_page-frame";
import { HOME_META } from "./page.meta";

import type { ContentSlot } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-019 — `/` — home.
 *
 * Block order is TS-019 D3 and is the DOM order below: focus block · three
 * scenes · provenance stamps · proof stream · context band · closing CTA,
 * with nothing after the closing CTA but the footer (TS-019-A9). Blocks 3
 * and 4 come from `page.meta.ts` through `PageFrame`; this file writes
 * neither.
 *
 * **Which state renders.** TS-019 D2 gives block 1 four states, keyed on
 * what is known about the place. S1 — nothing known — "is what is
 * prerendered and what a crawler and a JS-less visitor get" (D2, TS-010 D8),
 * so S1 is what stands here: the place search as the dominant element, its
 * submit carrying the page's one `data-cta="primary"` (TS-006 D4 — the job
 * is fulfilled in place, never linked). S2 and S3 arrive by island at M4
 * together with the BFF routes of TS-008 D5.
 *
 * **What the mock rule adds.** The prototype must show every function
 * (plan/guardrails.md), so the three live modules that S1 alone would not
 * show — position 1 (dates in the place), position 2 (this week nearby) and
 * position 4 (counters) — render here in the `mocked` state with the
 * `Demo-Daten` badge their frames put on themselves, over the invented
 * `Beispielgemeinde Musterdorf`. Block *structure* is therefore identical to
 * the M4 render (TS-006-A10); only the data source changes. Each has a
 * `Mock aktiv` row in `state/open.md`.
 *
 * **Page rhythm** (SRC-014 §Page Rhythm, checked in `page.rhythm.test.ts`):
 * PHOTO hero · COLOUR ink (the live data anchor, once) · lime-500 ·
 * paper · lime-100 · violet-500 · lime-100 · surface · paper.
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
  return pageMetadata(ROUTE, resolveLocale((await params).lang));
}

/** The generated labels this page needs and no artifact carries (Dummy-Content, state/open.md). */
const DEMO_LABELS: Record<
  Locale,
  { flyerExample: string; geo: string; photoWanted: string; datesUnit: string }
> = {
  de: {
    flyerExample: "Aus dem Flyer geworden — Beispieltermin",
    geo: "Beispiel",
    photoWanted: "Uns fehlt hier ein Bild aus deinem Ort.",
    datesUnit: "Termine",
  },
  en: {
    flyerExample: "Made from the flyer — example date",
    geo: "Example",
    photoWanted: "We are missing a picture from your place here.",
    datesUnit: "dates",
  },
};

function demoProofCards(proof: ContentSlot, locale: Locale) {
  const list = proof.blocks.find((block) => block.kind === "list");
  const items = list?.kind === "list" ? list.items : [];
  return items.map((item) => parseDemoProofElement(item, DEMO_LABELS[locale].geo));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = await localeFrom(params);
  const page = await loadPage(ROUTE, locale);
  const demo = DEMO_LABELS[locale];
  const place = DEMO_PLACE.name[locale];

  const hero = slot(page, "home-1-search-hero");
  const dates = slot(page, "home-2-place-dates");
  const nearby = slot(page, "home-3-place-empty");
  const sceneWhatsapp = slot(page, "home-4-scene-whatsapp");
  const sceneEmbed = slot(page, "home-5-scene-embed");
  const sceneProvenance = slot(page, "home-6-scene-provenance");
  const stamps = slot(page, "home-7-provenance-stamps");
  const proof = slot(page, "home-8-proof-stream");
  const counters = slot(page, "home-9-counters");
  const band = slot(page, "home-10-context-band");

  // Field labels are translated, so the n-th block is the contract, not the
  // label (TS-007, `src/lib/content/README.md`). `Headline` is one of the few
  // labels both locales share.
  const searchPlaceholder = fieldAt(hero.blocks, 1);
  const searchHint = fieldAt(hero.blocks, 3);
  const proofKicker = fieldAt(proof.blocks, 0);

  /**
   * The one primary conversion of the page (TS-006 D3, TS-019 D2 S1): the
   * search submit itself. The same module, same submit label and same
   * target repeats as the closing block — TS-019-A10's "same target and
   * label as the block-1 primary of the current state" — without the marker,
   * which exists exactly once.
   */
  const search = (primary: boolean) => (
    <PlaceSearch
      hint={searchHint}
      id={primary ? "ort-suche-fokus" : "ort-suche-abschluss"}
      label={searchPlaceholder ?? ""}
      locale={locale}
      placeholder={searchPlaceholder}
      submitDataCta={primary ? "primary" : undefined}
      submitLabel={hero.cta}
      to="place"
      tone={primary ? "dark" : "light"}
    />
  );

  return (
    <PageFrame
      closing={{ variant: "module", node: search(false) }}
      contextBandHeading={fieldAt(band.blocks, 0)}
      locale={locale}
      meta={HOME_META}
    >
      {/* Block 1 — the focus block, state S1. `hero-block` brings its own
          `photo-surface` section at `ratio-hero`; the photograph is the
          generated placeholder of DEC-068 until a real one exists. */}
      <HeroBlock
        cta={search(true)}
        headline={hero.fields["Headline"] ?? ""}
        id="focus-block"
        notDepicting
        placeholderId="home/hero"
        src={heroPlaceholder.src}
        state={slotState(hero)}
      />

      {/* Block 1′ — the live dates of a known place. The one `ink` section of
          the page rhythm, and the anchor the live data sits on. Mocked until
          M4 wires `/api/places/{slug}/events` (TS-008 D2). */}
      <MotionReveal>
        <SectionShell id="place-dates" surface="ink">
          <LiveModuleFrame
            cta={
              <OutboundLink href={demoAppHref()} variant="secondary">
                {fillTemplate(dates.cta ?? "", { place })}
              </OutboundLink>
            }
            headingLevel="h2"
            state="mocked"
            title={fillTemplate(dates.fields["Headline"] ?? "", { place })}
          >
            <EventList
              items={demoPlaceEvents(locale)}
              locale={locale}
              rowCount={3}
              state="mocked"
              tone="dark"
            />
          </LiveModuleFrame>
        </SectionShell>
      </MotionReveal>

      {/* TS-019 D5, position 2: "this week nearby" is block 1's S3 module.
          Its shell renders here in the mocked state so the function is
          visible before M4, under its own radius label — never the place
          name (TS-008 D1). */}
      <MotionReveal>
        <SectionShell id="nearby" surface="surface-2">
          <LiveModuleFrame
            headingLevel="h2"
            state="mocked"
            title={fieldAt(nearby.blocks, 0) ?? ""}
          >
            <EventList
              items={demoNearbyEvents(locale)}
              locale={locale}
              rowCount={5}
              state="mocked"
            />
          </LiveModuleFrame>
        </SectionShell>
      </MotionReveal>
      {/* Block 2a — three scenes, one mechanism each (TS-006 D7), in the
          `direct`/stage-0 order of TS-019 D3a. The trait-dependent order is
          a runtime property of TS-010 and lands with the stages at M4. */}
      <MotionReveal>
        <SectionShell id="scene-1" surface="lime-500">
          <SceneBlock
            body={fieldAt(sceneWhatsapp.blocks, 1)}
            instance={
              <LiveModuleFrame state="mocked" title={demo.flyerExample}>
                <EventList
                  items={demoPlaceEvents(locale).slice(0, 1)}
                  locale={locale}
                  rowCount={1}
                  state="mocked"
                />
              </LiveModuleFrame>
            }
            locale={locale}
            mechanism="whatsapp"
            opener={fieldAt(sceneWhatsapp.blocks, 0) ?? ""}
          />
        </SectionShell>
      </MotionReveal>

      <MotionReveal>
        <SectionShell id="scene-2" surface="paper">
          <SceneBlock
            body={fieldAt(sceneEmbed.blocks, 1)}
            instance={
              <MediaFrame
                alt=""
                className={styles.sceneMedia}
                placeholderHeadline={demo.photoWanted}
                ratio="feature"
                state="empty"
              />
            }
            locale={locale}
            mechanism="embed"
            opener={fieldAt(sceneEmbed.blocks, 0) ?? ""}
          />
        </SectionShell>
      </MotionReveal>

      <MotionReveal>
        <SectionShell id="scene-3" surface="lime-100">
          <SceneBlock
            body={fieldAt(sceneProvenance.blocks, 1)}
            instance={
              <MediaFrame
                alt={fieldAt(sceneProvenance.blocks, 0) ?? ""}
                className={styles.sceneMedia}
                notDepicting
                placeholderId="ueber-uns/gruender"
                ratio="feature"
                src={portraitPlaceholder.src}
              />
            }
            locale={locale}
            mechanism="provenance"
            opener={fieldAt(sceneProvenance.blocks, 0) ?? ""}
          />
        </SectionShell>
      </MotionReveal>

      {/* Block 2b — the provenance stamps, with block 2d (the counters)
          standing inside them: "inline in 2b or 2c, no section of its own"
          (TS-019 D3). Only the dates figure exists (TS-008 D8, Q-037). */}
      <MotionReveal>
        <SectionShell id="provenance-stamps" surface="violet-500">
          <p>{fieldAt(stamps.blocks, 0)}</p>
          {/* The badge is a pill of fixed height, so the figure carries the
              unit and the artifact's full label stands beside it as text. */}
          <div className={styles.counters} id="live-counters">
            <p>{fieldAt(counters.blocks, 0)}</p>
            <LiveCounters
              datesLabel={demo.datesUnit}
              dates={DEMO_DATE_COUNT}
              state="mocked"
            />
          </div>
          <Button locale={locale} onward to="about" variant="secondary">
            {(fieldAt(stamps.blocks, 1) ?? "").split("→")[0]?.trim()}
          </Button>
        </SectionShell>
      </MotionReveal>

      {/* Block 2c — the proof stream. Exactly five elements (DEC-048); while
          no selection is cleared (Q-014/Q-045) the five demo cards the
          content artifact itself carries stand in, each badged. */}
      <MotionReveal>
        <SectionShell id="proof-stream" labelledBy="proof-stream-heading" surface="lime-100">
          <h2 id="proof-stream-heading">{proofKicker}</h2>
          <ProofStream label={proofKicker}>
            {demoProofCards(proof, locale).map((card) => (
              <ProofCard
                attribution={card.attribution}
                claim={card.claim}
                contextLine={card.contextLine}
                geo={{ level: "snapshot", label: demo.geo }}
                key={card.claim}
                locale={locale}
                state={slotState(proof)}
              />
            ))}
          </ProofStream>
        </SectionShell>
      </MotionReveal>

    </PageFrame>
  );
}
