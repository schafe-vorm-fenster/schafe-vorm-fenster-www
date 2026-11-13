/**
 * The mocked field sets for `envoy-form-mount`, one per lead surface kind
 * (TS-WEB-0016 D1). The real widget's field set is part of the undelivered
 * contract (Q-0022 C2) — these are the website's own conservative reading,
 * generic content per the dummy-content rule, replaced wholesale once the
 * real custom element lands.
 *
 * **Every label exists in both languages** (F-2-33). Before round 3 the set
 * was German-only, so an English visitor met "Organisation", "E-Mail-Adresse"
 * and "Absenden" on `/en/your-region/quote` — the primary action of a wired
 * conversion goal, in the wrong language. TS-WEB-0016 D2 passes the page language
 * to the real widget as an attribute for exactly this reason; the mock reads
 * it from the same prop.
 *
 * **Every field carries a bound** (F-2-38). 120 characters is what the BFF's
 * own search route admits (`app/api/places/search/route.ts`); a message body
 * gets 2000. The client bound and the eventual server bound are then the same
 * number rather than two opinions.
 */

import type { Locale } from "@/src/lib/i18n/locales";

/**
 * The two lead surfaces that exist — the quote request on `/deine-region/angebot`
 * and the order flow's invoice step (TS-WEB-0006-A17, DEC-0081 §5).
 *
 * The `contact` kind is **gone** (DEC-0122 §2). There is no general contact
 * form on this site any more: the footer's disclosure was replaced by the
 * contact section, which loads nothing and submits nothing. Deleting the kind
 * rather than leaving it unused makes a third mount point a type error first
 * and a failing walk second.
 */
export const ENVOY_FORM_KINDS = ["quote", "order-invoice"] as const;

export type EnvoyFormKind = (typeof ENVOY_FORM_KINDS)[number];

/** The bound a single-line field gets unless it names its own. */
export const FIELD_MAX_LENGTH = 120;

/** The bound a message body gets — long enough for a real enquiry. */
export const MESSAGE_MAX_LENGTH = 2000;

export interface EnvoyFormField {
  readonly id: string;
  readonly label: Readonly<Record<Locale, string>>;
  readonly type: "text" | "email" | "tel";
  readonly required?: boolean;
  readonly multiline?: boolean;
  /**
   * What the field is for, under its label — the one line that stops a
   * visitor guessing what "Leitweg-ID" wants from her. Optional: most fields
   * are their own explanation.
   */
  readonly hint?: Readonly<Record<Locale, string>>;
  /** `autocomplete`, so a browser can fill what the visitor has typed before. */
  readonly autoComplete?: string;
}

const QUOTE_FIELDS: readonly EnvoyFormField[] = [
  {
    id: "organisation",
    label: { de: "Organisation", en: "Organisation" },
    type: "text",
    required: true,
  },
  { id: "name", label: { de: "Name", en: "Name" }, type: "text", required: true },
  {
    id: "email",
    label: { de: "E-Mail-Adresse", en: "Email address" },
    type: "email",
    required: true,
  },
  { id: "phone", label: { de: "Telefon (optional)", en: "Phone (optional)" }, type: "tel" },
  {
    id: "message",
    label: { de: "Worum geht es?", en: "What is it about?" },
    type: "text",
    multiline: true,
  },
];

/**
 * The invoice step's field set is **specified**, not invented here: TS-WEB-0025 D6
 * fixes it, and `content/pages/dein-kalender/bestellen/*.md` writes the nine
 * labels out, four of them required. Until the polish pass this mount carried
 * four generic fields and the step advanced whether they were filled or not —
 * a public authority could "order" with an empty invoice.
 */
