import { Badge } from "../badge/badge";

/**
 * The availability levels of a hub record. Anything other than
 * `generally-available` is labelled on the surface that offers it.
 */
export const AVAILABILITY = ["generally-available", "beta", "alpha", "planned"] as const;

export type Availability = (typeof AVAILABILITY)[number];

export interface StatusBadgeProps {
  readonly availability: Availability;
  /** The words shown. Defaults are German; `en` pages pass their own. */
  readonly label?: string;
  readonly className?: string;
}

const DEFAULT_LABELS: Record<Availability, string> = {
  "generally-available": "",
  beta: "Beta · noch nicht überall",
  alpha: "Alpha · noch nicht verlässlich",
  planned: "Geplant",
};

/**
 * 62 `status-badge` [PROPOSED] — TS-022 D4.
 *
 * Structure: the availability badge on a mechanism whose hub record is not
 * `generally-available` — today `website-import`, which is alpha.
 * States: rendered while the record says so. It is removed when the record
 * changes, never by a copy decision — which is why the component returns
 * nothing for `generally-available` instead of taking a boolean.
 * Inherits: badge geometry; the placeholder pair for "not yet dependable",
 * never a category colour — an availability is not an event category.
 * Space: badge height, reserved.
 * A11y: the badge text says what it claims; not colour-only.
 */
export function StatusBadge({ availability, label, className }: StatusBadgeProps) {
  if (availability === "generally-available") return null;

  return (
    <Badge className={className} tone="placeholder">
      {label ?? DEFAULT_LABELS[availability]}
    </Badge>
  );
}
