import { FreshnessLabel, type FreshnessTier } from "../freshness-label/freshness-label";

import type { MechanismId } from "../content-fragments";
import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

import styles from "./scene-block.module.css";

export interface SceneBlockProps {
  /** Exactly one mechanism per block (TS-006 D7) — a second one is two blocks. */
  readonly mechanism: MechanismId;
  /** The opener, phrased as the visitor's own question. Also the block heading. */
  readonly opener: string;
  readonly body?: string;
  /** The concrete instance — a live module, an event row, or a proof card. */
  readonly instance: ReactNode;
  /** The instance's own freshness, if it comes from a live or cached source. */
  readonly freshnessTier?: FreshnessTier;
  readonly freshnessUpdatedAt?: string | Date;
  /** Secondary treatment only — the scene never carries the primary CTA. */
  readonly cta?: ReactNode;
  readonly locale?: Locale;
  readonly id?: string;
  readonly className?: string;
}

/**
 * 22 `scene-block` [PROPOSED] — content type 2 `scene`, TS-006 D7.
 *
 * Structure: three parts, always — the opener as the visitor's own question,
 * exactly one mechanism (declared, not inferred), and one concrete instance,
 * live or proof-backed. Its own CTA, where present, is secondary.
 * States: the block itself holds no late data — its instance does, and the
 * instance owns its own D-9 states. The scene never disappears; what can
 * degrade is the instance's freshness, shown here as `freshness-label`.
 * Inherits: no feature list ever stands in for the instance; alternating
 * COLOUR/PHOTO per rhythm is the page's job (`section-shell`), not this one.
 * Space: the instance declares its own ratio (typically `ratio-feature`).
 * A11y: the opener is the block heading — one mechanism, one heading, no
 * heading-level skip introduced by this component.
 */
export function SceneBlock({
  mechanism,
  opener,
  body,
  instance,
  freshnessTier,
  freshnessUpdatedAt,
  cta,
  locale,
  id,
  className,
}: SceneBlockProps) {
  return (
    <div className={[styles.scene, className].filter(Boolean).join(" ")} data-mechanism={mechanism} id={id}>
      <h2 className={styles.opener}>{opener}</h2>
      {body ? <p className={styles.body}>{body}</p> : null}
      <div className={styles.instance}>{instance}</div>
      {freshnessTier ? (
        <FreshnessLabel locale={locale} tier={freshnessTier} updatedAt={freshnessUpdatedAt} />
      ) : null}
      {cta ? <div className={styles.cta}>{cta}</div> : null}
    </div>
  );
}
