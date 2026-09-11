/**
 * The Content-Security-Policy and the static security headers — TS-014.
 *
 * TS-014 D7 makes this module the *single* source of the policy: "The policy
 * is one typed structure in one module — never a string spread across config
 * files." D1's allowlist table and `ALLOWLIST` below are the same list; a host
 * in one and not the other is a defect (TS-014-A1).
 *
 * DEC-045 fixes the script strategy: per-build `'sha256-…'` hashes, no
 * per-request nonce, so the prerendered shell of TS-004 D6 survives. The hash
 * set is injected at build time; see `scriptHashes` below and
 * `docs/` note in README — the extraction step is M4 work and is recorded in
 * state/open.md until then.
 */

/** The four external origins of TS-014 D1. No fifth. */
export const ALLOWLIST = {
  etracker: "https://code.etracker.com",
  portalize: "https://portalize.schafe-vorm-fenster.de",
  envoy: "https://envoy-api.api.schafe-vorm-fenster.de",
  /** TS-014 D1: named by WEB-Q-030, but active in no directive today. */
  app: "https://app.schafe-vorm-fenster.de",
} as const;

export type Environment = "production" | "preview" | "development";

export interface PolicyInput {
  readonly environment: Environment;
  /**
   * DEC-045: the per-build `'sha256-…'` hashes of every inline script.
   * Empty until the build-time extraction step exists — the policy then
   * relies on `'strict-dynamic'` plus the CSP2 host fallback alone.
   */
  readonly scriptHashes?: readonly string[];
}

/** The directive set of TS-014 D2, as data rather than as a string. */
export function policyDirectives({
  environment,
  scriptHashes = [],
}: PolicyInput): Record<string, readonly string[]> {
  const isDev = environment === "development";
  const { etracker, portalize, envoy } = ALLOWLIST;

  const scriptSrc = [
    "'self'",
    ...scriptHashes.map((hash) => `'${hash}'`),
    "'strict-dynamic'",
    etracker,
    portalize,
    envoy,
    // TS-014 D5: HMR needs eval, and only in local development.
    ...(isDev ? ["'unsafe-eval'"] : []),
  ];

  const connectSrc = [
    "'self'",
    etracker,
    portalize,
    envoy,
    ...(isDev ? ["ws:", "http://localhost:*"] : []),
  ];

  return {
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "script-src": scriptSrc,
    // TS-014 D2: the one bounded concession — Next inlines critical CSS and
    // both web components style their shadow roots inline.
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", etracker],
    "font-src": ["'self'"],
    "connect-src": connectSrc,
    "media-src": ["'self'"],
    "manifest-src": ["'self'"],
    "worker-src": ["'self'"],
    "object-src": ["'none'"],
    "frame-src": ["'none'"],
    "child-src": ["'none'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    ...(isDev ? {} : { "upgrade-insecure-requests": [] }),
    "report-to": ["csp"],
    "report-uri": ["/api/csp-report"],
  };
}

/** The policy serialised for the `Content-Security-Policy` header. */
export function contentSecurityPolicy(input: PolicyInput): string {
  return Object.entries(policyDirectives(input))
    .map(([directive, values]) =>
      values.length ? `${directive} ${values.join(" ")}` : directive,
    )
    .join("; ");
}

/**
 * TS-014 D4 — the static header set, applied to every route.
 * `Strict-Transport-Security` is per-environment (D5) and therefore not here;
 * it is added in the proxy alongside the CSP.
 */
export const STATIC_SECURITY_HEADERS: ReadonlyArray<{
  key: string;
  value: string;
}> = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "autoplay=()",
      "browsing-topics=()",
      "camera=()",
      "display-capture=()",
      "encrypted-media=()",
      "fullscreen=(self)",
      "geolocation=(self)",
      "gyroscope=()",
      "idle-detection=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "picture-in-picture=()",
      "publickey-credentials-get=()",
      "screen-wake-lock=()",
      "serial=()",
      "usb=()",
      "xr-spatial-tracking=()",
    ].join(", "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Reporting-Endpoints", value: 'csp="/api/csp-report"' },
];

/** TS-014 D5 — HSTS differs per environment; off in local development. */
export function strictTransportSecurity(
  environment: Environment,
): string | null {
  switch (environment) {
    case "production":
      return "max-age=63072000; includeSubDomains";
    case "preview":
      return "max-age=86400; includeSubDomains";
    case "development":
      return null;
  }
}
