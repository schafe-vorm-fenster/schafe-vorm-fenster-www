/**
 * The `error` group of the UI-string dictionary — TS-WEB-0001 D7, issue 214.
 *
 * Its own module for one reason: `app/global-error.tsx` is a client
 * component that ships in the first-load JavaScript of **every** page, as
 * its own chunk. Importing `dictionary.ts` there put both languages' whole
 * dictionary into that chunk a second time (the chrome already carries it),
 * about 12 KB of script per page view for three strings. `dictionary.ts`
 * reads these objects in, so the dictionary stays the one source of every
 * UI string and `dictionary(locale).error` is exactly this.
 */

import type { Locale } from "./locales";

export interface ErrorCopy {
  title: string;
  body: string;
  retry: string;
  backHome: string;
}

export const ERROR_COPY: Readonly<Record<Locale, ErrorCopy>> = {
  de: {
    title: "Da ist etwas schiefgelaufen",
    body: "Bitte versuche es noch einmal. Wenn es dann immer noch nicht klappt, warte ein paar Minuten und lade die Seite neu.",
    retry: "Erneut versuchen",
    backHome: "Zur Startseite",
  },
  en: {
    title: "Something went wrong",
    body: "Please try again. If it still does not work, give it a few minutes and reload the page.",
    retry: "Try again",
    backHome: "To the home page",
  },
};
