import { CalendarDays } from "lucide-react";

import { dictionary } from "@/src/lib/i18n/dictionary";
import {
  HTML_LANG,
  LOCALES,
  OG_LOCALE,
  resolveLocale,
} from "@/src/lib/i18n/locales";
import {
  FOOTER_LEGAL_LINKS,
  HEADER_CALENDAR_ENTRY,
  HEADER_JOBS,
} from "@/src/lib/routes/navigation";
import { legalAnchor } from "@/src/lib/routes/legal-anchors";
import { href, SITE_ORIGIN } from "@/src/lib/routes/routes";
import { environmentFrom, NOINDEX } from "@/src/lib/seo/indexable";

import "../styles/brand.css";
import "../styles/base.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

/**
 * The root layout — TS-004 D2. `[lang]` sits **above** it, which is what
 * makes the language a root parameter: `<html lang>` is set here once, and
 * every server component below can read the language without prop drilling
 * (`next/root-params`).
 *
 * The public URL never shows `/de`: the bare path is rewritten onto this
 * tree (TS-004 D3, `next.config.ts`). The rendered language is a pure
 * function of the URL — no cookie, no `Accept-Language` (TS-001 D3,
 * DEC-038), which is what keeps every page statically cacheable.
 */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // No maximum-scale, no user-scalable=no: pinch zoom stays available.
};

/**
 * TS-001 D4 / TS-004 D2 — the language set that ships, and nothing else.
 *
 * `dynamicParams = false` is D2's own pairing: a first segment that is not a
 * language served on this domain matches no route at all and answers 404
 * through `app/global-not-found.tsx` — the one 404 surface Next.js 16.3
 * actually server-renders (see the note there).
 */
export const dynamicParams = false;

export function generateStaticParams(): { lang: string }[] {
  return LOCALES.map((lang) => ({ lang }));
}

/**
 * TS-015 D3, surface 3 of 3 — the page metadata half of the noindex regime.
 *
 * The predicate has two halves: `VERCEL_ENV === "production"` **and** a
 * canonical host. Only the first half is evaluated here. Reading the request
 * host would turn the prerendered shell into a per-request function
 * invocation — the failure mode DEC-041 §8 forbids and DEC-045 protects the
 * shell from. The host half is carried by the `X-Robots-Tag` header the proxy
 * sets on every response, where it costs nothing. The divergence from
 * TS-015-A1's wording is recorded in state/open.md.
 */
const INDEXABLE_BUILD = process.env.VERCEL_ENV === "production";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const d = dictionary(locale);
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: {
      default: d.siteName,
      template: `%s — ${d.siteName}`,
    },
    openGraph: { siteName: d.siteName, locale: OG_LOCALE[locale] },
    ...(INDEXABLE_BUILD ? {} : { robots: NOINDEX }),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ lang: string }> }>) {
  // The layout renders even for an unsupported code, so that the page below
  // it can answer 404 *inside* this shell (TS-004 D3.4). It resolves rather
  // than throws; the 404 body is then the TLD default's.
  const locale = resolveLocale((await params).lang);
  const d = dictionary(locale);
  const other = LOCALES.filter((candidate) => candidate !== locale);

  return (
    <html lang={HTML_LANG[locale]}>
      <body>
        <a className="skip-link" href="#main">
          {d.skipToContent}
        </a>
        {/* Chrome placeholder. The header and footer components land with the
            component work package; what has to be right *here* is that every
            target comes from the route registry (TS-004 D4, TS-001 D5). */}
        <header className="site-header">
          <div className="container site-header__inner">
            <a className="wordmark" href={href("home", locale)}>
              <CalendarDays aria-hidden="true" size={24} />
              {d.siteName}
            </a>
            <nav aria-label={d.nav.home}>
              <ul>
                {HEADER_JOBS.map((entry) => (
                  <li key={entry.route}>
                    <a href={href(entry.route, locale)}>{d.nav[entry.label]}</a>
                  </li>
                ))}
                <li>
                  <a
                    data-header-calendar="true"
                    href={href(HEADER_CALENDAR_ENTRY.route, locale)}
                  >
                    {d.nav[HEADER_CALENDAR_ENTRY.label]}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="site-main" id="main">
          <div className="container">{children}</div>
        </main>
        <footer className="site-footer">
          <div className="container site-footer__inner">
            <nav aria-label={d.footer.imprint}>
              <ul>
                {FOOTER_LEGAL_LINKS.map((entry) => (
                  <li key={entry.section}>
                    <a
                      href={`${href(entry.route, locale)}#${legalAnchor(entry.section, locale)}`}
                    >
                      {d.footer[entry.label]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            {/* TS-001 D5: switching language is plain link navigation and
                keeps the visitor on the equivalent page — no JS required. */}
            <nav aria-label={d.footer.language} data-language-switcher="true">
              <ul>
                {other.map((candidate) => (
                  <li key={candidate}>
                    <a hrefLang={candidate} href={href("home", candidate)}>
                      {HTML_LANG[candidate].toUpperCase()}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <span>Prototyp · {environmentFrom(process.env.VERCEL_ENV)}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
