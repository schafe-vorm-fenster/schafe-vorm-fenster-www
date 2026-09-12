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
  /**
   * This surface is the page's hero — the photograph the header lies on
   * until it has scrolled past (Jan's round-3 point 2). `hero-block` sets it
   * for every hero it renders; a page composing its hero out of a bare
   * `photo-surface` (`/ueber-uns`) sets it itself. It reaches the markup only
   * when a photograph actually exists: the missing-photo hatch is a light
   * ground that paper-coloured header items could not sit on.
   */
  readonly hero?: boolean;
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
 * it *in the same declaration* — transparent through 26 %, 0.84 at 62 %,
 * 0.96 at the bottom, the far end of the design system's own band — so the
 * scrim scales with the image and the text always sits in the dark part. Ink
 * gradient by default, violet for the municipal path. The placeholder and
 * demo marks sit in the picture's top corner, not in the text stack: they
 * mark the photograph, and inside the stack they pushed the copy — and the
 * content-anchored scrim with it — a badge's height further up the picture.
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
 * 21:9 from the lg switch point for the hero). A surface marked `hero`
 * additionally reserves a band at its top that the text stack cannot enter —
 * ~35 % of the box at every width — so a hero with long copy still shows the
 * photograph rather than growing its box and covering all of it
 * (`state/open.md` row 203).
 * A11y: the photograph is a background and carries no alt — an image that
 * carries meaning belongs in `media-frame`. Body text clears 4.5:1 against
 * the composite of photo plus gradient, which is why the scrim is this dark.
 */
export function PhotoSurface({
  src,
  wideSrc,
  priority = false,
  hero = false,
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
      /* The page's hero surface — what the header observes to know when it
         has scrolled off the photograph (Jan's round-3 point 2). */
      data-hero={hero && !missingPhoto ? "true" : undefined}
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
      {/* F-3-R1: the marks left the text stack. They are a mark *on the
          photograph*, not a line of the hero's copy, and standing at the top
          of the stack they pushed the headline — and with it the whole
          content-anchored scrim — a badge's height further up the picture on
          every page. They now sit in the photograph's own top corner, which
          is where the design boards put them, and the stack below is the
          copy alone. */}
      {(missingPhoto || notDepicting || isMocked(state)) && (
        <div className={styles.marks}>
          {missingPhoto ? (
            <Badge tone="placeholder">{dictionary(locale).media.photoWanted}</Badge>
          ) : null}
          {!missingPhoto && notDepicting ? <PlaceholderBadge locale={locale} /> : null}
          {isMocked(state) ? <DemoDataBadge locale={locale} /> : null}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </section>
    </>
  );
}
