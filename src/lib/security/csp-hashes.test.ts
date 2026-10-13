import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CSP_HASH_MAP_PATH,
  MAX_SCRIPT_HASHES,
  hashMapKey,
  parseHashMap,
  resetScriptHashCache,
  scriptHashesFor,
} from "@/src/lib/security/csp-hashes";

import { MAX_PAGE_HASHES, buildHashMap, extractInlineScripts } from "../../../scripts/generate-csp-hashes.mjs";

/**
 * DEC-0163's per-page hash map, and the F-2-36 guards as they stand now that
 * the map is a file in the proxy's own bundle rather than a network fetch.
 */

const hash = (letter: string) => `sha256-${letter.repeat(43)}=`;

let directory: string;

function writeMap(content: unknown): void {
  const file = join(directory, CSP_HASH_MAP_PATH);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, typeof content === "string" ? content : JSON.stringify(content));
}

beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "csp-hashes-"));
  resetScriptHashCache();
  vi.stubEnv("VERCEL_DEPLOYMENT_ID", "");
  vi.stubEnv("VERCEL_ENV", "");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  rmSync(directory, { recursive: true, force: true });
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  resetScriptHashCache();
});

describe("DEC-0163: one page's hashes, keyed by the path the build wrote", () => {
  it("maps a public path through the locale rewrite onto its internal key", () => {
    expect(hashMapKey("/")).toBe("/de");
    expect(hashMapKey("/en")).toBe("/en");
    expect(hashMapKey("/ueber-uns")).toBe("/de/ueber-uns");
    expect(hashMapKey("/en/about")).toBe("/en/ueber-uns");
    expect(hashMapKey("/en/your-place/")).toBe("/en/dein-ort");
    expect(hashMapKey("/start")).toBe("/start");
  });

  it("serves the page's own set, and the common set for a path no page claims", () => {
    writeMap({
      common: [hash("C")],
      pages: { "/de/ueber-uns": [hash("C"), hash("U")], "/en/ueber-uns": [hash("C"), hash("E")] },
    });

    expect(scriptHashesFor("/ueber-uns", directory)).toEqual([hash("C"), hash("U")]);
    expect(scriptHashesFor("/en/about", directory)).toEqual([hash("C"), hash("E")]);
    expect(scriptHashesFor("/_next/static/chunks/x.js", directory)).toEqual([hash("C")]);
  });

  it("answers [] when no map exists — `next dev`", () => {
    expect(scriptHashesFor("/", directory)).toEqual([]);
  });
});

describe("F-2-36 defence 1: nothing a request carries selects where the hashes come from", () => {
  it("reads the file and never the network", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    writeMap({ common: [hash("C")], pages: {} });

    scriptHashesFor("https://attacker.example/", directory);
    scriptHashesFor("/", directory);

    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

describe("F-2-36 defence 2: the cache is keyed by deployment", () => {
  it("reads once per deployment, and again for the next one", () => {
    vi.stubEnv("VERCEL_DEPLOYMENT_ID", "dpl_one");
    writeMap({ common: [hash("A")], pages: {} });
    expect(scriptHashesFor("/x", directory)).toEqual([hash("A")]);

    writeMap({ common: [hash("B")], pages: {} });
    // Same deployment: the first read stands.
    expect(scriptHashesFor("/x", directory)).toEqual([hash("A")]);

    vi.stubEnv("VERCEL_DEPLOYMENT_ID", "dpl_two");
    expect(scriptHashesFor("/x", directory)).toEqual([hash("B")]);
  });
});

describe("F-2-36 defence 3: every entry is a sha256 source, de-duplicated and capped", () => {
  it("drops anything that is not a sha256 source", () => {
    const parsed = parseHashMap({
      common: [hash("A"), "' 'unsafe-inline", "x'; script-src *; '", 42, hash("A")],
      pages: { "/de": ["sha384-AAAA", hash("B")], "/en": "not a list" },
    });
    expect(parsed.common).toEqual([hash("A")]);
    expect(parsed.pages["/de"]).toEqual([hash("B")]);
    expect(parsed.pages["/en"]).toBeUndefined();
  });

  it("treats a malformed file as no map", () => {
    writeMap("{ not json");
    expect(scriptHashesFor("/", directory)).toEqual([]);
  });

  it("caps a list at MAX_SCRIPT_HASHES — the same number the build refuses to exceed", () => {
    expect(MAX_SCRIPT_HASHES).toBe(MAX_PAGE_HASHES);
    const many = Array.from({ length: MAX_SCRIPT_HASHES + 10 }, (_, index) =>
      `sha256-${index.toString(36).padStart(43, "a")}=`,
    );
    expect(parseHashMap({ common: many, pages: {} }).common).toHaveLength(MAX_SCRIPT_HASHES);
  });
});

describe("DEC-0163: the build step fails rather than truncating", () => {
  const page = (scripts: number) =>
    `<html><head></head><body>${Array.from({ length: scripts }, (_, index) => `<script>self.__next_f.push([1,"${index}"])</script>`).join("")}</body></html>`;

  it("hashes the inline scripts of every page, and finds the shared ones", () => {
    const shared = "<script>(self.__next_f=self.__next_f||[]).push([0])</script>";
    const map = buildHashMap([
      { pathname: "/de", html: `<html>${shared}<script>a()</script></html>` },
      { pathname: "/en", html: `<html>${shared}<script>b()</script></html>` },
    ]);
    expect(map.pages["/de"]).toHaveLength(2);
    expect(map.common).toHaveLength(1);
  });

  it("skips external and data scripts", () => {
    expect(
      extractInlineScripts(
        '<script src="/a.js"></script><script type="application/ld+json">{}</script><script>run()</script>',
      ),
    ).toEqual(["run()"]);
  });

  it("throws for a page over the cap", () => {
    expect(() => buildHashMap([{ pathname: "/de", html: page(MAX_PAGE_HASHES + 1) }])).toThrow(/over the cap/);
  });

  it("throws when no page carries an inline script, and for no pages at all", () => {
    expect(() => buildHashMap([{ pathname: "/de", html: "<html></html>" }])).toThrow(/bootstrap is missing/);
    expect(() => buildHashMap([])).toThrow(/no prerendered HTML/);
  });

  it("leaves a page without inline scripts out of the map — it gets the common set", () => {
    const map = buildHashMap([
      { pathname: "/de", html: "<html><script>a()</script></html>" },
      { pathname: "/_not-found", html: "<html></html>" },
    ]);
    expect(map.pages["/_not-found"]).toBeUndefined();
  });
});
