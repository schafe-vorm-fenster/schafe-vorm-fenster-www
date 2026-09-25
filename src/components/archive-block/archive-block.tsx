import { Icon } from "../icon/icon";

import type { IconName } from "../icon/icon";

import styles from "./archive-block.module.css";

export interface ArchiveItem {
  /**
   * The neutral glyph of the channel itself — `megaphone` for flyers, `clock`
   * for the paper's deadline, `users` for the own channels (SRC-0014 §Archive
   * block). Omitted → the glyph at the row's position in `ARCHIVE_GLYPHS`.
   */
  readonly icon?: IconName;
  /** The bold core line, in archive ink. */
  readonly core: string;
  /** The detail line, in `text-2`. */
  readonly detail: string;
}

/**
 * The glyph order SRC-0014 §Archive block names, verbatim: the flyer, the
 * paper's deadline, the own channels. A fourth row repeats from the start —
 * the block never invents a glyph, and never `circle-x` (DEC-0117).
 */
export const ARCHIVE_GLYPHS: readonly IconName[] = ["megaphone", "clock", "users"];

export interface ArchiveBlockProps {
  /** The eyebrow naming the block's role, in archive ink. Copy, so optional. */
  readonly kicker?: string;
  readonly items: readonly ArchiveItem[];
  /** The sentence the block ends on, set larger than the rows. */
  readonly closing?: string;
  /**
   * Which ground the block stands on. `inherit` (default) inside a
   * `section-shell surface="archive"`, which paints the ground; `own` where
   * the block is the lower half of another block on a light section — it
   * then paints the archive ground itself and runs out to the section's
   * gutter (`objection-list`, DEC-0117).
   */
  readonly ground?: "inherit" | "own";
  readonly className?: string;
}

export function archiveGlyph(item: ArchiveItem, index: number): IconName {
  return item.icon ?? ARCHIVE_GLYPHS[index % ARCHIVE_GLYPHS.length];
}

/**
 * `archive-block` [PROPOSED] — SRC-0014 §Archive block, design-system
 * contract §1 (`archive-block`: archive ground, archive ink, neutral icons).
 *
 * Structure: the "old world" section type — *what does not work today*, and
 * nothing else. A kicker, *n* rows of a bare 24 px glyph beside a bold core
 * line and a detail line, hairlines between the rows, and the sentence the
 * block ends on. Problem content only: the solution never appears on this
 * ground.
 * States: none — nothing here is late data.
 * Inherits: ground `archive ground`; kicker and core in `archive ink`
 * (6.35:1), detail in `text-2` (9.52:1), closing in `ink` (15.37:1);
 * hairlines `archive line` (1.42:1 — `line` disappears on this ground). No
 * wells, no fills, no photos: a quiet block. Never `circle-x`, never a red
 * cross, never `status-error` — the content is already the failure; the icon
 * does not say it twice.
 * Space: row count is content-driven; the closing sentence is Lead size so
 * it reads as the conclusion rather than a further row.
 * A11y: a real list; the failure is carried in text, never by colour or icon
 * alone, and the icons are decorative (`aria-hidden` via `icon`).
 */
export function ArchiveBlock({
  kicker,
  items,
  closing,
  ground = "inherit",
  className,
}: ArchiveBlockProps) {
  return (
    <div
      className={[styles.block, ground === "own" ? styles.own : undefined, className]
        .filter(Boolean)
        .join(" ")}
      data-archive-block={ground}
    >
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li className={styles.item} key={item.core}>
            <Icon className={styles.icon} name={archiveGlyph(item, index)} />
            <div className={styles.text}>
              <p className={styles.core}>{item.core}</p>
              <p className={styles.detail}>{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      {closing ? <p className={styles.closing}>{closing}</p> : null}
    </div>
  );
}
