/**
 * `/dein-ort`'s stories as data — shared by the page (server) and the story
 * examples it loads in the browser (`place-islands.tsx`, DEC-0163). A plain
 * module, not a component file: the specs carry `RegExp`s, which cannot cross
 * from a server component into a client one as props, so both sides import
 * them from here instead.
 */

import type { IconName } from "@/src/components/icon/icon";
import type { SectionSurface } from "@/src/components/section-shell/section-shell";
import type { DictionaryKeyOf } from "@/src/lib/i18n/dictionary";
import type { StoryExampleSpec } from "@/src/lib/pages/story-examples";

/**
 * The four stories, in the order the artifact writes them and the page reads
 * them — the ground each stands on, the photograph it is led by where one
 * exists, and the categories its live example prefers.
 *
 * The grounds alternate by construction (`paper → lime-100 → paper →
 * surface`), which is what stops four arguments in a row from reading as one
 * long block; `rhythm.ts` checks the whole sequence in the page's own test.
 */
export interface StorySection {
  readonly slotId: string;
  readonly quoteSlotId: string;
  readonly id: string;
  readonly surface: SectionSurface;
  /**
   * A story is led by a photograph **or** by a live date, never by both: a
   * picture, a row and a quote is three pieces of evidence for one argument,
   * and four stories built that way are a 3 000 px wall. Two picture-led and
   * two date-led, alternating, is the rhythm the brief asks for.
   */
  readonly imageId?: string;
  /**
   * What this story's live example must be: TS-WEB-0020 D3's events-api
   * category, strictly (A14), plus the words that make a date of that
   * category this story's date (DEC-0152).
   */
  readonly example?: StoryExampleSpec;
  /** The story's glyph — the hour's well, and the watermark where it has no photograph. */
  readonly icon: IconName;
  /**
   * The "benefit" kicker naming what this specific story is about (DEC-0148)
   * — no longer one shared phrase across all three.
   */
  readonly kickerKey: DictionaryKeyOf<"kickers">;
}

export const STORIES: readonly StorySection[] = [
  {
    slotId: "dein-ort-3-story-baeckerwagen",
    quoteSlotId: "dein-ort-3-story-baeckerwagen-demo-testimonial",
    id: "story-baeckerwagen",
    surface: "paper",
    imageId: "dein-ort-story-baeckerwagen",
    kickerKey: "everydaySupply",
    icon: "truck",
    example: {
      category: "everyday-supply",
      topic: /bäcker|baecker|brot|backwaren|verkaufswagen|fleischer|fisch|wochenmarkt|markt|hofladen|lieferung/i,
      // `everyday-supply` also holds the waste collection; under the bread
      // story only a supply date that is about buying something counts.
      topicRequired: true,
    },
  },
  {
    slotId: "dein-ort-4-story-ratssitzung",
    quoteSlotId: "dein-ort-4-story-ratssitzung-demo-testimonial",
    id: "story-ratssitzung",
    surface: "lime-100",
    // `community-life` is where the council meeting lives upstream, and only
    // there (D3, A14) — a supply date under a story about being heard before
    // the vote would be an example of nothing. Within it, a sitting beats the
    // women's sport that stood here in round 4 (F-4-2).
    example: {
      category: "community-life",
      topic: /gemeindevertret|stadtvertret|gemeinderat|sitzung|ausschuss|einwohnerversammlung|bürgermeister|buergermeister|amt\b/i,
    },
    kickerKey: "communityLife",
    icon: "landmark",
  },
  {
    slotId: "dein-ort-5-story-kultur",
    quoteSlotId: "dein-ort-5-story-kultur-demo",
    id: "story-kultur",
    surface: "paper",
    imageId: "dein-ort-story-kultur",
    kickerKey: "cultureAndTourism",
    icon: "music",
    example: {
      category: "culture-tourism",
      topic: /konzert|musik|ausstellung|lesung|theater|schloss|chor|kino|kultur/i,
    },
  },
];

/** Story 4 — the radius, which carries position 2 as its own example. */
export const RADIUS_STORY = {
  slotId: "dein-ort-6-story-radius",
  quoteSlotId: "dein-ort-6-story-radius-demo-testimonial",
} as const;

