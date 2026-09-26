import { Button } from "@/src/components/button/button";
import { Chip } from "@/src/components/chip/chip";
import { CodeSnippet } from "@/src/components/code-snippet/code-snippet";
import { ContextBand } from "@/src/components/context-band/context-band";
import { CONTACT_SECTION_ID } from "@/src/components/contact-section/contact-section";
import { FireConversionOnMount } from "@/src/components/conversion-tracker/conversion-tracker";
import { EnvoyFormMount } from "@/src/components/envoy-form-mount/envoy-form-mount";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { ScopePicker } from "@/src/components/scope-picker/scope-picker";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { StepIndicator } from "@/src/components/step-indicator/step-indicator";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { resolvePlace } from "@/src/lib/live/places";
import { jobLabelKey } from "@/src/lib/pages/page-meta";
import { readPlaceParameter } from "@/src/lib/pages/place-parameter";
import { formatPriceFigure } from "@/src/components/price-tag/format";
import { linkHref } from "@/src/components/route-link/href";
import { offeringPrice } from "@/src/lib/pricing/offerings";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom, pageMetadataFor } from "../../_locale";
import { resolveRegisterPlace } from "../../mitmachen/registrieren/resolve-place";

import { pageMeta } from "./page.meta";
import { addPlace, parseOrte, removePlace, resolveOrderStep } from "./steps";

import styles from "./page.module.css";

