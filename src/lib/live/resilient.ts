/**
 * `resilient()` — the three-tier chain of TS-009 D4, as one wrapper every
 * upstream call goes through.
 *
 *   resilient(fetcher, { key, kind, snapshot })
 *     → { data, tier, fetchedAt, stale, demo, source }
 *
 * The rules it encodes, each of them a line of a spec rather than a
 * preference:
 *
 *  - **Failure is anything that is not a valid answer** — network error,
 *    non-2xx, timeout, or a payload the Zod schema rejects. The clients throw
 *    `UpstreamError` for all four, so there is one thing to catch.
 *  - **One attempt per render.** No in-request retry.
 *  - **An empty result is tier 1.** Zero dates in a place is an answer, and
 *    the page converts on it (WEB-F-045). This wrapper never inspects the
 *    payload's emptiness — `places.ts` does, as a conversion, not a failure.
 *  - **Per call, not per page.** One failing upstream degrades one module;
 *    tier 1, 2 and 3 modules may stand side by side (TS-009 D4).
 *  - **Counters have no tier 3** (TS-009 D6). A caller that passes no
 *    `snapshot` gets `NoFallbackError`, which is the signal to remove the
 *    module from the page — never a zero, never a placeholder figure.
 */

import { cacheProfile, type CacheKind } from "./cache-profiles";
import { lastGoodStore, type LastGoodStore } from "./last-good";

import type { LiveEnvelope, LiveSource } from "./types";

/** The timeout of TS-009 D4 — set, not measured (its own open point says so). */
export const UPSTREAM_TIMEOUT_MS = 800;

/** Raised when no tier can answer. For the counters this is the expected path. */
export class NoFallbackError extends Error {
  readonly moduleKey: string;

  constructor(moduleKey: string, cause: unknown) {
    super(`no tier could answer for ${moduleKey}`);
    this.name = "NoFallbackError";
    this.moduleKey = moduleKey;
    this.cause = cause;
  }
}

export interface DegradationEvent {
  readonly key: string;
  readonly tier: "stale" | "snapshot" | "none";
  readonly reason: string;
}

export interface ResilientOptions<T> {
  /** The `last-good` key. A segment (`dates:geoname.123:week`), never a visitor. */
  readonly key: string;
  readonly kind: CacheKind;
  /** Runtime-cache tags, so a purge can reach one module's entries (DEC-046). */
  readonly tags?: readonly string[];
  /** Tier 3. Omitted deliberately by the counters (TS-009 D6). */
  readonly snapshot?: () => T | undefined;
  readonly store?: LastGoodStore;
  readonly now?: () => Date;
  /**
   * TS-009 D9: every degradation is an event for monitoring, never a message
   * to the visitor. The default logs server-side and returns.
   */
  readonly onDegrade?: (event: DegradationEvent) => void;
  /** `true` when a mock produced the payload — travels straight into the envelope. */
  readonly demo?: boolean;
  readonly source?: LiveSource;
}

function ageSeconds(fetchedAt: string, now: Date): number {
  return (now.getTime() - new Date(fetchedAt).getTime()) / 1000;
}

function logDegradation(event: DegradationEvent): void {
  console.warn(`[live] ${event.key} degraded to ${event.tier}: ${event.reason}`);
}

export async function resilient<T>(
  fetcher: () => Promise<T>,
  options: ResilientOptions<T>,
): Promise<LiveEnvelope<T>> {
  const {
    key,
    kind,
    tags,
    snapshot,
    store = lastGoodStore(),
    now = () => new Date(),
    onDegrade = logDegradation,
    demo = false,
    source = demo ? "mock" : "real",
  } = options;

  const profile = cacheProfile(kind);

  try {
    const data = await fetcher();
    const fetchedAt = now().toISOString();
    await store.write(key, { data, fetchedAt }, { ttlSeconds: profile.staleWindowSeconds, tags });
    return { data, tier: "live", fetchedAt, stale: false, demo, source };
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : String(cause);

    const entry = await store.read<T>(key);
    if (entry !== undefined && ageSeconds(entry.fetchedAt, now()) <= profile.staleWindowSeconds) {
      onDegrade({ key, tier: "stale", reason });
      return { data: entry.data, tier: "stale", fetchedAt: entry.fetchedAt, stale: true, demo, source };
    }

    const fallback = snapshot?.();
    if (fallback !== undefined) {
      onDegrade({ key, tier: "snapshot", reason });
      return {
        data: fallback,
        tier: "snapshot",
        fetchedAt: snapshotBuiltAt(),
        stale: true,
        demo,
        source,
      };
    }

    onDegrade({ key, tier: "none", reason });
    throw new NoFallbackError(key, cause);
  }
}

/**
 * Tier 3's `fetchedAt` is the build time (TS-009 D5) — the same value for
 * every snapshot, because they are all produced by one build.
 */
export function snapshotBuiltAt(): string {
  return process.env.SNAPSHOT_BUILT_AT ?? new Date(0).toISOString();
}

/**
 * The other half of TS-009 D5: a tier-1 answer served past its fresh TTL
 * carries the label too. Route handlers read from a shared cache, so an
 * envelope can legitimately arrive older than its fresh TTL.
 */
export function withFreshness<T>(envelope: LiveEnvelope<T>, kind: CacheKind, now = new Date()): LiveEnvelope<T> {
  if (envelope.stale) return envelope;
  const stale = ageSeconds(envelope.fetchedAt, now) > cacheProfile(kind).freshTtlSeconds;
  return stale ? { ...envelope, stale } : envelope;
}
