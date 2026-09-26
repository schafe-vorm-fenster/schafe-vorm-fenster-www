import styles from "./empty-proof-slot.module.css";

export interface EmptyProofSlotProps {
  /**
   * The label badge of TS-WEB-0027 D5 — "a label badge and one sentence naming
   * what is missing". Passed together with `sentence`; without both the slot
   * stays the silent panel every other surface renders.
   */
  readonly label?: string;
  /** The one sentence naming the gap, in the visitor's own terms (D5). */
  readonly sentence?: string;
  /** `true` marks label and sentence `data-demo="true"` — words nobody wrote. */
  readonly demo?: boolean;
  readonly className?: string;
}

/**
 * 32 `empty-proof-slot` [PROPOSED] — content type 11 `empty-proof-slot`,
 * TS-WEB-0027 D5.
 *
 * Structure: the position a cleared `proof-card` will take. Two forms:
 *
 *  - **named** (`label` + `sentence`) — the placeholder hatch of the design
 *    system at `ratio-proof`, with the label badge and the one sentence D5
 *    asks for. D5's accessibility row is explicit: "real content, not
 *    decoration: it is in the accessibility tree with its label and sentence,
 *    never `aria-hidden`". The owner's note of 2026-09-18 removed both, and
 *    the amended spec supersedes it (DEC-0104, DEC-0132 §3);
 *  - **silent** (neither) — the flat brand-colour panel the other four proof
 *    surfaces render, where no determination asks for words.
 *
 * States: terminal, not transitional — it is not a `skeleton`, it does not
 * animate, and it is identical before and after hydration.
 * Inherits: `--placeholder-hatch` and the placeholder register's ground and
 * text in the named form (`--placeholder-ground` / `--placeholder-text`,
 * 6.0:1 at badge size); `--color-neutral-surface2` in the silent one.
 * Space: `ratio-proof` in the named form, identical to a filled `proof-card`;
 * the silent panel keeps the same ratio.
 * A11y: the named form is announced with its two strings; the silent form has
 * no text and no role and stays `aria-hidden`, so a reader is not sent
 * through an empty region.
 */
export function EmptyProofSlot({ label, sentence, demo, className }: EmptyProofSlotProps) {
  const named = label !== undefined && sentence !== undefined;
  const marking = demo ? "true" : undefined;

  if (!named) {
    return (
      // `data-empty-proof` makes the gap countable from outside — the
      // selection's positions are cards *and* gaps, and SRC-0001 §4 is about the
      // count (DEC-0048), not about how many cards happen to be cleared.
      <div
        aria-hidden="true"
        className={[styles.slot, className].filter(Boolean).join(" ")}
        data-empty-proof="true"
      />
    );
  }

  return (
    <div
      className={[styles.slot, styles.named, className].filter(Boolean).join(" ")}
      data-empty-proof="true"
    >
      <p className={styles.label} data-demo={marking}>
        {label}
      </p>
      <p className={styles.sentence} data-demo={marking}>
        {sentence}
      </p>
    </div>
  );
}
