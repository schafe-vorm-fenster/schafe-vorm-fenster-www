/**
 * The real eTracker adapter — TS-WEB-0012 D2, switched on by DEC-0218 §1.
 *
 * `index.ts` returns it whenever `NEXT_PUBLIC_ETRACKER_SECURE_CODE` is set;
 * the loader tag (`etracker-loader.tsx`) is mounted under the same condition
 * by `etracker-analytics.tsx`. Both read the one variable, so there is no
 * state in which events are sent without a loader, or a loader runs without
 * a tracker.
 *
 * **The vendor calls**, verified against the loader script
 * (`https://code.etracker.com/code/e.js`, read 2026-11-12) and eTracker's
 * documentation for single-page applications and event tracking:
 *
 * - page view: `et_eC_Wrapper({ et_et, et_pagename, et_areas })` — a virtual
 *   page view; the loader counts the first view of a document itself from
 *   the `et_pagename` / `et_areas` globals, which `trackPageView` sets before
 *   the loader is rendered;
 * - event: `_etracker.sendEvent(new et_UserDefinedEvent(object, category,
 *   action, type))`.
 *
 * **Field mapping** (DEC-0218 §3, replacing the [PROPOSED] `{category,
 * action}` object of the first draft, which the vendor API does not accept):
 *
 * | Call             | object                 | category   | action        | type          |
 * | ---------------- | ---------------------- | ---------- | ------------- | ------------- |
 * | `trackCtaClick`  | CTA id (`order.primary`) | goal id / `navigation` / `outbound` | `click` | page name |
 * | `trackConversion`| attributes (`channel=whatsapp`) or the goal id | goal id | stage (`handover`/`completed`) | page name |
 *
 * Whether the account reports these four fields under the expected names and
 * lengths is still Q-0040's account check (state/open.md row 12).
 *
 * D9 (never block, never break) applies here exactly as it does to the
 * mock: a missing, blocked, or throwing vendor global is a silent no-op.
 */

import type { CtaEvent } from "./cta-event";
import type { PageView } from "./page-view";
import type { AnalyticsTracker, ConversionAttributes, EventStage } from "./types";

type UserDefinedEventConstructor = new (
  object: string,
  category: string,
  action: string,
  type: string,
) => unknown;

interface EtrackerWindow {
  _etracker?: { sendEvent?: (event: unknown) => void };
  et_UserDefinedEvent?: UserDefinedEventConstructor;
  et_eC_Wrapper?: (parameters: { et_et: string; et_pagename: string; et_areas: string }) => void;
  et_pagename?: string;
  et_areas?: string;
}

function vendor(): EtrackerWindow | undefined {
  if (typeof window === "undefined") return undefined;
  return window as unknown as EtrackerWindow;
}

/** `channel=whatsapp;route=calendar` — sorted, so one trigger is always one string. */
export function attributesObject(goalId: string, attributes?: ConversionAttributes): string {
  const pairs = Object.entries(attributes ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value)}`);
  return pairs.length > 0 ? pairs.join(";") : goalId;
}

export function createEtrackerTracker(secureCode: string): AnalyticsTracker {
  let currentPage = "";

  function send(object: string, category: string, action: string, type: string): void {
    const et = vendor();
    const Event = et?.et_UserDefinedEvent;
    const sendEvent = et?._etracker?.sendEvent;
    if (!Event || typeof sendEvent !== "function") return; // D9: loader not ready or blocked.
    try {
      sendEvent.call(et._etracker, new Event(object, category, action, type));
    } catch {
      // D9: a failing vendor call must never surface to the caller.
    }
  }

  return {
    trackPageView(view: PageView) {
      currentPage = view.pageName;
      const et = vendor();
      if (!et) return;
      try {
        // Read by the loader for the first view of the document.
        et.et_pagename = view.pageName;
        et.et_areas = view.areas;
        // From the second view on, the loader is there and takes a virtual view.
        if (typeof et.et_eC_Wrapper === "function" && typeof et._etracker === "object") {
          et.et_eC_Wrapper({ et_et: secureCode, et_pagename: view.pageName, et_areas: view.areas });
        }
      } catch {
        // D9.
      }
    },
    trackConversion(goalId: string, stage: EventStage, attributes?: ConversionAttributes) {
      send(attributesObject(goalId, attributes), goalId, stage, currentPage);
    },
    trackCtaClick(event: CtaEvent) {
      send(event.object, event.category, event.action, event.type);
    },
  };
}
