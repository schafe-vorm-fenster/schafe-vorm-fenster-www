"use client";

/**
 * Site analytics, mounted once by `app/[lang]/layout.tsx` — DEC-0218 (issue 194).
 *
 * Three jobs, all here so no page and no component has to know about them:
 *
 * 1. **The loader** (`etracker-loader.tsx`), rendered when
 *    `NEXT_PUBLIC_ETRACKER_SECURE_CODE` is set and not otherwise. Without the
 *    variable nothing is loaded, nothing is sent and nothing fails.
 * 2. **Page views on every page, client navigation included.** The layout
 *    stays mounted across App Router navigations, so the route read off
 *    `useSelectedLayoutSegments()` (the internal, German segments — immune to
 *    the locale rewrite, `routeFromSegments()`) changes under it, and each
 *    change is one `trackPageView`. The first one only names the page for the
 *    loader, which counts it on arrival; every later one is a virtual page
 *    view (`etracker-tracker.ts`). The loader's own URL detection is `off`,
 *    so nothing is counted twice (TS-WEB-0012 [FREE] row 2).
 * 3. **CTA clicks.** One delegated `click` listener on the document, in the
 *    capture phase so it runs before any handler can stop the event. It reads
 *    the clicked link or button into a `CtaElement` and lets `ctaEvent()`
 *    decide whether it is a CTA and what it is called. Fire-and-forget: it
 *    never prevents, delays or awaits anything (TS-WEB-0012 D9).
 *
 * `/start` has its own root layout and does not mount this (TS-WEB-0016 D15
 * "Measurement: nothing").
 */

import { useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useRef } from "react";

import { routeFromSegments } from "@/src/lib/routes/routes";

import { etrackerSecureCode } from "./config";
import { ctaEvent, type CtaElement } from "./cta-event";
import { EtrackerLoader } from "./etracker-loader";
import { pageView, type PageView } from "./page-view";
import { getAnalyticsTracker } from "./tracker";

import type { Locale } from "@/src/lib/i18n/locales";

/** The variable is inlined at build time, so this is a constant per deployment. */
const SECURE_CODE = etrackerSecureCode();

function readElement(element: Element): CtaElement | undefined {
  const tag = element.tagName.toLowerCase();
  if (tag !== "a" && tag !== "button") return undefined;
  return {
    tag,
    href: element.getAttribute("href") ?? undefined,
    rank: element.getAttribute("data-cta") ?? undefined,
    channel: element.getAttribute("data-channel") ?? undefined,
    name: element.getAttribute("name") ?? element.getAttribute("id") ?? undefined,
    formAction:
      tag === "button"
        ? (element.getAttribute("formaction") ?? element.closest("form")?.getAttribute("action") ?? undefined)
        : undefined,
  };
}

export interface EtrackerAnalyticsProps {
  readonly locale: Locale;
  /**
   * The per-language 404 documents (`app/variants/not-found/[lang]`) are a
   * root layout of their own, whose segments say nothing about the URL the
   * visitor asked for; they count as `<lang>/not-found`.
   */
  readonly notFound?: boolean;
}

export function EtrackerAnalytics({ locale, notFound = false }: EtrackerAnalyticsProps) {
  const segmentRoute = routeFromSegments(useSelectedLayoutSegments());
  const route = notFound ? undefined : segmentRoute;
  const viewRef = useRef<PageView>(pageView(route, locale));
  const lastCounted = useRef<string | undefined>(undefined);

  useEffect(() => {
    const current = pageView(route, locale);
    viewRef.current = current;
    // Strict Mode runs an effect twice on mount; one page is one view.
    if (lastCounted.current === current.pageName) return;
    lastCounted.current = current.pageName;
    getAnalyticsTracker().trackPageView(current);
  }, [route, locale]);

  useEffect(() => {
    function onClick(event: MouseEvent): void {
      try {
        const target = event.target instanceof Element ? event.target.closest("a[href], button") : null;
        if (!target) return;
        const element = readElement(target);
        if (!element) return;
        const cta = ctaEvent(element, viewRef.current, window.location.origin);
        if (cta) getAnalyticsTracker().trackCtaClick(cta);
      } catch {
        // D9: a click is never broken by measurement.
      }
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return <EtrackerLoader secureCode={SECURE_CODE} />;
}
