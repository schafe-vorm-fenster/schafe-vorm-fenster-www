import { JobLinks, otherJobs } from "./job-links";

import { bandEntries } from "@/src/lib/content/context-band";

import type { ContentSlot } from "@/src/lib/content/types";
import type { NavEntry } from "@/src/lib/routes/navigation";
import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./context-band.module.css";

export interface ContextBandProps {
  /** This page's focus job — the one entry left out of the three shown. */
  readonly currentJob: NavEntry["label"];
  readonly locale?: Locale;
  /** The band's heading — the page's own kicker, from its `context-band` slot. */
  readonly heading?: string;
  /**
   * The page's `context-band` slot, where it has one: the blurb under each
   * job comes from its list items, and the registry fills what the slot does
   * not name (`src/lib/content/context-band.ts`, DEC-0120).
   */
  readonly slot?: ContentSlot;
  readonly className?: string;
}

/**
 * 47 `context-band` [PROPOSED] — content type 21, TS-WEB-0006 D5.
 *
 * Structure: one component, rendered by the layout on every page, filled
 * from the job registry as all four jobs minus this page's focus job — never
 * a hand-written list. Three entries, targets from `HEADER_JOBS` via
 * `route-link`; each entry a framed row carrying the job label, a blurb that
 * names audience and content together (CG-030) and an arrow (DEC-0120).
 * States: none of its own — it is static and identical at every
 * personalization stage (TS-WEB-0006 D8). A blurb that is not yet a CG-030
 * statement marks its row `data-demo="true"`.
 * Inherits: secondary treatment, never the primary; `paper` surface; no
 * `data-cta="primary"` inside it (TS-WEB-0006 D3).
 * Space: three rows under each other, each ≥ 44 px, stacked at every width.
 * A11y: a `nav` with an accessible name; three links, each naming its job
 * and, in the same link, what the target holds.
 */
export function ContextBand({
  currentJob,
  locale = "de",
  heading = "Heute mit einem anderen Anliegen hier?",
  slot,
  className,
}: ContextBandProps) {
  const jobs = otherJobs(currentJob);

  return (
    <nav
      aria-label={heading}
      className={[styles.band, className].filter(Boolean).join(" ")}
    >
      <p className={styles.heading}>{heading}</p>
      <JobLinks entries={bandEntries(jobs, locale, slot)} jobs={jobs} locale={locale} />
    </nav>
  );
}

export { otherJobs } from "./job-links";
