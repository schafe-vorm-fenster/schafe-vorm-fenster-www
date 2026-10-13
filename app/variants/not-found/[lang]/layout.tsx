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
 * `app/[lang]`: the 404 has no header and no navigation by design, exactly as
 * `global-not-found` had none, and a separate root layout is how it keeps
 * them out.
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
  return (
    <html lang={HTML_LANG[locale]}>
      <body>{children}</body>
    </html>
  );
}
