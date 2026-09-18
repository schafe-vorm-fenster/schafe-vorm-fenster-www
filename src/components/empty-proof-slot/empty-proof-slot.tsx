import styles from "./empty-proof-slot.module.css";

export interface EmptyProofSlotProps {
  readonly className?: string;
}

/**
 * 32 `empty-proof-slot` [PROPOSED] — content type 11 `empty-proof-slot`,
 * TS-027 D5.
 *
 * Structure: a flat brand-colour panel at `ratio-proof`, holding the
 * position a cleared `proof-card` will take. It says nothing about itself:
 * Jan's decision of 2026-09-18 removed the "Kein Nachweis" badge and its
 * sentence from every rendered page. The gap stays countable through
 * `data-empty-proof`, and the clearance register in `state/open.md` remains
 * the go-live checklist.
 * States: terminal, not transitional — it is not a `skeleton`, it does not
 * animate, and it is identical before and after hydration.
 * Inherits: `--color-neutral-surface2`.
 * Space: `ratio-proof`, identical to a filled `proof-card`.
 * A11y: no text and no role — `aria-hidden`, so a reader is not sent through
 * an empty region.
 */
export function EmptyProofSlot({ className }: EmptyProofSlotProps) {
  return (
    // `data-empty-proof` makes the gap countable from outside — the
    // selection's positions are cards *and* gaps, and SRC-001 §4 is about the
    // count (DEC-048), not about how many cards happen to be cleared.
    <div
      aria-hidden="true"
      className={[styles.slot, className].filter(Boolean).join(" ")}
      data-empty-proof="true"
    />
  );
}
