import { dictionary } from "@/src/lib/i18n/dictionary";
import { legalAnchor } from "@/src/lib/routes/legal-anchors";
import { FOOTER_LEGAL_LINKS } from "@/src/lib/routes/navigation";

import { LanguageSwitch } from "../language-switch/language-switch";
import { Logo } from "../logo/logo";
import { RouteLink } from "../route-link/route-link";

import type { Copyright } from "@/app/[lang]/_footer-data";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

import styles from "./site-footer.module.css";

export interface SiteFooterProps {
  /** The page the footer stands on — the language switch needs it (A7). */
  readonly route: RouteId;
  readonly locale?: Locale;
  /**
   * The copyright line's year and holder — the holder is the imprint's legal
   * name, read on the server (`app/[lang]/_footer-data.ts`, TS-WEB-0011 D4).
   * Absent or with an empty holder, the line is not rendered: an unreadable
   * imprint is no reason to print a name nobody stated.
   */
  readonly copyright?: Copyright;
  /**
   * The newsletter entry (S5) — passed only while a sending system accepts a
   * subscription (`newsletter-block/constant.ts`, TS-WEB-0016-A21). The footer
   * holds the slot and never asks whether one exists.
   */
  readonly newsletter?: ReactNode;
  readonly className?: string;
}

/**
 * 9 `site-footer` [PROPOSED] — TS-WEB-0004 D4, TS-WEB-0016 D10; the design of
 * SRC-0014 §Site footer (review 2026-10-12, issue #42, DEC-0158).
 *
 * Structure, on a neutral-black `ink` ground: row one is the logo (mark and
 * two-line wordmark) and the `language-switch` as a segmented control —
 * beside each other from `md`, stacked on the phone with the switch under
 * the logo; then the newsletter slot, while one is offered (S5); then, under
 * a hairline, the legal links Impressum / Datenschutz / Barrierefreiheit as
 * anchors on the one legal page and the copyright line — beside each other
 * from `xl`, stacked below it. The link list and the anchors come from
 * `src/lib/routes/` (DEC-0039: an anchor is permanent), the labels from the
 * dictionary. **No contact entry** (TS-WEB-0004 D4): the contact section
 * stands directly above this footer on every page and is the site's one
 * contact surface (DEC-0081, DEC-0122 §2).
 * States: the newsletter slot degrades on its own terms — this component only
 * holds it. Everything else here is static.
 * Inherits: `paper` type on `ink`; the legal links bold, so they read as
 * links by weight and place, not by an underline (which they gain on hover);
 * the copyright line in `line`, because `muted` on `ink` measures 3.54:1
 * (DEC-0158 §2).
 * Space: no reserved-space problem — nothing here arrives late.
 * A11y: one `footer` landmark, one named link list for the legal links and
 * one for the languages; every control is a plain link, ≥ 44 px, works with
 * no JavaScript, and shows the dark-ground focus ring (`focus-dark`).
 */
export function SiteFooter({
  route,
  locale = "de",
  copyright,
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
          <LanguageSwitch current={locale} label={d.footer.language} route={route} />
        </div>
        {/* The newsletter keeps its own heading, so the slot adds no second
            label above it. */}
        {newsletter ? <div className={styles.newsletter}>{newsletter}</div> : null}
        <div className={styles.base}>
          <nav aria-label={d.footer.imprint} className={styles.legal}>
            <ul className={styles.list}>
              {FOOTER_LEGAL_LINKS.map((entry) => (
                <li key={entry.section}>
                  <RouteLink
                    className={styles.link}
                    hash={legalAnchor(entry.section, locale)}
                    locale={locale}
                    styled={false}
                    to={entry.route}
                  >
                    {d.footer[entry.label]}
                  </RouteLink>
                </li>
              ))}
            </ul>
          </nav>
          {copyright?.holder ? (
            <p className={styles.copyright}>
              © {copyright.year} {copyright.holder}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
