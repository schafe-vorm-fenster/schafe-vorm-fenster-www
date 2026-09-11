import type { FourComparisonRows } from "../content-fragments";

import styles from "./comparison-table.module.css";

export interface ComparisonTableProps {
  readonly headline?: string;
  /** Exactly four rows — enforced at the type level (TS-024 D4). */
  readonly rows: FourComparisonRows;
  readonly todayLabel?: string;
  readonly withProductLabel?: string;
  readonly className?: string;
}

/**
 * 26 `comparison-table` [PROPOSED] — content type 6 `comparison`,
 * TS-024 D4.
 *
 * Structure: exactly four rows, two columns (today · with the product), one
 * sentence per cell. Built as a list rather than a `<table>` — free per the
 * inventory — so the four rows stay machine-countable without checkmark
 * columns creeping in.
 * States: static content; no data dependency, so no `state` prop.
 * Inherits: **no checkmark/cross column**, no feature matrix; a hairline
 * between rows, never a card.
 * Space: rows are content-sized; nothing here is late content.
 * A11y: each row is one list item; both cells carry their column's label as
 * visible text, so the pairing survives outside the visual two-column layout
 * and is never colour- or position-only.
 */
export function ComparisonTable({
  headline,
  rows,
  todayLabel = "Heute",
  withProductLabel = "Mit Portalize",
  className,
}: ComparisonTableProps) {
  return (
    <div className={[styles.block, className].filter(Boolean).join(" ")}>
      {headline ? <h2 className={styles.headline}>{headline}</h2> : null}
      <ul className={styles.list}>
        {rows.map((row) => (
          <li className={styles.row} key={`${row.today}-${row.withProduct}`}>
            <p className={styles.cell}>
              <span className={styles.label}>{todayLabel}: </span>
              {row.today}
            </p>
            <p className={styles.cell}>
              <span className={styles.label}>{withProductLabel}: </span>
              {row.withProduct}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
