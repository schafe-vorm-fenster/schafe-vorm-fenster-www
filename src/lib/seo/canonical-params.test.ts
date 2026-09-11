import { describe, expect, it } from "vitest";

import { canonicalAbsoluteUrl, canonicalPath } from "@/src/lib/seo/canonical-params";

describe("TS-011-A10 / D9: canonical strips every query parameter", () => {
  it("strips a place-search parameter", () => {
    expect(canonicalPath("/dein-ort?ort=schlatkow")).toBe("/dein-ort");
  });

  it("strips etcc_* the same way it strips any other parameter", () => {
    expect(canonicalPath("/mitmachen?etcc_cmp=x&etcc_med=y")).toBe("/mitmachen");
  });

  it("strips the fragment too", () => {
    expect(canonicalPath("/rechtliches?etcc_cmp=x#impressum")).toBe("/rechtliches");
  });

  it("leaves a parameter-free path unchanged", () => {
    expect(canonicalPath("/dein-kalender")).toBe("/dein-kalender");
  });

  it("does the same for an absolute URL", () => {
    expect(
      canonicalAbsoluteUrl("https://www.schafe-vorm-fenster.de/dein-ort?ort=schlatkow&etcc_cmp=x"),
    ).toBe("https://www.schafe-vorm-fenster.de/dein-ort");
  });
});
