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
