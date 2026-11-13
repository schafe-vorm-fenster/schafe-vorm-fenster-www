"use client";

/**
 * The `<form>` element of `search-field`, and the one thing it needs a
 * browser for: refusing a second submit inside the same navigation (F-3-12).
 *
 * `search-field` is a plain GET form, which is what makes the site's primary
 * entry control work with no JavaScript at all — and it is also why two
 * clicks on "Suchen" are two submissions. The chaos hasty-clicker persona
 * measured the second one landing as `/dein-ort?ort=` — the parameter
 * present and **empty**, the typed postcode gone (C3-H-2): 100 % on the true
 * 404's recovery widget, reproduced once each on `/` and `/dein-ort`, and not
 * at all on `/dein-kalender/bestellen`'s instance, which localises it to this
 * shared submit path. A single clean click always preserves the value.
 *
 * So the first submit goes through untouched — same GET, same query, same
 * navigation — and every further submit of the *same* document is cancelled.
 * The ref is set synchronously, for the reason `envoy-form` keeps one: two
 * clicks issued in one task never give React a render in between, so state
 * could not refuse the second in time (F-2-65's shape).
 *
 * Without JavaScript this is a plain `<form method="get">` again, unchanged
 * and complete — the guard is an enhancement, never a precondition.
 */

import { useRef } from "react";

import type { ReactNode } from "react";

export interface SearchFormProps {
  readonly action: string;
  readonly className?: string;
  readonly children: ReactNode;
}

export function SearchForm({ action, className, children }: SearchFormProps) {
  const submitting = useRef(false);

  return (
    <form
      action={action}
      className={className}
      method="get"
      onSubmit={(event) => {
        if (submitting.current) {
          event.preventDefault();
          return;
        }
        submitting.current = true;
      }}
      role="search"
    >
      {children}
    </form>
  );
}
