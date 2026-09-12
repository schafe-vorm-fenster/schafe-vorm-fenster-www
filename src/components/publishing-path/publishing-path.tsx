import { MediaFrame } from "../media-frame/media-frame";
import { StatusBadge, type Availability } from "../status-badge/status-badge";

import type { MechanismId, Step } from "../content-fragments";
import type { DataState } from "../data-state";
import type { ReactNode } from "react";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./publishing-path.module.css";

export interface PublishingPathProps {
  /** One mechanism per block — `whatsapp` · `calendar-connection` · `website-import`. */
  readonly mechanism: MechanismId;
  readonly headline: string;
  readonly steps: readonly Step[];
  /** Present only where the hub record is not `generally-available`. */
  readonly availability?: Availability;
  /** Overrides the badge's default (German) wording — content-authored, per locale. */
  readonly availabilityLabel?: string;
  readonly mediaSrc?: string;
  readonly mediaAlt?: string;
  readonly mediaState?: DataState;
  /** The image does not depict what the copy claims — the placeholder badge. */
  readonly mediaNotDepicting?: boolean;
  /** `data-placeholder` on the frame, so a build can enumerate what is still a stand-in. */
  readonly mediaPlaceholderId?: string;
  /**
   * The page's language — `media-frame` badges itself and reads it. Without
   * it the three paths on `/en/take-part` hatched "Foto gesucht" (F-2-33).
   */
  readonly locale?: Locale;
  readonly cta?: ReactNode;
  readonly className?: string;
}

/**
 * 25 `publishing-path` [PROPOSED] — content type 5 `publishing-path`,
 * TS-022 D4.
 *
 * Structure: one mechanism per block, `Step` items inside — index, title,
 * body, hint, status badge. Three instances stand on `/mitmachen`, ordered
 * whatsapp · calendar-connection · website-import.
 * States: a path whose hub record is not `generally-available` renders
 * `status-badge` and may not be presented as dependable — the badge is
 * driven by `availability`, never by a copy decision.
 * Inherits: `ratio-feature` for its media; step numbers in Label-mono;
 * radius 0 for the block, 999 for anything tappable inside a step's hint.
 * Space: the media ratio is declared before the asset arrives; the step list
 * is static content.
 * A11y: an ordered list for the steps; the badge text is read, not implied
 * by colour.
 */
export function PublishingPath({
  mechanism,
  headline,
  steps,
  availability,
  availabilityLabel,
  mediaSrc,
  mediaAlt = "",
  mediaState,
  mediaNotDepicting,
  mediaPlaceholderId,
  locale,
  cta,
  className,
}: PublishingPathProps) {
  return (
    <div className={[styles.path, className].filter(Boolean).join(" ")} data-mechanism={mechanism}>
      <div className={styles.header}>
        <h3 className={styles.headline}>{headline}</h3>
        {availability ? (
          <StatusBadge availability={availability} label={availabilityLabel} />
        ) : null}
      </div>
      {mediaSrc !== undefined || mediaState ? (
        <MediaFrame
          alt={mediaAlt}
          className={styles.media}
          locale={locale}
          notDepicting={mediaNotDepicting}
          placeholderId={mediaPlaceholderId}
          ratio="feature"
          src={mediaSrc}
          state={mediaState}
        />
      ) : null}
      <ol className={styles.steps}>
        {steps.map((step) => (
          <li className={styles.step} key={step.index}>
            <span className={styles.index}>{String(step.index).padStart(2, "0")}</span>
            <div>
              <p className={styles.stepTitle}>{step.title}</p>
              <p className={styles.stepBody}>{step.body}</p>
              {step.hint ? <p className={styles.hint}>{step.hint}</p> : null}
            </div>
          </li>
        ))}
      </ol>
      {cta ? <div className={styles.cta}>{cta}</div> : null}
    </div>
  );
}
