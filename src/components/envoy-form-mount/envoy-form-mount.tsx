import { isMocked, isPending, type DataStateProps } from "../data-state";
import { LeadFallback } from "../lead-fallback/lead-fallback";
import { Skeleton } from "../skeleton/skeleton";

import { EnvoyForm } from "./envoy-form";
import { ENVOY_FORM_FIELDS, type EnvoyFormKind } from "./fields";

import type { ConversionBinding } from "../conversion-tracker/conversion-tracker";

import type { RouteId } from "@/src/lib/routes/routes";
import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./envoy-form-mount.module.css";

export type { EnvoyFormKind } from "./fields";

export interface EnvoyFormMountProps extends DataStateProps {
  readonly kind: EnvoyFormKind;
  readonly sourceRoute: RouteId;
  readonly locale?: Locale;
  /** The offering/goal context the real widget's attributes would carry (D2). */
  readonly context?: Readonly<Record<string, string>>;
  readonly fallbackEmail: string;
  /** The page's contact section as an in-page target, `<route>#kontakt` (DEC-0081 §3). */
  readonly briefingHref?: string;
  readonly briefingLabel?: string;
  /**
   * The goal a successful submission completes (TS-WEB-0012 D4). The mount wraps
   * its **own** submit button — arming the whole form from outside would fire
   * on every click in a field.
   *
   * While the widget is the mock (Q-0022), the mocked submit *is* the success
   * signal, the same reading `/dein-kalender/bestellen` step 4 already
   * records for its own mocked completion (`state/open.md`).
   */
  readonly conversion?: ConversionBinding;
  /**
   * `false` where the form stands inside a flow whose step already owns the
   * advance (order step 3) — see F-2-51.
   */
  readonly ownSubmit?: boolean;
  /**
   * Where a valid submission goes next, where this form **is** a flow step's
   * one control (order step 3). With it the mount owns the advance again —
   * and validates before taking it, which is what an order with an empty
   * invoice needed.
   */
  readonly advanceHref?: string;
  /** The submit's label, where it advances a step rather than sending. */
  readonly submitLabel?: string;
  /** What the submit says while the next step loads (F-2-67). */
  readonly pendingLabel?: string;
  /** The conversion marker on the submit control, where this form is the
   *  page's or the step's one action (TS-WEB-0006 D3). */
  readonly submitDataCta?: string;
  readonly className?: string;
}

/**
 * 50 `envoy-form-mount` [PROPOSED] — TS-WEB-0016 D1/D2/D5.
 *
 * Structure: in the finished product a mount point only — a custom element
 * with attributes (form kind, page language, source route, offering/goal
 * context). The envoy widget itself is undelivered (Q-0022, `state/open.md`
 * row 7), so per the mock rule this component **is** the mock behind that
 * same interface: it renders the full form UX for `kind` and submits
 * nothing — every field carries no `name` attribute, so even a
 * submission (there is no real destination to submit to) carries zero data
 * out of the browser.
 * States (D-9, all four):
 *   loading  → the slot reserves the widget's geometry as a `skeleton`;
 *   empty    → `lead-fallback` — the "script blocked or not yet delivered"
 *              case (TS-WEB-0016 D6): never an empty slot, never an unresolved
 *              spinner;
 *   degraded → `lead-fallback` as well — the widget's own submission errors
 *              are the widget's to own once it exists; this mock has no
 *              submission to fail, so degraded and empty share the fallback;
 *   mocked   → the mocked field set, marked `data-mock="true"` on the mount
 *              element, plus the submitted state `envoy-form.tsx` owns
 *              (TS-WEB-0016-A9).
 * Inherits: the page renders and is fully usable without any script; no
 * field value ever reaches this origin, a log or analytics (D5).
 * Space: the success message replaces the form in the same slot.
 * A11y: every field has a bound label; the submit control is a real button;
 * the honeypot of TS-WEB-0016-A10 is hidden from assistive technology and not
 * focusable; focus moves to the success message.
 */
export function EnvoyFormMount({
  kind,
  sourceRoute,
  locale = "de",
  context,
  fallbackEmail,
  briefingHref,
  briefingLabel,
  conversion,
  ownSubmit,
  advanceHref,
  submitLabel,
  pendingLabel,
  submitDataCta,
  state = "mocked",
  className,
}: EnvoyFormMountProps) {
  const classes = [styles.mount, className].filter(Boolean).join(" ");

  if (isPending(state)) {
    return <Skeleton className={classes} rows={4} variant="row" />;
  }

  if (state === "empty" || state === "degraded") {
    return (
      <div className={classes}>
        <LeadFallback
          briefingHref={briefingHref}
          briefingLabel={briefingLabel}
          email={fallbackEmail}
          // F-2-4's root cause once more: the fallback's own three lines are
          // dictionary strings now, and they need the page's language.
          locale={locale}
        />
      </div>
    );
  }

  return (
    <EnvoyForm
      advanceHref={advanceHref}
      ownSubmit={ownSubmit}
      className={className}
      conversion={conversion}
      pendingLabel={pendingLabel}
      submitLabel={submitLabel}
      elementAttributes={{
        "data-envoy-form-kind": kind,
        "data-envoy-locale": locale,
        "data-envoy-source": sourceRoute,
        // The mock's own marking, where Jan can read it and a visitor cannot
        // (2026-09-18). The form itself reads as the finished one.
        ...(isMocked(state) ? { "data-mock": "true" } : {}),
        ...contextAttributes(context),
      }}
      fields={ENVOY_FORM_FIELDS[kind]}
      kind={kind}
      locale={locale}
      submitDataCta={submitDataCta}
    />
  );
}

function contextAttributes(
  context: Readonly<Record<string, string>> | undefined,
): Record<string, string> {
  if (!context) return {};
  const attributes: Record<string, string> = {};
  for (const [key, value] of Object.entries(context)) {
    attributes[`data-envoy-context-${key}`] = value;
  }
  return attributes;
}
