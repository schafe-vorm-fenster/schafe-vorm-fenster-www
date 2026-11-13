/**
 * The summary and the core facts of `/llms.txt` — FUN-WEB-0170, TS-WEB-0004
 * D1, criterion TS-WEB-0004-A13.
 *
 * **Derived where the site already holds the value, sourced where it does
 * not.** A value a page also shows is read from the module that page reads,
 * never typed a second time:
 *
 * | Fact | Read from (the page's own source) |
 * | --- | --- |
 * | the three prices | `tierPrice()` + `formatPriceFigure()` (the `/dein-kalender` tier rows), `dictionary().price` (the on-request and permanence words) |
 * | provider name and seat | `organizationIdentitySync()` — `content/legal/imprint.md`, the same parse the `Organization` JSON-LD uses |
 * | e-mail, phone, WhatsApp | `contactDisplayValue()` — `src/generated/contact-channels.json`, built from `@schafe-vorm-fenster/goals#contact-channels.md` |
 * | appointment link | `BRIEFING_URL`, the contact section's own value |
 * | languages | `LOCALES` |
 *
 * Every other sentence is a fact of a hub record, named in the comment beside
 * it. The wording is this file's; the claim is the record's, inside the
 * record's own limits (the in-operation proof forbids "ununterbrochen", the
 * enterprise offering forbids its figure). `llms-txt.test.ts` holds each
 * sourced fact against the hub package it names, read at test time, so a
 * record that changes fails the suite before this file says something the
 * hub no longer does.
 *
 * Product names stay out (CON-WEB-0058, DEC-0052 §1), and so do competitor
 * names while Q-0009 is open (TS-WEB-0011-A11).
 */

import { formatPriceFigure } from "@/src/components/price-tag/format";
import { contactDisplayValue } from "@/src/lib/contact/contact-channels";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { BRIEFING_URL } from "@/src/lib/live/briefing";
import { publishedFigure, tierPrice } from "@/src/lib/pricing/offerings";
import { organizationIdentitySync } from "@/src/lib/seo/structured-data/organization-data";

import type { PriceFigure } from "@/src/components/price-tag/format";
import type { Locale } from "@/src/lib/i18n/locales";

/**
 * The founder, as `@schafe-vorm-fenster/people#jan-henrik-hempel` names him
 * (`name`, `role: Founder, technical lead, and software architect`) and as the
 * imprint names the managing director. The imprint parse does not expose that
 * line, so the name is held here once and the test reads both sources.
 */
const FOUNDER = "Jan-Henrik Hempel";

/**
 * The one `>` line. Source: `@schafe-vorm-fenster/offerings#community-calendar`
 * `summary` — "The free, public community calendar, marketed in German as
 * Dorfkalender: everything happening in one place and its surroundings,
 * readable without login and publishable by any local actor." The
 * "Veranstaltungskalender" is DEC-0018's own search phrase.
 */
const SUMMARY: Readonly<Record<Locale, string>> = {
  de: "Schafe vorm Fenster macht den Dorfkalender, einen öffentlichen Veranstaltungskalender für Dörfer: Er zeigt, was in einem Ort und in den Nachbarorten ansteht. Lesen und Veröffentlichen kosten nichts.",
  en: "Schafe vorm Fenster makes the Dorfkalender, a public event calendar for villages in Germany: it shows what is coming up in a place and in the villages next door. Reading and publishing are free.",
};

export function llmsSummary(locale: Locale): string {
  return SUMMARY[locale];
}

function figure(price: PriceFigure | undefined, locale: Locale): string {
  if (price === undefined) throw new Error("llms.txt: a tier without a figure (TS-WEB-0018 D2/D3)");
  return formatPriceFigure(price, locale);
}

function closed(text: string): string {
  return text.endsWith(".") ? text : `${text}.`;
}

