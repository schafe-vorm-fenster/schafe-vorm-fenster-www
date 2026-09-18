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
 * cancels the default anyway. The one navigation it performs is `advanceHref`
 * — a flow's own next step, a path this site already knows, with no field
 * value anywhere near it.
 *
 * **It validates before it does either** (polish pass). The order flow's step
 * 3 advanced whether the invoice was filled in or not, because the advance
 * was a link standing beside the form rather than the form's own submit. The
 * messages are written here, in both languages, because a native validation
 * bubble speaks the browser's language and not the page's.
 */

import Link from "next/link";

import { Icon } from "../icon/icon";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

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

const subscribeNever = () => () => {};
const hydratedSnapshot = () => true;
const serverSnapshot = () => false;

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
  /**
   * Where a **valid** submission goes next, where this form stands inside a
   * flow and the step's advance is the form's own submit (order step 3).
   *
   * Until the polish pass the advance was a link *beside* the form: the step
   * moved on whether the invoice was filled in or not, so an order could be
   * placed with nothing in it. With this set, the one control on the step
   * validates first and navigates only if every required field is answered.
   */
  readonly advanceHref?: string;
  /** The submit's own label, where it is a step's advance rather than "send". */
  readonly submitLabel?: string;
  /** What the submit says while the next step is loading (F-2-67). */
  readonly pendingLabel?: string;
  /** Attributes the real widget would carry (D2), rendered on the element. */
  readonly elementAttributes: Readonly<Record<string, string>>;
  readonly className?: string;
}

/**
 * The one shape an email has to have before this form will pass it on: text,
 * an `@`, text, a dot, text — deliberately permissive (an address is
 * confirmed by sending to it, never by a regular expression) and only strict
 * enough to catch the typo the visitor can still fix on this screen.
 */
