import { dictionary } from "@/src/lib/i18n/dictionary";
import { legalAnchor } from "@/src/lib/routes/legal-anchors";
import { FOOTER_LEGAL_LINKS } from "@/src/lib/routes/navigation";

import { LanguageSwitch } from "../language-switch/language-switch";
import { Logo } from "../logo/logo";
import { RouteLink } from "../route-link/route-link";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

import styles from "./site-footer.module.css";

export interface SiteFooterProps {
  /** The page the footer stands on — the language switch needs it (A7). */
  readonly route: RouteId;
  readonly locale?: Locale;
  /** The contact surface: `envoy-form-mount` with its `lead-fallback` (S1). */
  readonly contact?: ReactNode;
  /** The newsletter entry (S5) — in M2 a labelled mock (decision D-4). */
  readonly newsletter?: ReactNode;
  readonly className?: string;
}

/**
 * 9 `site-footer` [PROPOSED] — TS-004 D4, TS-016 D10.
 *
 * Structure: contact (the `envoy-form-mount` target, S1) · the newsletter
 * block (S5) · the legal links Impressum / Datenschutz / Barrierefreiheit as
 * anchors on the one legal page · the `language-switch`. The link list and
 * the anchors come from `src/lib/routes/` (DEC-039: an anchor is permanent),
 * the labels from the dictionary. Nothing renders after the closing CTA
 * except this (TS-006 D2).
 * States: the newsletter slot degrades on its own terms — in M2 it is a
 * visibly labelled mock, and this component only holds the slot, so the
 * footer never has to know whether a sending system exists. Everything else
 * here is static.
 * Inherits: a flat surface, radius 0, hairline separators, Meta and
 * Label-mono type.
 * Space: no reserved-space problem — nothing here arrives late.
 * A11y: one `footer` landmark and two named link lists.
 */
export function SiteFooter({
  route,
  locale = "de",
  contact,
  newsletter,
  className,
}: SiteFooterProps) {
  const d = dictionary(locale);

  return (
    <footer className={[styles.footer, className].filter(Boolean).join(" ")}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo locale={locale} variant="wordmark" />
        </div>
        {contact ? (
          <div className={styles.slot}>
            <p className={styles.slotTitle}>{d.footer.contact}</p>
            {contact}
          </div>
        ) : null}
        {newsletter ? (
          <div className={styles.slot}>
            <p className={styles.slotTitle}>{d.footer.newsletter}</p>
            {newsletter}
          </div>
        ) : null}
        <nav aria-label={d.footer.imprint} className={styles.legal}>
          <p className={styles.slotTitle}>{d.footer.imprint}</p>
          <ul className={styles.list}>
            {FOOTER_LEGAL_LINKS.map((entry) => (
              <li key={entry.section}>
                <RouteLink
                  hash={legalAnchor(entry.section, locale)}
                  locale={locale}
                  to={entry.route}
                >
                  {d.footer[entry.label]}
                </RouteLink>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitch
          className={styles.language}
          current={locale}
          label={d.footer.language}
          route={route}
        />
      </div>
    </footer>
  );
}
