import { Icon } from "../icon/icon";

import styles from "./story-disclosure.module.css";

export interface DisclosureStory {
  /** Stable id; the heading id is derived from it. */
  readonly id: string;
  /** The mono line above the title — source and year of the record. */
  readonly kicker: string;
  /** The story's title — the record's verbatim claim. Never truncated. */
  readonly title: string;
  /** The story itself, shown when the story is opened. */
  readonly story?: string;
}

export interface StoryDisclosureProps {
  readonly stories: readonly DisclosureStory[];
  /** The toggle's label while the story is closed ("Die Geschichte"). */
  readonly openLabel: string;
  /** The toggle's label while the story is open ("Schließen"). */
  readonly closeLabel: string;
  readonly className?: string;
}

/**
 * `story-disclosure` [PROPOSED] — SRC-0014 §Story disclosure, DEC-0162 §2,
 * rebuilt as an accordion by DEC-0175 §1 (issue 102).
 *
 * Structure: one column of stories, in the relevance engine's order, at every
 * width. Each story is a title that is always visible and a native
 * `<details>` whose `<summary>` is the toggle ("Die Geschichte +") and whose
 * body is the story. The first story is open in the server HTML, so nothing
 * moves after load.
 *
 * **An accordion, not a grid.** Until DEC-0175 the stories stood in a two- or
 * three-column grid and the open one spanned the whole row, so a click
 * reflowed every card behind it — the owner's review of 2026-10-27: "hüpft und
 * springt". Now every item keeps its column and its place; opening one only
 * grows that item downward.
 *
 * **Several may be open.** The `<details>` share no `name`: an exclusive group
 * closes the open item when another opens, and when the open one stands above
 * the clicked one the clicked one jumps up under the pointer by the height of
 * the story that closed — the same jump in a different direction. Independent
 * items move nothing above the one the reader touched.
 *
 * States: closed · open. An open story takes the `violet-500` ground with
 * `paper` type; a closed one stands on `lime-100` with `ink` type. Both are
 * flat blocks, radius 0, no border, no shadow. The title keeps its size in
 * both states, so the colour is the only change the item itself shows.
 * No JavaScript: `<details>`/`<summary>` is operable by mouse, touch and
 * keyboard (Enter, Space) in every engine, and exposes its expanded state to
 * assistive technology natively. No transition anywhere, so reduced motion
 * has nothing to reduce.
 * Space: the toggle is a 44 px control row; type never below 15 px.
 * A11y: the title is an `h3` outside the toggle, so it is a heading in the
 * outline whether the story is open or not; the summary names the action and
 * is described by the title it opens.
 */
export function StoryDisclosure({ stories, openLabel, closeLabel, className }: StoryDisclosureProps) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")} role="list">
      {stories.map((story, index) => {
        const headingId = `${story.id}-title`;
        return (
          <li className={styles.item} data-story key={story.id}>
            {/* The title stands outside the toggle, so it is a heading whether
                the story is open or not; the item reads its open state with
                `:has(details[open])`. */}
            <div className={styles.head}>
              <p className={styles.kicker}>{story.kicker}</p>
              <h3 className={styles.title} id={headingId}>
                {story.title}
              </h3>
            </div>
            <details className={styles.details} open={index === 0}>
              <summary aria-describedby={headingId} className={styles.summary}>
                <span className={styles.label}>
                  <span className={styles.openLabel}>{openLabel}</span>
                  <span className={styles.closeLabel}>{closeLabel}</span>
                </span>
                <span aria-hidden="true" className={styles.well}>
                  <Icon className={styles.glyph} name="plus" />
                </span>
              </summary>
              {story.story ? <p className={styles.story}>{story.story}</p> : null}
            </details>
          </li>
        );
      })}
    </ul>
  );
}
