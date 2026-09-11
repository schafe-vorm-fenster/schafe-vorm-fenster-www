/**
 * The Accept-Language suggestion signal — TS-001 D3's closing note,
 * DEC-038, DEC-053.
 *
 * D3: the *rendered* language is a pure function of the URL — no cookie, no
 * session, no `Accept-Language` at render time, because pages must stay
 * statically cacheable. DEC-038 carries a first-visit suggestion forward as
 * a **future, client-side, once-per-session** feature (`sessionStorage`,
 * Q-011) that "offers a link; it does not redirect the render." This module
 * is the one thing D3/DEC-038 assign to the proxy today: exposing the raw
 * signal, never acting on it.
 *
 * The signal travels as a `Server-Timing` response header rather than a
 * bespoke one: a custom header on a top-level navigation response is not
 * otherwise readable from page JS, while `Server-Timing` is — via
 * `performance.getEntriesByType("navigation")[0].serverTiming` — which is
 * what will let the deferred client script read it without the proxy
 * setting a cookie (D1/D8's storage ban) or varying the cached HTML body
 * (the header carries no `Vary`, so it does not fragment any HTTP cache).
 */

import { renderedLanguage } from "./host-matrix";

import type { DomainConfig, TldLanguage } from "./host-matrix";

interface WeightedTag {
  readonly tag: string;
  readonly quality: number;
}

/** Parses `Accept-Language` into base language tags, best quality first. */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];
  const entries: WeightedTag[] = header
    .split(",")
    .map((part): WeightedTag | undefined => {
      const [rawTag, ...params] = part.trim().split(";");
      const tag = rawTag?.trim().toLowerCase().split("-")[0];
      if (!tag) return undefined;
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const parsedQuality = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag, quality: Number.isFinite(parsedQuality) ? parsedQuality : 0 };
    })
    .filter((entry): entry is WeightedTag => entry !== undefined);

  return [...entries].sort((a, b) => b.quality - a.quality).map((entry) => entry.tag);
}

/**
 * The best-matching language this domain offers that differs from what is
 * actually rendering — `undefined` when nothing differs (no point
 * suggesting the current language) or nothing the visitor prefers is
 * offered here at all.
 */
export function suggestedLanguage(
  acceptLanguageHeader: string | null | undefined,
  domain: DomainConfig,
  pathname: string,
): TldLanguage | undefined {
  const current = renderedLanguage(pathname, domain);
  const preferred = parseAcceptLanguage(acceptLanguageHeader);
  return preferred.find(
    (tag): tag is TldLanguage => domain.offers.includes(tag as TldLanguage) && tag !== current,
  );
}

/** D3/D9: the `Server-Timing` entry that exposes the signal. */
export function suggestionServerTiming(language: TldLanguage): string {
  return `suggested-locale;desc="${language}"`;
}
