import { MediaFrame } from "../media-frame/media-frame";

import type { DataState } from "../data-state";
import type { ReactNode } from "react";

import styles from "./feature-benefit.module.css";

export interface FeatureBenefitProps {
  readonly feature: string;
  readonly benefit: string;
  /** An inline `proof-card` or similar, where the claim has one. */
  readonly proofRef?: ReactNode;
  readonly mediaSrc?: string;
  readonly mediaAlt?: string;
  readonly mediaState?: DataState;
  readonly className?: string;
}

/**
 * 28 `feature-benefit` [PROPOSED] — content type 8 `feature-benefit`,
 * TS-026 block 5.
 *
 * Structure: feature ↔ what it does for you, with an optional `proof_ref`.
 * Carries "what the enterprise licence adds" on `/deine-region`: territory
 * cut, map view, white-label registration, `custom-data-integration` as the
 * add-on — each an instance of this component, not a variant of it.
 * States: an unshippable claim is removed at the content layer, not rendered
 * qualified — this component has no state of its own beyond its optional
 * media, which carries its own D-9 states via `media-frame`.
 * Inherits: never a checkmark grid; `ratio-feature` media where present; no
 * price — that is `price-tag`'s job, never typed here.
 * Space: the media ratio is declared before the asset arrives.
 * A11y: the feature and its benefit are readable in linear order, not two
 * columns that only make sense side by side.
 */
export function FeatureBenefit({
  feature,
  benefit,
  proofRef,
  mediaSrc,
  mediaAlt = "",
  mediaState,
  className,
}: FeatureBenefitProps) {
  return (
    <div className={[styles.pair, className].filter(Boolean).join(" ")}>
      {mediaSrc !== undefined || mediaState ? (
        <MediaFrame alt={mediaAlt} className={styles.media} ratio="feature" src={mediaSrc} state={mediaState} />
      ) : null}
      <h3 className={styles.feature}>{feature}</h3>
      <p className={styles.benefit}>{benefit}</p>
      {proofRef ? <div className={styles.proof}>{proofRef}</div> : null}
    </div>
  );
}
