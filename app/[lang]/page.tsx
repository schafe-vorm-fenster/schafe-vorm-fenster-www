import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { resolveLocale } from "@/src/lib/i18n/locales";

import { localeFrom } from "./_locale";
import { PlaceholderPage } from "./_shell";

import type { PlaceholderModule } from "./_shell";
import type { Metadata } from "next";

/**
 * TS-019 — `/` — home
 *
 * Routing skeleton (M2). The ordered module list below is the page's
 * composition sheet (`plan/component-inventory.md` §4) turned into labelled
 * placeholder sections with reserved heights. The page implementer replaces a
 * section **in place**: the id and the order are the seam.
 */

const ROUTE = "home" as const;

const MODULES: readonly PlaceholderModule[] = [
  {
    id: "focus-block",
    components:
      "photo-surface (ratio-hero) + hero-block + place-search as the dominant element, submit data-cta=\"primary\" [S1] · hero-block + live-module-frame + event-list (3) + button [S2] · empty-state-block + live-module-frame + event-list [S3]",
    height: 22,
  },
  {
    id: "scene-1",
    components:
      "scene-block mechanism=\"whatsapp\"",
    height: 14,
  },
  {
    id: "scene-2",
    components:
      "scene-block mechanism=\"embed\"",
    height: 14,
  },
  {
    id: "scene-3",
    components:
      "scene-block mechanism=\"provenance\"",
    height: 14,
  },
  {
    id: "provenance-stamps",
    components:
      "badge row (kicker variant) inside section-shell",
    height: 8,
  },
  {
    id: "proof-stream",
    components:
      "proof-stream (5) of proof-card / empty-proof-slot",
    height: 18,
  },
  {
    id: "live-counters",
    components:
      "live-counters (today: dates figure only) — inline, no section of its own",
    height: 6,
  },
  {
    id: "context-band",
    components:
      "context-band (band mode) — rendered by the layout from page.meta.ts (TS-006 D2)",
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
