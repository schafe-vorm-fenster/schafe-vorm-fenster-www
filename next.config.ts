import { STATIC_SECURITY_HEADERS } from "./src/lib/security/csp";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

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
};

export default nextConfig;
