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
  /**
   * The ground it stands on. `light` is the footer's paper; `dark` is the
   * phone menu's ink overlay, where the light-ground link colour would be
   * invisible. Same failure class as state/open.md row 133 — a component
   * that does not re-assert its own colour against an ambient dark ground.
   */
  readonly tone?: "light" | "dark";
  readonly label?: string;
  readonly className?: string;
}

/**
 * 10 `language-switch` [PROPOSED] — TS-WEB-0001 D5 (DEC-0120).
 *
 * Structure: one control per **other** language, never one for the current
 * — the current language is the page the visitor is reading, and a button
 * for it does nothing (review R-home-39). Each control is an invitation in
 * the target language plus a plain `<a>` to the **equivalent** page,
 * resolved through `href()` — so `de` stays bare, `/en/…` carries the
 * prefix, and the English page keeps its own path segments. Never the home
 * page.
 * States: none. No JavaScript, no dropdown, no detection UI — the language
 * is a choice the visitor makes, not something the site guesses from an IP.
 * Inherits: Meta for the invitation, the link treatment for the control.
 * Space: fixed; the language set is known at build time.
 * A11y: a `nav` named after the footer's "Sprache"; `hreflang` and `lang`
 * on the link and `lang` on the invitation, because both are in the other
 * language; targets ≥ 44 px. An invitation nobody has written yet carries
 * `data-demo="true"` — the marking lives in the markup, never in a word.
 */
export function LanguageSwitch({
  route,
  current,
  tone = "light",
  label,
  className,
}: LanguageSwitchProps) {
  const name = label ?? dictionary(current).footer.language;
  const others = LOCALES.filter((locale) => locale !== current);

  return (
    <nav
      aria-label={name}
      className={[styles.nav, tone === "dark" ? styles.dark : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <ul className={styles.list}>
        {others.map((locale) => {
          const words = dictionary(locale).languageSwitch;
          return (
            <li className={styles.item} key={locale} lang={locale}>
              <span
                className={styles.invitation}
                data-demo={words.invitationIsPlaceholder ? "true" : undefined}
              >
                {words.invitation}
              </span>{" "}
              <a
                className={styles.link}
                href={href(route, locale)}
                hrefLang={HREFLANG[locale]}
                lang={locale}
              >
                {LANGUAGE_LABELS[locale]}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** The endonym of each language — a language names itself, in itself. */
const LANGUAGE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
};
