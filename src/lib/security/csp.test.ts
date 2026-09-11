import { describe, expect, it } from "vitest";

import {
  ALLOWLIST,
  contentSecurityPolicy,
  isScriptHash,
  policyDirectives,
  SCRIPT_HASH_PATTERN,
  STATIC_SECURITY_HEADERS,
  strictTransportSecurity,
} from "@/src/lib/security/csp";

describe("TS-014 D2: the Content-Security-Policy, written out", () => {
  it("names every directive of the determination", () => {
    const directives = Object.keys(policyDirectives({ environment: "production" }));
    expect(directives).toEqual([
      "default-src",
      "base-uri",
      "script-src",
      "style-src",
      "img-src",
      "font-src",
      "connect-src",
      "media-src",
      "manifest-src",
      "worker-src",
      "object-src",
      "frame-src",
      "child-src",
      "form-action",
      "frame-ancestors",
      "upgrade-insecure-requests",
      "report-to",
      "report-uri",
    ]);
  });

  it("uses default-src 'self', not 'none' — prefetch is the first casualty", () => {
    const { "default-src": defaultSrc } = policyDirectives({
      environment: "production",
    });
    expect(defaultSrc).toEqual(["'self'"]);
  });

  it("carries hashes and the host allowlist together, with no 'strict-dynamic'", () => {
    const { "script-src": scriptSrc } = policyDirectives({
      environment: "production",
      scriptHashes: ["sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="],
    });
    // See state/open.md rows 21/31: 'strict-dynamic' measurably breaks the
    // same-origin chunks it was meant to help — dropped for good, not just
    // while the hash set is empty.
    expect(scriptSrc).not.toContain("'strict-dynamic'");
    expect(scriptSrc).toContain("'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='");
    expect(scriptSrc).toContain(ALLOWLIST.etracker);
    expect(scriptSrc).toContain(ALLOWLIST.portalize);
    expect(scriptSrc).toContain(ALLOWLIST.envoy);
  });

  it("keeps frame-src 'none' so the Portalize iframe fallback fails loudly", () => {
    expect(
      policyDirectives({ environment: "production" })["frame-src"],
    ).toEqual(["'none'"]);
  });

  it("serialises to a single header value", () => {
    const header = contentSecurityPolicy({ environment: "production" });
    expect(header).toContain("default-src 'self'; base-uri 'self';");
    expect(header).toContain("upgrade-insecure-requests");
    expect(header).toContain("report-uri /api/csp-report");
  });
});

describe("TS-014 D3 (DEC-045): per-build hashes, not a nonce", () => {
  it("places every supplied hash in script-src and emits no nonce", () => {
    const header = contentSecurityPolicy({
      environment: "production",
      scriptHashes: ["sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=", "sha256-BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="],
    });
    expect(header).toContain("'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='");
    expect(header).toContain("'sha256-BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB='");
    expect(header).not.toContain("nonce-");
  });
});

describe("state/open.md rows 21 & 31: the CSP that actually hydrates", () => {
  it("never emits 'strict-dynamic', hashes or not — it only ever ignores 'self' here, never adds trust", () => {
    for (const scriptHashes of [[], ["sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="]]) {
      for (const environment of ["production", "preview", "development"] as const) {
        const { "script-src": scriptSrc } = policyDirectives({ environment, scriptHashes });
        expect(scriptSrc).not.toContain("'strict-dynamic'");
      }
    }
  });

  it("in production with an empty hash set, still ships no 'unsafe-inline' — the host allowlist carries it instead", () => {
    const { "script-src": scriptSrc } = policyDirectives({
      environment: "production",
      scriptHashes: [],
    });
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).toContain("'self'");
    expect(scriptSrc).toContain(ALLOWLIST.etracker);
  });

  it("lets 'next dev' hydrate: 'unsafe-inline' stands in for the hash set that only a build produces", () => {
    const { "script-src": scriptSrc } = policyDirectives({
      environment: "development",
      scriptHashes: [],
    });
    expect(scriptSrc).toContain("'unsafe-inline'");
  });

  it("prefers hashes over 'unsafe-inline' in development too, once they exist", () => {
    const { "script-src": scriptSrc } = policyDirectives({
      environment: "development",
      scriptHashes: ["sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="],
    });
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).toContain("'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='");
  });

  it("lets the deployed preview hydrate too, for the same reason as dev: the hash asset doesn't reach it yet", () => {
    const { "script-src": scriptSrc } = policyDirectives({
      environment: "preview",
      scriptHashes: [],
    });
    expect(scriptSrc).toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'strict-dynamic'");
  });

  it("prefers hashes over 'unsafe-inline' in preview too, once the asset reaches it", () => {
    const { "script-src": scriptSrc } = policyDirectives({
      environment: "preview",
      scriptHashes: ["sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="],
    });
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).toContain("'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='");
  });

  it("never grants production the preview/dev 'unsafe-inline' concession, hash set or not — D7 holds unconditionally there", () => {
    for (const scriptHashes of [[], ["sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="]]) {
      const { "script-src": scriptSrc } = policyDirectives({ environment: "production", scriptHashes });
      expect(scriptSrc).not.toContain("'unsafe-inline'");
    }
  });
});

