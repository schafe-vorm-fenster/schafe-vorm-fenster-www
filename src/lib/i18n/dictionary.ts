/**
 * The UI-string dictionary — TS-001 D7.
 *
 * System texts (navigation, buttons, form labels, error pages) exist per
 * language, **keyed, not inline**. The keys are the `Dictionary` interface,
 * so a missing or misspelled key is a type error rather than a blank label,
 * and adding a language is one more object — no code change at a call site.
 *
 * No i18n library. The stack-harmony rule (plan/guardrails.md) was run
 * first: no sibling repository under `~/Projects/` carries `next-intl`,
 * `i18next` or `react-intl`; the only i18n in the family is Paraglide inside
 * an Astro app, which does not transfer. What this website needs at M2 —
 * a typed key set and a localized path table — is a record type and a lookup.
 * See ADR-073.
 *
 * **Page copy is not here.** Titles below are working placeholders for the
 * routing skeleton; from M3 `seo.title` and `seo.description` come from the
 * page's content frontmatter (TS-011 D5, WEB-F-089) and this block shrinks
 * to the chrome strings.
 */

import { LOCALES } from "@/src/lib/i18n/locales";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

export interface Dictionary {
  /** The site name, as it appears in the title template and `og:site_name`. */
  siteName: string;
  skipToContent: string;
  /** Header and context-band labels — the four jobs (TS-004 D4). */
  nav: {
    home: string;
    knowWhatIsOn: string;
    publishDates: string;
    yourCalendar: string;
    whyUs: string;
    calendarButton: string;
    /**
     * The breadcrumb `nav`'s own accessible name — distinct from the header
     * `nav`'s (`home`), so the two landmarks of the same role are
     * distinguishable by name on every second-level page (F-2-3).
     */
    breadcrumb: string;
  };
  footer: {
    contact: string;
    newsletter: string;
    imprint: string;
    privacy: string;
    accessibility: string;
    language: string;
  };
  /** The M2 scaffolding strings — every one of them disappears with the page. */
  placeholder: {
    section: string;
    reserved: string;
    components: string;
    note: string;
  };
  notFound: {
    title: string;
    body: string;
    backHome: string;
  };
  error: {
    title: string;
    body: string;
    retry: string;
    backHome: string;
  };
  /**
   * The words the live-data shells put on themselves. They live here rather
   * than in each component's default, because a component that hard-codes a
   * German default renders that German on `/en` — which is exactly what
   * happened (`state/open.md` row 101). Every self-badging module takes a
   * `locale` and reads these.
   */
  live: {
    /** The mock rule's marking (plan/guardrails.md). */
    demoData: string;
    /** Tier 2's prefix — "Stand: <time>". */
    stale: string;
    /** Tier 3's word — the build-time snapshot, labelled as an example. */
    snapshot: string;
    /** The counter band's three units (TS-008 D8). */
    dates: string;
    places: string;
    updatesToday: string;
  };
  /**
   * The photo surface's own placeholder register (SRC-014 §Photo surface) —
   * `photo-surface`, `placeholder-surface` and `placeholder-badge` take a
   * `locale` and read these, for the same reason `live` above exists: a
   * hard-coded German default renders on `/en` too (F-2-4).
   */
  media: {
    /** The missing-photo hatch's badge — "Foto gesucht". */
    photoWanted: string;
    /** The missing-photo hatch's invitation headline. */
    photoWantedHeadline: string;
    /** The placeholder-photography badge — "Nicht motivgenau · Platzhalter". */
    notDepicting: string;
  };
  /**
   * `place-search`'s own ZIP-only-until-Q-025 words (TS-008 D7). A page
   * usually supplies its own copy from content, but the component's default
   * — used wherever a page does not — hard-coded German and rendered it on
   * `/en` too (F-2-4), the same failure `live` and `media` above exist to
   * prevent.
   */
  search: {
    label: string;
    placeholder: string;
    hint: string;
  };
  /**
   * `outbound-link`'s own announcements — hard-coded German regardless of
   * `locale` before F-2-4, on every page that links off-site.
   */
  outboundLink: {
    /** "(öffnet neuen Tab)" — announced in the link text itself (A11y). */
    newTab: string;
    /** "Daten gehen an <recipient>" — the recipient follows this phrase. */
    dataGoesTo: string;
  };
  /** Page titles, keyed by route id. Placeholders until M3 (TS-011 D5). */
  pages: Record<RouteId, string>;
  /** Template for the placeholder meta description, `%s` = the page title. */
  descriptionTemplate: string;
}

