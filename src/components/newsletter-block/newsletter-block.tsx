import { Button } from "../button/button";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { RouteLink } from "../route-link/route-link";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./newsletter-block.module.css";

export interface NewsletterBlockProps {
  readonly heading?: string;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 49 `newsletter-block` [PROPOSED] — TS-016 D10, S5, decision D-4.
 *
 * Structure: email address only, double opt-in, no cookie, no persistent
 * identifier; consent wording links `/rechtliches#datenschutz`. Footer on
 * every page; inline once on `/ueber-uns` (permitted only there).
 * States: Q-020 (the sending system) is unanswered, so per the mock rule
 * this ships as a labelled mock — full UX, `demo-data-badge`, and a
 * `Mock aktiv` row (`state/open.md` row 22). No `state` prop: the mock is
 * not late data arriving, it is the permanent M2 shape until Q-020 answers.
 * The email input carries no `name` — the one way a plain, no-JS `<form>`
 * can offer the full control surface (label, type="email", required) while
 * genuinely submitting nothing: an unnamed control is not a successful
 * control (HTML forms), so no address ever leaves the browser even if the
 * form is submitted before Q-020 wires a real destination.
 * Inherits: secondary treatment; the page still contains zero
 * `data-cta="primary"` elements on `/ueber-uns`.
 * Space: fixed height including the note line, so validation text never
 * shifts the footer.
 * A11y: label bound by `htmlFor`; the consent text is real content, not a
 * tooltip.
 */
export function NewsletterBlock({
  heading = "Neuigkeiten aus dem Projekt",
  locale = "de",
  className,
}: NewsletterBlockProps) {
  return (
    <div className={[styles.block, className].filter(Boolean).join(" ")}>
      <p className={styles.heading}>{heading}</p>
      <form className={styles.form}>
        <label className={styles.label} htmlFor="newsletter-email">
          E-Mail-Adresse
        </label>
        <div className={styles.field}>
          <input
            autoComplete="off"
            className={styles.input}
            id="newsletter-email"
            placeholder="du@beispiel.de"
            required
            type="email"
          />
          <Button size="compact" type="submit" variant="secondary">
            Anmelden
          </Button>
        </div>
        <p className={styles.note}>
          Double-Opt-in, keine Cookies. Mit der Anmeldung stimmst du unserer{" "}
          <RouteLink hash="datenschutz" locale={locale} to="legal">
            Datenschutzerklärung
          </RouteLink>{" "}
          zu.
        </p>
      </form>
      <p className={styles.note}>
        <DemoDataBadge /> — es wird nichts verschickt, solange Q-020 offen ist.
      </p>
    </div>
  );
}
