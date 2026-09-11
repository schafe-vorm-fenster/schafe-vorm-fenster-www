import { headers } from "next/headers";

import { robotsFor } from "@/src/lib/seo/robots";

import type { MetadataRoute } from "next";

// TS-015 D3: the robots surface depends on the request host, so it is dynamic.
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers();
  return robotsFor(process.env.VERCEL_ENV, requestHeaders.get("host"));
}
