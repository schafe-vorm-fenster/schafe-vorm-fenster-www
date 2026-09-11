import { Chip } from "../chip/chip";
import { isMocked, isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { Skeleton } from "../skeleton/skeleton";

import type { RouteId } from "@/src/lib/routes/routes";
import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./place-example-set.module.css";

export interface PlaceExample {
  readonly label: string;
  readonly to: RouteId;
  readonly query?: Readonly<Record<string, string | number | undefined>>;
}

export interface PlaceExampleSetProps extends DataStateProps {
  readonly examples: readonly PlaceExample[];
  /** Capped at 6 on `/deine-region`; 1 (the nearest active place) on `/dein-ort/starten`. */
  readonly max?: number;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 43 `place-example-set` [PROPOSED] — TS-008 pos 3, DEC-034.
 *
 * Structure: a small designed set of active example places — never a place
 * list, never an "alle Orte anzeigen" control. Rendered as `chip`s, capped at
 * `max`.
 * States (D-9, all four):
 *   loading  → a `skeleton` reserving the chip row;
 *   empty    → nothing — the module is absent from the DOM, no error
 *              styling, no retry (the surrounding block never collapses
 *              because `place-search` is static and stands beside it);
 *   degraded → the same designed set, still labelled as examples by the
 *              surrounding `live-module-frame`;
 *   mocked   → the set plus `demo-data-badge`, for the interim ranking.
 * Inherits: `chip` presentation, radius 999.
 * Space: a fixed chip count reserved before paint.
 * A11y: each example names its place in text.
 */
export function PlaceExampleSet({
  examples,
  max = 6,
  locale,
  state = "ready",
  className,
}: PlaceExampleSetProps) {
  const classes = [styles.set, className].filter(Boolean).join(" ");

  if (isPending(state)) {
    return <Skeleton className={classes} rows={1} variant="row" />;
  }

  if (state === "empty" || examples.length === 0) return null;

  const shown = examples.slice(0, max);

  return (
    <div className={classes}>
      {shown.map((example) => (
        <Chip key={example.label} locale={locale} query={example.query} to={example.to}>
          {example.label}
        </Chip>
      ))}
      {isMocked(state) ? <DemoDataBadge locale={locale} /> : null}
    </div>
  );
}
