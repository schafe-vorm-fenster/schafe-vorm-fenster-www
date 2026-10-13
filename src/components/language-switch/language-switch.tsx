import { dictionary } from "@/src/lib/i18n/dictionary";
import { HREFLANG, LOCALES } from "@/src/lib/i18n/locales";
import { href } from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./language-switch.module.css";

export interface LanguageSwitchProps {
  /** The page the visitor is on — switching keeps them on it (TS-WEB-0001-A7). */
  readonly route: RouteId;
  readonly current: Locale;
  readonly label?: string;
  readonly className?: string;
}

/**
 * 10 `language-switch` [PROPOSED] — TS-WEB-0001 D5 (DEC-0158, replacing the
 * invitation form of DEC-0120).
 *
 * Structure: a **segmented control** — one segment per language, in the
 * order of the language table, each segment a plain `<a>` to the
 * **equivalent** page resolved through `href()` (so `de` stays bare and
 * `/en/…` carries the prefix), never the home page. The segment of the
 * language the visitor is reading carries `aria-current="page"` and the
 * filled look; the other is the control that switches. Navigation, not a
 * radio group: choosing a language loads a page, and a link says so.
 * States: none. No JavaScript, no dropdown, no detection UI — the language
 * is a choice the visitor makes, not something the site guesses from an IP.
 * Inherits: Label-mono type; `lime-500` fill with `ink` text for the active
 * segment, `paper` on an `ink`-lifted track for the other (SRC-0014
 * §Site footer). It always stands on `ink` — the footer and the phone menu
 * overlay are both that ground, so there is no tone to choose.
 * Space: fixed; the language set is known at build time.
 * A11y: a `nav` named after the footer's "Sprache"; `hreflang` and `lang` on
 * every link, because each name is in its own language; the current page is
 * told by `aria-current`, not by colour alone; targets ≥ 44 px; the focus
 * ring is the dark-ground one.
 */
export function LanguageSwitch({ route, current, label, className }: LanguageSwitchProps) {
  const name = label ?? dictionary(current).footer.language;

  return (
    <nav aria-label={name} className={[styles.nav, className].filter(Boolean).join(" ")}>
      <ul className={styles.track}>
        {LOCALES.map((locale) => (
          <li className={styles.item} key={locale}>
            <a
              aria-current={locale === current ? "page" : undefined}
              className={styles.segment}
              href={href(route, locale)}
              hrefLang={HREFLANG[locale]}
              lang={locale}
            >
              {LANGUAGE_LABELS[locale]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The endonym of each language — a language names itself, in itself. */
const LANGUAGE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
};
