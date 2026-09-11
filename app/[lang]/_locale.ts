/**
 * The one place a route turns its `[lang]` segment into a language.
 *
 * TS-001 D4: a first segment that is not a language served on this domain is
 * a **404**, not a silent fallback to German. Every page calls this; the
 * layout does not, because a layout that throws cannot render the
 * `not-found.tsx` that lives inside it.
 */

import { notFound } from "next/navigation";

import { isLocale } from "@/src/lib/i18n/locales";
import { pageMetadata } from "@/src/lib/routes/metadata";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";
import type { Metadata } from "next";

export interface LangParams {
  readonly lang: string;
}

export async function localeFrom(
  params: Promise<LangParams>,
): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

/**
 * A page's metadata, and the 404's where the language is not one we serve.
 *
 * `generateMetadata` must not throw `notFound()` — the metadata boundary sits
 * above `[lang]`, so a throw there escapes the shell and Next falls back to
 * its built-in 404. The *page* answers 404 (through `localeFrom` above); this
 * resolves, and for an unknown language it resolves to the 404's own
 * `noindex, follow` (DEC-032, TS-004-A4) rather than to the metadata of a page
 * that will not render.
 *
 * The pairing used to be implicit: `dynamicParams = false` kept an unknown
 * language out of the route tree entirely, and `app/global-not-found.tsx`
 * carried the tag. Cache Components does not allow that config (see the
 * layout), so the rule moves here, where every page already calls it.
 */
export async function pageMetadataFor(
  route: RouteId,
  params: Promise<LangParams>,
): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return { robots: "noindex, follow" };
  return pageMetadata(route, lang);
}
