"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";

import { ConversionTracker } from "../conversion-tracker/conversion-tracker";
import { LocateControl } from "../place-search/locate-control";
import { OutboundLink } from "../outbound-link/outbound-link";
import { PhotoCredit } from "../photo-surface/photo-credit";
import { SearchSubmit } from "../search-field/search-field";
import { SectionShell } from "../section-shell/section-shell";

import { DorfkalenderPhone } from "./dorfkalender-phone";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { calendarUrl } from "@/src/lib/live/app-handover";
import { fetchJson, liveRoutes, useLive } from "@/src/lib/live/browser";
import { legendLabels, pickRows } from "@/src/lib/live/dorfkalender";
import { EXAMPLE_PLACE, useActivePlace } from "@/src/lib/pages/active-place";
import { fillTemplate } from "@/src/lib/pages/demo-content";
import { MAX_PLACE_LENGTH } from "@/src/lib/pages/place-parameter";

import type { PlaceResolution } from "@/app/api/places/resolve/route";
import type { Locale } from "@/src/lib/i18n/locales";
import type { NearbyEvents, Place, PlaceEvents, PlacePhoto } from "@/src/lib/live/types";
import type { ReactNode } from "react";

import styles from "./dorfkalender-intro.module.css";

/**
 * What the phone shows before a place is chosen: the configured showcase
 * community and its municipality, which the example place itself does not carry.
 */
const DEFAULT_PLACE: Place = { ...EXAMPLE_PLACE, municipality: "Schmatzin" };

/** `Melkerschule Schlatkow.jpg` → `Melkerschule Schlatkow` — the work's title in the credit. */
function titleOf(fileName: string): string {
  return fileName.replace(/\.[a-z0-9]{2,5}$/iu, "");
}

export interface DorfkalenderIntroProps {
  readonly locale: Locale;
}

/**
 * "Dein digitaler Dorfkalender." — the black explanation section under the
 * home stage (issue issue 143, DEC-0192). It replaces the former "Das ist los in …"
 * section and takes over the place search the stage used to carry.
 *
 * Which place the phone shows, in order: the place a visitor searched for or
 * located **in this section**; else the page's chosen place (`?ort=`, the same
 * one the stage speaks about); else the showcase community. Searching here
 * changes this section only — the page does not navigate and the stage stays as
 * it is. Nothing asks the browser for its position on load: the permission
 * prompt belongs to the click on the locate button (TS-WEB-0010 D5).
 *
 * A search that finds no covered place leaves the phone as it was — no error
 * sentence, as everywhere a live answer may be absent (`browser.ts`).
 */
