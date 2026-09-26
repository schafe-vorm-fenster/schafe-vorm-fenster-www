
import { CONTACT_SECTION_ID } from "@/src/components/contact-section/contact-section";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { NewsletterBlock } from "@/src/components/newsletter-block/newsletter-block";
import { newsletterOffered } from "@/src/components/newsletter-block/constant";
import { OriginStory } from "@/src/components/origin-story/origin-story";
import { PersonProfile } from "@/src/components/person-profile/person-profile";
import { PhotoSurface } from "@/src/components/photo-surface/photo-surface";
import { ProofCard } from "@/src/components/proof-card/proof-card";
import { ProofStream } from "@/src/components/proof-stream/proof-stream";
import { QuoteCard } from "@/src/components/quote-card/quote-card";
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

import { selectProof } from "../_proof";
import { PageJsonLd } from "../_structured-data";
import { pageContent } from "../_content";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";
import { oneEmptySlot } from "./stream";

import styles from "./page.module.css";
import { pageMeta } from "./page.meta";

import type { ProofCandidate } from "../_proof";
import type { ContentSlot } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0027 — `/ueber-uns` — the trust surface.
 *
 * Composition, D2's scanning order:
 *
 *  1. **Origin** — the photo hero carrying the page's one `h1`, read from the
 *     content artifact (D3 releases the headline, DEC-0083 §5) · the village
 *     argument in DEC-0084 §2 order with the founder portrait full-bleed beside
 *     it and the honorary-mayor claim with its proof card · the origin story
 *     under the kicker "Die Geschichte", closed by the cleared founder quote as
 *     a `quote-card` pointing at the article it was said in. Three sections for
 *     one block: the argument and the story do not fit in a section a phone can
 *     read (`e2e/section-budget.spec.ts`, 1.5 screens), and D2's "block" is the
 *     beat, not the `<section>` (DEC-0132 §2). **No CTA anywhere in it** (D1,
 *     A3).
 *  2. **Proof stream** — five cleared elements and the one reserved, never
 *     backfilled place, which now carries its label and its sentence and stands
 *     in the accessibility tree (D5, A6; DEC-0132 §3).
 *  3. **Archive** — one link, its own tight block (D6).
 *  4. **Team** — Jan-Henrik Hempel, with the cleared 4:5 portrait and the
 *     owner's own bio (D7). Christian Sauer is off the block (review R-ueber-10).
 *  5. **Newsletter** — nothing renders while no sending system is named
 *     (`NEWSLETTER_SENDING_SYSTEM`, TS-WEB-0016-A21, DEC-0122 §3, A16).
 *  6/7. **Context band and closing CTA**, from `PageFrame`. The closing block is
 *     the page's one `data-cta="primary"` — `marker: "primary"`, resolving to
 *     this page's own contact section at `#kontakt`, with no repeat rung below
 *     it (DEC-0082 amendment C, A10).
 *
 * What is gone: the counter section and every "seit …" claim (D4, A2,
 * TS-WEB-0018-A12) — including the stream's sixth element, whose claim was
 * exactly that sentence.
 */

const ROUTE = "about" as const;

/**
 * The founder portrait's text alternative, per locale (F-3-5) — the fallback
 * for a portrait the image inventory does not describe. A name is a name in
 * both languages; only the role is translated.
 */
const FOUNDER_ALT: Record<Locale, string> = {
  de: "Jan-Henrik Hempel, Gründer",
  en: "Jan-Henrik Hempel, founder",
};

/** The team block's own heading — the same word in both languages. */
const TEAM_HEADING = "Team";

/** `ueber-uns-1-origin`'s fields, in the order both locales carry them. */
const ORIGIN = {
  headline: 0,
  /** The three steps of DEC-0084 §2: the need · what the market offers · what follows. */
  argument: [1, 2, 3],
  proofClaim: 4,
  proofSource: 5,
} as const;

