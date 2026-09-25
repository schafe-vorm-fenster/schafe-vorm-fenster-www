"use client";

import { useId, useRef, useSyncExternalStore } from "react";

import { Icon } from "../icon/icon";
import { linkHref } from "../route-link/href";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { LinkOptions } from "../route-link/href";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./locate-control.module.css";

/** What `GET /api/places/nearest` answers — the place and nothing about the point. */
interface NearestResponse {
  readonly data: { readonly place: { readonly slug: string } };
}

export interface LocateControlProps extends Omit<LinkOptions, "hash"> {
  /** Where the resolved place goes — the same route the form GETs to. */
  readonly to: RouteId;
  /** The query parameter the form uses for the place (`ort`). */
  readonly name?: string;
  readonly locale?: Locale;
  /** `dark` where the module stands on a photo surface or the ink section. */
  readonly tone?: "light" | "dark";
}

/** How long the browser may take to answer; a slow fix is not worth a stuck page. */
export const POSITION_TIMEOUT_MS = 10_000;

const noopSubscribe = () => () => {};

/**
 * The "use my location" control beside the place search — TS-WEB-0010 D5,
 * TS-WEB-0008 D7's coordinates row, DEC-0119.
 *
 * Structure: one text control with the `locate` glyph and, beside it, the
 * sentence that states what will happen (D5: the control "states what will
 * happen"). Both strings are dictionary keys marked `data-demo="true"` —
 * nobody has written them yet (`state/open.md`).
 * States: none of its own. It is enabled once this chunk has hydrated and
 * disabled before that, so a visitor without JavaScript sees an inert
 * control rather than a dead one that looks live; the toggle changes no
 * geometry.
 * Behaviour, all of it D5's:
 *   - the permission prompt is triggered by **the click and nothing else** —
 *     never on load, never in an effect, never on scroll;
 *   - the coordinates go to `/api/places/nearest` once, are not stored
 *     anywhere in the browser, and the page navigates to `?ort=<slug>` with
 *     the form's hidden query (`etcc_*`) carried along;
 *   - a denial, an unavailable position, a lookup that fails or answers no
 *     place leaves the page exactly as it was — no message, no retry, and no
 *     second ask: after a refusal the control stops asking.
 * Inherits: the 44 px touch target; ink on paper, paper on a dark ground.
 * A11y: a real `<button type="button">`, described by the sentence beside it
 * through `aria-describedby`; the glyph is decorative.
 */
export function LocateControl({ to, locale = "de", query, name = "ort", tone = "light" }: LocateControlProps) {
  const words = dictionary(locale).search;
  const describedBy = useId();
  const refused = useRef(false);
  const inFlight = useRef(false);
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const locate = () => {
    if (refused.current || inFlight.current) return;
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return;
    inFlight.current = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void (async () => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `/api/places/nearest?lat=${encodeURIComponent(String(latitude))}&lng=${encodeURIComponent(String(longitude))}`,
            );
            if (!response.ok) return;
            const body = (await response.json()) as NearestResponse;
            const slug = body.data?.place?.slug;
            if (typeof slug !== "string" || slug.length === 0) return;
            window.location.assign(linkHref(to, { locale, query: { ...query, [name]: slug } }));
          } catch {
            // A lookup that fails changes nothing — the page stays as it was.
          } finally {
            inFlight.current = false;
          }
        })();
      },
      () => {
        // Denied, unavailable or timed out: the page stays exactly as it was,
        // and the control does not ask a second time (D5).
        refused.current = true;
        inFlight.current = false;
      },
      { timeout: POSITION_TIMEOUT_MS, maximumAge: 0 },
    );
  };

  return (
    <div className={[styles.control, tone === "dark" ? styles.dark : undefined].filter(Boolean).join(" ")}>
      <button
        aria-describedby={describedBy}
        className={styles.button}
        data-demo="true"
        data-locate-control
        disabled={!hydrated}
        onClick={locate}
        type="button"
      >
        <Icon name="locate" size={18} />
        {words.locate}
      </button>
      <span className={styles.explains} data-demo="true" id={describedBy}>
        {words.locateExplains}
      </span>
    </div>
  );
}
