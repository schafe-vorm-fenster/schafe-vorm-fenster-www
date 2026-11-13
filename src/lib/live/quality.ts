/**
 * Which upstream dates are fit to be shown at all — DEC-0152, round 4's F-4-6.
 *
 * Two real `events-api` entries for Rubkow carried the literal title "hier
 * könnte dein Termin stehen" — the village calendar's own empty-slot
 * invitation, saved as a date — and the nearby module printed them twice,
 * byte for byte. A placeholder is not a date, and the same date twice is not
 * two. Both are dropped where every source turns into a `LiveEvent`, so no
 * module has to remember to do it.
 *
 * The placeholder list is deliberately short: the invitation sentences the
 * calendars themselves write into an empty slot. It is not a content filter,
 * and an unusual but real title passes.
 */

import type { LiveEvent } from "./types";

const PLACEHOLDER_TITLES: readonly RegExp[] = [
  /^\s*hier\s+k(?:ö|oe)nnte\s+(?:dein|ihr|euer)\s+termin\s+stehen\b/i,
  /^\s*(?:platzhalter|test(?:termin)?|dummy)\s*$/i,
];

/** A title that is no date: empty, or a calendar's own empty-slot invitation. */
export function isPlaceholderTitle(title: string): boolean {
  return title.trim() === "" || PLACEHOLDER_TITLES.some((pattern) => pattern.test(title));
}

/** The same date twice: one title, one start, one place — whatever the ids say. */
function identity(event: LiveEvent): string {
  return [event.title.trim().toLowerCase(), event.startsAt, (event.placeName ?? "").toLowerCase()].join("|");
}

/** Placeholders out, then the first of every duplicate kept. Order is preserved. */
export function fitEvents<T extends LiveEvent>(events: readonly T[]): T[] {
  const seen = new Set<string>();
  const ids = new Set<string>();
  return events.filter((event) => {
    if (isPlaceholderTitle(event.title)) return false;
    const key = identity(event);
    if (seen.has(key) || ids.has(event.id)) return false;
    seen.add(key);
    ids.add(event.id);
    return true;
  });
}

/** A description worth reading — more than a repeat of the title. */
export function hasText(event: LiveEvent): boolean {
  const text = event.description?.trim() ?? "";
  return text.length >= 40 && text.toLowerCase() !== event.title.trim().toLowerCase();
}
