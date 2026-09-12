import { dictionary } from "@/src/lib/i18n/dictionary";
import { HREFLANG, LOCALES } from "@/src/lib/i18n/locales";
import { href } from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./language-switch.module.css";

export interface LanguageSwitchProps {
  /** The page the visitor is on — switching keeps them on it (TS-001-A7). */
  readonly route: RouteId;
  readonly current: Locale;
  /**
   * The ground it stands on. `light` is the footer's paper; `dark` is the
   * phone menu's ink overlay, where the light-ground pair (lime-800 text, an
   * ink fill for the current language) would be invisible. Same failure class
   * as state/open.md row 133 — a component that does not re-assert its own
   * colour against an ambient dark ground.
   */
  readonly tone?: "light" | "dark";
  readonly label?: string;
  readonly className?: string;
}

/**
 * 10 `language-switch` [PROPOSED] — TS-001 D5.
 *
 * Structure: plain `<a>` links, one per configured language, each resolved
 * through `href()` — so `de` stays bare, `/en/…` carries the prefix, and the
 * English page keeps its own path segments. The links point at the
 * **equivalent** page, never at the home page.
 * States: none. No JavaScript, no dropdown, no detection UI — the language
 * is a choice the visitor makes, not something the site guesses from an IP.
 * Inherits: Label-mono, radius 999 as chips.
 * Space: fixed; the language set is known at build time.
 * A11y: `hreflang` and `lang` on each link, `aria-current="true"` on the
 * current language plus a filled chip, targets ≥ 44 px.
 */
export function LanguageSwitch({
  route,
  current,
  tone = "light",
  label,
  className,
}: LanguageSwitchProps) {
  const name = label ?? dictionary(current).footer.language;

  return (
    <nav
      aria-label={name}
      className={[styles.nav, tone === "dark" ? styles.dark : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <ul className={styles.list}>
        {LOCALES.map((locale) => (
          <li key={locale}>
            <a
              aria-current={locale === current ? "true" : undefined}
              className={locale === current ? styles.current : styles.link}
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
