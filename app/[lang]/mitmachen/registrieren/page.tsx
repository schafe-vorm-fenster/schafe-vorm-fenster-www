import { Button } from "@/src/components/button/button";
import { ChoiceGroup } from "@/src/components/choice-group/choice-group";
import { ContextBand } from "@/src/components/context-band/context-band";
import { ConversionTracker } from "@/src/components/conversion-tracker/conversion-tracker";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { StepIndicator } from "@/src/components/step-indicator/step-indicator";
import { appendCampaignParams, extractCampaignParams } from "@/src/lib/analytics";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { APP_ORIGIN } from "@/src/lib/live/app-handover";
import { jobLabelKey } from "@/src/lib/pages/page-meta";
import { readPlaceParameter } from "@/src/lib/pages/place-parameter";
import { RouteLink } from "@/src/components/route-link/route-link";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom, pageMetadataFor } from "../../_locale";
import { SiteChrome } from "../../_page-frame";

import { pageMeta } from "./page.meta";
import { resolveRegisterPlace } from "./resolve-place";
import { resolveDisplayedStep, resolveEnum } from "./steps";

import type { ContentBlock } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-023 — `/mitmachen/registrieren`, a flow, not an argument.
 *
 * Every step is a plain GET navigation on the same route (D4): the state is
 * `?ort=&wer=&weg=`, re-validated server-side on every request, never a
 * cookie or client store. `SiteChrome` (header, breadcrumb, footer) is the
 * shared frame; the context band and closing CTA are hand-rendered here,
 * not through `PageFrame`, because D7 suppresses both on steps 2 and 3 and
 * suppresses the band on the handover — a per-step rule `PageFrame` has no
 * hook for (open point: `PageFrame`'s `meta`-driven band/CTA has no step
 * parameter; flagged for the chrome work package).
 */

const ROUTE = "register" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadataFor(ROUTE, params);
}

