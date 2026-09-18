import { Icon } from "../icon/icon";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

import styles from "./outbound-link.module.css";

export interface OutboundLinkProps {
  /** The external URL. Internal targets go through `route-link` instead. */
  readonly href: string;
  /** Opens a new tab — and then the link text has to say so. */
  readonly newTab?: boolean;
  /** Named where a third party receives data by following this link. */
  readonly recipient?: string;
  /**
   * The control variants' meta line, written out instead of assembled.
   *
   * G-5: "(öffnet neuen Tab) · Daten gehen an Google" under a button is two
   * disclosures stacked into one line of machine-assembled prose, and the
   * data note belongs in the privacy section the page already links to. A
   * page that has such a section passes one finished sentence here — e.g.
   * „Öffnet Google Kalender in einem neuen Tab." — and the assembled line
   * stands down.
   */
  readonly disclosure?: string;
  readonly variant?: "inline" | "secondary" | "quiet";
  /** The conversion marker the analytics registry reads (TS-006 D3) — e.g. `"equal-weight"`. */
  readonly dataCta?: string;
  /**
   * The page's language — the new-tab announcement was hard-coded German
   * regardless of it (F-2-4, same root cause as `state/open.md` row 101).
   */
  readonly locale?: Locale;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * 16 `outbound-link` [PROPOSED] — TS-016 D9, DEC-013.
 *
 * Structure: the external link — app handover, outlet original, briefing
 * schedule, the `/start` fallback. The link text names source and subject;
 * an `external-link` glyph at 18 px sits after it; `rel="noopener"` where it
 * opens a new tab; and where a third party receives data, the recipient is
 * named in the link's own line, not in a tooltip.
 * States: static — no embed, no iframe, no third-party script. A link is the
 * privacy-preserving form of an integration (TS-016 D9).
 * Inherits: inline link treatment, or the secondary/quiet button treatment.
 * Space: inline; the glyph never shifts the line box, because it sits in an
 * inline-flex box with the text.
 * A11y: the new-tab behaviour and the recipient stay inside the link's own
 * accessible name, so a screen-reader user is not surprised by a changed
 * context. In the two **control** variants they are read out of the visible
 * pill and printed under it as a meta line instead (G-5): inside the label
 * they made `/deine-region`'s secondary a three-line white block that
 * outweighed the page's own primary conversion. In the `inline` variant —
 * a link inside a sentence — they stay in the line, which is where a reader
 * of that sentence needs them.
 */
export function OutboundLink({
  href,
  newTab = false,
  recipient,
  disclosure: writtenDisclosure,
  variant = "inline",
  dataCta,
  locale = "de",
  className,
  children,
}: OutboundLinkProps) {
  const classes = [styles.link, styles[variant], className].filter(Boolean).join(" ");
  const words = dictionary(locale).outboundLink;
  const control = variant !== "inline";
  const assembled = (
    <>
      {newTab ? <>{" "}({words.newTab})</> : null}
      {recipient ? (
        <>
          {" "}
          · {words.dataGoesTo} {recipient}
        </>
      ) : null}
    </>
  );
  const disclosure =
    writtenDisclosure === undefined ? assembled : <>{" "}{writtenDisclosure}</>;
  const hasDisclosure = writtenDisclosure !== undefined || newTab || Boolean(recipient);

  const anchor = (
    <a
      className={classes}
      data-cta={dataCta}
      href={href}
      rel={newTab ? "noopener" : undefined}
      target={newTab ? "_blank" : undefined}
    >
      <span className={styles.text}>
        {children}
        {hasDisclosure ? (
          <span className={control ? styles.hidden : styles.hint}>{disclosure}</span>
        ) : null}
      </span>
      <Icon className={styles.glyph} name="external-link" size={18} />
    </a>
  );

  if (!control || !hasDisclosure) return anchor;

  return (
    <span className={styles.control}>
      {anchor}
      {/* `aria-hidden`: the same words are already in the link's accessible
          name above, and a screen reader reading them twice is worse than
          not seeing them at all. */}
      <span aria-hidden className={styles.meta}>
        {disclosure}
      </span>
    </span>
  );
}
