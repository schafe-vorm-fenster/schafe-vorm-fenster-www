/**
 * Which live row a value story shows as its own example.
 *
 * The four stories of `/dein-ort` each end in one real date (polish brief
 * G-2: "one real date makes the point; three make a list"). Which date is
 * not a free choice:
 *
 *  - it must not be a row the reader has **just** scrolled past — position 1
 *    prints three of the place's dates above the stories, and story 4 prints
 *    five nearby ones below them, so a story that borrows one of those
 *    repeats the page instead of illustrating it;
 *  - it should, where the day's data allows, carry the **category the story
 *    is about** — the bakery-van story beside a waste-collection date is not
 *    wrong, it is merely arbitrary, and an arbitrary example reads as filler.
 *
 * Both are preferences over live data, never requirements: the module asks
 * for more rows than it prints and takes the best of what came back. A day
 * with nothing in the wanted category still gets an example, just not the
 * one the story would have picked.
 */

import type { EventListItem } from "@/src/components/event-list/event-list";
import type { EventCategory } from "@/src/components/event-row/event-row";
import { hasText } from "@/src/lib/live/quality";
import type { LiveEvent } from "@/src/lib/live/types";

/** What one story would like: its categories, best first. */
export type StoryCategoryPreference = readonly EventCategory[];

/**
 * One example per story, in story order — `undefined` where the pool ran out.
 *
 * Each story takes the first row of its most-preferred available category,
 * falling back to the first unused row of any category. No row is used
 * twice, and the order of `preferences` is the order of the stories.
 */
export function pickStoryExamples(
  pool: readonly EventListItem[],
  preferences: readonly StoryCategoryPreference[],
): readonly (EventListItem | undefined)[] {
  const used = new Set<EventListItem>();

  return preferences.map((wanted) => {
    for (const category of wanted) {
      const match = pool.find((row) => !used.has(row) && row.category === category);
      if (match) {
        used.add(match);
        return match;
      }
    }
    const any = pool.find((row) => !used.has(row));
    if (any) used.add(any);
    return any;
  });
}

/* ------------------------------------------------------------------ */
/* DEC-0152 — the strict selector the value stories use                 */
/* ------------------------------------------------------------------ */

/**
 * What one story asks of its example: the events-api category it must carry
 * (TS-WEB-0020 D3's "Example category" column) and, optionally, the words
 * that make a date of that category *this* story's date — a council meeting
 * is `community-life`, but so is the women's sport that stood under the
 * council story in round 4.
 */
export interface StoryExampleSpec {
  readonly category: string;
  readonly topic?: RegExp;
}

/** Within this, a date reads as "in your surroundings"; beyond it, as the county. */
const NEAR_KM = 15;

function topicMatches(event: LiveEvent, topic: RegExp | undefined): boolean {
  if (topic === undefined) return false;
  return [event.title, event.description ?? "", ...(event.tags ?? [])].some((text) => topic.test(text));
}

/**
 * The ranking, most important first. Category is not in it: it is a filter.
 * A story with no date of its category gets no example — the story then shows
 * its invitation in the example's place (TS-WEB-0020-A4) rather than a date
 * from another story's world (A14).
 */
function rank(event: LiveEvent, spec: StoryExampleSpec): readonly number[] {
  const distance = event.distanceKm ?? 0;
  return [
    topicMatches(event, spec.topic) ? 0 : 1,
    hasText(event) ? 0 : 1,
    event.imageUrl === undefined ? 1 : 0,
    distance <= NEAR_KM ? 0 : 1,
    distance,
    Date.parse(event.startsAt),
  ];
}

function compare(a: readonly number[], b: readonly number[]): number {
  for (let index = 0; index < a.length; index++) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

/**
 * One example per spec, each a date no other spec and no `shown` id took.
 * Deterministic for one pool, so a cached page and its test agree.
 */
export function selectStoryExamples(
  pool: readonly LiveEvent[],
  specs: readonly StoryExampleSpec[],
  shown: ReadonlySet<string> = new Set(),
): readonly (LiveEvent | undefined)[] {
  const used = new Set(shown);
  return specs.map((spec) => {
    const best = pool
      .filter((event) => !used.has(event.id) && event.categoryId === spec.category)
      .map((event) => ({ event, key: rank(event, spec) }))
      .sort((a, b) => compare(a.key, b.key))[0]?.event;
    if (best !== undefined) used.add(best.id);
    return best;
  });
}
