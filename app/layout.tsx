import { CalendarDays } from "lucide-react";

import { environmentFrom, NOINDEX } from "@/src/lib/seo/indexable";

import "./styles/brand.css";
import "./styles/base.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // No maximum-scale, no user-scalable=no: pinch zoom stays available.
};

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

export const metadata: Metadata = {
  title: {
    default: "Schafe vorm Fenster",
    template: "%s — Schafe vorm Fenster",
  },
  description:
    "Was in deinem Dorf passiert — der Dorfkalender für das Land. [Platzhalter, M3]",
  ...(INDEXABLE_BUILD ? {} : { robots: NOINDEX }),
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  // TS-001: `de` is the bare language of the .de domain. The locale routing
  // skeleton is M2 (TS-001 D3); the shell states the fact it knows today.
  return (
    <html lang="de">
      <body>
        <a className="skip-link" href="#main">
          Zum Inhalt springen
        </a>
        <header className="site-header">
          <div className="container site-header__inner">
            <span className="wordmark">
              <CalendarDays aria-hidden="true" size={24} />
              Schafe vorm Fenster
            </span>
          </div>
        </header>
        <main className="site-main" id="main">
          <div className="container">{children}</div>
        </main>
        <footer className="site-footer">
          <div className="container site-footer__inner">
            <span>
              Prototyp · {environmentFrom(process.env.VERCEL_ENV)}
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
