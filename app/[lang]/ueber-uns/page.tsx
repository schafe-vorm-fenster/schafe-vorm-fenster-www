import dorf from "@/src/generated/placeholders/ueber-uns/dorf.svg";
import gruender from "@/src/generated/placeholders/ueber-uns/gruender.svg";

import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { NewsletterBlock } from "@/src/components/newsletter-block/newsletter-block";
import { OriginStory } from "@/src/components/origin-story/origin-story";
import { PersonProfile } from "@/src/components/person-profile/person-profile";
import { PhotoSurface } from "@/src/components/photo-surface/photo-surface";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { RouteLink } from "@/src/components/route-link/route-link";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { ctaLabelOnly } from "@/src/lib/content/text";
import { assetSrc } from "@/src/lib/content/asset-src";

import { CountersIsland } from "../_islands";
import { selectProof } from "../_proof";
import { PageJsonLd } from "../_structured-data";
import { pageContent } from "../_content";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";

import { pageMeta } from "./page.meta";

import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-027 — `/ueber-uns` — the trust surface.
 *
 * Composition (TS-027 D2, a scanning order, not a narrative one): origin
 * (photo, ratio-hero, ink gradient) → operating counters → proof stream (7)
 * → archive link → team → newsletter → band + closing, merged into the
 * three-job offer (`primaryConversion: null`, TS-006 D6). Zero
 * `data-cta="primary"` elements on this page (TS-027-A10).
 *
 * [ASSUMPTION, per plan/guardrails.md] The proof stream's six filled cards
 * have no authored source: `content/pages/ueber-uns/de.md` names the pool
 * ("the full proof stock plus media-echo, 32 entries") but not an actual
 * cleared selection — that selection is TS-005's relevance engine, which is
 * not built. Per the dummy-content rule, six generated, clearly exemplary
 * cards stand in (`state="mocked"`, `Demo-Daten`), never a real name, place
 * or number presented as real. Recorded in `state/open.md`.
 *
 * [ASSUMPTION] The content file additionally authors a demo testimonial for
 * the reserved 7th slot ("Demo-Testimonial für den reservierten Platz").
 * TS-027 D5 and its acceptance criteria (A6/A7) are [FIXED] and explicit —
 * "Backfill: never", "exactly one empty slot is visible" — precisely
 * because the empty slot *is* the honest, designed state the dummy-content
 * rule's "never a hole" already covers (`empty-proof-slot` is a fully
 * designed, labelled state, not a blank box). The reserved slot renders as
 * `empty-proof-slot`, not the content file's optional demo alternative, so
 * A6/A7 stay satisfiable. Recorded in `state/open.md`.
 */

const ROUTE = "about" as const;

/**
 * The founder portrait's text alternative, per locale (F-3-5).
 *
 * It was a German literal, so `/en/about` and `/en/about/archive` rendered
 * `alt="Jan-Henrik Hempel, Gründer"` — the one German job noun left on two
 * otherwise fully English pages, and the residue F-2-33 did not reach because
 * an `alt` is not visible text and no sweep reads it.
 *
 * A name is a name in both languages; only the role is translated.
 */
const FOUNDER_ALT: Record<Locale, string> = {
  de: "Jan-Henrik Hempel, Gründer",
  en: "Jan-Henrik Hempel, founder",
};

interface Person {
  readonly name: string;
  readonly role: string;
  readonly bio?: string;
}

/** Splits the content artifact's "Name — role sentence. Bio." paragraph. */
function parsePerson(paragraph: string): Person {
  const [namePart, ...rest] = paragraph.split(" — ");
  const remainder = rest.join(" — ").trim();
  const sentenceEnd = remainder.indexOf(". ");
  if (sentenceEnd === -1) return { name: namePart.trim(), role: remainder };
  return {
    name: namePart.trim(),
    role: remainder.slice(0, sentenceEnd + 1).trim(),
    bio: remainder.slice(sentenceEnd + 2).trim() || undefined,
  };
}

interface DemoProof {
  readonly contextLine: string;
  readonly claim: string;
  readonly attribution: string;
}

