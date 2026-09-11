import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { resolveLocale } from "@/src/lib/i18n/locales";

import { localeFrom } from "../../_locale";
import { PlaceholderPage } from "../../_shell";

import type { PlaceholderModule } from "../../_shell";
import type { Metadata } from "next";

/**
 * TS-025 — `/dein-kalender/bestellen` — order flow
 *
 * Routing skeleton (M2). The ordered module list below is the page's
 * composition sheet (`plan/component-inventory.md` §4) turned into labelled
 * placeholder sections with reserved heights. The page implementer replaces a
 * section **in place**: the id and the order are the seam.
 */

const ROUTE = "order" as const;

const MODULES: readonly PlaceholderModule[] = [
  {
    id: "breadcrumb-trail",
    components:
      "breadcrumb-trail",
    height: 4,
  },
  {
    id: "step-indicator",
    components:
      "step-indicator (\"… von 4\", schritt=1..4 in the URL)",
    height: 6,
  },
  {
    id: "scope",
    components:
      "place-search + scope-picker (chips, county = one chip, collapse above 12); no live preview in V1 (DEC-069)",
    height: 18,
  },
  {
    id: "invoice",
    components:
      "envoy-form-mount (authority field set) with lead-fallback",
    height: 20,
  },
  {
    id: "code",
    components:
      "code-snippet + confirmation, plus the lost-state note",
    height: 16,
  },
  {
    id: "context-band",
    components:
      "context-band, rendered once after step 4 — rendered by the layout from page.meta.ts (TS-006 D2)",
    height: 12,
  },
  {
    id: "closing-cta",
    components:
      "closing-cta, rendered once after step 4 — rendered by the layout from page.meta.ts (TS-006 D2)",
    height: 10,
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  // `generateMetadata` must not throw `notFound()`: the metadata boundary
  // sits above `[lang]`, so a throw here escapes the shell and Next.js falls
  // back to its built-in 404. The *page* answers 404; this resolves.
  return pageMetadata(ROUTE, resolveLocale((await params).lang));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = await localeFrom(params);
  const d = dictionary(locale);
  return (
    <PlaceholderPage
      labels={d.placeholder}
      modules={MODULES}
      note={d.placeholder.note}
      title={pageTitle(ROUTE, locale)}
    />
  );
}
