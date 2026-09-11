#!/usr/bin/env node
/**
 * DEC-045 / TS-014 D3: the per-build inline-script hash extraction.
 *
 * Runs after `next build` (see the `build` script in package.json). Scans
 * every static/ISR page `next build` wrote to `.next/server/app` for literal
 * `<script>` tags that have no `src` — Next's own hydration bootstrap and
 * flight-payload scripts — and hashes each distinct one it finds.
 *
 * The result is written to `.next/static/security/csp-script-hashes.json` —
 * inside `.next/static`, not the earlier `.next/security`, because Vercel
 * uploads everything under `.next/static/**` as public static assets after
 * the build command finishes (served at `/_next/static/...`), while a
 * hand-written file outside that tree does not reach the deployed Proxy
 * function at all (measured: its traced filesystem excludes both
 * `.next/server/app` and a custom `.next/security/` directory — see
 * state/open.md rows 21/31 for that earlier, failed attempt). `proxy.ts`
 * fetches this asset from the request's own origin at runtime
 * (`src/lib/security/csp-hashes.ts`) rather than reading it off disk, so it
 * needs to be something Vercel actually serves.
 *
 * Failure is loud on purpose (DEC-045: "a new inline block that does not
 * pass through that step breaks the policy loudly rather than silently
 * weakening it") — a build with zero hashes found, or with no `.next/server`
 * output at all, exits non-zero rather than shipping an empty set.
 */

import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP_DIR = join(projectRoot, ".next", "server", "app");
const OUT_FILE = join(projectRoot, ".next", "static", "security", "csp-script-hashes.json");

/** Matches a `<script …>…</script>` tag whose opening tag has no `src=`. */
const SCRIPT_TAG_RE = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/g;

/** No `fs.glob(Sync)` dependency — Vercel's build runs Node 22 (state/open.md #22),
 * where it is still experimental. A plain recursive walk needs nothing newer. */
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

function extractInlineScripts(html) {
  const scripts = [];
  for (const match of html.matchAll(SCRIPT_TAG_RE)) {
    const [, attrs = "", content] = match;
    if (/\bsrc\s*=/.test(attrs)) continue; // external — governed by 'self', not a hash
    if (content.length === 0) continue;
    scripts.push(content);
  }
  return scripts;
}

function sha256(content) {
  return `sha256-${createHash("sha256").update(content, "utf8").digest("base64")}`;
}

async function main() {
  let htmlFiles;
  try {
    htmlFiles = await findHtmlFiles(APP_DIR);
  } catch (error) {
    console.error(
      `[csp-hashes] cannot read ${APP_DIR} — run \`next build\` first (${error.message})`,
    );
    process.exitCode = 1;
    return;
  }

  if (htmlFiles.length === 0) {
    console.error(`[csp-hashes] no .html files found under ${APP_DIR} — refusing to ship an empty hash set`);
    process.exitCode = 1;
    return;
  }

  const hashes = new Set();
  let scriptCount = 0;

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    for (const content of extractInlineScripts(html)) {
      scriptCount += 1;
      hashes.add(sha256(content));
    }
  }

  if (hashes.size === 0) {
    console.error(
      `[csp-hashes] scanned ${htmlFiles.length} page(s) but found zero inline <script> tags — that means Next's bootstrap script is missing, not that the policy can safely ship no hashes`,
    );
    process.exitCode = 1;
    return;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    pagesScanned: htmlFiles.length,
    scriptsScanned: scriptCount,
    hashes: [...hashes].sort(),
  };

  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log(
    `[csp-hashes] ${payload.hashes.length} distinct hash(es) from ${scriptCount} inline script(s) across ${htmlFiles.length} page(s) -> ${OUT_FILE}`,
  );
}

await main();
