import { isPending, type DataStateProps } from "../data-state";
import { EventRow, type EventCategory } from "../event-row/event-row";
import { Skeleton } from "../skeleton/skeleton";

import type { RouteId } from "@/src/lib/routes/routes";
import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

import styles from "./event-list.module.css";

export interface EventListItem {
  readonly id?: string;
  readonly date: string | Date;
  readonly title: string;
  readonly meta?: string;
  readonly category: EventCategory;
  readonly categoryLabel: string;
  readonly to?: RouteId;
}

export interface EventListProps extends DataStateProps {
  readonly items: readonly EventListItem[];
  /** The fixed row count the module promises (3 at position 1, 5 at position 2). */
  readonly rowCount: number;
  /** The conversion state for zero results — never an empty list (TS-008 D4). */
  readonly emptyState?: ReactNode;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 42 `event-list` [PROPOSED] — TS-008 pos 1 / 2.
 *
 * Structure: `event-row`s inside a `live-module-frame` — position 1 the next
 * 3 dates of the known place, position 2 the 5 dates this week nearby, each
 * row naming its own place in its `meta` line.
 * States (D-9, all four):
 *   loading  → `skeleton` at exactly `rowCount` rows, no animation;
 *   empty    → the caller's `emptyState` (the conversion state) — never an
 *              empty list;
 *   degraded → the rows render their snapshot unchanged, tier labelled by the
 *              surrounding `live-module-frame`;
 *   mocked   → the rows render dummy data, each carrying `data-demo`.
 * Inherits: category colours from the table; hairline between rows, 76 px
 * each.
 * Space: the skeleton renders exactly `rowCount` rows before the data
 * arrives, which is where the CLS risk lives (`skeleton`'s own contract);
 * once real rows render, their own fixed 76 px height is the only geometry
 * that matters.
 * A11y: a list of `event-row`s; the date stays readable text in every row.
 */
export function EventList({
  items,
  rowCount,
  emptyState,
  locale,
  state = "ready",
  className,
}: EventListProps) {
  const classes = [styles.list, className].filter(Boolean).join(" ");

  if (isPending(state)) {
    return <Skeleton className={classes} rows={rowCount} variant="row" />;
  }

  if (state === "empty" || items.length === 0) {
    return <>{emptyState ?? null}</>;
  }

  return (
    <div className={classes}>
      {items.map((item, index) => (
        <EventRow
          {...item}
          key={item.id ?? `${item.title}-${index}`}
          locale={locale}
          state={state}
        />
      ))}
    </div>
  );
}
