"use client";

/**
 * The stage's place photograph — DEC-0167, DEC-0168, SRC-0014 §Photo surface
 * ("A place shows its own photograph").
 *
 * `/` and `/dein-ort` prerender their stage with the page's own photograph
 * (the LCP). This island reads the **active place** (`active-place.ts`, the
 * one source of truth the headline, the rows and the calendar link read too)
 * and makes the stage agree with it:
 *
 *  - **no place established yet** (`unknown`, `resolving`, `uncovered`) →
 *    nothing changes: the prerendered stage stands and nothing is asked;
 *  - **the page's own photograph depicts the active place** (`ownPhotoPlace`,
 *    the inventory's `place`) → it stands, and nothing is asked: `/` shows the
 *    Melkerschule while its example is Schlatkow;
 *  - otherwise the store loads the place's photograph — chosen *or* example —
 *    and, once the browser holds it, it is laid over the stage
 *    (`photo-layer.tsx`) with its © credit (`photo-credit.tsx`, issue #78);
 *  - **while it loads**, the page's own photograph is labelled "Beispielfoto",
 *    so a headline naming one place never stands over an unlabelled
 *    photograph of another (issue #80); **without one** (204, a failure, an
 *    image that does not load) the label says so (Q-0089, DEC-0167 §4).
 *
 * Nothing here occupies space: the layer, the label and the credit are out of
 * flow, so the stage's geometry is the prerendered one (TS-WEB-0009-A8).
 */

import { useEffect } from "react";

import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { PhotoCredit } from "@/src/components/photo-surface/photo-credit";
import { PhotoLayer } from "@/src/components/photo-surface/photo-layer";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { fillTemplate } from "@/src/lib/pages/demo-content";
import { placeOf, requestPlacePhoto, useActivePlace } from "@/src/lib/pages/active-place";

import type { Locale } from "@/src/lib/i18n/locales";

/** `Melkerschule Schlatkow.jpg` → `Melkerschule Schlatkow` — the work's title in the credit. */
function titleOf(fileName: string): string {
  return fileName.replace(/\.[a-z0-9]{2,5}$/iu, "");
}

export interface PlacePhotoLayerProps {
  readonly locale: Locale;
  /** The covered place the page's own stage photograph depicts, where it depicts one. */
  readonly ownPhotoPlace?: string;
}

export function PlacePhotoLayer({ locale, ownPhotoPlace }: PlacePhotoLayerProps) {
  const active = useActivePlace();
  const place = placeOf(active);
  const wanted = place !== undefined && place.slug !== ownPhotoPlace ? place.slug : undefined;
  const words = dictionary(locale).placePhoto;

  useEffect(() => {
    if (wanted !== undefined) requestPlacePhoto(wanted);
  }, [wanted, active.generation]);

  if (wanted === undefined || place === undefined || !("photo" in active)) return null;
  const { photo } = active;

  if (photo.status === "ready") {
    const { photo: shown } = photo;
    return (
      <PhotoLayer
        credit={
          <PhotoCredit locale={locale}>
            <p>
              {dictionary(locale).photoCredit.lead}:{" "}
              <OutboundLink href={shown.sourceUrl} locale={locale} variant="inline">
                {titleOf(shown.fileName)}
              </OutboundLink>
              {shown.author ? ` – ${shown.author}` : ""}, {shown.licence}, {words.via}
            </p>
          </PhotoCredit>
        }
        depicts={place.slug}
        src={shown.src}
      />
    );
  }

  if (photo.status === "none") {
    return <PhotoLayer note={fillTemplate(words.fallback, { place: place.name })} noteKind="fallback" />;
  }

  // Asked for, not here yet: the stage's own photograph, said to be an example.
  return <PhotoLayer note={words.pending} noteKind="pending" />;
}
