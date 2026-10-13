import { Icon } from "../icon/icon";

import type { ReactNode } from "react";

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
  /**
   * The `name` that makes the native `<details>` elements one exclusive group:
   * opening a story closes the one that was open, with no script.
   */
  readonly group: string;
  /** The toggle's label while the story is closed ("Die Geschichte"). */
  readonly openLabel: string;
  /** The toggle's label while the story is open ("Schließen"). */
  readonly closeLabel: string;
  /**
   * Rendered after the stories, inside the same grid — the reserved, never
   * backfilled proof place of TS-WEB-0027 D5, where the page has one.
   */
  readonly trailing?: ReactNode;
  readonly className?: string;
}

/**
 * `story-disclosure` [PROPOSED] — SRC-0014 §Story disclosure, DEC-0162 §2.
 *
 * Structure: a grid of stories, each one a title that is always visible and a
 * native `<details>` whose `<summary>` is the toggle ("Die Geschichte +") and
 * whose body is the story. All `<details>` share one `name`, so the browser
 * keeps at most one open — the owner's design shows exactly one card open.
 * The first story is open in the server HTML, so nothing moves after load.
 * States: closed · open. An open story spans the grid's full row and takes the
 * `violet-500` ground with `paper` type; a closed one stands on `lime-100`
 * with `ink` type. Both are flat blocks, radius 0, no border, no shadow.
 * No JavaScript: `<details>`/`<summary>` is operable by mouse, touch and
 * keyboard (Enter, Space) in every engine, and exposes its expanded state to
 * assistive technology natively. Opening a story moves the content below it,
 * which is user-initiated and therefore not a layout shift (CLS excludes
 * shifts within 500 ms of input).
 * Space: the toggle is a 44 px control row; type never below 15 px.
 * A11y: the title is an `h3` outside the toggle, so it is a heading in the
 * outline whether the story is open or not; the summary names the action and
 * is described by the title it opens.
 */
export function StoryDisclosure({
  stories,
  group,
  openLabel,
  closeLabel,
  trailing,
  className,
}: StoryDisclosureProps) {
  return (
    <ul className={[styles.grid, className].filter(Boolean).join(" ")} role="list">
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
            <details className={styles.details} name={group} open={index === 0}>
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
      {trailing ? <li className={styles.trailing}>{trailing}</li> : null}
    </ul>
  );
}
