import { existsSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { describe, expect, it } from "vitest";

import { isServableAssetPath } from "./landing-domain";

/**
 * `state/open.md` row 153, and F-3-13's other half.
 *
 * `isServableAssetPath()` decides, on every request, whether an asset-shaped
 * URL is a file this site serves or an unknown URL bound for the 404 surface.
 * Its answer comes from a hand-kept list, because the proxy has no filesystem
 * to consult. A file dropped into `public/` without a line in that list would
 * be 404'd by the proxy while sitting on disk — and nothing would fail,
 * because no test walked `public/`.
 *
 * This is that walk.
 */

const PUBLIC_DIR = join(process.cwd(), "public");

function everyPublicFile(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? everyPublicFile(full) : [full];
  });
}

describe("public/ and the 404 predicate agree", () => {
  it("serves every file that is actually in public/", () => {
    const files = existsSync(PUBLIC_DIR) ? everyPublicFile(PUBLIC_DIR) : [];
    const unreachable = files
      .map((file) => `/${relative(PUBLIC_DIR, file).split(sep).join("/")}`)
      .filter((path) => !isServableAssetPath(path));

    expect(
      unreachable,
      "files in public/ the proxy would answer 404 for — add them to PUBLIC_FILES (and, if needed, to ASSET_EXTENSIONS) in landing-domain.ts",
    ).toEqual([]);
  });

  it("does not serve an asset-shaped path that matches no file (F-3-13)", () => {
    for (const path of [
      "/favicon.ico",
      "/does-not-exist.js",
      "/nope.css",
      "/nope.png",
      "/robots.txt.map",
    ]) {
      expect(isServableAssetPath(path), path).toBe(false);
    }
  });

  it("always serves the framework's own output", () => {
    expect(isServableAssetPath("/_next/static/media/anything.svg")).toBe(true);
  });
});
