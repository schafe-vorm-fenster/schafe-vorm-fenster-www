import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./event-status-badge.module.css";

/** The three statuses of SRC-0014 §Event-status badge, in the table's order. */
export const EVENT_STATUSES = ["neu", "verschoben", "abgesagt"] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

/**
 * The ground the badge stands on. Only `verschoben` cares: its fill is
 * `paper`, so on a paper ground it takes the 1 px `line` hairline that is one
 * of the design system's three named border exceptions. On `ink` the paper
 * fill is its own edge.
 */
export type EventStatusGround = "paper" | "ink";

export interface EventStatusBadgeProps {
  readonly status: EventStatus;
  readonly ground?: EventStatusGround;
  /** The page's language — the words come from the dictionary. */
  readonly locale?: Locale;
  /** Overrides the dictionary word, for content-authored wording. */
  readonly label?: string;
  readonly className?: string;
}

/**
 * `event-status-badge` — SRC-0014 §Event-status badge,
 * `specs/contracts/design-system-contract.md` (`neu` · `verschoben` ·
 * `abgesagt`).
 *
 * Structure: a badge — mono 15 px / 700, radius 999, 26 px tall — carrying
 * one of three status words. A status is not a category: a row carries it
 * **beside** its category badge, never instead of it (`event-row`'s
 * `status` prop puts it there).
 * States: none of its own. The three statuses are the three fill/text pairs
 * the brand tokens ship (`--color-status-event-*`), measured there: neu
 * 10.20:1, verschoben 16.56:1, abgesagt 6.31:1.
 * Inherits: badge geometry; the `verschoben` hairline on a paper ground is
 * a `line` hairline, the one way a paper badge has an edge.
 * Space: badge height, fixed — a status appearing on a row does not move it.
 * A11y: the status is a word in the accessibility tree, never colour alone.
 * The English words are a translation nobody wrote, so in that language the
 * badge carries `data-demo="true"` (DEC-0115, state/open.md row 215).
 */
export function EventStatusBadge({
  status,
  ground = "paper",
  locale = "de",
  label,
  className,
}: EventStatusBadgeProps) {
  const words = dictionary(locale).eventStatus;
  const classes = [styles.badge, styles[status], className].filter(Boolean).join(" ");

  return (
    <span
      className={classes}
      data-demo={label === undefined && words.generated ? "true" : undefined}
      data-ground={ground}
      data-status={status}
    >
      {label ?? words[status]}
    </span>
  );
}
