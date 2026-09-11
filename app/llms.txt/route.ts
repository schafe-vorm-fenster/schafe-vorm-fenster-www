import { headers } from "next/headers";

import { llmsTxtFor } from "@/src/lib/routes/llms-txt";

/**
 * TS-004 D1/A5 — `/llms.txt`, one of the three machine surfaces, per domain.
 *
 * Request-bound for the same reason `app/robots.ts` is (TS-015 D3): the body
 * depends on the request host, and reading `headers()` is what says so at the
 * call site. Under Cache Components that is the default; `force-dynamic`
 * would be a build error.
 */
export async function GET(): Promise<Response> {
  const requestHeaders = await headers();
  return new Response(llmsTxtFor(requestHeaders.get("host")), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
