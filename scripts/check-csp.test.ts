import { describe, expect, it } from "vitest";

import { checkCsp, checkPolicyDirectives, checkPreviewUnsafeInlineFence } from "./check-csp";

/**
 * TS-014-A1 / D7 (F-1-2). Negative tests with fixture policies: each one
 * hands `checkPolicyDirectives` a directive record shaped like a real
 * mistake — a wildcard, a bare scheme, a foreign host, a production
 * `'unsafe-inline'` — and asserts the guard actually flags it, not just
 * that the real `csp.ts` happens to pass today. The last block runs the
 * real module through `checkCsp()`/`checkPreviewUnsafeInlineFence()` to
 * pin the positive case too.
 */
describe("TS-014-A1: checkPolicyDirectives — fixture policies", () => {
  it("passes a clean, minimal policy", () => {
    const errors = checkPolicyDirectives("production", {
      "default-src": ["'self'"],
      "script-src": ["'self'", "https://code.etracker.com"],
    });
    expect(errors).toEqual([]);
  });

  it("flags a wildcard source, wherever it appears", () => {
    const errors = checkPolicyDirectives("production", {
      "script-src": ["'self'", "https://*.example.com"],
    });
    expect(errors.some((e) => e.includes("wildcard"))).toBe(true);
  });

  it("flags a bare '*' the same way", () => {
    const errors = checkPolicyDirectives("preview", {
      "connect-src": ["'self'", "*"],
    });
    expect(errors.some((e) => e.includes("wildcard"))).toBe(true);
  });

  it("flags a bare scheme in script-src", () => {
    const errors = checkPolicyDirectives("production", {
      "script-src": ["'self'", "https:"],
    });
    expect(errors.some((e) => e.includes("bare scheme"))).toBe(true);
  });

  it("flags a bare scheme in connect-src", () => {
    const errors = checkPolicyDirectives("production", {
      "connect-src": ["'self'", "http:"],
    });
    expect(errors.some((e) => e.includes("bare scheme"))).toBe(true);
  });

  it("does not flag a bare scheme outside script-src/connect-src", () => {
    // img-src's own concessions (data:, a host) are not this rule's business.
    const errors = checkPolicyDirectives("production", {
      "img-src": ["'self'", "data:"],
    });
    expect(errors).toEqual([]);
  });

  it("flags a host with no row in D1", () => {
    const errors = checkPolicyDirectives("production", {
      "script-src": ["'self'", "https://evil.example.com"],
    });
    expect(errors.some((e) => e.includes("no row in D1"))).toBe(true);
  });

  it("accepts every real D1 host", () => {
    const errors = checkPolicyDirectives("production", {
      "script-src": [
        "'self'",
        "https://code.etracker.com",
        "https://portalize.schafe-vorm-fenster.de",
        "https://envoy-api.api.schafe-vorm-fenster.de",
        "https://app.schafe-vorm-fenster.de",
      ],
    });
    expect(errors).toEqual([]);
  });

  it("flags 'unsafe-inline' in a production script-src", () => {
    const errors = checkPolicyDirectives("production", {
      "script-src": ["'self'", "'unsafe-inline'"],
    });
    expect(errors.some((e) => e.includes("'unsafe-inline'"))).toBe(true);
  });

  it("flags 'unsafe-eval' in a production script-src", () => {
    const errors = checkPolicyDirectives("production", {
      "script-src": ["'self'", "'unsafe-eval'"],
    });
    expect(errors.some((e) => e.includes("'unsafe-eval'"))).toBe(true);
  });

  it("does not flag 'unsafe-inline' in style-src — D2's bounded concession, any environment", () => {
    const errors = checkPolicyDirectives("production", {
      "style-src": ["'self'", "'unsafe-inline'"],
    });
    expect(errors).toEqual([]);
  });

  it("does not flag 'unsafe-inline'/'unsafe-eval' in a non-production script-src", () => {
    const errors = checkPolicyDirectives("preview", {
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    });
    expect(errors).toEqual([]);
  });

  it("reports every violation found, not just the first", () => {
    const errors = checkPolicyDirectives("production", {
      "script-src": ["'self'", "*", "https:", "https://evil.example.com", "'unsafe-inline'"],
    });
    expect(errors.length).toBeGreaterThanOrEqual(4);
  });
});

describe("F-2-27: the preview-only 'unsafe-inline' fence, asserted exactly", () => {
  it("holds for the real csp.ts today", () => {
    expect(checkPreviewUnsafeInlineFence()).toEqual([]);
  });

  it("flags a fence that never grants preview's documented fallback", () => {
    const noFallback = () => ({ "script-src": ["'self'"] });
    const errors = checkPreviewUnsafeInlineFence(noFallback);
    expect(errors.some((e) => e.includes("expected the documented"))).toBe(true);
  });

  it("flags a fence that leaves 'unsafe-inline' in preview even once hashes exist", () => {
    const stuckOpen = () => ({ "script-src": ["'self'", "'unsafe-inline'"] });
    const errors = checkPreviewUnsafeInlineFence(stuckOpen);
    expect(errors.some((e) => e.includes("must disappear once a hash set exists"))).toBe(true);
  });

  it("flags a fence that leaks 'unsafe-inline' into production, with or without hashes", () => {
    const leaky = () => ({ "script-src": ["'self'", "'unsafe-inline'"] });
    const errors = checkPreviewUnsafeInlineFence(leaky);
    expect(errors.filter((e) => e.startsWith("F-2-27 production")).length).toBe(2);
  });

  it("is exact: a correct fence (present only for hashless preview) reports nothing", () => {
    const correct = (input: { environment: string; scriptHashes?: readonly string[] }) => ({
      "script-src":
        input.environment === "preview" && !(input.scriptHashes ?? []).length
          ? ["'self'", "'unsafe-inline'"]
          : ["'self'"],
    });
    expect(checkPreviewUnsafeInlineFence(correct)).toEqual([]);
  });
});

describe("TS-014-A1: checkCsp — the real module, all four cases", () => {
  it("is green: no wildcard, every host in D1, no unsafe-inline/unsafe-eval in production, the preview fence exact", () => {
    const { errors, casesChecked } = checkCsp();
    expect(errors).toEqual([]);
    expect(casesChecked).toBe(4);
  });
});
