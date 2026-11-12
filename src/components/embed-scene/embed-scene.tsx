import { Icon } from "../icon/icon";

import type { ReactNode } from "react";

import styles from "./embed-scene.module.css";

export interface EmbedSceneProps {
  /** The scene's heading, a statement (TS-WEB-0006 D7). */
  readonly opener: string;
  /** One sentence under the heading. */
  readonly lead: string;
  /** The three ticked points. */
  readonly points: readonly string[];
  /** The photograph, a `media-frame` — runs the section's whole width. */
  readonly photo: ReactNode;
  /** The calendar graphic that sits on the photograph's lower edge. */
  readonly graphic: ReactNode;
  /** The scene's one secondary button. */
  readonly cta?: ReactNode;
}

/**
 * `embed-scene` [PROPOSED] — the `embed` scene of `/` in the shape of
 * issue 145 (DEC-0191): heading, lead sentence and three ticked points in the
 * container, then the town-hall photograph full-bleed with the calendar
 * graphic on its lower edge, then the button.
 *
 * Structure: still one `scene` of TS-WEB-0006 D7 — one mechanism (`embed`), the
 * opener as its block heading, one concrete instance (photograph with graphic)
 * and one secondary call to action. It is its own component rather than a
 * `scene-block` because the lead, the ticked list and the graphic's overhang
 * into the section below belong to no other scene (those are unchanged).
 * Layout: below `lg` the graphic stands under the photograph, overlapping it by
 * 72 px, 40 px from the left edge and one gutter from the right; from `lg` it
 * sits on the photograph's lower edge at the container's right, 96 px of it
 * reaching below the photograph, and the button stands on the left.
 * A11y: the sentence list is a real `ul`; the tick glyphs are decorative.
 */
export function EmbedScene({ opener, lead, points, photo, graphic, cta }: EmbedSceneProps) {
  return (
    <div className={styles.scene} data-mechanism="embed">
      <div className={`container ${styles.copy}`}>
        <h2 className={styles.opener}>{opener}</h2>
        <p className={styles.lead}>{lead}</p>
        <ul className={styles.points}>
          {points.map((point) => (
            <li className={styles.point} key={point}>
              <span aria-hidden="true" className={styles.tick}>
                <Icon name="check" />
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.stage}>
        <div className={styles.photo}>{photo}</div>
        <div className={`container ${styles.graphicRow}`}>
          <div className={styles.graphic}>{graphic}</div>
        </div>
      </div>
      {cta ? <div className={`container ${styles.cta}`}>{cta}</div> : null}
    </div>
  );
}
