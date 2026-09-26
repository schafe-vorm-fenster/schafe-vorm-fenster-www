import dorf from "../generated/placeholders/ueber-uns/dorf.svg";
import portalize from "../generated/placeholders/dein-kalender/portalize.svg";
import karte from "../generated/placeholders/deine-region/karte.svg";
import whatsappSzene from "../generated/placeholders/mitmachen/whatsapp-szene.svg";
import gruender from "../generated/placeholders/ueber-uns/gruender.svg";

import { ArchiveFilter } from "./archive-filter/archive-filter";
import { ArchiveRow } from "./archive-row/archive-row";
import { BackToTop } from "./back-to-top/back-to-top";
import { Badge } from "./badge/badge";
import { BreadcrumbTrail } from "./breadcrumb-trail/breadcrumb-trail";
import { Button } from "./button/button";
import { Chip } from "./chip/chip";
import { ChoiceGroup } from "./choice-group/choice-group";
import { ClosingCta } from "./closing-cta/closing-cta";
import { CodeSnippet } from "./code-snippet/code-snippet";
import { ComparisonTable } from "./comparison-table/comparison-table";
import { CONTACT_SECTION_ID } from "./contact-section/contact-section";
import { ContextBand } from "./context-band/context-band";
import { EmbedFrame } from "./embed-frame/embed-frame";
import { EmptyProofSlot } from "./empty-proof-slot/empty-proof-slot";
import { EmptyStateBlock } from "./empty-state-block/empty-state-block";
import { EnvoyFormMount } from "./envoy-form-mount/envoy-form-mount";
import { ErrorPage } from "./error-page/error-page";
import { EventList } from "./event-list/event-list";
import { EventRow } from "./event-row/event-row";
import { FeatureBenefit } from "./feature-benefit/feature-benefit";
import { FreshnessLabel } from "./freshness-label/freshness-label";
import { HeroBlock } from "./hero-block/hero-block";
import { HowtoBlock } from "./howto-block/howto-block";
import { Icon } from "./icon/icon";
import { LanguageSwitch } from "./language-switch/language-switch";
import { LeadFallback } from "./lead-fallback/lead-fallback";
import { LegalSection } from "./legal-section/legal-section";
import { LiveCounters } from "./live-counters/live-counters";
import { LiveModuleFrame } from "./live-module-frame/live-module-frame";
import { Logo } from "./logo/logo";
import { MediaFrame } from "./media-frame/media-frame";
import { MotionReveal } from "./motion-reveal/motion-reveal";
import { NewsletterBlock } from "./newsletter-block/newsletter-block";
import { ObjectionList } from "./objection-list/objection-list";
import { OfferTier, OFFER_TIER_CTA_VARIANT } from "./offer-tier/offer-tier";
import { OriginStory } from "./origin-story/origin-story";
import { OutboundLink } from "./outbound-link/outbound-link";
import { PersonProfile } from "./person-profile/person-profile";
import { PhotoSurface } from "./photo-surface/photo-surface";
import { PlaceExampleSet } from "./place-example-set/place-example-set";
import { PlaceholderSurface } from "./placeholder-surface/placeholder-surface";
import { PlaceSearch } from "./place-search/place-search";
import { HintBanner } from "./hint-banner/hint-banner";
import { PriceSection, PriceTierRow } from "./price-section/price-section";
import { PriceTag } from "./price-tag/price-tag";
import { ProofCard } from "./proof-card/proof-card";
import { ProofStream } from "./proof-stream/proof-stream";
import { PublishingPath } from "./publishing-path/publishing-path";
import { ResponsePromise } from "./response-promise/response-promise";
import { linkHref } from "./route-link/href";
import { RouteLink } from "./route-link/route-link";
import { SceneBlock } from "./scene-block/scene-block";
import { ScopePicker } from "./scope-picker/scope-picker";
import { SearchField } from "./search-field/search-field";
import { SectionNav } from "./section-nav/section-nav";
import { SectionShell } from "./section-shell/section-shell";
import { SettingRow, SettingRows } from "./setting-row/setting-row";
import { SiteFooter } from "./site-footer/site-footer";
import { SiteHeader } from "./site-header/site-header";
import { Skeleton } from "./skeleton/skeleton";
import { SkipLink } from "./skip-link/skip-link";
import { StatusBadge } from "./status-badge/status-badge";
import { StepIndicator } from "./step-indicator/step-indicator";
import { Tag } from "./tag/tag";
import { TrustBlock } from "./trust-block/trust-block";
import { ValueStory } from "./value-story/value-story";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { offeringPrice, publishedFigure } from "@/src/lib/pricing/offerings";
import { standardSources } from "@/src/lib/pricing/standard-sources";

