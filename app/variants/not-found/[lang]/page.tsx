import { resolveLocale } from "@/src/lib/i18n/locales";

import { NotFoundBody } from "../../../_not-found/body";

import type { ReactNode } from "react";

/**
 * The 404 document of one language (TS-WEB-0004-A4, DEC-0164), prerendered at
 * build time like every other page.
 *
 * **Why it renders the body and does not call `notFound()`.** That was the
 * first thing measured: a `notFound()` raised while this page prerenders is
 * stored with status 404, but the HTML is Next's `<html id="__next_error__">`
 * shell — the not-found boundary is a client error boundary, React's server
 * renderer does not run error boundaries, so the shell errors and Next writes
 * the error document and leaves the body to the browser (`getErrorRSCPayload`
 * in `next/dist/server/app-render/app-render.js`). With JavaScript off that is
 * an empty page — F-2-70 again, at build time.
 *
 * So the page renders the complete document, and the **status** is set where
 * the build hands its outputs to the platform: `scripts/csp-adapter.mjs` marks
 * every prerender under `/variants/not-found/` with status 404, in the
 * prerender's `.meta` (what `next start` serves from) and in the adapter
 * output's `fallback.initialStatus` (what the Vercel adapter deploys). The
 * build fails if there is no such prerender to mark.
 */
export default async function NotFoundVariant({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<ReactNode> {
  return <NotFoundBody locale={resolveLocale((await params).lang)} />;
}
