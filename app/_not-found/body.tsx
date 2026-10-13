import { ContextBand } from "@/src/components/context-band/context-band";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { SkipLink } from "@/src/components/skip-link/skip-link";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { href } from "@/src/lib/routes/routes";

import { HydrationMark } from "./hydration-mark";

import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The 404 document's body — TS-WEB-0004-A4: real 404 status, `noindex`, mini
 * content, **the place search as the dominant element and the four jobs as
 * the band** — for one language.
 *
 * One body, two callers (DEC-0164): the per-language variant every unknown URL
 * is rewritten onto (`app/variants/not-found/[lang]/not-found.tsx`), and
 * `app/global-not-found.tsx`, which is left only the URLs Next's own router
 * misses before the proxy can classify them (an unknown `/api/…` path, say).
 * Both are prerendered; neither reads the request.
 *
 * `place-search` is a plain GET form to `/dein-ort`, so it works here exactly
 * as it does everywhere else, with no JavaScript and no data dependency —
 * which is what lets this surface stay the static shell DEC-0032 asks for.
 */
export function notFoundMetadata(locale: Locale): Metadata {
  const d = dictionary(locale);
  return { title: `${d.notFound.title} — ${d.siteName}`, robots: "noindex, follow" };
}

export function NotFoundBody({ locale }: { readonly locale: Locale }): ReactNode {
  const d = dictionary(locale);
  return (
    <HydrationMark>
      {/* F-3-16 — the one chrome element this surface does take. Routed pages
          put the skip link first (`app/[lang]/layout.tsx`); the 404 has no
          header and no navigation by design, so without it Tab landed straight
          on the postcode input. `#main` exists below. */}
      <SkipLink locale={locale} />
      <main className="site-main" id="main">
        <div className="container">
          <article data-page="not-found">
            <h1>{d.notFound.title}</h1>
            <p>{d.notFound.body}</p>

            {/* The dominant element: the same component, the same submit and
                the same target as on `/` and `/dein-ort` (TS-WEB-0008 D7 —
                one place search everywhere it stands). */}
            <section aria-label={d.search.label} data-module="place-search" id="place-search">
              <PlaceSearch id="ort-suche-404" locale={locale} submitDataCta="primary" to="place" />
            </section>

            {/* The jobs band. No focus job belongs to a 404, so all four
                entries render rather than three (TS-WEB-0006 D5's "minus this
                page's focus job" has nothing to subtract here). */}
            <section data-module="context-band" id="context-band">
              <ContextBand currentJob="home" heading={d.notFound.jobsHeading} locale={locale} />
            </section>

            <p>
              <a href={href("home", locale)}>{d.notFound.backHome}</a>
            </p>
          </article>
        </div>
      </main>
    </HydrationMark>
  );
}
