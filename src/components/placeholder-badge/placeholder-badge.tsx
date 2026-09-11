import { Badge } from "../badge/badge";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./placeholder-badge.module.css";

export interface PlaceholderBadgeProps {
  /** An explicit word, for a caller that has one. Otherwise `locale` decides. */
  readonly label?: string;
  /**
   * The page's language. Without it the badge said "Nicht motivgenau ·
   * Platzhalter" on `/en` too (F-2-4, same root cause as `demo-data-badge`
   * before it) — the label is a UI string and belongs in the dictionary, not
   * in a component default.
   */
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 59 `placeholder-badge` [PROPOSED] — SRC-014 §Photo surface.
 *
 * Structure: "Nicht motivgenau · Platzhalter" in mono at 11 px, radius 999,
 * on any photograph that does not depict what the copy claims.
 * States: present or absent — never softened into a caption, never dropped
 * because the picture "looks close enough".
 * Inherits: the placeholder pair (`status-warning` on the placeholder
 * ground), with `triangle-alert` at 18 px.
 * Space: sits inside the photo box; no layout effect.
 * A11y: readable text, checked at 4.5:1 for badge size.
 */
export function PlaceholderBadge({
  label,
  locale = "de",
  className,
}: PlaceholderBadgeProps) {
  return (
    <Badge
      className={[styles.badge, className].filter(Boolean).join(" ")}
      icon="triangle-alert"
      tone="placeholder"
    >
      {label ?? dictionary(locale).media.notDepicting}
    </Badge>
  );
}
