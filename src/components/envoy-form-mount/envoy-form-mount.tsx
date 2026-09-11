import { isMocked, isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { LeadFallback } from "../lead-fallback/lead-fallback";
import { Skeleton } from "../skeleton/skeleton";

import { ENVOY_FORM_FIELDS, type EnvoyFormKind } from "./fields";

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
  readonly briefingHref?: string;
  readonly briefingLabel?: string;
  readonly className?: string;
}

/**
 * 50 `envoy-form-mount` [PROPOSED] — TS-016 D1/D2/D5.
 *
 * Structure: in the finished product a mount point only — a custom element
 * with attributes (form kind, page language, source route, offering/goal
 * context). The envoy widget itself is undelivered (Q-022, `state/open.md`
 * row 7), so per the mock rule this component **is** the mock behind that
 * same interface: it renders the full form UX for `kind`, `demo-data-badge`,
 * and submits nothing — every field carries no `name` attribute, so even a
 * submission (there is no real destination to submit to) carries zero data
 * out of the browser.
 * States (D-9, all four):
 *   loading  → the slot reserves the widget's geometry as a `skeleton`;
 *   empty    → `lead-fallback` — the "script blocked or not yet delivered"
 *              case (TS-016 D6): never an empty slot, never an unresolved
 *              spinner;
 *   degraded → `lead-fallback` as well — the widget's own submission errors
 *              are the widget's to own once it exists; this mock has no
 *              submission to fail, so degraded and empty share the fallback;
 *   mocked   → the mocked field set, marked `demo-data-badge`.
 * Inherits: the page renders and is fully usable without any script; no
 * field value ever reaches this origin, a log or analytics (D5).
 * A11y: every field has a bound label; the submit control is a real button.
 */
export function EnvoyFormMount({
  kind,
  sourceRoute,
  locale = "de",
  context,
  fallbackEmail,
  briefingHref,
  briefingLabel,
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
        />
      </div>
    );
  }

  const fields = ENVOY_FORM_FIELDS[kind];

  return (
    <form
      className={classes}
      data-envoy-form-kind={kind}
      data-envoy-locale={locale}
      data-envoy-source={sourceRoute}
      {...contextAttributes(context)}
    >
      {isMocked(state) ? <DemoDataBadge /> : null}
      {fields.map((field) => (
        <div className={styles.field} key={field.id}>
          <label className={styles.label} htmlFor={`envoy-${kind}-${field.id}`}>
            {field.label}
          </label>
          {field.multiline ? (
            <textarea
              className={styles.textarea}
              id={`envoy-${kind}-${field.id}`}
              placeholder={field.placeholder}
              required={field.required}
              rows={4}
            />
          ) : (
            <input
              className={styles.input}
              id={`envoy-${kind}-${field.id}`}
              placeholder={field.placeholder}
              required={field.required}
              type={field.type}
            />
          )}
        </div>
      ))}
      <button className={styles.submit} type="submit">
        Absenden
      </button>
    </form>
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
