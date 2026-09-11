/**
 * The content pipeline, on the cache side of TS-009 D1.
 *
 * `loadPage()` reads `content/pages/<route>/<locale>.md` off disk. That is an
 * IO access, and under Cache Components an uncached IO access in a page body
 * is what keeps a route out of the static shell — the
 * [`blocking-prerender-dynamic`](https://nextjs.org/docs/messages/blocking-prerender-dynamic)
 * insight `next build --debug-prerender` reports on every page that calls it
 * directly.
 *
 * Page content is exactly the "shell" row of D1's table (copy, headings,
 * CTAs), so the answer is the [cache] one, not the [stream] one: the read is
 * wrapped once, here, at `cacheLife("max")` — the artifacts change when the
 * repository is rebuilt and never in between.
 *
 * Pages import this instead of `loadPage`. The one-line wrapper rather than a
 * `"use cache"` inside `src/lib/content/loader.ts` itself is deliberate: the
 * loader is also called from unit tests and from `scripts/check-content.ts`,
 * neither of which runs inside a Next.js cache scope.
 */

import { cacheLife, cacheTag } from "next/cache";

import { loadLegalDocument } from "@/src/lib/content/legal-loader";
import { loadPage } from "@/src/lib/content/loader";

import type { LegalDocument } from "@/src/lib/content/legal-loader";
import type { PageContent } from "@/src/lib/content/types";
import type { LegalSectionId } from "@/src/lib/routes/legal-anchors";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

export async function pageContent(
  routeId: RouteId,
  locale: Locale,
): Promise<PageContent> {
  "use cache";
  cacheLife("max");
  cacheTag(`content:${routeId}:${locale}`);
  return loadPage(routeId, locale);
}

/**
 * The same, for the imported legal documents `/rechtliches` renders
 * (TS-029 D2). Same reasoning: a build-time file read, cached at `max`, so
 * the one legal page keeps its static shell.
 */
export async function legalDocument(
  section: LegalSectionId,
): Promise<LegalDocument | null> {
  "use cache";
  cacheLife("max");
  cacheTag(`legal:${section}`);
  return loadLegalDocument(section);
}
