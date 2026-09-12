import sheepMark from "@schafe-vorm-fenster/brand-design/logo.svg";

import { SkipLink } from "@/src/components/skip-link/skip-link";
import { dictionary } from "@/src/lib/i18n/dictionary";
import {
  HTML_LANG,
  LOCALES,
  OG_LOCALE,
  resolveLocale,
} from "@/src/lib/i18n/locales";
import { SITE_ORIGIN } from "@/src/lib/routes/routes";
import { NOINDEX } from "@/src/lib/seo/indexable";

import "../styles/brand.css";
import "../styles/base.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

/**
 * The root layout — TS-004 D2. `[lang]` sits **above** it, which is what
 * makes the language a root parameter: `<html lang>` is set here once, and
 * every server component below can read the language without prop drilling
 * (`next/root-params`).
 *
 * The public URL never shows `/de`: the bare path is rewritten onto this
 * tree (TS-004 D3, `next.config.ts`). The rendered language is a pure
 * function of the URL — no cookie, no `Accept-Language` (TS-001 D3,
 * DEC-038), which is what keeps every page statically cacheable.
 */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // No maximum-scale, no user-scalable=no: pinch zoom stays available.
};

/**
 * TS-001 D4 / TS-004 D2 — the language set that ships, and nothing else.
 *
 * D2 paired this with `dynamicParams = false`, which Cache Components refuses
 * ("Route segment config \"dynamicParams\" is not compatible with
 * `nextConfig.cacheComponents`"). The 404 it bought is unchanged, because it
 * was never the only guard: every page resolves its language through
 * `localeFrom()` (`_locale.ts`), which calls `notFound()` on a segment that is
 * not a language served here. A non-language first segment therefore still
 * answers 404 — now from the page rather than from the router, which is also
 * the surface DEC-032 wants rendering the body.
 */
export function generateStaticParams(): { lang: string }[] {
  return LOCALES.map((lang) => ({ lang }));
}

/**
 * TS-015 D3, surface 3 of 3 — the page metadata half of the noindex regime.
 *
 * The predicate has two halves: `VERCEL_ENV === "production"` **and** a
 * canonical host. Only the first half is evaluated here. Reading the request
 * host would turn the prerendered shell into a per-request function
 * invocation — the failure mode DEC-041 §8 forbids and DEC-045 protects the
 * shell from. The host half is carried by the `X-Robots-Tag` header the proxy
 * sets on every response, where it costs nothing. The divergence from
 * TS-015-A1's wording is recorded in state/open.md.
 */
const INDEXABLE_BUILD = process.env.VERCEL_ENV === "production";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const d = dictionary(locale);
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: {
      default: d.siteName,
      template: `%s — ${d.siteName}`,
    },
    openGraph: { siteName: d.siteName, locale: OG_LOCALE[locale] },
    /**
     * F-3-13 — the site's icon, and the real brand mark rather than nothing.
     *
     * The tree shipped no `public/favicon.ico` and no `app/icon.*` at all, so
     * every browser's automatic `GET /favicon.ico` on every page load went
     * down the 404 path. It now finds a `<link rel="icon">` in the head
     * instead and never asks.
     *
     * Not `app/icon.svg`: TS-017-A6 forbids committing a logo, mark or font
     * file in this repository, and `pnpm check:brand` enforces it — every
     * logo reference is a brand-package subpath import, which is exactly what
     * `sheepMark` is (the same import `src/components/logo/logo.tsx` uses).
     * Not `app/icon.tsx` either: the generated-icon convention is a Route
     * Handler that has to hand over bytes, and reading them back out of the
     * package defeats both bundlers — Turbopack rewrites a `require.resolve`
     * of an `.svg` into an asset reference and the read fails at runtime
     * (measured). The static import is the bundler-native form: Next emits
     * the file under `/_next/static/` and stamps its hash into the URL.
     *
     * It is the brand owner's own logo — neither mocked nor generated — so
     * neither the mock rule nor the dummy-content rule applies and it carries
     * no badge.
     */
    icons: {
      icon: [
        {
          // Next 16 resolves an `.svg` import to the emitted **URL string**,
          // not to a `StaticImageData` (measured: the value is
          // "/_next/static/media/Schafe-vorm-Fenster_Logo_V2.1.<hash>.svg").
          // The ambient module declaration still types it as the object, and
          // reading `.src` off it yields `undefined`, which throws inside
          // Next's own metadata resolution and silently drops the entire
          // `<head>` block.
          url: sheepMark as unknown as string,
          type: "image/svg+xml",
        },
      ],
    },
    ...(INDEXABLE_BUILD ? {} : { robots: NOINDEX }),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ lang: string }> }>) {
  // The layout renders even for an unsupported code, so that the page below
  // it can answer 404 *inside* this shell (TS-004 D3.4). It resolves rather
  // than throws; the 404 body is then the TLD default's.
  const locale = resolveLocale((await params).lang);

  return (
    <html lang={HTML_LANG[locale]}>
      <body>
        {/* The first focusable element of the document; it jumps to `#main`,
            which `site-chrome` renders (TS-002 D5). */}
        <SkipLink locale={locale} />
        {/* The rest of the chrome — header, breadcrumb trail, the `main`
            landmark, footer — plus blocks 3 and 4 of TS-006 D2 lives in
            `_page-frame.tsx`, one component for all eleven pages. A layout
            receives only `children` and its own `params`, so it cannot know
            which route renders below it, and every one of those pieces needs
            the route id: the language switch links the equivalent page
            (TS-001-A7), the header marks the current job, and the context
            band and closing CTA are built from the page's `page.meta.ts`
            (TS-006 D5/D6). Reading the route from a request header instead
            would make the prerendered shell a per-request function — what
            DEC-045 and TS-010 D8 forbid. See `_page-frame.tsx`. */}
        {children}
      </body>
    </html>
  );
}
