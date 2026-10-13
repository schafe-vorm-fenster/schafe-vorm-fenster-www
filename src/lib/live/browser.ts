/**
 * The browser half of the live-data layer — DEC-0163.
 *
 * Every page is static HTML, so a live module renders its frame and its
 * skeleton at the final geometry in the prerendered document and fills it
 * here, after hydration, from this site's own `/api/*` routes (TS-WEB-0008
 * D10: the browser talks to this origin only). The routes keep doing what
 * they did — the upstream call, the three tiers, the CDN `Cache-Control` of
 * TS-WEB-0003 D5 — and answer the one envelope shape `bff.ts` defines.
 *
 * Two rules this module holds for every caller:
 *
 *  - **one request per URL per page view.** Several modules on one page read
 *    the same answer (`/dein-ort`'s position 1, its story picks and its
 *    homescreen block all read the place's dates); the in-flight promise is
 *    shared, so they agree and the BFF is asked once;
 *  - **no answer is never an error sentence.** A 204, a 404 or a network
 *    failure is `absent`, and the module that asked removes itself — the same
 *    "removed, never zeroed" rule the server islands followed (TS-WEB-0009 D6).
 */

"use client";

import { useEffect, useState } from "react";

import type { BffResponse } from "./bff";

export type LiveLoad<T> =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly envelope: BffResponse<T> }
  | { readonly status: "absent" };

/** How long a settled answer is reused within one page session. */
const REUSE_MS = 60_000;

const inflight = new Map<string, { readonly at: number; readonly answer: Promise<unknown> }>();

/** Test seam. */
export function resetLiveCache(): void {
  inflight.clear();
}

/**
 * A BFF response → what a module renders from: the body of a 200, `null` for
 * anything else (204 "remove the module", 404 "not covered", an error). The
 * one mapping `fetchJson` applies — exported so a test can run a real route's
 * response through it.
 */
export async function settleResponse<T>(response: Response): Promise<T | null> {
  return response.status === 200 ? ((await response.json()) as T) : null;
}

/** The module state an envelope (or its absence) puts a live module in. */
export function loadOf<T>(envelope: BffResponse<T> | null): LiveLoad<T> {
  return envelope === null ? { status: "absent" } : { status: "ready", envelope };
}

/** One GET of a same-origin JSON route; `null` for anything but a 200 with a body. */
export function fetchJson<T>(url: string): Promise<T | null> {
  const now = Date.now();
  const hit = inflight.get(url);
  if (hit && now - hit.at < REUSE_MS) return hit.answer as Promise<T | null>;

  // `no-store` keeps the *browser's* HTTP cache out of it. The routes send
  // `s-maxage` + `stale-while-revalidate` for the CDN (TS-WEB-0003 D5,
  // DEC-0019), and a browser that honours the SWR half serves a stale answer
  // and revalidates in the background on every reload — measured: those
  // background requests never settle for an automated browser waiting on the
  // network. The CDN still answers from its cache; only the private copy goes.
  const answer = fetch(url, {
    headers: { accept: "application/json" },
    credentials: "same-origin",
    cache: "no-store",
  })
    .then((response) => settleResponse<T>(response))
    .catch(() => null);
  inflight.set(url, { at: now, answer });
  return answer;
}

/** The envelope of one BFF route, or `null` when the module must be removed. */
export function fetchLive<T>(url: string): Promise<BffResponse<T> | null> {
  return fetchJson<BffResponse<T>>(url);
}

/**
 * `undefined` keeps the module in its loading state without asking anything —
 * a module whose input (the visitor's place) is not known yet.
 */
export function useLive<T>(url: string | undefined): LiveLoad<T> {
  return useJson<BffResponse<T>, LiveLoad<T>>(url, loadOf);
}

/** The same, for a route that does not answer an envelope (`/api/places/resolve`). */
export function useJson<T, R>(url: string | undefined, settle: (value: T | null) => R): R | { readonly status: "loading" } {
  const [settled, setSettled] = useState<{ readonly url: string; readonly value: R } | undefined>(undefined);

  useEffect(() => {
    if (url === undefined) return;
    let current = true;
    void fetchJson<T>(url).then((value) => {
      if (current) setSettled({ url, value: settle(value) });
    });
    return () => {
      current = false;
    };
    // `settle` is a pure mapping the caller writes inline; the URL is the key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (url === undefined || settled?.url !== url) return { status: "loading" };
  return settled.value;
}

/** Envelope → URL helpers, so no module types a BFF path by hand. */
export const liveRoutes = {
  placeEvents: (slug: string, rows: number) =>
    `/api/places/${encodeURIComponent(slug)}/events?window=upcoming&rows=${rows}`,
  placeExamples: (slug: string) => `/api/places/${encodeURIComponent(slug)}/examples`,
  nearby: (lat: number, lng: number) => `/api/nearby?lat=${lat}&lng=${lng}`,
  regionExamples: (county: string, max: number) =>
    `/api/region/${encodeURIComponent(county)}/examples?max=${max}`,
  stats: () => "/api/stats",
  resolvePlace: (ort: string) => `/api/places/resolve?ort=${encodeURIComponent(ort)}`,
} as const;
