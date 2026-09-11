"use client";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { DEFAULT_LOCALE, HTML_LANG } from "@/src/lib/i18n/locales";
import { href } from "@/src/lib/routes/routes";

import "./styles/brand.css";
import "./styles/base.css";

import type { ReactNode } from "react";

/**
 * 500 — DEC-032: statically pre-rendered, minimal (mark, one sentence, home
 * link). No live module, no search, nothing that can itself fail.
 *
 * `global-error` replaces the root layout, so it renders its own document and
 * imports the token file itself. It also sits above `[lang]`, so it cannot
 * know the request language: it speaks the TLD default (TS-001 D1).
 */
export default function GlobalError(): ReactNode {
  const d = dictionary(DEFAULT_LOCALE);
  return (
    <html lang={HTML_LANG[DEFAULT_LOCALE]}>
      <body>
        <main className="site-main" id="main">
          <div className="container">
            <h1>{d.error.title}</h1>
            <p>{d.error.body}</p>
            <p>
              <a href={href("home", DEFAULT_LOCALE)}>{d.error.backHome}</a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
