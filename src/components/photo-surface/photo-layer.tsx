import { photoUrl } from "./url";

import type { CSSProperties, ReactNode } from "react";

import styles from "./photo-surface.module.css";

export interface PhotoLayerProps {
  /**
   * The photograph that replaces the surface's own for this view — a
   * place's photograph (DEC-0167). Absent, only `note` renders and the
   * surface keeps its picture.
   */
  readonly src?: string;
  /** What the layer depicts — the place's slug, for `data-place-photo`. */
  readonly depicts?: string;
  /**
   * The swapped-in photograph's credit — the © control and its panel
   * (`photo-credit.tsx`, issue #78), positioned by itself in the corner.
   */
  readonly credit?: ReactNode;
  /**
   * The line in the picture's top corner over the surface's **own** picture:
   * the honest label that it is not the place named (DEC-0167, Q-0089), or,
   * while the place's photograph is still loading, that it is an example
   * (DEC-0168).
   */
  readonly note?: ReactNode;
  /** `fallback` — the place has no photograph; `pending` — it is on its way. */
  readonly noteKind?: "fallback" | "pending";
}

/**
 * The swap layer of `photo-surface` — DEC-0167.
 *
 * `photo-surface` paints its photograph as the section's own background, in
 * the prerendered HTML (the LCP, TS-WEB-0003 D2). A place's photograph is
 * only known after hydration, so it arrives as this layer: absolutely
 * positioned over the whole surface, under the text stack, with the **same
 * scrim** (the surface's two gradient variables, inherited) and `cover`. It
 * occupies no space, so the swap moves nothing (TS-WEB-0009-A8).
 *
 * No focal point exists for a place photograph (the ecosystem states none),
 * so the crop is the surface's own default, `50% 40%` — never `center`
 * (DEC-0105 §2); the DEC-0153 anchor rule needs a declared focal point and
 * does not apply.
 */
export function PhotoLayer({ src, depicts, credit, note, noteKind = "fallback" }: PhotoLayerProps) {
  return (
    <>
      {src ? (
        <div
          aria-hidden="true"
          className={styles.layer}
          data-place-photo={depicts ?? ""}
          style={{ "--layer-image": photoUrl(src) } as CSSProperties}
        />
      ) : null}
      {src ? credit : null}
      {note ? (
        <p className={styles.note} data-photo-note={noteKind}>
          {note}
        </p>
      ) : null}
    </>
  );
}
