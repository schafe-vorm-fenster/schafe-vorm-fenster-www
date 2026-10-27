"use client";

/**
 * The registration form's frame on `/mitmachen/registrieren` — DEC-0176 §2/§4,
 * TS-WEB-0023 D10.
 *
 * The `iframe` itself is server-rendered markup like any other: it is in the
 * prerendered document with its `src`, its `title` and its reserved height, so
 * it loads without JavaScript and before hydration. This component only adds
 * what the browser can observe of a cross-origin document, which is one fact:
 * **the frame loaded a new document.** Google's form is four pages and a
 * confirmation, and every "Weiter", "Zurück" and the final "Senden" is a
 * navigation inside the frame. Nothing else crosses the origin boundary — no
 * URL, no field, no message — so the submission itself is not observable
 * (DEC-0176 §4).
 *
 * What is done with that fact:
 *
 * - **Measurement.** A `load` while the frame holds the focus is a navigation
 *   the visitor caused inside the form: she pressed a button in it. The first
 *   one fires `register-as-publisher` at `stage: handover` with
 *   `via: "embedded-form"` — she has handed herself over to the form — once
 *   per mount (TS-WEB-0012 D4: once per trigger). The initial load never
 *   counts: nobody is in the frame yet, so it is not the active element.
 *   Keying on the focus rather than on a load count is what makes this
 *   independent of hydration: a load that happened before React attached the
 *   listener is simply not seen, and none of those is the visitor's.
 * - **Position.** The new page of the form starts at its top, but the host
 *   page stays scrolled to where the button was — deep inside the frame. So
 *   a navigation the visitor caused brings the frame's top back into view
 *   when it has scrolled out above (`scroll-padding-top` keeps it clear of
 *   the sticky header).
 *
 * `data-hydrated` is the same signal `ConversionTracker` carries (F-2-71): a
 * test waits for the fact that the listener exists instead of a proxy of it.
 */

import { useRef, useSyncExternalStore } from "react";

import { getAnalyticsTracker } from "@/src/lib/analytics";

import type { ConversionBinding } from "@/src/components/conversion-tracker/conversion-tracker";
import type { SyntheticEvent } from "react";

/** The one binding this frame fires — `call-sites.test.ts` reads it here. */
const FRAME_CONVERSION: ConversionBinding = {
  goalId: "register-as-publisher",
  stage: "handover",
  attributes: { via: "embedded-form" },
};

const subscribeNever = () => () => {};
const hydratedSnapshot = () => true;
const serverSnapshot = () => false;

export interface RegisterFormFrameProps {
  readonly src: string;
  readonly title: string;
  readonly className?: string;
}

export function RegisterFormFrame({ src, title, className }: RegisterFormFrameProps) {
  const hydrated = useSyncExternalStore(subscribeNever, hydratedSnapshot, serverSnapshot);
  const fired = useRef(false);

  function onLoad(event: SyntheticEvent<HTMLIFrameElement>) {
    const frame = event.currentTarget;
    // Not the visitor's navigation: the initial load, or a frame nobody is in.
    if (document.activeElement !== frame) return;

    if (frame.getBoundingClientRect().top < 0) frame.scrollIntoView({ block: "start" });

    if (fired.current) return;
    fired.current = true;
    const { goalId, stage, attributes } = FRAME_CONVERSION;
    getAnalyticsTracker().trackConversion(goalId, stage, attributes);
  }

  return (
    <iframe
      className={className}
      data-demo="true"
      data-hydrated={hydrated ? "true" : "false"}
      data-register-form=""
      loading="eager"
      onLoad={onLoad}
      src={src}
      title={title}
    />
  );
}
