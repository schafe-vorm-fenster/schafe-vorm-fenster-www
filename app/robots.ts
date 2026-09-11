import { headers } from "next/headers";

import { robotsFor } from "@/src/lib/seo/robots";

import type { MetadataRoute } from "next";

// TS-015 D3: the robots surface depends on the request host, so it is dynamic.
// Under Cache Components that is the default and `dynamic = "force-dynamic"` is
// a build error — reading `headers()` is what makes this route request-bound,
// and it says so at the call site instead of in a segment config.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers();
  return robotsFor(process.env.VERCEL_ENV, requestHeaders.get("host"));
}
