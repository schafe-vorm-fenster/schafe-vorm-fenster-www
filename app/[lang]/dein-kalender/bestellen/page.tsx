import { Button } from "@/src/components/button/button";
import { Chip } from "@/src/components/chip/chip";
import { CodeSnippet } from "@/src/components/code-snippet/code-snippet";
import { ContextBand } from "@/src/components/context-band/context-band";
import {
  ConversionTracker,
  FireConversionOnMount,
} from "@/src/components/conversion-tracker/conversion-tracker";
import { EnvoyFormMount } from "@/src/components/envoy-form-mount/envoy-form-mount";
import { OutboundLink } from "@/src/components/outbound-link/outbound-link";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { ScopePicker } from "@/src/components/scope-picker/scope-picker";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { StepIndicator } from "@/src/components/step-indicator/step-indicator";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { BRIEFING_URL } from "@/src/lib/live/briefing";
import { resolvePlace } from "@/src/lib/live/places";
import { jobLabelKey } from "@/src/lib/pages/page-meta";
import { readPlaceParameter } from "@/src/lib/pages/place-parameter";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom, pageMetadataFor } from "../../_locale";
import { resolveRegisterPlace } from "../../mitmachen/registrieren/resolve-place";

import { AdvancePending } from "./advance-pending";
import { pageMeta } from "./page.meta";
import { addPlace, parseOrte, removePlace, resolveOrderStep } from "./steps";

