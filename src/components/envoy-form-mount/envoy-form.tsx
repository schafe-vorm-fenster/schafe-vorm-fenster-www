"use client";

/**
 * The mocked envoy form's own behaviour — submit, spam gate, success.
 *
 * **Why a client component in a server-first tree.** `src/components/README.md`
 * allows the exception the inventory itself requires, and this is one: TS-016
 * D2 fixes the real integration as a *custom element* the browser loads and
 * runs, so the thing being mocked is client behaviour. Three round-2 findings
 * are exactly that behaviour and cannot be answered on the server:
 *
 *  - **F-2-65** — two `click()`s on "Absenden" with no wait between them fired
 *    `request-licence-quote` twice. The button disables itself on the first
 *    submit and the goal is keyed on the completed submission, not on the
 *    click, so a second press has nothing left to fire.
 *  - **F-2-66** — a clean submission left the fields empty and the page
 *    otherwise unchanged: nothing distinguished "submitted" from "just
 *    loaded". The form is replaced by a labelled success message that takes
 *    focus (TS-016-A9).
 *  - **F-2-48** — the honeypot and the timing gate of TS-016-A10. Both are
 *    the website's half of C4; the widget owns the server half.
 *
 * The markup still server-renders, so a visitor without JavaScript sees the
 * complete form rather than a dead slot — it simply has no success state,
 * which is the same trade `archive-filter` makes (TS-028 D4/D5).
 *
 * **Nothing leaves the browser, in any branch.** No field carries a `name`,
 * so even a submitted form is a request with no values in it (HTML: an
 * unnamed control is not a successful control), and the submit handler
 * cancels the default anyway. This component performs no navigation at all.
 */

import { useEffect, useId, useRef, useState } from "react";

import { getAnalyticsTracker } from "@/src/lib/analytics";

import { ENVOY_FORM_WORDS, type EnvoyFormField, type EnvoyFormKind } from "./fields";
import { FIELD_MAX_LENGTH, MESSAGE_MAX_LENGTH } from "./fields";

import type { ConversionBinding } from "../conversion-tracker/conversion-tracker";
import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

import styles from "./envoy-form-mount.module.css";

/**
 * TS-016-A10's timing threshold. A human filling in four fields needs longer
 * than this; a script does not. Deliberately short enough that a fast, honest
 * visitor is never refused twice — the refusal is a sentence, not a lockout.
 */
export const MIN_SUBMIT_MS = 2500;

export interface EnvoyFormProps {
  readonly kind: EnvoyFormKind;
  readonly locale: Locale;
  readonly fields: readonly EnvoyFormField[];
  readonly badge?: ReactNode;
  readonly conversion?: ConversionBinding;
  /**
   * `false` where the form stands **inside a flow** and the step's own
   * control is the action (order step 3, TS-025 D2).
   *
   * F-2-51: that step used to render this form's "Absenden" *and* the step's
   * "Weiter" — two calls to action, and the one a visitor filling in invoice
   * details reaches for did nothing at all. A form embedded in a flow does
   * not own the advance; the step does.
   */
  readonly ownSubmit?: boolean;
  /**
   * The conversion marker on the submit control (TS-006 D3). Where this form
   * *is* the step's or the page's one action — order step 3, the quote page —
   * the marker belongs on its button and nowhere else.
   */
  readonly submitDataCta?: string;
  /** Attributes the real widget would carry (D2), rendered on the element. */
  readonly elementAttributes: Readonly<Record<string, string>>;
  readonly className?: string;
}

