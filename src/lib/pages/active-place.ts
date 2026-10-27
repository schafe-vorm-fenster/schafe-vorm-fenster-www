"use client";

/**
 * The active place — the one source of truth for *which place* `/` and
 * `/dein-ort` speak about in the browser (DEC-0168, issue #80).
 *
 * Until DEC-0168 every island answered that question for itself: the hero,
 * the module slot, the nearby list, the story examples, the homescreen block
 * and the stage photograph each called `usePlaceState()`, which read the
 * query, asked `/api/places/resolve` and `/api/places/{slug}/events` through
 * its own `useState`, and fell back to the showcase community **implicitly**
 * (`place ?? SHOWCASE_COMMUNITY`) wherever no place was known. The photograph
 * had no such fallback, so `/dein-ort` without `?ort=` told the visitor
 * "Das ist los in Schlatkow" under a photograph of Dargitz (the review of
 * 2026-10-27, `Ist - falsches Ortsfoto.png`), and while a place was resolving
 * the modules showed the example's dates under the chosen place's URL.
 *
 * Now there is one store, and every consumer derives from one snapshot:
 *
 *  - **`unknown`** — the server snapshot and the moment before the query is
 *    read. It renders exactly the prerendered HTML and asks nothing;
 *  - **`resolving`** — `?ort=` is read and `/api/places/resolve` is on its
 *    way. It renders like `unknown`: nothing about the example is fetched or
 *    shown, because the visitor asked for another place;
 *  - **`example`** — no place was asked for (or the resolver could not
 *    answer): the configured showcase community, **as explicit state**, so
 *    the module rows, the calendar link and the stage photograph all name the
 *    same place;
 *  - **`chosen`** — a covered place, with its dates verdict (S2/S3, A/B);
 *  - **`uncovered`** — not this page; `/dein-ort` hops to the founding page.
 *
 * Every request the store makes is tied to a **generation**: a new query
 * starts a new one, and an answer that arrives for a generation that is no
 * longer current is dropped, whatever order the network delivers it in. The
 * photograph is part of the same snapshot (`photo`), loaded only when a stage
 * asks for it (`requestPlacePhoto`), preloaded before it is reported ready,
 * and aborted when its place is superseded — so headline, rows, calendar link,
 * photograph and credit cannot name different places in one render.
 */

import { useSyncExternalStore } from "react";

import { fetchJson as browserFetchJson, liveRoutes } from "@/src/lib/live/browser";
import { SHOWCASE_COMMUNITY } from "@/src/lib/live/showcase";

import { queryStore } from "./query-store";

import type { PlaceResolution } from "@/app/api/places/resolve/route";
import type { BffResponse } from "@/src/lib/live/bff";
import type { Place, PlaceEvents, PlacePhoto } from "@/src/lib/live/types";

/** Whether the chosen place has dates — TS-WEB-0019 D2's S2/S3, TS-WEB-0020 D2's A/B. */
export type DatesVerdict =
  | { readonly status: "loading" }
  | { readonly status: "known"; readonly hasDates: boolean; readonly publishInvitation: boolean };

/** The active place's photograph (DEC-0167), as far as the store knows it. */
export type PhotoSlot =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly photo: PlacePhoto }
  | { readonly status: "none" };

export type ActivePlace =
  | { readonly kind: "unknown"; readonly generation: number }
  | { readonly kind: "resolving"; readonly generation: number; readonly query: string }
  | { readonly kind: "uncovered"; readonly generation: number; readonly query: string }
  | { readonly kind: "example"; readonly generation: number; readonly place: Place; readonly photo: PhotoSlot }
  | {
      readonly kind: "chosen";
      readonly generation: number;
      readonly place: Place;
      readonly dates: DatesVerdict;
      readonly photo: PhotoSlot;
    };

/** A snapshot that names a place: `example` or `chosen`. */
export type PlacedSnapshot = Extract<ActivePlace, { readonly place: Place }>;

export function placeOf(active: ActivePlace): Place | undefined {
  return active.kind === "example" || active.kind === "chosen" ? active.place : undefined;
}

/** The configured example — SHOWCASE_COMMUNITY as a `Place`. */
export const EXAMPLE_PLACE: Place = {
  communityId: SHOWCASE_COMMUNITY.communityId,
  name: SHOWCASE_COMMUNITY.name,
  slug: SHOWCASE_COMMUNITY.slug,
  lat: SHOWCASE_COMMUNITY.lat,
  lng: SHOWCASE_COMMUNITY.lng,
  county: { id: SHOWCASE_COMMUNITY.county.id, name: SHOWCASE_COMMUNITY.county.name },
};

export const UNKNOWN: ActivePlace = { kind: "unknown", generation: 0 };

const IDLE: PhotoSlot = { status: "idle" };
const LOADING: PhotoSlot = { status: "loading" };
const NONE: PhotoSlot = { status: "none" };

export interface ActivePlaceDeps {
  /** One same-origin GET; `null` for anything but a 200 with a body (`browser.ts`). */
  readonly fetchJson: <T>(url: string) => Promise<T | null>;
  /** Whether the browser could load the image; `false` once `signal` aborts. */
  readonly loadImage: (src: string, signal: AbortSignal) => Promise<boolean>;
  readonly example?: Place;
}

export interface ActivePlaceStore {
  readonly getSnapshot: () => ActivePlace;
  readonly subscribe: (listener: () => void) => () => void;
  /** The page's query string, or `null` while it is not known. */
  readonly setQuery: (search: string | null) => void;
  /** A stage that shows the photograph asks for it; a no-op unless `slug` is the active place. */
  readonly requestPhoto: (slug: string) => void;
}

