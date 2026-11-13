import type { SectionSurface } from "./section-shell";

/**
 * The page-rhythm rules of SRC-0014 §Page Rhythm, as a predicate.
 *
 * "The order of section types is part of the design, not a layout accident."
 * A single `section-shell` cannot see its neighbours, so the rules are
 * checked over the whole list where a page is composed — and in the render
 * test, which is the only place that has every page's list at once.
 *
 * `contact` is the one section that is not a rhythm entry (SRC-0014 §"Section
 * grounds carry rhythm, not meaning", DEC-0117): the contact section keeps its
 * fixed `lime-100` ground on every page and is exempt from the alternation
 * rule — it neither counts towards "at most two of one family" nor breaks a
 * run. A page's own list simply leaves it out; a reader that walks the DOM
 * may pass it as `contact` and the predicate drops it before it looks.
 */
export type RhythmEntry = SectionSurface | "photo" | "contact";

const COLOUR_FAMILY: Record<Exclude<RhythmEntry, "contact">, string> = {
  photo: "photo",
  paper: "neutral",
  surface: "neutral",
  "surface-2": "neutral",
  ink: "ink",
  "lime-100": "lime",
  "lime-500": "lime",
  "violet-500": "violet",
  // Its own family (DEC-0117): the archive ground is neither a neutral grey
  // nor a lime, so a `paper → archive → surface` run is three sections of
  // three families, which is what the eye sees.
  archive: "archive",
};

export interface RhythmViolation {
  readonly index: number;
  readonly rule: string;
}

export const RHYTHM_RULES = {
  photoAdjacent: "no photo section adjacent to another",
  family: "at most two consecutive sections of one colour family",
  inkOnce: "the dark ink section appears once per page",
  inkClosingLast:
    "a second ink section is the closing search block only, and it is the page's last section",
  inkAdjacent: "the two ink sections are never adjacent",
  himbeere: "exactly one himbeere element per screen",
} as const;

/**
 * @param sections the page's sections in order — the contact section left
 *   out, or passed as `contact` and ignored here
 * @param himbeereCount how many `himbeere` elements the page renders
 */
export function checkRhythm(
  sections: readonly RhythmEntry[],
  himbeereCount = 0,
): RhythmViolation[] {
  const violations: RhythmViolation[] = [];
  const counted = sections.filter(
    (section): section is Exclude<RhythmEntry, "contact"> => section !== "contact",
  );

  counted.forEach((section, index) => {
    if (index > 0 && section === "photo" && counted[index - 1] === "photo") {
      violations.push({ index, rule: RHYTHM_RULES.photoAdjacent });
    }
    if (
      index > 1 &&
      COLOUR_FAMILY[section] !== "photo" &&
      COLOUR_FAMILY[section] === COLOUR_FAMILY[counted[index - 1]] &&
      COLOUR_FAMILY[section] === COLOUR_FAMILY[counted[index - 2]]
    ) {
      violations.push({ index, rule: RHYTHM_RULES.family });
    }
  });

  /*
   * The dark ink section carries the live data and appears once. "A closing
   * search block is the one further `ink` section a page may carry, because a
   * search field has no other legal ground. It sits last, after the context
   * band, and the two ink sections are never adjacent" (SRC-0014 §Page Rhythm,
   * DEC-0117). The predicate cannot see whether a section holds a search
   * field; it holds the two facts it can see — last, and not adjacent.
   */
  const inkIndexes = counted.flatMap((section, index) => (section === "ink" ? [index] : []));
  if (inkIndexes.length > 2) {
    violations.push({ index: inkIndexes[2], rule: RHYTHM_RULES.inkOnce });
  } else if (inkIndexes.length === 2) {
    const [first, second] = inkIndexes;
    if (second !== counted.length - 1) {
      violations.push({ index: second, rule: RHYTHM_RULES.inkClosingLast });
    }
    if (second === first + 1) {
      violations.push({ index: second, rule: RHYTHM_RULES.inkAdjacent });
    }
  }
  if (himbeereCount > 1) {
    violations.push({ index: -1, rule: RHYTHM_RULES.himbeere });
  }

  return violations;
}