export function EnvoyForm({
  kind,
  locale,
  fields,
  badge,
  conversion,
  ownSubmit = true,
  submitDataCta,
  elementAttributes,
  className,
}: EnvoyFormProps) {
  const words = ENVOY_FORM_WORDS[locale];
  const honeypotId = useId();
  const successRef = useRef<HTMLDivElement>(null);
  /**
   * When the form appeared, for the timing gate below. Stamped in an effect
   * rather than during render: a render is pure, and the stamp we want is
   * "when the visitor could first have typed", which is mount time anyway.
   */
  const openedAt = useRef<number>(0);
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);
  /**
   * The authoritative "this form has been submitted" flag.
   *
   * `disabled` and the `state` below both need a re-render to take effect,
   * and two `click()` calls issued in the *same* task never give React one —
   * which is exactly how the chaos run fired `request-licence-quote` twice
   * from one user action (F-2-65, C-H-7). A ref is set synchronously, so the
   * second press in that pair reads it already set.
   */
  const submitted = useRef(false);
  const [state, setState] = useState<"open" | "submitting" | "sent">("open");
  const [refusal, setRefusal] = useState<string | undefined>(undefined);

  if (state === "sent") {
    return (
      <div
        className={[styles.mount, className].filter(Boolean).join(" ")}
        data-envoy-state="sent"
      >
        <div className={styles.success} ref={successRef} role="status" tabIndex={-1}>
          {badge}
          <p className={styles.successHeadline}>{words.successHeadline}</p>
          <p className={styles.successBody}>{words.successBody}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      className={[styles.mount, className].filter(Boolean).join(" ")}
      data-envoy-state={state}
      onSubmit={(event) => {
        // The mock has no destination at all: no field carries a `name`, so
        // even the default submit would be a request with nothing in it.
        event.preventDefault();
        if (submitted.current || state !== "open") return;

        const form = event.currentTarget;
        const honeypot = form.elements.namedItem(honeypotId);
        const filled =
          honeypot instanceof HTMLInputElement ? honeypot.value.trim() !== "" : false;

        // TS-016-A10: a filled honeypot and a submission faster than the
        // threshold are both refused. The honeypot refusal says nothing — a
        // bot learns from an error message; a human never sees this branch.
        if (filled) {
          submitted.current = true;
          setState("sent");
          return;
        }
        if (Date.now() - openedAt.current < MIN_SUBMIT_MS) {
          setRefusal(words.tooFast);
          // The stamp is not reset: it is measured from when the form
          // appeared, so reading this sentence and pressing again is already
          // long enough. The refusal is a sentence, not a lockout.
          return;
        }

        // One event per completed submission, keyed on the step being
        // completed rather than on the click that completed it (TS-012-A5,
        // TS-016-A12) — a second press cannot reach this line.
        submitted.current = true;
        setState("sent");
        setRefusal(undefined);
        if (conversion !== undefined) {
          getAnalyticsTracker().trackConversion(
            conversion.goalId,
            conversion.stage,
            conversion.attributes,
          );
        }

        // Nothing is submitted anywhere — the form has no destination and no
        // named control (D5). Focus moves to the success message instead
        // (TS-016-A9); the node exists after this render, so the move waits
        // for it.
        event.preventDefault();
        requestAnimationFrame(() => successRef.current?.focus());
      }}
      {...elementAttributes}
    >
      {badge}
      {fields.map((field) => (
        <div className={styles.field} key={field.id}>
          <label className={styles.label} htmlFor={`envoy-${kind}-${field.id}`}>
            {field.label[locale]}
          </label>
          {field.multiline ? (
            <textarea
              className={styles.textarea}
              id={`envoy-${kind}-${field.id}`}
              maxLength={MESSAGE_MAX_LENGTH}
              required={field.required}
              rows={4}
            />
          ) : (
            <input
              className={styles.input}
              id={`envoy-${kind}-${field.id}`}
              maxLength={FIELD_MAX_LENGTH}
              required={field.required}
              type={field.type}
            />
          )}
        </div>
      ))}

      {/* TS-016-A10's honeypot: in the DOM, hidden from assistive technology,
          not focusable, and — like every other field here — unnamed, so it
          carries nothing out of the browser either. */}
      <div aria-hidden="true" className={styles.honeypot}>
        <label htmlFor={honeypotId}>{words.honeypotLabel}</label>
        <input autoComplete="off" id={honeypotId} tabIndex={-1} type="text" />
      </div>

      {refusal === undefined ? null : (
        <p className={styles.refusal} role="alert">
          {refusal}
        </p>
      )}

      {ownSubmit ? (
        <button
          className={styles.submit}
          data-cta={submitDataCta}
          disabled={state !== "open"}
          type="submit"
        >
          {state === "open" ? words.submit : words.sending}
        </button>
      ) : null}
    </form>
  );
}
