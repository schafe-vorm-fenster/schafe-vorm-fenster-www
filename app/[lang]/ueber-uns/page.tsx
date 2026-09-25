
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
import { dictionary } from "@/src/lib/i18n/dictionary";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot } from "@/src/lib/content/provenance";
import { ctaLabelOnly } from "@/src/lib/content/text";
import { pageImage } from "@/src/lib/content/images";
import { HERO_IMAGE_ID } from "@/src/lib/pages/hero-images";
import { parseDemoProofElement } from "@/src/lib/pages/demo-content";

import { CountersIsland } from "../_islands";
import { selectProof } from "../_proof";
import { PageJsonLd } from "../_structured-data";
import { pageContent } from "../_content";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";

import styles from "./page.module.css";
import { pageMeta } from "./page.meta";

import type { ProofCandidate } from "../_proof";
import type { ContentSlot } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0027 — `/ueber-uns` — the trust surface.
 *
 * Composition (TS-WEB-0027 D2 plus polish brief page 10, which turns the scanning
 * order into a story): hero — the `h1` on the photograph, nothing else →
 * the causal chain with the founder portrait and the honorary-mayor proof →
 * **the origin story** (the baker's van, the sheep pasture behind the name,
 * the founder quote) → the operating counters → the proof stream, one
 * feature card and five compact rows, with the archive link under it → team
 * → newsletter → band + closing, merged into the three-job offer
 * (`primaryConversion: null`, TS-WEB-0006 D6). Zero `data-cta="primary"` elements
 * on this page (TS-WEB-0027-A10).
 *
 * Three things the brief changed here, each of which was a visible defect:
 *
 *  - **beat 2 was missing.** The artifact has carried the origin paragraph
 *    and the cleared founder quote since the content follow-up; the page
 *    rendered neither, so the one beat that makes a reader trust this was
 *    absent. It is now its own `lime-100` section under the causal chain.
 *  - **a raw proof id rendered as visitor copy** — "Beleg:
 *    founder-former-volunteer-mayor (cleared)" stood on the public page as
 *    the honorary-mayor card's context line. The card names its human source
 *    instead, read off the artifact like every other string here.
 *  - **six identical grey cards, 1643 px.** G-7: one feature card carries
 *    the emphasis, the other five are hairline rows, and the archive link
 *    closes the same section rather than occupying one of its own.
 *
 * [ASSUMPTION] The reserved 7th slot still renders as `empty-proof-slot`,
 * not the content file's real, clearance-pending testimonial
 * (`ueber-uns-3-testimonial-slot-demo`, `kulturlandbuero-broellin`). TS-WEB-0027
 * D5 and its acceptance criteria (A6/A7) are [FIXED] and explicit —
 * "Backfill: never", "exactly one empty slot is visible" — and an
 * acceptance criterion is never reworded to fit new content
 * (plan/guardrails.md). Only six candidates reach `selectProof`, so the
 * engine leaves the seventh position empty exactly as before; whether that
 * position may show the clearance-pending testimonial in the protected
 * preview is the open question `state/open.md` row 109 files for jan-henrik,
 * not a call this page makes on its own. In the `rows` layout that position
 * is the stream's closing hairline rather than a grey rectangle — countable,
 * wordless, and no longer reading as an unfinished card.
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

/** The team block's own heading — the same word in both languages. */
const TEAM_HEADING = "Team";

interface Person {
  readonly name: string;
  readonly role: string;
  readonly bio?: string;
}

/**
 * A team member's portrait id in the page's image inventory. The people come
 * out of the artifact as prose (`parsePerson`), and the inventory keys its
 * portraits by the same person slug the hub package uses, so the name is the
 * join between the two.
 */
