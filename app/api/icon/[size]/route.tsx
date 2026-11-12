import { ImageResponse } from "next/og";

import { logoDataUri } from "@/src/lib/seo/brand-assets";
import { APP_ICON_SIZES } from "@/src/lib/seo/app-icons";

/**
 * `/api/icon/<size>` — the brand mark as a square PNG in the sizes browsers,
 * iOS and the web app manifest ask for (32, 180, 192, 512).
 *
 * The mark is the brand package's own logo, scaled and not redrawn. It is
 * read from the package at build time (`brand-assets.ts`), which is why this
 * is a route and not a committed `icon.png`: TS-WEB-0017-A6 keeps logo files
 * out of the repository. The sizes are enumerated, so the route is prerendered.
 */
export function generateStaticParams(): { size: string }[] {
  return APP_ICON_SIZES.map((size) => ({ size: String(size) }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/icon/[size]">,
): Promise<Response> {
  const size = Number((await params).size);
  if (!APP_ICON_SIZES.includes(size as (typeof APP_ICON_SIZES)[number])) {
    return new Response(null, { status: 404 });
  }
  const logo = await logoDataUri();
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders to a bitmap
      <img src={logo} width={size} height={size} alt="" />
    ),
    { width: size, height: size },
  );
}
