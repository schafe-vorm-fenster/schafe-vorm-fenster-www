/**
 * The build-time half of DEC-0163's per-page CSP hashes — a Next.js adapter
 * (`adapterPath` in `next.config.ts`) that wraps whichever adapter the
 * platform brings.
 *
 * **Why an adapter.** Vercel builds Next 16 through the adapter API (the build
 * log says "Applying modifyConfig from Vercel"): `NEXT_ADAPTER_PATH` points at
 * Vercel's adapter, and its `onBuildComplete` decides — from the outputs Next
 * hands it — which files the deployed functions get. Anything written after
 * `next build` returns is too late, which is measured: the old post-build
 * step wrote its JSON into `.next/static/security/` and the deployed proxy's
 * fetch for it answered 404 (state/open.md rows 31/173). Running *inside*
 * `onBuildComplete`, before the platform adapter sees the outputs, the map is
 * built from the prerendered HTML and added to the **proxy function's own
 * assets**, so `src/lib/security/csp-hashes.ts` reads it from disk — no
 * network fetch, no bypass secret, no request-derived origin at all.
 *
 * Locally (`next build` without `NEXT_ADAPTER_PATH`) there is no inner
 * adapter; the map is still written and `next start` reads it the same way.
 *
 * The build fails — `onBuildComplete` throws — on every condition
 * `generate-csp-hashes.mjs` names, and on a page whose prerender revalidates:
 * regenerated HTML carries a flight payload whose hash this map never saw.
 */

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { pathToFileURL } from "node:url";

import { buildHashMap, HASH_MAP_RELATIVE_PATH } from "./generate-csp-hashes.mjs";

/** The adapter the platform configured, if any — never this file itself. */
function innerAdapterPath() {
  const configured = process.env.NEXT_ADAPTER_PATH;
  if (!configured || configured.endsWith("csp-adapter.mjs")) return undefined;
  return configured;
}

let innerPromise;
async function inner() {
  const path = innerAdapterPath();
  if (!path) return undefined;
  innerPromise ??= import(path.startsWith("file:") ? path : pathToFileURL(path).href).then(
    (module) => module.default ?? module,
  );
  return innerPromise;
}

/** Prerendered HTML pages: the outputs whose seeded file is an `.html` document. */
function htmlPrerenders(outputs) {
  return outputs.prerenders.filter((prerender) => prerender.fallback?.filePath?.endsWith(".html"));
}

/**
 * DEC-0163 §2: a page whose HTML can regenerate after the build is a page
 * whose inline scripts can change after the build. Only real pages count —
 * the `[lang]` app shells are never served (an unknown first segment is a 404
 * in `proxy.ts` before it reaches them).
 */
function revalidatingPages(prerenders) {
  return prerenders
    .filter((prerender) => prerender.routeType === undefined || prerender.routeType === "page")
    .filter((prerender) => {
      const revalidate = prerender.fallback?.initialRevalidate;
      return revalidate !== undefined && revalidate !== false;
    })
    .map((prerender) => `${prerender.pathname} (revalidate ${prerender.fallback.initialRevalidate}s)`);
}

const adapter = {
  name: "svf-csp-hashes",

  async modifyConfig(config, ctx) {
    const wrapped = await inner();
    return typeof wrapped?.modifyConfig === "function" ? wrapped.modifyConfig(config, ctx) : config;
  },

  async onBuildComplete(ctx) {
    const prerenders = htmlPrerenders(ctx.outputs);

    const revalidating = revalidatingPages(prerenders);
    if (revalidating.length > 0) {
      throw new Error(
        `[csp-hashes] these pages revalidate, so their HTML — and its inline scripts — can change after the build (DEC-0163):\n  ${revalidating.join("\n  ")}`,
      );
    }

    const entries = await Promise.all(
      prerenders.map(async (prerender) => ({
        pathname: prerender.pathname,
        html: await readFile(prerender.fallback.filePath, "utf8"),
      })),
    );
    const { pages, common } = buildHashMap(entries);
    const payload = JSON.stringify({ buildId: ctx.buildId, common, pages }) + "\n";

    const outFile = join(ctx.projectDir, HASH_MAP_RELATIVE_PATH);
    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(outFile, payload, "utf8");

    // Into the proxy function's own file set, keyed like every traced asset:
    // relative to the repo root.
    const middleware = ctx.outputs.middleware;
    if (middleware) {
      const key = relative(ctx.repoRoot, outFile);
      middleware.assets[key] = outFile;
      if (middleware.assetsHashes) {
        middleware.assetsHashes[key] = createHash("sha256").update(payload).digest("hex");
      }
    }

    const counts = Object.values(pages).map((hashes) => hashes.length);
    console.log(
      `[csp-hashes] ${Object.keys(pages).length} page(s), ${Math.min(...counts)}–${Math.max(...counts)} hash(es) each, ${common.length} common -> ${relative(ctx.projectDir, outFile)}`,
    );

    const wrapped = await inner();
    if (typeof wrapped?.onBuildComplete === "function") await wrapped.onBuildComplete(ctx);
  },
};

export default adapter;
