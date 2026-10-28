/**
 * geo-api's place lookups, cached apart from the dates — DEC-0181.
 *
 * Three questions the website asks geo-api, none of which changes with the
 * dates: which communities lie around a point (position 2's candidate set),
 * which community a slug names, and which community an id names. Their answers
 * change when geo-api's community data changes, which is practically never, so
 * each is kept for `geoLookup`'s 7 days (TS-WEB-0003 D5 as amended) while the
 * dates beside them keep their 5 minutes.
 *
 * **Where the cache lives.** In the Vercel Runtime Cache, namespace `geo`
 * — the store DEC-0046 chose for `last-good`, behind the same `LastGoodStore`
 * interface — and not in a `"use cache"` function:
 *
 *  - plain `"use cache"` is in-process memory, and in a serverless function
 *    that is gone with the instance;
 *  - `"use cache: remote"` is shared, but its key carries the build id, so
 *    every deploy would start every point cold again — for data that does
 *    not change between deploys;
 *  - a directive is a compiler transform, so no in-process test could show
 *    that the second ask is a hit. A store handed in as a parameter can.
 *
 * **The point is quantised** to the two decimals the nearby key already uses
 * (`nearby:{lat}:{lng}:{radius}`, TS-WEB-0013 D6), and geo-api is asked for the
 * quantised point, so the cached answer is exactly the answer for its key.
 * The ~15 km cut still runs on the caller's own anchor (`selectNearby`).
 *
 * **Budgets.** The point search runs on its own 3 s (`GEO_POINT_TIMEOUT_MS`,
 * TS-WEB-0009 D4 as amended by DEC-0181): it is the call that measured past
 * 800 ms, and the one ask that fills the cache is reused for a week. The slug
 * and id lookups measured well inside 800 ms and keep it.
 *
 * **What is cached.** A validated answer only. A failure is never cached, so
 * the next request asks again; a slug or id geo-api does not know is not
 * cached either, because the key would then be any string a visitor typed.
 *
 * `/api/places/nearest` does not come through here: its point is a
 * visitor's own position, which is never stored (TS-WEB-0010 D5, DEC-0119).
 */

import { z } from "zod";

import {
  communityById,
  communityBySlug,
  GeoCommunitySchema,
  searchByPoint,
  type GeoCommunity,
} from "@/src/clients/geo-api/client";

import { cacheProfile, cacheTags } from "./cache-profiles";
import { geoConfig, geoPointConfig } from "./config";
import { runtimeCacheStore, type LastGoodStore } from "./last-good";

/** The runtime-cache namespace of every geo lookup. */
export const GEO_LOOKUP_NAMESPACE = "geo";

/** The precision of the nearby key and of the point the cache is keyed on — two decimals, ~1 km. */
export const GEO_POINT_DECIMALS = 2;

export interface GeoPoint {
  readonly lat: number;
  readonly lng: number;
}

/** A point rounded to the cache's precision. One function, so the nearby key and this cache cannot drift. */
export function quantisePoint({ lat, lng }: GeoPoint): GeoPoint {
  return { lat: Number(lat.toFixed(GEO_POINT_DECIMALS)), lng: Number(lng.toFixed(GEO_POINT_DECIMALS)) };
}

/** The key segment of a quantised point — `53.92:13.58`. */
export function pointSegment(point: GeoPoint): string {
  return `${point.lat.toFixed(GEO_POINT_DECIMALS)}:${point.lng.toFixed(GEO_POINT_DECIMALS)}`;
}

export interface GeoLookupOptions {
  /** Tests hand in `memoryStore()`; everything else uses the runtime cache. */
  readonly store?: LastGoodStore;
  readonly now?: () => Date;
}

let defaultStore: LastGoodStore | undefined;

function geoStore(): LastGoodStore {
  defaultStore ??= runtimeCacheStore(GEO_LOOKUP_NAMESPACE);
  return defaultStore;
}

/**
 * Replaces the store every caller without its own `store` uses — the seam a
 * route-level test needs so one scenario's cached community does not answer
 * the next (like `resetRateLimits()` in `bff.ts`). `undefined` restores the
 * runtime cache.
 */
export function setGeoLookupStore(store: LastGoodStore | undefined): void {
  defaultStore = store;
}

const COMMUNITIES = z.array(GeoCommunitySchema);

/**
 * Read-through: a hit is returned as it is, a miss is fetched and written.
 * The cached value is validated again on the way out — a store that hands
 * back something else is a miss, never a malformed answer on a page.
 */
async function readThrough<T>(
  key: string,
  schema: z.ZodType<T>,
  fetch: () => Promise<T | undefined>,
  { store = geoStore(), now = () => new Date() }: GeoLookupOptions,
): Promise<T | undefined> {
  const hit = await store.read<unknown>(key);
  if (hit !== undefined) {
    const parsed = schema.safeParse(hit.data);
    if (parsed.success) return parsed.data;
  }

  const data = await fetch();
  if (data !== undefined) {
    await store.write(
      key,
      { data, fetchedAt: now().toISOString() },
      { ttlSeconds: cacheProfile("geoLookup").staleWindowSeconds, tags: [cacheTags.geo()] },
    );
  }
  return data;
}

/**
 * The communities around a point — geo-api's proximity search, on the
 * quantised point, with the point search's own budget. Throws `UpstreamError`
 * like the client, so `resilient()` degrades on it exactly as before.
 */
export async function communitiesNearPoint(
  point: GeoPoint,
  maxResults: number,
  options: GeoLookupOptions = {},
): Promise<GeoCommunity[]> {
  const quantised = quantisePoint(point);
  const found = await readThrough(
    `point:${pointSegment(quantised)}:${maxResults}`,
    COMMUNITIES,
    () => searchByPoint(geoPointConfig(), quantised, maxResults),
    options,
  );
  return found ?? [];
}

/** slug → community, cached when geo-api knows the slug. */
export function cachedCommunityBySlug(slug: string, options: GeoLookupOptions = {}): Promise<GeoCommunity | undefined> {
  return readThrough(`slug:${slug}`, GeoCommunitySchema, () => communityBySlug(geoConfig(), slug), options);
}

/** geonameId → community (the record that carries `image`), cached when geo-api knows the id. */
export function cachedCommunityById(geonameId: number, options: GeoLookupOptions = {}): Promise<GeoCommunity | undefined> {
  return readThrough(`id:${geonameId}`, GeoCommunitySchema, () => communityById(geoConfig(), geonameId), options);
}
