import { Icon, type IconName } from "../icon/icon";

import type { ComparisonRow } from "../content-fragments";

import styles from "./comparison-table.module.css";

/**
 * The class the section around the module takes (`<SectionShell
 * className={COMPARISON_SECTION_CLASS}>`): the design's own section padding
 * (issue 159, DEC-0203 §2). Exported so both pages hand the shell the same
 * value and neither restates it.
 */
export const COMPARISON_SECTION_CLASS: string = styles.section ?? "";

/** One pair: the two sentences and the glyph that names the topic of the *today* half. */
export interface ComparisonPair extends ComparisonRow {
  /** Decorative; the label and the sentence carry the meaning (`aria-hidden`). */
  readonly icon: IconName;
}

export interface ComparisonTableProps {
  /** The section's `h2` — the module carries its own heading (DEC-0203 §2). */
  readonly headline: string;
  /** The heading's id, so the section can name itself by it (`aria-labelledby`). */
  readonly headingId?: string;
  /**
   * The pairs, in reading order. `/dein-kalender` passes four (TS-WEB-0024 D4),
   * `/mitmachen` three (TS-WEB-0022 D3); the count is the caller's, held by
   * `comparisonPairs()` against the page's own icon list.
   */
  readonly rows: readonly ComparisonPair[];
  /**
   * Both labels are required and carry no default: TS-WEB-0024 D4's "the
   * second column names no product" and SRC-0017 CG-039 cannot be held by a
   * component that ships a product name as a fallback. The caller reads them
   * off its own content.
   */
  readonly todayLabel: string;
  readonly withProductLabel: string;
  readonly className?: string;
}

/**
 * 26 `comparison-table` — the comparison module "Heute → Mit eurem Kalender"
 * (issue 159, version 1a; DEC-0203, SRC-0014 §Comparison). One component for
 * both places it stands: `/dein-kalender` (municipalities, four pairs) and
 * `/mitmachen` (organisers, three pairs). Only the content differs.
 *
 * Structure: the heading, then the pairs as a list. Each pair is one block of
 * two halves with a straight edge between them and the radius only on the
 * outside — *today* on `surface`, *with your calendar* on `lime-500`. A dark
 * circle with the topic's glyph stands with *today*, a dark circle with the
 * arrow on the edge between the halves.
 * Layout: below `lg` the halves stack (today on top, the icon circle half over
 * the block's top edge, the arrow pointing down on the seam); from `lg` they
 * stand 50/50 in one row, the icon in front of the text, the arrow on the
 * middle edge pointing right. The text of both halves starts at the same
 * height.
 * States: static content; no data dependency, so no `state` prop.
 * Inherits: no checkmark or cross column, no feature matrix, and no product
 * name — both labels are required props without a default.
 * A11y: each pair is one list item; both halves carry their label as visible
 * text with a colon for assistive technology only, so the pairing survives
 * outside the visual layout and is never colour- or position-only. Both
 * circles are decoration (`aria-hidden`).
 */
export function ComparisonTable({
  headline,
  headingId,
  rows,
  todayLabel,
  withProductLabel,
  className,
}: ComparisonTableProps) {
  return (
    <div className={[styles.block, className].filter(Boolean).join(" ")} data-comparison="">
      <h2 className={styles.headline} id={headingId}>
        {headline}
      </h2>
      <ul className={styles.list}>
        {rows.map((row) => (
          <li className={styles.pair} data-pair="" key={`${row.today}-${row.withProduct}`}>
            <div className={`${styles.half} ${styles.today}`} data-half="today">
              <span aria-hidden="true" className={styles.iconCircle} data-pair-icon={row.icon}>
                <Icon name={row.icon} />
              </span>
              <p className={styles.cell}>
                <span className={styles.label}>
                  {todayLabel}
                  <span className={styles.hidden}>: </span>
                </span>
                {row.today}
              </p>
            </div>
            <div className={`${styles.half} ${styles.with}`} data-half="with">
              <span aria-hidden="true" className={styles.arrowCircle} data-pair-arrow="">
                <Icon className={styles.arrowGlyph} name="arrow-right" />
              </span>
              <p className={styles.cell}>
                <span className={styles.label}>
                  {withProductLabel}
                  <span className={styles.hidden}>: </span>
                </span>
                {row.withProduct}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
