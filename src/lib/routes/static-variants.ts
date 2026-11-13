/**
 * The build-time variants of the three host- or language-dependent surfaces —
 * `/robots.txt` (TS-WEB-0015 D3), `/llms.txt` (TS-WEB-0004 D1/A5) and the 404
 * (TS-WEB-0004-A4) — and the one function `proxy.ts` uses to pick one
 * (DEC-0164).
 *
 * ### Why variants
 *
 * Each of the three used to read a request header — `host` for the two text
 * surfaces, the proxy's language header for the 404 — which made it the only
 * thing on the site still rendered per request after DEC-0163. But none of
 * them has more outputs than this repository can count: robots.txt has one
 * "disallow all" body plus one body per canonical host (the `Sitemap:` line
 * names the host), llms.txt has one body per domain of the matrix, and the 404
 * has one document per language. So every output is rendered **once, at build
 * time, at its own path**, and the proxy — which has the host and the URL
 * anyway — only chooses which file answers. It renders nothing.
 *
 * Distinct paths are also what keeps the CDN honest: the cache key of a
 * variant is its path, so no host can be answered from another host's cached
 * robots.txt, whatever the CDN does or does not put into its key.
 *
 * ### Why the proxy decides indexability, not the build
 *
 * The variant *bodies* do not depend on `VERCEL_ENV` at all: "disallow all"
 * and "allow, sitemap at https://<host>/" are both built on every deployment.
 * Which one a request gets is `isIndexable(VERCEL_ENV, host)` — evaluated in
 * the proxy, at request time, exactly where the `X-Robots-Tag` is decided, so
 * the two surfaces of TS-WEB-0015 D3 read one predicate in one place.
 *
 * ### The paths are not public
 *
 * `/variants/**` is in no D1 row, so a direct request for one is an unknown
 * URL and the proxy answers it with the 404 like any other
 * (`isUnservablePath`). Only the proxy's own rewrite reaches a variant.
 */

import { DOMAIN_MATRIX, domainConfigFor } from "./host-matrix";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "../i18n/locales";
import { CANONICAL_PUBLIC_HOSTS, isIndexable, normaliseHost } from "../seo/indexable";

import type { Locale } from "../i18n/locales";

/** The one path prefix every variant lives under. No D1 row starts with it. */
export const VARIANTS_PREFIX = "/variants";

/** A host as a path segment: dots become dashes, so no segment looks like a file. */
export function hostSlug(host: string): string {
  return host.replaceAll(".", "-");
}

// ── robots.txt ──────────────────────────────────────────────────────────────

/** The variant every request gets that is not indexable (TS-WEB-0015 D3). */
export const ROBOTS_NOINDEX_VARIANT = "noindex";

/** Every robots.txt body there is: "disallow all", plus one per canonical host. */
export const ROBOTS_VARIANTS: readonly string[] = [
  ROBOTS_NOINDEX_VARIANT,
  ...CANONICAL_PUBLIC_HOSTS.map(hostSlug),
];

/** The canonical host a robots variant names in its `Sitemap:` line, or `undefined` for noindex. */
export function robotsVariantHost(variant: string): string | undefined {
  return CANONICAL_PUBLIC_HOSTS.find((host) => hostSlug(host) === variant);
}

/**
 * TS-WEB-0015 D3's predicate, turned into a choice of file. Not indexable —
 * preview, development, a non-canonical host — is the noindex variant; an
 * indexable request is the variant of its own canonical host.
 */
export function robotsVariantFor(
  vercelEnv: string | undefined,
  host: string | null | undefined,
): string {
  return isIndexable(vercelEnv, host) ? hostSlug(normaliseHost(host)) : ROBOTS_NOINDEX_VARIANT;
}

export function robotsVariantPath(variant: string): string {
  return `${VARIANTS_PREFIX}/robots/${variant}`;
}

// ── llms.txt ────────────────────────────────────────────────────────────────

/** One llms.txt body per domain of the matrix (TS-WEB-0004 D1: "per domain"). */
export const LLMS_VARIANTS: readonly string[] = DOMAIN_MATRIX.map((domain) => hostSlug(domain.host));

/** The canonical host a llms variant is written for. */
export function llmsVariantHost(variant: string): string | undefined {
  return DOMAIN_MATRIX.find((domain) => hostSlug(domain.host) === variant)?.host;
}

/**
 * The llms.txt variant for a request host — the matrix's own fallback
 * (`domainConfigFor`): an unknown host, `localhost` or `*.vercel.app` mirrors
 * `.de`, as it did when the body was rendered per request.
 */
export function llmsVariantFor(host: string | null | undefined): string {
  return hostSlug(domainConfigFor(host).host);
}

export function llmsVariantPath(variant: string): string {
  return `${VARIANTS_PREFIX}/llms/${variant}`;
}

// ── 404 ─────────────────────────────────────────────────────────────────────

/** One 404 document per served language. */
export const NOT_FOUND_VARIANTS: readonly Locale[] = LOCALES;

/** Where the 404 in this language is prerendered. */
export function notFoundVariantPath(locale: Locale): string {
  return `${VARIANTS_PREFIX}/not-found/${isLocale(locale) ? locale : DEFAULT_LOCALE}`;
}
