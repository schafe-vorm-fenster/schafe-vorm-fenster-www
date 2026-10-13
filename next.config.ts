import { join } from "node:path";

import { localeRewrites, redirectTable } from "./src/lib/routes/next-routing";
import { STATIC_SECURITY_HEADERS } from "./src/lib/security/csp";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,

  // DEC-0163: the per-page CSP hash map is built *inside* `next build`, by a
  // thin adapter that wraps whatever adapter the platform brings (Vercel sets
  // `NEXT_ADAPTER_PATH`; the wrapper delegates to it). See the file's header.
  adapterPath: join(process.cwd(), "scripts", "csp-adapter.mjs"),

  // DEC-0163 §2: every page is static, and stays byte-identical for the life
  // of a deployment — its inline scripts are hashed at build time, so HTML
  // that regenerated would carry a flight payload no hash covers. `max` is
  // the profile the repository's own content reads use (`_content.ts`,
  // `_chrome-data.ts`, `_footer-data.ts`, `_structured-data.tsx`, the proof
  // selection): that content changes with a deploy and never between, so the
  // profile is redefined to never revalidate (0xfffffffe is Next's own
  // "infinite" and makes the page's revalidate `false`). Any other profile on
  // a page fails the build in `scripts/csp-adapter.mjs`. Live data does not
  // pass through here at all — it loads in the browser from `/api/*`.
  cacheLife: {
    max: { stale: 300, revalidate: 0xfffffffe, expire: 0xfffffffe },
  },
  // DEC-0032 needs a 404 that actually renders. Next.js 16.3 does not
  // server-render the body of a `notFound()` inside the route tree — the
  // status is right and the RSC payload carries the page, but the HTML
  // document is an empty `__next_error__` shell and the browser leaves it
  // empty. `global-not-found` is the framework's own answer for exactly this
  // case (see its docs). Recorded in state/open.md.
  experimental: { globalNotFound: true },

  // TS-WEB-0014 D4: the static header set, one source, every route. The CSP, the
  // HSTS variance and the X-Robots-Tag live in `proxy.ts` — see the note there.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...STATIC_SECURITY_HEADERS],
      },
    ];
  },

  // TS-WEB-0011 D1 step 0 (the legacy map) and TS-WEB-0004 D3 rule 1 (the redundant
  // `/de/…` prefix). Both tables are derived from the route registry — no
  // path is typed here. Next.js evaluates redirects before rewrites, which is
  // the order both specs require.
  async redirects() {
    return [...redirectTable()];
  },

  // TS-WEB-0004 D3 rule 2 / D3a: the public, localized path is rewritten onto the
  // internal `app/[lang]/…` route, whose segments are the German ones. The
  // rewrite is invisible: the visitor keeps `/dein-ort` and `/en/your-place`.
  // `beforeFiles`, because a bare path like `/dein-ort` would otherwise match
  // `app/[lang]` with `lang = "dein-ort"`.
  async rewrites() {
    return {
      beforeFiles: [...localeRewrites()],
      // TS-WEB-0004 D3.4: nothing here. An unknown first segment matches
      // `app/[lang]`, whose page calls `notFound()` — status 404, and the
      // body renders wherever the page can hydrate. A rewrite onto Next's own
      // `/_not-found` was tried and reverted: it renders the right document
      // but Vercel serves the rewritten route with **200**, and a 404 that
      // says 200 is worse than a 404 that renders thin. The empty body is
      // `state/open.md` row 132's CSP gap, not a routing one.
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
