import { headers } from "next/headers";

import { ContextBand } from "@/src/components/context-band/context-band";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { SkipLink } from "@/src/components/skip-link/skip-link";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { DEFAULT_LOCALE, HTML_LANG, isLocale } from "@/src/lib/i18n/locales";
import { NOT_FOUND_LOCALE_HEADER } from "@/src/lib/routes/not-found-routing";
import { href } from "@/src/lib/routes/routes";

import "./styles/brand.css";
import "./styles/base.css";
import "./styles/components.css";

import type { Locale } from "@/src/lib/i18n/locales";
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
 * dynamic root segment). With Cache Components the reason is exact: every
 * route resumes from a postponed prerender, and an error thrown during the
 * resume can no longer replace a document that is already being written — so
 * React serialises it into the flight payload and only a browser executing
 * JavaScript ever sees the 404. `global-not-found` is the framework's own
 * answer for this case and renders a complete document.
 *
 * **Every unknown URL now reaches it** — that is the F-2-70 fix. `[lang]`
 * matches *any* first segment, so `/dies-gibt-es-nicht` and `/uk/mitmachen`
 * used to land inside the tree and get the empty shell, while `/en/anything`
 * (which matches no route at all) got this file. `proxy.ts` rewrites the
 * first kind onto `NOT_FOUND_PATH` before the render starts, so both kinds
 * arrive here — see `src/lib/routes/not-found-routing.ts`.
 *
 * **The language comes from the proxy** (row 37). This file sits above
 * `[lang]`, so it has no language parameter and no request path of its own;
 * the proxy still has the URL and puts the resolved language on a request
 * header. It is the server's view of the path, not a client-side swap, so
 * DEC-038 holds, and `generateMetadata` reads the same header, so the
 * `<title>` follows the body's language rather than the TLD default. (That is
 * possible *here* and not in `app/[lang]/**`: those routes are prerendered, and
 * `_locale.ts` records why a metadata function there may not read request
 * data. This one already blocks.)
 */

/**
 * The 404 blocks on purpose (F-2-70).
 *
 * What makes it request-time is the `await headers()` below with no
 * `<Suspense>` above it — the language of this surface is a function of the
 * URL, and only the proxy still has that. `instant = false` does not cause
 * that; it silences the *static-shell validation* that would otherwise fail
 * the build for a route whose prelude is empty (`instant.md`, "Disabling
 * static shell validation"). It may well be redundant — the same document
 * says framework-synthesized `/_not-found` is already excluded from implicit
 * validation — but the default is explicitly allowed to change, and the build
 * refused this route without it.
 *
 * The other way out, a `<Suspense>` boundary, is the one thing this surface
 * may not have: the fallback is what a visitor without JavaScript would be
 * left with, and TS-004 D6 asks for a complete document. Nothing is lost by
 * blocking — the body is static markup once the language is known, and a 404
 * is not a cached surface.
 */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const d = dictionary(await requestedLocale());
  return { title: `${d.notFound.title} — ${d.siteName}`, robots: "noindex, follow" };
}

/** The language `proxy.ts` resolved from the URL this 404 answers. */
async function requestedLocale(): Promise<Locale> {
  const requested = (await headers()).get(NOT_FOUND_LOCALE_HEADER);
  return isLocale(requested) ? requested : DEFAULT_LOCALE;
}

export default async function GlobalNotFound(): Promise<ReactNode> {
  const locale = await requestedLocale();
  const d = dictionary(locale);

  return (
    <html lang={HTML_LANG[locale]}>
      <body>
        {/* F-3-16 — the one chrome element this surface does take.
            `app/[lang]/layout.tsx` puts the skip link first on every routed
            page, and this file bypasses that layout on purpose (see the note
            above), so pressing Tab here landed straight on the postcode
            input: seven tab stops against 26–32, and the one a11y affordance
            the site is otherwise consistent about was missing.

            The link, not the chrome. `SiteChrome` is deliberately not pulled
            in — this surface has no header and no navigation by design, and
            the bypass is the reason the 404 renders as a complete document at
            all. `#main` already exists below, so the target needed nothing. */}
        <SkipLink locale={locale} />
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
