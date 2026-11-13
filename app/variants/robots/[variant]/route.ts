import {
  ROBOTS_NOINDEX_VARIANT,
  ROBOTS_VARIANTS,
  robotsVariantHost,
} from "@/src/lib/routes/static-variants";
import { robotsFor, robotsTxt } from "@/src/lib/seo/robots";

/**
 * TS-WEB-0015 D3, surface 2 of 3 — `/robots.txt`, one prerendered file per
 * distinct body (DEC-0164).
 *
 * `proxy.ts` rewrites `/robots.txt` here: onto the `noindex` variant whenever
 * `isIndexable(VERCEL_ENV, host)` is false, onto the variant of the request's
 * own canonical host when it is true. The body is still `robotsFor()` — the
 * one rule — called with the inputs that produce each variant, so the five
 * files are exactly the five answers the per-request route could give.
 *
 * Nothing here reads the request, so every variant is prerendered at build
 * time and served as a static file.
 */
export function generateStaticParams(): { variant: string }[] {
  return ROBOTS_VARIANTS.map((variant) => ({ variant }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/variants/robots/[variant]">,
): Promise<Response> {
  const { variant } = await params;
  const host = robotsVariantHost(variant);
  if (!host && variant !== ROBOTS_NOINDEX_VARIANT) return new Response(null, { status: 404 });
  const robots = host ? robotsFor("production", host) : robotsFor(undefined, undefined);
  return new Response(robotsTxt(robots), {
    headers: { "content-type": "text/plain" },
  });
}
