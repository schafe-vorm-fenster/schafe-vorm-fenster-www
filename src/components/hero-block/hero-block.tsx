import { Badge } from "../badge/badge";
import { isPending, type DataStateProps } from "../data-state";
import { PhotoSurface } from "../photo-surface/photo-surface";
import { Skeleton } from "../skeleton/skeleton";

import type { IconName } from "../icon/icon";
import type { CSSProperties, ReactNode } from "react";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./hero-block.module.css";

export interface HeroBlockProps extends DataStateProps {
  readonly kicker?: string;
  readonly kickerIcon?: IconName;
  /** `display` (54/0.90/−0.045em/800) or `place-name` (50 px, may break by hand). */
  readonly variant?: "display" | "place-name";
  /** Required unless `content` below replaces the whole trio. */
  readonly headline?: string;
  /** Reserves the headline's box before paint (SRC-014 §Reserved text space). */
  readonly headlineLines?: number;
  readonly lead?: string;
  /** The page's single conversion, marked `data-cta="primary"` by the caller. */
  readonly cta?: ReactNode;
  /**
   * The headline · lead · CTA trio as a node, replacing the three props
   * above — the seam DEC-078 needs.
   *
   * `/` varies exactly this trio by what is known about the place, and it
   * has to vary it *behind a `<Suspense>` boundary*, because the place is a
   * request value. Everything else the hero carries — the photograph, the
   * kicker and the search module below — stays in the prerendered shell,
   * where a streamed boundary can never replace it. The page passes the
   * boundary in here; `HeroContent` below is what both of its branches
   * render, so the fallback and the resolved branch cannot drift apart.
   */
  readonly content?: ReactNode;
  /**
   * The search module, rendered under the CTA slot and **outside** any
   * boundary the page puts in `content` (DEC-078). A control that holds what
   * a visitor types must live in the prerendered shell.
   */
  readonly search?: ReactNode;
  readonly src?: string;
  /** The hero's landscape rendition, swapped in from 48rem. */
  readonly wideSrc?: string;
  /**
   * Preload the hero photograph. Defaults to **true** whenever the hero has
   * one, because a full-bleed photograph in the page's first section is what
   * the browser paints largest and last: measured on the production build,
   * the home hero became the LCP element the moment a real photograph stood
   * in it, at 4.3 s, because a CSS background is discovered only after the
   * stylesheet is parsed. TS-003 D2's table names an image LCP for two pages
   * only — that table was written when no photograph existed anywhere, and
   * the design system's page rhythm puts one in every hero (see
   * `state/open.md`). Pass `false` for a hero that must not compete.
   */
  readonly priority?: boolean;
  readonly gradient?: "ink" | "violet";
  readonly notDepicting?: boolean;
  readonly placeholderId?: string;
  /** The page's language — forwarded to `photo-surface`'s own badges (F-2-4). */
  readonly locale?: Locale;
  readonly id?: string;
  readonly className?: string;
}

/**
 * The headline · lead · CTA trio, as its own component.
 *
 * Extracted for one reason (DEC-078): on `/` this trio is the only part of
 * the hero that varies by request, so it is the only part that may sit
 * inside a `<Suspense>` boundary. The page renders it twice — once as the
 * boundary's fallback, once as its resolved branch — and both reads go
 * through here, so "the reserved space is identical whichever branch the
 * page renders" (TS-019 D2's free choice) holds by construction rather than
 * by review.
 */
export type HeroContentProps = Pick<
  HeroBlockProps,
  "variant" | "headlineLines" | "lead" | "cta"
> & { readonly headline: string };

export function HeroContent({
  variant = "display",
  headline,
  headlineLines = 2,
  lead,
  cta,
}: HeroContentProps) {
  return (
    <>
      <h1
        className={variant === "place-name" ? styles.placeName : styles.headline}
        style={{ "--hero-headline-lines": headlineLines } as CSSProperties}
      >
        {headline}
      </h1>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
      {cta ? <div className={styles.cta}>{cta}</div> : null}
    </>
  );
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
 * Inherits: Display 54/0.90/−0.045em/800 or Place-name 50 px; the headline
 * may break by hand and is never clamped (G-8 — the two-line clamp cut
 * `/dein-ort`'s S0 sentence mid-word); text sits in the gradient's dark part
 * (`photo-surface`'s own contract).
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
  content,
  search,
  src,
  wideSrc,
  priority = true,
  gradient = "ink",
  notDepicting = false,
  placeholderId,
  locale = "de",
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
      hero
      id={id}
      locale={locale}
      notDepicting={notDepicting}
      placeholderId={placeholderId}
      priority={priority}
      ratio="hero"
      src={src}
      state={state}
      wideSrc={wideSrc}
    >
      {kicker ? (
        <Badge className={styles.kicker} icon={kickerIcon} tone="accent">
          {kicker}
        </Badge>
      ) : null}
      {content ?? (
        <HeroContent
          cta={cta}
          headline={headline ?? ""}
          headlineLines={headlineLines}
          lead={lead}
          variant={variant}
        />
      )}
      {search ? <div className={styles.cta}>{search}</div> : null}
    </PhotoSurface>
  );
}
