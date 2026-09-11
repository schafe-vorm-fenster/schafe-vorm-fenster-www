/**
 * The mocked field sets for `envoy-form-mount`, one per lead surface kind
 * (TS-016 D1). The real widget's field set is part of the undelivered
 * contract (Q-022 C2) — these are the website's own conservative reading,
 * generic content per the dummy-content rule, replaced wholesale once the
 * real custom element lands.
 */
export const ENVOY_FORM_KINDS = ["contact", "quote", "order-invoice"] as const;

export type EnvoyFormKind = (typeof ENVOY_FORM_KINDS)[number];

export interface EnvoyFormField {
  readonly id: string;
  readonly label: string;
  readonly type: "text" | "email" | "tel";
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly multiline?: boolean;
}

const CONTACT_FIELDS: readonly EnvoyFormField[] = [
  { id: "name", label: "Name", type: "text", required: true },
  { id: "email", label: "E-Mail-Adresse", type: "email", required: true },
  { id: "message", label: "Nachricht", type: "text", multiline: true, required: true },
];

const QUOTE_FIELDS: readonly EnvoyFormField[] = [
  { id: "organisation", label: "Organisation", type: "text", required: true },
  { id: "name", label: "Name", type: "text", required: true },
  { id: "email", label: "E-Mail-Adresse", type: "email", required: true },
  { id: "phone", label: "Telefon (optional)", type: "tel" },
  { id: "message", label: "Worum geht es?", type: "text", multiline: true },
];

const ORDER_INVOICE_FIELDS: readonly EnvoyFormField[] = [
  { id: "authority", label: "Verwaltung / Organisation", type: "text", required: true },
  { id: "contact", label: "Ansprechperson", type: "text", required: true },
  { id: "email", label: "E-Mail-Adresse", type: "email", required: true },
  { id: "address", label: "Rechnungsadresse", type: "text", multiline: true, required: true },
];

export const ENVOY_FORM_FIELDS: Readonly<Record<EnvoyFormKind, readonly EnvoyFormField[]>> = {
  contact: CONTACT_FIELDS,
  quote: QUOTE_FIELDS,
  "order-invoice": ORDER_INVOICE_FIELDS,
};
