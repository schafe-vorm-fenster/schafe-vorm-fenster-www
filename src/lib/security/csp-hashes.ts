/**
 * The per-page inline-script hashes `proxy.ts` puts into `script-src` —
 * TS-WEB-0014 D3, DEC-0045 as amended by DEC-0163.
 *
 * ## Where the hashes come from
 *
 * `scripts/csp-adapter.mjs` runs inside `next build` (Next's adapter API — the
 * one Vercel builds through) and writes one map: every prerendered page's
 * internal path → the sha256 sources of that page's inline scripts, plus the
 * set every page shares. It adds the file to the **proxy function's own
 * assets**, so this module reads it from disk:
 *
 *  - on Vercel, from the function bundle the platform adapter assembled;
 *  - under `next start`, from `.next/server/` where the build left it;
 *  - under `next dev`, nowhere — there is no build, `csp.ts` falls back to its
 *    dev-only `'unsafe-inline'`.
 *
 * Two earlier mechanisms are gone and why (state/open.md rows 31/173): a file
 * under `.next/security/` was outside the proxy's traced files, and a JSON
 * under `.next/static/security/` fetched over HTTP 404'd on Vercel because it
 * was written after the adapter had already chosen the deployment's files.
 *
 * ## Why per page
 *
 * Every page is static HTML now (DEC-0163), so each page's inline scripts are
 * fixed at build time and known exactly. A site-wide set was ~430 hashes —
 * a ~24 KB header on every response, and a page's flight payload authorising
 * scripts on every other page. Per page it is the page's own set (measured in DEC-0163).
 *
 * ## The guards (F-2-36), as they stand now
 *
 *  1. **No request-derived origin, and no network at all.** The old module
 *     fetched the asset from an origin that had to be defended against the
 *     `Host` header and carried the Deployment Protection bypass secret. This
 *     one reads one file from its own bundle: no request value selects what is
 *     read beyond the *path* lookup, and that lookup can only answer an entry
 *     the build wrote, or the common set.
 *  2. **The cache is keyed by deployment.** One entry per
 *     `VERCEL_DEPLOYMENT_ID` (or `local`), bounded, so a long-lived process can
 *     never serve one build's map for another.
 *  3. **Every string is validated** against `sha256-<44 base64>` before it can
 *     reach `script-src`, de-duplicated, and capped at `MAX_SCRIPT_HASHES` —
 *     the same number the build enforces per page (`MAX_PAGE_HASHES`), so the
 *     cap can never truncate a real set: a page over it fails the build first.
 *     `csp.ts` re-applies the shape check at the interpolation point.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { DEFAULT_LOCALE, LOCALES } from "@/src/lib/i18n/locales";
import { href, internalPath, normalisePath, ROUTE_IDS } from "@/src/lib/routes/routes";
import { isScriptHash } from "@/src/lib/security/csp";

/**
 * The upper bound per response. Equal to `MAX_PAGE_HASHES` in
 * `scripts/generate-csp-hashes.mjs`, which fails the build for a page above it
 * — so this cap guards against a wrong map, never against a real page.
 */
export const MAX_SCRIPT_HASHES = 128;

/** The map's path relative to the project directory — `HASH_MAP_RELATIVE_PATH` in the script. */
export const CSP_HASH_MAP_PATH = join(".next", "server", "csp-hash-map.json");

/**
 * The framework's own 404 document (`app/global-not-found.tsx`), as
 * `scripts/csp-adapter.mjs` keys it. Since DEC-0164 every URL the proxy can
 * classify is rewritten onto a per-language 404 variant with its own entry;
 * this one answers what Next's router alone decides is unknown (an unknown
 * path under a reserved prefix such as `/api/…`).
 */
export const FRAMEWORK_NOT_FOUND_ENTRY = "/_not-found";

/** How many deployments' maps are remembered at once. */
const MAX_CACHED_DEPLOYMENTS = 4;

export interface HashMap {
  readonly common: readonly string[];
  readonly pages: Readonly<Record<string, readonly string[]>>;
}

const EMPTY: HashMap = { common: [], pages: {} };

