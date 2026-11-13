
import { newsletterOffered } from "@/src/components/newsletter-block/constant";
import { NewsletterBlock } from "@/src/components/newsletter-block/newsletter-block";
import { SkipLink } from "@/src/components/skip-link/skip-link";
import { EtrackerAnalytics } from "@/src/lib/analytics/etracker-analytics";
import { dictionary } from "@/src/lib/i18n/dictionary";
import {
  HTML_LANG,
  LOCALES,
  OG_LOCALE,
  resolveLocale,
} from "@/src/lib/i18n/locales";
import { QuerySync } from "@/src/lib/pages/query-store";
import { SITE_ORIGIN } from "@/src/lib/routes/routes";
import { appIconPath } from "@/src/lib/seo/app-icons";
import { NOINDEX } from "@/src/lib/seo/indexable";

import { heroPhotoByRoute } from "./_chrome-data";
import { footerCopyright } from "./_footer-data";
import { SiteChrome } from "./_chrome";

import { FontPreloads } from "../styles/font-preload";

import { DocumentCommitMarker } from "@/src/components/photo-surface/hero-preload";

import "../styles/brand.css";
import "../styles/base.css";
// Issues 235, 240: page-only stylesheets ride in the shell's chunk (see file).
import "./_shared-styles";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

/**
 * The root layout — TS-WEB-0004 D2. `[lang]` sits **above** it, which is what
 * makes the language a root parameter: `<html lang>` is set here once, and
 * every server component below can read the language without prop drilling
 * (`next/root-params`).
 *
 * The public URL never shows `/de`: the bare path is rewritten onto this
 * tree (TS-WEB-0004 D3, `next.config.ts`). The rendered language is a pure
 * function of the URL — no cookie, no `Accept-Language` (TS-WEB-0001 D3,
 * DEC-0038), which is what keeps every page statically cacheable.
 */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // No maximum-scale, no user-scalable=no: pinch zoom stays available.
};

/**
 * TS-WEB-0001 D4 / TS-WEB-0004 D2 — the language set that ships, and nothing else.
 *
 * D2 paired this with `dynamicParams = false`, which Cache Components refuses
 * ("Route segment config \"dynamicParams\" is not compatible with
 * `nextConfig.cacheComponents`"). The 404 it bought is unchanged, because it
 * was never the only guard: every page resolves its language through
 * `localeFrom()` (`_locale.ts`), which calls `notFound()` on a segment that is
 * not a language served here. A non-language first segment therefore still
 * answers 404 — now from the page rather than from the router, which is also
 * the surface DEC-0032 wants rendering the body.
 */
export function generateStaticParams(): { lang: string }[] {
  return LOCALES.map((lang) => ({ lang }));
}

/**
 * TS-WEB-0015 D3, surface 3 of 3 — the page metadata half of the noindex regime.
 *
 * The predicate has two halves: `VERCEL_ENV === "production"` **and** a
 * canonical host. Only the first half is evaluated here. Reading the request
 * host would turn the prerendered shell into a per-request function
 * invocation — the failure mode DEC-0041 §8 forbids and DEC-0045 protects the
 * shell from. The host half is carried by the `X-Robots-Tag` header the proxy
 * sets on every response, where it costs nothing. The divergence from
 * TS-WEB-0015-A1's wording is recorded in state/open.md.
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
      template: `%s · ${d.siteName}`,
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
     * Not `app/icon.svg`: TS-WEB-0017-A6 forbids committing a logo, mark or font
     * file in this repository, and `pnpm check:brand` enforces it. The mark is
     * read from the brand package at build time and served by
     * `app/api/icon/svg` (SVG) and `app/api/icon/<size>` (PNG), both the
     * package's round file.
     *
     * **Shape: a full circle** (Q-0095, FUN-WEB-0209). A browser tab applies no
     * CSS, so the favicon file itself is round, transparent corners: the brand
     * package's `./logo-round.svg` and `./logo-round.png`.
     */
    icons: {
      icon: [
        // The round mark (Q-0095): the package's round SVG, served by
        // `app/api/icon/svg`.
        { url: "/api/icon/svg", type: "image/svg+xml" },
        // Raster fallbacks for the agents that do not take an SVG icon.
        { url: appIconPath(32), sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: appIconPath(180), sizes: "180x180", type: "image/png" }],
    },
    // `app/manifest.ts` → `/manifest.webmanifest`; Next adds the <link> itself.
    ...(INDEXABLE_BUILD ? {} : { robots: NOINDEX }),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ lang: string }> }>) {
  // The layout renders even for an unsupported code, so that the page below
  // it can answer 404 *inside* this shell (TS-WEB-0004 D3.4). It resolves rather
  // than throws; the 404 body is then the TLD default's.
  const locale = resolveLocale((await params).lang);
  const heroPhoto = await heroPhotoByRoute(locale);
  const copyright = await footerCopyright();

  /**
   * The footer's newsletter slot — withheld while no sending system accepts a
   * subscription (TS-WEB-0016-A21, DEC-0122 §3). The gate is the mount site,
   * not the block: `NewsletterBlock` keeps its full shape, so it returns here
   * with the benefit heading DEC-0120 put in the dictionary the moment
   * `NEWSLETTER_SENDING_SYSTEM` names one. Removed, never softened — the
   * construction `response-promise/constant.ts` uses.
   */
  const newsletter = newsletterOffered() ? (
    <NewsletterBlock compact locale={locale} />
  ) : undefined;

  return (
    <html lang={HTML_LANG[locale]}>
      <body>
        {/* TS-WEB-0003 D3: the faces start loading with the stylesheets
            (issue 214). React hoists the links into `<head>`. */}
        <FontPreloads />
        {/* The first focusable element of the document; it jumps to `#main`,
            which `_chrome.tsx` renders (TS-WEB-0002 D5). */}
        <SkipLink locale={locale} />
        {/* DEC-0163: the one place the query string is read. It renders
            nothing; the islands that depend on `?ort=` or a flow step read
            it from `query-store.tsx` after hydration. */}
        <QuerySync />
        {/* DEC-0218: page views on every route, client navigation included,
            the eTracker loader when NEXT_PUBLIC_ETRACKER_SECURE_CODE is set,
            and the one CTA click listener. Renders nothing visible. */}
        <EtrackerAnalytics locale={locale} />
        {/* The rest of the chrome — header, breadcrumb trail, the `main`
            landmark, footer — is **one per document**, and that is why it
            hangs here rather than off each page (state/open.md rows 97 and
            204). With Cache Components on, the router keeps the last three
            route segments mounted in hidden `<Activity>` boundaries, so
            chrome rendered by a page is still in the document after the
            visitor has clicked away from it: two `main` landmarks, two
            `id="main"`. The layout is the one level above those boundaries.
            It still cannot be told which route renders below it — a layout
            gets `children` and its own `params`, and reading the route from a
            request header would make the prerendered shell a per-request
            function (DEC-0045, TS-WEB-0010 D8) — so `_chrome.tsx` reads it off the
            router tree instead, which costs nothing at prerender and is what
            the client updates on a navigation.

            Blocks 3 and 4 of TS-WEB-0006 D2 stay with the page: they are content
            inside `main`, built from the page's own `page.meta.ts`
            (`_page-frame.tsx`). */}
        <SiteChrome
          copyright={copyright}
          heroPhoto={heroPhoto}
          locale={locale}
          newsletter={newsletter}
        >
          {children}
        </SiteChrome>
        <DocumentCommitMarker />
      </body>
    </html>
  );
}
