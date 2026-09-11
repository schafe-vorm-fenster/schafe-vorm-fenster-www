import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { resolveLocale } from "@/src/lib/i18n/locales";

import { localeFrom } from "../_locale";
import { PlaceholderPage } from "../_shell";

import type { PlaceholderModule } from "../_shell";
import type { Metadata } from "next";

/**
 * TS-022 — `/mitmachen` — the publishing entry
 *
 * Routing skeleton (M2). The ordered module list below is the page's
 * composition sheet (`plan/component-inventory.md` §4) turned into labelled
 * placeholder sections with reserved heights. The page implementer replaces a
 * section **in place**: the id and the order are the seam.
 */

const ROUTE = "takePart" as const;

const MODULES: readonly PlaceholderModule[] = [
  {
    id: "hero",
    components:
      "hero-block carrying the WhatsApp scene (data-block=\"scene\") + button primary",
    height: 20,
  },
  {
    id: "objections",
    components:
      "objection-list + one proof slot (proof-card / empty-proof-slot)",
    height: 16,
  },
  {
    id: "three-paths",
    components:
      "publishing-path ×3 (whatsapp, calendar-connection, website-import + status-badge), ending with one aside + route-link → /dein-kalender",
    height: 20,
  },
  {
    id: "live-example",
    components:
      "live-module-frame + event-list (the page's single ink section)",
    height: 16,
  },
  {
    id: "proof",
    components:
      "proof-stream (3) of proof-card",
    height: 16,
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
      "closing-cta (reassurance = permanence promise, removed if unbacked) — rendered by the layout from page.meta.ts (TS-006 D2)",
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
