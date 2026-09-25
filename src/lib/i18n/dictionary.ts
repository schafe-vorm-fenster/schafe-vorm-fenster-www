/**
 * The UI-string dictionary — TS-WEB-0001 D7.
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
 * page's content frontmatter (TS-WEB-0011 D5, FUN-WEB-0089) and this block shrinks
 * to the chrome strings.
 */

import { LOCALES } from "@/src/lib/i18n/locales";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

export interface Dictionary {
  /** The site name, as it appears in the title template and `og:site_name`. */
  siteName: string;
  skipToContent: string;
  /** Header and context-band labels — the four jobs (TS-WEB-0004 D4). */
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
    /**
     * The phone header's disclosure (Jan's round-3 decision, state/open.md
     * rows 35 and 201): the burger's accessible name in both states, the
     * overlay's own name, and the close control.
     */
    menuOpen: string;
    menuClose: string;
    menuLabel: string;
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
   * the confirmation (TS-WEB-0016 S5, D10).
   *
   * German-only before F-2-33, in the footer of **every** `/en` route. The
   * note that named the open question behind the mock in visitor copy is
   * gone (F-2-35); so is the badge beside it — the marking lives in
   * `data-mock`, never in the page (Jan, 2026-09-18).
   */
  newsletter: {
    heading: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    /** `%s` is the privacy-policy link text. */
    consent: string;
    consentLinkLabel: string;
    /**
     * The confirmation the block swaps itself for (F-3-11). It replaces a
     * native GET submit that threw the whole page's state away. It reads
     * like a finished confirmation; what the mock does and does not do is
     * recorded in `state/open.md`, not in the page.
     */
    successHeadline: string;
    successBody: string;
  };
  /** The M2 scaffolding strings — every one of them disappears with the page. */
  notFound: {
    title: string;
    body: string;
    backHome: string;
    /** The heading over the four jobs on the 404 (TS-WEB-0004-A4's jobs band). */
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
    /** Tier 2's prefix — "Stand: <time>". */
    stale: string;
    /**
     * What a heading calls the county when the live layer has only geo-api's
     * identifier for it — "deiner Region" / "your region". Never the
     * identifier itself (F-2-73), and never an asserted county name, which
     * TS-WEB-0026 D4 forbids without an anchor.
     */
    genericCounty: string;
    /** The counter band's three units (TS-WEB-0008 D8). */
    dates: string;
    places: string;
    updatesToday: string;
    /**
     * The handover a live list carries instead of more rows. A list on a
     * marketing page is an example — three rows on a phone, five on a
     * desktop — and everything past that is in the calendar itself.
     */
    allDates: string;
  };
  /**
   * The section kickers — polish brief G-3's fixed vocabulary.
   *
   * "No section may begin with only a heading on a new colour." Each section
   * after the hero opens with a kicker naming its **role**, and the roles are
   * a closed set for the whole site: a page picks one, it does not write one.
   * That is why they live here and not in `content/pages/**` — they are not
   * the page's argument, they are the site's own signposting, and a page that
   * invented its own would put two names on the same joint.
   */
  kickers: {
    /** The live answer — this week's dates. */
    liveAnswer: string;
    /** The widened radius — one place over. */
    widerRadius: string;
    /** Why the thing matters. */
    whyItMatters: string;
    /** How the mechanism works. */
    howItWorks: string;
    /** The objection: why it snags today. */
    objection: string;
    /** The evidence: who already does this. */
    evidence: string;
    /** Price and scope. */
    price: string;
    /** Trust: how we work. */
    trust: string;
    /** Origin: where this comes from. */
    origin: string;
    /** The people behind it — `/ueber-uns`'s team block. */
    team: string;
    /**
     * The newsletter block, where a page carries one inline (TS-WEB-0027 D8) —
     * the same label the footer's own block already uses, so the site names
     * the thing once. The block's own heading is the page's authored one
     * ("Auf dem Laufenden bleiben"), which is why the kicker does not repeat
     * that sentence.
     */
    newsletter: string;
    /** The context band's other concerns. */
    otherConcerns: string;
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
   * The two price states that are words rather than figures (TS-WEB-0006 D10).
   *
   * They lived as German literal defaults inside `price-tag`, so
   * `/en/your-calendar` priced its free tier "Dauerhaft kostenfrei" and its
   * enterprise tier "Auf Anfrage" — the F-2-33 failure mode, on the page
   * that asks for money.
   */
  price: {
    /** The free tier's permanence statement — not a price. */
    permanent: string;
    /** No figure, no range, no "from". */
    onRequest: string;
  };
  /**
   * The flow progress row's sentence — the accessible name of the dot row
   * and the line beside it.
   *
   * It lived as a German literal default in `step-indicator`, and the order
   * flow passes no label of its own, so `/en/your-calendar/order` counted
   * "SCHRITT 3 VON 4" at an English visitor in the middle of a paid
   * conversion path (the F-2-33 failure mode).
   */
  steps: {
    of: (step: number, total: number) => string;
  };
  /**
   * `archive-filter`'s own chrome (TS-WEB-0028 D4). Same failure class as
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
   * `archive-row`'s own link label. It was a German literal in the component
   * body, so all 31 rows of `/en/about/archive` offered "Original ansehen"
   * — the same failure class as `archiveFilter` above (F-2-33).
   */
  archiveRow: {
    /** The outbound link to the outlet's own page. */
    original: string;
  };
  /**
   * `place-search`'s own words (TS-WEB-0008 D7). A page usually supplies its
   * own copy from content, but the component's default — used wherever a
   * page does not — hard-coded German and rendered it on `/en` too (F-2-4),
   * the same failure `live` and `media` above exist to prevent.
   *
   * None of them names a postcode, in either language: the search takes a
   * place name and offers nothing else (DEC-0079 §1, TS-WEB-0008-A16 —
   * `pnpm check:search-wording` reads these keys).
   */
  search: {
    label: string;
    placeholder: string;
    hint: string;
    /** The submit control's label — "Suchen" on `/en` before F-2-33. */
    submit: string;
    /** The typeahead listbox's accessible name. */
    suggestionsLabel: string;
    /** What the typeahead says when the index knows no such place. */
    noSuggestions: string;
    /**
     * The "use my location" control beside the field (TS-WEB-0010 D5,
     * TS-WEB-0008 D7's coordinates row). **Placeholder wording** — nobody has
     * written it (DEC-0119): rendered with `data-demo="true"`, listed in
     * `state/open.md`, replaced by the owner.
     */
    locate: string;
    /** What activating the control will do — D5: the control "states what will happen". Placeholder, see `locate`. */
    locateExplains: string;
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
   * TS-WEB-0029 open point #2 and `state/open.md` row 53: `import.yaml` carries
   * no locale dimension, so the five imported documents plus the generated
   * accessibility statement exist in German, and DEC-0027's English versions
   * arrive later through the same import. Row 53's mitigation is that the EN
   * page frame "states explicitly, in English, that the six legal sections
   * themselves are provided in German only — no machine translation, no
   * invented English legal text". It never shipped; the Customer met six
   * unannounced German bodies under English section labels at gate 2
   * (F-2-74, TS-WEB-0007-A11 / TS-WEB-0029).
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
   * `contact-section`'s own words (TS-WEB-0016 D13, DEC-0081, CG-031). The
   * values — number, address, who answers — are not here: they resolve from
   * the hub record through `src/lib/contact/contact-channels.ts`.
   *
   * Provenance, per key (DEC-0113): `rows.*` is the owner's wording from
   * `concept/website-copy-guide.md` CG-031 ("Videotermin buchen · per
   * WhatsApp schreiben · anrufen · Mail schreiben"); `portraitAlt` is the
   * cleared alt of `content/pages/ueber-uns/{de,en}.md` (image
   * `ueber-uns-team-jan-henrik-hempel`). `heading`, `lead`, `appointmentSub`
   * and `outboundNote` exist only as design-draft text and are placeholders:
   * the section carries `data-demo="true"` and `state/open.md` carries one
   * row per string.
   */
  contactSection: {
    heading: string;
    lead: string;
    portraitAlt: string;
    /** The four row titles, D13 order, ≤ 24 characters each (CG-031). */
    rows: {
      appointment: string;
      whatsapp: string;
      phone: string;
      mail: string;
    };
    /** Row 1's sub-label: what a booking covers — never a response time (CG-031). */
    appointmentSub: string;
    /**
     * The D16 outbound marking under row 1: what activating the control
     * does and who receives what follows. A separate `meta` line, never in
     * the label.
     */
    outboundNote: string;
  };
  /**
   * The three event statuses of SRC-0014 §Event-status badge, as words —
   * `event-status-badge` reads them, so a status is never colour alone.
   * The German words are the design system's own ids capitalised; the
   * English ones nobody wrote (`generated: true`, DEC-0115), so the badge
   * marks itself `data-demo` in that language until the owner replaces them.
   */
  eventStatus: {
    neu: string;
    verschoben: string;
    abgesagt: string;
    generated: boolean;
  };
  /**
   * The words inside the explain module's stage graphics (`explain-stage`,
   * DEC-0115). All three German strings are taken verbatim from the owner's
   * design drafts (`plan/reviews/2026-09-23/Design - 3-Schritte-erklären …`);
   * the English translation is nobody's wording yet (`generated: true`).
   */
  explainStage: {
    /** The label on the hatched flyer stand-in in the chat bubble. */
    flyerFile: string;
    /** The registration card's field label. */
    addressLabel: string;
    /** The registration card's lime pill — an illustration, never a control. */
    submit: string;
    generated: boolean;
  };
  /**
   * Page titles, keyed by route id — the fallback for a route whose artifact
   * carries no `seo.title` (TS-WEB-0011 D5; the artifact is the source, F-2-72).
   */
  pages: Record<RouteId, string>;
  /**
   * `/start`, the registration surface (TS-WEB-0016 D15/D17, DEC-0108,
   * DEC-0121). The route is German-only and outside `app/[lang]`, so only
   * `de` ever renders; `en` exists because the key set is one per language.
   *
   * The notice's three facts and its link target are the determination's
   * (D17); its **wording is not** — nobody has written it (DEC-0108 §2, "The
   * words"). `notice`, `noticeLink` and `frameTitle` are therefore
   * placeholders in the repository's convention: rendered with
   * `data-demo="true"` on the element and listed in `state/open.md`
   * (rows 223 and 224), for the owner to replace.
   */
  start: {
    /** The two facts before the link: whose form it is, and that loading it contacts them. */
    notice: string;
    /** The link's text — the third fact, where the detail is (`/rechtliches#datenschutz`). */
    noticeLink: string;
    /** The `iframe`'s accessible name. */
    frameTitle: string;
    /** Before the e-mail address — `lead-fallback.tsx`'s own line, verbatim. */
    emailLead: string;
  };
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
    menuOpen: "Menü öffnen",
    menuClose: "Menü schließen",
    menuLabel: "Menü",
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
    emailPlaceholder: "name@verein.de",
    submit: "Anmelden",
    consent: "Double-Opt-in, keine Cookies. Mit der Anmeldung stimmst du unserer %s zu.",
    consentLinkLabel: "Datenschutzerklärung",
    successHeadline: "Danke — notiert.",
    successBody:
      "Wir schicken dir gleich eine E-Mail zur Bestätigung. Erst nach deinem Klick darin bist du dabei.",
  },
  notFound: {
    title: "Seite nicht gefunden",
    body: "Diese Adresse gibt es nicht.",
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
    stale: "Stand",
    genericCounty: "deiner Region",
    dates: "Termine",
    places: "Orte",
    updatesToday: "Aktualisierungen heute",
    allDates: "Alle Termine im Kalender",
  },
  kickers: {
    liveAnswer: "Was gerade ansteht",
    widerRadius: "Einen Ort weiter",
    whyItMatters: "Warum das zählt",
    howItWorks: "So funktioniert es",
    objection: "Warum es heute hakt",
    evidence: "Wer das schon macht",
    price: "Was es kostet",
    trust: "Wie wir arbeiten",
    origin: "Wo das herkommt",
    team: "Wer dahintersteckt",
    newsletter: "Newsletter",
    otherConcerns: "Anderes Anliegen?",
  },
  forms: {
    noOptions: "Keine Auswahl verfügbar.",
  },
  price: {
    permanent: "Dauerhaft kostenfrei",
    onRequest: "Auf Anfrage",
  },
  steps: {
    of: (step, total) => `Schritt ${step} von ${total}`,
  },
  archiveFilter: {
    all: "Alle",
    label: "Nach Typ filtern",
    count: "{visible} von {total} Einträgen",
  },
  archiveRow: {
    original: "Original ansehen",
  },
  search: {
    // "Dein Ort": the owner's own label for this field (content/pages/deine-region/de.md:166);
    // "Ortsname": the noun the copy guide names in place of the postcode (concept/website-copy-guide.md:510).
    label: "Dein Ort",
    placeholder: "Ortsname",
    hint: "Tipp den Ortsnamen ein — Vorschläge kommen ab dem zweiten Buchstaben.",
    submit: "Suchen",
    suggestionsLabel: "Vorschläge",
    noSuggestions: "Kein Ort gefunden.",
    locate: "Meinen Standort verwenden",
    locateExplains: "Fragt den Browser einmal nach deinem Standort und öffnet den nächsten Ort. Gespeichert wird nichts.",
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
  contactSection: {
    // Placeholder — design draft (plan/reviews/2026-09-23/Design - Kontakt Section.png), state/open.md.
    heading: "Direkter Kontakt",
    // Placeholder — design draft, state/open.md.
    lead: "Per Video, WhatsApp, Telefon oder Mail.",
    // content/pages/ueber-uns/de.md, image `ueber-uns-team-jan-henrik-hempel`.
    portraitAlt: "Jan-Henrik Hempel erklärt etwas mit beiden Händen, hinter ihm Holzbalken.",
    // concept/website-copy-guide.md CG-031, the owner's four row titles.
    rows: {
      appointment: "Videotermin buchen",
      whatsapp: "Per WhatsApp schreiben",
      phone: "Anrufen",
      mail: "Mail schreiben",
    },
    // Placeholder — design draft, state/open.md.
    appointmentSub: "Termin im Kalender aussuchen",
    // Placeholder — the D16 sentence is copy nobody wrote yet, state/open.md.
    outboundNote: "Öffnet den Buchungskalender bei Google.",
  },
  eventStatus: {
    neu: "Neu",
    verschoben: "Verschoben",
    abgesagt: "Abgesagt",
    generated: false,
  },
  explainStage: {
    flyerFile: "FLYER.JPG",
    addressLabel: "Kalender-Adresse",
    submit: "Anmelden",
    generated: false,
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
  start: {
    notice:
      "Dieses Anmeldeformular stellt Google bereit. Beim Laden dieser Seite werden Daten an Google übertragen.",
    noticeLink: "Mehr dazu in den Datenschutzhinweisen.",
    frameTitle: "Anmeldeformular bei Google Forms",
    emailLead: "oder per E-Mail:",
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
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuLabel: "Menu",
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
    emailPlaceholder: "name@yourgroup.org",
    submit: "Sign up",
    consent: "Double opt-in, no cookies. By signing up you agree to our %s.",
    consentLinkLabel: "privacy policy",
    successHeadline: "Thank you — noted.",
    successBody:
      "We are sending you a confirmation email. You are on the list once you have clicked the link in it.",
  },
  notFound: {
    title: "Page not found",
    body: "This address does not exist.",
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
    stale: "As of",
    genericCounty: "your region",
    dates: "dates",
    places: "places",
    updatesToday: "updates today",
    allDates: "All dates in the calendar",
  },
  kickers: {
    liveAnswer: "What's on now",
    widerRadius: "One place over",
    whyItMatters: "Why it matters",
    howItWorks: "How it works",
    objection: "Why it snags today",
    evidence: "Who already does this",
    price: "What it costs",
    trust: "How we work",
    origin: "Where this comes from",
    team: "Who is behind it",
    newsletter: "Newsletter",
    otherConcerns: "Something else today?",
  },
  forms: {
    noOptions: "Nothing to choose from yet.",
  },
  price: {
    permanent: "Free, permanently",
    onRequest: "On request",
  },
  steps: {
    of: (step, total) => `Step ${step} of ${total}`,
  },
  archiveFilter: {
    all: "All",
    label: "Filter by type",
    count: "{visible} of {total} entries",
  },
  archiveRow: {
    original: "View the original",
  },
  search: {
    // "Your place": the owner's own label for this field (content/pages/deine-region/en.md:167);
    // "place name": the copy guide's noun for the postcode (concept/website-copy-guide.md:533).
    label: "Your place",
    placeholder: "Place name",
    hint: "Type the place name — suggestions start at the second letter.",
    submit: "Search",
    suggestionsLabel: "Suggestions",
    noSuggestions: "No place found.",
    locate: "Use my location",
    locateExplains: "Asks your browser once for your location and opens the nearest place. Nothing is stored.",
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
  contactSection: {
    // Placeholder — design draft, state/open.md.
    heading: "Direct contact",
    // Placeholder — design draft, state/open.md.
    lead: "By video, WhatsApp, phone or mail.",
    // content/pages/ueber-uns/en.md, image `ueber-uns-team-jan-henrik-hempel`.
    portraitAlt: "Jan-Henrik Hempel explaining something with both hands raised, timber beams behind him.",
    // The CG-031 titles in English; "Book a video call" is the hub's own label
    // for the schedule link (@schafe-vorm-fenster/people, jan-henrik-hempel).
    rows: {
      appointment: "Book a video call",
      whatsapp: "Write on WhatsApp",
      phone: "Call",
      mail: "Write an e-mail",
    },
    // Placeholder — design draft, state/open.md.
    appointmentSub: "Pick a slot in the calendar",
    // Placeholder — the D16 sentence is copy nobody wrote yet, state/open.md.
    outboundNote: "Opens the booking calendar at Google.",
  },
  // Nobody wrote these three words yet — state/open.md row 219.
  eventStatus: {
    neu: "New",
    verschoben: "Postponed",
    abgesagt: "Cancelled",
    generated: true,
  },
  // The file name stays; the two labels are a translation nobody wrote —
  // state/open.md row 220.
  explainStage: {
    flyerFile: "FLYER.JPG",
    addressLabel: "Calendar address",
    submit: "Register",
    generated: true,
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
  start: {
    notice:
      "This registration form is provided by Google. Loading this page sends data to Google.",
    noticeLink: "More in the privacy notice.",
    frameTitle: "Registration form at Google Forms",
    emailLead: "or by e-mail:",
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
