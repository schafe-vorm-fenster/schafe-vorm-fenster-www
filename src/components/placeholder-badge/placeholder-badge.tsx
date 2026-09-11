import { Badge } from "../badge/badge";

import styles from "./placeholder-badge.module.css";

export interface PlaceholderBadgeProps {
  readonly label?: string;
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
  label = "Nicht motivgenau · Platzhalter",
  className,
}: PlaceholderBadgeProps) {
  return (
    <Badge
      className={[styles.badge, className].filter(Boolean).join(" ")}
      icon="triangle-alert"
      tone="placeholder"
    >
      {label}
    </Badge>
  );
}
