import { type BadgeTone } from "../badge/badge";
import { isMocked, isPending, type DataState, type DataStateProps } from "../data-state";
import { EventStatusBadge, type EventStatus } from "../event-status-badge/event-status-badge";
import { Icon, type IconName } from "../icon/icon";
import { RouteLink } from "../route-link/route-link";
import { Skeleton } from "../skeleton/skeleton";

import { formatEventDay } from "./format";

import type { LinkOptions } from "../route-link/href";
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
  /**
   * One status **beside** the category, never instead of it (SRC-0014
   * §Event-status badge). It sits on the title's line, right-aligned; the
   * category keeps the meta's line. DEC-0115 put it on the row rather than
   * beside it, so a status can never be composed without its category.
   */
  readonly status?: EventStatus;
  /** Overrides the dictionary's status word — content-authored, per locale. */
  readonly statusLabel?: string;
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
 * The glyph each category shows in its bare, phone-width form — brand
 * `categoryDisplay.listRow`, "bare 24px icon in the category colour", under
 * the rule "icon and colour always together; the label is always present".
 *
 * Every entry is the design system's own role → glyph assignment
 * (`concept/website-design-system.md` §Icons), not a fresh choice: culture is
 * "Culture, stage" → `theater` (`landmark` is taken, by "Municipality,
 * council, office", which is what `official` is), merchants is "Merchants,
 * delivery routes" → `shopping-basket`, social is "Community, association" →
 * `users`, and `neighbouring` is the neighbouring *place* → `map-pin`.
 */
const CATEGORY_ICON: Record<EventCategory, IconName> = {
  fest: "party-popper",
  merchants: "shopping-basket",
  culture: "theater",
  official: "landmark",
  social: "users",
  neighbouring: "map-pin",
};

/**
 * 5 `event-row` [FIXED] — SRC-0014 §Event row.
 *
 * Structure: a flat row with a hairline above, 76 px tall — mono day number
 * at 28 px with the month beneath, the title at 21/700, the meta at 15 px
 * clamped to one line, and the category badge right-aligned. Never a card.
 *
 * The four parts are a **grid**, not a three-column flex row, and the badge
 * sits on the meta's line rather than the title's. As a flex sibling of the
 * title it took 126 px of a 358 px row on a phone, leaving the title 148 px —
 * so "Feuerwehrfest am Gerätehaus" needed two lines, "Line-Dance-Gruppe im
 * Gemeindehaus" three, and the row measured 102 px against the design
 * system's 76 (polish brief G-2). The title now spans the full column, which
 * is the width the desktop always had and where the same titles have always
 * rendered in one line.
 *
 * The badge then starved the **meta** instead. "BILDUNG & GESUNDHEIT" is
 * 244 px of a 358 px row at 390 px wide: 52 px of date and two 16 px gaps
 * later the meta had 30 px and rendered "An…", and three of the nine rows on
 * `/dein-ort?ort=17390` measured 94 px rather than 76. A category may not
 * cost the visitor the place and the time, so below `md` the row takes the
 * brand package's own list-row form of a category (`categoryDisplay.listRow`,
 * "bare 24px icon in the category colour"): 24 px of glyph instead of 244 px
 * of pill, the label still in the accessibility tree, and the whole rest of
 * the line for the meta. From `md` the pill returns unchanged — the desktop
 * row always had room for it.
 * States (D-9, all four):
 *   loading  → the row's own geometry as a `skeleton`, no animation;
 *   empty    → nothing. A single row cannot be empty; the list around it owns
 *              the publisher invitation, which is a conversion, not a gap;
 *   degraded → the row renders its snapshot unchanged; the module's
 *              `freshness-label` says "Stand: …". No error sentence here;
 *   mocked   → the row renders stand-in data and carries its module's
 *              `data-demo` marking (`live-module-frame`); nothing is written
 *              on the row itself (Jan, 2026-09-18).
 * Inherits: category fill/text pairs from the table only; radius 999 on the
 * badge, 0 everywhere else; no border but the hairline.
 * Space: fixed 76 px, both clamps enforced in CSS.
 * A11y: the date is a `<time datetime>`; the category is words at every
 * width — visually a glyph plus its colour on the phone, drawn text from
 * `md`, but the same text node in the accessibility tree either way, so the
 * category is never colour alone; the whole row is one link target when `to`
 * is given.
 */
export function EventRow({
  date,
  title,
  meta,
  category,
  categoryLabel,
  status,
  statusLabel,
  to,
  tone = "light",
  state = "ready",
  locale,
  query,
  hash,
  className,
}: EventRowProps) {
  const toneClass = tone === "dark" ? styles.dark : styles.light;
  const classes = [styles.row, toneClass, className].filter(Boolean).join(" ");

  if (isPending(state)) {
    // The skeleton brings the row's 76 px geometry itself and must not
    // inherit the row's grid — its bars carry no grid areas, so they would
    // land in implicit rows and reserve nearly twice the height the real row
    // finally takes, which is the layout shift the skeleton exists to avoid.
    return (
      <Skeleton
        className={[toneClass, className].filter(Boolean).join(" ")}
        rows={1}
        variant="row"
      />
    );
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
    <article
      className={classes}
      data-demo={isMocked(state) ? "true" : undefined}
      data-status={status}
    >
      <time className={styles.date} dateTime={iso}>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>{month}</span>
      </time>
      <h3 className={styles.title}>{title_}</h3>
      {status ? (
        /* On the title's line so the category keeps the meta's; the title
           gives up the status column only when there is a status
           (`.row[data-status] .title`), so a row without one is the row it
           always was. */
        <EventStatusBadge
          className={styles.status}
          ground={tone === "dark" ? "ink" : "paper"}
          label={statusLabel}
          locale={locale}
          status={status}
        />
      ) : null}
      {meta ? <p className={styles.meta}>{meta}</p> : null}
      {/* One element, two widths (SRC-0014's mobile-first rule: `min-width`
          queries only, one component tree). On the phone it is the bare
          24 px glyph of `categoryDisplay.listRow` and the label is read but
          not drawn; from `md` the same element is the badge the design
          system's §Event row asks for, glyph hidden, label visible. The
          label exists in the markup at every width — it is the category's
          accessible name in both forms. */}
      <span className={styles.category} data-tone={CATEGORY_TONE[category]}>
        <Icon className={styles.categoryIcon} name={CATEGORY_ICON[category]} size={24} />
        <span className={styles.categoryLabel}>{categoryLabel}</span>
      </span>
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
