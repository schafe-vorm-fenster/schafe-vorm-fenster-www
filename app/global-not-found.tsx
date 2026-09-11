import { ContextBand } from "@/src/components/context-band/context-band";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { DEFAULT_LOCALE, HTML_LANG } from "@/src/lib/i18n/locales";
import { href } from "@/src/lib/routes/routes";

import "./styles/brand.css";
import "./styles/base.css";
import "./styles/components.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * 404 — TS-004-A4: real 404 status, `noindex`, mini content, **the place
 * search as the dominant element and the four jobs as the band**.
 *
 * Both modules are built (F-2-31). Until round 3 the body read "Diese Adresse
 * gibt es nicht. [Platzhalter M2 — Ortssuche und Job-Band folgen mit den
 * Komponenten, DEC-032.]" — a developer note with a decision id, rendered as
 * visitor copy — and a dashed box labelled "Platzhalter: place-search +
 * context-band" stood in for both required modules. The 404 is part of the
 * `save-calendar-to-homescreen` walk (`plan/gate-2-scope.md` §2), so it is
 * the founding path's last-chance entry, not a dead end with an apology.
 *
 * `place-search` is a plain GET form to `/dein-ort`, so it works here exactly
 * as it does everywhere else, with no JavaScript and no data dependency —
 * which is what lets this surface stay the static shell DEC-032 asks for.
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

              {/* The dominant element: the same component, the same submit
                  and the same target as on `/` and `/dein-ort` (TS-008 D7 —
                  one place search everywhere it stands). */}
              <section aria-label={d.search.label} data-module="place-search" id="place-search">
                <PlaceSearch
                  id="ort-suche-404"
                  locale={locale}
                  submitDataCta="primary"
                  to="place"
                />
              </section>

              {/* The jobs band. No focus job belongs to a 404, so all four
                  entries render rather than three (TS-006 D5's "minus this
                  page's focus job" has nothing to subtract here). */}
              <section data-module="context-band" id="context-band">
                <ContextBand
                  currentJob="home"
                  heading={d.notFound.jobsHeading}
                  locale={locale}
                />
              </section>

              <p>
                <a href={href("home", locale)}>{d.notFound.backHome}</a>
              </p>
            </article>
          </div>
        </main>
      </body>
    </html>
  );
}