/** One fact per line, `Label: value`, in the order a reader asks. */
export function llmsFacts(locale: Locale): readonly string[] {
  const words = dictionary(locale).price;
  const identity = organizationIdentitySync();
  const seat = `${identity.postalCode} ${identity.addressLocality}`;
  const mail = contactDisplayValue("mail");
  const phone = contactDisplayValue("phone");
  const whatsapp = contactDisplayValue("whatsapp");
  // The hub lists one number for both rows today; say so once if it is one.
  const numbers = phone === whatsapp;

  const free = figure(tierPrice("community-calendar", locale).figure, locale);
  // "480 € / Jahr, zzgl. USt." already ends a sentence; "excl. VAT" does not.
  const own = closed(formatPriceFigure(publishedFigure("portalize-calendar", locale), locale));

  if (locale === "de") {
    return [
      // offerings#community-calendar, "What It Is" and "Commercial Model":
      // club meetings, council and fire-brigade sessions, the baker's van
      // route; "No login, no registration, no app".
      "Was es ist: Der Dorfkalender sammelt die Termine eines Orts an einer Stelle, vom Vereinstreffen über die Sitzung des Gemeinderats bis zur Tour des Bäckerwagens. Lesen geht im Browser, ohne Anmeldung und ohne App.",
      // offerings#community-calendar `audience_fit` (rural-residents, actors,
      // municipalities); messaging positioning slot 1 (Vereine, Initiativen,
      // Kirchengemeinden, Feuerwehren); offerings#portalize-calendar and
      // #portalize-enterprise `audience_fit` (municipalities, institutions,
      // counties).
      "Für wen: Menschen in Dörfern, die wissen wollen, was los ist. Vereine, Initiativen, Kirchengemeinden, Feuerwehren und Gemeinden, die ihre Termine veröffentlichen. Gemeinden, Institutionen und Landkreise, die einen Kalender auf ihrer eigenen Website zeigen.",
      // offerings#community-calendar, "For publishers": own Google Calendar,
      // a flyer photo by WhatsApp or e-mail, a website dates are imported from.
      "Termine eintragen: kostenlos nach einmaliger Anmeldung, über den eigenen Google Kalender, als Foto vom Flyer per WhatsApp oder E-Mail oder per Import von einer Website.",
      // Price: offerings.ts (tier row of /dein-kalender). Scope:
      // offerings#community-calendar `price.note`.
      `Dorfkalender: ${free} (${words.permanentNote}), für Lesende und für alle, die Termine veröffentlichen.`,
      // Price: offerings.ts. Scope: offerings#portalize-calendar `summary`.
      `Kalender für die eigene Website: ${own} Er zeigt die Termine des Dorfkalenders, gefiltert nach Orten, Veranstaltern und Kategorien, eingebunden in die eigene Website, in deren Design.`,
      // Price word: dictionary (the tier row's own). Scope:
      // offerings#portalize-enterprise `summary`. Its figure is never read.
      `Regionalkalender für ein ganzes Kreisgebiet: ${words.onRequest}, ${words.onRequestNote}. Derselbe Kalender für Landkreise und große Gemeinden, dazu eine Kartenansicht der Termine.`,
      // proof#regional-footprint (cleared): four Länder; "der Altkreis
      // Uecker-Randow ist am längsten dabei".
      "Region: Der Dorfkalender läuft in Mecklenburg-Vorpommern, Brandenburg, Niedersachsen und Baden-Württemberg, am längsten im früheren Kreis Uecker-Randow in Vorpommern.",
      // proof#in-operation-since-2018 (cleared, valid_until 2027-09-10):
      // "seit 2018 in Betrieb", earliest evidence Nordkurier, June 2018.
      "Geschichte: seit 2018 in Betrieb, der erste Pressebericht erschien im Juni 2018 im Nordkurier.",
      // Name and seat: imprint. Founder: people#jan-henrik-hempel; former
      // volunteer mayor: proof#founder-former-volunteer-mayor ("ehemalig",
      // the end of the term is open, so no year is given).
      `Anbieter: ${identity.legalName}, ${seat} (Vorpommern). Gründer und Geschäftsführer: ${FOUNDER}, früher ehrenamtlicher Bürgermeister der Gemeinde Schmatzin.`,
      // proof#noerd-award-2026-smart-community (cleared): category, Bitkom
      // patronage, NØRD digital convention Rostock, 2026-05-28. CG-027: the
      // win as a sentence.
      "Auszeichnung: Schafe vorm Fenster hat den NØRD Award 2026 in der Kategorie Smart Community gewonnen (Schirmherr: Bitkom e. V.), verliehen am 28. Mai 2026 auf der NØRD digital convention in Rostock.",
      `Kontakt: E-Mail ${mail}, ${numbers ? `Telefon und WhatsApp ${phone}` : `Telefon ${phone}, WhatsApp ${whatsapp}`}, Videotermin über ${BRIEFING_URL}.`,
      // LOCALES; the legal note is the English legal page's own
      // (dictionary `legal`, DEC-0027).
      "Sprachen: Deutsch (Hauptsprache) und Englisch. Die Rechtstexte gibt es nur auf Deutsch.",
    ];
  }

  // The English mirror (CG-041): same records, same order, same figures.
  return [
    "What it is: the village calendar collects the dates of a place in one spot, from club meetings and council sessions to the route of the baker's van. Anyone can read it in the browser, without an account and without an app.",
    "Who it is for: people in villages who want to know what is on. Clubs, initiatives, parishes, fire brigades and municipalities that publish their dates. Municipalities, institutions and counties that show a calendar on their own website.",
    "Adding dates: free after a one-time sign-up, from the publisher's own Google Calendar, as a photo of the flyer by WhatsApp or e-mail, or imported from a website.",
    `Village calendar (Dorfkalender): ${free} (${words.permanentNote}), for readers and for everyone who publishes dates.`,
    `Calendar for your own website: ${own} It shows the village calendar's dates, filtered by place, organiser and category, embedded in the organisation's own website, in that website's design.`,
    `Regional calendar for a whole district: ${words.onRequest.toLowerCase()}, ${words.onRequestNote}. The same calendar for counties and large municipalities, with a map view of the dates.`,
    "Region: the village calendar runs in Mecklenburg-Vorpommern, Brandenburg, Lower Saxony and Baden-Württemberg, longest in the former Uecker-Randow district in Vorpommern.",
    "History: in operation since 2018; the first press report appeared in the Nordkurier in June 2018.",
    `Provider: ${identity.legalName}, ${seat} (Vorpommern, Germany). Founder and managing director: ${FOUNDER}, a former volunteer mayor of the municipality of Schmatzin.`,
    "Award: Schafe vorm Fenster won the NØRD Award 2026 in the Smart Community category (patron: Bitkom e. V.), presented on 28 May 2026 at the NØRD digital convention in Rostock.",
    `Contact: e-mail ${mail}, ${numbers ? `phone and WhatsApp ${phone}` : `phone ${phone}, WhatsApp ${whatsapp}`}, video call booking at ${BRIEFING_URL}.`,
    "Languages: German (main language) and English. The legal texts exist in German only.",
  ];
}
