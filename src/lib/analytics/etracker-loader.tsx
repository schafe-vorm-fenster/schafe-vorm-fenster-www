/**
 * The eTracker loader tag — TS-012 D2, extracted from SRC-010
 * (`legacy-content/app/layout.tsx`) and carried over unchanged in meaning.
 *
 * **Not mounted anywhere yet.** `getAnalyticsTracker()` (`index.ts`) never
 * returns the real adapter today (row 12/Q-040 open), so there is nothing
 * for this script to talk to — mounting it before then would load a
 * third-party script for no measurement, which D9's "no page waits on the
 * tracker" spirit and the mock rule both argue against. It is exported so
 * whoever closes row 12 has the one line to add to `app/[lang]/layout.tsx`:
 *
 * ```tsx
 * import { EtrackerLoader } from "@/src/lib/analytics/etracker-loader";
 * // inside <head> or <body>, once:
 * <EtrackerLoader secureCode={process.env.ETRACKER_SECURE_CODE} />
 * ```
 *
 * `next/script` with `strategy="afterInteractive"` keeps it out of the LCP
 * critical path (TS-003 D4, TS-012 D9) without hand-rolling `async`.
 */

import Script from "next/script";

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
      id="_etLoader"
      strategy="afterInteractive"
      src="https://code.etracker.com/code/e.js"
      data-block-cookies="true"
      data-secure-code={secureCode}
      data-page-changed-detection="url"
    />
  );
}
