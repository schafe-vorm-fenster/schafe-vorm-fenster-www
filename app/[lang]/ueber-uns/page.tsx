import dorf from "@/src/generated/placeholders/ueber-uns/dorf.svg";
import gruender from "@/src/generated/placeholders/ueber-uns/gruender.svg";

import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { LiveCounters } from "@/src/components/live-counters/live-counters";
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
import { loadPage, slot } from "@/src/lib/content/loader";
import { ctaLabelOnly } from "@/src/lib/content/text";
import { resolveLocale } from "@/src/lib/i18n/locales";
import { pageMetadata } from "@/src/lib/routes/metadata";
import { assetSrc } from "@/src/lib/content/asset-src";
import { SITE_ORIGIN } from "@/src/lib/routes/routes";

import { PageFrame } from "../_page-frame";

import { pageMeta } from "./page.meta";

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
  return pageMetadata(ROUTE, resolveLocale((await params).lang));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = resolveLocale((await params).lang);
  const page = await loadPage(ROUTE, locale);

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
        notDepicting
        placeholderId="ueber-uns/dorf"
        ratio="hero"
        src={assetSrc(dorf)}
      >
        <MotionReveal>
          <OriginStory
            body={fieldAt(origin.blocks, 1) ?? ""}
            portraitAlt="Jan-Henrik Hempel, Gründer"
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

      {/* Block 2 — operating counters: the cleared "since 2018" fact always
          renders; the live active-places count is absent today (no `/api/
          stats` integration in this work package) — `live-counters` then
          renders nothing rather than a substitute (D4). */}
      <SectionShell labelledBy="betrieb" surface="paper">
        <MotionReveal>
          <h2 id="betrieb">Seit 2018 in Betrieb</h2>
          <LiveCounters placesLabel="aktive Orte" />
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
            {DEMO_PROOF.map((proof, index) => (
              <ProofCard
                attribution={proof.attribution}
                claim={proof.claim}
                contextLine={proof.contextLine}
                geo={{ level: "snapshot", label: "Beispiel" }}
                key={`ueber-uns-proof-${index}`}
                locale={locale}
                state="mocked"
              />
            ))}
            <EmptyProofSlot
              badgeLabel="Kein Nachweis"
              sentence="Für Erfahrungsberichte von Veranstalter:innen liegt noch kein freigegebenes Zitat vor."
            />
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

      {/* JSON-LD: one `Organization` reference, zero `Person` nodes, zero
          `ItemList` (TS-011 D4, TS-027-A12). */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${SITE_ORIGIN}/#organization`,
            name: "Schafe vorm Fenster",
            url: SITE_ORIGIN,
          }),
        }}
        type="application/ld+json"
      />
    </PageFrame>
  );
}