const ORDER_INVOICE_FIELDS: readonly EnvoyFormField[] = [
  {
    autoComplete: "organization",
    id: "authority",
    label: { de: "Körperschaft oder Behörde", en: "Public body or authority" },
    required: true,
    type: "text",
  },
  {
    id: "department",
    label: { de: "Amt oder Abteilung (optional)", en: "Department (optional)" },
    type: "text",
  },
  {
    autoComplete: "street-address",
    hint: {
      de: "Straße, Postleitzahl und Ort.",
      en: "Street, postcode and town.",
    },
    id: "address",
    label: { de: "Rechnungsanschrift", en: "Billing address" },
    multiline: true,
    required: true,
    type: "text",
  },
  {
    id: "billing-office",
    label: { de: "Abweichende Rechnungsstelle (optional)", en: "Different billing office (optional)" },
    type: "text",
  },
  {
    autoComplete: "name",
    id: "contact",
    label: { de: "Ansprechperson", en: "Contact person" },
    required: true,
    type: "text",
  },
  {
    autoComplete: "email",
    id: "email",
    hint: {
      de: "Hierhin geht der Einbindungscode.",
      en: "This is where the embed code goes.",
    },
    label: { de: "Dienstliche E-Mail-Adresse", en: "Work email address" },
    required: true,
    type: "email",
  },
  {
    id: "order-reference",
    label: { de: "Bestellzeichen (optional)", en: "Order reference (optional)" },
    type: "text",
  },
  {
    hint: {
      de: "Nur nötig, wenn ihr E-Rechnungen über den Bund oder ein Land empfangt.",
      en: "Only needed if you receive electronic invoices through a federal or state route.",
    },
    id: "routing-id",
    label: { de: "Leitweg-ID (optional)", en: "Routing ID (optional)" },
    type: "text",
  },
  {
    id: "vat-id",
    label: { de: "USt-IdNr. (optional)", en: "VAT ID (optional)" },
    type: "text",
  },
];

export const ENVOY_FORM_FIELDS: Readonly<Record<EnvoyFormKind, readonly EnvoyFormField[]>> = {
  quote: QUOTE_FIELDS,
  "order-invoice": ORDER_INVOICE_FIELDS,
};

/**
 * The words the form itself says — submit, success, the two spam refusals and
 * the honeypot's own label. Generated copy in the tone of voice, both
 * languages, with a `Dummy-Content` row in `state/open.md`; the real widget
 * brings its own strings once Q-0022 answers.
 */
export interface EnvoyFormWords {
  readonly submit: string;
  readonly sending: string;
  readonly successHeadline: string;
  readonly successBody: string;
  readonly tooFast: string;
  readonly honeypotLabel: string;
  /**
   * What a refused field says, and what the summary above the form says.
   *
   * Written rather than left to the browser: a native validation bubble
   * speaks the *browser's* language, not the page's, so an English visitor on
   * a German-locale machine met German, and a German visitor on an English
   * one met "Please fill in this field". Each message sits under the field it
   * is about, so it says what to do rather than repeating the field's name.
   */
  readonly missingField: string;
  readonly invalidEmail: string;
  /** The `role="alert"` line above the form, naming how many fields are open. */
  readonly checkFields: (count: number) => string;
  /** The mono marker beside a field that must be filled. */
  readonly requiredMark: string;
}

export const ENVOY_FORM_WORDS: Readonly<Record<Locale, EnvoyFormWords>> = {
  de: {
    submit: "Absenden",
    sending: "Wird gesendet …",
    successHeadline: "Danke — deine Anfrage ist angekommen.",
    successBody:
      "Das ist die Demo-Fassung des Formulars: Es wurde nichts verschickt und nichts gespeichert. Im fertigen Dorfkalender meldet sich ein Mensch bei dir.",
    tooFast: "Das ging sehr schnell. Sieh die Angaben noch einmal durch und schick sie dann ab.",
    honeypotLabel: "Dieses Feld bitte frei lassen",
    missingField: "Dieses Feld brauchen wir noch.",
    invalidEmail: "Diese Adresse sieht unvollständig aus — sie braucht ein @ und eine Domain.",
    checkFields: (count) =>
      count === 1
        ? "Ein Feld fehlt noch. Es ist unten markiert."
        : `${count} Felder fehlen noch. Sie sind unten markiert.`,
    requiredMark: "Pflichtfeld",
  },
  en: {
    submit: "Send",
    sending: "Sending …",
    successHeadline: "Thank you — your enquiry has arrived.",
    successBody:
      "This is the demo version of the form: nothing was sent and nothing was stored. In the finished product a person gets back to you.",
    tooFast: "That was very quick. Have another look at your details, then send them.",
    honeypotLabel: "Please leave this field empty",
    missingField: "We still need this one.",
    invalidEmail: "That address looks incomplete — it needs an @ and a domain.",
    checkFields: (count) =>
      count === 1
        ? "One field is still open. It is marked below."
        : `${count} fields are still open. They are marked below.`,
    requiredMark: "Required",
  },
};
