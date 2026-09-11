import { Badge } from "../badge/badge";

export interface StepIndicatorProps {
  readonly step: number;
  readonly total: number;
  /** Overrides the generated "Schritt n von total" text, for `en`. */
  readonly label?: string;
  readonly className?: string;
}

/**
 * 53 `step-indicator` [PROPOSED] — TS-023 D8, TS-025 D2.
 *
 * Structure: a kicker `badge` ("Schritt 2 von 3" / "… von 4"), reserved
 * height, above the step's heading.
 * States: static per step — the step itself travels in the URL
 * (`schritt=` on `/dein-kalender/bestellen`), which this component does not
 * read; the caller passes `step`/`total` already resolved.
 * Inherits: badge radius 999, mono 12/700.
 * Space: reserved so it cannot shift the layout between steps.
 * A11y: the step count is text; the caller moves focus to the new step's
 * heading after each advance (a page-composition responsibility).
 */
export function StepIndicator({ step, total, label, className }: StepIndicatorProps) {
  return (
    <Badge className={className} tone="neutral">
      {label ?? `Schritt ${step} von ${total}`}
    </Badge>
  );
}
