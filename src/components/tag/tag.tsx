import type { ReactNode } from "react";

import styles from "./tag.module.css";

export interface TagProps {
  /**
   * The one state, shared with `chip`: the fill goes away, a 1 px `border`
   * outline takes its place, the label is struck through in `muted` — "this
   * is what your calendar leaves out" (SRC-0014 §Badge and chip).
   */
  readonly excluded?: boolean;
  /** `ink` fill with `paper` text; `surface` with `ink` text inside a lime section. */
  readonly tone?: "ink" | "surface";
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * `tag` [PROPOSED] — SRC-0014 §Badge and chip ("Tag"), design-system
 * contract row `tag`.
 *
 * Structure: the non-tappable size. 30 px, mono 15 px / 700, padding 5 × 12,
 * radius 999. A tag names a value the reader cannot act on: the places,
 * organisers and categories a calendar is configured for.
 * States: `excluded` — the only strikethrough in the system.
 * Inherits: the badge's shape and type; no border and no shadow except the
 * excluded outline.
 * Space: the height is fixed, so a row of tags never reflows when one is
 * struck.
 * A11y: text in the accessibility tree; the struck label is an `<s>`
 * element, so the exclusion is markup and not colour alone.
 */
export function Tag({ excluded = false, tone = "ink", className, children }: TagProps) {
  const classes = [styles.tag, excluded ? styles.excluded : styles[tone], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} data-excluded={excluded ? "true" : undefined}>
      {excluded ? <s className={styles.struck}>{children}</s> : children}
    </span>
  );
}
