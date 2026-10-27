import { Button } from "@/src/components/button/button";
import { CONTACT_SECTION_ID } from "@/src/components/contact-section/contact-section";
import { EmptyProofSlot } from "@/src/components/empty-proof-slot/empty-proof-slot";
import { Icon } from "@/src/components/icon/icon";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { NewsletterBlock } from "@/src/components/newsletter-block/newsletter-block";
import { newsletterOffered } from "@/src/components/newsletter-block/constant";
import { PersonProfile } from "@/src/components/person-profile/person-profile";
import { PhotoSurface } from "@/src/components/photo-surface/photo-surface";
import { QuoteCard } from "@/src/components/quote-card/quote-card";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { StoryDisclosure } from "@/src/components/story-disclosure/story-disclosure";
import { fieldAt } from "@/src/lib/content/blocks";
import { resolvePriceTokens } from "@/src/lib/pricing/price-token";
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
import type { DisclosureStory } from "@/src/components/story-disclosure/story-disclosure";
import type { ContentSlot } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * TS-WEB-0027 — `/ueber-uns` — the trust surface, rebuilt on the owner's design
 * of 2026-10-12 (issue #55, DEC-0162).
 *
 * Composition, D2 as amended — three chapters told top to bottom:
 *
 *  1. **Stage** — the photograph of the village the company is named after, a
 *     kicker and the page's one `h1`. No CTA (D1, A3).
 *  2. **Chapter 01** — how it started: the baker's van (`kapitel-1`).
 *  3. **Quote band** — the founder's cleared quote on his cleared portrait, a
 *     photo section of its own, with the article it was said in (`zitat`).
 *  4. **Chapter 02** — the name, and the honorary-mayor claim with its source:
 *     the page's one inline proof (`kapitel-2`, D3).
 *  5. **Chapter 03** — the proof stream as expandable stories: the cleared
 *     records the relevance engine selects, each a native `<details>`, and the
 *     one reserved, never backfilled place (`kapitel-3`, D5).
 *  6. **Who is behind it** — the person, with the cleared 4:5 portrait (D7).
 *  7. **Principles** — the village argument of DEC-0084 §2 as three numbered
 *     principles, carrying the one price token (`grundsaetze`, A4).
 *  8. **Award** — the NØRD award and the one link to the archive (D6).
 *  9. **Newsletter** — nothing renders while no sending system is named.
 * 10/11. **Context band and closing CTA**, from `PageFrame` — the closing
 *     block is the page's one `data-cta="primary"`, into `#kontakt`.
 *
 * No counter, no year figure, no "seit …" claim (D4).
 */

const ROUTE = "about" as const;

/**
 * The founder portrait's text alternative, per locale (F-3-5) — the fallback
 * for a portrait the image inventory does not describe.
 */
const FOUNDER_ALT: Record<Locale, string> = {
  de: "Jan-Henrik Hempel, Gründer",
  en: "Jan-Henrik Hempel, founder",
};

/** The photographer's credit line on the quote band, per locale. */
const PHOTO_CREDIT: Record<Locale, string> = { de: "Foto", en: "Photo" };

/** `ueber-uns-1-origin`'s fields, in the order both locales carry them. */
const ORIGIN = {
  headline: 0,
  /** The three steps of DEC-0084 §2: the need · what the market offers · what follows. */
  argument: [1, 2, 3],
  proofClaim: 4,
  proofSource: 5,
} as const;

/** `ueber-uns-1a-chapters`'s fields — the owner's design labels (DEC-0162 §3). */
const CHAPTERS = {
  stageKicker: 0,
  chapter1Place: 1,
  chapter2Heading: 2,
  chapter2Place: 3,
  chapter3Heading: 4,
  chapter3Place: 5,
  storyOpen: 6,
  storyClose: 7,
  principlesHeading: 8,
  principleTitles: [9, 10, 11],
} as const;

/** `ueber-uns-2-story`'s fields. */
const STORY = {
  heading: 0,
  start: 1,
  name: 2,
  quote: 3,
  quoteName: 4,
  quoteRole: 5,
  quoteOrganisation: 6,
  sourceLabel: 7,
  sourceUrl: 8,
} as const;

/** `ueber-uns-4-archive`'s fields — the award block and its one link. */
const AWARD = {
  heading: 0,
  claim: 1,
  source: 2,
  seal: 3,
  link: 4,
} as const;

interface Person {
  readonly name: string;
  readonly role: string;
  readonly bio?: string;
}

/**
 * A team member's portrait id in the page's image inventory, joined on the
 * person slug the hub package uses.
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

/** The candidate id of the `index`-th line of the stream slot. */
function candidateId(index: number): string {
  return `ueber-uns-3-proof-stream-${index + 1}`;
}

/**
 * The cleared proof elements `ueber-uns-3-proof-stream` names, as relevance
 * candidates (TS-WEB-0005). Read off the slot, never re-typed. Each authored
 * line is `claim — source, date`.
 */
function proofCandidates(proofStream: ContentSlot, fallbackContext: string): ProofCandidate[] {
  const list = proofStream.blocks.find((block) => block.kind === "list");
  const items = list?.kind === "list" ? list.items : [];
  const demo = isDemoSlot(proofStream);
  return items.map((item, index) => {
    const card = parseDemoProofElement(item, fallbackContext);
    return {
      id: candidateId(index),
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

/** One chapter's head: the mono ordinal and its place line (SRC-0014 §Typography, "Ordinal"). */
function ChapterHead({ ordinal, place }: { ordinal: string; place?: string }): ReactNode {
  return (
    <div className={styles.chapterHead}>
      <p aria-hidden="true" className={styles.ordinal}>
        {ordinal}
      </p>
      {place ? <p className={styles.place}>{place}</p> : null}
    </div>
  );
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
  const chapters = slot(page, "ueber-uns-1a-chapters");
  const story = slot(page, "ueber-uns-2-story");
  const proofStream = slot(page, "ueber-uns-3-proof-stream");
  const stories = slot(page, "ueber-uns-3b-stories");
  const reservedPlace = slot(page, "ueber-uns-3a-empty-slot-demo");
  const award = slot(page, "ueber-uns-4-archive");
  const team = slot(page, "ueber-uns-5-team");
  const newsletter = slot(page, "ueber-uns-6-newsletter");

  const chapter = (index: number) => fieldAt(chapters.blocks, index);

  /**
   * Chapter 03 is the stream, through TS-WEB-0005 rather than around it:
   * DEC-0048's `/ueber-uns` count is 7, the slot names four cleared records,
   * and the engine leaves the remaining positions empty. D5 caps what is
   * rendered at one empty place (`oneEmptySlot`).
   */
  const proofSelection = await selectProof({
    routeId: ROUTE,
    locale,
    focusJob: "understand-who-is-behind-it",
    surface: "stream",
    candidates: proofCandidates(proofStream, words.kickers.othersSay),
  });
  const streamEntries = oneEmptySlot(proofSelection.entries);
  const storyTexts = stories.blocks.filter((block) => block.kind === "field");
  const storyItems: DisclosureStory[] = streamEntries.flatMap((entry) => {
    if (entry.kind !== "item") return [];
    const index = Number(entry.candidate.id.slice(entry.candidate.id.lastIndexOf("-") + 1)) - 1;
    const text = storyTexts[index];
    return [
      {
        id: entry.candidate.id,
        kicker: [entry.candidate.contextLine, proofYear(entry.candidate.attribution)]
          .filter(Boolean)
          .join(" · "),
        title: entry.candidate.claim,
        story: text?.kind === "field" ? text.value : undefined,
      },
    ];
  });
  const hasEmptyPlace = streamEntries.some((entry) => entry.kind === "empty");

  const people = team.blocks
    .filter((block) => block.kind === "field")
    .map((block) => parsePerson(block.value));
  const founder = people[0];

  // The three principles are the village argument in DEC-0084 §2 order. The
  // third carries `{price:portalize-calendar}`, so the figure is formatted from
  // the offering package and never typed (A4, TS-WEB-0006 D10, DEC-0145).
  const argument = ORIGIN.argument
    .map((index) => fieldAt(origin.blocks, index))
    .filter((paragraph): paragraph is string => paragraph !== undefined)
    .map((paragraph) => resolvePriceTokens(paragraph, locale));

  const heroImage = pageImage(page, HERO_IMAGE_ID.about);
  const founderImage = pageImage(page, "ueber-uns-founder-portrait");

  const headline = fieldAt(origin.blocks, ORIGIN.headline) ?? words.pages.about;
  const quote = fieldAt(story.blocks, STORY.quote);
  const sourceUrl = fieldAt(story.blocks, STORY.sourceUrl);
  const archiveLabel = ctaLabelOnly(fieldAt(award.blocks, AWARD.link)) ?? words.pages.archive;
  const reservedLabel = fieldAt(reservedPlace.blocks, 0);
  const reservedSentence = fieldAt(reservedPlace.blocks, 1);

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
      <PageFrame
        closing={{
          // D1/A10: the page's one `data-cta="primary"`, in the closing block
          // only, resolving to this page's own contact section.
          hash: CONTACT_SECTION_ID,
          label: words.contactSection.rows.appointment,
          marker: "primary",
          to: ROUTE,
        }}
        locale={locale}
        meta={pageMeta}
      >
        {/* 1 — the stage: the photograph of the village behind the name, the
            kicker and the one `h1`. Nothing here is a CTA (A3). */}
        <PhotoSurface
          focal={heroImage?.focal}
          hero
          id="herkunft"
          locale={locale}
          aiEdited={heroImage?.aiEdited} notDepicting={heroImage?.notDepicting}
          placeholderId={heroImage?.placeholderId}
          priority
          ratio="hero"
          src={heroImage?.src}
          wideSrc={heroImage?.wideSrc}
        >
          <MotionReveal>
            <div className={styles.heroStack}>
              {chapter(CHAPTERS.stageKicker) ? (
                <p className={styles.heroKicker}>{chapter(CHAPTERS.stageKicker)}</p>
              ) : null}
              <h1 className={styles.heroHeadline}>{headline}</h1>
            </div>
          </MotionReveal>
        </PhotoSurface>

        {/* 2 — chapter 01: how it started. */}
        <SectionShell dataBlock="kapitel-1" labelledBy="kapitel-1-h2" surface="paper">
          <MotionReveal>
            <div className={styles.chapter}>
              <ChapterHead ordinal="01" place={chapter(CHAPTERS.chapter1Place)} />
              <div className={styles.chapterBody}>
                <h2 id="kapitel-1-h2">{fieldAt(story.blocks, STORY.heading)}</h2>
                <p>{fieldAt(story.blocks, STORY.start)}</p>
              </div>
            </div>
          </MotionReveal>
        </SectionShell>

        {/* 3 — the quote band: the founder's cleared words on his cleared
            portrait, with the article they were said in (CG-028). A photo
            section of its own; the photograph is a background, so the
            surface reserves its upper part for the face and the quote sits
            on the reading band below it (DEC-0162 §1). */}
        {quote && sourceUrl ? (
          <PhotoSurface
            className={styles.quoteBand}
            // The photographer's credit (`credit: openTransfer.de`) — the ©
            // control in the picture's corner, not text on it (issue 101).
            credit={founderImage?.credit ? `${PHOTO_CREDIT[locale]}: ${founderImage.credit}` : undefined}
            dataBlock="zitat"
            focal={founderImage?.focal}
            id="zitat"
            label={fieldAt(story.blocks, STORY.quoteName) ?? FOUNDER_ALT[locale]}
            locale={locale}
            aiEdited={founderImage?.aiEdited} notDepicting={founderImage?.notDepicting}
            ratio="feature"
            src={founderImage?.src}
          >
            <QuoteCard
              locale={locale}
              name={fieldAt(story.blocks, STORY.quoteName) ?? ""}
              organisation={fieldAt(story.blocks, STORY.quoteOrganisation) ?? ""}
              quote={quote}
              role={fieldAt(story.blocks, STORY.quoteRole) ?? ""}
              sourceLabel={fieldAt(story.blocks, STORY.sourceLabel) ?? sourceUrl}
              sourceUrl={sourceUrl}
              tone="photo"
            />
          </PhotoSurface>
        ) : null}

        {/* 4 — chapter 02: the name, and the honorary-mayor claim with its
            source — the page's one inline proof outside the stream (D3). */}
        <SectionShell dataBlock="kapitel-2" labelledBy="kapitel-2-h2" surface="lime-100">
          <MotionReveal>
            <div className={styles.chapter}>
              <ChapterHead ordinal="02" place={chapter(CHAPTERS.chapter2Place)} />
              <div className={styles.chapterBody}>
                <h2 id="kapitel-2-h2">{chapter(CHAPTERS.chapter2Heading)}</h2>
                <p>{fieldAt(story.blocks, STORY.name)}</p>
                <article className={styles.inlineProof} data-inline-proof>
                  <p className={styles.inlineClaim}>{fieldAt(origin.blocks, ORIGIN.proofClaim)}</p>
                  <p className={styles.inlineSource}>{fieldAt(origin.blocks, ORIGIN.proofSource)}</p>
                </article>
              </div>
            </div>
          </MotionReveal>
        </SectionShell>

        {/* 5 — chapter 03: the stream as stories (D5, DEC-0162 §2). The
            relevance engine picks and orders them; each opens in place. */}
        <SectionShell dataBlock="kapitel-3" labelledBy="kapitel-3-h2" surface="paper">
          <MotionReveal>
            <div className={styles.chapter}>
              <ChapterHead ordinal="03" place={chapter(CHAPTERS.chapter3Place)} />
              <div className={styles.chapterBody}>
                <h2 id="kapitel-3-h2">{chapter(CHAPTERS.chapter3Heading)}</h2>
              </div>
            </div>
            {/* The space above the stories is the reveal's stack gap
                (DEC-0171). A `className` margin used to ask for it and lost
                the cascade to the list's own `margin: 0` (issue 108). */}
            <StoryDisclosure
              closeLabel={chapter(CHAPTERS.storyClose) ?? ""}
              group="kapitel-3"
              openLabel={chapter(CHAPTERS.storyOpen) ?? ""}
              stories={storyItems}
              trailing={
                hasEmptyPlace ? (
                  // D5: the reserved place, with its label and sentence, in
                  // the accessibility tree, never backfilled.
                  <EmptyProofSlot
                    demo={isDemoSlot(reservedPlace)}
                    label={reservedLabel}
                    sentence={reservedSentence}
                  />
                ) : undefined
              }
            />
          </MotionReveal>
        </SectionShell>

        {/* 6 — who is behind it (D7): the person the artifact names, with the
            cleared 4:5 portrait. The portrait runs to the viewport edge. */}
        {founder ? (
          <SectionShell
            className={styles.personSection}
            contained={false}
            dataBlock="team"
            labelledBy="team-h2"
            surface="lime-100"
          >
            <MotionReveal>
              <div className={styles.person}>
                {(() => {
                  const portrait = pageImage(page, portraitId(founder.name));
                  return (
                    <PersonProfile
                      bio={founder.bio}
                      className={styles.profile}
                      headingId="team-h2"
                      kicker={words.kickers.team}
                      locale={locale}
                      name={founder.name}
                      portraitAlt={portrait?.alt ?? founder.name}
                      portraitCredit={portrait?.credit}
                      portraitNotDepicting={portrait?.notDepicting}
                      portraitSrc={portrait?.src}
                      role={founder.role}
                    />
                  );
                })()}
              </div>
            </MotionReveal>
          </SectionShell>
        ) : null}

        {/* 7 — the principles: the village argument in DEC-0084 §2 order,
            numbered, with the owner's titles. The third carries the one price
            token (A4). */}
        <SectionShell dataBlock="grundsaetze" labelledBy="grundsaetze-h2" surface="paper">
          <MotionReveal>
            <h2 id="grundsaetze-h2">{chapter(CHAPTERS.principlesHeading)}</h2>
            <ol className={styles.principles}>
              {argument.map((paragraph, index) => (
                <li className={styles.principle} key={paragraph}>
                  <p aria-hidden="true" className={styles.principleNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className={styles.principleTitle}>
                    {chapter(CHAPTERS.principleTitles[index])}
                  </h3>
                  <p className={styles.principleText}>{paragraph}</p>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </SectionShell>

        {/* 8 — the award, and exactly one link to the archive (D6): no
            teaser, no count, no thumbnail. */}
        <SectionShell dataBlock="auszeichnung" labelledBy="auszeichnung-h2" surface="violet-500">
          <MotionReveal>
            <div className={styles.award}>
              {fieldAt(award.blocks, AWARD.seal) ? (
                <p className={styles.seal}>
                  <Icon name="trophy" size={18} />
                  <span>{fieldAt(award.blocks, AWARD.seal)}</span>
                </p>
              ) : null}
              <h2 id="auszeichnung-h2">{fieldAt(award.blocks, AWARD.heading)}</h2>
              <p>{fieldAt(award.blocks, AWARD.claim)}</p>
              <p className={styles.awardSource}>{fieldAt(award.blocks, AWARD.source)}</p>
              <Button locale={locale} onward to="archive" variant="secondary">
                {archiveLabel}
              </Button>
            </div>
          </MotionReveal>
        </SectionShell>

        {/* 9 — the newsletter renders nowhere while no sending system is
            named (TS-WEB-0016-A21, A16). */}
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
