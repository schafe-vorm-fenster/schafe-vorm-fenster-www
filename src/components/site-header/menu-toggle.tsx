import styles from "./site-header.module.css";

export interface MenuToggleProps {
  /** `burger` is the three stripes, `close` the same three crossed into an X. */
  readonly variant: "burger" | "close";
  /** The accessible name — "Menü öffnen" / "Menü schließen", from the dictionary. */
  readonly label: string;
  readonly onClick: () => void;
  readonly className?: string;
  readonly "aria-expanded"?: boolean;
  readonly "aria-controls"?: string;
}

/**
 * The phone header's disclosure control — Jan's round-3 point 3.
 *
 * Structure: three stripes in a radius-999 touch target of at least 44 px
 * (SRC-014 §Shape and Space). The `close` variant draws the same three, the
 * middle one gone and the outer two crossed.
 * States: none of its own; the header's state machine owns open/closed.
 * Inherits: radius 999, no border, no shadow, the shell's focus ring.
 * Space: a fixed square, so the bar's height is known before paint.
 * A11y: a real `<button type="button">` with `aria-expanded` and
 * `aria-controls` on the bar instance; the stripes are decorative boxes with
 * no text, so the name comes from `aria-label` in the page's own language.
 * The burger→X movement is a CSS animation that plays when the overlay's own
 * instance mounts, and `prefers-reduced-motion` removes it (`base.css`). It
 * is a second movement beside SRC-014 §Motion's one — recorded in
 * `state/open.md`, on Jan's instruction.
 */
export function MenuToggle({
  variant,
  label,
  onClick,
  className,
  "aria-expanded": expanded,
  "aria-controls": controls,
}: MenuToggleProps) {
  return (
    <button
      aria-controls={controls}
      aria-expanded={expanded}
      aria-label={label}
      className={[styles.toggle, className].filter(Boolean).join(" ")}
      data-shape={variant}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className={styles.stripes}>
        <span className={styles.stripe} />
        <span className={styles.stripe} />
        <span className={styles.stripe} />
      </span>
    </button>
  );
}
