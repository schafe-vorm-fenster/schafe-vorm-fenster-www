import { ContextBand } from "@/src/components/context-band/context-band";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { jobLabelKey } from "@/src/lib/pages/page-meta";
import { formatPriceFigure } from "@/src/components/price-tag/format";
import { offeringPrice } from "@/src/lib/pricing/offerings";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom, pageMetadataFor } from "../../_locale";

import { OrderFlow } from "./order-flow";
import { pageMeta } from "./page.meta";

import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0025 — `/dein-kalender/bestellen`, the order flow.
 *
 * One route, `schritt=1..4` (D2), one static document since DEC-0163 — the
 * step is chosen in the browser (`order-flow.tsx`). Steps 1/2 share a screen (scope), 3 is the
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
const CONTACT_EMAIL = "jan@schafe-vorm-fenster.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const base = await pageMetadataFor(ROUTE, params);
  return { ...base, robots: { index: false, follow: true } };
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

/** One place is not "1 Orte" — the strip reads a count, so it has to count. `{n}` is the count. */
const SELECTED_COUNT: Record<Locale, { readonly one: string; readonly many: string }> = {
  de: { one: "1 Ort ausgewählt", many: "{n} Orte ausgewählt" },
  en: { one: "1 place selected", many: "{n} places selected" },
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

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);
  const home = await pageContent("home", locale);
  const contextBandHeading = fieldAt(slot(home, "home-10-context-band").blocks, 0);

  const scopeSlot = slot(page, "bestellen-1-scope");
  const briefingSlot = slot(page, "bestellen-2-briefing-exit");
  const invoiceSlot = slot(page, "bestellen-3-invoice");
  const codeSlot = slot(page, "bestellen-4-embed-code");

  /**
   * 480 € per year, net — read from the offering package like every other
   * price on the site (TS-WEB-0006 D10), never typed into the flow.
   */
  const priceFigure = offeringPrice("portalize-calendar", locale).figure;

  // The id shape the CRM really issues, so the snippet a visitor copies in
  // the prototype looks exactly like the one she will be sent (Q-0046,
  // `state/open.md` row 2). The block itself carries `data-demo="true"`.
  const demoCode =
    '<script defer src="https://portalize.schafe-vorm-fenster.de/api/65f3a9c1d4e27b0912af4c38/load.js"></script>\n<div data-portalize-organizer-id="65f3a9c1d4e27b0912af4c38"></div>';

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
      <OrderFlow
        contextBand={
          // TS-WEB-0011-A4 (F-2-41): an `aside`, like every other band — this
          // page renders its own because TS-WEB-0025 places it after step 4 only.
          <SectionShell as="aside" id="context-band" label={contextBandHeading} surface="surface">
            <ContextBand currentJob={jobLabelKey(pageMeta.focusJob)} heading={contextBandHeading} locale={locale} />
          </SectionShell>
        }
        copy={{
          locale,
          scopeQuestion: fieldAt(scopeSlot.blocks, 0) ?? SCOPE_QUESTION_FALLBACK[locale],
          scopeLabel: fieldAt(scopeSlot.blocks, 0) ?? "",
          countyLabel: COUNTY_LABEL[locale],
          countyChipLabel: COUNTY_CHIP_LABEL[locale],
          addCountyLabel: ADD_COUNTY[locale](COUNTY_LABEL[locale]),
          selectedOne: SELECTED_COUNT[locale].one,
          selectedMany: SELECTED_COUNT[locale].many,
          continueLabel: CONTINUE_LABEL[locale],
          scopeRequired: SCOPE_REQUIRED[locale],
          priceLine: priceFigure ? formatPriceFigure(priceFigure, locale) : "",
          priceNote: PRICE_NOTE[locale],
          doneNote: DONE_NOTE[locale],
          pendingLabel: PENDING_LABEL[locale],
          briefingLabel: fieldAt(briefingSlot.blocks, 0) ?? "",
          invoiceHeading: fieldAt(invoiceSlot.blocks, 0),
          invoiceReloadNote: fieldAt(invoiceSlot.blocks, 2),
          codeHeading: fieldAt(codeSlot.blocks, 0),
          codeNote: fieldAt(codeSlot.blocks, 1),
          demoCode,
          contactEmail: CONTACT_EMAIL,
        }}
      />
    </>
  );
}
