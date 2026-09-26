import { FreshnessLabel, type FreshnessTier } from "../freshness-label/freshness-label";

import type { MechanismId } from "../content-fragments";
import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

import styles from "./scene-block.module.css";

export interface SceneBlockProps {
  /** Exactly one mechanism per block (TS-WEB-0006 D7) — a second one is two blocks. */
  readonly mechanism: MechanismId;
  /**
   * The opener, and the block heading. It is a **statement**: a question mark
   * is allowed only where this same block renders the answering sentence
   * directly beneath it (TS-WEB-0006 D7, SRC-0017 CG-005/CG-006,
   * TS-WEB-0019-A6). It was documented here as "the visitor's own question",
   * which the 2026-09-22 review rejected — "wenn dann nur Fragen, die direkt
   * an den user gerichtet sind und die wir danach beantworten".
   */
  readonly opener: string;
  readonly body?: string;
  /**
   * D7 item 2 — the mechanism, where a component renders it. On `/` the
   * `whatsapp` scene's mechanism **is** the `explain-module` (DEC-0110 §1):
   * it stands between the opener and the instance, and it brings its own
   * single `data-cta="secondary"`, so the scene adds none ("wrapping does not
   * double the CTA"). Every other scene leaves this empty and renders its
   * mechanism as prose plus its instance.
   */
  readonly module?: ReactNode;
  /** The concrete instance — a live module, an event row, or a proof card. */
  readonly instance: ReactNode;
  /** The instance's own freshness, if it comes from a live or cached source. */
  readonly freshnessTier?: FreshnessTier;
  readonly freshnessUpdatedAt?: string | Date;
  /** Secondary treatment only — the scene never carries the primary CTA. */
  readonly cta?: ReactNode;
  /**
   * `true` where the section around this scene is **uncontained**: the text
   * takes the page container and the instance runs edge to edge. SRC-0014
   * §"Section grounds carry rhythm, not meaning": "Images inside a colour
   * section run full-bleed … either the photo is its own photo section at
   * full width, or it is not in the section at all." The scene stays one
   * block — opener, mechanism and instance together (CG-004) — while its
   * photograph stops being a picture in a mount.
   */
  readonly bleed?: boolean;
  readonly locale?: Locale;
  readonly id?: string;
  readonly className?: string;
}

/**
 * 22 `scene-block` [PROPOSED] — content type 2 `scene`, TS-WEB-0006 D7.
 *
 * Structure: three parts, always — the opener as a statement, exactly one
 * mechanism (declared, not inferred) and one concrete instance, live or
 * proof-backed. Where the mechanism is a path in steps it is rendered by the
 * `explain-module` in the `module` slot, between opener and instance
 * (DEC-0110 §1); the scene is not replaced by it and gains no exception.
 * Its own CTA, where present, is secondary — and where the module carries
 * one, the scene carries none.
 * States: the block itself holds no late data — its instance does, and the
 * instance owns its own D-9 states. The scene never disappears; what can
 * degrade is the instance's freshness, shown here as `freshness-label`.
 * Inherits: no feature list ever stands in for the instance; alternating
 * COLOUR/PHOTO per rhythm is the page's job (`section-shell`), not this one.
 * Space: the instance declares its own ratio (typically `ratio-feature`); in
 * `bleed` mode it runs the full width of the uncontained section instead.
 * A11y: the opener is the block heading — one mechanism, one heading, no
 * heading-level skip introduced by this component.
 */
export function SceneBlock({
  mechanism,
  opener,
  body,
  module,
  instance,
  freshnessTier,
  freshnessUpdatedAt,
  cta,
  bleed = false,
  locale,
  id,
  className,
}: SceneBlockProps) {
  // In `bleed` mode the scene owns the container the section gave up, so the
  // text keeps the 16 px gutter and the instance does not.
  const inner = bleed ? "container" : undefined;
  const group = (...names: (string | undefined)[]) => names.filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={group(styles.scene, bleed ? styles.bleeding : undefined, className)}
      data-mechanism={mechanism}
      id={id}
    >
      <div className={group(styles.lede, inner)}>
        <h2 className={styles.opener}>{opener}</h2>
        {body ? <p className={styles.body}>{body}</p> : null}
      </div>
      {module ? <div className={group(styles.module, inner)}>{module}</div> : null}
      <div className={group(styles.instance, bleed ? styles.bleed : undefined)}>{instance}</div>
      {freshnessTier ? (
        <div className={inner}>
          <FreshnessLabel locale={locale} tier={freshnessTier} updatedAt={freshnessUpdatedAt} />
        </div>
      ) : null}
      {cta ? <div className={group(styles.cta, inner)}>{cta}</div> : null}
    </div>
  );
}
