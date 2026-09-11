import { Button, type ButtonVariant } from "../button/button";
import { JobLinks, otherJobs } from "../context-band/job-links";

import type { LinkOptions } from "../route-link/href";
import type { RouteId } from "@/src/lib/routes/routes";
import type { NavEntry } from "@/src/lib/routes/navigation";
import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./closing-cta.module.css";

/** Every variant but `pulse` — `/dein-kalender` repeats its goal here, never Pulse (TS-006 D6). */
export type ClosingCtaButtonVariant = Exclude<ButtonVariant, "pulse">;

export interface ClosingCtaRepeatProps extends LinkOptions {
  readonly variant?: "repeat";
  readonly to: RouteId;
  readonly label: string;
  readonly buttonVariant?: ClosingCtaButtonVariant;
  readonly reassurance?: string;
  readonly className?: string;
}

export interface ClosingCtaMergedProps {
  readonly variant: "merged";
  /** The page's focus job — `primaryConversion: null` pages merge the band and the closing block into the same three-job offer (TS-006 D6). */
  readonly currentJob: NavEntry["label"];
  readonly heading?: string;
  readonly locale?: Locale;
  readonly className?: string;
}

export type ClosingCtaProps = ClosingCtaRepeatProps | ClosingCtaMergedProps;

/**
 * 48 `closing-cta` [PROPOSED] — content type 22, TS-006 D6.
 *
 * Structure: the last block. `repeat` mode is identical to the primary
 * conversion — same goal, same target, same label — plus its reassurance.
 * `merged` mode is the three-job offer, on `primaryConversion: null` pages
 * (27, 28), rendered once, sharing `context-band`'s job list so the two can
 * never disagree.
 * States: none of its own.
 * Inherits: `button` primary in `repeat` mode, **never pulse** (Pulse occurs
 * exactly once, in the focus block). Reassurance in Meta, only where a
 * cleared backing exists — otherwise omitted, not softened.
 * Space: fixed height.
 * A11y: never `data-cta="primary"` — that marker belongs to block 1 alone.
 */
export function ClosingCta(props: ClosingCtaProps) {
  if (props.variant === "merged") {
    const { currentJob, heading = "Was suchst du sonst noch?", locale = "de", className } = props;
    return (
      <div className={[styles.merged, className].filter(Boolean).join(" ")}>
        <p className={styles.heading}>{heading}</p>
        <JobLinks jobs={otherJobs(currentJob)} locale={locale} />
      </div>
    );
  }

  const { to, label, buttonVariant = "primary-light", reassurance, locale, query, hash, className } =
    props;

  return (
    <div className={[styles.repeat, className].filter(Boolean).join(" ")}>
      <Button hash={hash} locale={locale} query={query} to={to} variant={buttonVariant}>
        {label}
      </Button>
      {reassurance ? <p className={styles.reassurance}>{reassurance}</p> : null}
    </div>
  );
}
