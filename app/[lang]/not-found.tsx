import { lang } from "next/root-params";

import { ContextBand } from "@/src/components/context-band/context-band";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { resolveLocale } from "@/src/lib/i18n/locales";
import { href } from "@/src/lib/routes/routes";

import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * 404 — DEC-032, TS-004 D6: real 404 status, `noindex` (Next.js emits it for
 * a 404 response), a static shell.
 *
 * `not-found.tsx` takes no props, so the language comes from the root
 * parameter (`next/root-params`, Next 16.3) — which is exactly why `[lang]`
 * sits above the root layout.
 *
 * The place search and the jobs band TS-004-A4 requires are built here as
 * well as in `app/global-not-found.tsx` (F-2-31), so the two 404 surfaces
 * carry the same offer and the localized one is ready the moment the
 * framework renders it.
 *
 * **Not the surface an unknown URL reaches.** Those are answered by
 * `app/global-not-found.tsx`, because Next.js 16.3 does not server-render the
 * body of a `notFound()` raised inside the route tree — the status and the
 * metadata are right, the document is empty. This file is the localized 404
 * for the `notFound()` calls the page work packages will make (an unknown
 * place parameter, a withdrawn offering), and it is where the localized 404
 * lands the moment the framework renders it. Recorded in `state/open.md`.
 */

export const metadata: Metadata = {
  robots: "noindex, follow",
};

export default async function NotFound(): Promise<ReactNode> {
  const locale = resolveLocale(await lang());
  const d = dictionary(locale);
  return (
    <article data-page="not-found">
      <h1>{d.notFound.title}</h1>
      <p>{d.notFound.body}</p>

      <section aria-label={d.search.label} data-module="place-search" id="place-search">
        <PlaceSearch id="ort-suche-404" locale={locale} submitDataCta="primary" to="place" />
      </section>

      <section data-module="context-band" id="context-band">
        <ContextBand currentJob="home" heading={d.notFound.jobsHeading} locale={locale} />
      </section>

      <p>
        <a href={href("home", locale)}>{d.notFound.backHome}</a>
      </p>
    </article>
  );
}
