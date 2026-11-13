import { Icon, type IconName } from "../icon/icon";
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

/**
 * The glyph in each card's icon well, one per job (SRC-0014 §Page chrome
 * revised 2026-10-12 → Context band, issue #39: "Icons aus dem Lucide-Set,
 * z. B. `map-pin`, `monitor`, `users`"). Keyed by the job, so a page's band
 * shows the same glyph for the same job wherever it appears.
 */
export const JOB_ICONS: Readonly<Record<string, IconName>> = {
  knowWhatIsOn: "map-pin",
  publishDates: "megaphone",
  yourCalendar: "monitor",
  whyUs: "users",
};

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
 * Each entry is a link card (DEC-0156, owner's design of 2026-10-12, issue
 * #39): a pill with a 40 px icon well on the left, the job label in bold with
 * the blurb beneath (CG-030), and a 44 px `ink` disc carrying a `lime-500`
 * arrow on the right. The whole card is the link and the target. A blurb that
 * is not yet a CG-030 statement puts `data-demo="true"` on its card.
 */
export function JobLinks({ jobs, locale = "de", entries, className }: JobLinksProps) {
  const d = dictionary(locale);
  const rows = entries ?? bandEntries(jobs, locale);

  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")}>
      {rows.map((entry) => (
        <li className={styles.item} key={entry.route}>
          <RouteLink
            className={styles.card}
            data-band-card=""
            data-demo={entry.demo ? "true" : undefined}
            locale={locale}
            styled={false}
            to={entry.route}
          >
            <span aria-hidden="true" className={styles.well} data-band-well="">
              <Icon name={JOB_ICONS[entry.label] ?? "arrow-right"} size={24} />
            </span>
            <span className={styles.text}>
              <span className={styles.label} data-band-label="">
                {d.nav[entry.label]}
              </span>
              <span className={styles.blurb} data-band-blurb="">
                {entry.blurb}
              </span>
            </span>
            <span aria-hidden="true" className={styles.disc} data-band-disc="">
              <Icon name="arrow-right" size={24} />
            </span>
          </RouteLink>
        </li>
      ))}
    </ul>
  );
}
