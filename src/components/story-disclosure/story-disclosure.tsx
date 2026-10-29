import styles from "./story-disclosure.module.css";

export interface DisclosureStory {
  /** Stable id; the heading id is derived from it. */
  readonly id: string;
  /** The mono line above the title — source and year of the record. */
  readonly kicker: string;
  /** The story's title — the record's verbatim claim. Never truncated. */
  readonly title: string;
  /** The story itself, shown below the claim. */
  readonly story?: string;
}

export interface StoryDisclosureProps {
  readonly stories: readonly DisclosureStory[];
  readonly className?: string;
}

/**
 * `story-disclosure` [PROPOSED] — SRC-0014 §Story disclosure, DEC-0162 §2.
 *
 * Structure: one column of stories, in the relevance engine's order, at every
 * width. Every story stands open: the kicker, the record's claim as a pull
 * quote under a large opening quote mark, and the story indented under a
 * violet rule. It was an accordion of native `<details>` (DEC-0175 §1); the
 * owner's review of 2026-10-29 found that the toggling made the page harder to
 * read than showing everything, so nothing is hidden and nothing toggles.
 *
 * The title is an `h3`, so every story is a heading in the outline.
 */
export function StoryDisclosure({ stories, className }: StoryDisclosureProps) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")} role="list">
      {stories.map((story) => (
        <li className={styles.item} data-story key={story.id}>
          <p className={styles.kicker}>{story.kicker}</p>
          <h3 className={styles.title} id={`${story.id}-title`}>
            {story.title}
          </h3>
          {story.story ? <p className={styles.story}>{story.story}</p> : null}
        </li>
      ))}
    </ul>
  );
}
