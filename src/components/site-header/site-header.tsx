import { dictionary } from "@/src/lib/i18n/dictionary";
import { HEADER_CALENDAR_ENTRY, HEADER_JOBS } from "@/src/lib/routes/navigation";

import { Button } from "../button/button";
import { Logo } from "../logo/logo";
import { RouteLink } from "../route-link/route-link";

import { HeaderMenu } from "./header-menu";
import { HeaderShell } from "./header-shell";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./site-header.module.css";

export interface SiteHeaderProps {
  /** The route the visitor is on, so the header can mark it. */
  readonly current?: RouteId;
  readonly locale?: Locale;
  /**
   * This page opens on a hero photograph (Jan's round-3 point 2). The header
   * then lies transparent on it — paper-coloured items over the hero's own
   * top scrim — and turns solid once the hero has scrolled past. A page
   * without a hero photograph passes `false` and the header is solid
   * throughout.
   */
  readonly overHero?: boolean;
  readonly className?: string;
}

/**
 * 8 `site-header` [PROPOSED] — TS-004 D4.
 *
 * Structure: the `logo` home, the four job labels, and the persistent
 * calendar entry as a `button`. Both lists come from
 * `src/lib/routes/navigation.ts` and every label from the dictionary — the
 * header holds no path and no string of its own (TS-004 D4, TS-001 D5/D7).
 * Its height is published as `--site-header-height` so `legal-section` can use
 * it for `scroll-margin-top` (TS-029 D3).
 * States: two, and both are chrome rather than data — the ground (transparent
 * over a hero photograph, solid once past it) and the phone disclosure (the
 * overlay open or closed). No loading, empty or error state, and identical at
 * every personalization stage (TS-006 D8). No role switcher, no audience tab,
 * no segmented entry: forbidden on every page (TS-006-A9).
 * Inherits: a flat surface, no shadow, no border but a hairline on the solid
 * ground; controls at radius 999; labels in Label-mono.
 * Space: the height is fixed and declared before paint. Over a hero the
 * header is `position: fixed`, so it reserves no space and turning solid
 * moves nothing.
 * A11y: one `header` landmark, one `nav` with an accessible name, targets
 * ≥ 44 px, and the current page marked with `aria-current` plus a fill —
 * never colour alone.
 *
 * **Disclosure [Jan's decision, round 3 point 3 — state/open.md rows 35 and
 * 201].** Until now the four job labels scrolled horizontally in
 * their row at phone widths, which showed one and a half labels of four and
 * hid the rest behind a sideways scroll nobody discovers. Below `md` the logo
 * now shows the mark alone, the four labels move into a full-screen overlay
 * behind a burger, and the calendar entry stays in the bar as a compact
 * icon-and-label pill. The wordmark returns at `md`; the inline labels return
 * at `xl`, which is the first breakpoint token at which four German job
 * labels fit a row beside the logo and the pill — Jan's wording says `md` and
 * the measurement says otherwise, which row 201 records. This is **one component tree** — every destination, label and
 * control exists in the markup at every width and the breakpoint changes only
 * which of them is disclosed — but it *is* a change of visible presence, which
 * TS-017 D2(d) as written does not allow and TS-004 D4 does not describe.
 * Jan's wording is the decision; the deviation is recorded, not silent.
 */
export function SiteHeader({
  current,
  locale = "de",
  overHero = false,
  className,
}: SiteHeaderProps) {
  const d = dictionary(locale);
  const route: RouteId = current ?? "home";

  return (
    <HeaderShell
      className={className}
      labels={{ open: d.nav.menuOpen, close: d.nav.menuClose, menu: d.nav.menuLabel }}
      menu={<HeaderMenu current={route} locale={locale} />}
      overHero={overHero}
      overlayBrand={<Logo className={styles.logo} compact locale={locale} />}
    >
      <Logo className={styles.logo} compact locale={locale} />
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
        icon="calendar-days"
        locale={locale}
        size="compact"
        to={HEADER_CALENDAR_ENTRY.route}
        variant="primary-light"
      >
        {d.nav[HEADER_CALENDAR_ENTRY.label]}
      </Button>
    </HeaderShell>
  );
}
