import { Badge } from "../badge/badge";
import { Icon, type IconName } from "../icon/icon";
import { Tag } from "../tag/tag";

import type { ReactNode } from "react";

import styles from "./setting-row.module.css";

/** One value the calendar is configured for, or — `excluded` — one it leaves out. */
export interface SettingTag {
  readonly label: string;
  readonly excluded?: boolean;
}

export interface SettingRowProps {
  /** The 24 px glyph in the `lime-100` well — `map-pin`, `users`, `clock` … */
  readonly icon: IconName;
  readonly title: string;
  /** The one sentence that says what the setting decides. */
  readonly core: string;
  /** The example paragraph beneath it — meta type, `text2`. */
  readonly example?: string;
  /** The tag row: included values as tags, excluded ones struck (`tag`). */
  readonly tags?: readonly SettingTag[];
  /**
   * The inline "wird geprüft" marker beside the title: the placeholder badge
   * role (SRC-0014 §Badge and chip, DEC-0118) — a setting the product holds
   * but has not confirmed yet. Absent on a confirmed setting.
   */
  readonly marker?: string;
  readonly className?: string;
}

export interface SettingRowsProps {
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * `setting-row` [PROPOSED] — TS-WEB-0024 embed configuration, review
 * R-kalender-12, DEC-0118.
 *
 * Structure: a 40 px `lime-100` icon well with a `lime-800` glyph; beside it
 * the title (with the optional placeholder-badge marker), the core
 * sentence, the example paragraph and the tag row. Rows stand in
 * `SettingRows` and are divided by a 1 px `line` hairline.
 * States: none of its own; the marker says a setting is still being
 * checked, and it is driven by the caller's knowledge of the product, never
 * by copy taste.
 * Inherits: `tag` for the values, `badge` (placeholder tone) for the marker;
 * radius 0 for the row, 999 for the well and every pill inside.
 * Space: static content; the well is fixed at 40 px.
 * A11y: the title is an `h3` inside a list item; the glyph is decorative;
 * the marker is text, read after the title.
 */
export function SettingRow({ icon, title, core, example, tags, marker, className }: SettingRowProps) {
  return (
    <li className={[styles.row, className].filter(Boolean).join(" ")}>
      <span className={styles.well}>
        <Icon name={icon} />
      </span>
      <div className={styles.body}>
        <h3 className={styles.title}>
          {title}
          {marker ? (
            <Badge className={styles.marker} tone="placeholder">
              {marker}
            </Badge>
          ) : null}
        </h3>
        <p className={styles.core}>{core}</p>
        {example ? <p className={styles.example}>{example}</p> : null}
        {tags && tags.length > 0 ? (
          <ul className={styles.tags}>
            {tags.map((tag) => (
              <li key={tag.label}>
                <Tag excluded={tag.excluded}>{tag.label}</Tag>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

/** The list the rows stand in — one hairline between rows, none around the list. */
export function SettingRows({ className, children }: SettingRowsProps) {
  return <ul className={[styles.list, className].filter(Boolean).join(" ")}>{children}</ul>;
}
