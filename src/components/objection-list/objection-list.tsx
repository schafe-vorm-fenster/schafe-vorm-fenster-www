import { EmptyProofSlot } from "../empty-proof-slot/empty-proof-slot";
import { Icon } from "../icon/icon";

import type { ReactNode } from "react";

import type { Locale } from "@/src/lib/i18n/locales";

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
  /** A cleared `proof-card`. Omitted → `empty-proof-slot`, never backfilled. */
  readonly proof?: ReactNode;
  readonly proofEmptySentence?: string;
  /**
   * The page's language, handed on to the empty proof slot. Without it the
   * slot's sentence and badge rendered in German on `/en/take-part` (F-3-15).
   */
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 24 `objection-list` [PROPOSED] — content type 4 `objection-list`,
 * TS-022 D3.
 *
 * Structure: one headline plus *n* items, each the channel in the visitor's
 * own words and the one concrete way it fails. One proof slot beside the
 * block. No numeral asserts how many channels exist.
 * States: the proof slot is visibly empty when nothing clears
 * (`empty-proof-slot`), never backfilled with a substitute claim.
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
  proof,
  proofEmptySentence,
  locale = "de",
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
        <div className={styles.proof}>
          {proof ?? <EmptyProofSlot locale={locale} sentence={proofEmptySentence} />}
        </div>
      </div>
    </div>
  );
}
