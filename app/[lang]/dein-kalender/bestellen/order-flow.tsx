"use client";

/**
 * TS-WEB-0025's four steps, chosen in the browser since DEC-0163.
 *
 * One route, `schritt=1..4` (D2), the scope in the URL (`orte`, `kreis`, D8).
 * The page's HTML is step 1 with no scope; this component reads the query
 * after hydration, validates it with the same helpers the server page used
 * (`parseOrte`, `resolveOrderStep`, `readPlaceParameter`) and resolves the
 * place slugs through `/api/places/resolve` — the same `resolveRegisterPlace`
 * the page ran per request until #59 made that a CSP failure.
 *
 * The step-3 no-JavaScript advance (a plain form) is superseded by DEC-0163 §4.
 */

import { useEffect, useState } from "react";

import { Button } from "@/src/components/button/button";
import { Chip } from "@/src/components/chip/chip";
import { CodeSnippet } from "@/src/components/code-snippet/code-snippet";
import { CONTACT_SECTION_ID } from "@/src/components/contact-section/contact-section";
import { FireConversionOnMount } from "@/src/components/conversion-tracker/conversion-tracker";
import { EnvoyFormMount } from "@/src/components/envoy-form-mount/envoy-form-mount";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { linkHref } from "@/src/components/route-link/href";
import { ScopePicker, type ScopeChip } from "@/src/components/scope-picker/scope-picker";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { StepIndicator } from "@/src/components/step-indicator/step-indicator";
import { fetchJson, liveRoutes } from "@/src/lib/live/browser";
import { readPlaceParameter } from "@/src/lib/pages/place-parameter";
import { usePlaceResolution } from "@/src/lib/pages/place-state";
import { useQuery } from "@/src/lib/pages/query-store";

import { consultExitHref, consultExitQuery } from "./consult-exit";
import { addPlace, parseOrte, removePlace, resolveOrderStep } from "./steps";

import styles from "./page.module.css";

import type { PlaceResolution } from "@/app/api/places/resolve/route";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Place } from "@/src/lib/live/types";
import type { ReactNode } from "react";

const ROUTE = "order" as const;
const KREIS_ID = "vorpommern-greifswald";
const STEP_TOTAL = 4;

export interface OrderCopy {
  readonly locale: Locale;
  readonly scopeQuestion: string;
  readonly scopeLabel: string;
  readonly countyLabel: string;
  readonly countyChipLabel: string;
  readonly addCountyLabel: string;
  readonly selectedOne: string;
  /** `{n}` is the count. */
  readonly selectedMany: string;
  readonly continueLabel: string;
  readonly scopeRequired: string;
  readonly priceLine: string;
  readonly priceNote: string;
  readonly doneNote: string;
  readonly pendingLabel: string;
  readonly briefingLabel: string;
  readonly invoiceHeading?: string;
  readonly invoiceReloadNote?: string;
  readonly codeHeading?: string;
  readonly codeNote?: string;
  readonly demoCode: string;
  readonly contactEmail: string;
}

/**
 * The places behind `orte`, each through the shared resolver; unresolvable
 * slugs drop out. `undefined` while they are being resolved.
 */
function useResolvedPlaces(slugs: readonly string[]): readonly Place[] | undefined {
  const key = slugs.join(",");
  const [settled, setSettled] = useState<{ readonly key: string; readonly places: readonly Place[] }>({
    key: "",
    places: [],
  });
  useEffect(() => {
    if (key === "") return;
    let current = true;
    void Promise.all(
      key.split(",").map((slug) => fetchJson<PlaceResolution>(liveRoutes.resolvePlace(slug))),
    ).then((answers) => {
      if (!current) return;
      const places = answers.flatMap((answer) =>
        answer?.lookup.kind === "resolved" ? [answer.lookup.place] : [],
      );
      setSettled({ key, places });
    });
    return () => {
      current = false;
    };
  }, [key]);
  if (key === "") return [];
  return settled.key === key ? settled.places : undefined;
}

