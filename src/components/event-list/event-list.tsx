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

/**
 * How many rows a list of this **role** shows — polish brief G-2, and the
 * only three numbers this website uses.
 *
 * A list that illustrates is three rows; a list that *is* the answer to the
 * visitor's question may be five; a list standing inside a story is one,
 * because one real date makes the point and three make a list. Nothing shows
 * more than five, ever. Eleven rows across three modules before the home
 * page's first argument was what this replaces.
 */
export const EVENT_LIST_CAPS = {
  illustrative: 3,
  answering: 5,
  story: 1,
} as const;

export type EventListRole = keyof typeof EVENT_LIST_CAPS;

export interface EventListProps extends DataStateProps {
  readonly items: readonly EventListItem[];
  /** The fixed row count the module promises (3 at position 1, 5 at position 2). */
  readonly rowCount: number;
  /**
   * The list's role, which fixes its row count (G-2). Where it is set it wins
   * over a larger `rowCount`: the module may have asked its source for more
   * dates than it is allowed to print, and the rest live behind `more`. The
   * skeleton reserves the capped count too, so nothing moves when the data
   * lands.
   */
  readonly role?: EventListRole;
  /**
   * The quiet affordance under a capped list — "Mehr Termine im Kalender von
   * {ort}" (G-2). Never a second CTA, and never rendered where the cap hides
   * nothing: a list that already shows everything it has has nothing to link
   * on to.
   */
  readonly more?: ReactNode;
  /**
   * `true` caps the list at three rows on a phone and lets all `rowCount`
   * rows show from the tablet breakpoint up — the illustrative cap a live
   * list on a marketing page carries, with the rest behind the module's own
   * calendar link. CSS-only, so it holds in a prerendered page and costs no
   * layout shift.
   */
  readonly capOnPhone?: boolean;
  /** The conversion state for zero results — never an empty list (TS-008 D4). */
  readonly emptyState?: ReactNode;
  /** `dark` inside the ink section that carries the live data — forwarded to every row. */
  readonly tone?: "light" | "dark";
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
  role,
  more,
  capOnPhone = false,
  emptyState,
  tone,
  locale,
  state = "ready",
  className,
}: EventListProps) {
  const limit = role ? Math.min(rowCount, EVENT_LIST_CAPS[role]) : rowCount;
  const capped = capOnPhone && limit > 3;
  const classes = [styles.list, capped ? styles.capPhone : undefined, className]
    .filter(Boolean)
    .join(" ");

  if (isPending(state)) {
    return <Skeleton className={classes} rows={limit} variant="row" />;
  }

  if (state === "empty" || items.length === 0) {
    return <>{emptyState ?? null}</>;
  }

  const shown = items.slice(0, limit);
  const rows = (
    <div className={classes}>
      {shown.map((item, index) => (
        <EventRow
          {...item}
          key={item.id ?? `${item.title}-${index}`}
          locale={locale}
          state={state}
          tone={tone}
        />
      ))}
    </div>
  );

  if (!more || items.length <= shown.length) return rows;

  return (
    <div className={styles.withMore}>
      {rows}
      {more}
    </div>
  );
}
