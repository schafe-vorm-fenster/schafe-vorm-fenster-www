import { Icon } from "../icon/icon";
import { RouteLink } from "../route-link/route-link";

import { legalAnchor } from "@/src/lib/routes/legal-anchors";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./trust-block.module.css";

export const TRUST_SUBJECTS = ["data-protection", "operations", "ai"] as const;

export type TrustSubjectId = (typeof TRUST_SUBJECTS)[number];

export interface TrustSubject {
  readonly id: TrustSubjectId;
  readonly label: string;
  /** Absent → the subject does not ship — no hub record, no sentence (TS-024 D10). */
  readonly body?: string;
}

export interface TrustBlockProps {
  readonly headline: string;
  readonly subjects: readonly TrustSubject[];
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 37 `trust-block` [PROPOSED] — content type 17 `trust-block`, TS-024 D10.
 *
 * Structure: one block, three possible subjects (data protection ·
 * operations · AI), with links to `/rechtliches#datenschutz` and
 * `/rechtliches#auftragsverarbeitung`. Occurs once per page.
 * States: a subject without a hub record behind it does not ship — the
 * caller omits its `body`, and this component skips it rather than
 * rendering a heading over nothing. Today only `data-protection` renders.
 * Inherits: a sober `surface` section (composed by the caller's
 * `section-shell`); `info` / `circle-check` icons; no badge implying
 * certification.
 * Space: static content.
 * A11y: the two legal links name their targets in the link text itself.
 */
export function TrustBlock({ headline, subjects, locale, className }: TrustBlockProps) {
  const shipped = subjects.filter((subject) => subject.body);

  return (
    <div className={[styles.block, className].filter(Boolean).join(" ")}>
      <h2 className={styles.headline}>
        <Icon className={styles.icon} name="info" />
        {headline}
      </h2>
      <ul className={styles.list}>
        {shipped.map((subject) => (
          <li className={styles.item} key={subject.id}>
            <Icon className={styles.check} name="circle-check" />
            <div>
              <p className={styles.subjectLabel}>{subject.label}</p>
              <p className={styles.body}>{subject.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className={styles.links}>
        <RouteLink hash={legalAnchor("privacy", locale ?? "de")} locale={locale} to="legal">
          Datenschutzerklärung
        </RouteLink>
        {" · "}
        <RouteLink hash={legalAnchor("dataProcessing", locale ?? "de")} locale={locale} to="legal">
          Auftragsverarbeitung
        </RouteLink>
      </p>
    </div>
  );
}
