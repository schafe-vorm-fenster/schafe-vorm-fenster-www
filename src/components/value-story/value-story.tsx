import { Badge } from "../badge/badge";

import type { QuoteFragment } from "../content-fragments";
import type { ReactNode } from "react";

import styles from "./value-story.module.css";

/** The example ladder, place first (TS-020 D3) — where the label comes from. */
export const EXAMPLE_LEVELS = ["place", "surrounding", "county", "snapshot", "invite"] as const;

export type ExampleLevel = (typeof EXAMPLE_LEVELS)[number];

export interface ValueStoryProps {
  /** The aspect this story is about. */
  readonly aspect: string;
  readonly whyItMatters: string;
  readonly exampleLevel: ExampleLevel;
  /** The place or county name the example is labelled with, where applicable. */
  readonly exampleLabel?: string;
  /**
   * The example itself — an `event-row`, a snapshot line, or the publish
   * invitation. Absent where the story is led by its photograph instead: a
   * picture, a live date *and* a quote is three pieces of evidence for one
   * argument, and the box is not reserved for an example that is not coming.
   */
  readonly example?: ReactNode;
  /**
   * A photograph for the story, at `ratio-feature`, where one exists
   * (polish brief, page 2, fix 3: two of the four stories are picture-led so
   * the four do not read as one list). Absent, not empty: a story without a
   * cleared photograph renders text-led and reserves nothing.
   */
  readonly media?: ReactNode;
  /**
   * `row` reserves 76 px (`event-row`); `feature` reserves `ratio-feature`;
   * `module` reserves nothing, for the one story whose example *is* a live
   * module with its own frame and its own geometry (`/dein-ort` story 4,
   * which carries position 2 — polish brief, page 2, fix 5).
   */
  readonly exampleVariant?: "row" | "feature" | "module";
  /**
   * Absent, not empty: an uncleared testimonial is not in the DOM at all —
   * clearance is known at build time, so there is no async box to reserve.
   */
  readonly testimonial?: QuoteFragment;
  readonly headingLevel?: "h2" | "h3";
  readonly className?: string;
}

/**
 * 23 `value-story` [PROPOSED] — content type 3 `value-story`, TS-020 D3.
 *
 * Structure: aspect → why it matters → live example → testimonial. Four
 * render on `/dein-ort`, always, in both states the page can be in.
 * States: the example ladder — place → surroundings ≤ 15 km (labelled with
 * that place's own name) → county → a build-time snapshot labelled as such →
 * the publish invitation takes the example box. The testimonial is a
 * different axis: uncleared means the prop is simply omitted, so the slot
 * never renders and reserves nothing — never a paraphrase, an anonymous
 * quote or a stock portrait standing in.
 * Inherits: Card title 21/700, Body 18/1.5, Meta 15; the example's own
 * category colours where it is an `event-row`.
 * Space: the example box reserves `event-row` height or `ratio-feature`,
 * chosen by `exampleVariant`; the absent testimonial reserves nothing.
 * A11y: one heading per story (`headingLevel`, default `h3` inside the
 * page's own `h2` section), no heading-level skip.
 */
/** What the example box reserves before its content arrives. */
const EXAMPLE_CLASS: Record<"row" | "feature" | "module", string | undefined> = {
  row: styles.exampleRow,
  feature: styles.exampleFeature,
  module: undefined,
};

export function ValueStory({
  aspect,
  whyItMatters,
  exampleLevel,
  exampleLabel,
  example,
  media,
  exampleVariant = "feature",
  testimonial,
  headingLevel = "h3",
  className,
}: ValueStoryProps) {
  const Heading = headingLevel;

  return (
    <article className={[styles.story, className].filter(Boolean).join(" ")}>
      <Heading className={styles.aspect}>{aspect}</Heading>
      <p className={styles.why}>{whyItMatters}</p>
      {media ? <div className={styles.media}>{media}</div> : null}
      {example === undefined || example === null ? null : (
        <div className={EXAMPLE_CLASS[exampleVariant]} data-example-level={exampleLevel}>
          {exampleLabel ? (
            <Badge className={styles.exampleBadge} tone="neutral">
              {exampleLabel}
            </Badge>
          ) : null}
          {example}
        </div>
      )}
      {testimonial ? (
        <blockquote className={styles.quote}>
          <p className={styles.quoteText}>{testimonial.text}</p>
          <footer className={styles.attribution}>
            {testimonial.attribution}
            {testimonial.role ? `, ${testimonial.role}` : null}
          </footer>
        </blockquote>
      ) : null}
    </article>
  );
}
