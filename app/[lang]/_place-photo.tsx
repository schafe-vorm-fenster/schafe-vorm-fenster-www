"use client";

/**
 * The stage's place photograph — DEC-0167, issue #18, SRC-0014 §Photo
 * surface ("A place shows its own photograph").
 *
 * `/` and `/dein-ort` prerender their stage with the page's own photograph
 * (the LCP, unchanged for every visit without `?ort=`). Once `place-state.ts`
 * has established a covered place, this island asks
 * `/api/places/{slug}/photo` and:
 *
 *  - **the place has a usable photograph** → it is loaded first and then laid
 *    over the stage (`photo-layer.tsx`) with its credit line — author,
 *    licence, the Commons file page. Until it has loaded nothing changes, so
 *    the swap is one step and never a blank;
 *  - **it has none** (204), or the image fails to load → the page's own
 *    photograph stays, and the corner says honestly that it is an example and
 *    not this place (Q-0089, resolved by DEC-0167). Never another place's
 *    photograph presented as this one.
 *
 * Nothing here occupies space: the layer and the line are out of flow, so the
 * stage's geometry is the prerendered one (TS-WEB-0009-A8).
 */

import { useEffect, useState } from "react";

import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { PhotoLayer } from "@/src/components/photo-surface/photo-layer";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { liveRoutes, useLive } from "@/src/lib/live/browser";
import { fillTemplate } from "@/src/lib/pages/demo-content";
import { usePlaceState } from "@/src/lib/pages/place-state";

import type { Locale } from "@/src/lib/i18n/locales";
import type { PlacePhoto } from "@/src/lib/live/types";

/** `Melkerschule Schlatkow.jpg` → `Melkerschule Schlatkow` — the work's title in the credit. */
function titleOf(fileName: string): string {
  return fileName.replace(/\.[a-z0-9]{2,5}$/iu, "");
}

/** Whether the browser has the image yet — `ready`, `failed`, or still `loading`. */
function useImageLoad(src: string | undefined): "loading" | "ready" | "failed" {
  const [settled, setSettled] = useState<{ readonly src: string; readonly ok: boolean } | undefined>(undefined);
  useEffect(() => {
    if (src === undefined) return;
    let current = true;
    const image = new Image();
    image.onload = () => {
      if (current) setSettled({ src, ok: true });
    };
    image.onerror = () => {
      if (current) setSettled({ src, ok: false });
    };
    image.src = src;
    return () => {
      current = false;
    };
  }, [src]);
  if (src === undefined || settled?.src !== src) return "loading";
  return settled.ok ? "ready" : "failed";
}

export function PlacePhotoLayer({ locale }: { readonly locale: Locale }) {
  const state = usePlaceState();
  const place = state.kind === "covered" ? state.place : undefined;
  const answer = useLive<PlacePhoto>(place === undefined ? undefined : liveRoutes.placePhoto(place.slug));
  const photo = answer.status === "ready" ? answer.envelope.data : undefined;
  const image = useImageLoad(photo?.src);
  const words = dictionary(locale).placePhoto;

  // No place, or the answer is still on its way: the prerendered stage stands.
  if (place === undefined || answer.status === "loading") return null;

  if (photo !== undefined && image === "ready") {
    return (
      <PhotoLayer
        depicts={place.slug}
        src={photo.src}
        note={
          <>
            {words.photo}:{" "}
            <OutboundLink href={photo.sourceUrl} locale={locale} variant="inline">
              {titleOf(photo.fileName)}
            </OutboundLink>
            {photo.author ? ` – ${photo.author}` : ""}, {photo.licence}, {words.via}
          </>
        }
        noteKind="credit"
      />
    );
  }

  // The photograph exists but has not arrived yet: change nothing until it has.
  if (photo !== undefined && image === "loading") return null;

  return <PhotoLayer note={fillTemplate(words.fallback, { place: place.name })} noteKind="fallback" />;
}
