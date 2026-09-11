import { Suspense } from "react";

import { Button } from "@/src/components/button/button";
import { EmptyStateBlock } from "@/src/components/empty-state-block/empty-state-block";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { MediaFrame } from "@/src/components/media-frame/media-frame";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { SceneBlock } from "@/src/components/scene-block/scene-block";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot } from "@/src/lib/content/provenance";
import { ctaLabelOnly } from "@/src/lib/content/text";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { ConversionTracker } from "@/src/components/conversion-tracker/conversion-tracker";
import { fillTemplate, parseDemoProofElement } from "@/src/lib/pages/demo-content";
import { calendarUrl } from "@/src/lib/live/app-handover";
import { placeEvents } from "@/src/lib/live/places";
import { STAGE_ZERO_ANCHOR, resolvePlaceOutcome } from "@/src/lib/pages/live-anchor";

import heroPlaceholder from "@/src/generated/placeholders/home/hero.svg";
import portraitPlaceholder from "@/src/generated/placeholders/ueber-uns/gruender.svg";

import styles from "./_pages.module.css";

import { CountersIsland, NearbyIsland, PlaceDatesIsland } from "./_islands";
import { selectProof } from "./_proof";
import { PageJsonLd } from "./_structured-data";
import { pageContent } from "./_content";
import { localeFrom, pageMetadataFor } from "./_locale";
import { PageFrame } from "./_page-frame";
import { HOME_META } from "./page.meta";

import type { ProofCandidate } from "./_proof";
import type { Place } from "@/src/lib/live/types";
import type { ContentSlot } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";
import type { ReactNode } from "react";

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

/**
 * TS-012 D4 — `save-calendar-to-homescreen`, `stage: handover`: the click
 * that opens a place calendar on `app.*`. The page's own primary conversion
 * (`page.meta.ts`), and the only outbound handover this page has. The place
 * search submit is **not** a conversion (TS-019 D2: "a search is not a
 * conversion"), so it stays unarmed.
 */
const SAVE_CALENDAR = {
  goalId: "save-calendar-to-homescreen",
  stage: "handover",
} as const;

/** The attributes S2's own handover adds beside the resolved place slug. */
const SAVE_CALENDAR_ATTRIBUTES = { route: ROUTE } as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  // `generateMetadata` must not throw `notFound()`: the metadata boundary
  // sits above `[lang]`, so a throw here escapes the shell and Next.js falls
  // back to its built-in 404. The *page* answers 404; this resolves.
  return pageMetadataFor(ROUTE, params);
}

/** The generated labels this page needs and no artifact carries (Dummy-Content, state/open.md). */
const DEMO_LABELS: Record<
  Locale,
  {
    flyerExample: string;
    geo: string;
    photoWanted: string;
    datesUnit: string;
    missingProof: string;
  }
> = {
  de: {
    flyerExample: "Aus dem Flyer geworden — Beispieltermin",
    geo: "Beispiel",
    photoWanted: "Uns fehlt hier ein Bild aus deinem Ort.",
    datesUnit: "Termine",
    missingProof: "Für diese Aussage ist noch kein freigegebener Beleg hinterlegt.",
  },
  en: {
    flyerExample: "Made from the flyer — example date",
    geo: "Example",
    photoWanted: "We are missing a picture from your place here.",
    datesUnit: "dates",
    missingProof: "No cleared proof is on file for this claim yet.",
  },
};

/**
 * The artifact's demo proof lines as relevance candidates (TS-005).
 *
 * The attribution names the example place ("… — Ehrenamtliche
 * Bürgermeisterin, Beispielgemeinde Musterdorf"), and that name is what the
 * element *covers* — `geoCommunity`, the facet the engine scores. Without it
 * every candidate would tie at country level and the spread rule would have
 * nothing to spread.
 */
function proofCandidates(proof: ContentSlot, locale: Locale): ProofCandidate[] {
  const list = proof.blocks.find((block) => block.kind === "list");
  const items = list?.kind === "list" ? list.items : [];
  return items.map((item, index) => {
    const card = parseDemoProofElement(item, DEMO_LABELS[locale].geo);
    const place = card.attribution.split(", ").slice(1).join(", ").trim();
    return {
      id: `home-8-proof-stream-${index + 1}`,
      contextLine: card.contextLine,
      claim: card.claim,
      attribution: card.attribution,
      geo: { level: "snapshot" as const, label: DEMO_LABELS[locale].geo },
      geoCommunity: place === "" ? null : place,
      demo: isDemoSlot(proof),
    };
  });
}

