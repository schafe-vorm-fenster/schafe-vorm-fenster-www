import { MediaFrame } from "../media-frame/media-frame";
import { PriceTag, type PriceDisplay, type PriceFigure } from "../price-tag/price-tag";

import type { DataState } from "../data-state";
import type { ReactNode } from "react";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./origin-story.module.css";

export interface OriginStoryProps {
  /** Fixed by TS-027 D3, from brand-identity's own "## Origin story" section. */
  readonly headline?: string;
  /** The causal chain: village → free community calendar → the licence. */
  readonly body: string;
  readonly priceDisplay: PriceDisplay;
  readonly priceFigure?: PriceFigure;
  readonly portraitSrc?: string;
  readonly portraitAlt: string;
  readonly portraitState?: DataState;
  readonly portraitNotDepicting?: boolean;
  /** The rights holder's attribution string, verbatim, where one is required. */
  readonly portraitCredit?: string;
  /**
   * The page's language — the portrait's own badges read it. Without it the
   * founder's portrait on `/en/about` carried "Nicht motivgenau ·
   * Platzhalter" (F-2-33).
   */
  readonly locale?: Locale;
  /** The inline `proof-card` for the honorary-mayor claim. */
  readonly proof?: ReactNode;
  readonly className?: string;
}

/**
 * 35 `origin-story` [PROPOSED] — content type 13 `origin-story`, TS-027 D3.
 *
 * Structure: the page's one `h1`, "Gebaut in einem Dorf, betrieben aus einem
 * Dorf." · the causal chain (a village of ~400 → the free community calendar
 * → the 480 € licence, the figure via `price-tag`) · the founder's photo ·
 * one inline `proof-card` for the honorary-mayor claim.
 * States: the founder photo carries its own D-9 states through
 * `media-frame` — not depicting the claim gets `placeholder-badge`, missing
 * gets `placeholder-surface`, both `media-frame`'s own contract.
 * Inherits: an ink-gradient `photo-surface` treatment at `ratio-hero` is
 * this page's LCP element in the design system's intent; this component
 * renders the portrait through `media-frame` at `ratio-portrait` so the
 * page composes the actual hero separately, once, for the one `h1`.
 * Space: the portrait's ratio is declared before it loads.
 * A11y: the headline is the page's only `h1` — the caller must render at
 * most one `origin-story` per page tree.
 */
export function OriginStory({
  headline = "Gebaut in einem Dorf, betrieben aus einem Dorf.",
  body,
  priceDisplay,
  priceFigure,
  portraitSrc,
  portraitAlt,
  portraitState,
  portraitNotDepicting,
  portraitCredit,
  locale,
  proof,
  className,
}: OriginStoryProps) {
  return (
    <div className={[styles.story, className].filter(Boolean).join(" ")}>
      <h1 className={styles.headline}>{headline}</h1>
      <div className={styles.layout}>
        <div className={styles.text}>
          <p className={styles.body}>{body}</p>
          <PriceTag display={priceDisplay} figure={priceFigure} />
        </div>
        <MediaFrame
          alt={portraitAlt}
          caption={portraitCredit}
          className={styles.portrait}
          locale={locale}
          notDepicting={portraitNotDepicting}
          // TS-003 D2 declares this portrait as `/ueber-uns`'s LCP element,
          // and the browser agrees: QA measured it as the LCP on the same
          // load, carrying `loading="lazy"` (F-3-2). `origin-story` is the
          // page's first block and stands on no other route, so the
          // declaration belongs here rather than as one more caller prop.
          priority
          ratio="portrait"
          src={portraitSrc}
          state={portraitState}
        />
      </div>
      {proof ? <div className={styles.proof}>{proof}</div> : null}
    </div>
  );
}
