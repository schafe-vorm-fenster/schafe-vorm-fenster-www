import { Badge } from "../badge/badge";
import { isPending, type DataStateProps } from "../data-state";
import { PhotoSurface } from "../photo-surface/photo-surface";
import { Skeleton } from "../skeleton/skeleton";

import type { IconName } from "../icon/icon";
import type { CSSProperties, ReactNode } from "react";

import styles from "./hero-block.module.css";

export interface HeroBlockProps extends DataStateProps {
  readonly kicker?: string;
  readonly kickerIcon?: IconName;
  /** `display` (54/0.90/−0.045em/800) or `place-name` (50 px, may break by hand). */
  readonly variant?: "display" | "place-name";
  readonly headline: string;
  /** Reserves the headline's box before paint (SRC-014 §Reserved text space). */
  readonly headlineLines?: number;
  readonly lead?: string;
  /** The page's single conversion, marked `data-cta="primary"` by the caller. */
  readonly cta?: ReactNode;
  readonly src?: string;
  readonly gradient?: "ink" | "violet";
  readonly notDepicting?: boolean;
  readonly placeholderId?: string;
  readonly id?: string;
  readonly className?: string;
}

/**
 * 21 `hero-block` [PROPOSED] — content type 1 `hero`.
 *
 * Structure: an optional kicker `badge`, the headline as the page's one `h1`
 * in the Display or Place-name role, an optional lead, one `cta` slot, all
 * inside `photo-surface` at `ratio-hero`. Where `cta` is omitted the page's
 * `primaryConversion` is `null` (TS-006 D3) and no CTA treatment is implied.
 * States (D-9, forwarded to the inner `photo-surface`, all four): the hero
 * swaps content by place knowledge (S1/S2/S3) at the page level, not here —
 * this component's own contract is that the reserved space is identical
 * whichever branch the page renders into it.
 * Inherits: Display 54/0.90/−0.045em/800 or Place-name 50 px; a place name is
 * clamped to two lines and may break by hand; text sits in the gradient's
 * dark part (`photo-surface`'s own contract).
 * Space: `ratio-hero`; the headline reserves `headlineLines` line boxes via
 * `min-height: calc(lines × lh × 1em)` so a content swap never shifts layout.
 * A11y: exactly one `h1` per page — the caller must render at most one
 * `hero-block` per page tree. Contrast is checked against the photo-plus-
 * gradient composite by `photo-surface`, not restated here.
 */
export function HeroBlock({
  kicker,
  kickerIcon,
  variant = "display",
  headline,
  headlineLines = 2,
  lead,
  cta,
  src,
  gradient = "ink",
  notDepicting = false,
  placeholderId,
  state = "ready",
  id,
  className,
}: HeroBlockProps) {
  if (isPending(state)) {
    return <Skeleton className={className} ratio="hero" variant="box" />;
  }

  return (
    <PhotoSurface
      className={className}
      gradient={gradient}
      id={id}
      notDepicting={notDepicting}
      placeholderId={placeholderId}
      ratio="hero"
      src={src}
      state={state}
    >
      {kicker ? (
        <Badge className={styles.kicker} icon={kickerIcon} tone="accent">
          {kicker}
        </Badge>
      ) : null}
      <h1
        className={variant === "place-name" ? styles.placeName : styles.headline}
        style={{ "--hero-headline-lines": headlineLines } as CSSProperties}
      >
        {headline}
      </h1>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
      {cta ? <div className={styles.cta}>{cta}</div> : null}
    </PhotoSurface>
  );
}