import type { ScopeChip } from "@/src/components/scope-picker/scope-picker";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-025 — `/dein-kalender/bestellen`, the order flow.
 *
 * One route, `schritt=1..4` (D2). Steps 1/2 share a screen (scope), 3 is the
 * invoice mock (`envoy-form-mount`), 4 is the embed code. Context band and
 * closing CTA render **once**, after step 4 (component-inventory §TS-025) —
 * hand-rendered here via `SiteChrome`, not `PageFrame`, for the same reason
 * as `/mitmachen/registrieren`: a per-step suppression `PageFrame` has no
 * hook for.
 *
 * `noindex, follow` (D9) — this amends TS-011 D9, which called this route
 * indexable; the contradiction is recorded in `state/open.md`. The meta tag
 * is this page's own concern; the `X-Robots-Tag` **header** is `proxy.ts`'s
 * (README: "the CSP, the HSTS variance and the X-Robots-Tag, on every
 * response") — flagged there as an open point, not built here.
 *
 * Step 4 shows the **mocked, successful** code experience (dummy
 * `organizerId`, full `demo-data-badge`'d snippet) rather than the D7
 * "cannot be issued synchronously" fallback — the mock rule's "full
 * instant-embed experience, labelled `Demo-Daten`" (plan/guardrails.md row
 * 2), matching what the work package's dispatch names explicitly.
 */

const ROUTE = "order" as const;
const KREIS_ID = "musterkreis";
const CONTACT_EMAIL = "jan@schafe-vorm-fenster.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const base = await pageMetadataFor(ROUTE, params);
  return { ...base, robots: { index: false, follow: true } };
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const SCOPE_QUESTION_FALLBACK: Record<Locale, string> = {
  de: "Für welchen Bereich soll der Kalender gelten?",
  en: "Which area should the calendar cover?",
};

// Short enough to fit a pill chip's single line at 360 px (TS-017 A9) —
// `scope-picker` appends its own " (ganzer Landkreis)" suffix once selected
// (`src/components/scope-picker/scope-picker.tsx`), so this "add" affordance
// does not repeat it.
const COUNTY_LABEL: Record<Locale, string> = {
  de: "Landkreis Musterkreis",
  en: "Musterkreis district",
};

const COUNTY_CHIP_LABEL: Record<Locale, string> = {
  de: "Musterkreis",
  en: "Musterkreis",
};

const SELECTED_COUNT: Record<Locale, (n: number) => string> = {
  de: (n) => `${n} Orte ausgewählt`,
  en: (n) => `${n} places selected`,
};

const CONTINUE_LABEL: Record<Locale, string> = { de: "Weiter", en: "Continue" };

/** What the advance control says while the step is loading (F-2-67). */
const PENDING_LABEL: Record<Locale, string> = { de: "Moment …", en: "One moment …" };
const STEP_TOTAL = 4;

/**
 * **Cache Components: this route blocks on purpose** (TS-009 D1, the dynamic
 * layer). The step this flow renders *is* the query — heading, form, step
 * indicator and closing block all change with it — so there is no static
 * shell to split off: a `<Suspense>` around the body would prerender a
 * skeleton and nothing else.
 *
 * `instant = false` is the framework's own marker for "allowed to block".
 * Recorded in `state/open.md` with the other two flow routes.
 */
export const instant = false;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await localeFrom(params);
  const query = await searchParams;
  const page = await pageContent(ROUTE, locale);
  const home = await pageContent("home", locale);
  const contextBandHeading = fieldAt(slot(home, "home-10-context-band").blocks, 0);

  const scopeSlot = slot(page, "bestellen-1-scope");
  const briefingSlot = slot(page, "bestellen-2-briefing-exit");
  const invoiceSlot = slot(page, "bestellen-3-invoice");
  const codeSlot = slot(page, "bestellen-4-embed-code");

  const orteRaw = firstParam(query.orte);
  const orte = parseOrte(orteRaw);
  const hasCounty = firstParam(query.kreis) === KREIS_ID;
  const hasScope = orte.length > 0 || hasCounty;
  const step = resolveOrderStep(hasScope, firstParam(query.schritt));

  const resolvedPlaces = (await Promise.all(orte.map((slug) => resolvePlace(slug)))).filter(
    (place): place is NonNullable<typeof place> => place !== undefined,
  );

  const chips: ScopeChip[] = [
    ...resolvedPlaces.map((place) => ({
      id: place.slug,
      label: place.name,
      kind: "place" as const,
      removeQuery: {
        orte: removePlace(orteRaw, place.slug) || undefined,
        kreis: hasCounty ? KREIS_ID : undefined,
      },
    })),
    ...(hasCounty
      ? [
          {
            id: KREIS_ID,
            label: COUNTY_CHIP_LABEL[locale],
            kind: "county" as const,
            removeQuery: { orte: orteRaw, kreis: undefined },
          },
        ]
      : []),
  ];

  // The scope search reuses `place-search`'s own field name ("ort") and the
  // same shared resolver step 1 of the register flow uses (not a page-local
  // mock) — an unresolved value is simply not offered as an "add" chip.
  // F-2-38: through the D4 validator first — the 80-character cap and the
  // character allowlist of `place-parameter.ts` apply on every flow step, not
  // only on the pages that echo the value.
  const rawSearch = readPlaceParameter(query.ort);
  const lookup = rawSearch ? await resolveRegisterPlace(rawSearch) : undefined;
  const addable =
    lookup?.kind === "resolved" && !orte.includes(lookup.place.slug) ? lookup.place : undefined;

  const briefingLabel = fieldAt(briefingSlot.blocks, 0) ?? "";
  const briefingExit = (
    <ConversionTracker
      attributes={{ route: ROUTE }}
      goalId="request-product-briefing"
      stage="handover"
    >
      <OutboundLink href={BRIEFING_URL} newTab recipient="Google" variant="secondary">
        {briefingLabel}
      </OutboundLink>
    </ConversionTracker>
  );

  const demoCode =
    '<script defer src="https://portalize.schafe-vorm-fenster.de/api/demo-organizer-bestellen/load.js"></script>\n<div data-portalize-organizer-id="demo-organizer-bestellen"></div>';

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
      <SectionShell surface="paper">
        <StepIndicator step={step} total={STEP_TOTAL} />

        {step <= 2 ? (
          <>
            <h1>{fieldAt(scopeSlot.blocks, 0) ?? SCOPE_QUESTION_FALLBACK[locale]}</h1>
            <PlaceSearch
              defaultValue={rawSearch}
              label={fieldAt(scopeSlot.blocks, 0) ?? ""}
              locale={locale}
              query={{ orte: orteRaw, kreis: hasCounty ? KREIS_ID : undefined }}
              to="order"
            />
            {addable ? (
              <Chip
                locale={locale}
                query={{
                  orte: addPlace(orteRaw, addable.slug),
                  kreis: hasCounty ? KREIS_ID : undefined,
                }}
                to="order"
              >
                + {addable.name}
              </Chip>
            ) : null}
            <Chip
              locale={locale}
              query={{ orte: orteRaw, kreis: hasCounty ? undefined : KREIS_ID }}
              selected={hasCounty}
              to="order"
            >
              {COUNTY_LABEL[locale]}
            </Chip>
            <ScopePicker items={chips} locale={locale} to="order" />
            <p aria-live="polite">{SELECTED_COUNT[locale](chips.length)}</p>
            {hasScope ? (
              <Button
                dataCta="primary"
                locale={locale}
                onward
                query={{ orte: orteRaw, kreis: hasCounty ? KREIS_ID : undefined, schritt: 3 }}
                to="order"
              >
                {CONTINUE_LABEL[locale]}
              </Button>
            ) : null}
            {briefingExit}
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1>{fieldAt(invoiceSlot.blocks, 0)}</h1>
            {/* One call to action on this step (F-2-51). The invoice form
                stands inside a flow, so the step owns the advance and the
                form does not render a submit of its own: until round 3 the
                mount's inert "Absenden" stood beside "Weiter", and the button
                a visitor filling in invoice details reaches for was the one
                that did nothing at all. */}
            <EnvoyFormMount
              context={{ scope: orte.join(",") || KREIS_ID }}
              fallbackEmail={CONTACT_EMAIL}
              kind="order-invoice"
              locale={locale}
              ownSubmit={false}
              sourceRoute={ROUTE}
              state="mocked"
            />
            <p>{fieldAt(invoiceSlot.blocks, 2)}</p>
            <Button
              dataCta="primary"
              locale={locale}
              onward
              query={{ orte: orteRaw, kreis: hasCounty ? KREIS_ID : undefined, schritt: 4 }}
              to="order"
            >
              {CONTINUE_LABEL[locale]}
              {/* F-2-67: a hasty reload during the transition used to swallow
                  the advance with no sign that the click had not counted.
                  `useLinkStatus` puts the pending state on the control the
                  visitor pressed — no store, no dedupe, which TS-025 D8
                  forbids anyway. */}
              <AdvancePending label={PENDING_LABEL[locale]} />
            </Button>
            {briefingExit}
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h1>{fieldAt(codeSlot.blocks, 0)}</h1>
            {/* F-2-33: the snippet's `Demo-Daten` badge reads the page's
                language like every other self-badging module. */}
            <CodeSnippet
              code={demoCode}
              locale={locale}
              note={fieldAt(codeSlot.blocks, 1)}
              state="mocked"
            />
            {/* F-2-60: keyed on the completed order, so Back-then-Forward
                through step 4 reports the same completion once. */}
            <FireConversionOnMount
              attributes={{ route: ROUTE }}
              // The **resolved** scope, not the raw parameter: two spellings
              // of the same order are one completion, and the key stays
              // bounded by what geo-api confirmed rather than by what a
              // visitor typed.
              dedupeKey={`${resolvedPlaces.map((place) => place.slug).join(",")}|${hasCounty ? KREIS_ID : ""}`}
              goalId="buy-calendar-licence"
              stage="completed"
            />
            {briefingExit}
          </>
        ) : null}
      </SectionShell>

      {step === 4 ? (
        // TS-011-A4 (F-2-41): an `aside`, like every other band — this page
        // renders its own because TS-025 places it after step 4 only.
        <SectionShell as="aside" id="context-band" label={contextBandHeading} surface="surface">
          <ContextBand currentJob={jobLabelKey(pageMeta.focusJob)} heading={contextBandHeading} locale={locale} />
        </SectionShell>
      ) : null}
    </>
  );
}
