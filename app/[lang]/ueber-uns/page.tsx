import { dictionary } from "@/src/lib/i18n/dictionary";
import { pageMetadata, pageTitle } from "@/src/lib/routes/metadata";

import { resolveLocale } from "@/src/lib/i18n/locales";

import { localeFrom } from "../_locale";
import { PlaceholderPage } from "../_shell";

import type { PlaceholderModule } from "../_shell";
import type { Metadata } from "next";

/**
 * TS-027 — `/ueber-uns` — the trust surface
 *
 * Routing skeleton (M2). The ordered module list below is the page's
 * composition sheet (`plan/component-inventory.md` §4) turned into labelled
 * placeholder sections with reserved heights. The page implementer replaces a
 * section **in place**: the id and the order are the seam.
 */

const ROUTE = "about" as const;

const MODULES: readonly PlaceholderModule[] = [
  {
    id: "origin",
    components:
      "photo-surface (ratio-hero, ink gradient) + origin-story (h1, founder photo, price-tag 480) + one inline proof-card",
    height: 22,
  },
  {
    id: "operating-counters",
    components:
      "live-counters (years in operation + live active places; no static traction figure)",
    height: 8,
  },
  {
    id: "proof-stream",
    components:
      "proof-stream (7) = 6 × proof-card + exactly one empty-proof-slot (type-reserved for testimonial)",
    height: 20,
  },
  {
    id: "archive-link",
    components:
      "one route-link → /ueber-uns/archiv, zero teasers, counts or thumbnails",
    height: 6,
  },
  {
    id: "team",
    components:
      "person-profile ×n (ratio-portrait, \"Foto gesucht\" where no portrait)",
    height: 18,
  },
  {
    id: "newsletter",
    components:
      "newsletter-block (inline — permitted only here; labelled mock, state/open.md row 22)",
    height: 12,
  },
  {
    id: "closing",
    components:
      "context-band in merged mode = the three-job block, rendered once as the last block — rendered by the layout from page.meta.ts (TS-006 D2)",
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
