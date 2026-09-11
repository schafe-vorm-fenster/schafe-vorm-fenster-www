import Image from "next/image";

import { isMocked, isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { PlaceholderBadge } from "../placeholder-badge/placeholder-badge";
import { PlaceholderSurface } from "../placeholder-surface/placeholder-surface";
import { Skeleton } from "../skeleton/skeleton";

import type { StaticImageData } from "next/image";
import type { CSSProperties, ReactNode } from "react";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./media-frame.module.css";

export const MEDIA_RATIOS = [
  "hero",
  "feature",
  "proof",
  "map",
  "portrait",
  "square",
] as const;

export type MediaRatio = (typeof MEDIA_RATIOS)[number];

export interface MediaFrameProps extends DataStateProps {
  readonly src?: string | StaticImageData;
  /** Meaningful text from the content frontmatter, or `""` when decorative. */
  readonly alt: string;
  readonly ratio?: MediaRatio;
  /** The asset does not depict what the copy claims. */
  readonly notDepicting?: boolean;
  /** LCP candidates only — everything else loads lazily. */
  readonly priority?: boolean;
  readonly sizes?: string;
  /** Skips the image optimizer, for SVG and for hosts without a remote pattern. */
  readonly unoptimized?: boolean;
  readonly placeholderHeadline?: string;
  readonly placeholderCta?: ReactNode;
  readonly caption?: ReactNode;
  /** The manifest slot id when this frame shows a generated image (DEC-068). */
  readonly placeholderId?: string;
  /** The page's language — the `Demo-Daten` badge and the freshness label read it. */
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 19 `media-frame` [PROPOSED] — SRC-014 §Aspect Ratios.
 *
 * Structure: the ratio box for any image that is not a full-width
 * `photo-surface` — proof images, portraits, path images, screenshots. The
 * ratio sits on the box, the image is `cover` and centred.
 * States (D-9, all four):
 *   loading  → `skeleton` hatch at the same ratio;
 *   empty    → `placeholder-surface`, the "Foto gesucht" hatch;
 *   degraded → the asset renders as it is; a missing asset is the empty case;
 *   mocked   → the image plus `demo-data-badge`, and `provenance: generated`
 *              in the content metadata (dummy-content rule).
 * An asset that does not depict its claim carries `placeholder-badge` in any
 * of those states.
 * Inherits: radius 0, no border, no shadow; ratio tokens only, never a fixed
 * pixel height.
 * Space: the ratio is declared before the asset arrives — with `skeleton`,
 * this is the site's CLS defence.
 * A11y: meaningful `alt` from the content frontmatter, `alt=""` when purely
 * decorative. The caption is real text, not a tooltip.
 */
export function MediaFrame({
  src,
  alt,
  ratio = "feature",
  notDepicting = false,
  priority = false,
  sizes = "(min-width: 64rem) 33vw, 100vw",
  unoptimized,
  placeholderHeadline,
  placeholderCta,
  caption,
  placeholderId,
  state = "ready",
  className,
  locale = "de",
}: MediaFrameProps) {
  if (isPending(state)) {
    return <Skeleton className={className} ratio={ratio} variant="box" />;
  }

  if (!src || state === "empty") {
    return (
      <PlaceholderSurface
        className={className}
        cta={placeholderCta}
        headline={placeholderHeadline}
        ratio={ratio}
      />
    );
  }

  return (
    <figure
      className={[styles.frame, className].filter(Boolean).join(" ")}
      data-placeholder={placeholderId}
    >
      <div
        className={styles.box}
        style={{ "--media-ratio": `var(--ratio-${ratio})` } as CSSProperties}
      >
        <Image
          alt={alt}
          className={styles.image}
          fill
          priority={priority}
          sizes={sizes}
          src={src}
          unoptimized={unoptimized}
        />
        {(notDepicting || isMocked(state)) && (
          <div className={styles.marks}>
            {notDepicting ? <PlaceholderBadge /> : null}
            {isMocked(state) ? <DemoDataBadge locale={locale} /> : null}
          </div>
        )}
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}