function listItems(blocks: readonly ContentBlock[]): string[] {
  return blocks.flatMap((block) => (block.kind === "list" ? block.items : []));
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const WEG_IDS = ["whatsapp", "calendar-connection", "website-import"] as const;

const HANDOVER_HEADING = { de: "Fast geschafft", en: "Almost there" } as const;

/**
 * The answered-step line of D5 — "a prefilled step renders **answered,
 * visible and changeable**, never skipped: the visitor sees which place she
 * is registering before handover" (F-2-62).
 *
 * Generated copy, in the tone of voice, with a `Dummy-Content` row in
 * `state/open.md`: the artifact writes the three questions and the handover,
 * not the summary line the flow needs to keep an answer on screen.
 */
const ANSWERED_PLACE: Record<Locale, { label: string; change: string }> = {
  de: { label: "Dein Ort", change: "Ort ändern" },
  en: { label: "Your place", change: "Change place" },
};

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
  const rawQuery = await searchParams;
  const page = await pageContent(ROUTE, locale);

  const ortSlot = slot(page, "registrieren-1-ort");
  const werSlot = slot(page, "registrieren-2-wer");
  const wegSlot = slot(page, "registrieren-3-weg");
  const stepIndicatorSlot = slot(page, "registrieren-4-step-indicator");
  const handoverSlot = slot(page, "registrieren-5-handover");

  // F-2-38: the raw value goes through the D4 validator before anything on
  // this page touches it — the 80-character cap and the character allowlist
  // are `place-parameter.ts`'s, and every flow step gets them.
  const rawOrt = readPlaceParameter(rawQuery.ort);
  const lookup = await resolveRegisterPlace(rawOrt);
  const resolvedOrt = lookup.kind === "resolved" ? lookup.place.slug : undefined;
  const answeredPlace = lookup.kind === "resolved" ? lookup.place.name : undefined;

  const werOptions = listItems(werSlot.blocks).map((label, index) => ({
    value: `opt-${index + 1}`,
    label,
  }));
  const wegOptions = listItems(wegSlot.blocks).map((label, index) => ({
    value: WEG_IDS[index],
    label,
  }));

  const resolvedWer = resolveEnum(
    firstParam(rawQuery.wer),
    new Set(werOptions.map((option) => option.value)),
  );
  const resolvedWeg = resolveEnum(
    firstParam(rawQuery.weg),
    new Set(wegOptions.map((option) => option.value)),
  );

  const answers = { ort: resolvedOrt, wer: resolvedWer, weg: resolvedWeg };
  const step = resolveDisplayedStep(answers, firstParam(rawQuery.schritt));

  const campaign = extractCampaignParams(new URLSearchParams(asStringRecord(rawQuery)));
  const handoverUrl = appendCampaignParams(new URL("/registrieren", APP_ORIGIN).toString(), campaign);
  const carried = campaign as Record<string, string | undefined>;

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <SiteChrome locale={locale} route={ROUTE}>
      <SectionShell surface="paper">
        {step !== "handover" ? (
          <StepIndicator
            label={(fieldAt(stepIndicatorSlot.blocks, 0) ?? "").replace("{n}", String(step))}
            step={step}
            total={3}
          />
        ) : null}

        {step === 1 ? (
          <>
            <h1>{fieldAt(ortSlot.blocks, 0)}</h1>
            <PlaceSearch
              defaultValue={rawOrt}
              label={fieldAt(ortSlot.blocks, 0) ?? ""}
              locale={locale}
              query={carried}
              state={lookup.kind === "ambiguous" ? "mocked" : "ready"}
              suggestions={
                lookup.kind === "ambiguous"
                  ? lookup.candidates.map((candidate) => ({
                      label: candidate.name,
                      to: "register" as const,
                      query: { ...carried, ort: candidate.slug },
                    }))
                  : undefined
              }
              to="register"
            />
          </>
        ) : null}

        {/* D5: an answered step stays on screen, named and changeable — a
            visitor who mistyped her postcode on the previous page has to be
            able to see and correct which place she is registering (F-2-62).
            `schritt=1` is the backwards move D4 permits, and it carries the
            answer with it so the field arrives filled rather than blank. */}
        {step !== 1 && answeredPlace !== undefined ? (
          <p data-step-answered="ort">
            {ANSWERED_PLACE[locale].label}: <strong>{answeredPlace}</strong>{" "}
            <RouteLink
              locale={locale}
              query={{ ...carried, ort: resolvedOrt, schritt: 1 }}
              to="register"
            >
              {ANSWERED_PLACE[locale].change}
            </RouteLink>
          </p>
        ) : null}

        {step === 2 ? (
          <>
            <h1>{fieldAt(werSlot.blocks, 0)}</h1>
            <ChoiceGroup
              legend={fieldAt(werSlot.blocks, 0) ?? ""}
              locale={locale}
              name="wer"
              options={werOptions}
              query={{ ...carried, ort: resolvedOrt }}
              state="mocked"
              to="register"
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1>{fieldAt(wegSlot.blocks, 0)}</h1>
            <ChoiceGroup
              legend={fieldAt(wegSlot.blocks, 0) ?? ""}
              locale={locale}
              name="weg"
              options={wegOptions}
              query={{ ...carried, ort: resolvedOrt, wer: resolvedWer }}
              to="register"
            />
          </>
        ) : null}

        {step === "handover" ? (
          <>
            <h1>{HANDOVER_HEADING[locale]}</h1>
            <ConversionTracker goalId="register-as-publisher" stage="handover">
              <Button dataCta="primary" href={handoverUrl} onward>
                {fieldAt(handoverSlot.blocks, 0)}
              </Button>
            </ConversionTracker>
            <p>{fieldAt(handoverSlot.blocks, 1)}</p>
          </>
        ) : null}
      </SectionShell>

      {/* D7: the context band renders on step 1 only, suppressed on steps
          2/3 and the handover — a mid-flow exit offer costs the conversion
          the page exists for. */}
      {step === 1 ? (
        <SectionShell id="context-band" surface="surface">
          <ContextBand currentJob={jobLabelKey(pageMeta.focusJob)} locale={locale} />
        </SectionShell>
      ) : null}
    </SiteChrome>
    </>
  );
}

/** `URLSearchParams` wants string values; a repeated param's first value stands in. */
function asStringRecord(
  query: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    const first = firstParam(value);
    if (first !== undefined) out[key] = first;
  }
  return out;
}
