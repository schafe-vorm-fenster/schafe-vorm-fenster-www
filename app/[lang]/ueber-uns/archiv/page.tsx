import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { resolveLocale } from "@/src/lib/i18n/locales";

import { localeFrom } from "../../_locale";
import { PlaceholderPage } from "../../_shell";

import type { PlaceholderModule } from "../../_shell";
import type { Metadata } from "next";

/**
 * TS-028 — `/ueber-uns/archiv` — the archive
 *
 * Routing skeleton (M2). The ordered module list below is the page's
 * composition sheet (`plan/component-inventory.md` §4) turned into labelled
 * placeholder sections with reserved heights. The page implementer replaces a
 * section **in place**: the id and the order are the seam.
 */

const ROUTE = "archive" as const;

const MODULES: readonly PlaceholderModule[] = [
  {
    id: "breadcrumb-trail",
    components:
      "breadcrumb-trail",
    height: 4,
  },
  {
    id: "page-head",
    components:
      "the page heading — the LCP element, text, never an image",
    height: 8,
  },
  {
    id: "filter",
    components:
      "archive-filter (chip row + all, aria-live row count; hidden without JS)",
    height: 8,
  },
  {
    id: "the-record",
    components:
      "year heading + archive-row ×n, date descending, two fixed variants (with / without preview at ratio-proof)",
    height: 24,
  },
  {
    id: "closing",
    components:
      "context-band in merged mode — rendered by the layout from page.meta.ts (TS-006 D2)",
    height: 14,
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