/**
 * Block 1 in TS-019 D2's four states (F-2-30).
 *
 * D2 keys block 1 on **what is known about the place**, and until round 3 `/`
 * ignored `?ort=` altogether: `07743`, `38165` and `99999` all rendered the
 * same stage-0 anchor, so S2, S3 and S4 were written, specified and
 * unreachable. The three sections below are the same three in every state —
 * PHOTO hero, ink module slot, surface-2 nearby — so the page rhythm and the
 * DOM order of TS-019-A9 do not move when the state does.
 *
 * S1 stays the **prerendered shell** (D2, TS-010 D8): this component with
 * `place === undefined` is the `<Suspense>` fallback, and the stated states
 * stream over it. That is what keeps `/` a prerendered route while still
 * answering a stated place — `state/open.md` row 131 counts `/` among the
 * eight that prerender, and nothing here reads a request value outside the
 * boundary.
 */
interface FocusCopy {
  readonly locale: Locale;
  /** S1's hero headline and the search module in both treatments. */
  readonly s1Headline: string;
  readonly search: (primary: boolean) => ReactNode;
  /** S2 — `home-2-place-dates`: `{place}` headline and app-handover label. */
  readonly datesHeadline: string;
  readonly datesCta: string;
  /** S3 — `home-3-place-empty`: radius heading, invitation, publish label. */
  readonly nearbyHeading: string;
  readonly invitation: string;
  readonly publishCta: string;
}

/** The artifact writes the invitation as two sentences; the first is the headline. */
function splitInvitation(text: string): { headline: string; lead?: string } {
  const cut = text.indexOf(". ");
  if (cut === -1) return { headline: text };
  return { headline: text.slice(0, cut + 1).trim(), lead: text.slice(cut + 1).trim() };
}

function FocusBlocks({
  copy,
  place,
  hasDates,
}: {
  readonly copy: FocusCopy;
  /** The resolved community, or `undefined` for S1 — never the raw parameter. */
  readonly place?: Place;
  readonly hasDates?: boolean;
}) {
  const { locale } = copy;
  const stated = place !== undefined;
  const empty = stated && hasDates === false;
  const values = { place: place?.name ?? "" };

  return (
    <>
      {/* Block 1 — the focus block. `hero-block` brings its own
          `photo-surface` section at `ratio-hero`; the photograph is the
          generated placeholder of DEC-068 until a real one exists. */}
      <HeroBlock
        cta={
          !stated ? (
            copy.search(true)
          ) : empty ? (
            // S3: the primary conversion is publishing, and it is a link —
            // "on `/` the shift stays a link" (TS-019 D2, open point 2).
            <Button
              dataCta="primary"
              locale={locale}
              onward
              query={{ ort: place.slug }}
              to="register"
              variant="primary-light"
            >
              {copy.publishCta}
            </Button>
          ) : (
            // S2: the app handover, carrying the place slug as its one
            // attribute (TS-012 D4 rule 3).
            <ConversionTracker
              attributes={{ ...SAVE_CALENDAR_ATTRIBUTES, place: place.slug }}
              goalId={SAVE_CALENDAR.goalId}
              stage={SAVE_CALENDAR.stage}
            >
              <OutboundLink
                dataCta="primary"
                href={calendarUrl(place)}
                locale={locale}
                variant="secondary"
              >
                {fillTemplate(copy.datesCta, values)}
              </OutboundLink>
            </ConversionTracker>
          )
        }
        headline={
          !stated
            ? copy.s1Headline
            : empty
              ? splitInvitation(fillTemplate(copy.invitation, values)).headline
              : fillTemplate(copy.datesHeadline, values)
        }
        id="focus-block"
        lead={empty ? splitInvitation(fillTemplate(copy.invitation, values)).lead : undefined}
        notDepicting
        placeholderId="home/hero"
        src={heroPlaceholder.src}
      />

      {/* Block 1′ — the live dates of a known place. The one `ink` section of
          the page rhythm, and the anchor the live data sits on. In S3 the
          slot carries the publish invitation instead of an empty date box
          ("Position 1 is not left blank", TS-008 D4). */}
      <MotionReveal>
        <SectionShell id="place-dates" surface="ink">
          {empty ? (
            <EmptyStateBlock
              announced
              cta={copy.search(false)}
              headline={splitInvitation(fillTemplate(copy.invitation, values)).headline}
              lead={splitInvitation(fillTemplate(copy.invitation, values)).lead}
              pulse={false}
            />
          ) : (
            <PlaceDatesIsland
              conversion={SAVE_CALENDAR}
              ctaTemplate={stated ? undefined : copy.datesCta}
              locale={locale}
              rowCount={3}
              slug={place?.slug ?? STAGE_ZERO_ANCHOR.slug}
              titleTemplate={copy.datesHeadline}
              tone="dark"
            />
          )}
        </SectionShell>
      </MotionReveal>

      {/* TS-019 D5, position 2: "this week nearby" is block 1's S3 module.
          Its shell renders here under its own radius label — never the place
          name (TS-008 D1). */}
      <MotionReveal>
        <SectionShell id="nearby" surface="surface-2">
          <NearbyIsland
            lat={place?.lat ?? STAGE_ZERO_ANCHOR.lat}
            lng={place?.lng ?? STAGE_ZERO_ANCHOR.lng}
            locale={locale}
            rowCount={5}
            titleTemplate={copy.nearbyHeading}
          />
        </SectionShell>
      </MotionReveal>
    </>
  );
}