import type { ScopeChip } from "@/src/components/scope-picker/scope-picker";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0025 — `/dein-kalender/bestellen`, the order flow.
 *
 * One route, `schritt=1..4` (D2). Steps 1/2 share a screen (scope), 3 is the
 * invoice mock (`envoy-form-mount`), 4 is the embed code. Context band and
 * closing CTA render **once**, after step 4 (component-inventory §TS-WEB-0025) —
 * hand-rendered here via `SiteChrome`, not `PageFrame`, for the same reason
 * as `/mitmachen/registrieren`: a per-step suppression `PageFrame` has no
 * hook for.
 *
 * `noindex, follow` (D9) — this amends TS-WEB-0011 D9, which called this route
 * indexable; the contradiction is recorded in `state/open.md`. The meta tag
 * is this page's own concern; the `X-Robots-Tag` **header** is `proxy.ts`'s
 * (README: "the CSP, the HSTS variance and the X-Robots-Tag, on every
 * response") — flagged there as an open point, not built here.
 *
 * Step 4 shows the **mocked, successful** code experience (a stand-in
 * `organizerId` in the real id shape, the full snippet) rather than the D7
 * "cannot be issued synchronously" fallback — the mock rule's "full
 * instant-embed experience" (plan/guardrails.md), with the marking in
 * `data-demo` rather than in the page (Jan, 2026-09-18).
 */

const ROUTE = "order" as const;
const KREIS_ID = "vorpommern-greifswald";
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

// Short enough to fit a pill chip's single line at 360 px (TS-WEB-0017 A9) —
// `scope-picker` appends its own " (ganzer Landkreis)" suffix once selected
// (`src/components/scope-picker/scope-picker.tsx`), so this "add" affordance
// does not repeat it.
const COUNTY_LABEL: Record<Locale, string> = {
  de: "Landkreis Vorpommern-Greifswald",
  en: "Vorpommern-Greifswald district",
};

const COUNTY_CHIP_LABEL: Record<Locale, string> = {
  de: "Vorpommern-Greifswald",
  en: "Vorpommern-Greifswald",
};

/** One place is not "1 Orte" — the strip reads a count, so it has to count. */
const SELECTED_COUNT: Record<Locale, (n: number) => string> = {
  de: (n) => (n === 1 ? "1 Ort ausgewählt" : `${n} Orte ausgewählt`),
  en: (n) => (n === 1 ? "1 place selected" : `${n} places selected`),
};

const CONTINUE_LABEL: Record<Locale, string> = { de: "Weiter", en: "Continue" };

/**
 * Why the advance is disabled on step 1/2, said out loud.
 *
 * A control that is simply absent until some invisible condition is met is
 * the dead end the brief found: the screen offered a chip, two contradicting
 * empty statements and an exit, and nothing that looked like a way on. The
 * button is always there now; when it cannot be pressed, this line says what
 * would make it pressable.
 */
const SCOPE_REQUIRED: Record<Locale, string> = {
  de: "Wähl mindestens einen Ort oder den ganzen Landkreis, dann geht es weiter.",
  en: "Pick at least one place, or the whole district, and you can carry on.",
};

/** The county, offered the way a found place is offered — as something to add. */
const ADD_COUNTY: Record<Locale, (county: string) => string> = {
  de: (county) => `+ ${county}`,
  en: (county) => `+ ${county}`,
};

/**
 * The strip above every step: what this costs, and what is selected.
 *
 * Someone who arrives from the 480 € tier card loses the one number that
 * made her click the moment the flow starts — and the price is fixed per
 * organisation regardless of scope (DEC-0060), which is reassuring and has to
 * be said rather than left to be discovered.
 */
const PRICE_NOTE: Record<Locale, string> = {
  de: "Der Preis ändert sich mit der Auswahl nicht.",
  en: "The price does not change with your selection.",
};

/** The step-4 line that makes the flow read finished. */
const DONE_NOTE: Record<Locale, string> = {
  de: "Die Bestellung ist aufgenommen.",
  en: "Your order is in.",
};

/** What the advance control says while the step is loading (F-2-67). */
const PENDING_LABEL: Record<Locale, string> = { de: "Moment …", en: "One moment …" };
const STEP_TOTAL = 4;

/**
 * **Cache Components: this route blocks on purpose** (TS-WEB-0009 D1, the dynamic
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

  /**
   * 480 € per year, net — read from the offering package like every other
   * price on the site (TS-WEB-0006 D10), never typed into the flow.
   */
  const priceFigure = offeringPrice("portalize-calendar", locale).figure;
  const priceLine = priceFigure ? formatPriceFigure(priceFigure, locale) : "";

  /** Where a valid invoice submission goes: step 4, scope carried. */
  const advanceHref = linkHref("order", {
    locale,
    query: { orte: orteRaw, kreis: hasCounty ? KREIS_ID : undefined, schritt: 4 },
  });

  const briefingLabel = fieldAt(briefingSlot.blocks, 0) ?? "";
  /**
   * This route's contact section as an in-page target, with the flow's own
   * scope and step in the query (D8). The consult exit below and step 3's
   * lead fallback both point at it, so the fallback stands on its own
   * wherever it renders (TS-WEB-0016-A14, TS-WEB-0025-A14).
   */
  const briefingHref = linkHref(ROUTE, {
    locale,
    query: { orte: orteRaw, kreis: hasCounty ? KREIS_ID : undefined, schritt: step },
    hash: CONTACT_SECTION_ID,
  });
  /*
   * TS-WEB-0025 D5 — the consult exit on all four steps, and **an in-page
   * target, not an outbound link**: it points at this route's contact section,
   * which the chrome renders once below the flow (DEC-0081 §3,
   * TS-WEB-0016-A5). The one outbound occurrence on the route is that
   * section's first action row.
   *
   * It therefore carries no `ConversionTracker` — the exit emits nothing and
   * `request-product-briefing` fires on the section's row with this route
   * (TS-WEB-0025-A11, TS-WEB-0016 D12) — and no outbound marking, because
   * nothing leaves the site.
   *
   * The scope and the step ride along in the query: the section stands on
   * this same document, and a link that dropped them would take the visitor
   * out of the flow she is in (D8, "the scope is in the URL").
   *
   * G-5 / D5: an exit, never a button. It was the only control on the screen
   * that looked like an action, so the way out outranked the way on.
   */
  const briefingExit = (
    // `size="compact"` — the 44 px control height (`--height-control`), not the
    // primary's 56 px: the exit is the second rung, and at the default size it
    // took the step's own advance button's box.
    <Button
      dataCta="secondary"
      hash={CONTACT_SECTION_ID}
      locale={locale}
      query={{ orte: orteRaw, kreis: hasCounty ? KREIS_ID : undefined, schritt: step }}
      size="compact"
      to={ROUTE}
      variant="quiet"
    >
      {briefingLabel}
    </Button>
  );

  // The id shape the CRM really issues, so the snippet a visitor copies in
  // the prototype looks exactly like the one she will be sent (Q-0046,
  // `state/open.md` row 2). The block itself carries `data-demo="true"`.
  const demoCode =
    '<script defer src="https://portalize.schafe-vorm-fenster.de/api/65f3a9c1d4e27b0912af4c38/load.js"></script>\n<div data-portalize-organizer-id="65f3a9c1d4e27b0912af4c38"></div>';

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
      <SectionShell surface="paper">
        <StepIndicator
          complete={step === STEP_TOTAL}
          locale={locale}
          step={step}
          total={STEP_TOTAL}
        />

        {/* What this costs, on every step, with the count beside it — the
            flow carried no price at all, so someone arriving from the 480 €
            tier card lost the number that made her click. The count lives
            here rather than as a line of its own under the chips, which is
            how step 1 came to state "Noch keine Auswahl." and "0 Orte
            ausgewählt" within 120 px of each other. */}
        <p className={styles.summary}>
          <span className={styles.price}>{priceLine}</span>
          {/* Silent at zero: the picker's own empty state is the one
              statement about an empty scope. The step used to carry three —
              a chip that looked selected, "Noch keine Auswahl." and "0 Orte
              ausgewählt" — inside 120 px. The node stays mounted so an
              addition is announced rather than appearing unremarked. */}
          <span aria-live="polite" className={styles.count}>
            {chips.length === 0 ? "" : SELECTED_COUNT[locale](chips.length)}
          </span>
        </p>
        <p className={styles.priceNote}>{PRICE_NOTE[locale]}</p>

        {step <= 2 ? (
          <>
            <h1>{fieldAt(scopeSlot.blocks, 0) ?? SCOPE_QUESTION_FALLBACK[locale]}</h1>
            <PlaceSearch
              defaultValue={rawSearch}
              label={fieldAt(scopeSlot.blocks, 0) ?? ""}
              locale={locale}
              query={{ orte: orteRaw, kreis: hasCounty ? KREIS_ID : undefined }}
              to="order"
              typeahead
            />
            <div className={styles.offers}>
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
              {/* Not a selected-looking chip on an empty step: unselected, it
                  is an offer and says "+", exactly like a found place. The
                  brief read the old one as a third statement contradicting
                  the two empty ones under it. */}
              <Chip
                locale={locale}
                query={{ orte: orteRaw, kreis: hasCounty ? undefined : KREIS_ID }}
                selected={hasCounty}
                to="order"
              >
                {hasCounty ? COUNTY_LABEL[locale] : ADD_COUNTY[locale](COUNTY_LABEL[locale])}
              </Chip>
            </div>
            <ScopePicker items={chips} locale={locale} to="order" />
            {/* Always here, so the way on is never something a visitor has to
                discover. Disabled, it says what would make it pressable. */}
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
            ) : (
              <>
                <Button describedBy="scope-required" disabled onward>
                  {CONTINUE_LABEL[locale]}
                </Button>
                <p className={styles.requirement} id="scope-required">
                  {SCOPE_REQUIRED[locale]}
                </p>
              </>
            )}
            <div className={styles.exit}>{briefingExit}</div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1>{fieldAt(invoiceSlot.blocks, 0)}</h1>
            {/* Above the form, not under the advance: it is context for the
                step ("your scope survived, the invoice details did not"),
                and under the button it read as a note about pressing it. */}
            <p className={styles.reloadNote}>{fieldAt(invoiceSlot.blocks, 2)}</p>
            {/* One call to action on this step (F-2-51). The invoice form
                stands inside a flow, so the step owns the advance and the
                form does not render a submit of its own: until round 3 the
                mount's inert "Absenden" stood beside "Weiter", and the button
                a visitor filling in invoice details reaches for was the one
                that did nothing at all. */}
            {/* One call to action on this step (F-2-51) — and since the
                polish pass it is the **form's own** submit rather than a link
                standing beside it. The link advanced whether the invoice was
                filled in or not: a public authority could place an order with
                nothing in it. Now the step's one control validates the four
                required fields first, in the page's language, and navigates
                only when they are answered. The pending word stays on the
                control the visitor pressed (F-2-67). */}
            <EnvoyFormMount
              advanceHref={advanceHref}
              // TS-WEB-0016-A14 / TS-WEB-0025-A14: the fallback's own third
              // line is the consult exit into this route's contact section,
              // so the degraded slot carries the booking way forward itself
              // rather than borrowing the step's exit below it. Same shape as
              // `/deine-region/angebot` — an in-page target, never a second
              // occurrence of the appointment URL (A5).
              briefingHref={briefingHref}
              briefingLabel={briefingLabel}
              context={{ scope: orte.join(",") || KREIS_ID }}
              fallbackEmail={CONTACT_EMAIL}
              kind="order-invoice"
              locale={locale}
              pendingLabel={PENDING_LABEL[locale]}
              sourceRoute={ROUTE}
              state="mocked"
              submitDataCta="primary"
              submitLabel={CONTINUE_LABEL[locale]}
            />
            <div className={styles.exit}>{briefingExit}</div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h1>{fieldAt(codeSlot.blocks, 0)}</h1>
            {/* The flow has to end on something that reads finished, not on a
                fourth screen that looks like a fifth is coming. */}
            <p className={styles.done}>{DONE_NOTE[locale]}</p>
            <CodeSnippet code={demoCode} note={fieldAt(codeSlot.blocks, 1)} state="mocked" />
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
            <div className={styles.exit}>{briefingExit}</div>
          </>
        ) : null}
      </SectionShell>

      {step === 4 ? (
        // TS-WEB-0011-A4 (F-2-41): an `aside`, like every other band — this page
        // renders its own because TS-WEB-0025 places it after step 4 only.
        <SectionShell as="aside" id="context-band" label={contextBandHeading} surface="surface">
          <ContextBand currentJob={jobLabelKey(pageMeta.focusJob)} heading={contextBandHeading} locale={locale} />
        </SectionShell>
      ) : null}
    </>
  );
}
