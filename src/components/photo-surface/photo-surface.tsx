import { isMocked, isPending, type DataStateProps } from "../data-state";
import { PlaceholderSurface } from "../placeholder-surface/placeholder-surface";
import { Skeleton } from "../skeleton/skeleton";

import { focalPosition, photoUrl } from "./url";

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
   * This surface carries the page's **declared** LCP element (TS-WEB-0003 D2).
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
  /**
   * **Accepted and ignored.** The ink and violet tone variants are retired —
   * one neutral-black scrim for every surface (DEC-0105 §1, design-system
   * contract `photo-surface`: one variant). The prop stays in the interface
   * so the call sites that still pass it keep compiling until their owners
   * remove it (T-14, T-19); it selects nothing.
   */
  readonly gradient?: "ink" | "violet";
  /**
   * The motif's focal point, as percentages of the frame — the inventory's
   * `focal: {x, y}` (`ImageEntrySchema`), what `background-position` takes.
   * Never `center` by default (DEC-0105 §2): absent, the stylesheet's own
   * `50% 40%` applies, which crops a sky-heavy motif's sky away and lands the
   * subject above the reading band's opaque end.
   */
  readonly focal?: { readonly x: number; readonly y: number };
  readonly ratio?: "hero" | "feature";
  /**
   * The photo does not depict what the copy claims. It reaches the markup as
   * `data-provenance="generated"` and nothing else — Jan, 2026-09-18.
   */
  readonly notDepicting?: boolean;
  readonly id?: string;
  /** The manifest slot id when this surface shows a generated image (DEC-0068). */
  readonly placeholderId?: string;
  /**
   * Kept in the interface so every page composes the surface the same way;
   * the surface itself renders no words of its own any more.
   */
  readonly locale?: Locale;
  readonly className?: string;
  readonly children?: ReactNode;
}

/**
 * 6 `photo-surface` [FIXED] — SRC-0014 §Photo surface.
 *
 * Structure: a full-width section with no radius and no border. The
 * photograph is the section's background layer with the scrim above it *in
 * the same declaration* — the design system's fixed neutral-black ladder,
 * two gradients (the top band that carries the header, the reading band
 * under the text stack), ceiling 0.72, never a tint of ink or violet
 * (DEC-0105 §1). One treatment for every surface; the crop follows the
 * motif's `focal` point, and every piece of type on the surface carries the
 * soft `shadow.textOnPhoto`. The placeholder and demo marks sit in the
 * picture's top corner, not in the text stack: they mark the photograph, and
 * inside the stack they pushed the copy a badge's height further up the
 * picture.
 * States (D-9, all four):
 *   loading  → the `skeleton` hatch at the same ratio;
 *   empty    → `placeholder-surface`: a flat brand-colour ground at the same
 *              ratio, with nothing written on it (Jan, 2026-09-18);
 *   degraded → the section renders with whatever image it has; a missing one
 *              is the empty case, so there is no third visual;
 *   mocked   → the full surface, marked `data-mock="true"`.
 * Inherits: radius 0, no border, no shadow. Never adjacent to another photo
 * section — a rhythm rule `section-shell` enforces at composition time.
 * Space: the ratio is declared before the image arrives (8:9 on the phone,
 * 21:9 from the lg switch point for the hero). A surface marked `hero`
 * additionally reserves a band at its top that the text stack cannot enter —
 * ~35 % of the box at every width — so a hero with long copy still shows the
 * photograph rather than growing its box and covering all of it
 * (`state/open.md` row 203).
 * A11y: the photograph is a background and carries no alt — an image that
 * carries meaning belongs in `media-frame`. The scrim half of the contrast
 * pair is the fixed ladder `pnpm check:contrast` measures (NFR-WEB-0058/0059);
 * the photograph's half is the motif rule — a picture that only works when
 * the scrim covers its subject is the wrong picture (DEC-0105 §2).
 */
export function PhotoSurface({
  src,
  wideSrc,
  priority = false,
  hero = false,
  focal,
  ratio = "hero",
  notDepicting = false,
  state = "ready",
  id,
  placeholderId,
  className,
  children,
}: PhotoSurfaceProps) {
  const classes = [styles.surface, className].filter(Boolean).join(" ");

  if (isPending(state)) {
    return <Skeleton className={className} ratio={ratio} variant="box" />;
  }

  /*
   * `empty` is a statement about *this surface's own asset*, and it removes
   * the photograph only where the surface **is** the asset — a standalone
   * photo slot with nothing in it. A surface that wraps content is a hero,
   * and its `state` is the state of the copy the caller renders inside it:
   * `/mitmachen` and `/deine-region` both pass `slotState(hero)`, their
   * headline slot's own state, and in the production build that slot is
   * `empty` (its content is still `status: draft`). The surface then dropped
   * the photograph, `data-hero` with it, and the two pages shipped a hero
   * with no picture and a solid header — in the build, while `next dev`
   * showed the photograph. An absent copy slot is not an absent photograph.
   */
  const missingPhoto = !src || (state === "empty" && !children);

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
      <PlaceholderSurface className={className} ratio={ratio} />
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
      data-mock={isMocked(state) ? "true" : undefined}
      data-placeholder={missingPhoto ? "true" : placeholderId}
      data-provenance={notDepicting && !missingPhoto ? "generated" : undefined}
      id={id}
      style={
        {
          "--photo-image": missingPhoto ? "none" : photoUrl(src!),
          ...(wideSrc && !missingPhoto ? { "--photo-image-wide": photoUrl(wideSrc) } : {}),
          ...(focal ? { "--photo-focal": focalPosition(focal) } : {}),
          "--photo-ratio": `var(--ratio-${ratio})`,
        } as CSSProperties
      }
    >
      {/* F-3-R1: the marks left the text stack — and, since Jan's decision
          of 2026-09-18, the page entirely. What this surface is standing in
          for is readable from `data-placeholder`, `data-provenance` and
          `data-mock` above, and from `state/open.md`; a visitor sees a
          finished picture or a finished flat ground, never a label. */}
      <div className={styles.content}>{children}</div>
    </section>
    </>
  );
}
