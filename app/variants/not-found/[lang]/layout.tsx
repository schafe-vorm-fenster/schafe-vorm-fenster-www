import { SiteChrome } from "@/app/[lang]/_chrome";
import { footerCopyright } from "@/app/[lang]/_footer-data";
import { newsletterOffered } from "@/src/components/newsletter-block/constant";
import { NewsletterBlock } from "@/src/components/newsletter-block/newsletter-block";
import { SkipLink } from "@/src/components/skip-link/skip-link";
import { EtrackerAnalytics } from "@/src/lib/analytics/etracker-analytics";
import { HTML_LANG, resolveLocale } from "@/src/lib/i18n/locales";
import { NOT_FOUND_VARIANTS } from "@/src/lib/routes/static-variants";

import { notFoundMetadata } from "../../../_not-found/body";

import "../../../styles/brand.css";
import "../../../styles/base.css";
import "../../../styles/components.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The root layout of the per-language 404 documents — TS-WEB-0004-A4,
 * DEC-0164.
 *
 * `proxy.ts` rewrites every URL this site does not serve onto
 * `/variants/not-found/<lang>`, the language read off the URL it was asked
 * (TS-WEB-0001 D1/D4). This tree is its own root layout, not a child of
 * `app/[lang]`: it renders the same `SiteChrome` as the routed pages (issue 217),
 * because the `[lang]` tree would match an unknown first segment and render
 * the 404 body there empty (F-2-70).
 *
 * Every language is prerendered (`generateStaticParams`); nothing here reads
 * the request. The 404 *status* is set by the build adapter — see
 * `page.tsx` for why it is not `notFound()`.
 */
export function generateStaticParams(): { lang: string }[] {
  return NOT_FOUND_VARIANTS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return notFoundMetadata(resolveLocale((await params).lang));
}

export default async function NotFoundRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}): Promise<ReactNode> {
  const locale = resolveLocale((await params).lang);
  const copyright = await footerCopyright();
  const newsletter = newsletterOffered() ? (
    <NewsletterBlock compact locale={locale} />
  ) : undefined;
  return (
    <html lang={HTML_LANG[locale]}>
      <body>
        {/* DEC-0218: a 404 is a page view too, counted as `<lang>/not-found`. */}
        <EtrackerAnalytics locale={locale} notFound />
        {/* Issue 217: the 404 carries the site chrome — header, footer, the
            language switch — so a visitor has a way back that is not the
            browser's. Same composition as `app/[lang]/layout.tsx`; the
            header sits on a plain surface (`heroPhoto` empty), the route
            falls back to home. */}
        <SkipLink locale={locale} />
        <SiteChrome copyright={copyright} heroPhoto={{}} locale={locale} newsletter={newsletter}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
