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
 *  - some dates that are not recurring ones, and **at most two** recurring;
 *  - where fewer than five dates pass the rules, the list shows what passes —
 *    it never refills with a repeat of the same organiser.
 */

import { byStart, nearbyWindow, windowBounds, withinWindow } from "./widening";

import type { LiveEvent } from "./types";

export const VARIED_ROW_COUNT = 5;
export const MAX_RECURRING_ROWS = 2;
/** The widened window of DEC-0185 §2, in days. */
export const WIDENED_DAYS = 14;

/** `occurrence` values of the events-api that are not a one-off date. */
const NOT_ONCE = new Set(["recurring", "series", "openinghours", "schedule"]);

export function isRecurring(event: Pick<LiveEvent, "occurrence">): boolean {
  return event.occurrence !== undefined && NOT_ONCE.has(event.occurrence);
}

/**
 * Up to `count` dates from `candidates`, in start order.
 *
 * Greedy and deterministic: each round takes, among the dates whose organiser
 * is not yet on the list (and, while two recurring ones stand, only one-offs),
 * the one whose category is least represented so far — then a one-off over a
 * recurring one, then the earliest start, then the id. A date with no
 * organiser id counts as its own organiser: nothing is known to repeat.
 */
export function pickVaried<T extends LiveEvent>(candidates: readonly T[], count = VARIED_ROW_COUNT): T[] {
  const pool = [...new Map(byStart(candidates).map((event) => [event.id, event])).values()];
  const chosen: T[] = [];
  const organisers = new Set<string>();
  const categories = new Map<string, number>();
  let recurring = 0;

  while (chosen.length < count) {
    let best: T | undefined;
    let bestKey: readonly [number, number] | undefined;
    for (const event of pool) {
      if (chosen.includes(event)) continue;
      if (event.organizerId !== undefined && organisers.has(event.organizerId)) continue;
      if (isRecurring(event) && recurring >= MAX_RECURRING_ROWS) continue;
      // `pool` is in start order, so a strict `<` keeps the earliest of equals.
      const key = [categories.get(event.categoryId ?? "") ?? 0, isRecurring(event) ? 1 : 0] as const;
      if (bestKey === undefined || key[0] < bestKey[0] || (key[0] === bestKey[0] && key[1] < bestKey[1])) {
        best = event;
        bestKey = key;
      }
    }
    if (best === undefined) break;
    chosen.push(best);
    if (best.organizerId !== undefined) organisers.add(best.organizerId);
    categories.set(best.categoryId ?? "", (categories.get(best.categoryId ?? "") ?? 0) + 1);
    if (isRecurring(best)) recurring += 1;
  }

  return byStart(chosen);
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
