import { Badge } from "../badge/badge";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./demo-data-badge.module.css";

export interface DemoDataBadgeProps {
  /** An explicit word, for a caller that has one. Otherwise `locale` decides. */
  readonly label?: string;
  /**
   * The page's language. Without it the badge said `Demo-Daten` on `/en` too
   * (`state/open.md` row 101) — the label is a UI string and belongs in the
   * dictionary, not in a component default.
   */
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 60 `demo-data-badge` [PROPOSED] — plan/guardrails.md mock rule, decision D-8.
 *
 * Structure: the label `Demo-Daten` on every module fed by a mock or by
 * generated content.
 * States: present while the mock is active, removed when the real system
 * lands — one `Mock aktiv` row in state/open.md per occurrence.
 * Inherits: the design system's one "this is not real" pair —
 * `status-warning` on the placeholder ground (6.0:1), radius 999, mono — the
 * same register as placeholder photography and unresolved clearance.
 * Space: badge height, reserved, so removing the mock does not reflow.
 * A11y: text in the accessibility tree, never colour-only.
 */
export function DemoDataBadge({ label, locale = "de", className }: DemoDataBadgeProps) {
  return (
    <Badge className={[styles.badge, className].filter(Boolean).join(" ")} tone="placeholder">
      {label ?? dictionary(locale).live.demoData}
    </Badge>
  );
}
