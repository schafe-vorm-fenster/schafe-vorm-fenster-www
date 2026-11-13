import { roundLogoSvg } from "@/src/lib/seo/brand-assets";

/**
 * `/api/icon/svg` — the brand package's round SVG, the primary
 * `rel="icon"` (Q-0095, FUN-WEB-0209). Read from the brand package like the PNG sizes; see `roundLogoSvg`.
 */
export async function GET(): Promise<Response> {
  return new Response(await roundLogoSvg(), {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
