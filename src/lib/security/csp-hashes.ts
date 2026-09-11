/**
 * Reads the per-build inline-script hash set that
 * `scripts/generate-csp-hashes.mjs` writes after `next build` — TS-014 D3 /
 * DEC-045, state/open.md rows 21 and 31.
 *
 * Works today for a self-hosted deployment (`next build && next start`):
 * verified locally against a real production build — 28 hashes, correct
 * `script-src`, zero CSP violations, real hydration. Proxy defaults to the
 * Node.js runtime as of Next 16 (see
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
 * — "Runtime"), so a synchronous `fs` read is available there.
 *
 * **Does not yet reach the deployed Vercel Proxy function.** Measured
 * against an actual preview deploy: Vercel's Next.js builder packages the
 * Proxy/Middleware function from a traced subset of `.next` that includes
 * the manifests and `server/chunks`, but neither `.next/server/app` (the
 * rendered page HTML) nor a hand-written file under a new `.next/security/`
 * directory — `existsSync` here returns `false` at runtime on Vercel even
 * though the build log confirms the extraction step ran and wrote the file.
 * There is no Proxy-level config to force-include extra files (the file
 * convention's `config` export only supports `matcher`). Result: this
 * function safely returns `[]` there today, and `csp.ts`'s no-hashes
 * fallback applies — same-origin chunks still load, but the two inline
 * bootstrap/flight scripts stay unhashed and blocked, so hydration is not
 * yet restored on an actual Vercel deployment. See state/open.md row 31 for
 * the follow-up options (a real per-request nonce, which DEC-045 rules out
 * for the static shell; or a runtime-reachable store such as Vercel Edge
 * Config populated at build time) — both are bigger than this fix.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

interface GeneratedHashes {
  readonly hashes?: readonly string[];
}

let cached: readonly string[] | undefined;

function readGeneratedHashes(): readonly string[] {
  const path = join(process.cwd(), ".next", "security", "csp-script-hashes.json");
  if (!existsSync(path)) return [];

  try {
    const raw = readFileSync(path, "utf8");
    const parsed = JSON.parse(raw) as GeneratedHashes;
    const hashes = parsed.hashes;
    return Array.isArray(hashes) ? hashes.filter((h) => typeof h === "string") : [];
  } catch (error) {
    // Loud in the server log, not fatal for the request — a build that made
    // it to serving traffic already ran the extraction step successfully
    // once; a read failure here is an operational anomaly, not the expected
    // "no hashes in dev" case `existsSync` already handled above.
    console.error("[csp-hashes] failed to read/parse the generated hash file:", error);
    return [];
  }
}

/** The distinct `sha256-…` sources for this build, or `[]` if none exist yet. */
export function scriptHashes(): readonly string[] {
  cached ??= readGeneratedHashes();
  return cached;
}
