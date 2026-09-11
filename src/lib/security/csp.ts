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
 * set is injected at build time — see `scriptHashes` below,
 * `scripts/generate-csp-hashes.mjs` (the extraction step, run as part of
 * `pnpm build`, after `next build`) and `src/lib/security/csp-hashes.ts` (how
 * `proxy.ts` reads the result at runtime).
 *
 * `'strict-dynamic'` is **not** part of the policy — a correction to DEC-045,
 * recorded in state/open.md rows 21 and 31. The scaffolded module shipped it
 * unconditionally with an empty hash set, which blocked every script,
 * hydration included: 'strict-dynamic' makes the browser stop honouring
 * 'self' and the host allowlist in this directive, and every script tag Next
 * renders (chunks *and* the inline flight payload) is parser-inserted into
 * the static HTML rather than appended at runtime by a trusted script — the
 * only case 'strict-dynamic' actually helps. Measured in Chromium: even with
 * real hashes present, adding 'strict-dynamic' back let the hashed inline
 * scripts run but kept refusing every same-origin `<script src>` chunk.
 * Dropping it lets 'self' and the hashes both apply normally, which is what
 * hydrates.
 */

/** The four external origins of TS-014 D1. No fifth. */
export const ALLOWLIST = {
  etracker: "https://code.etracker.com",
  portalize: "https://portalize.schafe-vorm-fenster.de",
  envoy: "https://envoy-api.api.schafe-vorm-fenster.de",
  /** TS-014 D1: named by WEB-Q-030, but active in no directive today. */
  app: "https://app.schafe-vorm-fenster.de",
} as const;

/**
 * A `script-src` hash source, exactly as `scripts/generate-csp-hashes.mjs`
 * writes it: `sha256-` plus the 44 base64 characters of a SHA-256 digest.
 *
 * The policy interpolates each entry as `'<hash>'` (below), so a string
 * carrying `'` or `;` would write arbitrary tokens — a whole extra
 * directive — into the header. F-2-36: the shape is checked here, at the
 * interpolation point, so the guard holds for every caller and not only for
 * the one module that fetches the build artifact
 * (`csp-hashes.ts` applies the same predicate at its own boundary).
 */
export const SCRIPT_HASH_PATTERN = /^sha256-[A-Za-z0-9+/]{43}=$/;

/** True for a string that may be interpolated into `script-src` as `'<hash>'`. */
export function isScriptHash(value: string): boolean {
  return SCRIPT_HASH_PATTERN.test(value);
}

export type Environment = "production" | "preview" | "development";

export interface PolicyInput {
  readonly environment: Environment;
  /**
   * DEC-045: the per-build `'sha256-…'` hashes of every inline script, from
   * `src/lib/security/csp-hashes.ts`. When empty, the inline scripts have
   * nothing to run on except the `'unsafe-inline'` concession below — which
   * applies in `next dev` (no build has run the extraction step) and, for
   * now, in preview too (state/open.md rows 21/31: the hash asset does not
   * yet reach the deployed Proxy function). Never in production.
   */
  readonly scriptHashes?: readonly string[];
}

/** The directive set of TS-014 D2, as data rather than as a string. */
export function policyDirectives({
  environment,
  scriptHashes = [],
}: PolicyInput): Record<string, readonly string[]> {
  const isDev = environment === "development";
  const isPreview = environment === "preview";
  const { etracker, portalize, envoy } = ALLOWLIST;
  // F-2-36: only a well-formed hash source is interpolated. A rejected entry
  // is dropped rather than escaped — there is no legitimate `script-src`
  // hash this predicate refuses, so anything it refuses is a defect or an
  // attack, and neither belongs in the header.
  const validHashes = scriptHashes.filter(isScriptHash);
  const hasHashes = validHashes.length > 0;

  const scriptSrc = [
    "'self'",
    ...validHashes.map((hash) => `'${hash}'`),
    // No 'strict-dynamic', by measurement rather than by the original design
    // (DEC-045 assumed it would "still apply" once hashes exist — see
    // state/open.md rows 21/31 for the correction). Every script tag Next
    // renders here — the framework/page chunks *and* the inline flight
    // payload — is parser-inserted straight into the static HTML, not
    // appended at runtime by an already-trusted script. CSP3's
    // 'strict-dynamic' only propagates trust to the *latter* kind; for the
    // former it does the opposite of what's needed, since its defined
    // behaviour is to make the browser stop matching 'self' and every host
    // source in this directive. Measured in Chromium: with 'strict-dynamic'
    // present, the hashed inline scripts ran but every same-origin
    // `<script src>` chunk was still refused — hydration stayed broken.
    // Without it, 'self' matches the chunks and the hashes match the inline
    // scripts, both at once; that combination is what actually hydrates.
    etracker,
    portalize,
    envoy,
    // TS-014 D5: HMR needs eval, and only in local development.
    ...(isDev ? ["'unsafe-eval'"] : []),
    // `next dev` never produces the static HTML the hash extraction scans, so
    // there is no hash set to trust Next's inline bootstrap/flight scripts
    // with. TS-014 D7's 'unsafe-inline' ban is scoped to "a production
    // script directive" — this is the same kind of dev-only concession as
    // 'unsafe-eval' just above, not a production relaxation.
    ...(isDev && !hasHashes ? ["'unsafe-inline'"] : []),
    // Preview-only fallback, state/open.md rows 21/31: the hash asset
    // scripts/generate-csp-hashes.mjs writes does not reach the deployed
    // Proxy function today. Two mechanisms were tried and measured to fail —
    // a hand-written file under `.next/security/` (excluded from the
    // function's traced filesystem) and the same file republished under
    // `.next/static/security/` for the proxy to fetch at runtime (Vercel's
    // static-asset upload is itself manifest-driven and does not pick up a
    // file no Next manifest references, so the fetch 404s) — and a
    // build-time Vercel Edge Config write was ruled out by a permission
    // denial before a token could be created. The preview is the surface
    // reviews and user tests run on, so it ships with 'unsafe-inline' rather
    // than staying inert; production never does, hash set or not — D7's ban
    // holds there unconditionally.
    ...(isPreview && !hasHashes ? ["'unsafe-inline'"] : []),
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
