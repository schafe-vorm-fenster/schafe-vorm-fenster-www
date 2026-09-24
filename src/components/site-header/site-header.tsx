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
   * This page opens on a hero photograph (Jan's round-3 point 2, re-cut by
   * his round-4 change request). The header then lies **completely
   * transparent** on it — no scrim, no hairline, the items straight on the
   * photograph, each carrying its own 44 px control well where it is not
   * already a filled control — and turns solid once the hero has scrolled
   * past. A page without a hero photograph passes `false` and the header is
   * solid throughout.
   */
  readonly overHero?: boolean;
  readonly className?: string;
}

/**
 * 8 `site-header` [PROPOSED] — TS-WEB-0004 D4.
 *
 * Structure: the `logo` home, the four job labels, and the persistent
 * calendar entry as a `button`. Both lists come from
 * `src/lib/routes/navigation.ts` and every label from the dictionary — the
 * header holds no path and no string of its own (TS-WEB-0004 D4, TS-WEB-0001 D5/D7).
 * Its height is published as `--site-header-height` so `legal-section` can use
 * it for `scroll-margin-top` (TS-WEB-0029 D3).
 * States: two, and both are chrome rather than data — the ground (transparent
 * over a hero photograph, solid once past it) and the phone disclosure (the
 * overlay open or closed). No loading, empty or error state, and identical at
 * every personalization stage (TS-WEB-0006 D8). No role switcher, no audience tab,
 * no segmented entry: forbidden on every page (TS-WEB-0006-A9).
 * Inherits: a flat surface, no shadow and no border in either state (SRC-0014
 * §Shape and Space: "Borders and shadows: none" — surface contrast does the
 * dividing); controls at radius 999; labels in Label-mono.
 *
 * **The transparent ground [Jan's change request, round 4 — state/open.md
 * row 200].** Round 3 painted the header its own ink top scrim and read
 * paper items off it. Jan's finding on that preview: over the hero the bar
 * must be *completely* transparent, the photograph uninterrupted. So the
 * scrim and the hairline are gone and the contrast is per element instead:
 * the burger sits in a 44 px control well, the four desktop labels share one
 * well, the calendar pill is already a filled control, the logo carries its
 * own white ground, and the wordmark — paper text, which no well can save
 * without a third dark shape in the bar — stands down over the photograph in
 * favour of the mark alone. Every number is measured per pixel against the
 * generated hero renditions in use, at 360 and 1280, on all six hero pages.
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
 * TS-WEB-0017 D2(d) as written does not allow and TS-WEB-0004 D4 does not describe.
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
