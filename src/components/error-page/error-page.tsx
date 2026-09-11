import { SectionShell } from "../section-shell/section-shell";

import type { ReactNode } from "react";

import styles from "./error-page.module.css";

export interface ErrorPageProps {
  /** `404` carries the search and the jobs band; `500` carries nothing live. */
  readonly kind: "404" | "500";
  readonly headline: string;
  readonly body?: string;
  /** The `place-search` module. 404 only — the 500 page has no island. */
  readonly search?: ReactNode;
  /** The `context-band` into the other jobs. 404 only. */
  readonly jobs?: ReactNode;
  readonly className?: string;
}

/**
 * 63 `error-page` [PROPOSED] — content type 25, TS-004 D2/D6, DEC-032.
 *
 * Structure: the 404 offers `place-search` plus the jobs band, answers with a
 * real 404 status and is `noindex`; the 500 is static, minimal and has **no
 * data dependency of any kind** — which is why its slots are simply not
 * rendered rather than conditionally filled.
 * States: the 404's search streams like everywhere else; the 500 has no
 * island, no counter, no live module.
 * Inherits: the full page rhythm, header and footer — no apology styling and
 * no illustration outside the design system.
 * Space: the search reserves its 56 px here exactly as on every other page.
 * A11y: an `h1`, the page landmarks, and a status code that matches what the
 * page says. The route that renders this component owns the status code.
 */
export function ErrorPage({ kind, headline, body, search, jobs, className }: ErrorPageProps) {
  const live = kind === "404";

  return (
    <div className={className} data-error={kind}>
      <SectionShell surface="paper">
        <p className={styles.code}>{kind}</p>
        <h1 className={styles.headline}>{headline}</h1>
        {body ? <p className={styles.body}>{body}</p> : null}
        {live && search ? <div className={styles.search}>{search}</div> : null}
      </SectionShell>
      {live && jobs ? jobs : null}
    </div>
  );
}
