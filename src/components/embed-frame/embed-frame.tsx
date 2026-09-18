import { isMocked, isPending, type DataStateProps } from "../data-state";
import { Skeleton } from "../skeleton/skeleton";

import { PortalizeMount } from "./portalize-mount";

import { DEFAULT_WEEKS_AHEAD } from "@/src/lib/embed/portalize";

import type { MediaRatio } from "../media-frame/media-frame";
import type { CSSProperties, ReactNode } from "react";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./embed-frame.module.css";

export interface EmbedFrameProps extends DataStateProps {
  /** States the radius it is actually showing — never "your place" until Q-026. */
  readonly heading: string;
  readonly copy?: string;
  readonly cta?: ReactNode;
  /**
   * The public organizer id of the calendar to embed. With one, the real
   * Portalize loader mounts a real calendar here; without one, the frame
   * reserves the box and stays empty, which is what a page with no calendar
   * to show renders.
   */
  readonly organizerId?: string;
  /** The mount's DOM id — the Portalize loader refuses an element without one. */
  readonly mountId?: string;
  /** The widget's own category filter. On by default, as upstream has it. */
  readonly showFilter?: boolean;
  /** The organizer's logo/claim header. Off: this page carries its own brand. */
  readonly showBranding?: boolean;
  /** How far ahead the widget looks; the loader's own default is 13 weeks. */
  readonly weeksAhead?: number;
  /**
   * What the embed is actually set to, as key and value — authored beside
   * the copy, so a visitor reads the settings rather than guessing at them
   * (TS-024 D5: the frame says what it is showing).
   */
  readonly config?: readonly { readonly key: string; readonly value: string }[];
  /** The settings list's own heading, from the same slot. */
  readonly configLabel?: string;
  readonly ratio?: MediaRatio;
  /**
   * Kept in the interface so every page composes the frame the same way;
   * the mount itself renders no words of its own any more (Jan, 2026-09-18).
   */
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 45 `embed-frame` [PROPOSED] — TS-008 D6, DEC-030.
 *
 * Structure: the real Portalize widget's mount, injected lazily and never
 * render-blocking (`portalize-mount.tsx`). The heading states the filter it
 * is actually showing.
 * States (D-9, all four):
 *   loading  → the reserved box as a `skeleton` at `ratio`;
 *   empty    → loader blocked or failing (D6): the heading, `copy` and `cta`
 *              stay, no box at all, no error sentence, no empty frame;
 *   degraded → the reference organizer, unfiltered, labelled as an example
 *              via `freshness-label` ("Beispiel") — never "your place" while
 *              the place-filter parameter (Q-026) is open;
 *   mocked   → the reserved box plus `demo-data-badge`, dummy `organizerId`.
 * Inherits: violet embed frame, radius 0.
 * Space: the box declares a fixed height before the loader runs and the
 * widget scrolls inside it, so neither the config fetch nor the events fetch
 * moves anything below — the page never reflows.
 * A11y: the copy and CTA stay reachable regardless of the widget's state; the
 * widget itself may use a shadow root the page does not reach into (checked
 * where it is actually mounted, M4).
 */
export function EmbedFrame({
  heading,
  copy,
  cta,
  organizerId,
  mountId = "schafe-vorm-fenster-portalize-widget",
  showFilter = true,
  showBranding = false,
  weeksAhead = DEFAULT_WEEKS_AHEAD,
  config,
  configLabel,
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
        {cta ? <div className={styles.cta}>{cta}</div> : null}
      </div>
      {isPending(state) ? (
        <Skeleton ratio={ratio} variant="box" />
      ) : showBox ? (
        <div
          className={styles.box}
          data-demo={isMocked(state) ? "true" : undefined}
          style={{ "--embed-ratio": `var(--ratio-${ratio})` } as CSSProperties}
        >
          {organizerId === undefined ? null : (
            <PortalizeMount
              className={styles.mount}
              id={mountId}
              organizerId={organizerId}
              showBranding={showBranding}
              showFilter={showFilter}
              weeksAhead={weeksAhead}
            />
          )}
        </div>
      ) : null}
      {config === undefined || config.length === 0 ? null : (
        <div>
          {configLabel ? <h4 className={styles.configHeading}>{configLabel}</h4> : null}
          <dl className={styles.config}>
            {config.map(({ key, value }) => (
              <div className={styles.configRow} key={key}>
                <dt className={styles.configKey}>{key}</dt>
                <dd className={styles.configValue}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
