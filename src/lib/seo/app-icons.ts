/**
 * The raster sizes of the brand mark the site serves (`/api/icon/<size>`):
 * 32 for the tab, 180 for the iOS home screen, 192 and 512 for the web app
 * manifest. The SVG mark stays the primary `rel="icon"` (`app/[lang]/layout.tsx`).
 */
export const APP_ICON_SIZES = [32, 180, 192, 512] as const;

export function appIconPath(size: (typeof APP_ICON_SIZES)[number]): string {
  return `/api/icon/${size}`;
}
