import { Badge } from "../badge/badge";

import styles from "./empty-proof-slot.module.css";

export interface EmptyProofSlotProps {
  /** What is missing, in one sentence — never backfilled with a substitute. */
  readonly sentence: string;
  readonly badgeLabel?: string;
  readonly className?: string;
}

/**
 * 32 `empty-proof-slot` [PROPOSED] — content type 11 `empty-proof-slot`,
 * TS-027 D5.
 *
 * Structure: the placeholder hatch at `ratio-proof` with a label badge and
 * one sentence naming what is missing.
 * States: terminal, not transitional — it is not a `skeleton`, it does not
 * animate, and it is identical before and after hydration. It weakens the
 * claim it stands beside; it never shortens a `proof-stream` by design.
 * Inherits: the hatch tokens; the placeholder badge pair.
 * Space: `ratio-proof`, identical to a filled `proof-card`.
 * A11y: real content with its label and sentence in the accessibility tree,
 * never `aria-hidden` — the gap is part of the argument, not decoration.
 */
export function EmptyProofSlot({
  sentence,
  badgeLabel = "Kein Nachweis",
  className,
}: EmptyProofSlotProps) {
  return (
    // `data-empty-proof` makes the honest gap countable from outside — the
    // selection's positions are cards *and* gaps, and SRC-001 §4 is about the
    // count (DEC-048), not about how many cards happen to be cleared.
    <div
      className={[styles.slot, className].filter(Boolean).join(" ")}
      data-empty-proof="true"
    >
      <div className={styles.content}>
        <Badge tone="placeholder">{badgeLabel}</Badge>
        <p className={styles.sentence}>{sentence}</p>
      </div>
    </div>
  );
}
