import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { isMocked, isPending, type DataStateProps } from "../data-state";
import { FreshnessLabel, type FreshnessTier } from "../freshness-label/freshness-label";
import { Skeleton } from "../skeleton/skeleton";

import type { ReactNode } from "react";

import styles from "./live-module-frame.module.css";

export interface LiveModuleFrameProps extends DataStateProps {
  /** The full heading, already naming its own radius — "in <place>", "in der Umgebung", "im Kreis <county>". */
  readonly title: string;
  readonly subline?: string;
  /** An onward action beside the module — never the primary CTA of the page. */
  readonly cta?: ReactNode;
  /** `true` where arriving content changes the page's meaning (the `/dein-ort` focus-job shift). */
  readonly announced?: boolean;
  readonly updatedAt?: string | Date;
  /** Which fallback tier `degraded` renders — `stale` (cached) or `snapshot` (build-time). */
  readonly tier?: Extract<FreshnessTier, "stale" | "snapshot">;
  /** Overrides the default loading placeholder, built from this same frame's geometry. */
  readonly skeleton?: ReactNode;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * 40 `live-module-frame` [PROPOSED] — content type 19, TS-008, TS-009.
 *
 * Structure: the shell every live module stands in — the title naming its own
 * radius, an optional subline, the module body, an optional onward `cta`. A
 * widened module never presents itself as the narrower one; that is why the
 * radius lives in the title text, not in a separate badge.
 * States (D-9, all four):
 *   loading  → `skeleton`, built from this same frame so header and body
 *              never drift apart;
 *   empty    → the children render the module's own declared conversion —
 *              the frame adds no box, no styling of its own;
 *   degraded → the last cached answer plus `freshness-label` ("Stand: …") or
 *              the build-time snapshot ("Beispiel") — never a spinner, never
 *              an error sentence, never a retry control;
 *   mocked   → the children's dummy data plus `demo-data-badge` in the header,
 *              so the badge is not repeated inside the body.
 * Inherits: radius 0; stands in the `ink` section that carries the live data,
 * once per page.
 * Space: declares the module's final geometry before the data arrives; a
 * skeleton older than ~2 s is the caller's decision to replace, not this
 * component's.
 * A11y: the loading placeholder is `aria-hidden`; where `announced` is set the
 * frame is a `role="status"` region, announced once.
 */
export function LiveModuleFrame({
  title,
  subline,
  cta,
  announced = false,
  updatedAt,
  tier = "stale",
  skeleton,
  state = "ready",
  className,
  children,
}: LiveModuleFrameProps) {
  return (
    <div
      className={[styles.frame, className].filter(Boolean).join(" ")}
      data-demo={isMocked(state) ? "true" : undefined}
      role={announced ? "status" : undefined}
    >
      <header className={styles.header}>
        <div className={styles.heading}>
          <h3 className={styles.title}>{title}</h3>
          {subline ? <p className={styles.subline}>{subline}</p> : null}
        </div>
        <div className={styles.marks}>
          {isMocked(state) ? <DemoDataBadge /> : null}
          {state === "degraded" ? <FreshnessLabel tier={tier} updatedAt={updatedAt} /> : null}
        </div>
      </header>
      <div className={styles.body}>
        {isPending(state) ? (skeleton ?? <Skeleton rows={3} variant="row" />) : children}
      </div>
      {cta ? <div className={styles.cta}>{cta}</div> : null}
    </div>
  );
}
