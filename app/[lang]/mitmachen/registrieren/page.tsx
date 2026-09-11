import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { resolveLocale } from "@/src/lib/i18n/locales";

import { localeFrom } from "../../_locale";
import { PlaceholderPage } from "../../_shell";

import type { PlaceholderModule } from "../../_shell";
import type { Metadata } from "next";

/**
 * TS-023 — `/mitmachen/registrieren` — register (a flow, not an argument)
 *
 * Routing skeleton (M2). The ordered module list below is the page's
 * composition sheet (`plan/component-inventory.md` §4) turned into labelled
 * placeholder sections with reserved heights. The page implementer replaces a
 * section **in place**: the id and the order are the seam.
 */

const ROUTE = "register" as const;

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
      "step-indicator (\"Schritt n von 3\")",
    height: 6,
  },
  {
    id: "step-1-place",
    components:
      "place-search + result chips (community level, never the Gemeinde)",
    height: 16,
  },
  {
    id: "step-2-who",
    components:
      "choice-group (vocabulary UNKNOWN → placeholder options + demo-data-badge, state/open.md row 18)",
    height: 14,
  },
  {
    id: "step-3-path",
    components:
      "choice-group (exactly three)",
    height: 14,
  },
  {
    id: "handover",
    components:
      "one button primary wrapping outbound-link → app registration entry, etcc_* preserved",
    height: 10,
  },
  {
    id: "context-band",
    components:
      "context-band on step 1 only (component-inventory D-5, state/open.md row 24) — rendered by the layout from page.meta.ts (TS-006 D2)",
    height: 12,
  },
  {
    id: "closing-cta",
    components:
      "closing-cta = the handover, rendered in the last state only — rendered by the layout from page.meta.ts (TS-006 D2)",
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
