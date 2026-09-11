import type { SectionSurface } from "./section-shell";

/**
 * The page-rhythm rules of SRC-014 §Page Rhythm, as a predicate.
 *
 * "The order of section types is part of the design, not a layout accident."
 * A single `section-shell` cannot see its neighbours, so the rules are
 * checked over the whole list where a page is composed — and in the render
 * test, which is the only place that has every page's list at once.
 */
export type RhythmEntry = SectionSurface | "photo";

const COLOUR_FAMILY: Record<RhythmEntry, string> = {
  photo: "photo",
  paper: "neutral",
  surface: "neutral",
  "surface-2": "neutral",
  ink: "ink",
  "lime-100": "lime",
  "lime-500": "lime",
  "violet-500": "violet",
};

export interface RhythmViolation {
  readonly index: number;
  readonly rule: string;
}

/**
 * @param sections the page's sections in order
 * @param himbeereCount how many `himbeere` elements the page renders
 */
export function checkRhythm(
  sections: readonly RhythmEntry[],
  himbeereCount = 0,
): RhythmViolation[] {
  const violations: RhythmViolation[] = [];

  sections.forEach((section, index) => {
    if (index > 0 && section === "photo" && sections[index - 1] === "photo") {
      violations.push({ index, rule: "no photo section adjacent to another" });
    }
    if (
      index > 1 &&
      COLOUR_FAMILY[section] !== "photo" &&
      COLOUR_FAMILY[section] === COLOUR_FAMILY[sections[index - 1]] &&
      COLOUR_FAMILY[section] === COLOUR_FAMILY[sections[index - 2]]
    ) {
      violations.push({ index, rule: "at most two consecutive sections of one colour family" });
    }
  });

  const inkSections = sections.filter((section) => section === "ink").length;
  if (inkSections > 1) {
    violations.push({ index: -1, rule: "the dark ink section appears once per page" });
  }
  if (himbeereCount > 1) {
    violations.push({ index: -1, rule: "exactly one himbeere element per screen" });
  }

  return violations;
}
