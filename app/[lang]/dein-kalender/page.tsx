import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { resolveLocale } from "@/src/lib/i18n/locales";

import { localeFrom } from "../_locale";
import { PlaceholderPage } from "../_shell";

import type { PlaceholderModule } from "../_shell";
import type { Metadata } from "next";

/**
 * TS-024 — `/dein-kalender` — the 480 € page
 *
 * Routing skeleton (M2). The ordered module list below is the page's
 * composition sheet (`plan/component-inventory.md` §4) turned into labelled
 * placeholder sections with reserved heights. The page implementer replaces a
 * section **in place**: the id and the order are the seam.
 */

const ROUTE = "calendar" as const;

const MODULES: readonly PlaceholderModule[] = [
  {
    id: "focus",
    components:
      "hero-block + button pulse (data-cta=\"primary\") → /dein-kalender/bestellen + adjacent secondary outbound-link (briefing, data-cta=\"equal-weight\")",
    height: 20,
  },
  {
    id: "contrast",
    components:
      "comparison-table (exactly 4 rows)",
    height: 16,
  },
  {
    id: "embed-demo",
    components:
      "embed-frame (position 1′)",
    height: 18,
  },
  {
    id: "tiers",
    components:
      "offer-tier ×3 + price-tag (one figure: 480, from the package)",
    height: 18,
  },
  {
    id: "proof",
    components:
      "proof-stream (3) of proof-card with media-frame / placeholder-surface",
    height: 16,
  },
  {
    id: "trust",
    components:
      "trust-block → /rechtliches#datenschutz, #auftragsverarbeitung",
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
      "closing-cta (same goal, not pulse) — rendered by the layout from page.meta.ts (TS-006 D2)",
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
