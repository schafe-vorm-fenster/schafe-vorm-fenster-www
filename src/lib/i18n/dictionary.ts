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
    /**
     * The logo link's accessible name. Hard-coded German before F-2-33, so
     * an English visitor met "Schafe vorm Fenster — zur Startseite" in the
     * accessibility tree on every `/en` page.
     */
    logoHome: string;
  };
  footer: {
    contact: string;
    newsletter: string;
    imprint: string;
    privacy: string;
    accessibility: string;
    language: string;
  };
  /**
   * The newsletter block's own words — heading, field, submit, consent and
   * the mock's note (TS-016 S5, D10).
   *
   * German-only before F-2-33, in the footer of **every** `/en` route, and
   * the note named the open question behind the mock ("solange Q-020 offen
   * ist") in visitor copy, which F-2-35 counted on 24/24 routes. The badge
   * itself is the guardrail working; the ticket id beside it was the defect.
   */
  newsletter: {
    heading: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    /** `%s` is the privacy-policy link text. */
    consent: string;
    consentLinkLabel: string;
    /** What the mock says about itself — no ticket id, no promise. */
    demoNote: string;
    /**
     * The confirmation the block swaps itself for (F-3-11). It replaces a
     * native GET submit that threw the whole page's state away, so it has to
     * say what did and did not happen — the mock sends nothing, and the
     * visitor must not be left believing she is subscribed.
     */
    successHeadline: string;
    successBody: string;
  };
  /** The M2 scaffolding strings — every one of them disappears with the page. */
  notFound: {
    title: string;
    body: string;
    backHome: string;
    /** The heading over the four jobs on the 404 (TS-004-A4's jobs band). */
    jobsHeading: string;
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
    /**
     * What a heading calls the county when the live layer has only geo-api's
     * identifier for it — "deiner Region" / "your region". Never the
     * identifier itself (F-2-73), and never an asserted county name, which
     * TS-026 D4 forbids without an anchor.
     */
    genericCounty: string;
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
   * The honest-gap register — the words a proof slot renders when nothing
   * clears (F-3-15). Same reason as `media` above: `empty-proof-slot` and
   * `objection-list` carried German defaults in their component bodies, so an
   * English visitor reading an otherwise fully translated page met
   * "KEIN NACHWEIS / Für diesen Kanal liegt uns noch kein Nachweis vor."
   * partway down.
   */
  proof: {
    /** The empty proof slot's badge — "Kein Nachweis". */
    none: string;
    /** What is missing, where the caller names no channel of its own. */
    noneForChannel: string;
    /** What is missing in a testimonial position (`/ueber-uns` block 3). */
    noneForTestimonial: string;
  };
  /**
   * The form controls' own words — the strings a component renders when the
   * page supplied none. `choice-group`'s empty state was a German literal in
   * the component body and rendered on `/en` too (F-2-33).
   */
  forms: {
    /** The step cannot be answered because the vocabulary is empty. */
    noOptions: string;
  };
  /**
   * `archive-filter`'s own chrome (TS-028 D4). Same failure class as
   * `forms.noOptions`: the component's defaults were hard-coded German and
   * rendered on `/en/about/archive` too (F-2-33 residue).
   */
  archiveFilter: {
    all: string;
    label: string;
    /** `{visible}` of `{total}` entries — both slots are filled by the component. */
    count: string;
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
    /** The submit control's label — "Suchen" on `/en` before F-2-33. */
    submit: string;
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
  /**
   * `/rechtliches` (EN `/legal`) — the one string of this dictionary that
   * exists in English only.
   *
   * TS-029 open point #2 and `state/open.md` row 53: `import.yaml` carries
   * no locale dimension, so the five imported documents plus the generated
   * accessibility statement exist in German, and DEC-027's English versions
   * arrive later through the same import. Row 53's mitigation is that the EN
   * page frame "states explicitly, in English, that the six legal sections
   * themselves are provided in German only — no machine translation, no
   * invented English legal text". It never shipped; the Customer met six
   * unannounced German bodies under English section labels at gate 2
   * (F-2-74, TS-007-A11 / TS-029).
   *
   * A German reader needs no such notice — the page is in her language — so
   * `de` is `null` and the German page renders nothing at all. `null`, not
   * an empty string, so the dictionary's own "no string is empty" check
   * keeps meaning what it says.
   */
  legal: {
    /** The section-nav heading on `/rechtliches`, where the artifact has none. */
    sectionsLabel: string;
    germanOnlyNotice: string | null;
  };
  /**
   * Page titles, keyed by route id — the fallback for a route whose artifact
   * carries no `seo.title` (TS-011 D5; the artifact is the source, F-2-72).
   */
  pages: Record<RouteId, string>;
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
    logoHome: "Schafe vorm Fenster — zur Startseite",
  },
  footer: {
    contact: "Kontakt",
    newsletter: "Newsletter",
    imprint: "Impressum",
    privacy: "Datenschutz",
    accessibility: "Barrierefreiheit",
    language: "Sprache",
  },
  newsletter: {
    heading: "Neuigkeiten aus dem Projekt",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "du@beispiel.de",
    submit: "Anmelden",
    consent: "Double-Opt-in, keine Cookies. Mit der Anmeldung stimmst du unserer %s zu.",
    consentLinkLabel: "Datenschutzerklärung",
    demoNote: "Es wird nichts verschickt — der Versand ist noch nicht angeschlossen.",
    successHeadline: "Notiert — hier in der Demo.",
    successBody:
      "Das ist die Demo-Fassung des Newsletters: Deine Adresse hat den Browser nicht verlassen, und angemeldet bist du damit nicht. Sobald der Versand steht, kannst du dich richtig eintragen.",
  },
  notFound: {
    title: "Seite nicht gefunden",
    body: "Diese Adresse gibt es nicht. Gib deine Postleitzahl ein, dann zeigen wir dir, was in deinem Ort los ist.",
    backHome: "Zur Startseite",
    jobsHeading: "Oder du bist mit einem anderen Anliegen hier:",
  },
  error: {
    title: "Da ist etwas schiefgelaufen",
    body: "Bitte versuche es noch einmal. Wenn es dann immer noch nicht klappt, warte ein paar Minuten und lade die Seite neu.",
    retry: "Erneut versuchen",
    backHome: "Zur Startseite",
  },
  live: {
    demoData: "Demo-Daten",
    stale: "Stand",
    snapshot: "Beispiel",
    genericCounty: "deiner Region",
    dates: "Termine",
    places: "Orte",
    updatesToday: "Aktualisierungen heute",
  },
  media: {
    photoWanted: "Foto gesucht",
    photoWantedHeadline: "Uns fehlt hier ein Bild aus deinem Ort.",
    notDepicting: "Nicht motivgenau · Platzhalter",
  },
  proof: {
    none: "Kein Nachweis",
    noneForChannel: "Für diesen Kanal liegt uns noch kein Nachweis vor.",
    noneForTestimonial:
      "Für Erfahrungsberichte von Veranstalter:innen liegt noch kein freigegebenes Zitat vor.",
  },
  forms: {
    noOptions: "Keine Auswahl verfügbar.",
  },
  archiveFilter: {
    all: "Alle",
    label: "Nach Typ filtern",
    count: "{visible} von {total} Einträgen",
  },
  search: {
    label: "Ort oder Postleitzahl",
    placeholder: "Postleitzahl",
    hint: "Bislang nur per Postleitzahl — die Ortssuche folgt.",
    submit: "Suchen",
  },
  outboundLink: {
    newTab: "öffnet neuen Tab",
    dataGoesTo: "Daten gehen an",
  },
  legal: {
    sectionsLabel: "Abschnitte",
    // The German page carries no notice: its six sections are German (F-2-74).
    germanOnlyNotice: null,
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
    logoHome: "Schafe vorm Fenster — to the home page",
  },
  footer: {
    contact: "Contact",
    newsletter: "Newsletter",
    imprint: "Imprint",
    privacy: "Privacy",
    accessibility: "Accessibility",
    language: "Language",
  },
  newsletter: {
    heading: "News from the project",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    submit: "Sign up",
    consent: "Double opt-in, no cookies. By signing up you agree to our %s.",
    consentLinkLabel: "privacy policy",
    demoNote: "Nothing is sent — the mailing system is not connected yet.",
    successHeadline: "Thank you — noted, in the demo.",
    successBody:
      "This is the demo version of the newsletter: your address never left the browser, and it does not sign you up. Once the mailing system is connected you will be able to subscribe for real.",
  },
  notFound: {
    title: "Page not found",
    body: "This address does not exist. Type your postcode and we will show you what is on where you live.",
    backHome: "To the home page",
    jobsHeading: "Or you are here for something else:",
  },
  error: {
    title: "Something went wrong",
    body: "Please try again. If it still does not work, give it a few minutes and reload the page.",
    retry: "Try again",
    backHome: "To the home page",
  },
  live: {
    demoData: "Demo data",
    stale: "As of",
    snapshot: "Example",
    genericCounty: "your region",
    dates: "dates",
    places: "places",
    updatesToday: "updates today",
  },
  media: {
    photoWanted: "Photo wanted",
    photoWantedHeadline: "We're missing a picture from your place here.",
    notDepicting: "Not an exact match · placeholder",
  },
  proof: {
    none: "No evidence",
    noneForChannel: "We have no evidence for this channel yet.",
    noneForTestimonial: "No cleared quote from an organiser is available yet.",
  },
  forms: {
    noOptions: "Nothing to choose from yet.",
  },
  archiveFilter: {
    all: "All",
    label: "Filter by type",
    count: "{visible} of {total} entries",
  },
  search: {
    label: "Place or postcode",
    placeholder: "Postcode",
    hint: "Postcode search only for now — search by name is coming.",
    submit: "Search",
  },
  outboundLink: {
    newTab: "opens new tab",
    dataGoesTo: "Data goes to",
  },
  legal: {
    sectionsLabel: "Sections",
    germanOnlyNotice:
      "The six legal sections below are available in German only. We do not machine-translate legal text and do not write an English substitute for it. The English documents follow once they exist.",
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

/** Every language that has a dictionary — used by the key-parity test. */
export const DICTIONARY_LOCALES = LOCALES;
