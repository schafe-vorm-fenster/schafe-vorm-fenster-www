/**
 * The `last-good` store — TS-009 D4, DEC-045/046.
 *
 * **Why this is not the render cache.** An expired `'use cache'` entry is
 * gone; it cannot answer when the upstream then fails. Tier 2 needs a store
 * that still holds the last validated payload at exactly the moment the
 * framework cache has nothing, so it lives here, behind one interface, and
 * every upstream call goes through `resilient()` which goes through this.
 *
 * Two implementations behind the same interface:
 *
 *  - **Vercel Runtime Cache** (`@vercel/functions` `getCache()`) — the
 *    production store. Per region, per project, per environment; it survives
 *    deployments and is evicted LRU. `getCache()` itself falls back to an
 *    in-process cache when no platform cache is bound, so this module works
 *    unchanged in `next dev`.
 *  - **memory** — an explicit map, for tests that need to place an entry,
 *    age it, or assert a write.
 *
 * Regionality is a known limitation, not a bug: a cold region falls straight
 * to tier 3. TS-009's own open points carry the question; `state/open.md`
 * repeats it.
 */

import { getCache } from "@vercel/functions";

export interface LastGoodEntry<T> {
  readonly data: T;
  /** ISO-8601 — the `fetchedAt` the freshness label renders (TS-009 D5). */
  readonly fetchedAt: string;
}

export interface LastGoodStore {
  read<T>(key: string): Promise<LastGoodEntry<T> | undefined>;
  write<T>(
    key: string,
    entry: LastGoodEntry<T>,
    options: { readonly ttlSeconds: number; readonly tags?: readonly string[] },
  ): Promise<void>;
}

/** Cache keys are segments, never visitors (TS-008 D10, TS-013 D6). */
export const LAST_GOOD_NAMESPACE = "last-good";

function isEntry(value: unknown): value is LastGoodEntry<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof (value as { fetchedAt?: unknown }).fetchedAt === "string"
  );
}

/**
 * The platform store. Every failure of the cache itself is swallowed: a store
 * that cannot answer must degrade the module to tier 3, never throw into the
 * render (TS-009 D9).
 */
export function runtimeCacheStore(): LastGoodStore {
  return {
    async read<T>(key: string) {
      try {
        const value = await getCache({ namespace: LAST_GOOD_NAMESPACE }).get(key);
        return isEntry(value) ? (value as LastGoodEntry<T>) : undefined;
      } catch {
        return undefined;
      }
    },
    async write<T>(
      key: string,
      entry: LastGoodEntry<T>,
      { ttlSeconds, tags }: { readonly ttlSeconds: number; readonly tags?: readonly string[] },
    ) {
      try {
        await getCache({ namespace: LAST_GOOD_NAMESPACE }).set(key, entry, {
          ttl: ttlSeconds,
          tags: tags ? [...tags] : undefined,
          name: key,
        });
      } catch {
        // A store that will not take the write costs freshness, never a page.
      }
    },
  };
}

/** An explicit map — the store tests hand to `resilient()`. */
export function memoryStore(
  seed: ReadonlyMap<string, LastGoodEntry<unknown>> = new Map(),
): LastGoodStore & { readonly entries: Map<string, LastGoodEntry<unknown>> } {
  const entries = new Map<string, LastGoodEntry<unknown>>(seed);
  return {
    entries,
    async read<T>(key: string) {
      const entry = entries.get(key);
      return entry === undefined ? undefined : (entry as LastGoodEntry<T>);
    },
    async write<T>(key: string, entry: LastGoodEntry<T>) {
      entries.set(key, entry);
    },
  };
}

let defaultStore: LastGoodStore | undefined;

/** The store every module uses unless a test hands it another one. */
export function lastGoodStore(): LastGoodStore {
  defaultStore ??= runtimeCacheStore();
  return defaultStore;
}
