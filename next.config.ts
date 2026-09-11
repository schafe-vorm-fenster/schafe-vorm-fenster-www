import { localeRewrites, redirectTable } from "./src/lib/routes/next-routing";
import { STATIC_SECURITY_HEADERS } from "./src/lib/security/csp";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  // DEC-032 needs a 404 that actually renders. Next.js 16.3 does not
  // server-render the body of a `notFound()` inside the route tree — the
  // status is right and the RSC payload carries the page, but the HTML
  // document is an empty `__next_error__` shell and the browser leaves it
  // empty. `global-not-found` is the framework's own answer for exactly this
  // case (see its docs). Recorded in state/open.md.
  experimental: { globalNotFound: true },

  // TS-014 D4: the static header set, one source, every route. The CSP, the
  // HSTS variance and the X-Robots-Tag live in `proxy.ts` — see the note there.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...STATIC_SECURITY_HEADERS],
      },
    ];
  },

  // TS-011 D1 step 0 (the legacy map) and TS-004 D3 rule 1 (the redundant
  // `/de/…` prefix). Both tables are derived from the route registry — no
  // path is typed here. Next.js evaluates redirects before rewrites, which is
  // the order both specs require.
  async redirects() {
    return [...redirectTable()];
  },

  // TS-004 D3 rule 2 / D3a: the public, localized path is rewritten onto the
  // internal `app/[lang]/…` route, whose segments are the German ones. The
  // rewrite is invisible: the visitor keeps `/dein-ort` and `/en/your-place`.
  // `beforeFiles`, because a bare path like `/dein-ort` would otherwise match
  // `app/[lang]` with `lang = "dein-ort"`.
  async rewrites() {
    return {
      beforeFiles: [...localeRewrites()],
      // TS-004 D3.4: nothing here. An unknown first segment matches
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
