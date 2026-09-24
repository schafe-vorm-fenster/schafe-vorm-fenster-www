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
 * 9 `site-footer` [PROPOSED] — TS-WEB-0004 D4, TS-WEB-0016 D10.
 *
 * Structure: the wordmark · the newsletter block (S5) · contact (the
 * `envoy-form-mount` target, S1) behind its own disclosure · a base line
 * carrying the legal links Impressum / Datenschutz / Barrierefreiheit as
 * anchors on the one legal page and the `language-switch` beside them. The
 * link list and the anchors come from `src/lib/routes/` (DEC-0039: an anchor
 * is permanent), the labels from the dictionary. Nothing renders after the
 * closing CTA except this (TS-WEB-0006 D2).
 * States: the newsletter slot degrades on its own terms — in M2 it is a
 * visibly labelled mock, and this component only holds the slot, so the
 * footer never has to know whether a sending system exists. Everything else
 * here is static.
 * Inherits: a flat surface, radius 0, hairline separators, Meta and
 * Label-mono type.
 * Space: no reserved-space problem — nothing here arrives late.
 * A11y: one `footer` landmark and two named link lists; the disclosure is a
 * native `<summary>`, 44 px, and works with no JavaScript at all.
 *
 * ### Why contact is a disclosure (polish brief, the shared-component pass)
 *
 * The footer stands under **every** one of the 24 routes, so its height is
 * subtracted from every page's own budget before the page has written a
 * word. It measured 1110 px at 390 × 844 — one and a third phone screens,
 * more than G-4 allows a whole *section*, and the reason no page reached the
 * brief's length target.
 *
 * 480 px of that was one thing: the contact form, rendered open, with three
 * fields and a textarea, on a page the visitor came to for something else.
 * The other surfaces here are one line each and cannot be cut further
 * without losing what TS-WEB-0004-A9 asks for — the newsletter has to be usable
 * where it stands (it is the conversion), and a legal link behind a
 * disclosure is not "footer-linked on every page" in the sense TS-WEB-0002-A8
 * means. A contact **form** is not what that criterion names either: it
 * names contact, and a `<details>` labelled "Kontakt" carries contact,
 * visibly, one tap away, in the DOM on every route, with the form's own
 * markup server-rendered inside it and the whole thing working with
 * scripting off. Nothing is removed; 480 px of unasked-for form is folded.
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
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo locale={locale} variant="wordmark" />
          </div>
          {/* The newsletter keeps its own heading, so the slot adds no second
              label above it — "NEWSLETTER" over "Neuigkeiten aus dem Projekt"
              was the site naming one thing twice, 28 px apart. */}
          {newsletter ? <div className={styles.newsletter}>{newsletter}</div> : null}
        </div>
        {contact ? (
          <details className={styles.contact}>
            <summary className={styles.summary}>{d.footer.contact}</summary>
            <div className={styles.contactBody}>{contact}</div>
          </details>
        ) : null}
        {/* One base line: the three legal links and the two languages, wrapped
            rather than stacked in three labelled blocks of their own. */}
        <div className={styles.base}>
          <nav aria-label={d.footer.imprint} className={styles.legal}>
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
      </div>
    </footer>
  );
}
