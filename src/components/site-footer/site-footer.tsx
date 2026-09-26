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
  /**
   * The newsletter entry (S5) — passed only while a sending system accepts a
   * subscription (`newsletter-block/constant.ts`, TS-WEB-0016-A21). The footer
   * holds the slot and never asks whether one exists.
   */
  readonly newsletter?: ReactNode;
  readonly className?: string;
}

/**
 * 9 `site-footer` [PROPOSED] — TS-WEB-0004 D4, TS-WEB-0016 D10.
 *
 * Structure: the wordmark · the newsletter slot, while one is offered (S5) · a
 * base line carrying the legal links Impressum / Datenschutz /
 * Barrierefreiheit as anchors on the one legal page and the `language-switch`
 * beside them. The link list and the anchors come from `src/lib/routes/`
 * (DEC-0039: an anchor is permanent), the labels from the dictionary. **No
 * contact entry** (TS-WEB-0004 D4): the contact section stands directly above
 * this footer on every page and is the site's one contact surface.
 * States: the newsletter slot degrades on its own terms — this component only
 * holds it, so the footer never has to know whether a sending system exists.
 * Everything else here is static.
 * Inherits: a flat surface, radius 0, hairline separators, Meta and
 * Label-mono type.
 * Space: no reserved-space problem — nothing here arrives late.
 * A11y: one `footer` landmark and one named link list; every control here is a
 * plain link and works with no JavaScript at all.
 *
 * ### Why the contact disclosure is gone (DEC-0081, DEC-0122 §2)
 *
 * The footer stands under **every** one of the 24 routes, so its height is
 * subtracted from every page's own budget before the page has written a word.
 * It measured 1110 px at 390 × 844, and 480 px of that was one thing: a
 * general contact form with three fields and a textarea, on a page the visitor
 * came to for something else. The polish pass folded it behind a `<details>`;
 * DEC-0081 then **replaced** it. One contact surface exists for the whole
 * site — the contact section, rendered by the chrome directly above this
 * footer — and `TS-WEB-0006-A17` forbids a general contact form anywhere. So
 * the slot, the disclosure and the envoy kind behind it are deleted rather
 * than hidden, and TS-WEB-0004-A9's "no contact entry, no form" holds by
 * construction. The `footer.contact` dictionary word stays where it is: the
 * dictionary is a shared file, and an unused word costs nothing.
 */
export function SiteFooter({
  route,
  locale = "de",
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
