import { dictionary } from "@/src/lib/i18n/dictionary";
import { DEFAULT_LOCALE, HTML_LANG } from "@/src/lib/i18n/locales";
import { href } from "@/src/lib/routes/routes";

import "./styles/brand.css";
import "./styles/base.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * 404 — DEC-032, TS-004 D6/A4: real 404 status, `noindex`, mini content, the
 * place search as the dominant element and the four jobs as the context band.
 *
 * **Why this file and not `app/[lang]/not-found.tsx`.** Next.js 16.3 does not
 * server-render the body of a `notFound()` raised inside the route tree: the
 * response carries the right status and the right metadata, but the HTML
 * document is an empty `__next_error__` shell, and the browser leaves it
 * empty too (measured, both `next dev` and `next start`, with and without a
 * dynamic root segment). `global-not-found` is the framework's own answer for
 * this case and renders a complete document. Every unknown URL reaches it,
 * because `[lang]` runs with `dynamicParams = false` and the inventory holds
 * no catch-all.
 *
 * **The cost, recorded in `state/open.md`.** This file sits above `[lang]`,
 * so it has no language parameter and no request path: an unknown `/en/…` URL
 * gets the 404 of the TLD default (TS-001 D1), not an English one. A
 * client-side swap would make the language depend on something other than the
 * server's view of the path, which DEC-038 rules out. The localized page in
 * `app/[lang]/not-found.tsx` stays for the `notFound()` calls the page work
 * packages will make.
 */

export const metadata: Metadata = {
  title: `${dictionary(DEFAULT_LOCALE).notFound.title} — ${dictionary(DEFAULT_LOCALE).siteName}`,
  robots: "noindex, follow",
};

export default function GlobalNotFound(): ReactNode {
  const locale = DEFAULT_LOCALE;
  const d = dictionary(locale);

  return (
    <html lang={HTML_LANG[locale]}>
      <body>
        <main className="site-main" id="main">
          <div className="container">
            <article data-page="not-found">
              <h1>{d.notFound.title}</h1>
              <p>{d.notFound.body}</p>
              <p>
                <a href={href("home", locale)}>{d.notFound.backHome}</a>
              </p>
              <section
                aria-labelledby="placeholder-404-search"
                data-module="place-search"
                data-placeholder="module"
                style={{
                  minBlockSize: "12rem",
                  border: "1px dashed currentColor",
                  borderRadius: "0.5rem",
                  opacity: 0.7,
                  padding: "1rem",
                }}
              >
                <h2 id="placeholder-404-search" style={{ fontSize: "1rem" }}>
                  {d.placeholder.section}: place-search + context-band
                </h2>
                <p>{d.placeholder.reserved}</p>
              </section>
            </article>
          </div>
        </main>
      </body>
    </html>
  );
}