/** Six generated, clearly exemplary proof cards (Q-014: no cleared selection today). */
const DEMO_PROOF: readonly DemoProof[] = [
  {
    contextLine: "Beispielhafte Rückmeldung",
    claim: "„Der Dorfkalender läuft bei uns seit Jahren einfach mit — ohne dass wir ihn pflegen müssten.“",
    attribution: "Bürgermeisterin, Beispielgemeinde Musterdorf",
  },
  {
    contextLine: "Beispielhafte Presseerwähnung",
    claim: "„Ein kleines Projekt aus einem Dorf, das zeigt, wie digitale Teilhabe auf dem Land aussehen kann.“",
    attribution: "Beispielzeitung, Regionalressort",
  },
  {
    contextLine: "Beispielhafte Rückmeldung",
    claim: "„Wir haben nie einen Vertrieb gesehen — nur den Kalender, der einfach funktioniert.“",
    attribution: "Vereinsvorsitzender, Beispielort Musterhagen",
  },
  {
    contextLine: "Beispielhafte Auszeichnung",
    claim: "„Ausgezeichnet für digitale Teilhabe im ländlichen Raum.“",
    attribution: "Beispiel-Fachpreis Ländliche Digitalisierung",
  },
  {
    contextLine: "Beispielhafte Rückmeldung",
    claim: "„Als Netzwerk aus mehreren Gemeinden war die gemeinsame Übersicht das, was uns gefehlt hat.“",
    attribution: "Netzwerkpartner, Beispielregion Musterland",
  },
  {
    contextLine: "Beispielhafte Rückmeldung",
    claim: "„Kostenlos und trotzdem verlässlich — das war für unseren Kirchenkreis der Unterschied.“",
    attribution: "Ehrenamtliche Koordinatorin, Beispielgemeinde Musterkirchen",
  },
];

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
  /**
   * TS-005 through, not around: DEC-048's `/ueber-uns` **stream** count is 7,
   * and the page has six generated elements — so the engine itself leaves the
   * seventh position empty rather than the page hard-coding the gap (D5,
   * A6/A7).
   */
  const proofSelection = await selectProof({
    routeId: ROUTE,
    locale,
    focusJob: "understand-who-is-behind-it",
    surface: "stream",
    candidates: DEMO_PROOF.map((proof, index) => ({
      id: `ueber-uns-3-proof-stream-${index + 1}`,
      contextLine: proof.contextLine,
      claim: proof.claim,
      attribution: proof.attribution,
      geo: { level: "snapshot" as const, label: "Beispiel" },
      geoCommunity: proof.attribution.split(", ").slice(1).join(", ").trim() || null,
      type: proof.contextLine.includes("Presse")
        ? ("press" as const)
        : proof.contextLine.includes("Auszeichnung")
          ? ("award" as const)
          : ("testimonial" as const),
      demo: true,
    })),
  });
  const page = await pageContent(ROUTE, locale);

  const origin = slot(page, "ueber-uns-1-origin");
  const archiveLink = slot(page, "ueber-uns-4-archive");
  const team = slot(page, "ueber-uns-5-team");

  const people = team.blocks
    .filter((block) => block.kind === "paragraph")
    .map((block) => parsePerson(block.text));

  // The causal-chain prose (`origin.blocks[1]`) already states "480 € im
  // Jahr" verbatim, matching `@schafe-vorm-fenster/offerings` (TS-027-A4).
  // `origin-story`'s own `price-tag` is suppressed (`display: "withheld"`,
  // which renders nothing) rather than repeating the identical figure a
  // second time in the same block — content is never reworded to remove
  // the number, so this is the one place left to avoid the duplicate.
  const originPrice = { display: "withheld" as const, figure: undefined };
  const archiveLabel = ctaLabelOnly(fieldAt(archiveLink.blocks, 0)) ?? "Zum Archiv";

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame closing={{ variant: "merged" }} locale={locale} meta={pageMeta}>
      {/* Block 1 — origin (photo, ratio-hero, ink gradient): h1, the causal
          chain, the honorary-mayor proof (D3). Both images are DEC-068
          generated placeholders (`placeholders.manifest.json`), already
          minted for this exact page by the component work package —
          `notDepicting` on both, since neither is the real village or the
          real founder. */}
      <PhotoSurface
        gradient="ink"
        id="herkunft"
        // F-2-33: the surface badges itself out of the dictionary — without
        // the page's language `/en/about` read "Nicht motivgenau ·
        // Platzhalter".
        locale={locale}
        notDepicting
        placeholderId="ueber-uns/dorf"
        ratio="hero"
        src={assetSrc(dorf)}
      >
        <MotionReveal>
          <OriginStory
            body={fieldAt(origin.blocks, 1) ?? ""}
            locale={locale}
            portraitAlt={FOUNDER_ALT[locale]}
            portraitNotDepicting
            portraitSrc={assetSrc(gruender)}
            priceDisplay={originPrice.display}
            priceFigure={originPrice.figure}
            proof={
              <ProofCard
                attribution="Jan-Henrik Hempel, Gründer"
                claim={fieldAt(origin.blocks, 2) ?? ""}
                contextLine="Beleg: founder-former-volunteer-mayor (cleared)"
                geo={{ level: "place", label: "Schlatkow" }}
                locale={locale}
              />
            }
          />
        </MotionReveal>
      </PhotoSurface>

      {/* Block 2 — operating counters (D4). The cleared "since 2018" fact
          always renders; the figures come off `/api/stats` through
          `liveCounters()`, and a field the upstream does not count is simply
          absent from the band — never a zero, never a substitute
          (WEB-F-041). Both fallback tiers exhausted removes the band
          entirely (TS-009 D6), which is why it sits under its own
          `<Suspense>` with a `null` fallback rather than a skeleton. */}
      <SectionShell labelledBy="betrieb" surface="paper">
        <MotionReveal>
          <h2 id="betrieb">Seit 2018 in Betrieb</h2>
          <CountersIsland locale={locale} show={["places", "dates"]} />
        </MotionReveal>
      </SectionShell>

      {/* Block 3 — proof stream (7): 6 demo cards + the reserved,
          never-backfilled empty slot (D5, A6/A7). `lime-100`, not a neutral
          surface: blocks 2/4/6 are already `paper` and the page-rhythm rule
          (`src/components/section-shell/rhythm.ts`) forbids more than two
          consecutive sections of one colour family. */}
      <SectionShell labelledBy="belegstrom" surface="lime-100">
        <MotionReveal>
          <h2 id="belegstrom">Was andere sagen</h2>
          <ProofStream label="Belege">
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
                // D5/A6/A7: the seventh position is reserved and never
                // backfilled — the engine leaves it empty because there is no
                // seventh cleared element, not because the page hard-codes it.
                <EmptyProofSlot
                  key={`empty-${position}`}
                  locale={locale}
                  sentence={dictionary(locale).proof.noneForTestimonial}
                />
              ),
            )}
          </ProofStream>
        </MotionReveal>
      </SectionShell>

      {/* Block 4 — archive: exactly one link, zero teasers/counts (D6). */}
      {/* `label`, not `labelledBy`: this block carries a link, not a heading. */}
      <SectionShell label="Archiv" surface="paper">
        <MotionReveal>
          <RouteLink locale={locale} to="archive">
            {archiveLabel}
          </RouteLink>
        </MotionReveal>
      </SectionShell>

      {/* Block 5 — team (D7). `lime-100`, same rhythm reason as block 3. */}
      <SectionShell labelledBy="team" surface="lime-100">
        <MotionReveal>
          <h2 id="team">Team</h2>
          {people.map((person) => (
            <PersonProfile
              bio={person.bio}
              key={person.name}
              // F-2-33: a person with no portrait gets the hatch, and the
              // hatch badges itself out of the dictionary.
              locale={locale}
              name={person.name}
              portraitAlt={person.name}
              role={person.role}
            />
          ))}
        </MotionReveal>
      </SectionShell>

      {/* Block 6 — newsletter (inline, permitted only here, D8) — a labelled
          mock (Q-020, `state/open.md`); still zero `data-cta="primary"`. */}
      {/* `label`, not `labelledBy`: `newsletter-block` renders its own
          heading with no id to point to. */}
      <SectionShell label="Newsletter" surface="paper">
        <MotionReveal>
          <NewsletterBlock locale={locale} />
        </MotionReveal>
      </SectionShell>

    </PageFrame>
    </>
  );
}
