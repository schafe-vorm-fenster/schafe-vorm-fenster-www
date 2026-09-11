import { Badge } from "../badge/badge";

import type { ReactNode } from "react";
import type { CSSProperties } from "react";

import styles from "./placeholder-surface.module.css";

export interface PlaceholderSurfaceProps {
  /** The ratio of the box the missing photograph would have filled. */
  readonly ratio?: "hero" | "feature" | "proof" | "map" | "portrait" | "square";
  readonly badgeLabel?: string;
  /** The invitation. Copy arrives with the page (M3); this is the fallback. */
  readonly headline?: string;
  readonly body?: string;
  /** The conversion this surface carries. Omitted on `/ueber-uns/archiv`. */
  readonly cta?: ReactNode;
  /** `row` is the text-only form for the archive, which has no conversion. */
  readonly variant?: "surface" | "row";
  readonly className?: string;
}

/**
 * 58 `placeholder-surface` [PROPOSED] — SRC-014 §Photo surface.
 *
 * Structure: a missing photograph becomes the diagonal hatch of `surface-2`
 * and `line`, with the badge "Foto gesucht" and an invitation to contribute
 * one. No stock photography, ever — the honest hatch is better and doubles as
 * a conversion.
 * States: terminal, not transitional. It is where a skeleton that outlives
 * two seconds ends up, and it is a conversion, so it carries its CTA —
 * except on `/ueber-uns/archiv`, which has no conversion and therefore takes
 * `variant="row"`, a text-only line (TS-028 D6).
 * Inherits: the hatch tokens; the badge in the placeholder pair (6.0:1),
 * radius 999 — the inventory's reading of the design system's one
 * placeholder pair, rather than the board's himbeere fill, so that the
 * "this is not real" register stays one colour.
 * Space: the declared ratio of the box it replaces, so nothing moves.
 * A11y: real content in the accessibility tree — never `aria-hidden`.
 */
export function PlaceholderSurface({
  ratio = "feature",
  badgeLabel = "Foto gesucht",
  headline = "Uns fehlt hier ein Bild aus deinem Ort.",
  body,
  cta,
  variant = "surface",
  className,
}: PlaceholderSurfaceProps) {
  if (variant === "row") {
    return (
      <p className={[styles.row, className].filter(Boolean).join(" ")}>
        <Badge tone="placeholder">{badgeLabel}</Badge>
        <span>{headline}</span>
      </p>
    );
  }

  return (
    <section
      className={[styles.surface, className].filter(Boolean).join(" ")}
      style={{ "--placeholder-ratio": `var(--ratio-${ratio})` } as CSSProperties}
    >
      <div className={styles.content}>
        <Badge tone="placeholder">{badgeLabel}</Badge>
        <p className={styles.headline}>{headline}</p>
        {body ? <p className={styles.body}>{body}</p> : null}
        {cta ? <div className={styles.cta}>{cta}</div> : null}
      </div>
    </section>
  );
}
