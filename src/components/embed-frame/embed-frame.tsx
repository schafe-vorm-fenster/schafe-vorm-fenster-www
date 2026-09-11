import { isMocked, isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { FreshnessLabel } from "../freshness-label/freshness-label";
import { Skeleton } from "../skeleton/skeleton";

import type { MediaRatio } from "../media-frame/media-frame";
import type { CSSProperties, ReactNode } from "react";

import styles from "./embed-frame.module.css";

export interface EmbedFrameProps extends DataStateProps {
  /** States the radius it is actually showing — never "your place" until Q-026. */
  readonly heading: string;
  readonly copy?: string;
  readonly cta?: ReactNode;
  /** The organizer the loader would target — set once Q-046 mints one (mocked here). */
  readonly organizerId?: string;
  readonly ratio?: MediaRatio;
  readonly className?: string;
}

/**
 * 45 `embed-frame` [PROPOSED] — TS-008 D6, DEC-030.
 *
 * Structure: the real Portalize widget's mount, loaded deferred and never
 * render-blocking (wired in M4, behind this same interface). The heading
 * states the radius/filter it is actually showing.
 * States (D-9, all four):
 *   loading  → the reserved box as a `skeleton` at `ratio`;
 *   empty    → loader blocked or failing (D6): the heading, `copy` and `cta`
 *              stay, no box at all, no error sentence, no empty frame;
 *   degraded → the reference organizer, unfiltered, labelled as an example
 *              via `freshness-label` ("Beispiel") — never "your place" while
 *              the place-filter parameter (Q-026) is open;
 *   mocked   → the reserved box plus `demo-data-badge`, dummy `organizerId`.
 * Inherits: violet embed frame, radius 0.
 * Space: the container declares its height before the loader runs, so the
 * page never reflows.
 * A11y: the copy and CTA stay reachable regardless of the widget's state; the
 * widget itself may use a shadow root the page does not reach into (checked
 * where it is actually mounted, M4).
 */
export function EmbedFrame({
  heading,
  copy,
  cta,
  organizerId,
  ratio = "map",
  state = "ready",
  className,
}: EmbedFrameProps) {
  const classes = [styles.frame, className].filter(Boolean).join(" ");
  const showBox = !isPending(state) && state !== "empty";

  return (
    <div className={classes}>
      <div className={styles.copyBlock}>
        <h3 className={styles.heading}>{heading}</h3>
        {copy ? <p className={styles.copy}>{copy}</p> : null}
        {state === "degraded" ? <FreshnessLabel tier="snapshot" /> : null}
        {cta ? <div className={styles.cta}>{cta}</div> : null}
      </div>
      {isPending(state) ? (
        <Skeleton ratio={ratio} variant="box" />
      ) : showBox ? (
        <div
          className={styles.mount}
          data-portalize-organizer-id={organizerId}
          style={{ "--embed-ratio": `var(--ratio-${ratio})` } as CSSProperties}
        >
          {isMocked(state) ? <DemoDataBadge className={styles.badge} /> : null}
        </div>
      ) : null}
    </div>
  );
}
