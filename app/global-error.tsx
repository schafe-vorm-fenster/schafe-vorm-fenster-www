"use client";

import { ERROR_COPY } from "@/src/lib/i18n/error-copy";
import { DEFAULT_LOCALE, HTML_LANG } from "@/src/lib/i18n/locales";
import { href } from "@/src/lib/routes/routes";

import "./styles/brand.css";
import "./styles/base.css";

import type { ReactNode } from "react";

/**
 * 500 — DEC-0032: statically pre-rendered, minimal (mark, one sentence, home
 * link). No live module, no search, nothing that can itself fail.
 *
 * `global-error` replaces the root layout, so it renders its own document and
 * imports the token file itself. It also sits above `[lang]`, so it cannot
 * know the request language: it speaks the TLD default (TS-WEB-0001 D1).
 *
 * Its strings come from `error-copy.ts`, the dictionary's own `error` group,
 * not from `dictionary()`: this file ships with every page, and the whole
 * dictionary would ride along with it (issue 214).
 */
export default function GlobalError(): ReactNode {
  const copy = ERROR_COPY[DEFAULT_LOCALE];
  return (
    <html lang={HTML_LANG[DEFAULT_LOCALE]}>
      <body>
        <main className="site-main" id="main">
          <div className="container">
            <h1>{copy.title}</h1>
            <p>{copy.body}</p>
            <p>
              <a href={href("home", DEFAULT_LOCALE)}>{copy.backHome}</a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