/** The raw `?ort=` value, or `undefined` for none. */
function ortOf(search: string): string | undefined {
  const value = new URLSearchParams(search).get("ort")?.trim();
  return value === undefined || value === "" ? undefined : value;
}

export function createActivePlaceStore({ fetchJson, loadImage, example = EXAMPLE_PLACE }: ActivePlaceDeps): ActivePlaceStore {
  let snapshot: ActivePlace = UNKNOWN;
  let key: string | undefined;
  let generation = 0;
  let photoAbort: AbortController | undefined;
  const listeners = new Set<() => void>();

  const commit = (next: ActivePlace) => {
    snapshot = next;
    for (const listener of listeners) listener();
  };

  /** Applies `update` to the current snapshot only while `gen` is still the current generation. */
  const settle = (gen: number, update: (current: ActivePlace) => ActivePlace | undefined) => {
    if (gen !== generation) return; // superseded: the visitor has moved on
    const next = update(snapshot);
    if (next !== undefined) commit(next);
  };

  const showExample = (gen: number) => commit({ kind: "example", generation: gen, place: example, photo: IDLE });

  const setQuery = (search: string | null) => {
    if (search === null) return;
    const ort = ortOf(search);
    const nextKey = ort === undefined ? "example" : `ort:${ort}`;
    if (nextKey === key) return;
    key = nextKey;
    generation += 1;
    photoAbort?.abort();
    photoAbort = undefined;
    const gen = generation;

    if (ort === undefined) {
      showExample(gen);
      return;
    }

    commit({ kind: "resolving", generation: gen, query: ort });
    void fetchJson<PlaceResolution>(liveRoutes.resolvePlace(ort)).then((resolution) => {
      if (gen !== generation) return;
      const outcome = resolution?.outcome;
      // The resolver did not answer, or the value was empty after its grammar:
      // nothing is established, so the page speaks about its example — openly.
      if (outcome === undefined || outcome.kind === "none") {
        showExample(gen);
        return;
      }
      if (outcome.kind === "uncovered") {
        commit({ kind: "uncovered", generation: gen, query: outcome.query });
        return;
      }
      const place = outcome.place;
      commit({ kind: "chosen", generation: gen, place, dates: { status: "loading" }, photo: IDLE });
      // The module of position 1 reads the same URL, so the answer is fetched once.
      void fetchJson<BffResponse<PlaceEvents>>(liveRoutes.placeEvents(place.slug, 3)).then((envelope) =>
        settle(gen, (current) =>
          current.kind === "chosen"
            ? {
                ...current,
                dates: {
                  status: "known",
                  hasDates: (envelope?.data.events.length ?? 0) > 0,
                  publishInvitation: envelope?.data.publishInvitation === true,
                },
              }
            : undefined,
        ),
      );
    });
  };

  const requestPhoto = (slug: string) => {
    const current = snapshot;
    if (current.kind !== "example" && current.kind !== "chosen") return;
    if (current.place.slug !== slug || current.photo.status !== "idle") return;
    const gen = generation;
    const controller = new AbortController();
    photoAbort = controller;
    commit({ ...current, photo: LOADING });

    void fetchJson<BffResponse<PlacePhoto>>(liveRoutes.placePhoto(slug))
      .then(async (envelope) => {
        if (envelope === null || gen !== generation) return null;
        // Reported ready only once the browser holds the image, so the swap is
        // one step and the credit never stands beside a picture still loading.
        return (await loadImage(envelope.data.src, controller.signal)) ? envelope.data : null;
      })
      .then((photo) =>
        settle(gen, (latest) =>
          (latest.kind === "example" || latest.kind === "chosen") && latest.place.slug === slug
            ? { ...latest, photo: photo === null ? NONE : { status: "ready", photo } }
            : undefined,
        ),
      );
  };

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setQuery,
    requestPhoto,
  };
}

/** The browser's image preload — `new Image()`, abortable. */
export function preloadImage(src: string, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve(false);
      return;
    }
    const image = new Image();
    const done = (ok: boolean) => {
      image.onload = null;
      image.onerror = null;
      resolve(ok);
    };
    image.onload = () => done(true);
    image.onerror = () => done(false);
    signal.addEventListener("abort", () => {
      image.src = "";
      done(false);
    });
    image.src = src;
  });
}

/* ------------------------------------------------------------------ */
/* The page's one store                                                 */
/* ------------------------------------------------------------------ */

let store: ActivePlaceStore | undefined;
let wired = false;

function theStore(): ActivePlaceStore {
  store ??= createActivePlaceStore({ fetchJson: browserFetchJson, loadImage: preloadImage });
  return store;
}

/** Test seam: a fresh store on the next read. */
export function resetActivePlaceStore(): void {
  store = undefined;
  wired = false;
}

function subscribe(listener: () => void): () => void {
  const active = theStore();
  const unsubscribe = active.subscribe(listener);
  // Wired to the query on the first subscriber — a page without a consumer
  // (the flows, `/mitmachen`) never resolves anything through this store.
  if (!wired) {
    wired = true;
    queryStore.subscribe(() => theStore().setQuery(queryStore.current()));
    active.setQuery(queryStore.current());
  }
  return unsubscribe;
}

/** The active place. The server snapshot is `unknown`, which is what the HTML holds. */
export function useActivePlace(): ActivePlace {
  return useSyncExternalStore(
    subscribe,
    () => theStore().getSnapshot(),
    () => UNKNOWN,
  );
}

/** A stage asks for the active place's photograph (a no-op for any other slug). */
export function requestPlacePhoto(slug: string): void {
  theStore().requestPhoto(slug);
}
