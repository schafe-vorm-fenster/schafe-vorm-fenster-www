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
 * `dynamicParams = false` is D2's own pairing: a first segment that is not a
 * language served on this domain matches no route at all and answers 404
 * through `app/global-not-found.tsx` — the one 404 surface Next.js 16.3
 * actually server-renders (see the note there).
 */
export const dynamicParams = false;

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
