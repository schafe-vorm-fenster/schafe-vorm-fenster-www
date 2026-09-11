/**
 * The domain matrix — TS-001 D1, and the host-detection half of D3/D2.
 *
 * This is a `proxy.ts`-only concept, deliberately independent of
 * `src/lib/i18n/locales.ts`'s `Locale` type (`"de" | "en"`, phase 1's
 * *full-site* language set): `.pl`'s TLD default is `pl`, which the
 * full-site app tree does not serve at all — D1's landing-only domains
 * carry their own national language, but no distinct page content for them
 * exists yet in this tree. Extending `Locale` for a page tree that cannot
 * render it would ripple through every `Record<Locale, …>` in the i18n and
 * routes layer for a route this app cannot currently answer.
 *
 * What *is* built here, precisely because it does not need that content:
 * which host is which kind (D1), the canonical `www.` redirect (D2), and
 * the language set a domain offers for the Accept-Language suggestion
 * signal (`locale-suggestion.ts`, DEC-038/053). Building the landing pages
 * themselves is a content/page work package this one does not own —
 * recorded in `state/open.md`.
 */

export type TldLanguage = "de" | "en" | "pl";

export interface DomainConfig {
  /** The canonical `www.` host (TS-001 D2). */
  readonly host: string;
  /** The bare (apex) form of the same domain — what D2's redirect corrects. */
  readonly bareHost: string;
  readonly tldDefault: TldLanguage;
  readonly kind: "full-site" | "landing";
  /** Every language this domain currently offers (D1, DEC-053: national + English). */
  readonly offers: readonly TldLanguage[];
}

/** TS-001 D1, phase 1 — the confirmed four. */
export const DOMAIN_MATRIX: readonly DomainConfig[] = [
  {
    host: "www.schafe-vorm-fenster.de",
    bareHost: "schafe-vorm-fenster.de",
    tldDefault: "de",
    kind: "full-site",
    offers: ["de", "en"],
  },
  {
    host: "www.owcezaoknem.pl",
    bareHost: "owcezaoknem.pl",
    tldDefault: "pl",
    kind: "landing",
    offers: ["pl", "en"],
  },
  {
    host: "www.schafvormfenster.at",
    bareHost: "schafvormfenster.at",
    tldDefault: "de",
    kind: "landing",
    offers: ["de", "en"],
  },
  {
    host: "www.sheepoutside.com",
    bareHost: "sheepoutside.com",
    tldDefault: "en",
    kind: "landing",
    offers: ["en"],
  },
];

/** D1's fallback row for `*.vercel.app`, `localhost`, and anything unknown: mirror `.de`. */
export const DEFAULT_DOMAIN: DomainConfig = DOMAIN_MATRIX[0]!;

/** Strips the port, lowercases — `Host` headers carry both. */
export function normaliseHost(host: string | null | undefined): string {
  return (host ?? "").toLowerCase().split(":")[0] ?? "";
}

/** The domain config for a request host — D1's fallback for anything unrecognised. */
export function domainConfigFor(host: string | null | undefined): DomainConfig {
  const normalised = normaliseHost(host);
  return (
    DOMAIN_MATRIX.find(
      (domain) => domain.host === normalised || domain.bareHost === normalised,
    ) ?? DEFAULT_DOMAIN
  );
}

/**
 * D2: `www.` is canonical on every domain in D1. Returns the canonical host
 * to redirect to, or `undefined` when the request host is already
 * canonical or is not one of D1's known domains at all (`*.vercel.app`,
 * `localhost` — D1: mirror `.de`, never redirect to a different domain).
 *
 * **Phasing note (D2), recorded rather than silently applied:** D2 exempts
 * the `.de` apex from this redirect only until the `/:community`
 * forwarding it currently carries moves to `app.*` (TS-004 D3 rule 6). That
 * forwarding is not built in this app tree, so there is nothing here for
 * the exemption to protect yet — redirecting the bare apex today matches
 * TS-001-A4 literally and breaks no route that exists. When `/:community`
 * forwarding is built, it must run **before** this redirect (or exempt its
 * own paths from it); flagged in `state/open.md` for whoever builds it.
 */
export function canonicalHostFor(host: string | null | undefined): string | undefined {
  const normalised = normaliseHost(host);
  const domain = DOMAIN_MATRIX.find((candidate) => candidate.bareHost === normalised);
  return domain?.host;
}

/** D3's algorithm, generalised across domains: first segment, else the TLD default. */
export function renderedLanguage(pathname: string, domain: DomainConfig): TldLanguage {
  const firstSegment = pathname.split("/")[1] ?? "";
  return domain.offers.includes(firstSegment as TldLanguage)
    ? (firstSegment as TldLanguage)
    : domain.tldDefault;
}
