import { dictionary } from "@/src/lib/i18n/dictionary";
import { HEADER_CALENDAR_ENTRY, HEADER_JOBS } from "@/src/lib/routes/navigation";

import { Button } from "../button/button";
import { Logo } from "../logo/logo";
import { RouteLink } from "../route-link/route-link";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./site-header.module.css";

export interface SiteHeaderProps {
  /** The route the visitor is on, so the header can mark it. */
  readonly current?: RouteId;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 8 `site-header` [PROPOSED] — TS-004 D4.
 *
 * Structure: the `logo` home, the four job labels, and the persistent
 * calendar entry as a `button`. Both lists come from
 * `src/lib/routes/navigation.ts` and every label from the dictionary — the
 * header holds no path and no string of its own (TS-004 D4, TS-001 D5/D7).
 * Sticky, with its height published as `--site-header-height` so
 * `legal-section` can use it for `scroll-margin-top` (TS-029 D3).
 * States: static, no data — no loading, empty or error state — and identical
 * at every personalization stage (TS-006 D8). No role switcher, no audience
 * tab, no segmented entry: forbidden on every page (TS-006-A9).
 * Inherits: a flat surface, no shadow, no border but a hairline; controls at
 * radius 999; labels in Label-mono.
 * Space: the height is fixed and declared before paint.
 * A11y: one `header` landmark, one `nav` with an accessible name, targets
 * ≥ 44 px, and the current page marked with `aria-current` plus a fill —
 * never colour alone. Below the lg switch point the four labels scroll
 * horizontally inside their row rather than collapsing into a toggle: one
 * component tree at every width (TS-017 D2(d)), and no menu to open.
 */
export function SiteHeader({ current, locale = "de", className }: SiteHeaderProps) {
  const d = dictionary(locale);

  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")}>
      <div className={`container ${styles.inner}`}>
        <Logo className={styles.logo} locale={locale} />
        <nav aria-label={d.nav.home} className={styles.nav}>
          <ul className={styles.list}>
            {HEADER_JOBS.map((entry) => (
              <li key={entry.route}>
                <RouteLink
                  className={styles.job}
                  current={entry.route === current}
                  locale={locale}
                  styled={false}
                  to={entry.route}
                >
                  {d.nav[entry.label]}
                </RouteLink>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          className={styles.cta}
          locale={locale}
          size="compact"
          to={HEADER_CALENDAR_ENTRY.route}
          variant="primary-light"
        >
          {d.nav[HEADER_CALENDAR_ENTRY.label]}
        </Button>
      </div>
    </header>
  );
}
