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
 * involved. This module fetches it from the incoming request's own origin,
 * once per server instance (the in-flight promise is cached in module
 * scope, so concurrent first requests share one fetch and every later
 * request is free). `proxy.ts` stays a pure function of hostname + path
 * (TS-004 D3): the fetch reads a build artifact, not per-request state, and
 * its result never varies with *this* request's path.
 *
 * Preview deployments sit behind Vercel Deployment Protection, so the
 * self-fetch carries `x-vercel-protection-bypass` — the same
 * `VERCEL_AUTOMATION_BYPASS_SECRET` Vercel injects into a protected
 * deployment's own functions (state/open.md row 14), not a secret this
 * module invents or reads from a file.
 *
 * `next dev` never runs the extraction step, so the asset 404s there by
 * design; `csp.ts` treats an empty result as "no hashes yet" and falls back
 * to a dev-only `'unsafe-inline'` rather than pairing `'strict-dynamic'`
 * with nothing to trust.
 */

const ASSET_PATH = "/_next/static/security/csp-script-hashes.json";

interface GeneratedHashes {
  readonly hashes?: readonly unknown[];
}

let cached: Promise<readonly string[]> | undefined;

async function fetchGeneratedHashes(origin: string): Promise<readonly string[]> {
  try {
    const url = new URL(ASSET_PATH, origin);
    const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

    const response = await fetch(url, {
      headers: bypass ? { "x-vercel-protection-bypass": bypass } : {},
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
    if (!response.ok) return [];

    const parsed = (await response.json()) as GeneratedHashes;
    return Array.isArray(parsed.hashes)
      ? parsed.hashes.filter((h): h is string => typeof h === "string")
      : [];
  } catch (error) {
    // Loud in the server log, not fatal for the request. `csp.ts` treats an
    // empty result the same as "next dev, no build has run" — the policy
    // degrades to the host allowlist rather than shipping 'strict-dynamic'
    // with nothing to trust.
    console.error("[csp-hashes] failed to fetch the generated hash asset:", error);
    return [];
  }
}

/** The path this module fetches — also the one path `proxy.ts` must not
 * recurse into when computing a hash-dependent CSP for it. */
export const CSP_HASHES_ASSET_PATH = ASSET_PATH;

/** The distinct `sha256-…` sources for this build, or `[]` if none exist yet. */
export function scriptHashes(origin: string): Promise<readonly string[]> {
  cached ??= fetchGeneratedHashes(origin);
  return cached;
}
