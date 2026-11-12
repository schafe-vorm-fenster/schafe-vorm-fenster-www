import { dictionary } from "@/src/lib/i18n/dictionary";
import { DEFAULT_LOCALE } from "@/src/lib/i18n/locales";
import { appIconPath } from "@/src/lib/seo/app-icons";
import { imageColors } from "@/src/lib/seo/brand-assets";

import type { MetadataRoute } from "next";

/**
 * `/manifest.webmanifest` — the web app manifest, so the site can be put on
 * a home screen with its name and the brand mark (the conversion the whole
 * site works toward is "save the calendar to the homescreen").
 *
 * One manifest for the site, in the default language: a manifest has no
 * language negotiation. Name, colours and icons come from the dictionary and
 * the brand package; nothing is invented here.
 */
export default function manifest(): MetadataRoute.Manifest {
  const name = dictionary(DEFAULT_LOCALE).siteName;
  return {
    name,
    short_name: name,
    start_url: "/",
    display: "standalone",
    background_color: imageColors.ground,
    theme_color: imageColors.accent,
    icons: [
      { src: appIconPath(192), sizes: "192x192", type: "image/png" },
      { src: appIconPath(512), sizes: "512x512", type: "image/png" },
    ],
  };
}
