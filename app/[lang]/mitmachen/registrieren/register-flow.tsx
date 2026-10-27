"use client";

/**
 * TS-WEB-0023's three steps and the handover, chosen in the browser since
 * DEC-0163.
 *
 * Every step is still a plain GET navigation on the same route (D4): the
 * state is `?ort=&wer=&weg=`, re-validated on every load — now by this
 * component, from the URL, against the same validators (`readPlaceParameter`,
 * `resolveEnum`, `resolveDisplayedStep`) and the same place resolver
 * (`resolveRegisterPlace`, asked through `/api/places/resolve`). The page's
 * HTML is step 1 with no answer — what a visitor arriving from the menu sees —
 * and one prerendered document serves every step, so no step is a
 * per-request render whose flight payload a build-time CSP hash could not
 * cover (#59).
 *
 * TS-WEB-0023-A13 ("every step is completable with JavaScript disabled") is
 * superseded by DEC-0163 §4: without JavaScript the route is step 1, and its
 * plain form still submits.
 */

import { Button } from "@/src/components/button/button";
import { ChoiceGroup } from "@/src/components/choice-group/choice-group";
import { ConversionTracker } from "@/src/components/conversion-tracker/conversion-tracker";
import { EmptyStateBlock } from "@/src/components/empty-state-block/empty-state-block";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { suggestionLabel } from "@/src/components/place-search/suggestion-row";
import { RouteLink } from "@/src/components/route-link/route-link";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { StepIndicator } from "@/src/components/step-indicator/step-indicator";
import { appendCampaignParams, extractCampaignParams } from "@/src/lib/analytics/attribution";
import { APP_ORIGIN } from "@/src/lib/live/app-handover";
import { readPlaceParameter } from "@/src/lib/pages/place-parameter";
import { usePlaceResolution } from "@/src/lib/pages/place-state";
import { useQuery } from "@/src/lib/pages/query-store";

import { resolveDisplayedStep, resolveEnum } from "./steps";

import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

/** The ids the `weg` step's three options carry (D3). */
const WEG_IDS = ["whatsapp", "calendar-connection", "website-import"] as const;

export interface RegisterCopy {
  readonly locale: Locale;
  readonly ortQuestion: string;
  readonly ortPlaceholder?: string;
  readonly stepOneReassurance: string;
  readonly werQuestion: string;
  readonly werOptions: readonly string[];
  readonly wegQuestion: string;
  readonly wegOptions: readonly string[];
  /** `{n}` is the step. */
  readonly stepIndicatorLabel: string;
  readonly handoverHeading: string;
  readonly handoverCta: string;
  readonly handoverNote?: string;
  readonly continueLabel: string;
  readonly answeredPlaceLabel: string;
  readonly answeredPlaceChange: string;
  /** The founding page's placeless acknowledgment — F-3-14's not-found answer. */
  readonly notFoundHeadline: string;
  readonly notFoundLead?: string;
  readonly notFoundCtaLabel: string;
}

function first(query: URLSearchParams | null, name: string): string | undefined {
  return query?.get(name) ?? undefined;
}