function portraitId(name: string): string {
  const slug = name
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `ueber-uns-team-${slug}`;
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

/**
 * The counters section's heading — the first sentence of the artifact's own
 * counter line ("Seit 2018 in Betrieb. Heute aktiv in {n} Orten."), so the
 * cleared year stands as the heading and the live figure stands in the band
 * below it. It used to be a German literal in this file, which is how
 * `/en/about` came to head an English section "Seit 2018 in Betrieb".
 */
function firstSentence(text: string | undefined, fallback: string): string {
  if (!text) return fallback;
  const end = text.indexOf(". ");
  return (end === -1 ? text : text.slice(0, end)).trim();
}

/**
 * The quote and its attribution, split on the artifact's own separator —
 * the same ` — ` convention `parseDemoProofElement` reads, and the same
 * reason: the page must not re-type an authored sentence to divide it.
 */
function splitQuote(line: string | undefined): { text: string; source?: string } | null {
  if (!line) return null;
  const separator = line.lastIndexOf(" — ");
  const text = (separator === -1 ? line : line.slice(0, separator))
    .trim()
    .replace(/^[„“"«»]+|[”“"«»]+$/g, "")
    .trim();
  if (text === "") return null;
  const source = separator === -1 ? undefined : line.slice(separator + 3).trim();
  return { text, source };
}

/**
 * The six cleared proof elements `ueber-uns-3-proof-stream` names, as
 * relevance candidates (TS-WEB-0005). Read off the slot, never re-typed: `demo`
 * is `isDemoSlot(proofStream)`, `false` today (state/open.md row 51, row 109).
 *
 * Each authored line is `claim — source, date`, so the source becomes the
 * card's context line and the date its attribution. No geo badge: G-7 drops
 * the badge where the card already names its source, which is what put
 * "Beleg  BELEG" on the page — a label and a badge saying the same word.
 * The date is also the engine's freshness facet, which is what makes the
 * stream read newest-first, like a track record.
 */
function proofCandidates(proofStream: ContentSlot, fallbackContext: string): ProofCandidate[] {
  const list = proofStream.blocks.find((block) => block.kind === "list");
  const items = list?.kind === "list" ? list.items : [];
  const demo = isDemoSlot(proofStream);
  return items.map((item, index) => {
    const card = parseDemoProofElement(item, fallbackContext);
    return {
      id: `ueber-uns-3-proof-stream-${index + 1}`,
      contextLine: card.contextLine,
      claim: card.claim,
      attribution: card.attribution,
      date: proofYear(card.attribution),
      demo,
    };
  });
}

/** The four-digit year an authored attribution ends on, for TS-WEB-0005 freshness. */
function proofYear(attribution: string): string | null {
  const match = /\b(19|20)\d{2}\b/.exec(attribution);
  return match === null ? null : match[0];
}

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
  const words = dictionary(locale);
  const page = await pageContent(ROUTE, locale);
  const proofStream = slot(page, "ueber-uns-3-proof-stream");

  /**
   * TS-WEB-0005 through, not around: DEC-0048's `/ueber-uns` **stream** count is 7,
   * and the slot names six cleared elements — so the engine itself leaves
   * the seventh position empty rather than the page hard-coding the gap
   * (D5, A6/A7).
   */
  const proofSelection = await selectProof({
    routeId: ROUTE,
    locale,
    focusJob: "understand-who-is-behind-it",
    surface: "stream",
    candidates: proofCandidates(proofStream, words.kickers.othersSay),
  });

  const origin = slot(page, "ueber-uns-1-origin");
  const counters = slot(page, "ueber-uns-2-counters");
  const archiveLink = slot(page, "ueber-uns-4-archive");
  const team = slot(page, "ueber-uns-5-team");
  const newsletter = slot(page, "ueber-uns-6-newsletter");

  const people = team.blocks
    .filter((block) => block.kind === "paragraph")
    .map((block) => parsePerson(block.text));

  // The causal-chain prose (`origin.blocks[1]`) already states "480 € im
  // Jahr" verbatim, matching `@schafe-vorm-fenster/offerings` (TS-WEB-0027-A4).
  // `origin-story`'s own `price-tag` is suppressed (`display: "withheld"`,
  // which renders nothing) rather than repeating the identical figure a
  // second time in the same block — content is never reworded to remove
  // the number, so this is the one place left to avoid the duplicate.
  const originPrice = { display: "withheld" as const, figure: undefined };

  // The page's images: the village behind the company name and the founder's
  // cleared portrait, which carries the rights holder's credit line verbatim.
  const heroImage = pageImage(page, HERO_IMAGE_ID.about);
  const founderImage = pageImage(page, "ueber-uns-founder-portrait");
  const archiveLabel = ctaLabelOnly(fieldAt(archiveLink.blocks, 0)) ?? words.pages.archive;

  const headline = fieldAt(origin.blocks, 0) ?? words.pages.about;
  const originHeading = fieldAt(origin.blocks, 4);
  const founderQuote = splitQuote(fieldAt(origin.blocks, 6));
  const counterHeading = firstSentence(fieldAt(counters.blocks, 0), words.pages.about);
  const proofHeading = fieldAt(proofStream.blocks, 0) ?? words.kickers.othersSay;

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={{ variant: "merged" }}
      locale={locale}
      meta={pageMeta}
    >
      {/* Block 1 — the hero: the photograph of the village the company is
          named after, and the one `h1`. The causal chain used to stand here
          too, which is what made this the worst instance of G-1 on the site:
          1256 px of box with 156 px of picture. */}
      <PhotoSurface
        gradient="ink"
        // The page's hero, composed out of a bare surface rather than
        // `hero-block` — the header lies on it (Jan's round-3 point 2).
        hero
        id="herkunft"
        // F-2-33: the surface badges itself out of the dictionary — without
        // the page's language `/en/about` read "Nicht motivgenau ·
        // Platzhalter".
        locale={locale}
        focal={heroImage?.focal}
        notDepicting={heroImage?.notDepicting}
        placeholderId={heroImage?.placeholderId}
        priority
        ratio="hero"
        src={heroImage?.src}
        wideSrc={heroImage?.wideSrc}
      >
        <MotionReveal>
          <h1 className={styles.heroHeadline}>{headline}</h1>
        </MotionReveal>
      </PhotoSurface>

      {/* Block 2 — the causal chain: a village of 400 → the free community
          calendar → the 480 € licence, with the founder's portrait and the
          honorary-mayor proof beside it (D3). The proof card names its human
          source; the internal id it used to print is in the artifact's own
          prose and in `state/open.md`, where an id belongs. */}
      <SectionShell
        dataBlock="kausalkette"
        kicker={words.kickers.whyItMatters}
        label={headline}
        surface="paper"
      >
        <MotionReveal>
          <OriginStory
            body={fieldAt(origin.blocks, 1) ?? ""}
            locale={locale}
            portraitAlt={founderImage?.alt ?? FOUNDER_ALT[locale]}
            portraitCredit={founderImage?.credit}
            portraitNotDepicting={founderImage?.notDepicting}
            portraitSrc={founderImage?.src}
            priceDisplay={originPrice.display}
            priceFigure={originPrice.figure}
            proof={
              <ProofCard
                attribution={FOUNDER_ALT[locale]}
                claim={fieldAt(origin.blocks, 2) ?? ""}
                contextLine={fieldAt(origin.blocks, 3) ?? words.pages.about}
                locale={locale}
              />
            }
            showHeadline={false}
          />
        </MotionReveal>
      </SectionShell>

      {/* Block 3 — beat 2, restored (brief page 10, item 2): where this
          comes from. The baker's van, the move from Berlin to Schlatkow, and
          the municipal sheep pasture the company is named after — the
          artifact's own paragraph, closed by the cleared founder quote as a
          pull quote. */}
      {originHeading ? (
        <SectionShell
          dataBlock="herkunftsgeschichte"
          kicker={words.kickers.origin}
          labelledBy="herkunftsgeschichte-h2"
          surface="lime-100"
        >
          <MotionReveal>
            <h2 id="herkunftsgeschichte-h2">{originHeading}</h2>
            <p>{fieldAt(origin.blocks, 5)}</p>
            {founderQuote ? (
              <blockquote className={styles.pullQuote}>
                <p className={styles.pullQuoteText}>
                  {`„${founderQuote.text}“`}
                  {founderQuote.source ? (
                    <cite className={styles.pullQuoteSource}>{founderQuote.source}</cite>
                  ) : null}
                </p>
              </blockquote>
            ) : null}
          </MotionReveal>
        </SectionShell>
      ) : null}

      {/* Block 4 — operating counters (D4). The cleared "since 2018" fact
          always renders; the figures come off `/api/stats` through
          `liveCounters()`, and a field the upstream does not count is simply
          absent from the band — never a zero, never a substitute
          (FUN-WEB-0041). Both fallback tiers exhausted removes the band
          entirely (TS-WEB-0009 D6), which is why it sits under its own
          `<Suspense>` with a `null` fallback rather than a skeleton. */}
      <SectionShell
        dataBlock="betrieb"
        density="tight"
        kicker={words.kickers.trust}
        labelledBy="betrieb-h2"
        surface="paper"
      >
        <MotionReveal>
          <h2 id="betrieb-h2">{counterHeading}</h2>
          <CountersIsland locale={locale} show={["places", "dates"]} />
        </MotionReveal>
      </SectionShell>

      {/* Block 5 — the proof stream (7 positions, DEC-0048): one feature card
          carrying the emphasis, five compact hairline rows, and the reserved,
          never-backfilled seventh position (D5, A6/A7). The archive link
          (D6 — exactly one link, no teasers, no count) closes this section
          rather than standing in a 114 px section of its own. */}
      <SectionShell
        dataBlock="belegstrom"
        density="tight"
        // No kicker: press proof would take `kickers.othersSay`, and the
        // content heading (`ueber-uns/de.md`, slot 3) already reads those
        // three words — a kicker here doubles the h2 (DEC-0120 §5).
        labelledBy="belegstrom-h2"
        surface="surface"
      >
        <MotionReveal>
          <h2 id="belegstrom-h2">{proofHeading}</h2>
          <ProofStream label={proofHeading} layout="rows">
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
                // D5/A6/A7: the seventh position is reserved and never
                // backfilled — the engine leaves it empty because there is no
                // seventh cleared element, not because the page hard-codes it.
                <EmptyProofSlot className={styles.reservedRow} key={`empty-${position}`} />
              ),
            )}
          </ProofStream>
          <RouteLink className={styles.archiveLink} locale={locale} to="archive">
            {archiveLabel}
          </RouteLink>
        </MotionReveal>
      </SectionShell>

      {/* Block 6 — team (D7). Two people, side by side from `lg`, so the
          block is one screen rather than 1380 px of stacked portraits. */}
      <SectionShell
        dataBlock="team"
        kicker={words.kickers.team}
        labelledBy="team-h2"
        surface="lime-100"
      >
        <MotionReveal>
          <h2 id="team-h2">{TEAM_HEADING}</h2>
          <div className={styles.team}>
            {people.map((person) => (
              <PersonProfile
                bio={person.bio}
                key={person.name}
                locale={locale}
                name={person.name}
                portraitAlt={pageImage(page, portraitId(person.name))?.alt ?? person.name}
                role={person.role}
                /* G-9: text rows until every person has a cleared, plain
                   portrait. One of the two photographs is a candid with a
                   hand in front of the face and the other carries
                   `license: unverified`, so the block would have been one
                   unusable crop beside one blank 4:5 box. The founder's
                   cleared portrait stands where it belongs, in the causal
                   chain above, and is not shown twice. */
                textOnly
              />
            ))}
          </div>
        </MotionReveal>
      </SectionShell>

      {/* Block 7 — newsletter (inline, permitted only here, D8) — a labelled
          mock (Q-0020, `state/open.md`); still zero `data-cta="primary"`.
          It carries the page's **own** heading and lead now
          (`ueber-uns-6-newsletter`): the footer renders the same widget on
          every route, and with the component's default heading this page
          showed the identical block twice in one scroll. */}
      <SectionShell
        dataBlock="newsletter"
        kicker={words.kickers.newsletter}
        label={fieldAt(newsletter.blocks, 0) ?? words.kickers.newsletter}
        surface="paper"
      >
        <MotionReveal>
          <NewsletterBlock
            heading={fieldAt(newsletter.blocks, 0)}
            lead={fieldAt(newsletter.blocks, 1)}
            locale={locale}
          />
        </MotionReveal>
      </SectionShell>

    </PageFrame>
    </>
  );
}