describe("TS-014 D7: no wildcard, ever", () => {
  const forbiddenInScriptOrConnect = [
    "*",
    "https:",
    "data:",
    "blob:",
    "'unsafe-inline'",
    "'unsafe-eval'",
  ];

  it("keeps the production script and connect directives free of wildcards", () => {
    const directives = policyDirectives({ environment: "production" });
    for (const key of ["script-src", "connect-src"] as const) {
      for (const forbidden of forbiddenInScriptOrConnect) {
        expect(directives[key]).not.toContain(forbidden);
      }
    }
  });

  it("permits data: in img-src only", () => {
    const directives = policyDirectives({ environment: "production" });
    expect(directives["img-src"]).toContain("data:");
  });

  it("admits 'unsafe-eval' and the HMR socket in local development only", () => {
    const dev = policyDirectives({ environment: "development" });
    expect(dev["script-src"]).toContain("'unsafe-eval'");
    expect(dev["connect-src"]).toContain("ws:");
    expect(dev["upgrade-insecure-requests"]).toBeUndefined();
  });
});

describe("TS-014 D4/D5: security headers, header by header", () => {
  it("sets the static header set with the specified values", () => {
    const headers = Object.fromEntries(
      STATIC_SECURITY_HEADERS.map(({ key, value }) => [key, value]),
    );
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Cross-Origin-Opener-Policy"]).toBe("same-origin");
    expect(headers["Cross-Origin-Resource-Policy"]).toBe("same-origin");
    expect(headers["Reporting-Endpoints"]).toBe('csp="/api/csp-report"');
  });

  it("does not set the headers the determination deliberately omits", () => {
    const keys = STATIC_SECURITY_HEADERS.map(({ key }) => key);
    expect(keys).not.toContain("Cross-Origin-Embedder-Policy");
    expect(keys).not.toContain("X-XSS-Protection");
    expect(keys).not.toContain("Expect-CT");
  });

  it("grades HSTS per environment and ships no preload", () => {
    expect(strictTransportSecurity("production")).toBe(
      "max-age=63072000; includeSubDomains",
    );
    expect(strictTransportSecurity("preview")).toBe(
      "max-age=86400; includeSubDomains",
    );
    expect(strictTransportSecurity("development")).toBeNull();
    expect(strictTransportSecurity("production")).not.toContain("preload");
  });
});

describe("F-2-36: script-src accepts nothing but a real sha256 source", () => {
  const valid = `sha256-${"A".repeat(43)}=`;

  it("drops every malformed entry before it can be interpolated", () => {
    const { "script-src": scriptSrc } = policyDirectives({
      environment: "production",
      scriptHashes: [
        valid,
        "sha256-abc",
        "' 'unsafe-inline",
        "x'; script-src *; '",
        `sha384-${"A".repeat(43)}=`,
        `sha256-${"A".repeat(42)}==`,
      ],
    });
    expect(scriptSrc).toContain(`'${valid}'`);
    for (const token of scriptSrc) expect(token).not.toContain(";");
    expect(scriptSrc.filter((token) => token.startsWith("'sha256-"))).toHaveLength(1);
  });

  it("treats a hash set that is entirely malformed as no hash set at all", () => {
    // …so preview still gets its documented 'unsafe-inline' fallback rather
    // than a policy that trusts nothing and blocks everything.
    const { "script-src": scriptSrc } = policyDirectives({
      environment: "preview",
      scriptHashes: ["sha256-abc", "nonsense"],
    });
    expect(scriptSrc).toContain("'unsafe-inline'");
    expect(scriptSrc.some((token) => token.includes("nonsense"))).toBe(false);
  });

  it("states the shape rather than implying it", () => {
    expect(isScriptHash(valid)).toBe(true);
    expect(isScriptHash("sha256-abc")).toBe(false);
    expect(SCRIPT_HASH_PATTERN.source).toContain("sha256-");
  });
});
