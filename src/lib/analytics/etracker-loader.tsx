/**
 * The eTracker loader tag — TS-WEB-0012 D2, extracted from SRC-0010
 * (`legacy-content/app/layout.tsx`); mounted by `etracker-analytics.tsx`
 * since DEC-0218.
 *
 * One attribute departs from the legacy tag, by DEC-0218 §2:
 * `data-page-changed-detection` is `off`, not `url`. With `url` the loader
 * sends its own virtual page view on every URL change and names the page
 * after the URL (`et_getAutoPageName()`), so the stable route names of
 * `page-view.ts` would never reach the report — and a router hook beside it
 * would count every client navigation twice. TS-WEB-0012 leaves exactly this
 * choice [FREE] ("solely on `data-page-changed-detection` or on an explicit
 * router hook, provided no duplicate page views result"); the hook is
 * `etracker-analytics.tsx`.
 *
 * `next/script` with `strategy="afterInteractive"` keeps it out of the LCP
 * critical path (TS-WEB-0003 D4, TS-WEB-0012 D9) without hand-rolling `async`.
 */

import Script from "next/script";

export const ETRACKER_LOADER_SRC = "https://code.etracker.com/code/e.js";

export interface EtrackerLoaderProps {
  /**
   * D2: "supplied as a build-time env var — never inlined in a committed
   * file". `undefined` renders nothing rather than a broken loader with an
   * empty code.
   */
  readonly secureCode: string | undefined;
}

export function EtrackerLoader({ secureCode }: EtrackerLoaderProps) {
  if (!secureCode) return null;

  return (
    <Script
      data-block-cookies="true"
      data-page-changed-detection="off"
      data-secure-code={secureCode}
      id="_etLoader"
      src={ETRACKER_LOADER_SRC}
      strategy="afterInteractive"
    />
  );
}
