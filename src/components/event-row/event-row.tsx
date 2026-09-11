import { Badge, type BadgeTone } from "../badge/badge";
import { isMocked, isPending, type DataState, type DataStateProps } from "../data-state";
import { RouteLink } from "../route-link/route-link";
import { Skeleton } from "../skeleton/skeleton";

import { formatEventDay } from "./format";

import type { LinkOptions } from "../route-link/href";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./event-row.module.css";

/** The six categories of the design system, in the order of its own table. */
export const EVENT_CATEGORIES = [
  "fest",
  "merchants",
  "culture",
  "official",
  "social",
  "neighbouring",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export interface EventRowProps extends DataStateProps, LinkOptions {
  /** ISO date or `Date`; read in `Europe/Berlin`. */
  readonly date: string | Date;
  readonly title: string;
  /** One line: time, place, organiser. Clamped, so the row height never moves. */
  readonly meta?: string;
  readonly category: EventCategory;
  readonly categoryLabel: string;
  /** Where the row leads, through the route facade. Optional: a row may be flat. */
  readonly to?: RouteId;
  /** `dark` is the ink section that carries the live data once per page. */
  readonly tone?: "light" | "dark";
  readonly className?: string;
}

const CATEGORY_TONE: Record<EventCategory, BadgeTone> = {
  fest: "fest",
  merchants: "merchants",
  culture: "culture",
  official: "official",
  social: "social",
  neighbouring: "neighbouring",
};

/**
 * 5 `event-row` [FIXED] — SRC-014 §Event row.
 *
 * Structure: a flat row with a hairline above, 76 px tall — mono day number
 * at 28 px with the month beneath, the title at 21/700 clamped to two lines,
 * the meta at 15 px clamped to one, and the category badge right-aligned.
 * Never a card.
 * States (D-9, all four):
 *   loading  → the row's own geometry as a `skeleton`, no animation;
 *   empty    → nothing. A single row cannot be empty; the list around it owns
 *              the publisher invitation, which is a conversion, not a gap;
 *   degraded → the row renders its snapshot unchanged; the module's
 *              `freshness-label` says "Stand: …". No error sentence here;
 *   mocked   → the row renders dummy data and carries the `Demo-Daten`
 *              marking of its module (`live-module-frame`), so the badge is
 *              not repeated per row — `data-demo` marks the row for the check.
 * Inherits: category fill/text pairs from the table only; radius 999 on the
 * badge, 0 everywhere else; no border but the hairline.
 * Space: fixed 76 px, both clamps enforced in CSS.
 * A11y: the date is a `<time datetime>`; the category is words, not colour;
 * the whole row is one link target when `to` is given.
 */
export function EventRow({
  date,
  title,
  meta,
  category,
  categoryLabel,
  to,
  tone = "light",
  state = "ready",
  locale,
  query,
  hash,
  className,
}: EventRowProps) {
  const classes = [styles.row, tone === "dark" ? styles.dark : styles.light, className]
    .filter(Boolean)
    .join(" ");

  if (isPending(state)) {
    return <Skeleton className={classes} rows={1} variant="row" />;
  }
  if (state === "empty") return null;

  const { day, month, iso } = formatEventDay(date, locale);

  const title_ = to ? (
    <RouteLink hash={hash} locale={locale} query={query} styled={false} to={to}>
      {title}
    </RouteLink>
  ) : (
    title
  );

  return (
    <article className={classes} data-demo={isMocked(state) ? "true" : undefined}>
      <time className={styles.date} dateTime={iso}>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>{month}</span>
      </time>
      <div className={styles.body}>
        <h3 className={styles.title}>{title_}</h3>
        {meta ? <p className={styles.meta}>{meta}</p> : null}
      </div>
      <Badge className={styles.category} tone={CATEGORY_TONE[category]}>
        {categoryLabel}
      </Badge>
    </article>
  );
}

/** The states this component renders itself — the gallery check reads it. */
export const EVENT_ROW_STATES: readonly DataState[] = [
  "ready",
  "loading",
  "empty",
  "degraded",
  "mocked",
];
