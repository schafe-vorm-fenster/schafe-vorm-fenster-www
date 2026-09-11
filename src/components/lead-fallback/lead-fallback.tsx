import { OutboundLink } from "../outbound-link/outbound-link";

import styles from "./lead-fallback.module.css";

export interface LeadFallbackProps {
  readonly email: string;
  /** Shown on S2 and S4 only (TS-016 D6). */
  readonly briefingHref?: string;
  readonly briefingLabel?: string;
  readonly className?: string;
}

/**
 * 51 `lead-fallback` [PROPOSED] — TS-016 D6, DEC-069.
 *
 * Structure: **one** component reused by every lead surface — an outbound
 * link to our own `/start` path (which redirects to the Google Form that
 * already runs today), naming Google as the recipient, plus the email
 * address beside it, plus the briefing link where the surface offers one
 * (S2, S4).
 * States: it is itself the degraded state — server-rendered markup, not
 * script-generated, so it stands whether the widget failed to load, errored,
 * was never delivered, or JavaScript is disabled. No `state` prop.
 * Inherits: `outbound-link` marking (linked, never embedded — DEC-013);
 * secondary treatment; never above the primary CTA.
 * Space: fixed height, so the swap widget ↔ fallback never reflows the page.
 * A11y: the visitor is told where each link goes before following it.
 */
export function LeadFallback({ email, briefingHref, briefingLabel, className }: LeadFallbackProps) {
  return (
    <div className={[styles.fallback, className].filter(Boolean).join(" ")}>
      <p className={styles.line}>
        <OutboundLink href="/start" recipient="Google">
          Formular öffnen
        </OutboundLink>
      </p>
      <p className={styles.line}>
        oder per E-Mail: <a href={`mailto:${email}`}>{email}</a>
      </p>
      {briefingHref ? (
        <p className={styles.line}>
          <OutboundLink href={briefingHref} newTab recipient="Google Kalender">
            {briefingLabel ?? "Termin für ein Kennenlerngespräch buchen"}
          </OutboundLink>
        </p>
      ) : null}
    </div>
  );
}
