import { MediaFrame } from "../media-frame/media-frame";

import type { DataState } from "../data-state";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./person-profile.module.css";

export interface PersonProfileProps {
  readonly name: string;
  readonly role: string;
  readonly bio?: string;
  readonly portraitSrc?: string;
  /** Required even without a usable portrait — the hatch still needs a name. */
  readonly portraitAlt: string;
  readonly portraitState?: DataState;
  readonly portraitNotDepicting?: boolean;
  /**
   * The rights holder's attribution string, verbatim, where the asset's
   * licence requires one to be printed. Rendered as the portrait's caption —
   * real text under the picture, never a `title` attribute.
   */
  readonly portraitCredit?: string;
  /**
   * The page's language — the portrait hatch badges itself and reads it.
   * Without it the team block on `/en/about` said "Foto gesucht" (F-2-33).
   */
  readonly locale?: Locale;
  /**
   * `true` renders the entry as a text row with no portrait slot at all
   * (polish brief G-9).
   *
   * The state table below used to end at the "Foto gesucht" hatch: a person
   * without a usable portrait got a marked, explained gap. Jan's decision of
   * 2026-09-18 removed every visible mark, and what the hatch left behind
   * was the one thing this component's own contract forbids — a blank box,
   * 4:5 and full column width, under a name. A portrait slot is also not a
   * photo-contribution occasion, so there is nothing to invite. Where no
   * cleared portrait exists the honest shape is the name, the role and the
   * bio, and nothing else.
   */
  readonly textOnly?: boolean;
  readonly className?: string;
}

/**
 * 36 `person-profile` [PROPOSED] — content type 15 `person-profile`,
 * TS-027 D7.
 *
 * Structure: portrait · name · role line · optional bio. Nothing about a
 * person is written into website copy beyond what `@schafe-vorm-fenster/
 * people` (via the content pipeline, M3) supplies as props.
 * States: a person with a cleared portrait shows it through `media-frame`;
 * a person without one is a `textOnly` row — never a blank box, and never
 * an invitation, because a portrait slot is not a photo-contribution
 * occasion (polish brief G-9).
 * Inherits: `ratio-portrait` 4:5, radius 0, no shadow.
 * Space: the ratio is declared before the portrait loads; equal card heights
 * in a grid come from the page's own layout, not from this component.
 * A11y: the portrait's `alt` names the person; no `Person` JSON-LD node is
 * emitted here (TS-011 D4) — that is a page-level structured-data concern.
 */
export function PersonProfile({
  name,
  role,
  bio,
  portraitSrc,
  portraitAlt,
  portraitState,
  portraitNotDepicting,
  portraitCredit,
  locale,
  textOnly = false,
  className,
}: PersonProfileProps) {
  return (
    <article className={[styles.profile, className].filter(Boolean).join(" ")}>
      {textOnly ? null : (
      <MediaFrame
        alt={portraitAlt}
        caption={portraitCredit}
        className={styles.portrait}
        locale={locale}
        notDepicting={portraitNotDepicting}
        ratio="portrait"
        src={portraitSrc}
        state={portraitState}
      />
      )}
      <p className={styles.name}>{name}</p>
      <p className={styles.role}>{role}</p>
      {bio ? <p className={styles.bio}>{bio}</p> : null}
    </article>
  );
}
