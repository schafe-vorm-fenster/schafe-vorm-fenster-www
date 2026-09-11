/**
 * Reads the per-build inline-script hash set that
 * `scripts/generate-csp-hashes.mjs` writes after `next build` — TS-014 D3 /
 * DEC-045, state/open.md rows 21 and 31.
 *
 * First attempt (superseded): a synchronous `fs` read of a hand-written file
 * under `.next/security/`. Verified working for a self-hosted
 * `next build && next start`, but measured to fail on an actual Vercel
 * preview — the deployed Proxy function's traced filesystem never included
 * that file (or `.next/server/app` itself), and Proxy's file-convention
 * `config` export has no option to force-include extra files.
 *
 * Current mechanism: the extraction script writes the hash set into
 * `.next/static/security/csp-script-hashes.json`, which Vercel uploads and
 * serves like any other `_next/static` asset — no function file-tracing
 * involved. This module fetches it **from the deployment's own origin**,
 * once per deployment. `proxy.ts` stays a pure function of hostname + path
 * (TS-004 D3): the fetch reads a build artifact, not per-request state, and
 * its result never varies with *this* request's path.
 *
 * Preview deployments sit behind Vercel Deployment Protection, so the
 * self-fetch carries `x-vercel-protection-bypass` — the same
 * `VERCEL_AUTOMATION_BYPASS_SECRET` Vercel injects into a protected
 * deployment's own functions (state/open.md row 14), not a secret this
 * module invents or reads from a file.
 *
 * ## The three guards (F-2-36)
 *
 * A secret-bearing fetch whose target used to be `request.nextUrl.origin` —
 * i.e. the `Host` header — is an SSRF with a credential attached. The
 * module now holds three independent defences, each unit-tested in
 * `csp-hashes.test.ts`:
 *
 *  1. **The origin is the deployment's, never the request's.** On Vercel it
 *     is `VERCEL_URL` (this deployment's own hostname), else
 *     `VERCEL_PROJECT_PRODUCTION_URL`, and only a bare hostname passes the
 *     shape check. Off Vercel — a self-hosted `next start`, `next dev`, the
 *     e2e run — there is no such variable, so the request origin is used,
 *     but only when its host is one this site actually answers on (TS-001
 *     D1's matrix plus loopback) and then **without** the bypass secret,
 *     which no non-Vercel deployment needs. The secret therefore only ever
 *     travels to an origin the environment named.
 *  2. **The cache is keyed by deployment**, not by nothing. `cached ??=`
 *     froze the first answer for the life of the server instance; the map
 *     below is keyed by `VERCEL_DEPLOYMENT_ID` (or the resolved origin) and
 *     bounded, so a stale entry cannot outlive its build and the map cannot
 *     grow without bound.
 *  3. **Every returned string is validated** against `sha256-<44 base64>`
 *     before it can reach `script-src`, de-duplicated, and capped at
 *     `MAX_SCRIPT_HASHES`. `csp.ts` interpolates each entry as `'<hash>'`;
 *     without the check, a string containing `'` or `;` writes arbitrary
 *     tokens into the policy. `csp.ts` re-applies the same predicate at the
 *     interpolation point, so the guard holds for every caller, not only
 *     this one.
 *
 * `next dev` never runs the extraction step, so the asset 404s there by
 * design; `csp.ts` treats an empty result as "no hashes yet" and falls back
 * to a dev/preview-only `'unsafe-inline'` rather than pairing
 * `'strict-dynamic'` with nothing to trust.
 */

import { DOMAIN_MATRIX } from "@/src/lib/routes/host-matrix";
import { isScriptHash } from "@/src/lib/security/csp";

const ASSET_PATH = "/_next/static/security/csp-script-hashes.json";

/** The path this module fetches — also the one path `proxy.ts` must not
 * recurse into when computing a hash-dependent CSP for it. */
export const CSP_HASHES_ASSET_PATH = ASSET_PATH;

/**
 * The upper bound on the hash set. A real build produces ~28; the cap exists
 * so a wrong or hostile asset cannot inflate every response header on the
 * site. Generous enough that a legitimate growth in inline scripts does not
 * silently truncate the policy — and if it ever does, `check:csp` and the
 * browser both say so loudly.
 */
export const MAX_SCRIPT_HASHES = 128;

/** How many deployments' hash sets are remembered at once. */
const MAX_CACHED_DEPLOYMENTS = 8;

/** A bare hostname, optionally with a port: no scheme, no path, no userinfo. */
const HOSTNAME = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*(:\d{1,5})?$/;

