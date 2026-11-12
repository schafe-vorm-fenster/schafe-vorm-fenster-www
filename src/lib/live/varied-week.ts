/**
 * The nearby module's selection — which five dates of the candidate set the
 * list shows (DEC-0185). A pure function: candidates and a clock in, rows
 * and the window they span out; no fetching, no cache, no request.
 *
 * Why it is not `src/lib/relevance/`: that engine ranks *items* that carry
 * clearance, a geo tier and a job relation (proof elements). A date has none
 * of those; what makes five dates a good week is how they differ from one
 * another. The two answer different questions and share nothing but the
 * rule that a selection is a function of its arguments.
 *
 * The rules, in the owner's words of 2026-10-28:
 *
 *  - the next 7 days, so the list fits its heading "Diese Woche in der Nähe";
 *    where fewer than five dates pass, 14 days;
 *  - different categories and different organisers;
 *  - one-offs before recurring dates, and **at most two** recurring;
 *  - on a tie of theme, culture (DEC-0210 — the preference lives in
 *    `event-preference.ts` and is shared with the home intro and position 1);
 *  - where fewer than five dates pass the rules, the list shows what passes —
 *    it never refills with a repeat of the same organiser.
 */

import { isRecurring, pickPreferred } from "./event-preference";
import { nearbyWindow, windowBounds, withinWindow } from "./widening";

import type { LiveEvent } from "./types";

export const VARIED_ROW_COUNT = 5;
export const MAX_RECURRING_ROWS = 2;
/** The widened window of DEC-0185 §2, in days. */
export const WIDENED_DAYS = 14;

export { isRecurring };

/**
 * Up to `count` dates from `candidates`, in start order — the shared
 * preference of DEC-0210 (`event-preference.ts`: one-offs first, themes mixed,
 * culture on a tie) plus this module's two limits: one date per organiser and
 * at most two recurring ones. A date with no organiser id counts as its own
 * organiser: nothing is known to repeat.
 */
export function pickVaried<T extends LiveEvent>(candidates: readonly T[], count = VARIED_ROW_COUNT): T[] {
  return pickPreferred(candidates, count, { distinctOrganisers: true, maxRecurring: MAX_RECURRING_ROWS });
}

export interface VariedWeek<T extends LiveEvent> {
  readonly events: T[];
  /** `week` while every row starts inside seven days — the heading follows it (CG-033). */
  readonly window: "week" | "upcoming";
}

/**
 * The week first; the fortnight where the week does not make five.
 *
 * "Does not make five" counts what *passes the rules*, not what exists: a
 * week of eight courses by one organiser is a thin week.
 */
export function pickVariedWeek<T extends LiveEvent>(
  candidates: readonly T[],
  now: Date,
  count = VARIED_ROW_COUNT,
): VariedWeek<T> {
  const week = pickVaried(withinWindow(candidates, "week", now), count);
  if (week.length >= count) return { events: week, window: "week" };

  const { from } = windowBounds("week", now);
  const fortnightEnd = from.getTime() + WIDENED_DAYS * 24 * 60 * 60 * 1000;
  const fortnight = pickVaried(
    candidates.filter((event) => {
      const starts = new Date(event.startsAt).getTime();
      return starts >= from.getTime() && starts < fortnightEnd;
    }),
    count,
  );
  // Never fewer than the week alone gave.
  const events = fortnight.length >= week.length ? fortnight : week;
  return { events, window: nearbyWindow(events, now) };
}
