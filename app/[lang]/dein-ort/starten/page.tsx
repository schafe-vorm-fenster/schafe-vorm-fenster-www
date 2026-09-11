import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { resolveLocale } from "@/src/lib/i18n/locales";

import { localeFrom } from "../../_locale";
import { PlaceholderPage } from "../../_shell";

import type { PlaceholderModule } from "../../_shell";
import type { Metadata } from "next";

/**
 * TS-021 — `/dein-ort/starten` — start the calendar
 *
 * Routing skeleton (M2). The ordered module list below is the page's
 * composition sheet (`plan/component-inventory.md` §4) turned into labelled
 * placeholder sections with reserved heights. The page implementer replaces a
 * section **in place**: the id and the order are the seam.
 */

const ROUTE = "placeStart" as const;

const MODULES: readonly PlaceholderModule[] = [
  {
    id: "breadcrumb-trail",
    components:
      "breadcrumb-trail (DEC-071; above block 1, not part of the sequence)",
    height: 4,
  },
  {
    id: "focus-block",
    components:
      "hero-block (acknowledgment naming the searched place, clamped to two lines) + button primary → /mitmachen/registrieren?ort=<value>",
    height: 16,
  },
  {
    id: "what-it-takes",
    components:
      "scene-block mechanism=\"whatsapp\"",
    height: 14,
  },
  {
    id: "live-example",
    components:
      "live-module-frame + place-example-set (nearest active place) or event-list",
    height: 16,
  },
  {
    id: "who-starts-it",
    components:
      "scene-block (Verein, Feuerwehr, Kirche, Gemeinde — a scene, never a role switcher)",
    height: 14,
  },
  {
    id: "search-again",
    components:
      "place-search",
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
      "closing-cta (same goal and target as the focus block) — rendered by the layout from page.meta.ts (TS-006 D2)",
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