/**
 * The public hosts this site answers on — the only request-derived origins
 * the fallback branch may fetch, and only on their default port. Derived
 * from TS-001 D1's matrix so a new domain is one row there, not a second
 * list here.
 */
const PUBLIC_SELF_HOSTS: ReadonlySet<string> = new Set(
  DOMAIN_MATRIX.flatMap((domain) => [domain.host, domain.bareHost]),
);

/** Loopback, for `next dev` / `next start` / the e2e run. */
const LOOPBACK_HOSTS: ReadonlySet<string> = new Set(["localhost", "127.0.0.1", "::1"]);

export interface HashSource {
  /** The origin the asset is fetched from. */
  readonly origin: string;
  /** Whether the Deployment Protection bypass secret may be sent there. */
  readonly sendBypass: boolean;
  /** What the answer is cached under — one entry per deployment. */
  readonly cacheKey: string;
}

interface GeneratedHashes {
  readonly hashes?: readonly unknown[];
}

/**
 * Guard 1, as a pure function so a test can state it directly: which origin
 * this deployment fetches its own build artifact from, and whether the
 * bypass secret may travel there. `undefined` means "do not fetch at all".
 */
export function hashSourceFor(
  requestOrigin: string,
  env: Record<string, string | undefined> = process.env,
): HashSource | undefined {
  const own = env.VERCEL_URL || env.VERCEL_PROJECT_PRODUCTION_URL;
  if (own) {
    const host = own.toLowerCase();
    if (!HOSTNAME.test(host)) {
      console.error(
        "[csp-hashes] the deployment's own URL is not a bare hostname; not fetching:",
        own,
      );
      return undefined;
    }
    return {
      origin: `https://${host}`,
      sendBypass: true,
      cacheKey: env.VERCEL_DEPLOYMENT_ID || host,
    };
  }

  // Off Vercel: no deployment URL exists, so the request origin is the only
  // candidate — admitted only when it is a host this site actually answers
  // on, and never with the secret attached.
  let parsed: URL;
  try {
    parsed = new URL(requestOrigin);
  } catch {
    return undefined;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return undefined;

  // `URL.hostname` never carries the port, and keeps IPv6 in brackets.
  const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (LOOPBACK_HOSTS.has(hostname)) {
    // A loopback host with an arbitrary port would turn a `Host` header into
    // a port scanner of the machine the server runs on. Only the port this
    // process was told to listen on is admitted.
    if (parsed.port && parsed.port !== (env.PORT || "3000")) return undefined;
  } else if (!PUBLIC_SELF_HOSTS.has(hostname)) {
    return undefined;
  } else if (parsed.port) {
    // A public host is served on its default port; a port here means the
    // header chose it.
    return undefined;
  }

  return {
    origin: parsed.origin,
    sendBypass: false,
    cacheKey: parsed.origin,
  };
}

/** Guard 3: validate, de-duplicate, cap. */
function acceptableHashes(values: readonly unknown[]): readonly string[] {
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

async function fetchGeneratedHashes(source: HashSource): Promise<readonly string[]> {
  try {
    const url = new URL(ASSET_PATH, source.origin);
    const bypass = source.sendBypass
      ? process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      : undefined;

    const response = await fetch(url, {
      headers: bypass ? { "x-vercel-protection-bypass": bypass } : {},
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
    if (!response.ok) return [];

    const parsed = (await response.json()) as GeneratedHashes;
    return Array.isArray(parsed.hashes) ? acceptableHashes(parsed.hashes) : [];
  } catch (error) {
    // Loud in the server log, not fatal for the request. `csp.ts` treats an
    // empty result the same as "next dev, no build has run" — the policy
    // degrades to the host allowlist rather than shipping 'strict-dynamic'
    // with nothing to trust.
    console.error("[csp-hashes] failed to fetch the generated hash asset:", error);
    return [];
  }
}

/** Guard 2: one in-flight promise per deployment, bounded. */
const cache = new Map<string, Promise<readonly string[]>>();

/** Test seam — the module cache is process state and a test must not inherit it. */
export function resetScriptHashCache(): void {
  cache.clear();
}

/** The distinct `sha256-…` sources for this build, or `[]` if none exist yet. */
export function scriptHashes(requestOrigin: string): Promise<readonly string[]> {
  const source = hashSourceFor(requestOrigin);
  if (!source) return Promise.resolve([]);

  const hit = cache.get(source.cacheKey);
  if (hit) return hit;

  const pending = fetchGeneratedHashes(source);
  if (cache.size >= MAX_CACHED_DEPLOYMENTS) {
    const oldest = cache.keys().next();
    if (!oldest.done) cache.delete(oldest.value);
  }
  cache.set(source.cacheKey, pending);
  return pending;
}
