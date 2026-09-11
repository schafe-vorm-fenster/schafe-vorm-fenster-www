import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { resolveLocale } from "@/src/lib/i18n/locales";

import { localeFrom } from "../_locale";
import { PlaceholderPage } from "../_shell";

import type { PlaceholderModule } from "../_shell";
import type { Metadata } from "next";

/**
 * TS-020 — `/dein-ort` — your place
 *
 * Routing skeleton (M2). The ordered module list below is the page's
 * composition sheet (`plan/component-inventory.md` §4) turned into labelled
 * placeholder sections with reserved heights. The page implementer replaces a
 * section **in place**: the id and the order are the seam.
 */

const ROUTE = "place" as const;

const MODULES: readonly PlaceholderModule[] = [
  {
    id: "focus-block",
    components:
      "hero-block (place name h1) + live-module-frame (role=status) + event-list (3) + button primary → {APP_ORIGIN}/{slug} [state A] · empty-state-block in the module slot, primary CTA becomes register-as-publisher [state B]",
    height: 20,
  },
  {
    id: "value-stories",
    components:
      "value-story ×4 (example ladder; testimonial slot absent while uncleared)",
    height: 16,
  },
  {
    id: "nearby-this-week",
    components:
      "live-module-frame + event-list (5, each row naming its place)",
    height: 16,
  },
  {
    id: "homescreen",
    components:
      "howto-block (iOS + Android always, no branching)",
    height: 14,
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
