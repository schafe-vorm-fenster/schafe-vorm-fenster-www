import { EnvoyFormMount } from "@/src/components/envoy-form-mount/envoy-form-mount";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { ResponsePromise } from "@/src/components/response-promise/response-promise";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { slot } from "@/src/lib/content/loader";
import { interpolate } from "@/src/lib/content/text";
import { pageTitle } from "@/src/lib/routes/metadata";
import { BRIEFING_URL } from "@/src/lib/live/briefing";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom, pageMetadataFor } from "../../_locale";
import { PageFrame } from "../../_page-frame";

import { pageMeta } from "./page.meta";

import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0026 — `/deine-region/angebot` — the quote form.
 *
 * Composition (D1/D2): `breadcrumb-trail` (rendered by `PageFrame`, this
 * route's `ROUTES.regionQuote.parent` is `region`) → the headline on the
 * violet ground → `envoy-form-mount` (kind `quote`, TS-WEB-0016 S2) with its own
 * `lead-fallback` → `response-promise` → band + closing.
 *
 * **No hero photograph** (polish brief page 9, item 1). The hero was an
 * attic-office interior under a full violet wash, with the headline below it
 * on flat violet: the photograph carried nothing, and the wash read as a
 * rendering error rather than as art direction. This is a form page — the
 * headline, one line of framing, and the fields. It saves ~430 px and the
 * page starts at the question it is there to ask.
 *
 * **The confirmation state is built** (F-2-66). Round 2 left it out on the
 * argument that a labelled mock with no submission target has nothing to
 * confirm — but the mock rule says the opposite: a mocked component owes the
 * full experience, "never as a hole, never as a bare empty state", and a
 * visitor who submits and sees the same screen again cannot tell whether to
 * wait for a reply or try once more. `envoy-form-mount` owns the state, says
 * in its own words that this is the demo and that nothing was sent, and moves
 * focus to it (TS-WEB-0016-A9). The real widget replaces the whole mount.
 */

const ROUTE = "regionQuote" as const;
const CONTACT_EMAIL = "jan@schafe-vorm-fenster.de";

/**
 * The placeless variant of the heading's interpolation slot, and the
 * `lead-fallback` labels. The German artifact names the slot
 * `{landkreis-oder-organisation}`, the English one `{county-or-organization}`
 * — only the German name was ever filled, so `/en/your-region/quote` rendered
 * "Request a quote for {county-or-organization}" as its `h1` (F-2-34).
 * Generated copy, `Dummy-Content` in `state/open.md`.
 */
const PAGE_COPY: Record<
  Locale,
  { genericScope: string; briefingLabel: string; quoteLabel: string }
> = {
  de: {
    genericScope: "eure Organisation",
    briefingLabel: "Lieber erst sprechen? Kennenlerngespräch buchen",
    quoteLabel: "Angebot anfragen",
  },
  en: {
    genericScope: "your organisation",
    briefingLabel: "Rather talk first? Book an intro call",
    quoteLabel: "Request a quote",
  },
};

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
  // TS-WEB-0007 README: `/deine-region/angebot` has no artifact of its own —
  // its slots live in the `region` artifact (`deine-region-angebot-*`).
  const page = await pageContent("region", locale);
  // `/deine-region/angebot` is specified together with `/deine-region`, so its
  // slots live in that page's artifact (`CONTENT_PAGE_DIRS`).
  const form = slot(page, "deine-region-angebot-1-form");

  const copy = PAGE_COPY[locale];
  const words = dictionary(locale);

  // Both artifacts' slot names, both filled: an unfilled slot rendered as the
  // `h1` of a conversion page is what F-2-34 measured.
  const heading =
    interpolate(fieldAt(form.blocks, 0), {
      "landkreis-oder-organisation": copy.genericScope,
      "county-or-organization": copy.genericScope,
    }) ?? pageTitle(ROUTE, locale);
  // One line between the headline and the first field: an organisation asked
  // to request a quote met five inputs and no sentence about what happens
  // next (brief page 9, item 2). No time promise — C11 is open.
  const intro = fieldAt(form.blocks, 1);

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame
      // TS-WEB-0006 D6 — the same goal and the same label as the page's own
      // conversion. The label used to be the interpolated `h1`, so the
      // closing button read "Angebot für eure Organisation anfragen" on the
      // page that *is* that form.
      closing={{ to: "regionQuote", label: copy.quoteLabel }}
      locale={locale}
      meta={pageMeta}
    >
      <SectionShell
        density="tight"
        labelledBy="angebot-titel"
        kicker={words.kickers.price}
        surface="violet-500"
      >
        <MotionReveal>
          <h1 id="angebot-titel">{heading}</h1>
        </MotionReveal>
      </SectionShell>

      {/* `lime-100`, not `paper`: `PageFrame` always appends `surface` (band)
          then `paper` (closing) after this page's own blocks — two more
          neutral-family sections in a row, so this one must not also be
          neutral or the run of three would break the page-rhythm rule
          (`src/components/section-shell/rhythm.ts`). */}
      {/* `label`, not `labelledBy="angebot-titel"`: that id sits on the
          headline section above (a sibling), not on a heading of this one. */}
      <SectionShell label={heading} surface="lime-100">
        <MotionReveal>
          {intro ? <p>{intro}</p> : null}
          <EnvoyFormMount
            briefingHref={BRIEFING_URL}
            briefingLabel={copy.briefingLabel}
            context={{ goal: "request-licence-quote" }}
            // TS-WEB-0012 D4 / TS-WEB-0026-A13: the page's own goal, at the stage the
            // registry fixes. The widget is the mock (Q-0022) and its submit
            // is therefore its success signal — the same reading
            // `/dein-kalender/bestellen` step 4 records for its own mocked
            // completion. `state/open.md`.
            conversion={{ goalId: "request-licence-quote", stage: "completed" }}
            fallbackEmail={CONTACT_EMAIL}
            kind="quote"
            locale={locale}
            sourceRoute={ROUTE}
            submitDataCta="primary"
          />
          <ResponsePromise />
        </MotionReveal>
      </SectionShell>

    </PageFrame>
    </>
  );
}