export function OrderFlow({
  copy,
  contextBand,
}: {
  readonly copy: OrderCopy;
  /** Rendered once, after step 4 only (component-inventory §TS-WEB-0025). */
  readonly contextBand: ReactNode;
}) {
  const { locale } = copy;
  const query = useQuery();
  const first = (name: string) => query?.get(name) ?? undefined;

  const orteRaw = first("orte");
  const orte = parseOrte(orteRaw);
  const hasCounty = first("kreis") === KREIS_ID;
  const hasScope = orte.length > 0 || hasCounty;
  const step = resolveOrderStep(hasScope, first("schritt"));

  const settledPlaces = useResolvedPlaces(orte);
  const resolvedPlaces = settledPlaces ?? [];

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
            label: copy.countyChipLabel,
            kind: "county" as const,
            removeQuery: { orte: orteRaw, kreis: undefined },
          },
        ]
      : []),
  ];

  // F-2-38: through the D4 validator first — the 80-character cap and the
  // character allowlist apply on every flow step.
  const rawSearch = query === null ? undefined : readPlaceParameter(query.getAll("ort"));
  const resolution = usePlaceResolution(rawSearch);
  const lookup = resolution !== undefined && resolution !== "pending" ? resolution.lookup : undefined;
  const addable = lookup?.kind === "resolved" && !orte.includes(lookup.place.slug) ? lookup.place : undefined;

  /** Where a valid invoice submission goes: step 4, scope carried. */
  const advanceHref = linkHref(ROUTE, {
    locale,
    query: { orte: orteRaw, kreis: hasCounty ? KREIS_ID : undefined, schritt: 4 },
  });

  /**
   * This route's contact section as an in-page target, with the flow's own
   * scope and step in the query (D8) — one builder for the exit and step 3's
   * lead fallback, so the two cannot drift apart (`consult-exit.test.ts`).
   */
  const consultScope = { orte: orteRaw, kreis: hasCounty ? KREIS_ID : undefined, step };
  const briefingHref = consultExitHref(locale, consultScope);
  /*
   * TS-WEB-0025 D5 — the consult exit on all four steps, an in-page target and
   * not an outbound link, carrying no `ConversionTracker` (TS-WEB-0025-A11).
   * G-5 / D5: an exit, never a button-sized action.
   */
  const briefingExit = (
    <Button
      dataCta="secondary"
      hash={CONTACT_SECTION_ID}
      locale={locale}
      query={consultExitQuery(consultScope)}
      size="compact"
      to={ROUTE}
      variant="quiet"
    >
      {copy.briefingLabel}
    </Button>
  );

  const count = chips.length === 0 ? "" : chips.length === 1 ? copy.selectedOne : copy.selectedMany.replace("{n}", String(chips.length));

  return (
    <>
      <SectionShell surface="paper">
        <StepIndicator complete={step === STEP_TOTAL} locale={locale} step={step} total={STEP_TOTAL} />

        {/* What this costs, on every step, with the count beside it. */}
        <p className={styles.summary}>
          <span className={styles.price}>{copy.priceLine}</span>
          {/* Silent at zero; the node stays mounted so an addition is announced. */}
          <span aria-live="polite" className={styles.count}>
            {count}
          </span>
        </p>
        <p className={styles.priceNote}>{copy.priceNote}</p>

        {step <= 2 ? (
          <>
            <h1>{copy.scopeQuestion}</h1>
            <PlaceSearch
              defaultValue={rawSearch}
              key={rawSearch ?? ""}
              label={copy.scopeLabel}
              locale={locale}
              query={{ orte: orteRaw, kreis: hasCounty ? KREIS_ID : undefined }}
              to={ROUTE}
              typeahead
            />
            <div className={styles.offers}>
              {addable ? (
                <Chip
                  locale={locale}
                  query={{ orte: addPlace(orteRaw, addable.slug), kreis: hasCounty ? KREIS_ID : undefined }}
                  to={ROUTE}
                >
                  + {addable.name}
                </Chip>
              ) : null}
              {/* Unselected, the county is an offer and says "+", exactly like a found place. */}
              <Chip
                locale={locale}
                query={{ orte: orteRaw, kreis: hasCounty ? undefined : KREIS_ID }}
                selected={hasCounty}
                to={ROUTE}
              >
                {hasCounty ? copy.countyLabel : copy.addCountyLabel}
              </Chip>
            </div>
            <ScopePicker items={chips} locale={locale} to={ROUTE} />
            {/* Always here, so the way on is never something a visitor has to discover. */}
            {hasScope ? (
              <Button
                dataCta="primary"
                locale={locale}
                onward
                query={{ orte: orteRaw, kreis: hasCounty ? KREIS_ID : undefined, schritt: 3 }}
                to={ROUTE}
              >
                {copy.continueLabel}
              </Button>
            ) : (
              <>
                <Button describedBy="scope-required" disabled onward>
                  {copy.continueLabel}
                </Button>
                <p className={styles.requirement} id="scope-required">
                  {copy.scopeRequired}
                </p>
              </>
            )}
            <div className={styles.exit}>{briefingExit}</div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1>{copy.invoiceHeading}</h1>
            <p className={styles.reloadNote}>{copy.invoiceReloadNote}</p>
            {/* One call to action on this step (F-2-51): the form's own
                submit, which validates the four required fields first and
                navigates only when they are answered (F-2-67). */}
            <EnvoyFormMount
              advanceHref={advanceHref}
              briefingHref={briefingHref}
              briefingLabel={copy.briefingLabel}
              context={{ scope: orte.join(",") || KREIS_ID }}
              fallbackEmail={copy.contactEmail}
              kind="order-invoice"
              locale={locale}
              pendingLabel={copy.pendingLabel}
              sourceRoute={ROUTE}
              state="mocked"
              submitDataCta="primary"
              submitLabel={copy.continueLabel}
            />
            <div className={styles.exit}>{briefingExit}</div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h1>{copy.codeHeading}</h1>
            <p className={styles.done}>{copy.doneNote}</p>
            <CodeSnippet code={copy.demoCode} note={copy.codeNote} state="mocked" />
            {/* F-2-60: keyed on the completed order, so Back-then-Forward
                through step 4 reports the same completion once — the
                **resolved** scope, never the raw parameter. */}
            {settledPlaces === undefined ? null : (
              <FireConversionOnMount
                attributes={{ route: ROUTE }}
                dedupeKey={`${settledPlaces.map((place) => place.slug).join(",")}|${hasCounty ? KREIS_ID : ""}`}
                goalId="buy-calendar-licence"
                stage="completed"
              />
            )}
            <div className={styles.exit}>{briefingExit}</div>
          </>
        ) : null}
      </SectionShell>

      {step === 4 ? contextBand : null}
    </>
  );
}
