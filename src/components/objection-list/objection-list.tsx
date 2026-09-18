import { EmptyProofSlot } from "../empty-proof-slot/empty-proof-slot";
import { Icon } from "../icon/icon";

import type { ReactNode } from "react";


import styles from "./objection-list.module.css";

export interface ObjectionItem {
  /** The channel, in the visitor's own words. */
  readonly channel: string;
  /** The one concrete way it fails. */
  readonly failure: string;
}

export interface ObjectionListProps {
  readonly headline: string;
  readonly items: readonly ObjectionItem[];
  /**
   * The line the block closes on — the objections that are about the
   * organiser rather than about a channel, folded into one sentence instead
   * of two more bulleted rows (polish brief, page 4, item 2). Beat 2 should
   * sting, not grind.
   */
  readonly closing?: string;
  /** A cleared `proof-card`. Omitted → `empty-proof-slot`, never backfilled. */
  readonly proof?: ReactNode;
  /**
   * Whether the block reserves a proof position at all.
   *
   * `false` on `/mitmachen`: the brief struck it (G-9). The objections are
   * the audience's own words — they need no third-party evidence, and the
   * reserved panel was a blank rectangle under a list of bad news.
   */
  readonly proofSlot?: boolean;
  readonly className?: string;
}

/**
 * 24 `objection-list` [PROPOSED] — content type 4 `objection-list`,
 * TS-022 D3.
 *
 * Structure: one headline plus *n* items, each the channel in the visitor's
 * own words and the one concrete way it fails, and — where the copy has one
 * — a closing sentence. A proof slot beside the block where the caller asks
 * for one. No numeral asserts how many channels exist.
 * States: the proof slot holds its position as a flat brand-colour panel
 * when nothing clears (`empty-proof-slot`), never backfilled with a
 * substitute claim and — since Jan's decision of 2026-09-18 — never labelled
 * in the page either.
 * Inherits: not a Q&A block and not `FAQPage` markup; `circle-x` marks the
 * failure role; the failure colour is the status-error token, used here only
 * as the failure narrative, never as an error state of the page itself.
 * Space: item count is content-driven; nothing here is late data, so there is
 * no reservation problem.
 * A11y: a real list; the failure is carried in text, never by colour alone.
 */
export function ObjectionList({
  headline,
  items,
  closing,
  proof,
  proofSlot = true,
  className,
}: ObjectionListProps) {
  return (
    <div className={[styles.block, className].filter(Boolean).join(" ")}>
      <h2 className={styles.headline}>{headline}</h2>
      <div className={styles.layout}>
        <ul className={styles.list}>
          {items.map((item) => (
            <li className={styles.item} key={item.channel}>
              <Icon className={styles.icon} name="circle-x" />
              <div>
                <p className={styles.channel}>{item.channel}</p>
                <p className={styles.failure}>{item.failure}</p>
              </div>
            </li>
          ))}
        </ul>
        {proofSlot ? (
          <div className={styles.proof}>{proof ?? <EmptyProofSlot />}</div>
        ) : null}
      </div>
      {closing ? <p className={styles.closing}>{closing}</p> : null}
    </div>
  );
}
