import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { checkBrand } from "./check-brand";

/**
 * Round 1, row 42: `check-brand.ts` used to also walk `.next/static` to
 * catch "generated CSS", and its `min-width` regex had no `@media (...)`
 * context test — so a minified `min-width:0}` *property* in the built tree
 * ran the value capture past the property, picked up unrelated minified
 * text as its "value", and failed a clean build every time. These fixtures
 * are built fresh per test (never committed to the tree) and removed
 * afterwards.
 */

let fixtureRoot: string | undefined;

function fixture(...segments: string[]): string {
  const path = join(fixtureRoot!, ...segments);
  mkdirSync(join(path, ".."), { recursive: true });
  return path;
}

afterEach(() => {
  if (fixtureRoot) rmSync(fixtureRoot, { recursive: true, force: true });
  fixtureRoot = undefined;
});

function newRoot(): string {
  fixtureRoot = mkdtempSync(join(tmpdir(), "check-brand-"));
  return fixtureRoot;
}

describe("TS-017-A4: check-brand excludes build output from the scan", () => {
  it("does not trip on a built .next tree carrying a minified min-width property", () => {
    const root = newRoot();
    // A shape modelled on real Next.js output: no whitespace, and a
    // `min-width:0}` *property* — not a media feature — followed later in
    // the same minified line by an unrelated `)` from another declaration.
    writeFileSync(
      fixture(".next", "static", "css", "app.css"),
      ".flex{display:flex;min-width:0}.btn{background:rgba(0,0,0,.5)}",
    );
    const result = checkBrand(root);
    expect(result.errors).toEqual([]);
    expect(result.cssFileCount).toBe(0);
  });

  it("does not trip on a built .next tree even if node_modules/.vercel sit beside it", () => {
    const root = newRoot();
    writeFileSync(
      fixture("node_modules", "some-pkg", "dist", "style.css"),
      ".x{min-width:0}",
    );
    writeFileSync(fixture(".vercel", "output", "static", "x.css"), ".y{min-width:0}");
    const result = checkBrand(root);
    expect(result.errors).toEqual([]);
  });

  it("still catches an authored max-width media query", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "legacy.css"),
      "@media (max-width: 600px) { .x { display: none; } }",
    );
    const result = checkBrand(root);
    expect(result.errors.some((e) => e.startsWith("A4") && e.includes("max-width"))).toBe(
      true,
    );
  });

  it("still catches an authored min-width media query with a non-token value", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "base.css"),
      "@media (min-width: 37.5rem) { .x { display: block; } }",
    );
    const result = checkBrand(root);
    expect(
      result.errors.some((e) => e.startsWith("A4") && e.includes("min-width")),
    ).toBe(true);
  });

  it("accepts an authored min-width media query on a breakpoint token", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "base.css"),
      "@media (min-width: 48rem) { .x { display: block; } }",
    );
    const result = checkBrand(root);
    expect(result.errors).toEqual([]);
  });

  it("does not mistake a min-width property for a media feature", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "base.css"),
      ".card { min-width: 0; max-width: 100%; }",
    );
    const result = checkBrand(root);
    expect(result.errors).toEqual([]);
  });

  it("does not mistake a minified min-width property for a media feature, even authored", () => {
    // The regex fix itself, isolated from the directory-exclusion fix: the
    // same shape as row 42's bug (a `min-width:0}` property immediately
    // followed, with no separating whitespace, by an unrelated `)` later in
    // the line), but placed in an *authored* file the scan does visit.
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "weird.css"),
      ".flex{display:flex;min-width:0}.btn{background:rgba(0,0,0,.5)}",
    );
    const result = checkBrand(root);
    // Unrelated to A4: the fixture's `rgba(` is a genuine A5 colour-literal
    // violation (this file is not the token file) — expected and ignored
    // here, which is exactly why this asserts on A4 specifically rather
    // than on an empty error list.
    expect(result.errors.filter((e) => e.startsWith("A4"))).toEqual([]);
    expect(result.cssFileCount).toBe(1);
  });
});
