import { ImageResponse } from "next/og";

import { isLocale, LOCALES } from "@/src/lib/i18n/locales";
import { pageTitle } from "@/src/lib/routes/metadata";
import { isRouteId, ROUTE_IDS } from "@/src/lib/routes/routes";
import { brandFonts, imageColors, logoDataUri } from "@/src/lib/seo/brand-assets";
import { SHARE_IMAGE_SIZE } from "@/src/lib/seo/share-image";
import { dictionary } from "@/src/lib/i18n/dictionary";

/**
 * `/api/og/<lang>/<route>` — the share image of one page in one language
 * (TS-WEB-0011 D6, FUN-WEB-0078, TS-WEB-0011-A9).
 *
 * 1200 x 630 PNG, drawn at build time: the page's own `seo.title` set large
 * beside the brand mark, on the brand's paper ground with the lime accent.
 * The text is localized with the page (DEC-0026). Every colour and the
 * typeface come from the brand package (`src/lib/seo/brand-assets.ts`); no
 * hex value and no font file is committed here (TS-WEB-0017-A6).
 *
 * `generateStaticParams` enumerates the 24 (language, route) pairs, so the
 * route is prerendered and never runs per request.
 */
export function generateStaticParams(): { lang: string; route: string }[] {
  return LOCALES.flatMap((lang) => ROUTE_IDS.map((route) => ({ lang, route })));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/og/[lang]/[route]">,
): Promise<Response> {
  const { lang, route } = await params;
  if (!isLocale(lang) || !isRouteId(route)) return new Response(null, { status: 404 });

  const title = pageTitle(route, lang);
  const brand = dictionary(lang).siteName;
  const [logo, fonts] = await Promise.all([logoDataUri(), brandFonts()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: imageColors.ground,
          borderLeft: `24px solid ${imageColors.accent}`,
          padding: "64px 72px 64px 64px",
          color: imageColors.ink,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders to a bitmap; next/image does not apply */}
          <img src={logo} width={96} height={96} alt="" style={{ borderRadius: 999 }} />
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>{brand}</div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 36 ? 72 : 88,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: imageColors.secondary,
            borderTop: `4px solid ${imageColors.line}`,
            paddingTop: 24,
          }}
        >
          schafe-vorm-fenster.de
        </div>
      </div>
    ),
    { ...SHARE_IMAGE_SIZE, fonts },
  );
}
