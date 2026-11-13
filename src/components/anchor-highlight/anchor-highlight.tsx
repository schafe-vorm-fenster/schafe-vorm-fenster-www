"use client";

import { useEffect } from "react";

/**
 * `anchor-highlight` [PROPOSED] — issue #36.
 *
 * Marks the element the URL fragment names with `data-anchored="true"`. The
 * CSS `:target` pseudo-class cannot do this alone: a client-side navigation
 * (`next/link` from a proof teaser) pushes the fragment through the History
 * API, which does not update `:target`. The component reads the fragment on
 * mount and on `hashchange`, so a deeplink lands highlighted whether it
 * arrives by a full load, by `next/link`, or by an in-page fragment click.
 * Renders nothing; without script the `:target` rule still applies.
 */
export function AnchorHighlight() {
  useEffect(() => {
    const mark = () => {
      for (const previous of document.querySelectorAll("[data-anchored]")) {
        previous.removeAttribute("data-anchored");
      }
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id === "") return;
      document.getElementById(id)?.setAttribute("data-anchored", "true");
    };
    mark();
    window.addEventListener("hashchange", mark);
    return () => window.removeEventListener("hashchange", mark);
  }, []);

  return null;
}
