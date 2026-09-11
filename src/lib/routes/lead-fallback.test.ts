import { describe, expect, it } from "vitest";

import { leadFallbackUrl } from "@/src/lib/routes/lead-fallback";

describe("TS-016 D6 / TS-004 D1: `/start`'s one configured target", () => {
  it("falls back to the live lead form when nothing is configured", () => {
    expect(leadFallbackUrl({})).toMatch(/^https:\/\/docs\.google\.com\/forms\//);
  });

  it("takes a configured https target — the envoy swap is one value", () => {
    expect(leadFallbackUrl({ LEAD_FALLBACK_URL: "https://envoy.example/lead" })).toBe(
      "https://envoy.example/lead",
    );
  });

  it("refuses a non-https or malformed value rather than becoming an open redirect", () => {
    for (const configured of [
      "http://insecure.example/lead",
      "javascript:alert(1)",
      "//evil.example",
      "not a url",
      "data:text/html,<script>1</script>",
    ])
      expect(leadFallbackUrl({ LEAD_FALLBACK_URL: configured }), configured).toMatch(
        /^https:\/\/docs\.google\.com\/forms\//,
      );
  });
});
