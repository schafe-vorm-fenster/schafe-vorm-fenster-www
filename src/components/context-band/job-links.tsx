import { Icon } from "../icon/icon";
import { RouteLink } from "../route-link/route-link";

import { bandEntries } from "@/src/lib/content/context-band";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { HEADER_JOBS, type NavEntry } from "@/src/lib/routes/navigation";

import type { ContextBandEntry } from "@/src/lib/content/context-band";
import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./context-band.module.css";

/**
 * The three non-focus jobs of a page — "all four jobs minus this page's
 * focus job", read off the one job registry (`HEADER_JOBS`) so it can never
 * drift out of sync (TS-WEB-0006 D5, D9).
 */
export function otherJobs(currentJob: NavEntry["label"]): readonly NavEntry[] {
  return HEADER_JOBS.filter((entry) => entry.label !== currentJob);
}

export interface JobLinksProps {
  readonly jobs: readonly NavEntry[];
  readonly locale?: Locale;
  /**
   * The jobs with their blurbs, where the caller read the page's own band
   * slot (`bandEntries()`); left out, the registry fallback stands in.
   */
  readonly entries?: readonly ContextBandEntry[];
  readonly className?: string;
}

/**
 * The shared three-entry list markup — `context-band` and `closing-cta`'s
 * merged mode render the same jobs and must not disagree (TS-WEB-0006 D6).
 *
 * Each entry is a menu-like row (DEC-0120, review R-home-32): a framed
 * 44 px target with the job label, the blurb naming audience and content
 * together (CG-030) and an arrow — so the band reads as the navigation
 * element it is, not as half a line of links. A blurb that is not yet a
 * CG-030 statement puts `data-demo="true"` on its row.
 */
export function JobLinks({ jobs, locale = "de", entries, className }: JobLinksProps) {
  const d = dictionary(locale);
  const rows = entries ?? bandEntries(jobs, locale);

  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")}>
      {rows.map((entry) => (
        <li className={styles.item} key={entry.route}>
          <RouteLink
            className={styles.row}
            data-demo={entry.demo ? "true" : undefined}
            locale={locale}
            styled={false}
            to={entry.route}
          >
            <span className={styles.text}>
              <span className={styles.label}>{d.nav[entry.label]}</span>
              <span className={styles.blurb}>{entry.blurb}</span>
            </span>
            <Icon className={styles.arrow} name="arrow-right" size={24} />
          </RouteLink>
        </li>
      ))}
    </ul>
  );
}