/** Guard 3: validate, de-duplicate, cap. */
export function acceptableHashes(values: readonly unknown[]): readonly string[] {
  const accepted: string[] = [];
  const seen = new Set<string>();
  let rejected = 0;

  for (const value of values) {
    if (typeof value !== "string" || !isScriptHash(value)) {
      rejected += 1;
      continue;
    }
    if (seen.has(value)) continue;
    seen.add(value);
    accepted.push(value);
    if (accepted.length === MAX_SCRIPT_HASHES) break;
  }

  if (rejected > 0)
    console.warn(
      `[csp-hashes] dropped ${rejected} entr${rejected === 1 ? "y" : "ies"} that are not a sha256 source`,
    );
  return accepted;
}

/** The parsed file, every list through guard 3. Anything malformed is the empty map. */
export function parseHashMap(raw: unknown): HashMap {
  if (typeof raw !== "object" || raw === null) return EMPTY;
  const { common, pages } = raw as { common?: unknown; pages?: unknown };
  const parsedPages: Record<string, readonly string[]> = {};
  if (typeof pages === "object" && pages !== null) {
    for (const [path, hashes] of Object.entries(pages)) {
      if (Array.isArray(hashes)) parsedPages[path] = acceptableHashes(hashes);
    }
  }
  return {
    common: Array.isArray(common) ? acceptableHashes(common) : [],
    pages: parsedPages,
  };
}

function readHashMap(directory: string): HashMap {
  try {
    return parseHashMap(JSON.parse(readFileSync(join(directory, CSP_HASH_MAP_PATH), "utf8")));
  } catch (error) {
    // `next dev` has no build, so no map — expected and quiet. Anywhere else
    // this is a broken deployment: loud in the log, and `csp.ts` refuses to
    // relax production either way.
    if ((error as NodeJS.ErrnoException).code !== "ENOENT" || process.env.VERCEL_ENV) {
      console.error("[csp-hashes] cannot read the per-page hash map:", error);
    }
    return EMPTY;
  }
}

/** Guard 2: one map per deployment, bounded. */
const cache = new Map<string, HashMap>();

/** Test seam — the module cache is process state and a test must not inherit it. */
export function resetScriptHashCache(): void {
  cache.clear();
}

function cacheKey(directory: string): string {
  return `${process.env.VERCEL_DEPLOYMENT_ID || "local"}:${directory}`;
}

/** Test seam — stands a map in for the file, for the current deployment and directory. */
export function primeScriptHashCache(raw: unknown, directory: string = process.cwd()): void {
  cache.set(cacheKey(directory), parseHashMap(raw));
}

function currentMap(directory: string): HashMap {
  const key = cacheKey(directory);
  const hit = cache.get(key);
  if (hit) return hit;

  const map = readHashMap(directory);
  if (cache.size >= MAX_CACHED_DEPLOYMENTS) {
    const oldest = cache.keys().next();
    if (!oldest.done) cache.delete(oldest.value);
  }
  cache.set(key, map);
  return map;
}

/** Public path → the internal `app/[lang]/…` path the build keyed the page under. */
const INTERNAL_BY_PUBLIC: ReadonlyMap<string, string> = new Map(
  ROUTE_IDS.flatMap((route) =>
    LOCALES.map((locale) => [normalisePath(href(route, locale)), internalPath(route, locale)] as const),
  ),
);

/**
 * The map key for a public request path. A route of the registry maps through
 * the locale rewrite (`/en/about` → `/en/ueber-uns`, `/` → `/de`); every other
 * path is its own key (`/start`, `/dev/components`, the 404 entry).
 */
export function hashMapKey(pathname: string): string {
  const path = normalisePath(pathname);
  return INTERNAL_BY_PUBLIC.get(path) ?? (path === "/" ? `/${DEFAULT_LOCALE}` : path);
}

/**
 * The hashes for one response: the page's own set where the build wrote one.
 * A path no page claims — an asset, an API response, an unknown path under a
 * reserved prefix — gets the framework 404's set (DEC-0164): of those
 * responses, that document is the only one a browser renders as HTML, so it
 * is the only one whose inline scripts the policy has to cover, and it is a
 * superset of the common bootstrap. Without a framework 404 entry, the common
 * set. `[]` when no map exists (`next dev`).
 */
export function scriptHashesFor(pathname: string, directory: string = process.cwd()): readonly string[] {
  const map = currentMap(directory);
  return map.pages[hashMapKey(pathname)] ?? map.pages[FRAMEWORK_NOT_FOUND_ENTRY] ?? map.common;
}
