import { OutboundLink } from "../outbound-link/outbound-link";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./lead-fallback.module.css";

/**
 * Who receives what the visitor types into the form behind `/start`
 * (TS-WEB-0016 D6 rule 3, DEC-0013): the form is Google's, and the marking
 * under the link says so.
 */
const FORM_RECIPIENT = "Google";

export interface LeadFallbackProps {
  readonly email: string;
  /**
   * The page's contact section, as an in-page target built through the route
   * facade — `<route>#kontakt` (DEC-0081 §3, DEC-0133). Shown on S2 and S4
   * only (TS-WEB-0016 D6). It used to be the Google appointment URL: the
   * booking is the section's first action row now, and this line resolves to
   * it rather than being a second occurrence of it (TS-WEB-0016-A5).
   */
  readonly briefingHref?: string;
  readonly briefingLabel?: string;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 51 `lead-fallback` [PROPOSED] — TS-WEB-0016 D6, D16, DEC-0069, DEC-0081 §3.
 *
 * Structure: **one** component reused by every lead surface — an outbound
 * link to our own `/start` path (which embeds the Google Form, D15), naming
 * Google as the recipient in the marking **after** the control, plus the
 * email address beside it, plus the consult line where the surface offers one
 * (S2, S4). That third line is an in-page link to the page's own contact
 * section, so the fallback carries no second occurrence of the appointment URL.
 * States: it is itself the degraded state — server-rendered markup, not
 * script-generated, so it stands whether the widget failed to load, errored,
 * was never delivered, or JavaScript is disabled. No `state` prop.
 * Inherits: `outbound-link` marking (linked, never embedded — DEC-0013);
 * secondary treatment; never above the primary CTA.
 * Space: fixed height, so the swap widget ↔ fallback never reflows the page.
 * A11y: the visitor is told where the one outbound link goes before following
 * it, as a `meta` line on its own line under the control (TS-WEB-0016-A23 for
 * the association, D16's Position row for the line), and the three lines are
 * read out of the dictionary so the English surface is English.
 */
export function LeadFallback({
  email,
  briefingHref,
  briefingLabel,
  locale = "de",
  className,
}: LeadFallbackProps) {
  const words = dictionary(locale).leadFallback;

  return (
    <div className={[styles.fallback, className].filter(Boolean).join(" ")}>
      <p className={styles.line}>
        {/* D16's Position row names this link: the recipient belongs on its
            own line under the control, not beside it (`markingOwnLine`). */}
        <OutboundLink href="/start" locale={locale} markingOwnLine recipient={FORM_RECIPIENT}>
          {words.formLink}
        </OutboundLink>
      </p>
      <p className={styles.line}>
        {words.byMail} <a href={`mailto:${email}`}>{email}</a>
      </p>
      {briefingHref ? (
        <p className={styles.line}>
          {/* No `ConversionTracker` and no marking: an in-page target emits
              nothing and leaves nothing (TS-WEB-0016 D7 Measurement). */}
          <a className={styles.consult} data-cta="secondary" href={briefingHref}>
            {briefingLabel ?? words.consult}
          </a>
        </p>
      ) : null}
    </div>
  );
}
