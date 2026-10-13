import { JobLinks, otherJobs } from "./job-links";

import { bandEntries } from "@/src/lib/content/context-band";
import { dictionary } from "@/src/lib/i18n/dictionary";

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
 * a hand-written list. A heading with a mono kicker ("Auch interessant") to
 * its right, below it on the phone; three entries, targets from `HEADER_JOBS`
 * via `route-link`; each entry a pill-shaped link card with an icon well, the
 * job label, a blurb that names audience and content together (CG-030) and
 * an `ink` arrow disc (DEC-0120, DEC-0156 — the owner's design of 2026-10-12).
 * States: none of its own — it is static and identical at every
 * personalization stage (TS-WEB-0006 D8). A blurb that is not yet a CG-030
 * statement marks its row `data-demo="true"`.
 * Inherits: secondary treatment, never the primary; `paper` cards on the
 * `surface` ground; no `data-cta="primary"` inside it (TS-WEB-0006 D3).
 * Space: one card per row on the phone, two per row from `lg`, three in one
 * row from `xl`; every card ≥ 44 px high.
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
  const kicker = dictionary(locale).contextBand.kicker;

  return (
    <nav
      aria-label={heading}
      className={[styles.band, className].filter(Boolean).join(" ")}
    >
      <div className={styles.head}>
        {/* A `p`, not an `h2`: the line is a question, and CG-005 keeps
            questions out of section titles (`e2e/copy-structure.spec.ts`).
            It looks like a heading and names the `nav` (DEC-0156). */}
        <p className={styles.heading}>{heading}</p>
        <p className={styles.kicker}>{kicker}</p>
      </div>
      <JobLinks entries={bandEntries(jobs, locale, slot)} jobs={jobs} locale={locale} />
    </nav>
  );
}

export { otherJobs } from "./job-links";
