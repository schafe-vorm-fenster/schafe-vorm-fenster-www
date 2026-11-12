/**
 * The one preference every date selection shares — DEC-0210 (issue #22).
 *
 * Three places choose a few dates out of many: the drawn phone of the home
 * intro (`dorfkalender.ts`), the nearby module (`varied-week.ts`) and
 * position 1 on `/` and `/dein-ort` (`places.ts`). They differ in which pool
 * they look at and for how long; they do not differ in what they prefer:
 *
 *  1. a **one-off** date before a recurring one (`occurrence` other than
 *     `once`: `recurring`, `series`, `openinghours`, `schedule`);
 *  2. a **mix of themes** — the category least represented so far;
 *  3. on a tie, **culture** (`culture-tourism`);
 *  4. then the earlier start, then the id.
 *
 * Only measurable features rank; no invented weights. Pure: candidates in,
 * dates out. The horizon is the caller's — this function never reaches
 * beyond the list it is handed, so a date outside the caller's window cannot
 * enter.
 */

import type { LiveEvent } from "./types";

/** `occurrence` values of the events-api that are not a one-off date. */
const NOT_ONCE = new Set(["recurring", "series", "openinghours", "schedule"]);

/** The events-api category the owner wants taken in first (`categories.ts`). */
export const CULTURE_CATEGORY = "culture-tourism";

export function isRecurring(event: Pick<LiveEvent, "occurrence">): boolean {
  return event.occurrence !== undefined && NOT_ONCE.has(event.occurrence);
}

export function isCulture(event: Pick<LiveEvent, "categoryId">): boolean {
  return event.categoryId === CULTURE_CATEGORY;
}

type Rankable = Pick<LiveEvent, "id" | "startsAt" | "occurrence" | "categoryId">;

function tail(a: Rankable, b: Rankable): number {
  // `localeCompare` on ISO strings is the order `byStart` already uses.
  return a.startsAt.localeCompare(b.startsAt) || a.id.localeCompare(b.id);
}

/**
 * The preference between two dates with no list around them — one slot of the
 * phone, one choice among equals: one-off, then culture, then earlier.
 */
export function compareByPreference(a: Rankable, b: Rankable): number {
  return (
    Number(isRecurring(a)) - Number(isRecurring(b)) ||
    Number(!isCulture(a)) - Number(!isCulture(b)) ||
    tail(a, b)
  );
}

export interface PickOptions {
  /** At most one date per `organizerId`; a date without one counts as its own organiser. */
  readonly distinctOrganisers?: boolean;
  /** At most this many recurring dates. */
  readonly maxRecurring?: number;
}

/**
 * Up to `count` dates from `candidates`, shown in start order.
 *
 * Greedy and deterministic: each round takes, among the dates still allowed,
 * the one-off over the recurring one, then the one whose category is least
 * represented so far, then culture, then the earliest start, then the id. A
 * date repeated by id counts once.
 */
export function pickPreferred<T extends LiveEvent>(
  candidates: readonly T[],
  count: number,
  { distinctOrganisers = false, maxRecurring = Number.POSITIVE_INFINITY }: PickOptions = {},
): T[] {
  const seen = new Set<string>();
  // Start order, a repeated id keeps its earliest date.
  const pool = [...candidates].sort(tail).filter((event) => !seen.has(event.id) && seen.add(event.id));
  const chosen: T[] = [];
  const organisers = new Set<string>();
  const categories = new Map<string, number>();
  let recurring = 0;

  while (chosen.length < count) {
    let best: T | undefined;
    let bestKey: readonly [number, number, number] | undefined;
    for (const event of pool) {
      if (chosen.includes(event)) continue;
      if (distinctOrganisers && event.organizerId !== undefined && organisers.has(event.organizerId)) continue;
      if (isRecurring(event) && recurring >= maxRecurring) continue;
      const key = [
        isRecurring(event) ? 1 : 0,
        categories.get(event.categoryId ?? "") ?? 0,
        isCulture(event) ? 0 : 1,
      ] as const;
      // `pool` is in start order, so a strict "less" keeps the earliest of equals.
      if (
        bestKey === undefined ||
        key[0] < bestKey[0] ||
        (key[0] === bestKey[0] && (key[1] < bestKey[1] || (key[1] === bestKey[1] && key[2] < bestKey[2])))
      ) {
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

  return chosen.sort(tail);
}
