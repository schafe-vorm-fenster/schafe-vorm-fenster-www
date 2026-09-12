import { dictionary } from "@/src/lib/i18n/dictionary";
import { HEADER_CALENDAR_ENTRY, HEADER_JOBS } from "@/src/lib/routes/navigation";

import { Button } from "../button/button";
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
 * The same two inventories the bar reads (`src/lib/routes/navigation.ts`) plus
 * the language switch the footer already carries, so the overlay adds no
 * destination of its own and no string of its own: it is a second *disclosure*
 * of the header inventory, not a second navigation model (TS-004 D4).
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

      <Button
        className={styles.menuCta}
        icon="calendar-days"
        locale={locale}
        to={HEADER_CALENDAR_ENTRY.route}
        // The overlay is an ink ground, so the calendar entry takes the
        // design system's "primary on dark" pair (SRC-014 §Button).
        variant="primary-dark"
      >
        {d.nav[HEADER_CALENDAR_ENTRY.label]}
      </Button>

      <LanguageSwitch
        className={styles.menuLanguage}
        current={locale}
        route={current}
        tone="dark"
      />
    </>
  );
}
