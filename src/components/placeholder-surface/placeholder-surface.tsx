import type { ReactNode } from "react";
import type { CSSProperties } from "react";

import styles from "./placeholder-surface.module.css";

export interface PlaceholderSurfaceProps {
  /** The ratio of the box the photograph will fill. */
  readonly ratio?: "hero" | "feature" | "proof" | "map" | "portrait" | "square";
  /** `row` is the flat inline form for the archive, which has no conversion. */
  readonly variant?: "surface" | "row";
  /** Kept so callers need not change while photography is being sourced. */
  readonly cta?: ReactNode;
  readonly className?: string;
}

/**
 * 58 `placeholder-surface` [PROPOSED] — SRC-014 §Photo surface.
 *
 * Structure: a flat brand-colour surface at the ratio the photograph will
 * fill. No hatch, no badge, no caption — Jan's decision of 2026-09-18: the
 * site must read as finished, so a slot still waiting for its photograph
 * shows a calm surface from the design system's colour sections and says
 * nothing about itself. The marking lives in the content frontmatter
 * (`images[].provenance`), in `data-placeholder` on the surrounding
 * `photo-surface`/`media-frame`, and in `state/open.md`.
 * States: terminal, not transitional. It is where a skeleton that outlives
 * two seconds ends up.
 * Inherits: `--color-neutral-surface2`, the design system's quietest ground.
 * Space: the declared ratio of the box, so nothing moves when the photograph
 * arrives.
 * A11y: no text and no role — an empty decorative ground, hidden from
 * assistive technology rather than announced as an empty region.
 */
export function PlaceholderSurface({
  ratio = "feature",
  variant = "surface",
  className,
}: PlaceholderSurfaceProps) {
  if (variant === "row") {
    return <span aria-hidden="true" className={[styles.row, className].filter(Boolean).join(" ")} />;
  }

  return (
    <div
      aria-hidden="true"
      className={[styles.surface, className].filter(Boolean).join(" ")}
      style={{ "--placeholder-ratio": `var(--ratio-${ratio})` } as CSSProperties}
    />
  );
}
