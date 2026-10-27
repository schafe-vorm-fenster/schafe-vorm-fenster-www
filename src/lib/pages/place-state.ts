"use client";

/**
 * What `?ort=` resolves to, for the **flows** — DEC-0163.
 *
 * `/dein-ort/starten`, `/mitmachen/registrieren` and `/dein-kalender/bestellen`
 * need the resolver's full answer (the register lookup as well as the
 * outcome) for their own steps. `/` and `/dein-ort` do not read this module
 * any more: their place, its dates verdict and its photograph come from the
 * one store in `active-place.ts` (DEC-0168), so no island resolves the URL a
 * second time.
 */

import { liveRoutes, useJson } from "@/src/lib/live/browser";
import { useQuery } from "@/src/lib/pages/query-store";

import type { PlaceResolution } from "@/app/api/places/resolve/route";

/** The page's raw `?ort=` value, `undefined` without one or before the query is known. */
export function usePlaceParameter(): string | undefined {
  const query = useQuery();
  const value = query?.get("ort");
  return value === null || value === undefined || value === "" ? undefined : value;
}

/** The resolver's full answer for `?ort=`, for the flows that need the register lookup too. */
export function usePlaceResolution(raw: string | undefined): PlaceResolution | undefined | "pending" {
  const settled = useJson<PlaceResolution, PlaceResolution | undefined>(
    raw === undefined ? undefined : liveRoutes.resolvePlace(raw),
    (value) => value ?? undefined,
  );
  if (raw === undefined) return undefined;
  if (typeof settled === "object" && settled !== null && "status" in settled) return "pending";
  return settled;
}
