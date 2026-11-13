import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { markNotFoundVariants, NOT_FOUND_VARIANT_PREFIX } from "./csp-adapter.mjs";

import { notFoundVariantPath } from "@/src/lib/routes/static-variants";

/**
 * DEC-0164 — the per-language 404 documents are prerendered as complete pages
 * and the build adapter gives them their status. These run the real function
 * against temporary fixtures shaped like `next build`'s adapter outputs.
 */

let dir: string;

function prerender(pathname: string, meta?: unknown) {
  const filePath = join(dir, `${pathname.replaceAll("/", "_")}.html`);
  writeFileSync(filePath, "<html></html>");
  if (meta !== undefined) writeFileSync(filePath.replace(/\.html$/, ".meta"), JSON.stringify(meta));
  return { pathname, fallback: { filePath, initialStatus: undefined as number | undefined } };
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "csp-adapter-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("TS-WEB-0004-A12: the build gives every per-language 404 document status 404", () => {
  it("names the same prefix the proxy rewrites onto", () => {
    expect(notFoundVariantPath("de").startsWith(NOT_FOUND_VARIANT_PREFIX)).toBe(true);
    expect(notFoundVariantPath("en").startsWith(NOT_FOUND_VARIANT_PREFIX)).toBe(true);
  });

  it("sets the status in the .meta file and the adapter output, and keeps the rest of the meta", async () => {
    const de = prerender("/variants/not-found/de", { status: 200, headers: { "x-nextjs-prerender": "1" } });
    const en = prerender("/variants/not-found/en", { status: 200 });
    const page = prerender("/de/mitmachen", { status: 200 });

    expect(await markNotFoundVariants([de, en, page])).toEqual(["/variants/not-found/de", "/variants/not-found/en"]);

    expect(de.fallback.initialStatus).toBe(404);
    expect(en.fallback.initialStatus).toBe(404);
    expect(page.fallback.initialStatus).toBeUndefined();
    const meta = JSON.parse(readFileSync(de.fallback.filePath.replace(/\.html$/, ".meta"), "utf8"));
    expect(meta).toEqual({ status: 404, headers: { "x-nextjs-prerender": "1" } });
    expect(JSON.parse(readFileSync(page.fallback.filePath.replace(/\.html$/, ".meta"), "utf8")).status).toBe(200);
  });

  it("fails the build when there is no 404 document to mark", async () => {
    await expect(markNotFoundVariants([prerender("/de", { status: 200 })])).rejects.toThrow(/no prerendered 404 document/);
  });
});
