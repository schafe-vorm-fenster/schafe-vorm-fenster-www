import "../styles/brand.css";
import "../styles/base.css";

import type { ReactNode } from "react";

/**
 * The root layout of `/start` — the registration surface (TS-WEB-0016 D15,
 * DEC-0108, DEC-0121 §3).
 *
 * `/start` is a row of the TS-WEB-0004 D1 inventory that sits **outside**
 * `app/[lang]`: it has no language segment, no registry row and no place in
 * any page's flow (D15, "in no page's flow"). The `[lang]` layout is the
 * root layout of that tree only, so this route needs one of its own — and
 * deliberately a small one. No site chrome, no breadcrumb, no footer, no
 * newsletter entry, no analytics loader: the route embeds a third party's
 * form and measures nothing (D15 "Measurement: nothing"), and a chrome-less
 * document is what makes "the form host is the only origin contacted
 * beyond our own" (TS-WEB-0012-A2) true by construction rather than by
 * filtering.
 *
 * No skip link either: the document is one `main` with one heading and one
 * frame, so there is nothing to skip past.
 *
 * `lang="de"`: the form is German and the route serves one language
 * (TS-WEB-0001 D3 sets `<html lang>` once per document; this document has
 * no language parameter to read it from).
 */
export default function StartLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
