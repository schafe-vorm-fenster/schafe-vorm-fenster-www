import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { dictionary } from "@/src/lib/i18n/dictionary";

import styles from "./_nearby-section.module.css";

import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

/**
 * The "this week nearby" section, composed once for every page that carries
 * it (`/` in state S3, `/dein-ort`): a heading, one sentence, the list. No
 * kicker and no hand-off line (issue 152) — a page cannot put them back,
 * because this is the only place the section is composed.
 *
 * The island that stands inside gets its head from `nearbyHead`: the module
 * owns the heading (it can change to "Demnächst in der Nähe" once the list
 * reaches past the week), the section owns how heading and sentence look.
 */
export function NearbySection({ children }: { readonly children: ReactNode }) {
  return (
    <MotionReveal>
      <SectionShell className={styles.section} id="nearby" surface="surface">
        {children}
      </SectionShell>
    </MotionReveal>
  );
}

/** The props that make a nearby island this section's: level, sentence, frame class. */
export function nearbyHead(locale: Locale) {
  return {
    className: styles.frame,
    headingLevel: "h2" as const,
    lead: dictionary(locale).live.nearbyLead,
  };
}
