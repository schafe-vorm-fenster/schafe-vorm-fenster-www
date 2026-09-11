import { JobLinks, otherJobs } from "./job-links";

import type { NavEntry } from "@/src/lib/routes/navigation";
import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./context-band.module.css";

export interface ContextBandProps {
  /** This page's focus job — the one entry left out of the three shown. */
  readonly currentJob: NavEntry["label"];
  readonly locale?: Locale;
  /** The offer's phrasing — placeholder copy until the content phase. */
  readonly heading?: string;
  readonly className?: string;
}

/**
 * 47 `context-band` [PROPOSED] — content type 21, TS-006 D5.
 *
 * Structure: one component, rendered by the layout on every page, filled
 * from the job registry as all four jobs minus this page's focus job — never
 * a hand-written list. Three entries, targets from `HEADER_JOBS` via
 * `route-link`.
 * States: none of its own — it is static and identical at every
 * personalization stage (TS-006 D8).
 * Inherits: secondary treatment, never the primary; `paper` surface; no
 * `data-cta="primary"` inside it (TS-006 D3).
 * Space: three equal entries, fixed height.
 * A11y: a `nav` with an accessible name; three links, each naming its job.
 */
export function ContextBand({
  currentJob,
  locale = "de",
  heading = "Heute mit einem anderen Anliegen hier?",
  className,
}: ContextBandProps) {
  return (
    <nav
      aria-label={heading}
      className={[styles.band, className].filter(Boolean).join(" ")}
    >
      <p className={styles.heading}>{heading}</p>
      <JobLinks jobs={otherJobs(currentJob)} locale={locale} />
    </nav>
  );
}

export { otherJobs } from "./job-links";
