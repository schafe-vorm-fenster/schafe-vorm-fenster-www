import { OutboundLink } from "../outbound-link/outbound-link";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./quote-card.module.css";

export interface QuoteCardProps {
  /** The quote, verbatim — never paraphrased, never shortened in a way that changes the sentence. */
  readonly quote: string;
  /** The author's name. */
  readonly name: string;
  /** The author's role — required: a name without a role and an organisation is not a proof. */
  readonly role: string;
  /** The author's organisation — required, see `role`. */
  readonly organisation: string;
  /** The concrete publication and article, as the link text. */
  readonly sourceLabel: string;
  /** The article itself. A quote without a working link does not ship. */
  readonly sourceUrl: string;
  readonly locale?: Locale;
  /**
   * `photo` sets the quote on a photo surface (DEC-0162 §1): the story stage's
   * quote treatment — a `lime-500` quotation mark, 22–34 px / 700 — no hairlines
   * (they do not read on a photograph), and the ground's own secondary text
   * colour for role and organisation. `ground` is the flat block on a section.
   */
  readonly tone?: "ground" | "photo";
  readonly className?: string;
}

/**
 * `quote-card` [PROPOSED] — SRC-0014 §Quote card, SRC-0017 CG-028,
 * design-system contract §1 (`quote-card`: quote · author with role and
 * organisation · sourced outbound link).
 *
 * Structure: somebody else's words plus the proof that they said them, as
 * one element — the quote verbatim, the author (name, then role and
 * organisation on the next line), the source last as an outbound link to the
 * concrete article with the 18 px `external-link` glyph.
 * States: none of its own. A quote whose clearance is not `cleared` is not
 * rendered at all — that is the caller's filter, not a state here.
 * Inherits: Lead 20/400 in the section's own text colour for the quote; mono
 * 15/700 for the name; 15/400 `muted` for role and organisation; the source in
 * mono 15 on the ground's link colour (`lime-800` on light). One ground, one
 * padding box, 8 px between the three parts, a `line` hairline above and
 * below the whole — a flat block on the section ground, not a card floating
 * on a surface. On `lime-100` the hairline is `border.hairlineOnLime`.
 * Space: content-driven; nothing here is late data.
 * A11y: `figure` with the quote in a `blockquote` and the attribution in
 * `figcaption`, so the author is announced as the quote's caption; the link
 * names publication and article in its own text.
 */
export function QuoteCard({
  quote,
  name,
  role,
  organisation,
  sourceLabel,
  sourceUrl,
  locale = "de",
  tone = "ground",
  className,
}: QuoteCardProps) {
  return (
    <figure
      className={[styles.card, tone === "photo" ? styles.photo : undefined, className]
        .filter(Boolean)
        .join(" ")}
      data-quote-card
    >
      <blockquote className={styles.quote}>
        <p className={styles.text}>{quote}</p>
      </blockquote>
      <figcaption className={styles.caption}>
        <span className={styles.name}>{name}</span>
        <span className={styles.role}>
          {role}, {organisation}
        </span>
        <OutboundLink className={styles.link} href={sourceUrl} locale={locale}>
          {sourceLabel}
        </OutboundLink>
      </figcaption>
    </figure>
  );
}
