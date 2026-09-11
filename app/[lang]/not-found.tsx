import { lang } from "next/root-params";

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
 * The place search and the jobs band that DEC-032 makes the dominant elements
 * arrive with the component set; the reserved slot is below.
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
    <article data-placeholder="page" data-page="not-found">
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
  );
}