const EMAIL_SHAPE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function EnvoyForm({
  kind,
  locale,
  fields,
  badge,
  conversion,
  ownSubmit = true,
  submitDataCta,
  advanceHref,
  submitLabel,
  pendingLabel,
  elementAttributes,
  className,
}: EnvoyFormProps) {
  const words = ENVOY_FORM_WORDS[locale];
  /**
   * The hydration signal, the same one `conversion-tracker` publishes and for
   * the same reason (F-2-71). Until this component has hydrated, its
   * `onSubmit` does not exist: a press before then is the browser's own form
   * submission — correct, and indistinguishable from the enhanced path to
   * anything watching for the validation messages or the pending word. An
   * auto-retrying assertion can wait for the fact instead of for a proxy of
   * it, and a visitor is never worse off either way.
   */
  const hydrated = useSyncExternalStore(subscribeNever, hydratedSnapshot, serverSnapshot);
  const honeypotId = useId();
  const successRef = useRef<HTMLDivElement>(null);
  /**
   * The flow's own next step, as a real link this form clicks for the
   * visitor once her answers pass.
   *
   * Why a link and not `useRouter()`: a *client-side* navigation is what
   * keeps the completed-order guard working. `FireConversionOnMount` dedupes
   * on the completed step at module scope, which survives every soft
   * navigation in the document and, by design, nothing beyond it — so a full
   * page load on the advance would make Back-then-Forward through step 4
   * count the paid goal twice (F-2-60 / TS-012-A5). `useRouter()` would do
   * the same navigation but throws wherever no app router is mounted, which
   * is every server-render test this component appears in; a `next/link`
   * anchor renders happily there and navigates identically here.
   */
  const advanceRef = useRef<HTMLAnchorElement>(null);
  /**
   * When the form appeared, for the timing gate below. Stamped in an effect
   * rather than during render: a render is pure, and the stamp we want is
   * "when the visitor could first have typed", which is mount time anyway.
   */
  const openedAt = useRef<number>(0);
  /**
   * Who validates, decided at mount.
   *
   * Before hydration — and forever, for a visitor with no JavaScript — the
   * browser's own `required` handling is the only thing between an empty
   * invoice and the next step, so the markup must **not** carry `novalidate`.
   * Once this component is running it owns the messages (in the page's
   * language, under the field they are about), so it sets the flag on the
   * element itself. Writing a DOM property is what an effect is for; putting
   * it in React state would re-render the whole form to change one attribute.
   */
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    openedAt.current = Date.now();
    if (formRef.current) formRef.current.noValidate = true;
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
  /**
   * Which fields were refused on the last attempt, keyed by field id.
   *
   * Validation runs on submit rather than on every keystroke: a message that
   * appears while a visitor is still typing her own address tells her she is
   * wrong before she has finished being right. Once a field has been refused
   * it re-validates as she edits it, so the message disappears the moment it
   * stops being true.
   */
  const [errors, setErrors] = useState<Readonly<Record<string, string>>>({});
  const errorCount = Object.keys(errors).length;
  /**
   * "Pflichtfeld" is only information where some fields are optional. On the
   * contact form every field is required, and marking all three says nothing
   * while adding a mono word to every label.
   */
  const marksRequired =
    fields.some((field) => field.required) && fields.some((field) => !field.required);

  /**
   * A flow step's advance works without JavaScript too: the form posts itself
   * as a plain GET to the next step, carrying the flow's own parameters as
   * hidden fields — and nothing else, because no visible field has a `name`
   * and an unnamed control is not a successful control. So the invoice values
   * never reach a URL, a log or this origin, in either branch.
   */
  const advance = advanceHref === undefined ? undefined : new URL(advanceHref, "http://x");
  const advanceAction = advance?.pathname;
  const advanceParams = advance === undefined ? [] : [...advance.searchParams.entries()];

  const messageFor = (field: EnvoyFormField, value: string): string | undefined => {
    const trimmed = value.trim();
    if (field.required && trimmed === "") return words.missingField;
    if (field.type === "email" && trimmed !== "" && !EMAIL_SHAPE.test(trimmed)) {
      return words.invalidEmail;
    }
    return undefined;
  };

  /** Every field's current message, read straight off the form element. */
  const validate = (form: HTMLFormElement): Record<string, string> => {
    const found: Record<string, string> = {};
    for (const field of fields) {
      const control = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `#envoy-${kind}-${field.id}`,
      );
      const message = messageFor(field, control?.value ?? "");
      if (message !== undefined) found[field.id] = message;
    }
    return found;
  };

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
      action={advanceAction}
      className={[styles.mount, className].filter(Boolean).join(" ")}
      data-envoy-hydrated={hydrated ? "true" : "false"}
      data-envoy-state={state}
      method={advanceAction === undefined ? undefined : "get"}
      ref={formRef}
      onSubmit={(event) => {
        const isAdvance = advanceHref !== undefined;

        // A lead form has no destination at all: no field carries a `name`,
        // so even the default submit would be a request with nothing in it,
        // and the handler cancels it anyway. A flow step **does** have one —
        // its own next step — and there the browser's plain GET is the
        // advance, in this branch and in the one where no JavaScript runs.
        if (!isAdvance) event.preventDefault();
        if (submitted.current || state !== "open") {
          event.preventDefault();
          return;
        }

        const form = event.currentTarget;

        // Validation before the spam gate: a visitor who left a field empty
        // gets told about the field, not about her typing speed.
        const found = validate(form);
        setErrors(found);
        if (Object.keys(found).length > 0) {
          event.preventDefault();
          setRefusal(undefined);
          const firstId = fields.find((field) => found[field.id] !== undefined)?.id;
          const first = firstId
            ? form.querySelector<HTMLElement>(`#envoy-${kind}-${firstId}`)
            : null;
          first?.focus();
          return;
        }

        // TS-016-A10's two spam gates guard a **lead**: something a person at
        // this end would otherwise have to read. A flow's own advance sends
        // nothing to anyone — it is a GET to the next step of the same route
        // — so a script that "beats" it has won a page view. Running the
        // timing gate there would only refuse the fast, honest visitor.
        if (!isAdvance) {
          const honeypot = form.elements.namedItem(honeypotId);
          const filled =
            honeypot instanceof HTMLInputElement ? honeypot.value.trim() !== "" : false;

          // The honeypot refusal says nothing — a bot learns from an error
          // message; a human never sees this branch.
          if (filled) {
            submitted.current = true;
            setState("sent");
            return;
          }
          if (Date.now() - openedAt.current < MIN_SUBMIT_MS) {
            setRefusal(words.tooFast);
            // The stamp is not reset: it is measured from when the form
            // appeared, so reading this sentence and pressing again is
            // already long enough. The refusal is a sentence, not a lockout.
            return;
          }
        }

        // One event per completed submission, keyed on the step being
        // completed rather than on the click that completed it (TS-012-A5,
        // TS-016-A12) — a second press cannot reach this line.
        submitted.current = true;
        setRefusal(undefined);

        if (isAdvance) {
          // With JavaScript: a client-side navigation, so the document — and
          // with it the completed-order guard — survives the step. Without
          // it: this line never runs and the browser submits the form to the
          // same step as a plain GET. Either way the pending word goes on the
          // control the visitor pressed, so a slow step is visible rather
          // than silent (F-2-67).
          if (advanceRef.current) {
            event.preventDefault();
            advanceRef.current.click();
          }
          setState("submitting");
          return;
        }

        setState("sent");
        if (conversion !== undefined) {
          getAnalyticsTracker().trackConversion(
            conversion.goalId,
            conversion.stage,
            conversion.attributes,
          );
        }

        // Focus moves to the success message (TS-016-A9); the node exists
        // after this render, so the move waits for it.
        requestAnimationFrame(() => successRef.current?.focus());
      }}
      {...elementAttributes}
    >
      {badge}
      {advanceParams.map(([key, value]) => (
        <input key={key} name={key} type="hidden" value={value} />
      ))}
      {advanceHref === undefined ? null : (
        <Link
          aria-hidden
          className={styles.hiddenAdvance}
          href={advanceHref}
          ref={advanceRef}
          tabIndex={-1}
        >
          {/* Never reached by a pointer or by the keyboard: the submit button
              below is the control, and this is how it navigates. */}
          {submitLabel ?? words.submit}
        </Link>
      )}
      {errorCount > 0 ? (
        <p className={styles.refusal} role="alert">
          {words.checkFields(errorCount)}
        </p>
      ) : null}

      {fields.map((field) => {
        const id = `envoy-${kind}-${field.id}`;
        const error = errors[field.id];
        const hint = field.hint?.[locale];
        const describedBy = [hint ? `${id}-hint` : undefined, error ? `${id}-error` : undefined]
          .filter(Boolean)
          .join(" ");
        // Once refused, a field re-checks itself as it is edited, so the
        // message goes away the moment the answer is good.
        const recheck = (value: string) => {
          if (errors[field.id] === undefined) return;
          const next = { ...errors };
          const message = messageFor(field, value);
          if (message === undefined) delete next[field.id];
          else next[field.id] = message;
          setErrors(next);
        };

        return (
          <div className={styles.field} key={field.id}>
            <label className={styles.label} htmlFor={id}>
              {field.label[locale]}
              {field.required && marksRequired ? (
                <span className={styles.required}>{words.requiredMark}</span>
              ) : null}
            </label>
            {hint ? (
              <p className={styles.hint} id={`${id}-hint`}>
                {hint}
              </p>
            ) : null}
            {field.multiline ? (
              <textarea
                aria-describedby={describedBy || undefined}
                aria-invalid={error ? true : undefined}
                autoComplete={field.autoComplete}
                className={styles.textarea}
                id={id}
                maxLength={MESSAGE_MAX_LENGTH}
                onBlur={(event) => recheck(event.currentTarget.value)}
                onChange={(event) => recheck(event.currentTarget.value)}
                required={field.required}
                rows={4}
              />
            ) : (
              <input
                aria-describedby={describedBy || undefined}
                aria-invalid={error ? true : undefined}
                autoComplete={field.autoComplete}
                className={styles.input}
                id={id}
                maxLength={FIELD_MAX_LENGTH}
                onBlur={(event) => recheck(event.currentTarget.value)}
                onChange={(event) => recheck(event.currentTarget.value)}
                required={field.required}
                type={field.type}
              />
            )}
            {error ? (
              <p className={styles.fieldError} id={`${id}-error`}>
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

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
          {state === "open"
            ? (submitLabel ?? words.submit)
            : (pendingLabel ?? words.sending)}
          {/* The arrow marks a step's advance, never a "send" (G-5). */}
          {advanceHref === undefined ? null : <Icon name="arrow-right" size={24} />}
          {state === "open" ? null : (
            <span className={styles.pending} role="status">
              {pendingLabel ?? words.sending}
            </span>
          )}
        </button>
      ) : null}
    </form>
  );
}
