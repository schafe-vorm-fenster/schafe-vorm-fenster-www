import dorf from "../generated/placeholders/ueber-uns/dorf.svg";
import portalize from "../generated/placeholders/dein-kalender/portalize.svg";
import gruender from "../generated/placeholders/ueber-uns/gruender.svg";

import { BackToTop } from "./back-to-top/back-to-top";
import { Badge } from "./badge/badge";
import { BreadcrumbTrail } from "./breadcrumb-trail/breadcrumb-trail";
import { Button } from "./button/button";
import { Chip } from "./chip/chip";
import { DemoDataBadge } from "./demo-data-badge/demo-data-badge";
import { ErrorPage } from "./error-page/error-page";
import { EventRow } from "./event-row/event-row";
import { FreshnessLabel } from "./freshness-label/freshness-label";
import { Icon } from "./icon/icon";
import { LanguageSwitch } from "./language-switch/language-switch";
import { Logo } from "./logo/logo";
import { MediaFrame } from "./media-frame/media-frame";
import { MotionReveal } from "./motion-reveal/motion-reveal";
import { OutboundLink } from "./outbound-link/outbound-link";
import { PhotoSurface } from "./photo-surface/photo-surface";
import { PlaceholderBadge } from "./placeholder-badge/placeholder-badge";
import { PlaceholderSurface } from "./placeholder-surface/placeholder-surface";
import { RouteLink } from "./route-link/route-link";
import { SearchField } from "./search-field/search-field";
import { SectionNav } from "./section-nav/section-nav";
import { SectionShell } from "./section-shell/section-shell";
import { SiteFooter } from "./site-footer/site-footer";
import { SiteHeader } from "./site-header/site-header";
import { Skeleton } from "./skeleton/skeleton";
import { SkipLink } from "./skip-link/skip-link";
import { StatusBadge } from "./status-badge/status-badge";

import type { DataState } from "./data-state";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import styles from "./gallery.module.css";

/**
 * The component gallery — every component of the M2 foundation set in every
 * state it declares, in one tree.
 *
 * It exists twice over: `gallery.test.tsx` renders it and asserts the state
 * coverage and the accessibility contracts, and `app/dev/components` renders
 * it in the browser for the visual check. It is **not** a production route —
 * the page that mounts it answers 404 on production.
 *
 * The data below is obviously fictitious, as the mock rule requires: no real
 * person, no real customer, no real-looking testimonial, and every demo place
 * is "Beispieldorf".
 */
export interface GalleryEntry {
  /** The inventory name, kebab-case, exactly as plan/component-inventory.md. */
  readonly name: string;
  readonly number: number;
  readonly section: "2.1" | "2.2" | "2.6";
  readonly demo: ReactNode;
  /** Present on every data-dependent component — all four states (D-9). */
  readonly states?: Partial<Record<DataState, ReactNode>>;
}

/** Static imports resolve to an object in Next and to a path in the test. */
function assetSrc(asset: StaticImageData | string): string {
  return typeof asset === "string" ? asset : asset.src;
}

const DEMO_EVENT = {
  date: "2026-09-12",
  title: "Sommerfest der Feuerwehr Beispieldorf",
  meta: "14:00 · Festplatz · Freiwillige Feuerwehr",
  category: "fest",
  categoryLabel: "Fest",
} as const;

