import styles from "./price-band.module.css";

export interface PriceBandProps {
  /** The section's role, in the site's fixed kicker vocabulary (`dictionary(locale).kickers.price`). */
  readonly kicker: string;
  /** The one heading that frames the three tiers by the criterion separating them (TS-WEB-0024 D6). */
  readonly headline: string;
  /** One line of framing — no second claim. */
  readonly framing: string;
  /** The heading's id, for the section's `aria-labelledby`. */
  readonly headingId?: string;
  readonly className?: string;
}

/**
 * `price-band` [PROPOSED] — SRC-0014 §Page Rhythm ("the price section is
 * highlighted"), TS-WEB-0024 D6.
 *
 * Structure: a `lime-500` band carrying the kicker, the headline and one
 * line of framing. The tiers follow beneath it on `paper`
 * (`price-tier-row`), inside the same section (`price-section`).
 * States: none — static content.
 * Inherits: the lime-500 ground's own pairs (`ink` headline, `lime-900`
 * kicker and framing; section-shell's `.lime500` values); radius 0; runs
 * edge to edge and brings its own `.container`, because a band framed by the
 * section's 16 px padding is a picture in a mount, not a surface.
 * Space: the standard section step above and below.
 * A11y: the headline is the section's `h2`; the kicker is a label, not a
 * heading.
 */
export function PriceBand({ kicker, headline, framing, headingId, className }: PriceBandProps) {
  return (
    <div className={[styles.band, className].filter(Boolean).join(" ")} data-surface="lime-500">
      <div className="container">
        <p className={styles.kicker}>{kicker}</p>
        <h2 className={styles.headline} id={headingId}>
          {headline}
        </h2>
        <p className={styles.framing}>{framing}</p>
      </div>
    </div>
  );
}
