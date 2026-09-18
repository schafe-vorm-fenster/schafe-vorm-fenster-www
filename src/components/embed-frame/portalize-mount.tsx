"use client";

import { useEffect, useRef, useState } from "react";

import { portalizeLoaderUrl } from "@/src/lib/embed/portalize";

export interface PortalizeMountProps {
  /** The public organizer id of the calendar to embed. */
  readonly organizerId: string;
  /** The mount's DOM id — the loader refuses an element without one. */
  readonly id: string;
  readonly showFilter?: boolean;
  readonly showBranding?: boolean;
  readonly weeksAhead?: number;
  readonly className?: string;
}

/**
 * The real Portalize widget's mount — TS-008 D6, `state/open.md` row 82.
 *
 * Two properties it exists to give, neither of which the loader provides:
 *
 *  - **lazy, below the fold.** The embed sits in the middle of
 *    `/dein-kalender`, and its loader pulls a second module plus two API
 *    calls. An `IntersectionObserver` with a 300 px margin injects the
 *    `<script>` only when the block is about to be reached, so a visitor who
 *    never scrolls that far pays nothing for it.
 *  - **failure is silence.** TS-008 D6: a blocked or failing loader leaves
 *    the heading, the copy and the CTA standing and shows no error sentence
 *    and no empty frame. The `<script onerror>` marks the mount, the CSS
 *    hides the reserved box, and the block around it is unchanged.
 *
 * The loader mounts a `<portalize-widget>` custom element with an open
 * shadow root; there is **no iframe**, so the site's `frame-src 'none'`
 * stays as it is. The script and the module both come from the one Portalize
 * origin already in the TS-014 D1 allowlist.
 */
export function PortalizeMount({
  organizerId,
  id,
  showFilter = true,
  showBranding = false,
  weeksAhead,
  className,
}: PortalizeMountProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = ref.current;
    if (mount === null) return undefined;

    const src = portalizeLoaderUrl(organizerId);
    // One loader per document, however many mounts a page carries.
    if (document.querySelector(`script[src="${src}"]`) !== null) return undefined;

    let injected = false;
    const inject = () => {
      if (injected) return;
      injected = true;
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.addEventListener("error", () => setFailed(true));
      document.head.append(script);
    };

    if (typeof IntersectionObserver !== "function") {
      inject();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          inject();
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(mount);
    return () => observer.disconnect();
  }, [organizerId]);

  return (
    <div
      className={className}
      data-portalize-failed={failed ? "true" : undefined}
      data-portalize-widget
      data-show-branding={showBranding ? "true" : undefined}
      data-show-filter={showFilter ? undefined : "false"}
      data-weeks-ahead={weeksAhead === undefined ? undefined : String(weeksAhead)}
      id={id}
      ref={ref}
    />
  );
}
