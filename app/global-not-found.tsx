import { DEFAULT_LOCALE, HTML_LANG } from "@/src/lib/i18n/locales";

import { NotFoundBody, notFoundMetadata } from "./_not-found/body";

import "./styles/brand.css";
import "./styles/base.css";
import "./styles/components.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The framework's own 404 — TS-WEB-0004-A4 — for the URLs no proxy rewrite
 * reaches (DEC-0164).
 *
 * Every URL this site does not serve is rewritten by `proxy.ts` onto the
 * prerendered 404 of its language (`app/variants/not-found/[lang]`), so this
 * file no longer answers the visitor's unknown page. What is left for it is
 * the narrow set the proxy deliberately leaves to Next's router — an unknown
 * path under a reserved prefix (`/api/…`, `/_next/…`, `/.well-known/…`) —
 * and the build's own `/_not-found` entry.
 *
 * It used to read the language from a request header the proxy set, which
 * made it the one HTML surface still rendered per request after DEC-0163. The
 * reserved prefixes carry no language, so it now renders the default language
 * and is prerendered like every other page.
 *
 * **Why `global-not-found` is still enabled.** Next.js 16.3 does not
 * server-render the body of a `notFound()` raised while a postponed route
 * resumes (F-2-70); `global-not-found` renders a complete document for a URL
 * no route matches, without entering the `[lang]` tree.
 */
export const metadata: Metadata = notFoundMetadata(DEFAULT_LOCALE);

export default function GlobalNotFound(): ReactNode {
  return (
    <html lang={HTML_LANG[DEFAULT_LOCALE]}>
      <body>
        <NotFoundBody locale={DEFAULT_LOCALE} />
      </body>
    </html>
  );
}
