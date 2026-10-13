import { ContextBand } from "@/src/components/context-band/context-band";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { ctaLabelOnly } from "@/src/lib/content/text";
import { fillTemplate } from "@/src/lib/pages/demo-content";
import { jobLabelKey } from "@/src/lib/pages/page-meta";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom, pageMetadataFor } from "../../_locale";

import { pageMeta } from "./page.meta";
import { RegisterFlow } from "./register-flow";

import type { ContentBlock } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0023 — `/mitmachen/registrieren`, a flow, not an argument.
 *
 * Every step is a plain GET navigation on the same route (D4): the state is
 * `?ort=&wer=&weg=`, re-validated on every load, never a cookie or client
 * store. Since DEC-0163 the route is one static document and the step is
 * chosen in the browser (`register-flow.tsx`). `SiteChrome` (header, breadcrumb, footer) is the
 * shared frame; the context band and closing CTA are hand-rendered here,
 * not through `PageFrame`, because D7 suppresses both on steps 2 and 3 and
 * suppresses the band on the handover — a per-step rule `PageFrame` has no
 * hook for (open point: `PageFrame`'s `meta`-driven band/CTA has no step
 * parameter; flagged for the chrome work package).
 */

const ROUTE = "register" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadataFor(ROUTE, params);
}

function listItems(blocks: readonly ContentBlock[]): string[] {
  return blocks.flatMap((block) => (block.kind === "list" ? block.items : []));
}

/**
 * The last screen has to read **finished** — the three questions are
 * answered and the website's part is over — without claiming a registration
 * it cannot confirm: the account is the app's, and TS-WEB-0023 D6 forbids a
 * confirmation, an instruction or an event field on this route.
 */
const HANDOVER_HEADING = {
  de: "Geschafft — deine drei Antworten stehen.",
  en: "Done — all three answers are in.",
} as const;

/**
 * Under the first question, and nowhere else: what a visitor at the first
 * field of an unfamiliar flow wants to know is how long it is and what it
 * is going to cost her. Both halves are the route's own design — three
 * steps (D2) and no identity field anywhere on it (D6).
 */
const STEP_ONE_REASSURANCE: Record<Locale, string> = {
  de: "Drei Fragen, dann bist du drin. Keine E-Mail-Adresse nötig, solange du hier bist.",
  en: "Three questions and you're in. No email address needed while you're here.",
};

/**
 * The answered-step line of D5 — "a prefilled step renders **answered,
 * visible and changeable**, never skipped: the visitor sees which place she
 * is registering before handover" (F-2-62).
 *
 * Generated copy, in the tone of voice, with a `Dummy-Content` row in
 * `state/open.md`: the artifact writes the three questions and the handover,
 * not the summary line the flow needs to keep an answer on screen.
 */
/** The step's advance label — `choice-group`'s own default is German. */
const CONTINUE_LABEL: Record<Locale, string> = { de: "Weiter", en: "Continue" };

/** The founding CTA's `{ort}` slot, where this page may not name a place. */
const GENERIC_PLACE: Record<Locale, { ort: string; place: string }> = {
  de: { ort: "deinen Ort", place: "deinen Ort" },
  en: { ort: "your place", place: "your place" },
};

const ANSWERED_PLACE: Record<Locale, { label: string; change: string }> = {
  de: { label: "Dein Ort", change: "Ort ändern" },
  en: { label: "Your place", change: "Change place" },
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);
  // The band's own kicker (state/open.md row 95, row 161).
  const contextBandHeading = fieldAt(slot(page, "registrieren-6-context-band").blocks, 0);

  const ortSlot = slot(page, "registrieren-1-ort");
  const werSlot = slot(page, "registrieren-2-wer");
  const wegSlot = slot(page, "registrieren-3-weg");
  const stepIndicatorSlot = slot(page, "registrieren-4-step-indicator");
  const handoverSlot = slot(page, "registrieren-5-handover");

  // F-3-14: the founding page's own acknowledgment slot, verbatim — index 1
  // is its "Headline (ohne Ort, Fallback)", which names no place
  // (TS-WEB-0023-A5). Read always, shown only when a search found nothing.
  const founding = await pageContent("placeStart", locale);
  const foundingAck = slot(founding, "dein-ort-starten-1-ack");
  const foundingCta = slot(founding, "dein-ort-starten-6-cta");

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
      <RegisterFlow
        contextBand={
          // TS-WEB-0011-A4 (F-2-41): the band is an `aside` on every page it
          // renders on. `tight`: it sat between the question and the footer
          // as the largest thing on the screen after the question.
          <SectionShell as="aside" density="tight" id="context-band" label={contextBandHeading} surface="surface">
            <ContextBand currentJob={jobLabelKey(pageMeta.focusJob)} heading={contextBandHeading} locale={locale} />
          </SectionShell>
        }
        copy={{
          locale,
          ortQuestion: fieldAt(ortSlot.blocks, 0) ?? "",
          // The artifact's own "Sucheingabe (Placeholder)" field (DEC-0128).
          ortPlaceholder: fieldAt(ortSlot.blocks, 1),
          stepOneReassurance: STEP_ONE_REASSURANCE[locale],
          werQuestion: fieldAt(werSlot.blocks, 0) ?? "",
          werOptions: listItems(werSlot.blocks),
          wegQuestion: fieldAt(wegSlot.blocks, 0) ?? "",
          wegOptions: listItems(wegSlot.blocks),
          stepIndicatorLabel: fieldAt(stepIndicatorSlot.blocks, 0) ?? "",
          handoverHeading: HANDOVER_HEADING[locale],
          handoverCta: fieldAt(handoverSlot.blocks, 0) ?? "",
          handoverNote: fieldAt(handoverSlot.blocks, 1),
          continueLabel: CONTINUE_LABEL[locale],
          answeredPlaceLabel: ANSWERED_PLACE[locale].label,
          answeredPlaceChange: ANSWERED_PLACE[locale].change,
          notFoundHeadline: fieldAt(foundingAck.blocks, 1) ?? "",
          notFoundLead: fieldAt(foundingAck.blocks, 2),
          notFoundCtaLabel: fillTemplate(ctaLabelOnly(foundingCta.cta ?? "") ?? "", GENERIC_PLACE[locale]),
        }}
      />
    </>
  );
}