export function DorfkalenderIntro({ locale }: DorfkalenderIntroProps) {
  const words = dictionary(locale);
  const text = words.dorfkalender;
  const active = useActivePlace();
  const [searched, setSearched] = useState<Place | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);
  const fieldId = useId();
  /** Each search is a generation; an answer for an older one is dropped. */
  const generation = useRef(0);

  const place = searched ?? (active.kind === "chosen" ? active.place : DEFAULT_PLACE);

  const own = useLive<PlaceEvents>(liveRoutes.placeEvents(place.slug, 12));
  const near = useLive<NearbyEvents>(liveRoutes.nearby(place.lat, place.lng));
  const photo = useLive<PlacePhoto>(liveRoutes.placePhoto(place.slug));

  const rows = useMemo(
    () =>
      pickRows({
        own: own.status === "ready" ? own.envelope.data.events : [],
        nearby: near.status === "ready" ? near.envelope.data.events : [],
        communityId: place.communityId,
        placeName: place.name,
        defaults: text.defaults,
        locale,
      }),
    [own, near, place.communityId, place.name, text.defaults, locale],
  );

  /**
   * A typed name or the locate button's slug → the place, through the one
   * resolver the stage's search uses. An answer that is not a covered place
   * changes nothing.
   */
  const load = useCallback((value: string) => {
    const query = value.trim();
    if (query === "") return;
    const mine = ++generation.current;
    void fetchJson<PlaceResolution>(liveRoutes.resolvePlace(query)).then((resolution) => {
      if (mine !== generation.current) return;
      const outcome = resolution?.outcome;
      if (outcome?.kind === "covered") setSearched(outcome.place);
    });
  }, []);

  const commune =
    place.municipality !== undefined && place.municipality !== "" && place.municipality !== place.name
      ? fillTemplate(text.municipalityTemplate, { name: place.municipality })
      : place.county?.name;

  const calendar = calendarUrl(place);

  const credit: ReactNode =
    photo.status === "ready" ? (
      <PhotoCredit locale={locale}>
        <p>
          {words.photoCredit.lead}:{" "}
          <OutboundLink href={photo.envelope.data.sourceUrl} locale={locale} variant="inline">
            {titleOf(photo.envelope.data.fileName)}
          </OutboundLink>
          {photo.envelope.data.author ? ` – ${photo.envelope.data.author}` : ""}, {photo.envelope.data.licence},{" "}
          {words.placePhoto.via}
        </p>
      </PhotoCredit>
    ) : undefined;

  const demo = (own.status === "ready" && own.envelope.demo) || (near.status === "ready" && near.envelope.demo);

  return (
    <SectionShell
      className={styles.shell}
      contained={false}
      dataBlock="dorfkalender"
      id="dorfkalender"
      labelledBy="dorfkalender-heading"
      surface="ink"
    >
      <div className={styles.wrap}>
        <div className={styles.inner}>
          <div className={styles.text}>
            <div className={styles.mid}>
              <h2 className={styles.title} id="dorfkalender-heading">
                <span className={styles.titleLine}>{text.titleLead}</span>{" "}
                <span className={`${styles.titleLine} ${styles.accent}`}>{text.titleAccent}</span>
              </h2>
              <p className={styles.sentence}>{text.sentence}</p>
              <form
                className={styles.pill}
                onSubmit={(event) => {
                  event.preventDefault();
                  load(input.current?.value ?? "");
                }}
                role="search"
              >
                <label className={styles.label} htmlFor={fieldId}>
                  {text.searchLabel}
                </label>
                <LocateControl iconOnly locale={locale} onPlace={load} to="place" />
                <input
                  autoComplete="off"
                  className={styles.input}
                  enterKeyHint="search"
                  id={fieldId}
                  maxLength={MAX_PLACE_LENGTH}
                  name="ort"
                  placeholder={text.placeholder}
                  ref={input}
                  spellCheck={false}
                  type="search"
                />
                {/* TS-WEB-0006 D3 allows one `data-cta="primary"` per page: in S1
                    it is a search submit, as it was on the stage; once a place is
                    chosen the hero's own CTA carries it (TS-WEB-0019 D2). */}
                <SearchSubmit dataCta={active.kind === "chosen" ? undefined : "primary"} label={text.submit} />
              </form>
            </div>
            {calendar === undefined ? null : (
              <p className={styles.calendarLink}>
                {/* TS-WEB-0012 D4: the click that opens a place calendar is the
                    `save-calendar-to-homescreen` handover — and in S1 this is the
                    page's only such link. */}
                <ConversionTracker
                  attributes={{ route: "home", place: place.slug }}
                  goalId="save-calendar-to-homescreen"
                  stage="handover"
                >
                  <OutboundLink href={calendar} locale={locale} variant="inline">
                    {fillTemplate(text.linkTemplate, { place: place.name })}
                  </OutboundLink>
                </ConversionTracker>
              </p>
            )}
          </div>
          <DorfkalenderPhone
            commune={commune}
            credit={credit}
            demo={demo}
            imageLabel={fillTemplate(text.imageLabelTemplate, { place: place.name })}
            legend={legendLabels(locale, text)}
            photoSrc={photo.status === "ready" ? photo.envelope.data.src : undefined}
            placeName={place.name}
            rows={rows}
          />
        </div>
      </div>
    </SectionShell>
  );
}