export function RegisterFlow({
  copy,
  contextBand,
}: {
  readonly copy: RegisterCopy;
  /** D7: the context band, rendered on step 1 only. */
  readonly contextBand: ReactNode;
}) {
  const { locale } = copy;
  const query = useQuery();

  // F-2-38: the raw value goes through the D4 validator before anything on
  // this page touches it — the 80-character cap and the character allowlist.
  const rawOrt = query === null ? undefined : readPlaceParameter(query.getAll("ort"));
  const resolution = usePlaceResolution(rawOrt);
  const lookup =
    resolution === undefined || resolution === "pending" ? ({ kind: "unresolved" } as const) : resolution.lookup;

  /**
   * F-3-14 — step 1 answers a search that found nothing. The heading names no
   * place (TS-WEB-0023-A5) and the value travels in the CTA's URL, to the one
   * page TS-WEB-0021 D6 does let it name.
   */
  const searchSubmitted = query?.has("ort") ?? false;
  const placeNotFound = searchSubmitted && resolution !== "pending" && lookup.kind === "unresolved";

  const resolvedOrt = lookup.kind === "resolved" ? lookup.place.slug : undefined;
  const answeredPlace = lookup.kind === "resolved" ? lookup.place.name : undefined;

  const werOptions = copy.werOptions.map((label, index) => ({ value: `opt-${index + 1}`, label }));
  const wegOptions = copy.wegOptions.map((label, index) => ({ value: WEG_IDS[index] ?? `opt-${index + 1}`, label }));
  const resolvedWer = resolveEnum(first(query, "wer"), new Set(werOptions.map((option) => option.value)));
  const resolvedWeg = resolveEnum(first(query, "weg"), new Set(wegOptions.map((option) => option.value)));

  const answers = { ort: resolvedOrt, wer: resolvedWer, weg: resolvedWeg };
  const step = resolveDisplayedStep(answers, first(query, "schritt"));

  const campaign = query === null ? {} : extractCampaignParams(query);
  const handoverUrl = appendCampaignParams(new URL("/registrieren", APP_ORIGIN).toString(), campaign);
  const carried = campaign as Record<string, string | undefined>;

  return (
    <>
      <SectionShell surface="paper">
      {/* The progress row stands on the handover too, complete. */}
      <StepIndicator
        complete={step === "handover"}
        label={copy.stepIndicatorLabel.replace("{n}", String(step === "handover" ? 3 : step))}
        locale={locale}
        step={step === "handover" ? 3 : step}
        total={3}
      />

      {step === 1 ? (
        <>
          <h1>{copy.ortQuestion}</h1>
          <p data-step-reassurance="">{copy.stepOneReassurance}</p>
          <PlaceSearch
            defaultValue={rawOrt}
            key={rawOrt ?? ""}
            label={copy.ortQuestion}
            locale={locale}
            placeholder={copy.ortPlaceholder}
            query={carried}
            required
            // `mocked` marks *demo* data; the candidate rows come from the
            // committed community index, which is real.
            state={lookup.kind === "ambiguous" && lookup.demo ? "mocked" : "ready"}
            // A1: exactly one `primary` per rendered state, and on step 1 the
            // search *is* the advance (DEC-0082's ladder, DEC-0128).
            submitDataCta="primary"
            submitLabel={copy.continueLabel}
            submitOnward
            typeahead
            suggestions={
              lookup.kind === "ambiguous"
                ? lookup.candidates.map((candidate) => ({
                    label: suggestionLabel(candidate),
                    to: "register" as const,
                    query: { ...carried, ort: candidate.slug },
                  }))
                : undefined
            }
            to="register"
          />
          {placeNotFound ? (
            <div data-place-not-found="">
              <EmptyStateBlock
                announced
                cta={
                  <Button locale={locale} onward query={{ ...carried, ort: rawOrt }} to="placeStart" variant="primary-light">
                    {copy.notFoundCtaLabel}
                  </Button>
                }
                headline={copy.notFoundHeadline}
                lead={copy.notFoundLead}
              />
            </div>
          ) : null}
        </>
      ) : null}

      {/* D5: an answered step stays on screen, named and changeable (F-2-62). */}
      {step !== 1 && answeredPlace !== undefined ? (
        <p data-step-answered="ort">
          {copy.answeredPlaceLabel}: <strong>{answeredPlace}</strong>{" "}
          <RouteLink locale={locale} query={{ ...carried, ort: resolvedOrt, schritt: 1 }} to="register">
            {copy.answeredPlaceChange}
          </RouteLink>
        </p>
      ) : null}

      {step === 2 ? (
        <>
          <h1>{copy.werQuestion}</h1>
          <ChoiceGroup
            legend={copy.werQuestion}
            locale={locale}
            name="wer"
            options={werOptions}
            query={{ ...carried, ort: resolvedOrt }}
            state="mocked"
            submitLabel={copy.continueLabel}
            to="register"
          />
        </>
      ) : null}

      {step === 3 ? (
        <>
          <h1>{copy.wegQuestion}</h1>
          <ChoiceGroup
            legend={copy.wegQuestion}
            locale={locale}
            name="weg"
            options={wegOptions}
            query={{ ...carried, ort: resolvedOrt, wer: resolvedWer }}
            submitLabel={copy.continueLabel}
            to="register"
          />
        </>
      ) : null}

      {step === "handover" ? (
        <>
          <h1>{copy.handoverHeading}</h1>
          <ConversionTracker goalId="register-as-publisher" stage="handover">
            <Button dataCta="primary" href={handoverUrl} locale={locale} onward>
              {copy.handoverCta}
            </Button>
          </ConversionTracker>
          <p>{copy.handoverNote}</p>
        </>
      ) : null}
      </SectionShell>

      {/* D7: the context band renders on step 1 only — a mid-flow exit offer
          costs the conversion the page exists for. */}
      {step === 1 ? contextBand : null}
    </>
  );
}
