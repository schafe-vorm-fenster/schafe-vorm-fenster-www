import { RouteLink } from "../route-link/route-link";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { HEADER_JOBS, type NavEntry } from "@/src/lib/routes/navigation";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./context-band.module.css";

/**
 * The three non-focus jobs of a page — "all four jobs minus this page's
 * focus job", read off the one job registry (`HEADER_JOBS`) so it can never
 * drift out of sync (TS-006 D5, D9).
 */
export function otherJobs(currentJob: NavEntry["label"]): readonly NavEntry[] {
  return HEADER_JOBS.filter((entry) => entry.label !== currentJob);
}

export interface JobLinksProps {
  readonly jobs: readonly NavEntry[];
  readonly locale?: Locale;
  readonly className?: string;
}

/** The shared three-entry list markup — `context-band` and `closing-cta`'s merged mode render the same jobs and must not disagree (TS-006 D6). */
export function JobLinks({ jobs, locale = "de", className }: JobLinksProps) {
  const d = dictionary(locale);

  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")}>
      {jobs.map((entry) => (
        <li className={styles.item} key={entry.route}>
          <RouteLink locale={locale} to={entry.route}>
            {d.nav[entry.label]}
          </RouteLink>
        </li>
      ))}
    </ul>
  );
}