/**
 * The stated half of block 1 — the only place on `/` that reads `?ort=`, and
 * it reads it **inside** the `<Suspense>` boundary (Next.js "maximizing the
 * static shell"), so the shell above stays prerendered.
 *
 * S4 — "a search resolved to an uncovered place" — carries *nothing* on `/`
 * per D2: the search navigates away instead (`/dein-ort` classifies and
 * forwards, TS-008 D7). So an uncovered value renders S1 here, and TS-019-A5's
 * "`/` itself renders no uncovered place as data" holds by construction.
 */
async function StatedFocusBlocks({
  copy,
  searchParams,
}: {
  readonly copy: FocusCopy;
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const outcome = await resolvePlaceOutcome((await searchParams)["ort"]);
  if (outcome.kind !== "covered") return <FocusBlocks copy={copy} />;

  const envelope = await placeEvents({ slug: outcome.place.slug, rowCount: 3 });
  return (
    <FocusBlocks
      copy={copy}
      hasDates={(envelope?.data.events.length ?? 0) > 0}
      place={outcome.place}
    />
  );
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  /** Read only inside the `<Suspense>` boundary below — never awaited here. */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);
  const demo = DEMO_LABELS[locale];

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
   * TS-005 through, not around: gate · score · rotate · order · count, at
   * DEC-048's home count of **5**. Home is stage 0 — its search hands a place
   * to `/dein-ort`, it never takes one itself — so no `placeSlug` goes in and
   * the whole selection stays inside the prerendered shell.
   */
  const proofSelection = await selectProof({
    routeId: ROUTE,
    locale,
    focusJob: "know-what-is-on",
    surface: "home",
    candidates: proofCandidates(proof, locale),
  });

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

  const focusCopy: FocusCopy = {
    locale,
    s1Headline: hero.fields["Headline"] ?? "",
    search,
    datesHeadline: dates.fields["Headline"] ?? "",
    datesCta: dates.cta ?? "",
    nearbyHeading: fieldAt(nearby.blocks, 0) ?? "",
    invitation: fieldAt(nearby.blocks, 1) ?? "",
    publishCta: ctaLabelOnly(nearby.cta ?? fieldAt(nearby.blocks, 2) ?? "") ?? "",
  };

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={{ variant: "module", node: search(false) }}
      contextBandHeading={fieldAt(band.blocks, 0)}
      locale={locale}
      meta={HOME_META}
    >
      {/* Block 1 and its module slot, in whichever of TS-019 D2's states the
          place parameter resolves to. The fallback **is** S1 — the
          prerendered shell — and S2/S3 stream over it. */}
      <Suspense fallback={<FocusBlocks copy={focusCopy} />}>
        <StatedFocusBlocks copy={focusCopy} searchParams={searchParams} />
      </Suspense>
      {/* Block 2a — three scenes, one mechanism each (TS-006 D7), in the
          `direct`/stage-0 order of TS-019 D3a. The trait-dependent order is
          a runtime property of TS-010 and lands with the stages at M4. */}
      <MotionReveal>
        <SectionShell id="scene-1" surface="lime-500">
          <SceneBlock
            body={fieldAt(sceneWhatsapp.blocks, 1)}
            instance={
              <PlaceDatesIsland
                headingLevel="h3"
                locale={locale}
                rowCount={1}
                slug={STAGE_ZERO_ANCHOR.slug}
                titleTemplate={demo.flyerExample}
              />
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
            {/* TS-019-A14 / Q-037: only the counted figure. `places` and
                `updatesToday` have no `/api/stats` field, so the band shows
                one slot rather than an estimate. */}
            <CountersIsland locale={locale} show={["dates"]} />
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
                // An unfilled position weakens the claim; it never shortens
                // the stream (SRC-001 §4, DEC-048).
                <EmptyProofSlot key={`empty-${position}`} sentence={demo.missingProof} />
              ),
            )}
          </ProofStream>
        </SectionShell>
      </MotionReveal>

    </PageFrame>
    </>
  );
}
