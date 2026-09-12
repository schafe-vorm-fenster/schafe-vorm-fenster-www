import { Badge } from "../badge/badge";
import { isMocked, isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { PlaceholderBadge } from "../placeholder-badge/placeholder-badge";
import { PlaceholderSurface } from "../placeholder-surface/placeholder-surface";
import { Skeleton } from "../skeleton/skeleton";

import { photoUrl } from "./url";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { ReactNode } from "react";
import type { CSSProperties } from "react";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./photo-surface.module.css";

export interface PhotoSurfaceProps extends DataStateProps {
  /** The photograph. Absent → the honest hatch, never a stock picture. */
  readonly src?: string;
  /**
   * The landscape rendition of the same motif, swapped in from 48rem — the
   * width at which `--ratio-hero` turns landscape. Without it the base image
   * is used at every width.
   */
  readonly wideSrc?: string;
  /**
   * This surface carries the page's **declared** LCP element (TS-003 D2).
   * The photograph is a CSS background — the design system requires it to be
   * one (§Photo surface: photo and gradient in the same declaration), and a
   * background carries neither `loading` nor `fetchpriority`. So the priority
   * signal is a `preload` link per rendition instead, which is the instrument
   * a background image has. At most one surface per page may set it.
   */
  readonly priority?: boolean;
  /** `ink` by default, `violet` for the municipal path. */
  readonly gradient?: "ink" | "violet";
  readonly ratio?: "hero" | "feature";
  /** The photo does not depict what the copy claims → the placeholder badge. */
  readonly notDepicting?: boolean;
  /** Invitation copy for the missing-photo case. */
  readonly placeholderHeadline?: string;
  readonly placeholderCta?: ReactNode;
  readonly id?: string;
  /** The manifest slot id when this surface shows a generated image (DEC-068). */
  readonly placeholderId?: string;
  /** The page's language — the `Demo-Daten` badge and the freshness label read it. */
  readonly locale?: Locale;
  readonly className?: string;
  readonly children?: ReactNode;
}

/**
 * 6 `photo-surface` [FIXED] — SRC-014 §Photo surface.
 *
 * Structure: a full-width section with no radius and no border. The
 * photograph is the section's first background layer with the gradient above
 * it *in the same declaration* — transparent at 12–26 %, 0.82–0.86 at
 * 38–62 %, 0.96 at the bottom — so the scrim scales with the image and the
 * text always sits in the dark part. Ink gradient by default, violet for the
 * municipal path.
 * States (D-9, all four):
 *   loading  → the `skeleton` hatch at the same ratio;
 *   empty    → `placeholder-surface`: hatch, "Foto gesucht", invitation. This
 *              is a conversion, which is why it is designed, not hidden;
 *   degraded → the section renders with whatever image it has; a missing one
 *              is the empty case, so there is no third visual;
 *   mocked   → the full surface plus `demo-data-badge`.
 * Inherits: radius 0, no border, no shadow. Never adjacent to another photo
 * section — a rhythm rule `section-shell` enforces at composition time.
 * Space: the ratio is declared before the image arrives (8:9 on the phone,
 * 21:9 from the lg switch point for the hero).
 * A11y: the photograph is a background and carries no alt — an image that
 * carries meaning belongs in `media-frame`. Body text clears 4.5:1 against
 * the composite of photo plus gradient, which is why the scrim is this dark.
 */
export function PhotoSurface({
  src,
  wideSrc,
  priority = false,
  gradient = "ink",
  ratio = "hero",
  notDepicting = false,
  placeholderHeadline,
  placeholderCta,
  state = "ready",
  id,
  placeholderId,
  className,
  children,
  locale = "de",
}: PhotoSurfaceProps) {
  const classes = [
    styles.surface,
    gradient === "violet" ? styles.violet : styles.ink,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (isPending(state)) {
    return <Skeleton className={className} ratio={ratio} variant="box" />;
  }

  const missingPhoto = !src || state === "empty";

  // A surface with no content of its own (a standalone photo slot — the
  // `/ueber-uns` origin photo, an archive row) *is* the invitation: the
  // hatch, the badge, its own headline and CTA. A surface wrapping content
  // (`hero-block`, `scene-block`) must still render that content — the
  // design system's own rule is "never a text-only card without the badge",
  // which presumes the text renders; dropping the caller's `children`
  // entirely (the previous behaviour here) silently deleted the page's one
  // `h1` whenever no photograph existed, which is every hero on this site
  // today (no photography asset exists anywhere in the tree yet).
  if (missingPhoto && !children) {
    return (
      <PlaceholderSurface
        className={className}
        cta={placeholderCta}
        headline={placeholderHeadline}
        locale={locale}
        ratio={ratio}
      />
    );
  }

  return (
    <>
      {/*
        The LCP background, announced before the stylesheet that references it
        is even parsed. Two links, each behind the media query that decides
        which rendition the browser will actually paint, so the phone never
        fetches the landscape frame and the desktop never fetches the upright
        one. React hoists them into `<head>`.
      */}
      {priority && !missingPhoto ? (
        <>
          <link
            as="image"
            fetchPriority="high"
            href={src}
            media={wideSrc ? "(max-width: 47.999rem)" : undefined}
            rel="preload"
          />
          {wideSrc ? (
            <link
              as="image"
              fetchPriority="high"
              href={wideSrc}
              media="(min-width: 48rem)"
              rel="preload"
            />
          ) : null}
        </>
      ) : null}
    <section
      className={classes}
      data-placeholder={missingPhoto ? "true" : placeholderId}
      id={id}
      style={
        {
          "--photo-image": missingPhoto ? "none" : photoUrl(src!),
          ...(wideSrc && !missingPhoto ? { "--photo-image-wide": photoUrl(wideSrc) } : {}),
          "--photo-ratio": `var(--ratio-${ratio})`,
        } as CSSProperties
      }
    >
      <div className={styles.content}>
        {(missingPhoto || notDepicting || isMocked(state)) && (
          <div className={styles.marks}>
            {missingPhoto ? (
              <Badge tone="placeholder">{dictionary(locale).media.photoWanted}</Badge>
            ) : null}
            {!missingPhoto && notDepicting ? <PlaceholderBadge locale={locale} /> : null}
            {isMocked(state) ? <DemoDataBadge locale={locale} /> : null}
          </div>
        )}
        {children}
      </div>
    </section>
    </>
  );
}
