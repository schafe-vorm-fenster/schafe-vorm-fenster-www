import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { resolveLocale } from "@/src/lib/i18n/locales";

import { localeFrom } from "../_locale";
import { PlaceholderPage } from "../_shell";

import type { PlaceholderModule } from "../_shell";
import type { Metadata } from "next";

/**
 * TS-026 — `/deine-region` — the region page
 *
 * Routing skeleton (M2). The ordered module list below is the page's
 * composition sheet (`plan/component-inventory.md` §4) turned into labelled
 * placeholder sections with reserved heights. The page implementer replaces a
 * section **in place**: the id and the order are the seam.
 */

const ROUTE = "region" as const;

const MODULES: readonly PlaceholderModule[] = [
  {
    id: "focus",
    components:
      "photo-surface (ratio-hero) + hero-block + scene-block mechanism=\"embed\" + button primary → /deine-region/angebot + briefing outbound-link",
    height: 22,
  },
  {
    id: "territory-question",
    components:
      "section-shell copy block + one proof slot",
    height: 14,
  },
  {
    id: "whats-live-here",
    components:
      "live-module-frame + place-example-set (≤ 6) + live-counters + place-search — one swappable slot (no map anywhere)",
    height: 20,
  },
  {
    id: "the-product",
    components:
      "embed-frame (position 1′)",
    height: 18,
  },
  {
    id: "what-it-adds",
    components:
      "feature-benefit + price-tag (\"auf Anfrage\")",
    height: 16,
  },
  {
    id: "proof",
    components:
      "proof-stream (3) of proof-card",
    height: 16,
  },
  {
    id: "quote-cta",
    components:
      "button primary (repeat) + response-promise (renders nothing while null, state/open.md row 20)",
    height: 10,
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
