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
import { resolveLocale } from "@/src/lib/i18n/locales";
import { APP_ORIGIN } from "@/src/lib/live/app-handover";
import { jobLabelKey } from "@/src/lib/pages/page-meta";
import { pageMetadata } from "@/src/lib/routes/metadata";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom } from "../../_locale";
import { SiteChrome } from "../../_page-frame";

import { pageMeta } from "./page.meta";
import { resolveRegisterPlace } from "./resolve-place";
import { resolveDisplayedStep, resolveEnum } from "./steps";

import type { ContentBlock } from "@/src/lib/content/types";
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
  return pageMetadata(ROUTE, resolveLocale((await params).lang));
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

  const rawOrt = firstParam(rawQuery.ort);
  const lookup = await resolveRegisterPlace(rawOrt);
  const resolvedOrt = lookup.kind === "resolved" ? lookup.place.slug : undefined;

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
