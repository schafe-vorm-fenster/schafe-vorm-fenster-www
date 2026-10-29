import { ContextBand } from "@/src/components/context-band/context-band";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { jobLabelKey } from "@/src/lib/pages/page-meta";
import { leadFormEmbedUrl } from "@/src/lib/routes/lead-fallback";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom, pageMetadataFor } from "../../_locale";

import { pageMeta } from "./page.meta";
import { RegisterFormFrame } from "./register-form-frame";

import type { Metadata } from "next";

import styles from "./register.module.css";

/**
 * `/mitmachen/registrieren` for the launch — the Google Form the live site
 * already uses, embedded (DEC-0176, issue 109; TS-WEB-0023 D10).
 *
 * The owner, review of 2026-10-27: "Wir müssen erst mal das Google Formular
 * einbetten, wie es online ist. Das ist zwar nicht schön, aber damit können
 * wir online gehen." The three-step flow of TS-WEB-0023 D2–D8 hands over to an
 * app registration entry that has no contract yet (D6, DEC-0029), so it
 * cannot register anybody; the form can, and does on the live site today.
 * The flow is not deleted: `flow-page.tsx` is its page composition as it
 * stood, and bringing it back is swapping one import here.
 *
 * Structure, in DOM order: the heading; the frame. Then the context band, as on
 * the flow's step 1 (D7). The form says itself that Google provides it, so the
 * page carries no notice and no new-tab link of its own (owner, 2026-10-29).
 *
 * Measurement (DEC-0176 §4): `register-as-publisher` at `stage: handover`,
 * once when the visitor first moves on inside the form
 * (`register-form-frame.tsx`). The submission is Google's and is not
 * observable from this page.
 */

const ROUTE = "register" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadataFor(ROUTE, params);
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);
  // The band's own kicker (state/open.md row 95, row 161).
  const contextBandHeading = fieldAt(slot(page, "registrieren-6-context-band").blocks, 0);
  const words = dictionary(locale);

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
      <SectionShell dataBlock="register-form" id="register-form" surface="paper">
        <h1>{words.pages.register}</h1>
        <RegisterFormFrame className={styles.frame} src={leadFormEmbedUrl()} title={words.start.frameTitle} />
      </SectionShell>
      {/* TS-WEB-0011-A4 (F-2-41): the band is an `aside`. */}
      <SectionShell as="aside" density="tight" id="context-band" label={contextBandHeading} surface="surface">
        <ContextBand currentJob={jobLabelKey(pageMeta.focusJob)} heading={contextBandHeading} locale={locale} />
      </SectionShell>
    </>
  );
}
