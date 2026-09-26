import { MediaFrame } from "../media-frame/media-frame";
import { PriceTag, type PriceDisplay, type PriceFigure } from "../price-tag/price-tag";

import type { DataState } from "../data-state";
import type { ReactNode } from "react";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./origin-story.module.css";

export interface OriginStoryProps {
  /**
   * The page's `h1`, where this block carries it.
   *
   * There is **no default any more**: `DEC-0083 §5` released the fixed headline
   * ("Gebaut in einem Dorf, betrieben aus einem Dorf." — literally untrue, the
   * service runs in a data centre, CG-033), and TS-WEB-0027 D3 asserts that an
   * `h1` exists and what it must achieve, never its wording. A headline this
   * component held would be a second home for a sentence whose one home is
   * `content/pages/**`. Without it, nothing is rendered.
   */
  readonly headline?: string;
  /**
   * `false` where the page's own hero already carries the `h1` (polish brief
   * page 10, item 1: the hero is the headline plus the photograph, and the
   * village argument moves into the section below it). The block then renders
   * the argument, the portrait and the proof card without a second heading —
   * the page still has exactly one `h1`.
   */
  readonly showHeadline?: boolean;
  /**
   * The village argument — one paragraph per step of `DEC-0084 §2`: the need
   * everyone who volunteers has → what the market answers with → what follows
   * from that, the free community calendar and the licence priced as a
   * licence. A single string is the one-paragraph form.
   */
  readonly body: string | readonly string[];
  readonly priceDisplay: PriceDisplay;
  readonly priceFigure?: PriceFigure;
  readonly portraitSrc?: string;
  readonly portraitAlt: string;
  readonly portraitState?: DataState;
  readonly portraitNotDepicting?: boolean;
  /** The rights holder's attribution string, verbatim, where one is required. */
  readonly portraitCredit?: string;
  /**
   * `true` lets the portrait run to the section's gutter below `lg` and fill
   * its column above it, instead of sitting in a 320 px box inside the text
   * (review R-ueber-8: "Das Porträt sollten wir eher vollflächig zeigen und
   * nicht so hineingepackt"). It stays inside the section, so the page keeps
   * exactly one photo section (TS-WEB-0027-A2).
   */
  readonly portraitBleed?: boolean;
  /**
   * The page's language — the portrait's own badges read it. Without it the
   * founder's portrait on `/en/about` carried "Nicht motivgenau ·
   * Platzhalter" (F-2-33).
   */
  readonly locale?: Locale;
  /** The inline `proof-card` for the honorary-mayor claim. */
  readonly proof?: ReactNode;
  /**
   * Where the proof stands relative to the argument. `"after"` is the reading
   * order D3 lists; `"before"` is what TS-WEB-0027-A3 requires of the **position**
   * — "at 1280 × 800 the first viewport contains exactly one `h1` and the
   * honorary-mayor claim with its proof element". Below a `ratio-hero`
   * photograph (21/9 → 549 px at 1280) three paragraphs of argument do not fit
   * above the fold, so the claim leads the section and the argument follows it
   * (DEC-0132 §2). D3 fixes the argument's own internal order (DEC-0084 §2), not
   * where the proof sentence sits beside it.
   */
  readonly proofPosition?: "before" | "after";
  readonly className?: string;
}

/**
 * 35 `origin-story` [PROPOSED] — content type 13 `origin-story`, TS-WEB-0027 D3.
 *
 * Structure: the page's one `h1` where the page does not carry it itself · the
 * village argument in `DEC-0084 §2` order, one paragraph per step · the
 * founder's photo · one inline `proof-card` for the honorary-mayor claim.
 * States: the founder photo carries its own D-9 states through
 * `media-frame` — not depicting the claim gets `placeholder-badge`, missing
 * gets `placeholder-surface`, both `media-frame`'s own contract.
 * Inherits: the portrait renders through `media-frame` at `ratio-portrait`, so
 * the page composes its actual photo hero separately, once, for the one `h1`.
 * Space: the portrait's ratio is declared before it loads.
 * A11y: the headline is the page's only `h1` — the caller must render at
 * most one `origin-story` per page tree.
 *
 * What it no longer states: the price figure is `price-tag`'s, read from
 * `@schafe-vorm-fenster/offerings`, and the headline is the content
 * artifact's. Neither is a literal here (TS-WEB-0027-A4: no figure for the
 * village's size is hard-coded in page or component source either).
 */
export function OriginStory({
  headline,
  showHeadline = true,
  body,
  priceDisplay,
  priceFigure,
  portraitSrc,
  portraitAlt,
  portraitState,
  portraitNotDepicting,
  portraitCredit,
  portraitBleed = false,
  locale,
  proof,
  proofPosition = "after",
  className,
}: OriginStoryProps) {
  const paragraphs = typeof body === "string" ? [body] : body;
  const proofBlock = proof ? <div className={styles.proof}>{proof}</div> : null;

  return (
    <div className={[styles.story, className].filter(Boolean).join(" ")}>
      {showHeadline && headline ? <h1 className={styles.headline}>{headline}</h1> : null}
      {proofPosition === "before" ? proofBlock : null}
      <div className={[styles.layout, portraitBleed ? styles.bleed : undefined]
        .filter(Boolean)
        .join(" ")}
      >
        <div className={styles.text}>
          {paragraphs.map((paragraph) => (
            <p className={styles.body} key={paragraph}>
              {paragraph}
            </p>
          ))}
          <PriceTag display={priceDisplay} figure={priceFigure} />
        </div>
        <MediaFrame
          alt={portraitAlt}
          caption={portraitCredit}
          className={styles.portrait}
          locale={locale}
          notDepicting={portraitNotDepicting}
          // TS-WEB-0003 D2 declares this portrait as `/ueber-uns`'s LCP element,
          // and the browser agrees: QA measured it as the LCP on the same
          // load, carrying `loading="lazy"` (F-3-2). `origin-story` stands on
          // no other route, so the declaration belongs here rather than as one
          // more caller prop.
          priority
          ratio="portrait"
          src={portraitSrc}
          state={portraitState}
        />
      </div>
      {proofPosition === "after" ? proofBlock : null}
    </div>
  );
}
