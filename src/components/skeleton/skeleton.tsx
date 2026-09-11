import type { CSSProperties } from "react";

import styles from "./skeleton.module.css";

export const SKELETON_RATIOS = [
  "hero",
  "feature",
  "proof",
  "map",
  "portrait",
  "square",
] as const;

export type SkeletonRatio = (typeof SKELETON_RATIOS)[number];

export interface SkeletonProps {
  /** `box` is the hatch at a ratio, `text` a stack of bars, `control` a pill. */
  readonly variant?: "box" | "text" | "control" | "row";
  readonly ratio?: SkeletonRatio;
  /** Number of text bars; the last one is 60 % wide, as the design system says. */
  readonly lines?: number;
  /** Number of row placeholders at the fixed event-row height. */
  readonly rows?: number;
  readonly className?: string;
}

/**
 * 57 `skeleton` [PROPOSED] — SRC-014 §Skeletons, TS-009 D7.
 *
 * Structure: the box at its declared ratio filled with the placeholder hatch;
 * text skeletons are `line` bars at the text's own line height, the last one
 * 60 % wide. Built from the same geometry as the real module, so nothing
 * moves when the data arrives.
 * States: it *is* a state — the `loading` one. It does not animate: the site
 * has exactly one motion, and a pulsing skeleton would read as a second.
 * Persisting beyond ~2 s it is replaced by the honest empty state, which is
 * the caller's decision, not the skeleton's.
 * Inherits: it never renders a fake value that could be read as data — no
 * example figures, no placeholder place name.
 * Space: a fixed item count, so a shorter answer leaves the last rows empty
 * instead of shrinking the box. This component and `media-frame` are the
 * site's CLS defence.
 * A11y: `aria-hidden="true"` — there is nothing here to announce.
 */
export function Skeleton({
  variant = "box",
  ratio = "feature",
  lines = 3,
  rows = 3,
  className,
}: SkeletonProps) {
  const classes = [styles.skeleton, className].filter(Boolean).join(" ");

  if (variant === "text") {
    return (
      <div aria-hidden="true" className={classes}>
        {Array.from({ length: lines }, (_, index) => (
          <span
            className={index === lines - 1 ? styles.lastBar : styles.bar}
            key={index}
          />
        ))}
      </div>
    );
  }

  if (variant === "control") {
    return <span aria-hidden="true" className={[classes, styles.control].join(" ")} />;
  }

  if (variant === "row") {
    return (
      <div aria-hidden="true" className={classes}>
        {Array.from({ length: rows }, (_, index) => (
          <span className={styles.row} key={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={[classes, styles.box].join(" ")}
      style={{ "--skeleton-ratio": `var(--ratio-${ratio})` } as CSSProperties}
    />
  );
}
