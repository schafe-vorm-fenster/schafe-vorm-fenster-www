import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { resolveLocale } from "@/src/lib/i18n/locales";

import { localeFrom } from "../../_locale";
import { PlaceholderPage } from "../../_shell";

import type { PlaceholderModule } from "../../_shell";
import type { Metadata } from "next";

/**
 * TS-026 — `/deine-region/angebot` — the quote form
 *
 * Routing skeleton (M2). The ordered module list below is the page's
 * composition sheet (`plan/component-inventory.md` §4) turned into labelled
 * placeholder sections with reserved heights. The page implementer replaces a
 * section **in place**: the id and the order are the seam.
 */

const ROUTE = "regionQuote" as const;

const MODULES: readonly PlaceholderModule[] = [
  {
    id: "breadcrumb-trail",
    components:
      "breadcrumb-trail",
    height: 4,
  },
  {
    id: "hero",
    components:
      "hero-block",
    height: 14,
  },
  {
    id: "quote-form",
    components:
      "envoy-form-mount (quote, S2) + response-promise + lead-fallback",
    height: 22,
  },
  {
    id: "confirmation",
    components:
      "confirmation state (same promise constant)",
    height: 12,
  },
  {
    id: "context-band",
    components:
      "context-band — rendered by the layout from page.meta.ts (TS-006 D2)",
    height: 12,
  },
  {
    id: "closing-cta",
    components:
      "closing-cta — rendered by the layout from page.meta.ts (TS-006 D2)",
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