const de: Dictionary = {
  siteName: "Schafe vorm Fenster",
  skipToContent: "Zum Inhalt springen",
  nav: {
    home: "Startseite",
    knowWhatIsOn: "Was ist los",
    publishDates: "Termine veröffentlichen",
    yourCalendar: "Dein Kalender",
    whyUs: "Warum wir",
    calendarButton: "Kalender",
    breadcrumb: "Seitenpfad",
  },
  footer: {
    contact: "Kontakt",
    newsletter: "Newsletter",
    imprint: "Impressum",
    privacy: "Datenschutz",
    accessibility: "Barrierefreiheit",
    language: "Sprache",
  },
  placeholder: {
    section: "Platzhalter",
    reserved: "Reservierte Höhe — dieser Abschnitt wird in M2 an Ort und Stelle ersetzt.",
    components: "Komponenten",
    note: "Platzhalterseite aus dem Routing-Gerüst (M2). Inhalt und Module folgen aus dem Seiten-Spec.",
  },
  notFound: {
    title: "Seite nicht gefunden",
    body: "Diese Adresse gibt es nicht. [Platzhalter M2 — Ortssuche und Job-Band folgen mit den Komponenten, DEC-032.]",
    backHome: "Zur Startseite",
  },
  error: {
    title: "Da ist etwas schiefgelaufen",
    body: "Bitte versuche es noch einmal. [Platzhalter M2 — DEC-032: statisch, minimal, ohne Datenabhängigkeit.]",
    retry: "Erneut versuchen",
    backHome: "Zur Startseite",
  },
  live: {
    demoData: "Demo-Daten",
    stale: "Stand",
    snapshot: "Beispiel",
    dates: "Termine",
    places: "Orte",
    updatesToday: "Aktualisierungen heute",
  },
  media: {
    photoWanted: "Foto gesucht",
    photoWantedHeadline: "Uns fehlt hier ein Bild aus deinem Ort.",
    notDepicting: "Nicht motivgenau · Platzhalter",
  },
  search: {
    label: "Ort oder Postleitzahl",
    placeholder: "Postleitzahl",
    hint: "Bislang nur per Postleitzahl — die Ortssuche folgt.",
  },
  outboundLink: {
    newTab: "öffnet neuen Tab",
    dataGoesTo: "Daten gehen an",
  },
  pages: {
    home: "Schafe vorm Fenster",
    place: "Dein Ort",
    placeStart: "Kalender in deinem Ort starten",
    takePart: "Mitmachen",
    register: "Registrieren",
    calendar: "Dein Kalender",
    order: "Bestellen",
    region: "Deine Region",
    regionQuote: "Angebot anfordern",
    about: "Über uns",
    archive: "Archiv",
    legal: "Rechtliches",
  },
  descriptionTemplate:
    "%s — Platzhalter aus dem Routing-Gerüst (M2). Titel und Beschreibung kommen in M3 aus dem Content-Frontmatter (TS-011 D5).",
};

const en: Dictionary = {
  siteName: "Schafe vorm Fenster",
  skipToContent: "Skip to content",
  nav: {
    home: "Home",
    knowWhatIsOn: "What is on",
    publishDates: "Publish dates",
    yourCalendar: "Your calendar",
    whyUs: "Why us",
    calendarButton: "Calendar",
    breadcrumb: "Page path",
  },
  footer: {
    contact: "Contact",
    newsletter: "Newsletter",
    imprint: "Imprint",
    privacy: "Privacy",
    accessibility: "Accessibility",
    language: "Language",
  },
  placeholder: {
    section: "Placeholder",
    reserved: "Reserved height — this section is replaced in place during M2.",
    components: "Components",
    note: "Placeholder page from the routing skeleton (M2). Content and modules follow from the page spec.",
  },
  notFound: {
    title: "Page not found",
    body: "This address does not exist. [Placeholder M2 — place search and job band follow with the components, DEC-032.]",
    backHome: "To the home page",
  },
  error: {
    title: "Something went wrong",
    body: "Please try again. [Placeholder M2 — DEC-032: static, minimal, no data dependency.]",
    retry: "Try again",
    backHome: "To the home page",
  },
  live: {
    demoData: "Demo data",
    stale: "As of",
    snapshot: "Example",
    dates: "dates",
    places: "places",
    updatesToday: "updates today",
  },
  media: {
    photoWanted: "Photo wanted",
    photoWantedHeadline: "We're missing a picture from your place here.",
    notDepicting: "Not an exact match · placeholder",
  },
  search: {
    label: "Place or postcode",
    placeholder: "Postcode",
    hint: "Postcode search only for now — search by name is coming.",
  },
  outboundLink: {
    newTab: "opens new tab",
    dataGoesTo: "Data goes to",
  },
  pages: {
    home: "Schafe vorm Fenster",
    place: "Your place",
    placeStart: "Start the calendar in your place",
    takePart: "Take part",
    register: "Register",
    calendar: "Your calendar",
    order: "Order",
    region: "Your region",
    regionQuote: "Request a quote",
    about: "About us",
    archive: "Archive",
    legal: "Legal",
  },
  descriptionTemplate:
    "%s — placeholder from the routing skeleton (M2). Title and description come from the content frontmatter in M3 (TS-011 D5).",
};

const DICTIONARIES: Readonly<Record<Locale, Dictionary>> = { de, en };

/** The dictionary of a language. The only way to reach a UI string. */
export function dictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** Keys of one dictionary group — lets a data table name a label safely. */
export type DictionaryKeyOf<Group extends keyof Dictionary> =
  Dictionary[Group] extends Record<string, string>
    ? keyof Dictionary[Group] & string
    : never;

/** The placeholder meta description of a page (TS-011 D5 until M3). */
export function placeholderDescription(locale: Locale, title: string): string {
  return dictionary(locale).descriptionTemplate.replace("%s", title);
}

/** Every language that has a dictionary — used by the key-parity test. */
export const DICTIONARY_LOCALES = LOCALES;
