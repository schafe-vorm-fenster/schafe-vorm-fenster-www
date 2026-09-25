import { notFound } from "next/navigation";

import { ExplainModule } from "@/src/components/explain-module/explain-module";

import type { ExplainModuleProps } from "@/src/components/explain-module/explain-module";
import type { Metadata } from "next";

import styles from "./page.module.css";

/**
 * The browser fixture for `explain-module` — the one component whose
 * contract is timing (`DEC-0105 §6`: a 9.1 s pass keyed to a three-quarter
 * intersection) and therefore cannot be proven by a render test.
 * `e2e/explain-module.spec.ts` measures it here.
 *
 * This is **not** a production route: it answers 404 on production, it is
 * `noindex`, and no page links to it — the same standing as
 * `/dev/components`. The module stands below a spacer taller than any phone
 * viewport, so a load never has it in view and the trigger is the scroll.
 *
 * The step wording is the owner's own, taken from the design drafts
 * (`plan/reviews/2026-09-23/Design - 3-Schritte-erklären …11.20.03.png`);
 * the stage panes are labelled boxes, because the graphics are T-03's.
 */
export const metadata: Metadata = {
  title: "Explain-Modul (dev)",
  robots: { index: false, follow: false },
};

const STEPS: ExplainModuleProps["steps"] = [
  { core: "Flyer fotografieren", detail: "Den ihr sowieso gedruckt habt." },
  { core: "Per WhatsApp an uns schicken", detail: "Über „Teilen“ direkt in unseren Chat." },
  { core: "Termin steht im Kalender", detail: "In eurem Ort und drumherum." },
];

function pane(state: 1 | 2 | 3) {
  return (
    <div className={styles.pane} data-fixture-pane={state}>
      Zustand {state}
    </div>
  );
}

export default function ExplainModuleFixturePage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <div className="container">
      <h1>Explain-Modul — Fixture</h1>
      <p>Entwicklungsseite für den Browser-Test der Auto-Weiterschaltung. Nicht Teil der Website.</p>
      <div className={styles.spacer} data-fixture-spacer="" />
      <ExplainModule
        cta={{ icon: "smartphone", label: "Flyer per WhatsApp schicken", to: "register" }}
        id="fixture-module"
        mechanism="whatsapp"
        ordinal={1}
        stage={[pane(1), pane(2), pane(3)]}
        steps={STEPS}
        title="Flyer per WhatsApp"
      />
      <div className={styles.spacer} />
    </div>
  );
}
