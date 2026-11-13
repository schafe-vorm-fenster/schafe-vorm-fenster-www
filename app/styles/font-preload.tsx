import mono700 from "@fontsource/atkinson-hyperlegible-mono/files/atkinson-hyperlegible-mono-latin-700-normal.woff2" with { turbopackModuleType: "asset" };
import sans400 from "@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-400-normal.woff2" with { turbopackModuleType: "asset" };
import sans700 from "@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-700-normal.woff2" with { turbopackModuleType: "asset" };
import sans800 from "@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-800-normal.woff2" with { turbopackModuleType: "asset" };

/**
 * TS-WEB-0003 D3 "preloaded" — issue 214.
 *
 * Four of the six faces `brand.css` declares, announced from the document
 * head so the browser asks for them together with the stylesheets instead of
 * after the first style pass. Measured on the production build (2026-11-13,
 * 390/412/1280 px, the seven top-level pages plus `/dein-kalender/bestellen`
 * and `/rechtliches`), these four are the faces that paint text inside the
 * first viewport and are used on every page:
 *
 * - Next 800 (headlines) and Mono 700 (kickers, header labels) — above the
 *   fold on every page at every width;
 * - Next 400 (lead, body) and Next 700 (buttons, emphasis) — above the fold
 *   on most pages, and on every page somewhere.
 *
 * Mono 400 reaches the first viewport only on `/dein-kalender/bestellen` and
 * `/dein-ort` at desktop width, Mono 800 only on `/ueber-uns`, and Mono 800 is
 * not used at all on `/dein-ort`, `/dein-kalender` and `/deine-region`.
 * Preloading them would add bytes where they are not painted; they keep
 * loading the way they always did, from the `@font-face` rule.
 *
 * Same package files and the same emitted URLs as the `url()`s in `brand.css`
 * (Turbopack names an asset by its content), so preload and `@font-face` meet
 * in one request; a mismatch would download a face twice, which
 * `e2e/fonts.spec.ts` guards. Rendered as `<link>` elements, which React
 * hoists into `<head>`: `preload()` from `react-dom` reached only the RSC
 * payload of a prerendered page, never the HTML head (measured).
 *
 * `crossOrigin` is required for a font preload even on the same origin —
 * font requests are CORS requests, and a preload without it is not reused.
 */
export const PRELOADED_FONT_FILES: readonly string[] = [sans800, mono700, sans400, sans700];

export function FontPreloads() {
  return (
    <>
      {PRELOADED_FONT_FILES.map((href) => (
        <link as="font" crossOrigin="anonymous" href={href} key={href} rel="preload" type="font/woff2" />
      ))}
    </>
  );
}
