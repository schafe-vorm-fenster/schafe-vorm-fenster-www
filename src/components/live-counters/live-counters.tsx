import { Badge } from "../badge/badge";
import { isMocked, isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { Skeleton } from "../skeleton/skeleton";

import styles from "./live-counters.module.css";

export interface LiveCountersProps extends DataStateProps {
  /** No field in `/api/stats` today (Q-037) — omitted until it exists. */
  readonly places?: number;
  readonly dates?: number;
  /** No field in `/api/stats` today (Q-037) — omitted until it exists. */
  readonly updatesToday?: number;
  readonly placesLabel?: string;
  readonly datesLabel?: string;
  readonly updatesLabel?: string;
  readonly className?: string;
}

/**
 * 44 `live-counters` [PROPOSED] — TS-008 pos 4, D8.
 *
 * Structure: one band, up to three figure slots (places · dates · updates
 * today), each a fixed-height `badge` whose text is the figure and its label
 * in one readable string.
 * States (D-9, all four):
 *   loading  → three `skeleton` pills;
 *   empty    → nothing — a missing field is never a substitute or an
 *              estimate (WEB-F-041); cold cache hides the whole module,
 *              never a tier-3 snapshot;
 *   degraded → the same figures, tier labelled by the surrounding
 *              `live-module-frame`;
 *   mocked   → the figures plus `demo-data-badge` (Q-037, `state/open.md`
 *              row 6).
 * Inherits: mono type for the numbers; no static traction figure anywhere.
 * Space: the badge's fixed height means one digit → two digits never
 * reflows the row.
 * A11y: the figure and its label are one readable string, never colour-only.
 */
export function LiveCounters({
  places,
  dates,
  updatesToday,
  placesLabel = "Orte",
  datesLabel = "Termine",
  updatesLabel = "Aktualisierungen heute",
  state = "ready",
  className,
}: LiveCountersProps) {
  const classes = [styles.band, className].filter(Boolean).join(" ");

  if (isPending(state)) {
    return (
      <div className={classes}>
        <Skeleton variant="control" />
        <Skeleton variant="control" />
        <Skeleton variant="control" />
      </div>
    );
  }

  const figures: readonly { readonly value: number; readonly label: string }[] = [
    places !== undefined ? { value: places, label: placesLabel } : undefined,
    dates !== undefined ? { value: dates, label: datesLabel } : undefined,
    updatesToday !== undefined ? { value: updatesToday, label: updatesLabel } : undefined,
  ].filter((figure) => figure !== undefined);

  // Cold cache / nothing counted: hide the module entirely, never tier 3.
  if (figures.length === 0) return null;

  return (
    <div className={classes} data-demo={isMocked(state) ? "true" : undefined}>
      {figures.map((figure) => (
        <Badge icon="calendar-days" key={figure.label} tone="neutral">
          {figure.value.toLocaleString("de-DE")} {figure.label}
        </Badge>
      ))}
      {isMocked(state) ? <DemoDataBadge /> : null}
    </div>
  );
}
