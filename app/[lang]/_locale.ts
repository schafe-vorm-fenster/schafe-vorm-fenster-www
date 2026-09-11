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

import type { Locale } from "@/src/lib/i18n/locales";

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
