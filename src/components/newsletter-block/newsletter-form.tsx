"use client";

/**
 * The newsletter mock's own behaviour — the submit, and the confirmation it
 * swaps itself for (F-3-11).
 *
 * **Why a client component in a server-first tree.** `src/components/README.md`
 * allows the exception the behaviour requires, and this is the same one
 * `envoy-form-mount` takes: a form that must answer a click without leaving
 * the page is client behaviour, and nothing on the server can produce it.
 * The block that renders this is still a server component; only the `<form>`
 * and its one piece of state live here.
 *
 * What it fixes (C3-A-01/02/03, one defect in three manifestations): this was
 * the only `<form>` on the site with neither `action` nor `onSubmit`, so
 * "Anmelden" performed a real full-page GET navigation to the current path
 * with the current query **replaced** by the serialized form fields. An
 * unsent quote form came back empty, `/dein-kalender/bestellen` lost `?orte=`
 * and its place selection with it, `/mitmachen/registrieren` lost `?ort=` and
 * `?wer=` and fell back to step 1 — and the "submission" produced no banner,
 * no message, nothing at all.
 *
 * **Nothing leaves the browser, in any branch — unchanged.** The input still
 * carries no `name`, so even a submit that got past this handler would be a
 * request with no values in it (HTML: an unnamed control is not a successful
 * control). Q-020 (`state/open.md` row 22) stays open and untouched: this
 * fixes what the mock does to the page, not what it does with an address.
 *
 * The markup server-renders, so a visitor without JavaScript still sees the
 * complete, labelled form — she simply has no confirmation, which is the
 * same trade `envoy-form` and `archive-filter` make.
 */

import { useRef, useState } from "react";

import { Button } from "../button/button";

import type { ReactNode } from "react";

import styles from "./newsletter-block.module.css";

export interface NewsletterFormProps {
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly submitLabel: string;
  readonly successHeadline: string;
  readonly successBody: string;
  /** The consent sentence, built by the server component that owns the link. */
  readonly consent: ReactNode;
}

export function NewsletterForm({
  emailLabel,
  emailPlaceholder,
  submitLabel,
  successHeadline,
  successBody,
  consent,
}: NewsletterFormProps) {
  /**
   * Set synchronously, for the same reason `envoy-form` keeps one: two
   * `click()`s in one task never give React a re-render between them, so
   * `state` alone cannot refuse the second press (F-2-65's shape).
   */
  const submitted = useRef(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className={styles.success} role="status">
        <p className={styles.successHeadline}>{successHeadline}</p>
        <p className={styles.note}>{successBody}</p>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        // The whole point of the fix: no navigation, ever. The mock has no
        // destination, and the page it stands on is holding a visitor's
        // unsent work and her flow's step in the query string.
        event.preventDefault();
        if (submitted.current) return;
        submitted.current = true;
        setSent(true);
      }}
    >
      <label className={styles.label} htmlFor="newsletter-email">
        {emailLabel}
      </label>
      <div className={styles.field}>
        <input
          autoComplete="off"
          className={styles.input}
          id="newsletter-email"
          placeholder={emailPlaceholder}
          required
          type="email"
        />
        <Button size="compact" type="submit" variant="secondary">
          {submitLabel}
        </Button>
      </div>
      <p className={styles.note}>{consent}</p>
    </form>
  );
}
