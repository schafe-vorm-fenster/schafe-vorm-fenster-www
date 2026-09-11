import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./skip-link.module.css";

export interface SkipLinkProps {
  /** The id of the `main` landmark. */
  readonly targetId?: string;
  readonly locale?: Locale;
  /** Overrides the dictionary's `skipToContent`; normally left alone. */
  readonly label?: string;
  readonly className?: string;
}

/**
 * 12 `skip-link` [PROPOSED] — TS-002 D5.
 *
 * Structure: the first focusable element of the document; it jumps to `main`.
 * States: visually hidden until focused — `clip-path`, not `display: none`,
 * so it stays in the tab order.
 * Inherits: the secondary `button` treatment when visible, radius 999.
 * Space: occupies none until focused, and it must not shift the layout when
 * it appears — which is why it is positioned, not inserted.
 * A11y: this component is the reason the rule exists; the 3 px `violet-500`
 * ring is visible against the paper ground it lands on.
 */
export function SkipLink({
  targetId = "main",
  locale = "de",
  label,
  className,
}: SkipLinkProps) {
  return (
    <a className={[styles.skip, className].filter(Boolean).join(" ")} href={`#${targetId}`}>
      {label ?? dictionary(locale).skipToContent}
    </a>
  );
}