export const GALLERY: readonly GalleryEntry[] = [
  // ── 2.1 Specified by the design system ────────────────────────────────
  {
    name: "button",
    number: 1,
    section: "2.1",
    demo: (
      <div className={styles.row}>
        <Button onward variant="primary-light">
          Kalender ansehen
        </Button>
        <Button onward variant="primary-dark">
          Kalender ansehen
        </Button>
        <Button variant="pulse">Kalender kaufen</Button>
        <Button variant="secondary">Mehr erfahren</Button>
        <Button onward variant="quiet">
          Alle Termine
        </Button>
        <Button size="compact" to="place" variant="primary-light">
          Als Link
        </Button>
      </div>
    ),
  },
  {
    name: "search-field",
    number: 2,
    section: "2.1",
    demo: (
      <div className={styles.onSurface}>
        <SearchField label="Ort oder Postleitzahl" to="place" />
      </div>
    ),
  },
  {
    name: "badge",
    number: 3,
    section: "2.1",
    demo: (
      <div className={styles.row}>
        <Badge tone="fest">Fest</Badge>
        <Badge tone="merchants">Handel</Badge>
        <Badge tone="culture">Kultur</Badge>
        <Badge tone="official">Amtlich</Badge>
        <Badge tone="social">Soziales</Badge>
        <Badge tone="neighbouring">Nachbarort</Badge>
        <Badge tone="accent">Akzent</Badge>
        <Badge tone="voice">Herkunft</Badge>
        <Badge tone="neutral">Neutral</Badge>
        <Badge icon="calendar-days" tone="accent">
          Kicker
        </Badge>
      </div>
    ),
  },
  {
    name: "chip",
    number: 4,
    section: "2.1",
    demo: (
      <div className={styles.row}>
        <Chip to="place">Beispieldorf</Chip>
        <Chip to="place">Nachbardorf</Chip>
        <Chip name="typ" value="presse">
          Presse
        </Chip>
        <Chip name="typ" selected value="alle">
          Alle
        </Chip>
        <Chip tone="dark">Auf dunklem Grund</Chip>
      </div>
    ),
  },
  {
    name: "event-row",
    number: 5,
    section: "2.1",
    demo: (
      <div>
        <EventRow {...DEMO_EVENT} to="place" />
        <EventRow
          category="culture"
          categoryLabel="Kultur"
          date="2026-09-13"
          meta="19:30 · Dorfkirche"
          title="Chorprobe mit offenem Ende und einem sehr langen Titel, der auf zwei Zeilen geklemmt wird"
        />
      </div>
    ),
    states: {
      loading: <EventRow {...DEMO_EVENT} state="loading" />,
      empty: <EventRow {...DEMO_EVENT} state="empty" />,
      degraded: <EventRow {...DEMO_EVENT} state="degraded" />,
      mocked: <EventRow {...DEMO_EVENT} state="mocked" />,
    },
  },
  {
    name: "photo-surface",
    number: 6,
    section: "2.1",
    demo: (
      <PhotoSurface placeholderId="ueber-uns/dorf" ratio="feature" src={assetSrc(dorf)}>
        <Badge tone="accent">Fotofläche</Badge>
        <p className={styles.photoHeadline}>Verlauf über dem Bild, Text im dunklen Teil</p>
      </PhotoSurface>
    ),
    states: {
      loading: <PhotoSurface ratio="feature" src={assetSrc(dorf)} state="loading" />,
      empty: <PhotoSurface ratio="feature" state="empty" />,
      degraded: (
        <PhotoSurface notDepicting ratio="feature" src={assetSrc(dorf)} state="degraded" />
      ),
      mocked: <PhotoSurface ratio="feature" src={assetSrc(dorf)} state="mocked" />,
    },
  },
  {
    name: "logo",
    number: 7,
    section: "2.1",
    demo: (
      <div className={styles.row}>
        <Logo />
        <Logo link={false} variant="url" />
        <Logo link={false} variant="mark" />
      </div>
    ),
  },

  // ── 2.2 Chrome and layout ─────────────────────────────────────────────
  { name: "site-header", number: 8, section: "2.2", demo: <SiteHeader current="place" /> },
  {
    name: "site-footer",
    number: 9,
    section: "2.2",
    demo: (
      <SiteFooter
        contact={<p>Kontaktfläche — der Slot für `envoy-form-mount` (M2, §2.5).</p>}
        newsletter={<p>Newsletter-Slot — in M2 ein sichtbar markierter Mock.</p>}
        route="home"
      />
    ),
  },
  {
    name: "language-switch",
    number: 10,
    section: "2.2",
    demo: <LanguageSwitch current="de" route="takePart" />,
  },
  {
    name: "breadcrumb-trail",
    number: 11,
    section: "2.2",
    demo: (
      <BreadcrumbTrail
        current="Registrieren"
        items={[
          { to: "home", label: "Start" },
          { to: "takePart", label: "Mitmachen" },
        ]}
      />
    ),
  },
  { name: "skip-link", number: 12, section: "2.2", demo: <SkipLink /> },
  {
    name: "section-shell",
    number: 13,
    section: "2.2",
    demo: (
      <>
        <SectionShell label="Beispiel paper" surface="paper">
          <p>paper · Standardrhythmus</p>
        </SectionShell>
        <SectionShell label="Beispiel lime" surface="lime-500">
          <p>lime-500 · der Versprechensgrund</p>
        </SectionShell>
        <SectionShell density="tight" label="Beispiel ink" surface="ink">
          <p>ink · der dunkle Anker, einmal pro Seite</p>
        </SectionShell>
        <SectionShell label="Beispiel violet" surface="violet-500">
          <p>violet-500 · Herkunft</p>
        </SectionShell>
      </>
    ),
  },
  {
    name: "motion-reveal",
    number: 14,
    section: "2.2",
    demo: (
      <MotionReveal>
        <p>Diese Fläche steigt beim Eintritt einmal 22 px auf und blendet ein.</p>
      </MotionReveal>
    ),
  },
  {
    name: "route-link",
    number: 15,
    section: "2.2",
    demo: (
      <p>
        <RouteLink to="calendar">Zum Kalenderangebot</RouteLink> ·{" "}
        <RouteLink current to="home">
          Aktuelle Seite
        </RouteLink>
      </p>
    ),
  },
  {
    name: "outbound-link",
    number: 16,
    section: "2.2",
    demo: (
      <p>
        <OutboundLink href="https://example.org/termin" newTab recipient="example.org">
          Original beim Veranstalter
        </OutboundLink>
      </p>
    ),
  },
  {
    name: "section-nav",
    number: 17,
    section: "2.2",
    demo: (
      <SectionNav
        current="datenschutz"
        items={[
          { id: "impressum", label: "Impressum" },
          { id: "datenschutz", label: "Datenschutz" },
          { id: "barrierefreiheit", label: "Barrierefreiheit" },
        ]}
      />
    ),
  },
  { name: "back-to-top", number: 18, section: "2.2", demo: <BackToTop /> },
  {
    name: "media-frame",
    number: 19,
    section: "2.2",
    demo: (
      <MediaFrame
        alt="Platzhaltergrafik für ein Ortsbild"
        caption="Bildunterschrift als echter Text, nie als Tooltip."
        placeholderId="ueber-uns/gruender"
        ratio="portrait"
        src={gruender}
      />
    ),
    states: {
      loading: <MediaFrame alt="" ratio="proof" state="loading" />,
      empty: <MediaFrame alt="" ratio="proof" state="empty" />,
      degraded: <MediaFrame alt="" notDepicting ratio="proof" src={portalize} state="degraded" />,
      mocked: <MediaFrame alt="" ratio="proof" src={portalize} state="mocked" />,
    },
  },
  {
    name: "icon",
    number: 20,
    section: "2.2",
    demo: (
      <div className={styles.row}>
        <Icon name="map-pin" size={18} />
        <Icon name="calendar-days" />
        <Icon name="church" size={32} />
      </div>
    ),
  },

  // ── 2.6 Placeholders, states, errors ──────────────────────────────────
  {
    name: "skeleton",
    number: 57,
    section: "2.6",
    demo: (
      <div className={styles.stack}>
        <Skeleton ratio="proof" variant="box" />
        <Skeleton lines={3} variant="text" />
        <Skeleton variant="control" />
        <Skeleton rows={3} variant="row" />
      </div>
    ),
  },
  {
    name: "placeholder-surface",
    number: 58,
    section: "2.6",
    demo: (
      <div className={styles.stack}>
        <PlaceholderSurface
          body="Schick uns ein Bild aus deinem Ort — wir zeigen es hier."
          cta={<Button variant="primary-light">Bild beitragen</Button>}
          ratio="feature"
        />
        <PlaceholderSurface variant="row" />
      </div>
    ),
  },
  { name: "placeholder-badge", number: 59, section: "2.6", demo: <PlaceholderBadge /> },
  { name: "demo-data-badge", number: 60, section: "2.6", demo: <DemoDataBadge /> },
  {
    name: "freshness-label",
    number: 61,
    section: "2.6",
    demo: (
      <div className={styles.stack}>
        <FreshnessLabel tier="fresh" />
        <FreshnessLabel tier="stale" updatedAt="2026-09-11T08:15:00Z" />
        <FreshnessLabel tier="snapshot" />
      </div>
    ),
  },
  {
    name: "status-badge",
    number: 62,
    section: "2.6",
    demo: (
      <div className={styles.row}>
        <StatusBadge availability="alpha" />
        <StatusBadge availability="beta" />
        <StatusBadge availability="generally-available" />
      </div>
    ),
  },
  {
    name: "error-page",
    number: 63,
    section: "2.6",
    demo: (
      <div className={styles.stack}>
        <ErrorPage
          headline="Diese Seite gibt es nicht."
          kind="404"
          search={<SearchField label="Ort oder Postleitzahl" to="place" />}
        />
        <ErrorPage
          body="Wir arbeiten daran. Versuch es gleich noch einmal."
          headline="Da ist etwas schiefgegangen."
          kind="500"
        />
      </div>
    ),
  },
];

/** The four states every data-dependent component declares (D-9). */
export const DECLARED_STATE_ORDER: readonly DataState[] = [
  "loading",
  "empty",
  "degraded",
  "mocked",
];

export function ComponentGallery() {
  return (
    <div className={styles.gallery}>
      {GALLERY.map((entry) => (
        <section className={styles.entry} data-component={entry.name} key={entry.name}>
          <h2 className={styles.heading}>
            <span className={styles.number}>
              {entry.section} · {entry.number}
            </span>{" "}
            {entry.name}
          </h2>
          <div className={styles.demo}>{entry.demo}</div>
          {entry.states ? (
            <div className={styles.states}>
              {DECLARED_STATE_ORDER.map((state) => (
                <div className={styles.state} data-state={state} key={state}>
                  <p className={styles.stateLabel}>{state}</p>
                  {entry.states?.[state]}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
