import { ArchiveBlock } from "../archive-block/archive-block";
import { EmptyProofSlot } from "../empty-proof-slot/empty-proof-slot";
import { Icon } from "../icon/icon";

import type { IconName } from "../icon/icon";
import type { ReactNode } from "react";

import styles from "./objection-list.module.css";

export interface ObjectionItem {
  /** The channel, in the visitor's own words — the bold core line. */
  readonly channel: string;
  /** The one concrete way it fails — the detail line. */
  readonly failure: string;
  /**
   * The channel's own neutral glyph. Omitted → `archive-block`'s order
   * (`megaphone` · `clock` · `users`, SRC-0014 §Archive block).
   */
  readonly icon?: IconName;
}

export interface ReachItem {
  /** Who does not hear about the date today — the row's title. */
  readonly title: string;
  /** Why not, in one line. */
  readonly detail: string;
  /** The row's glyph. Omitted → the glyph at the row's position in `REACH_GLYPHS`. */
  readonly icon?: IconName;
}

/**
 * The glyph order of the upper part in the 2026-09-23 design ("wo es hakt"):
 * the neighbours (`house`), the next village (`map-pin`), the newcomers
 * (`users`). A fourth row repeats from the start (DEC-0117).
 */
export const REACH_GLYPHS: readonly IconName[] = ["house", "map-pin", "users"];

export function reachGlyph(item: ReachItem, index: number): IconName {
  return item.icon ?? REACH_GLYPHS[index % REACH_GLYPHS.length];
}

export interface ObjectionListProps {
  readonly headline: string;
  /**
   * The upper part: who the date does not reach today, as rows in a
   * `surface` box with a 40 px `lime-100` icon well each. Omitted → the block
   * opens straight on the archive half.
   */
  readonly reach?: readonly ReachItem[];
  /** The lower part's kicker — the archive block's eyebrow, in archive ink. */
  readonly archiveKicker?: string;
  /** The channels and how each one fails — the archive block's rows. */
  readonly items: readonly ObjectionItem[];
  /**
   * The line the block closes on — the objections that are about the
   * organiser rather than about a channel, folded into one sentence instead
   * of two more rows (polish brief, page 4, item 2). Beat 2 should sting,
   * not grind. Set larger than the rows.
   *
   * It belongs to the **archive half** and renders only with it: with no
   * `items` there is no archive block (see below), and a `closing` passed
   * alongside an empty `items` is not rendered. A page that splits the two
   * halves across sections passes `closing` to the half that carries the
   * rows (`objection-list.test.tsx`, "an empty item list").
   */
  readonly closing?: string;
  /** A cleared `proof-card`. Omitted → `empty-proof-slot`, never backfilled. */
  readonly proof?: ReactNode;
  /**
   * Whether the block reserves a proof position at all. TS-WEB-0022 D3
   * requires the slot ("visibly empty if nothing clears"); the page decides
   * (T-12, DEC-0104: the spec wins over polish brief G-9).
   */
  readonly proofSlot?: boolean;
  readonly className?: string;
}

/**
 * 24 `objection-list` [PROPOSED] — content type 4 `objection-list`,
 * TS-WEB-0022 D3, SRC-0014 §Archive block, design 2026-09-23 "wo es hakt".
 *
 * Structure: one headline plus two parts. (a) On the section ground: *n*
 * `reach` rows in a `surface` box — a 40 px `lime-100` icon well with a
 * `lime-800` glyph (`house` · `map-pin` · `users`), a bold title and a
 * `text-2` detail, hairline between — and the proof slot beside it where the
 * page asks for one. (b) Below, the `archive-block` on its own archive
 * ground: kicker, the channel rows with a bare 24 px neutral glyph
 * (`megaphone` · `clock` · `users`), bold core in archive ink, detail in
 * `text-2`, and the closing sentence set larger than the rows. No numeral
 * asserts how many channels exist.
 * States: the proof slot holds its position as a flat panel when nothing
 * clears (`empty-proof-slot`), never backfilled with a substitute claim.
 * Inherits: not a Q&A block and not `FAQPage` markup. Never `circle-x`,
 * never `status-error`: the content is already the failure (DEC-0117). The
 * icon well is never `lime-500` on a light ground — that fill means *active*
 * (SRC-0014 §Wells).
 * Space: row count is content-driven; nothing here is late data, so there is
 * no reservation problem.
 * A11y: two real lists; the failure is carried in text, never by colour or
 * icon alone.
 */
export function ObjectionList({
  headline,
  reach,
  archiveKicker,
  items,
  closing,
  proof,
  proofSlot = true,
  className,
}: ObjectionListProps) {
  const hasReach = reach !== undefined && reach.length > 0;

  return (
    <div className={[styles.block, className].filter(Boolean).join(" ")}>
      <h2 className={styles.headline}>{headline}</h2>
      {hasReach || proofSlot ? (
        <div className={styles.layout}>
          {hasReach ? (
            <ul className={styles.reach} data-objection-reach>
              {reach.map((item, index) => (
                <li className={styles.reachItem} key={item.title}>
                  <span className={styles.well}>
                    <Icon name={reachGlyph(item, index)} />
                  </span>
                  <div className={styles.reachText}>
                    <p className={styles.reachTitle}>{item.title}</p>
                    <p className={styles.reachDetail}>{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
          {proofSlot ? (
            <div className={styles.proof}>{proof ?? <EmptyProofSlot />}</div>
          ) : null}
        </div>
      ) : null}
      {/* A block with no rows is no block. `/mitmachen` puts the archive half
          in its own section, because the two halves together measure 1627 px
          at 390 px and G-4 caps a section at 1270 (T-12, DEC-0124); the upper
          half then renders here with no `items`, and an empty archive ground
          under it would be a second visible break for nothing. */}
      {items.length > 0 ? (
        <ArchiveBlock
          closing={closing}
          ground="own"
          items={items.map((item) => ({
            core: item.channel,
            detail: item.failure,
            icon: item.icon,
          }))}
          kicker={archiveKicker}
        />
      ) : null}
    </div>
  );
}
