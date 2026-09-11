/**
 * The mocked field sets for `envoy-form-mount`, one per lead surface kind
 * (TS-016 D1). The real widget's field set is part of the undelivered
 * contract (Q-022 C2) — these are the website's own conservative reading,
 * generic content per the dummy-content rule, replaced wholesale once the
 * real custom element lands.
 *
 * **Every label exists in both languages** (F-2-33). Before round 3 the set
 * was German-only, so an English visitor met "Organisation", "E-Mail-Adresse"
 * and "Absenden" on `/en/your-region/quote` — the primary action of a wired
 * conversion goal, in the wrong language. TS-016 D2 passes the page language
 * to the real widget as an attribute for exactly this reason; the mock reads
 * it from the same prop.
 *
 * **Every field carries a bound** (F-2-38). 120 characters is what the BFF's
 * own search route admits (`app/api/places/search/route.ts`); a message body
 * gets 2000. The client bound and the eventual server bound are then the same
 * number rather than two opinions.
 */

import type { Locale } from "@/src/lib/i18n/locales";

export const ENVOY_FORM_KINDS = ["contact", "quote", "order-invoice"] as const;

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
}

const CONTACT_FIELDS: readonly EnvoyFormField[] = [
  { id: "name", label: { de: "Name", en: "Name" }, type: "text", required: true },
  {
    id: "email",
    label: { de: "E-Mail-Adresse", en: "Email address" },
    type: "email",
    required: true,
  },
  {
    id: "message",
    label: { de: "Nachricht", en: "Message" },
    type: "text",
    multiline: true,
    required: true,
  },
];

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

const ORDER_INVOICE_FIELDS: readonly EnvoyFormField[] = [
  {
    id: "authority",
    label: { de: "Verwaltung / Organisation", en: "Administration / organisation" },
    type: "text",
    required: true,
  },
  {
    id: "contact",
    label: { de: "Ansprechperson", en: "Contact person" },
    type: "text",
    required: true,
  },
  {
    id: "email",
    label: { de: "E-Mail-Adresse", en: "Email address" },
    type: "email",
    required: true,
  },
  {
    id: "address",
    label: { de: "Rechnungsadresse", en: "Billing address" },
    type: "text",
    multiline: true,
    required: true,
  },
];

export const ENVOY_FORM_FIELDS: Readonly<Record<EnvoyFormKind, readonly EnvoyFormField[]>> = {
  contact: CONTACT_FIELDS,
  quote: QUOTE_FIELDS,
  "order-invoice": ORDER_INVOICE_FIELDS,
};

/**
 * The words the form itself says — submit, success, the two spam refusals and
 * the honeypot's own label. Generated copy in the tone of voice, both
 * languages, with a `Dummy-Content` row in `state/open.md`; the real widget
 * brings its own strings once Q-022 answers.
 */
export interface EnvoyFormWords {
  readonly submit: string;
  readonly sending: string;
  readonly successHeadline: string;
  readonly successBody: string;
  readonly tooFast: string;
  readonly honeypotLabel: string;
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
  },
  en: {
    submit: "Send",
    sending: "Sending …",
    successHeadline: "Thank you — your enquiry has arrived.",
    successBody:
      "This is the demo version of the form: nothing was sent and nothing was stored. In the finished product a person gets back to you.",
    tooFast: "That was very quick. Have another look at your details, then send them.",
    honeypotLabel: "Please leave this field empty",
  },
};
