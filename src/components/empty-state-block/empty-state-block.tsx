import type { ReactNode } from "react";

import styles from "./empty-state-block.module.css";

export interface EmptyStateBlockProps {
  /** Names the place — resolved text, already escaped by the caller. */
  readonly headline: string;
  readonly lead?: string;
  /** The shifted conversion, `register-as-publisher` (TS-008 D4). */
  readonly cta: ReactNode;
  readonly fallbackNote?: string;
  /** `true` where this occupies the module slot and the frame's own `role="status"` is not already announcing it. */
  readonly announced?: boolean;
  /** The one `himbeere` element per screen this block is allowed to spend. */
  readonly pulse?: boolean;
  readonly className?: string;
}

/**
 * 46 `empty-state-block` [PROPOSED] — content type 20, TS-020 D2, TS-008 D4.
 *
 * Structure: headline naming the place · lead · `cta` · fallback note. On
 * `/dein-ort` state B it occupies the module slot and the focus job shifts
 * (`register-as-publisher` → `/mitmachen`); on `/` S3 it stands beside the
 * nearby module and the shift stays a link.
 * States: it *is* the empty state — no `state` prop, because there is
 * nothing to be pending or mocked about it. No empty box, no error styling,
 * no retry, no spinner.
 * Inherits: `himbeere` is the empty-place pulse — exactly one per screen, so
 * `pulse` defaults to `true` and a caller that already spent the budget
 * elsewhere on the same screen sets it `false`.
 * Space: occupies the same reserved geometry as the dates module it replaces
 * (the caller's `live-module-frame`), so A↔B is not a layout change.
 * A11y: announced once — through this block's own `role="status"` unless the
 * caller's frame already carries one (`announced={false}` then).
 */
export function EmptyStateBlock({
  headline,
  lead,
  cta,
  fallbackNote,
  announced = true,
  pulse = true,
  className,
}: EmptyStateBlockProps) {
  return (
    <div
      className={[styles.block, pulse ? styles.pulse : undefined, className]
        .filter(Boolean)
        .join(" ")}
      role={announced ? "status" : undefined}
    >
      <p className={styles.headline}>{headline}</p>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
      <div className={styles.cta}>{cta}</div>
      {fallbackNote ? <p className={styles.note}>{fallbackNote}</p> : null}
    </div>
  );
}
