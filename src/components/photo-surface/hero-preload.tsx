"use client";

import { useEffect, useState } from "react";

/**
 * The LCP preload links of a `priority` photo surface — issue 230.
 *
 * A viewport prefetch (`next/link`) renders the destination page's tree on the
 * client, and React hoists any `<link rel="preload">` in it into the *current*
 * document's head. The visitor is still on another page, so Chrome logged
 * "preloaded but not used" for each hero. A preload only helps the document
 * that is being loaded, so the links are emitted for the first render of the
 * document (server HTML and its hydration) and for nothing rendered after the
 * first commit, which is every prefetched or navigated-to tree.
 */
let documentCommitted = false;

export interface HeroPreloadProps {
  readonly src: string;
  readonly wideSrc?: string;
}

export function HeroPreload({ src, wideSrc }: HeroPreloadProps) {
  // Lazy initial state: fixed at this component's first render, so the
  // hydration pass matches the server HTML and a later mount reads `true`.
  const [initialDocument] = useState(() => !documentCommitted);

  useEffect(() => {
    documentCommitted = true;
  }, []);

  if (!initialDocument) return null;

  return (
    <>
      <link
        as="image"
        fetchPriority="high"
        href={src}
        media={wideSrc ? "(max-width: 47.999rem)" : undefined}
        rel="preload"
      />
      {wideSrc ? (
        <link
          as="image"
          fetchPriority="high"
          href={wideSrc}
          media="(min-width: 48rem)"
          rel="preload"
        />
      ) : null}
    </>
  );
}

/** Mounted once in the root layout: marks the document's first commit. */
export function DocumentCommitMarker() {
  useEffect(() => {
    documentCommitted = true;
  }, []);
  return null;
}