/** `ueber-uns-2-story`'s fields. */
const STORY = {
  heading: 0,
  paragraph: 1,
  quote: 2,
  quoteName: 3,
  quoteRole: 4,
  quoteOrganisation: 5,
  sourceLabel: 6,
  sourceUrl: 7,
} as const;

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
 * The cleared proof elements `ueber-uns-3-proof-stream` names, as relevance
 * candidates (TS-WEB-0005). Read off the slot, never re-typed.
 *
 * Each authored line is `claim — source, date`, so the source becomes the
 * card's context line and the date its attribution. No geo badge: G-7 drops
 * the badge where the card already names its source. The date is also the
 * engine's freshness facet, which is what makes the stream read newest-first,
 * like a track record.
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

  const origin = slot(page, "ueber-uns-1-origin");
  const story = slot(page, "ueber-uns-2-story");
  const anecdotes = slot(page, "ueber-uns-2a-anecdotes-demo");
  const proofStream = slot(page, "ueber-uns-3-proof-stream");
  const reservedPlace = slot(page, "ueber-uns-3a-empty-slot-demo");
  const archiveLink = slot(page, "ueber-uns-4-archive");
  const team = slot(page, "ueber-uns-5-team");
  const newsletter = slot(page, "ueber-uns-6-newsletter");

  /**
   * TS-WEB-0005 through, not around: DEC-0048's `/ueber-uns` **stream** count is 7
   * and the slot names five cleared elements, so the engine itself leaves the
   * remaining positions empty rather than the page hard-coding the gap. D5
   * caps what is *rendered* at one empty slot (`oneEmptySlot`).
   */
  const proofSelection = await selectProof({
    routeId: ROUTE,
    locale,
    focusJob: "understand-who-is-behind-it",
    surface: "stream",
    candidates: proofCandidates(proofStream, words.kickers.othersSay),
  });
  const streamEntries = oneEmptySlot(proofSelection.entries);

  /**
   * The people the artifact names, one labelled field each (`**Person n:**
   * Name — role sentence. Bio.`). They used to be bare paragraphs, which read
   * the slot's own editorial note as a second person the moment the slot gained
   * one — a field cannot be mistaken for prose.
   */
  const people = team.blocks
    .filter((block) => block.kind === "field")
    .map((block) => parsePerson(block.value));

  // The argument's third step already states "480 € im Jahr" verbatim, the
  // figure `@schafe-vorm-fenster/offerings` carries (TS-WEB-0027-A4).
  // `origin-story`'s own `price-tag` is suppressed (`display: "withheld"`,
  // which renders nothing) rather than repeating the identical figure a second
  // time in the same block — content is never reworded to remove the number,
  // so this is the one place left to avoid the duplicate.
  const originPrice = { display: "withheld" as const, figure: undefined };

  // The page's images: the village behind the company name, the founder's
  // cleared portrait with the rights holder's credit line verbatim, and the
  // team portrait (own work, unrestricted).
  const heroImage = pageImage(page, HERO_IMAGE_ID.about);
  const founderImage = pageImage(page, "ueber-uns-founder-portrait");
  const archiveLabel = ctaLabelOnly(fieldAt(archiveLink.blocks, 0)) ?? words.pages.archive;

  const headline = fieldAt(origin.blocks, ORIGIN.headline) ?? words.pages.about;
  const argument = ORIGIN.argument
    .map((index) => fieldAt(origin.blocks, index))
    .filter((paragraph): paragraph is string => paragraph !== undefined);
  const storyHeading = fieldAt(story.blocks, STORY.heading);
  const quote = fieldAt(story.blocks, STORY.quote);
  const sourceUrl = fieldAt(story.blocks, STORY.sourceUrl);
  const anecdoteParagraphs = anecdotes.blocks.filter((block) => block.kind === "field");
  const proofHeading = fieldAt(proofStream.blocks, 0) ?? words.kickers.othersSay;
  const reservedLabel = fieldAt(reservedPlace.blocks, 0);
  const reservedSentence = fieldAt(reservedPlace.blocks, 1);

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={{
        // D1/A10: the page's one `data-cta="primary"`, in the closing block
        // only, resolving to this page's own contact section — same goal, same
        // target and the same label as the section's first action row
        // (TS-WEB-0006 D6). DEC-0082 amendment C empties the repeat rung here.
        hash: CONTACT_SECTION_ID,
        label: words.contactSection.rows.appointment,
        marker: "primary",
        to: ROUTE,
      }}
      locale={locale}
      meta={pageMeta}
    >
      {/* Block 1a — the hero: the photograph of the village the company is
          named after, and the one `h1`. The headline is the artifact's
          (DEC-0083 §5 released the fixed one); nothing here is a CTA (A3). */}
      <PhotoSurface
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

      {/* Block 1b — the village argument, in DEC-0084 §2 order: the need every
          volunteer has → what the market answers with → why the community
          calendar is free and the licence is a licence. The founder portrait
          runs full width beside it (R-ueber-8) and the honorary-mayor claim
          stands under it with its proof card — the one inline proof outside
          the stream (D3). No clause derives the price from what a village can
          afford, and none mentions a salesperson (A4). */}
      <SectionShell
        dataBlock="dorfargument"
        // Tight, measured: with the full-width portrait the section is 1278 px
        // at 390 px on the standard density and `e2e/section-budget.spec.ts`
        // caps a section at 1270 (polish brief G-4). One value per section.
        density="tight"
        kicker={words.kickers.whyItMatters}
        label={headline}
        surface="paper"
      >
        <MotionReveal>
          <OriginStory
            body={argument}
            locale={locale}
            portraitAlt={founderImage?.alt ?? FOUNDER_ALT[locale]}
            portraitBleed
            portraitCredit={founderImage?.credit}
            portraitNotDepicting={founderImage?.notDepicting}
            portraitSrc={founderImage?.src}
            priceDisplay={originPrice.display}
            priceFigure={originPrice.figure}
            proof={
              <ProofCard
                attribution={FOUNDER_ALT[locale]}
                claim={fieldAt(origin.blocks, ORIGIN.proofClaim) ?? ""}
                contextLine={fieldAt(origin.blocks, ORIGIN.proofSource) ?? words.pages.about}
                locale={locale}
              />
            }
            // A3 fixes the position: the claim and its proof element are in the
            // first viewport at 1280 × 800, which three paragraphs of argument
            // below a `ratio-hero` photograph cannot be (DEC-0132 §2).
            proofPosition="before"
            showHeadline={false}
          />
        </MotionReveal>
      </SectionShell>

      {/* Block 1c — the story (kicker "Die Geschichte", R-ueber-3): the baker's
          van, the move to Schlatkow and the municipal sheep pasture the company
          is named after, then the anecdotes the review asked for, then the
          cleared founder quote as a `quote-card` with the concrete article as
          its source (R-ueber-6, CG-028). The anecdote paragraphs are a
          `generated; demo: true` slot and mark themselves. */}
      {storyHeading ? (
        <SectionShell
          dataBlock="herkunftsgeschichte"
          kicker={words.kickers.origin}
          labelledBy="herkunftsgeschichte-h2"
          surface="lime-100"
        >
          <MotionReveal>
            <h2 id="herkunftsgeschichte-h2">{storyHeading}</h2>
            <p>{fieldAt(story.blocks, STORY.paragraph)}</p>
            {anecdoteParagraphs.map((block) => (
              <p
                data-demo={isDemoSlot(anecdotes) ? "true" : undefined}
                key={block.kind === "field" ? block.label : ""}
              >
                {block.kind === "field" ? block.value : null}
              </p>
            ))}
            {quote && sourceUrl ? (
              <QuoteCard
                className={styles.founderQuote}
                locale={locale}
                name={fieldAt(story.blocks, STORY.quoteName) ?? ""}
                newTab
                organisation={fieldAt(story.blocks, STORY.quoteOrganisation) ?? ""}
                quote={quote}
                role={fieldAt(story.blocks, STORY.quoteRole) ?? ""}
                sourceLabel={fieldAt(story.blocks, STORY.sourceLabel) ?? sourceUrl}
                sourceUrl={sourceUrl}
              />
            ) : null}
          </MotionReveal>
        </SectionShell>
      ) : null}

      {/* Block 2 — the proof stream (7 positions, DEC-0048): one feature card
          carrying the emphasis, the rest compact hairline rows, and the
          reserved, never-backfilled seventh position (D5, A6/A7). */}
      <SectionShell
        dataBlock="belegstrom"
        density="tight"
        // No kicker: press proof would take `kickers.othersSay`, and the
        // content heading (slot 3) already reads those three words — a kicker
        // here doubles the h2 (DEC-0120 §5).
        labelledBy="belegstrom-h2"
        surface="surface"
      >
        <MotionReveal>
          <h2 id="belegstrom-h2">{proofHeading}</h2>
          <ProofStream label={proofHeading} layout="rows">
            {streamEntries.map((entry, position) =>
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
                // D5: the reserved place, with the label and the sentence the
                // determination asks for, in the accessibility tree.
                <EmptyProofSlot
                  demo={isDemoSlot(reservedPlace)}
                  key={`empty-${position}`}
                  label={reservedLabel}
                  sentence={reservedSentence}
                />
              ),
            )}
          </ProofStream>
        </MotionReveal>
      </SectionShell>

      {/* Block 3 — the archive: exactly one link, no teasers, no count, no
          thumbnail, in a block of its own (D6, D2 block 3, A8). */}
      <SectionShell dataBlock="archiv-verweis" density="tight" label={archiveLabel} surface="paper">
        <MotionReveal>
          <RouteLink className={styles.archiveLink} locale={locale} to="archive">
            {archiveLabel}
          </RouteLink>
        </MotionReveal>
      </SectionShell>

      {/* Block 4 — team (D7): every person the artifact names, once, in a 4:5
          media box, from `@schafe-vorm-fenster/people` through the content
          pipeline (A9). */}
      <SectionShell
        dataBlock="team"
        kicker={words.kickers.team}
        labelledBy="team-h2"
        surface="lime-100"
      >
        <MotionReveal>
          <h2 id="team-h2">{TEAM_HEADING}</h2>
          <div className={styles.team}>
            {people.map((person) => {
              const portrait = pageImage(page, portraitId(person.name));
              return (
                <PersonProfile
                  bio={person.bio}
                  key={person.name}
                  locale={locale}
                  name={person.name}
                  portraitAlt={portrait?.alt ?? person.name}
                  portraitCredit={portrait?.credit}
                  portraitNotDepicting={portrait?.notDepicting}
                  portraitSrc={portrait?.src}
                  role={person.role}
                />
              );
            })}
          </div>
        </MotionReveal>
      </SectionShell>

      {/* Block 5 — the newsletter, inline, permitted only here (D8). It renders
          **nowhere** while no sending system is named: A21 forbids a form that
          posts nowhere, and A16 asks for exactly this — "where no sending
          system exists, the block does not render at all and emits nothing".
          The slot and the block keep their shape for the day it returns. */}
      {newsletterOffered() ? (
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
      ) : null}

    </PageFrame>
    </>
  );
}
