import { dictionary } from "@/src/lib/i18n/dictionary";
import { HEADER_JOBS } from "@/src/lib/routes/navigation";

import { LanguageSwitch } from "../language-switch/language-switch";
import { RouteLink } from "../route-link/route-link";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./site-header.module.css";

export interface HeaderMenuProps {
  readonly current: RouteId;
  readonly locale: Locale;
}

/**
 * What the phone overlay lists — Jan's round-3 point 3.
 *
 * The four jobs the bar reads (`src/lib/routes/navigation.ts`) plus the
 * language switch the footer already carries. The calendar entry is not
 * repeated: its destination is the first job, "Was ist los" (DEC-0189). So
 * the overlay adds no destination of its own and no string of its own: it is
 * a second *disclosure*
 * of the header inventory, not a second navigation model (TS-WEB-0004 D4).
 *
 * Server-rendered and handed to `header-shell` as a prop, so opening the
 * overlay costs no request and no client-side route table.
 */
export function HeaderMenu({ current, locale }: HeaderMenuProps) {
  const d = dictionary(locale);

  return (
    <>
      <nav aria-label={d.nav.menuLabel} className={styles.menuNav}>
        <ul className={styles.menuList}>
          {HEADER_JOBS.map((entry, index) => (
            <li key={entry.route}>
              <RouteLink
                className={styles.menuLink}
                current={entry.route === current}
                // The overlay's first focus target; `header-shell` moves
                // focus here once `showModal()` has run.
                data-menu-first={index === 0 ? "true" : undefined}
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

      <div className={styles.menuLanguageRow}>
        <LanguageSwitch current={locale} route={current} tone="glass" />
      </div>
    </>
  );
}
