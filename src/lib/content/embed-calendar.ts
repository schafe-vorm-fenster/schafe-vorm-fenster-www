import { fieldAt } from "@/src/lib/content/blocks";

import type { ContentBlock } from "@/src/lib/content/types";

/**
 * The words and the twelve example dates of the embed scene's calendar graphic
 * (issue 145, DEC-0193), read from slot `home-5a-scene-embed-calendar-demo`.
 *
 * The slot is a run of `**Label:** value` fields — a field is what the page
 * reads by position without a drift-test row (`RENDERED_BLOCKS`) — in this
 * fixed order, the same in both locales: four graphic labels, four category
 * names, then three events per category in category order. An event is
 * `day | weekday | title | place · time`.
 */

/** The four categories in the order the filter shows them and the slideshow walks. */
export const EMBED_CATEGORIES = [
  "community-life",
  "education-health",
  "everyday-supply",
  "culture-tourism",
] as const;

export type EmbedCategoryId = (typeof EMBED_CATEGORIES)[number];

export interface EmbedEvent {
  readonly day: string;
  readonly weekday: string;
  readonly title: string;
  /** `place · time`, as authored. */
  readonly meta: string;
}

export interface EmbedCalendarCategory {
  readonly id: EmbedCategoryId;
  readonly label: string;
  readonly events: readonly EmbedEvent[];
}

export interface EmbedCalendarCopy {
  readonly address: string;
  readonly title: string;
  /** Screen-reader name of the filter bar. */
  readonly filterLabel: string;
  /** Screen-reader name of the whole graphic. */
  readonly graphicLabel: string;
  readonly categories: readonly EmbedCalendarCategory[];
}

const EVENTS_PER_CATEGORY = 3;
const LABEL_FIELDS = 4;

function parseEvent(line: string | undefined, where: string): EmbedEvent {
  const parts = (line ?? "").split("|").map((part) => part.trim());
  if (parts.length !== 4 || parts.some((part) => part === "")) {
    throw new Error(`${where}: an event reads "day | weekday | title | place · time", found "${line ?? ""}"`);
  }
  const [day, weekday, title, meta] = parts;
  return { day, weekday, title, meta };
}

/** Reads the graphic's copy from the slot's blocks; throws where the slot is not that shape. */
export function embedCalendarFrom(
  blocks: readonly ContentBlock[],
  slotId = "home-5a-scene-embed-calendar-demo",
): EmbedCalendarCopy {
  const text = (index: number): string => {
    const value = fieldAt(blocks, index);
    if (!value) throw new Error(`${slotId}: field ${index + 1} is missing`);
    return value;
  };

  return {
    address: text(0),
    title: text(1),
    filterLabel: text(2),
    graphicLabel: text(3),
    categories: EMBED_CATEGORIES.map((id, categoryIndex) => ({
      id,
      label: text(LABEL_FIELDS + categoryIndex),
      events: Array.from({ length: EVENTS_PER_CATEGORY }, (_, eventIndex) => {
        const index =
          LABEL_FIELDS + EMBED_CATEGORIES.length + categoryIndex * EVENTS_PER_CATEGORY + eventIndex;
        return parseEvent(fieldAt(blocks, index), `${slotId}: field ${index + 1}`);
      }),
    })),
  };
}
