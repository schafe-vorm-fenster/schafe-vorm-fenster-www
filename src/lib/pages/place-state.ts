"use client";

/**
 * What `?ort=` resolves to, in the browser — DEC-0163.
 *
 * `/` and `/dein-ort` key their states on the place parameter (TS-WEB-0019
 * D2, TS-WEB-0020 D2). The pages are prerendered once, parameter-free, so the
 * HTML is the placeless state (S1 / S0) and this hook moves the page to the
 * stated one after hydration, through two BFF answers:
 *
 *  1. `/api/places/resolve?ort=` — TS-WEB-0008 D7's outcome, from the same
 *     `resolvePlaceOutcome()` the pages ran server-side until DEC-0163;
 *  2. for a covered place, `/api/places/{slug}/events` — whether it has dates
 *     (the S2/S3 and A/B switch). The live module of the page reads the same
 *     URL, so the answer is fetched once.
 *
 * `none` is both "no parameter" and "not known yet" — the prerendered state
 * stands until something else is established, so a visitor without `?ort=`
 * sees no change at all.
 */

import { liveRoutes, useJson, useLive } from "@/src/lib/live/browser";
import { useQuery } from "@/src/lib/pages/query-store";

import type { PlaceResolution } from "@/app/api/places/resolve/route";
import type { PlaceEvents, Place } from "@/src/lib/live/types";

export type PlaceState =
  | { readonly kind: "none" }
  | { readonly kind: "pending" }
  | { readonly kind: "uncovered"; readonly query: string }
  | {
      readonly kind: "covered";
      readonly place: Place;
      /** `undefined` while the dates are still loading. */
      readonly hasDates: boolean | undefined;
      /** TS-WEB-0008 D4's verdict off the same envelope. */
      readonly publishInvitation: boolean;
    };

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

export function usePlaceState(): PlaceState {
  const raw = usePlaceParameter();
  const resolution = usePlaceResolution(raw);
  const covered =
    resolution !== undefined && resolution !== "pending" && resolution.outcome.kind === "covered"
      ? resolution.outcome.place
      : undefined;
  const dates = useLive<PlaceEvents>(covered === undefined ? undefined : liveRoutes.placeEvents(covered.slug, 3));

  if (raw === undefined) return { kind: "none" };
  if (resolution === "pending") return { kind: "pending" };
  // The resolver did not answer at all: nothing is established, the page stays placeless.
  if (resolution === undefined) return { kind: "none" };

  const { outcome } = resolution;
  if (outcome.kind === "none") return { kind: "none" };
  if (outcome.kind === "uncovered") return { kind: "uncovered", query: outcome.query };

  if (dates.status === "loading") {
    return { kind: "covered", place: outcome.place, hasDates: undefined, publishInvitation: false };
  }
  const events = dates.status === "ready" ? dates.envelope.data : undefined;
  return {
    kind: "covered",
    place: outcome.place,
    hasDates: (events?.events.length ?? 0) > 0,
    publishInvitation: events?.publishInvitation === true,
  };
}
