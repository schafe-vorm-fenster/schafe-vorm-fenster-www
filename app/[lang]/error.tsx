"use client";

import { useParams } from "next/navigation";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { resolveLocale } from "@/src/lib/i18n/locales";
import { href } from "@/src/lib/routes/routes";

import type { ReactNode } from "react";

/**
 * The route-segment error boundary — TS-004 D2, DEC-032.
 *
 * Minimal and data-free: whatever failed below must not be able to fail here
 * too. An error boundary is a Client Component by contract, so the language
 * comes from the router's params rather than from `next/root-params`.
 */
export default function RouteError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}): ReactNode {
  const params = useParams<{ lang?: string }>();
  const locale = resolveLocale(params?.lang);
  const d = dictionary(locale);

  return (
    <article data-page="error">
      <h1>{d.error.title}</h1>
      <p>{d.error.body}</p>
      <p>
        <button onClick={() => retry()} type="button">
          {d.error.retry}
        </button>
      </p>
      <p>
        <a href={href("home", locale)}>{d.error.backHome}</a>
      </p>
    </article>
  );
}
