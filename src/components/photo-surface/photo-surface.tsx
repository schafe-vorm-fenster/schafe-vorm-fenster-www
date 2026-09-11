import { isMocked, isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { PlaceholderBadge } from "../placeholder-badge/placeholder-badge";
import { PlaceholderSurface } from "../placeholder-surface/placeholder-surface";
import { Skeleton } from "../skeleton/skeleton";

import { photoUrl } from "./url";

import type { ReactNode } from "react";
import type { CSSProperties } from "react";

import styles from "./photo-surface.module.css";

export interface PhotoSurfaceProps extends DataStateProps {
  /** The photograph. Absent → the honest hatch, never a stock picture. */
  readonly src?: string;
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
    <section
      className={classes}
      data-placeholder={placeholderId}
      id={id}
      style={
        {
          "--photo-image": photoUrl(src),
          "--photo-ratio": `var(--ratio-${ratio})`,
        } as CSSProperties
      }
    >
      <div className={styles.content}>
        {(notDepicting || isMocked(state)) && (
          <div className={styles.marks}>
            {notDepicting ? <PlaceholderBadge /> : null}
            {isMocked(state) ? <DemoDataBadge /> : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
