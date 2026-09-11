import { Icon, type IconName } from "../icon/icon";

import type { ReactNode } from "react";

import styles from "./badge.module.css";

/**
 * The fill/text pairs, each one checked at badge size (SRC-014 §Category
 * colours, §Badge and chip). `paper` is never assumed on a category fill:
 * `lime-600` and `lime-500` both require `ink`.
 */
export const BADGE_TONES = [
  "fest",
  "merchants",
  "culture",
  "official",
  "social",
  "neighbouring",
  "accent",
  "voice",
  "neutral",
  "paper",
  "placeholder",
] as const;

export type BadgeTone = (typeof BADGE_TONES)[number];

export interface BadgeProps {
  readonly tone?: BadgeTone;
  /** An 18 px glyph turns the badge into a kicker — height 30 instead of 26. */
  readonly icon?: IconName;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * 3 `badge` [FIXED] — SRC-014 §Badge and chip.
 *
 * Structure: a label. Radius 999, mono 12–13 px / 700, padding 7 × 15,
 * height 26 — or 30 with an 18 px icon, which is what a kicker is.
 * States: none of its own; it labels whatever its parent renders.
 * Inherits: fill/text pairs from the tables only, each ≥ 4.5:1 at this size.
 * Space: the height is fixed, so a live count that grows from one digit to
 * two does not reflow the row (SRC-014 §Reserved text space).
 * A11y: text, in the accessibility tree, never colour-only — the badge says
 * what it claims in words. The icon is decorative.
 */
export function Badge({ tone = "neutral", icon, className, children }: BadgeProps) {
  const classes = [styles.badge, styles[tone], icon ? styles.withIcon : undefined, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} data-tone={tone}>
      {icon ? <Icon name={icon} size={18} /> : null}
      {children}
    </span>
  );
}
