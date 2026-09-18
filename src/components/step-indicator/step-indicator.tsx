import styles from "./step-indicator.module.css";

export interface StepIndicatorProps {
  readonly step: number;
  readonly total: number;
  /** The full sentence — "Schritt 2 von 3" / "Step 2 of 3". The caller's, per locale. */
  readonly label?: string;
  /**
   * The flow is over: every dot is filled and none is marked current, so the
   * handover screen reads finished rather than as a fourth question.
   */
  readonly complete?: boolean;
  readonly className?: string;
}

/**
 * 53 `step-indicator` [PROPOSED] — TS-023 D8, TS-025 D2.
 *
 * Structure: one dot per step, the reached ones filled, the current one
 * marked — mono, 26 px, above the step's heading. The polish brief replaced
 * the bare "Schritt 1 von 3" badge with it: a badge says where you are, a row
 * of dots also says **how much is left**, which is the question a visitor at
 * the first field of an unfamiliar flow is actually asking.
 * States: static per step — the step itself travels in the URL
 * (`schritt=` on `/dein-kalender/bestellen`), which this component does not
 * read; the caller passes `step`/`total` already resolved.
 * Inherits: mono 12/700; `lime-800` for what is done, the neutral line for
 * what is not. Never colour alone — the sentence is in the accessible name.
 * Space: reserved so it cannot shift the layout between steps.
 * A11y: the dots are decorative (`aria-hidden`); the same sentence the badge
 * used to show is the group's accessible label and is announced on each step.
 * The caller moves focus to the new step's heading after each advance (a
 * page-composition responsibility).
 */
export function StepIndicator({
  step,
  total,
  label,
  complete = false,
  className,
}: StepIndicatorProps) {
  const sentence = label ?? `Schritt ${step} von ${total}`;
  const dots = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <p
      aria-label={sentence}
      className={[styles.row, className].filter(Boolean).join(" ")}
      data-step={step}
      role="group"
    >
      <span aria-hidden className={styles.dots}>
        {dots.map((index) => (
          <span
            className={[
              styles.dot,
              complete || index < step ? styles.done : undefined,
              !complete && index === step ? styles.current : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
            key={index}
          >
            {index}
          </span>
        ))}
      </span>
      <span className={styles.label}>{sentence}</span>
    </p>
  );
}
