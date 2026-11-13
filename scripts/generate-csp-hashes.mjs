#!/usr/bin/env node
/**
 * DEC-0045 / DEC-0163 / TS-WEB-0014 D3: the per-page inline-script hash extraction.
 *
 * Every page this site serves is prerendered static HTML (DEC-0163), so every
 * inline `<script>` a visitor's browser will ever run — Next's bootstrap and
 * the RSC flight payload (`self.__next_f.push(…)`) — is already in a file
 * `next build` wrote. This module hashes them **per page**: the proxy sends a
 * page only its own hashes, so the header stays small (~1 KB instead of the
 * 24 KB a site-wide set measured) and a payload one page owns can never
 * authorise a script on another.
 *
 * It runs **inside** `next build`, from `scripts/csp-adapter.mjs`'s
 * `onBuildComplete` — not after it. Vercel builds Next 16 through the adapter
 * API, and the adapter decides at `onBuildComplete` which files reach the
 * deployed functions; a file written after `next build` returned (the old
 * `&& node scripts/generate-csp-hashes.mjs` step) never did, which is why the
 * preview had to fall back to `'unsafe-inline'` (state/open.md rows 31/173).
 *
 * Failure is loud on purpose (DEC-0045: "a new inline block that does not pass
 * through that step breaks the policy loudly rather than silently weakening
 * it"):
 *
 *  - zero pages, or no page with an inline script at all, fails the build (a
 *    single page without one simply has no entry and gets the fallback set);
 *  - a page with more distinct hashes than `MAX_PAGE_HASHES` fails the build —
 *    the cap exists so a wrong map cannot inflate a header, and until #59 a
 *    cap that the real set exceeded **silently truncated** it (128 of 429),
 *    which is exactly what left most pages unhydrated;
 *  - a page whose prerender revalidates fails the build: regenerated HTML
 *    carries a new flight payload whose hash is in no map (#59, measured:
 *    `/mitmachen` broke 5½ minutes after start).
 *
 * Run directly (`node scripts/generate-csp-hashes.mjs`) it re-reads the
 * prerendered HTML under `.next/server/app` and prints the per-page counts —
 * a diagnostic, it writes nothing.
 */

import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The most distinct inline-script hashes one page may carry. A public page
 * carries 10–25 and the `/dev/components` gallery 82 (measured on the build
 * that introduced this map); the cap is
 * there so a wrong map cannot inflate a response header, and the build fails
 * rather than truncating when a page exceeds it. `src/lib/security/csp-hashes.ts`
 * applies the same number at runtime (`MAX_SCRIPT_HASHES`) and a test keeps
 * the two equal.
 */
export const MAX_PAGE_HASHES = 128;

/** Where the map lands, relative to the project directory. */
export const HASH_MAP_RELATIVE_PATH = join(".next", "server", "csp-hash-map.json");

/** Matches a `<script …>…</script>` tag; the `src=` check happens per match. */
const SCRIPT_TAG_RE = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/g;

export function extractInlineScripts(html) {
  const scripts = [];
  for (const match of html.matchAll(SCRIPT_TAG_RE)) {
    const [, attrs = "", content] = match;
    if (/\bsrc\s*=/.test(attrs)) continue; // external — governed by 'self', not a hash
    // JSON-LD and other data blocks are not executed and need no hash.
    const type = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attrs)?.[1]?.toLowerCase();
    if (type && type !== "text/javascript" && type !== "module") continue;
    if (content.length === 0) continue;
    scripts.push(content);
  }
  return scripts;
}

export function sha256(content) {
  return `sha256-${createHash("sha256").update(content, "utf8").digest("base64")}`;
}

/**
 * `[{ pathname, html }]` → `{ pages: { [pathname]: hash[] }, common: hash[] }`.
 * `common` is the set every page shares (the bootstrap), served for a path no
 * page claims. Throws — and so fails the build — on any of the conditions in
 * the header comment.
 *
 * @param {ReadonlyArray<{ pathname: string; html: string }>} entries
 * @param {{ cap?: number }} [options]
 * @returns {{ pages: Record<string, string[]>; common: string[] }}
 */
export function buildHashMap(entries, { cap = MAX_PAGE_HASHES } = {}) {
  if (entries.length === 0) {
    throw new Error("[csp-hashes] no prerendered HTML found — refusing to ship an empty hash map");
  }

  /** @type {Record<string, string[]>} */
  const pages = {};
  /** @type {string[]} */
  const errors = [];
  for (const { pathname, html } of entries) {
    const hashes = [...new Set(extractInlineScripts(html).map(sha256))].sort();
    if (hashes.length === 0) continue;
    if (hashes.length > cap) {
      errors.push(`${pathname}: ${hashes.length} distinct inline-script hashes, over the cap of ${cap}`);
      continue;
    }
    pages[pathname] = hashes;
  }
  if (errors.length > 0) {
    throw new Error(`[csp-hashes] the per-page hash map cannot be built:\n  ${errors.join("\n  ")}`);
  }

  const sets = Object.values(pages);
  if (sets.length === 0) {
    throw new Error(
      "[csp-hashes] no prerendered page carries an inline <script> — Next's bootstrap is missing, not something the policy can safely ship without",
    );
  }
  const common = sets[0].filter((hash) => sets.every((set) => set.includes(hash)));
  return { pages, common };
}

async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return findHtmlFiles(full);
      return entry.isFile() && entry.name.endsWith(".html") ? [full] : [];
    }),
  );
  return files.flat();
}

/** Diagnostic CLI: the per-page counts of the current `.next` output. */
async function main() {
  const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
  const appDir = join(projectRoot, ".next", "server", "app");
  const files = await findHtmlFiles(appDir);
  const entries = await Promise.all(
    files.map(async (file) => ({
      pathname: `/${relative(appDir, file).split(sep).join("/").replace(/\.html$/, "")}`,
      html: await readFile(file, "utf8"),
    })),
  );
  const { pages, common } = buildHashMap(entries);
  for (const [pathname, hashes] of Object.entries(pages).sort()) {
    console.log(`${String(hashes.length).padStart(3)}  ${pathname}`);
  }
  console.log(`common: ${common.length}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