import type { DataState } from "./data-state";
import type { FourComparisonRows } from "./content-fragments";
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
 * is "Schlatkow".
 */
export interface GalleryEntry {
  /** The inventory name, kebab-case, exactly as plan/component-inventory.md. */
  readonly name: string;
  readonly number: number;
  readonly section: "2.1" | "2.2" | "2.3" | "2.4" | "2.5" | "2.6";
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
  title: "Sommerfest der Feuerwehr Schlatkow",
  meta: "14:00 · Festplatz · Freiwillige Feuerwehr",
  category: "fest",
  categoryLabel: "Fest",
} as const;

/** Three fictitious dates for the §2.4 live-module demos (mock rule). */
const DEMO_EVENTS = [
  DEMO_EVENT,
  {
    date: "2026-09-14",
    title: "Flohmarkt am Dorfplatz",
    meta: "10:00 · Dorfplatz · Frauenverein Schlatkow",
    category: "merchants",
    categoryLabel: "Handel",
  },
  {
    date: "2026-09-18",
    title: "Offene Kirche mit Orgelmusik",
    meta: "18:00 · Dorfkirche Schlatkow",
    category: "culture",
    categoryLabel: "Kultur",
  },
] as const;

const DEMO_PUBLISH_CTA = (
  <Button to="register" variant="primary-dark">
    Termine eintragen
  </Button>
);

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
        <Badge tone="neighbouring">Schmatzin</Badge>
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
        <Chip to="place">Schlatkow</Chip>
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
    /* No contact slot any more (DEC-0081, DEC-0122 §2): the contact section is
       the site's one contact surface and stands above this footer. The
       newsletter slot is shown filled here although no route passes it today
       (TS-WEB-0016-A21) — the gallery is where the withheld shape stays
       visible. */
    demo: (
      <SiteFooter
        newsletter={<p>Newsletter-Slot — nur solange ein Versandsystem existiert.</p>}
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
        alt="Blick über ein Dorf in Vorpommern"
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

  // ── 2.3 Argument blocks (content types B.3) ────────────────────────────
  {
    name: "hero-block",
    number: 21,
    section: "2.3",
    demo: (
      <HeroBlock
        cta={
          <Button onward variant="primary-dark">
            Kalender ansehen
          </Button>
        }
        headline="Schlatkow"
        kicker="Dein Ort"
        lead="Alle Termine deines Ortes, an einem Platz."
        placeholderId="ueber-uns/dorf"
        src={assetSrc(dorf)}
        variant="place-name"
      />
    ),
    states: {
      loading: <HeroBlock headline="Schlatkow" src={assetSrc(dorf)} state="loading" />,
      empty: <HeroBlock headline="Schlatkow" state="empty" />,
      degraded: <HeroBlock headline="Schlatkow" notDepicting src={assetSrc(dorf)} state="degraded" />,
      mocked: <HeroBlock headline="Schlatkow" src={assetSrc(dorf)} state="mocked" />,
    },
  },
  {
    name: "scene-block",
    number: 22,
    section: "2.3",
    demo: (
      <SceneBlock
        body="Ein Verein schreibt in die WhatsApp-Gruppe, fertig."
        cta={
          <Button onward variant="quiet">
            Mehr zu WhatsApp
          </Button>
        }
        freshnessTier="stale"
        freshnessUpdatedAt="2026-09-11T08:00:00Z"
        instance={
          <MediaFrame
            alt="Beispielhafte Szene: eine WhatsApp-Nachricht wird zum Termin"
            ratio="feature"
            src={assetSrc(whatsappSzene)}
          />
        }
        mechanism="whatsapp"
        opener="Was, wenn der Termin einfach im Kalender steht?"
      />
    ),
  },
  {
    name: "value-story",
    number: 23,
    section: "2.3",
    demo: (
      <ValueStory
        aspect="Vereinsleben"
        example={<EventRow {...DEMO_EVENT} />}
        exampleLabel="Schlatkow"
        exampleLevel="place"
        exampleVariant="row"
        testimonial={{
          attribution: "Vereinsvorsitzende, Schlatkow",
          text: "Endlich sehen alle unsere Termine.",
        }}
        whyItMatters="Du siehst auf einen Blick, was diese Woche los ist."
      />
    ),
  },
  {
    name: "objection-list",
    number: 24,
    section: "2.3",
    demo: (
      <ObjectionList
        headline="Warum Termine heute untergehen"
        items={[
          { channel: "Aushang am Amtsblatt", failure: "Nur wer vorbeiläuft, sieht ihn." },
          { channel: "Vereins-WhatsApp", failure: "Nur Mitglieder sind in der Gruppe." },
        ]}
      />
    ),
  },
  {
    name: "publishing-path",
    number: 25,
    section: "2.3",
    demo: (
      <PublishingPath
        availability="alpha"
        cta={DEMO_PUBLISH_CTA}
        headline="Eigene Website als Quelle"
        mechanism="website-import"
        mediaAlt="Beispielhafte Website-Vorschau"
        mediaSrc={assetSrc(portalize)}
        steps={[
          { body: "Wir lesen deine Terminseite ein.", index: 1, title: "Adresse angeben" },
          { body: "Neue Termine erscheinen automatisch.", index: 2, title: "Fertig" },
        ]}
      />
    ),
  },
  {
    name: "comparison-table",
    number: 26,
    section: "2.3",
    demo: (
      <ComparisonTable
        rows={
          [
            { today: "Sechs Kanäle, halbes Dorf hört nichts", withProduct: "Ein Kalender, alle sehen es" },
            { today: "Termine per Zuruf", withProduct: "Termine per Klick" },
            { today: "Kein Überblick", withProduct: "Voller Überblick" },
            { today: "Zettel am Brett", withProduct: "Digital und dauerhaft" },
          ] as FourComparisonRows
        }
        todayLabel="Heute"
        withProductLabel="Mit eurem Kalender"
      />
    ),
  },
  {
    name: "offer-tier",
    number: 27,
    section: "2.3",
    demo: (
      <div className={styles.row}>
        <OfferTier
          audienceLine="Für Dörfer und Vereine"
          checks={[{ text: "Kostenlos, dauerhaft" }]}
          name="Gemeinschaftskalender"
          offeringId="community-calendar"
          primaryCta={
            <Button variant={OFFER_TIER_CTA_VARIANT["community-calendar"]}>Kalender starten</Button>
          }
          priceDisplay="permanent"
        />
        <OfferTier
          audienceLine="Für Kommunen"
          checks={[
            { emphasis: true, text: "Eigene Domain" },
            { text: "Redaktionelle Betreuung" },
          ]}
          footnote="Jährliche Abrechnung, kündbar zum Laufzeitende."
          name="Portalize Kalender"
          offeringId="portalize-calendar"
          primaryCta={
            <Button variant={OFFER_TIER_CTA_VARIANT["portalize-calendar"]}>Kalender bestellen</Button>
          }
          priceDisplay="priced"
          priceFigure={offeringPrice("portalize-calendar").figure}
        />
        <OfferTier
          audienceLine="Für Landkreise"
          checks={[{ text: "Gebietsschnitt inklusive" }]}
          name="Portalize Enterprise"
          offeringId="portalize-enterprise"
          primaryCta={
            <Button variant={OFFER_TIER_CTA_VARIANT["portalize-enterprise"]}>Mehr erfahren</Button>
          }
          priceDisplay="on-request"
        />
      </div>
    ),
  },
  {
    // The composition that replaces `offer-tier` (TS-WEB-0024 D6, DEC-0118):
    // one paper section, the lime-500 band, three rows on hairlines, one CTA
    // each at quiet · primary-light · quiet. Row wording is the 2026-09-23
    // drafts' (plan/reviews/2026-09-23/Design - Preis Section 1–2.png); the
    // band's kicker is the dictionary's.
    name: "price-section",
    number: 64,
    section: "2.3",
    demo: (
      <PriceSection
        framing="Der Preis hängt nur davon ab, wo der Kalender stehen soll."
        headingId="gallery-price-heading"
        headline="Drei Wege zu eurem Kalender"
        kicker={dictionary("de").kickers.price}
      >
        <PriceTierRow
          checks={[
            { text: "Kalender eures Orts und der Umgebung" },
            { text: "Termine veröffentlichen, auch per WhatsApp" },
            { text: "Für Vereine, Gemeinden, Händler, alle" },
          ]}
          cta={{ label: "Termine veröffentlichen", to: "takePart" }}
          kicker="Im Dorfkalender"
          offeringId="community-calendar"
          price={offeringPrice("community-calendar")}
          title="Der Kalender für euren Ort"
        />
        <PriceTierRow
          checks={[
            { text: "Unter eurem Namen, in eurem Design" },
            { text: "Mit euren Orten, Kategorien und Akteuren" },
            { text: "Termine kommen von selbst rein" },
          ]}
          cta={{ label: "Kalender bestellen", to: "order" }}
          kicker="Auf eurer Website"
          offeringId="portalize-calendar"
          price={offeringPrice("portalize-calendar")}
          title="Euer eigener Kalender"
        />
        <PriceTierRow
          checks={[
            { text: "Für Landkreise, Behörden, große Städte" },
            { text: "Zusätzlich mit Kartenansicht" },
            { text: "Eigene Registrierung unter eurem Namen" },
          ]}
          cta={{ label: "Beratungstermin buchen", to: "region" }}
          kicker="Für eine Region"
          offeringId="portalize-enterprise"
          price={offeringPrice("portalize-enterprise")}
          title="Ein Kalender für den Landkreis"
        />
      </PriceSection>
    ),
  },
  {
    name: "tag",
    number: 65,
    section: "2.1",
    demo: (
      <div className={styles.row}>
        <Tag>Stadtgebiet</Tag>
        <Tag>Ortsteile</Tag>
        <Tag excluded>Nachbarorte</Tag>
        <Tag tone="surface">Kultur</Tag>
      </div>
    ),
  },
  {
    // Rows from the 2026-09-23 drafts (Design -. Portalize Einstellungen 1–2.png);
    // the third carries the placeholder-badge marker (DEC-0118).
    name: "setting-row",
    number: 66,
    section: "2.3",
    demo: (
      <SettingRows>
        <SettingRow
          core="Einzelne Orte, ganze Gemeinden oder ein Umkreis."
          example="Beispiel: Die Kulturgesellschaft einer Stadt nimmt nur das Stadtgebiet — aus Nachbarorten taucht nichts auf."
          icon="map-pin"
          tags={[{ label: "Stadtgebiet" }, { label: "Ortsteile" }, { label: "Nachbarorte", excluded: true }]}
          title="Orte"
        />
        <SettingRow
          core="Nur die, die zu euch gehören — die anderen erscheinen nicht."
          example="Beispiel: Eine Stiftung zeigt nur ihre Partner und die Projekte aus den eigenen Förderprogrammen."
          icon="users"
          tags={[{ label: "Partner" }, { label: "Geförderte" }, { label: "Alle anderen", excluded: true }]}
          title="Veranstalter"
        />
        <SettingRow
          core="Wie weit der Kalender nach vorn schaut."
          icon="clock"
          marker="wird geprüft"
          title="Zeitraum"
        />
      </SettingRows>
    ),
  },
  {
    // The boundary sentence is DEC-0107's own title; the sources are the
    // offering record's (`standard-sources.ts`), never a list written here.
    name: "hint-banner",
    number: 67,
    section: "2.3",
    demo: (
      <HintBanner locale="en" sources={standardSources()}>
        <p>
          A standard source publishes free; an individual integration into a system we do not
          already support is the paid add-on.
        </p>
      </HintBanner>
    ),
  },
  {
    name: "feature-benefit",
    number: 28,
    section: "2.3",
    demo: (
      <FeatureBenefit
        benefit="Deine Landkreis-Termine automatisch nach Gemeinde sortiert."
        feature="Gebietsschnitt"
        mediaAlt="Beispielhafte Kartenansicht"
        mediaSrc={assetSrc(karte)}
      />
    ),
  },
  {
    name: "price-tag",
    number: 29,
    section: "2.3",
    demo: (
      <div className={styles.stack}>
        <PriceTag display="priced" figure={publishedFigure("portalize-calendar")} />
        <PriceTag display="on-request" />
        <PriceTag display="permanent" />
        <PriceTag display="withheld" />
      </div>
    ),
  },
  {
    name: "proof-card",
    number: 30,
    section: "2.3",
    demo: (
      <ProofCard
        attribution="Vorpommern Kurier, 2024"
        claim="„Endlich sehen alle Bürgerinnen und Bürger, was los ist.“"
        contextLine="Lokalzeitung"
        geo={{ label: "Schlatkow", level: "place" }}
        image={{ alt: "Zeitungsausschnitt", src: assetSrc(dorf) }}
        link={{ href: "https://example.org/artikel", label: "Original lesen" }}
      />
    ),
    states: {
      loading: (
        <ProofCard
          attribution="—"
          claim="—"
          contextLine="—"
          geo={{ label: "—", level: "place" }}
          state="loading"
        />
      ),
      empty: (
        <ProofCard
          attribution="—"
          claim="—"
          contextLine="—"
          geo={{ label: "—", level: "place" }}
          state="empty"
        />
      ),
      degraded: (
        <ProofCard
          attribution="Vorpommern Kurier"
          claim="„Ein Gewinn für das ganze Dorf.“"
          contextLine="Presse"
          geo={{ label: "Schlatkow", level: "place" }}
          state="degraded"
        />
      ),
      mocked: (
        <ProofCard
          attribution="Vorpommern Kurier"
          claim="„Ein Gewinn für das ganze Dorf.“"
          contextLine="Presse"
          geo={{ label: "Schlatkow", level: "place" }}
          state="mocked"
        />
      ),
    },
  },
  {
    name: "proof-stream",
    number: 31,
    section: "2.3",
    demo: (
      <ProofStream>
        <ProofCard
          attribution="Vorpommern Kurier"
          claim="„Ein Gewinn für das ganze Dorf.“"
          contextLine="Presse"
          geo={{ label: "Schlatkow", level: "place" }}
        />
        <EmptyProofSlot />
        <ProofCard
          attribution="Anklamer Zeitung"
          claim="„Auch bei uns im Einsatz.“"
          contextLine="Presse"
          geo={{ label: "Schmatzin", level: "surrounding" }}
        />
      </ProofStream>
    ),
  },
  {
    name: "empty-proof-slot",
    number: 32,
    section: "2.3",
    demo: <EmptyProofSlot />,
  },
  {
    name: "archive-row",
    number: 33,
    section: "2.3",
    demo: (
      <div>
        <ArchiveRow
          contextLine="Berichtet über den Kalenderstart in Schlatkow."
          date="2019-05-03"
          href="https://example.org/artikel"
          outlet="Vorpommern Kurier"
          previewAlt="Zeitungsausschnitt"
          previewSrc={assetSrc(dorf)}
          title="Dorf startet digitalen Terminkalender"
          types={["Presse"]}
        />
        <ArchiveRow
          contextLine="Radiobeitrag ohne Vorschaubild."
          date="2021-11-01"
          outlet="Beispielradio"
          precision="month"
          title="Ein Dorf geht online"
          types={["Radio"]}
        />
      </div>
    ),
  },
  {
    name: "archive-filter",
    number: 34,
    section: "2.3",
    demo: (
      <ArchiveFilter
        types={[
          { id: "presse", label: "Presse" },
          { id: "radio", label: "Radio" },
        ]}
      >
        <ArchiveRow
          contextLine="Berichtet über den Kalenderstart in Schlatkow."
          date="2019-05-03"
          outlet="Vorpommern Kurier"
          title="Dorf startet digitalen Terminkalender"
          types={["presse"]}
        />
        <ArchiveRow
          contextLine="Radiobeitrag ohne Vorschaubild."
          date="2021-11-01"
          outlet="Beispielradio"
          precision="month"
          title="Ein Dorf geht online"
          types={["radio"]}
        />
      </ArchiveFilter>
    ),
  },
  {
    name: "origin-story",
    number: 35,
    section: "2.3",
    demo: (
      <OriginStory
        body="Ein Dorf mit rund 400 Menschen baute sich einen kostenlosen Gemeinschaftskalender — heute kostet die Lizenz 480 € im Jahr."
        portraitAlt="Porträt einer Bürgermeisterin"
        portraitSrc={assetSrc(gruender)}
        priceDisplay="priced"
        priceFigure={offeringPrice("portalize-calendar").figure}
      />
    ),
  },
  {
    name: "person-profile",
    number: 36,
    section: "2.3",
    demo: (
      <div className={styles.row}>
        <PersonProfile
          bio="Kümmert sich um Termine und Technik."
          name="Beispielperson"
          portraitAlt="Beispielperson"
          portraitSrc={assetSrc(gruender)}
          role="Gründerin"
        />
        <PersonProfile name="Beispielperson zwei" portraitAlt="Beispielperson zwei" role="Team" />
      </div>
    ),
  },
  {
    name: "trust-block",
    number: 37,
    section: "2.3",
    demo: (
      <TrustBlock
        headline="Vertrauen"
        subjects={[
          {
            body: "Deine Daten bleiben in Deutschland, verschlüsselt gespeichert.",
            id: "data-protection",
            label: "Datenschutz",
          },
          { id: "operations", label: "Betrieb" },
          { id: "ai", label: "KI" },
        ]}
      />
    ),
  },
  {
    name: "howto-block",
    number: 38,
    section: "2.3",
    demo: (
      <HowtoBlock
        android={{ steps: ["Website öffnen", "Menü ⋮ antippen", "„Zum Startbildschirm hinzufügen“ wählen"] }}
        appHref="https://app.schafe-vorm-fenster.de/beispieldorf"
        headline="Auf dem Homescreen"
        ios={{ steps: ["Website öffnen", "Teilen-Symbol antippen", "„Zum Home-Bildschirm“ wählen"] }}
      />
    ),
  },
  {
    name: "legal-section",
    number: 39,
    section: "2.3",
    demo: (
      <div className={styles.stack}>
        <LegalSection
          body={<p>Verantwortlich im Sinne des Presserechts: Beispiel GbR, Dorfstraße 1.</p>}
          section="imprint"
          title="Impressum"
        />
        <LegalSection section="terms" title="Nutzungsbedingungen" />
      </div>
    ),
  },

  // ── 2.4 Live-module shells ──────────────────────────────────────────────
  {
    name: "live-module-frame",
    number: 40,
    section: "2.4",
    demo: (
      <LiveModuleFrame subline="Die nächsten drei Termine" title="Termine in Schlatkow">
        <EventList items={DEMO_EVENTS} rowCount={3} />
      </LiveModuleFrame>
    ),
    states: {
      loading: (
        <LiveModuleFrame state="loading" title="Termine in Schlatkow">
          <EventList items={[]} rowCount={3} />
        </LiveModuleFrame>
      ),
      empty: (
        <LiveModuleFrame state="empty" title="Termine in Schlatkow">
          <EmptyStateBlock
            cta={DEMO_PUBLISH_CTA}
            headline="Noch nichts eingetragen in Schlatkow."
          />
        </LiveModuleFrame>
      ),
      degraded: (
        <LiveModuleFrame state="degraded" title="Termine in Schlatkow" updatedAt="2026-09-10T08:00:00Z">
          <EventList items={DEMO_EVENTS} rowCount={3} state="degraded" />
        </LiveModuleFrame>
      ),
      mocked: (
        <LiveModuleFrame state="mocked" title="Termine in Schlatkow">
          <EventList items={DEMO_EVENTS} rowCount={3} state="mocked" />
        </LiveModuleFrame>
      ),
    },
  },
  {
    name: "place-search",
    number: 41,
    section: "2.4",
    demo: (
      <div className={styles.onSurface}>
        <PlaceSearch label="Ort oder Postleitzahl" to="place" />
      </div>
    ),
    states: {
      loading: (
        <div className={styles.onSurface}>
          <PlaceSearch label="Ort oder Postleitzahl" state="loading" to="place" />
        </div>
      ),
      empty: (
        <div className={styles.onSurface}>
          <PlaceSearch label="Ort oder Postleitzahl" state="empty" to="place" />
        </div>
      ),
      degraded: (
        <div className={styles.onSurface}>
          <PlaceSearch label="Ort oder Postleitzahl" state="degraded" to="place" />
        </div>
      ),
      mocked: (
        <div className={styles.onSurface}>
          <PlaceSearch
            label="Ort oder Postleitzahl"
            state="mocked"
            suggestions={[
              { label: "Schlatkow", query: { ort: "beispieldorf" }, to: "place" },
              { label: "Nachbardorf", query: { ort: "nachbardorf" }, to: "place" },
            ]}
            to="place"
          />
        </div>
      ),
    },
  },
  {
    name: "event-list",
    number: 42,
    section: "2.4",
    demo: <EventList items={DEMO_EVENTS} rowCount={3} />,
    states: {
      loading: <EventList items={[]} rowCount={3} state="loading" />,
      empty: (
        <EventList
          emptyState={
            <EmptyStateBlock cta={DEMO_PUBLISH_CTA} headline="Noch nichts eingetragen in Schlatkow." />
          }
          items={[]}
          rowCount={3}
          state="empty"
        />
      ),
      degraded: <EventList items={DEMO_EVENTS} rowCount={3} state="degraded" />,
      mocked: <EventList items={DEMO_EVENTS} rowCount={3} state="mocked" />,
    },
  },
  {
    name: "place-example-set",
    number: 43,
    section: "2.4",
    demo: (
      <PlaceExampleSet
        examples={[
          { label: "Schlatkow", to: "place" },
          { label: "Nachbardorf", to: "place" },
          { label: "Neuendorf", to: "place" },
        ]}
      />
    ),
    states: {
      loading: <PlaceExampleSet examples={[]} state="loading" />,
      empty: <PlaceExampleSet examples={[]} state="empty" />,
      degraded: <PlaceExampleSet examples={[{ label: "Schlatkow", to: "place" }]} state="degraded" />,
      mocked: (
        <PlaceExampleSet
          examples={[
            { label: "Schlatkow", to: "place" },
            { label: "Nachbardorf", to: "place" },
          ]}
          state="mocked"
        />
      ),
    },
  },
  {
    name: "live-counters",
    number: 44,
    section: "2.4",
    demo: <LiveCounters dates={128} />,
    states: {
      loading: <LiveCounters state="loading" />,
      empty: <LiveCounters state="empty" />,
      degraded: <LiveCounters dates={128} state="degraded" />,
      mocked: <LiveCounters dates={128} places={12} state="mocked" updatesToday={4} />,
    },
  },
  {
    name: "embed-frame",
    number: 45,
    section: "2.4",
    demo: (
      <EmbedFrame
        copy="So sieht dein eingebetteter Kalender bei dir auf der Website aus."
        cta={
          <Button to="order" variant="primary-dark">
            Kalender bestellen
          </Button>
        }
        heading="Beispiel-Kalender"
      />
    ),
    states: {
      loading: <EmbedFrame heading="Beispiel-Kalender" state="loading" />,
      empty: (
        <EmbedFrame
          copy="Der Kalender lädt gerade nicht — schau gleich noch einmal vorbei."
          cta={
            <Button to="order" variant="primary-dark">
              Kalender bestellen
            </Button>
          }
          heading="Beispiel-Kalender"
          state="empty"
        />
      ),
      degraded: (
        <EmbedFrame
          cta={
            <Button to="order" variant="primary-dark">
              Kalender bestellen
            </Button>
          }
          heading="Beispiel-Kalender"
          state="degraded"
        />
      ),
      mocked: (
        <EmbedFrame
          cta={
            <Button to="order" variant="primary-dark">
              Kalender bestellen
            </Button>
          }
          heading="Beispiel-Kalender"
          organizerId="65f3a9c1d4e27b0912af4c38"
          state="mocked"
        />
      ),
    },
  },
  {
    name: "empty-state-block",
    number: 46,
    section: "2.4",
    demo: (
      <EmptyStateBlock
        cta={DEMO_PUBLISH_CTA}
        fallbackNote="Du könntest die Erste sein."
        headline="Noch nichts eingetragen in Schlatkow."
        lead="Trag als Erste ein Datum ein — es dauert nur zwei Minuten."
      />
    ),
  },

  // ── 2.5 Conversion blocks, forms and flows ─────────────────────────────
  {
    name: "context-band",
    number: 47,
    section: "2.5",
    demo: <ContextBand currentJob="knowWhatIsOn" />,
  },
  {
    name: "closing-cta",
    number: 48,
    section: "2.5",
    demo: (
      <div className={styles.stack}>
        <ClosingCta label="Kalender ansehen" to="place" variant="repeat" />
        <ClosingCta currentJob="whyUs" variant="merged" />
      </div>
    ),
  },
  {
    name: "newsletter-block",
    number: 49,
    section: "2.5",
    demo: <NewsletterBlock />,
  },
  {
    name: "envoy-form-mount",
    number: 50,
    section: "2.5",
    /* The `contact` kind is gone (DEC-0122 §2) — every demo here is one of the
       two lead surfaces that remain (TS-WEB-0006-A17). */
    demo: (
      <EnvoyFormMount fallbackEmail="kontakt@schafe-vorm-fenster.de" kind="quote" sourceRoute="region" />
    ),
    states: {
      loading: (
        <EnvoyFormMount
          fallbackEmail="kontakt@schafe-vorm-fenster.de"
          kind="quote"
          sourceRoute="region"
          state="loading"
        />
      ),
      empty: (
        <EnvoyFormMount
          fallbackEmail="kontakt@schafe-vorm-fenster.de"
          kind="quote"
          sourceRoute="region"
          state="empty"
        />
      ),
      degraded: (
        <EnvoyFormMount
          fallbackEmail="kontakt@schafe-vorm-fenster.de"
          kind="quote"
          sourceRoute="region"
          state="degraded"
        />
      ),
      mocked: (
        <EnvoyFormMount
          fallbackEmail="kontakt@schafe-vorm-fenster.de"
          kind="quote"
          sourceRoute="region"
          state="mocked"
        />
      ),
    },
  },
  {
    name: "lead-fallback",
    number: 51,
    section: "2.5",
    demo: (
      <LeadFallback
        // T-15/DEC-0133: the third line is an in-page target now — the page's
        // own contact section — not a second occurrence of the appointment URL.
        // Built through the route facade, because `src/components/README.md`
        // allows no path typed at a call site, not even in a demo.
        briefingHref={linkHref("regionQuote", { hash: CONTACT_SECTION_ID })}
        briefingLabel="Termin für ein Kennenlerngespräch buchen"
        email="kontakt@schafe-vorm-fenster.de"
      />
    ),
  },
  {
    name: "response-promise",
    number: 52,
    section: "2.5",
    demo: (
      <div className={styles.stack}>
        <p>Ohne bestätigten Prozess (Q-0022 C11 offen) — nichts wird gerendert:</p>
        <ResponsePromise text={null} />
        {/* TS-WEB-0026-A8 (`pnpm check:terms`, green; T-17 wires it into the
            `check` chain): the response-time wording lives in
            `response-promise/constant.ts` and nowhere else — not even in a
            gallery demo. The shape is what this entry shows; the sentence is
            the constant's once C11 is answered. */}
        <p>Sobald ein Prozess steht, zur Ansicht:</p>
        <ResponsePromise text="Beispielsatz" />
      </div>
    ),
  },
  {
    name: "step-indicator",
    number: 53,
    section: "2.5",
    demo: (
      <div className={styles.row}>
        <StepIndicator step={1} total={3} />
        <StepIndicator step={2} total={4} />
      </div>
    ),
  },
  {
    name: "choice-group",
    number: 54,
    section: "2.5",
    demo: (
      <ChoiceGroup
        legend="Wer veröffentlicht?"
        name="wer"
        options={[
          { label: "Verein", value: "verein" },
          { label: "Feuerwehr", value: "feuerwehr" },
          { label: "Kirche/Gemeinde", value: "kirche" },
        ]}
        selected="verein"
        to="register"
      />
    ),
    states: {
      loading: (
        <ChoiceGroup legend="Wer veröffentlicht?" name="wer" options={[]} state="loading" to="register" />
      ),
      empty: (
        <ChoiceGroup legend="Wer veröffentlicht?" name="wer" options={[]} state="empty" to="register" />
      ),
      degraded: (
        <ChoiceGroup
          legend="Wer veröffentlicht?"
          name="wer"
          options={[{ label: "Verein", value: "verein" }]}
          state="degraded"
          to="register"
        />
      ),
      mocked: (
        <ChoiceGroup
          legend="Wer veröffentlicht?"
          name="wer"
          options={[
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" },
          ]}
          state="mocked"
          to="register"
        />
      ),
    },
  },
  {
    name: "scope-picker",
    number: 55,
    section: "2.5",
    demo: (
      <ScopePicker
        items={[
          { id: "beispieldorf", kind: "place", label: "Schlatkow", removeQuery: {} },
          { id: "landkreis-beispiel", kind: "county", label: "Landkreis Beispiel", removeQuery: {} },
        ]}
        to="order"
      />
    ),
    states: {
      loading: <ScopePicker items={[]} state="loading" to="order" />,
      empty: <ScopePicker items={[]} state="empty" to="order" />,
      degraded: (
        <ScopePicker
          items={[{ id: "beispieldorf", kind: "place", label: "Schlatkow", removeQuery: {} }]}
          state="degraded"
          to="order"
        />
      ),
      mocked: (
        <ScopePicker
          items={[{ id: "beispieldorf", kind: "place", label: "Schlatkow", removeQuery: {} }]}
          state="mocked"
          to="order"
        />
      ),
    },
  },
  {
    name: "code-snippet",
    number: 56,
    section: "2.5",
    demo: (
      <CodeSnippet code='<script src="https://portalize.schafe-vorm-fenster.de/api/65f3a9c1d4e27b0912af4c38/load.js"></script>' />
    ),
    states: {
      loading: <CodeSnippet code="" state="loading" />,
      empty: <CodeSnippet code="" state="empty" />,
      degraded: (
        <CodeSnippet
          code='<script src="https://portalize.schafe-vorm-fenster.de/api/beispiel/load.js"></script>'
          state="degraded"
        />
      ),
      mocked: (
        <CodeSnippet
          code='<script src="https://portalize.schafe-vorm-fenster.de/api/65f3a9c1d4e27b0912af4c38/load.js"></script>'
          state="mocked"
        />
      ),
    },
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
        <PlaceholderSurface ratio="feature" />
        <PlaceholderSurface variant="row" />
      </div>
    ),
  },
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
