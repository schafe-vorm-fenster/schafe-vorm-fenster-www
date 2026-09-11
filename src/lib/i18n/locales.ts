/**
 * The language table — TS-001 D1/D3/D4, DEC-006, DEC-053.
 *
 * This module is the *single place a language is declared* (TS-001-A11).
 * Adding a language is a row here plus a dictionary file — never a code
 * change at a call site (TS-001 D7).
 *
 * Phase 1 ships `.de` only: German bare, English under `/en/…`. The other
 * domains of TS-001 D1 are landing-only and are not routed by this skeleton;
 * the domain matrix lands with the full detection algorithm in M4.
 */

/** Every language the website can serve. Ordered: default first. */
export const LOCALES = ["de", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * The TLD default of `www.schafe-vorm-fenster.de` (TS-001 D1). The default
 * language is always served **bare**, without a path prefix (TS-001 D4).
 */
export const DEFAULT_LOCALE: Locale = "de";

/** The languages that are not the default — the ones that carry a prefix. */
export const PREFIXED_LOCALES: readonly Locale[] = LOCALES.filter(
  (locale) => locale !== DEFAULT_LOCALE,
);

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Maps an unvalidated first path segment onto a served language.
 *
 * Used only where a *rendering* decision needs a language even though the
 * request carried an unsupported one — the 404 body, for instance. A route
 * that can answer 404 calls `isLocale` and `notFound()` instead: TS-001 D4
 * says an unsupported code is a 404, not a silent fallback.
 */
export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** The `<html lang>` value per language (TS-001 D3). */
export const HTML_LANG: Record<Locale, string> = {
  de: "de",
  en: "en",
};

/** `og:locale` per language — language plus region (TS-011 D6). */
export const OG_LOCALE: Record<Locale, string> = {
  de: "de_DE",
  en: "en_GB",
};

/** The `hreflang` value per language; `x-default` points at the TLD default. */
export const HREFLANG: Record<Locale, string> = {
  de: "de",
  en: "en",
};
