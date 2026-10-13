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
 * The framework's own 404 document (`app/global-not-found.tsx`). Next emits it
 * as a static `/404` file rather than a prerender once it is complete, so it
 * is not among `htmlPrerenders`. Keyed `/_not-found` — the route it renders —
 * because that is the entry `csp-hashes.ts` falls back to for a path no page
 * claims: the only HTML such a path can produce is this document (DEC-0164).
 */
export const FRAMEWORK_NOT_FOUND_KEY = "/_not-found";

function frameworkNotFound(outputs) {
  const file = outputs.staticFiles?.find(
    (output) => output.pathname === "/404" && output.filePath?.endsWith(".html"),
  );
  return file ? [{ pathname: FRAMEWORK_NOT_FOUND_KEY, filePath: file.filePath }] : [];
}

/**
 * DEC-0164: the per-language 404 documents. `proxy.ts` rewrites every URL the
 * site does not serve onto one of these; `notFoundVariantPath()` in
 * `src/lib/routes/static-variants.ts` builds the same prefix, and its test
 * holds the two equal.
 */
export const NOT_FOUND_VARIANT_PREFIX = "/variants/not-found/";

/**
 * Gives every per-language 404 prerender its status, 404.
 *
 * The page renders the complete document instead of calling `notFound()`,
 * because a `notFound()` raised during the prerender is stored as Next's empty
 * `__next_error__` shell (measured; `app/variants/not-found/[lang]/page.tsx`
 * has the reason). The status is therefore set here, on the two records that
 * carry it: the prerender's `.meta` file, which `next start` serves from, and
 * `fallback.initialStatus` of the adapter output, which the platform adapter
 * deploys (it runs after this one and reads the same `outputs`). Nothing is
 * rendered or rewritten; one number changes.
 *
 * Throws when no such prerender exists: a 404 that silently answered 200 is
 * the failure this exists to prevent.
 */
export async function markNotFoundVariants(prerenders) {
  const variants = prerenders.filter((prerender) => prerender.pathname.startsWith(NOT_FOUND_VARIANT_PREFIX));
  const documents = variants.filter((prerender) => !prerender.pathname.includes("["));
  if (documents.length === 0) {
    throw new Error(
      `[csp-hashes] no prerendered 404 document under ${NOT_FOUND_VARIANT_PREFIX} — every unknown URL would answer without one (DEC-0164)`,
    );
  }
  for (const prerender of variants) {
    prerender.fallback.initialStatus = 404;
    const metaFile = prerender.fallback.filePath.replace(/\.html$/, ".meta");
    let meta = {};
    try {
      meta = JSON.parse(await readFile(metaFile, "utf8"));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    await writeFile(metaFile, JSON.stringify({ ...meta, status: 404 }), "utf8");
  }
  return documents.map((prerender) => prerender.pathname);
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

    const notFoundVariants = await markNotFoundVariants(prerenders);
    console.log(`[csp-hashes] 404 status set on ${notFoundVariants.join(", ")}`);

    const documents = [
      ...prerenders.map((prerender) => ({ pathname: prerender.pathname, filePath: prerender.fallback.filePath })),
      ...frameworkNotFound(ctx.outputs),
    ];
    const entries = await Promise.all(
      documents.map(async ({ pathname, filePath }) => ({
        pathname,
        html: await readFile(filePath, "utf8"),
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
