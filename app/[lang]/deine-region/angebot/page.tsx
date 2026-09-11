import { EnvoyFormMount } from "@/src/components/envoy-form-mount/envoy-form-mount";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { ResponsePromise } from "@/src/components/response-promise/response-promise";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { slotState } from "@/src/lib/content/provenance";
import { interpolate } from "@/src/lib/content/text";
import { pageTitle } from "@/src/lib/routes/metadata";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom, pageMetadataFor } from "../../_locale";
import { PageFrame } from "../../_page-frame";

import { pageMeta } from "./page.meta";

import type { Metadata } from "next";

/**
 * TS-026 — `/deine-region/angebot` — the quote form.
 *
 * Composition (D1/D2): `breadcrumb-trail` (rendered by `PageFrame`, this
 * route's `ROUTES.regionQuote.parent` is `region`) → `hero-block` →
 * `envoy-form-mount` (kind `quote`, TS-016 S2) with its own `lead-fallback`
 * → `response-promise` → band + closing.
 *
 * The confirmation state ("Deine Anfrage ist bei uns.") is not built here:
 * `envoy-form-mount` is a labelled mock with no real submission target
 * (Q-022) and does not offer a success callback to switch views into.
 * Building one would mean the page pretends the widget submitted somewhere
 * — the real confirmation UX arrives with the actual widget (M4). Recorded
 * in `state/open.md`, and TS-026-A13 (the `request-licence-quote` event on
 * submit) is listed not-yet-M4 for the same reason.
 */

const ROUTE = "regionQuote" as const;
const CONTACT_EMAIL = "jan@schafe-vorm-fenster.de";
const BRIEFING_HREF = "https://calendar.google.com/calendar/appointments/example";
const BRIEFING_LABEL = "Termin für ein Kennenlerngespräch buchen";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadataFor(ROUTE, params);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = await localeFrom(params);
  // TS-007 README: `/deine-region/angebot` has no artifact of its own —
  // its slots live in the `region` artifact (`deine-region-angebot-*`).
  const page = await pageContent("region", locale);
  const form = slot(page, "deine-region-angebot-1-form");

  const heading =
    interpolate(fieldAt(form.blocks, 0), { "landkreis-oder-organisation": "eure Organisation" }) ??
    pageTitle(ROUTE, locale);

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      closing={{ to: "regionQuote", label: "Angebot anfragen" }}
      locale={locale}
      meta={pageMeta}
    >
      <MotionReveal>
        <HeroBlock headline={heading} id="angebot-titel" state={slotState(form)} />
      </MotionReveal>

      {/* `lime-100`, not `paper`: `PageFrame` always appends `surface` (band)
          then `paper` (closing) after this page's own blocks — two more
          neutral-family sections in a row, so this one must not also be
          neutral or the run of three would break the page-rhythm rule
          (`src/components/section-shell/rhythm.ts`). */}
      {/* `label`, not `labelledBy="angebot-titel"`: that id sits on
          `hero-block`'s own `photo-surface` section (a sibling), not on a
          heading this section could point to. */}
      <SectionShell label={heading} surface="lime-100">
        <MotionReveal>
          <EnvoyFormMount
            briefingHref={BRIEFING_HREF}
            briefingLabel={BRIEFING_LABEL}
            context={{ goal: "request-licence-quote" }}
            // TS-012 D4 / TS-026-A13: the page's own goal, at the stage the
            // registry fixes. The widget is the mock (Q-022) and its submit
            // is therefore its success signal — the same reading
            // `/dein-kalender/bestellen` step 4 records for its own mocked
            // completion. `state/open.md`.
            conversion={{ goalId: "request-licence-quote", stage: "completed" }}
            fallbackEmail={CONTACT_EMAIL}
            kind="quote"
            locale={locale}
            sourceRoute={ROUTE}
          />
          <ResponsePromise />
        </MotionReveal>
      </SectionShell>

    </PageFrame>
    </>
  );
}
