import { describe, expect, it } from "vitest";

import {
  LEAD_FORM_ORIGIN,
  leadFallbackUrl,
  leadFormEmbedUrl,
} from "@/src/lib/routes/lead-fallback";
import { ALLOWLIST } from "@/src/lib/security/csp";

describe("TS-WEB-0016 D6 / TS-WEB-0004 D1: `/start`'s one configured target", () => {
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

describe("TS-WEB-0016 D15 / DEC-0121 §2: the `iframe` source of `/start`", () => {
  it("is the form with Google Forms' own `?embedded=true`", () => {
    const src = new URL(leadFormEmbedUrl({}));
    expect(src.origin).toBe(LEAD_FORM_ORIGIN);
    expect(src.pathname).toMatch(/^\/forms\/d\/e\/[^/]+\/viewform$/);
    expect(src.searchParams.get("embedded")).toBe("true");
  });

  it("names the same host the CSP admits in `frame-src` — one constant, two sides", () => {
    expect(LEAD_FORM_ORIGIN).toBe(ALLOWLIST.googleForms);
    expect(new URL(leadFormEmbedUrl({})).origin).toBe(ALLOWLIST.googleForms);
  });

  it("frames a configured form on the allowlisted origin, keeping its own query", () => {
    const src = new URL(
      leadFormEmbedUrl({
        LEAD_FALLBACK_URL: "https://docs.google.com/forms/d/e/other/viewform?usp=sf_link",
      }),
    );
    expect(src.pathname).toBe("/forms/d/e/other/viewform");
    expect(src.searchParams.get("usp")).toBe("sf_link");
    expect(src.searchParams.get("embedded")).toBe("true");
  });

  it("does not set `embedded` twice when the configured URL already carries it", () => {
    const src = leadFormEmbedUrl({
      LEAD_FALLBACK_URL: "https://docs.google.com/forms/d/e/other/viewform?embedded=true",
    });
    expect(src.match(/embedded=/g)).toHaveLength(1);
  });

  it("never frames a host `frame-src` would refuse — a foreign target falls back to the form", () => {
    for (const configured of [
      "https://envoy.example/lead",
      "https://docs.google.com.evil.example/forms/x",
      "http://docs.google.com/forms/x",
    ]) {
      const src = new URL(leadFormEmbedUrl({ LEAD_FALLBACK_URL: configured }));
      expect(src.origin, configured).toBe(LEAD_FORM_ORIGIN);
      expect(src.pathname, configured).toMatch(/^\/forms\/d\/e\/1FAIpQLSd/);
    }
  });
});
