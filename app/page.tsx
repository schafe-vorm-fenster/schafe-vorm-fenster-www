import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startseite",
};

/**
 * The home placeholder. Pages are M2 (TS-006, TS-019–TS-029) — this exists so
 * the shell has something to render and the e2e smoke has something to load.
 */
export default function HomePage() {
  return (
    <>
      <h1>Schafe vorm Fenster</h1>
      <p>
        Das Fundament steht: Next.js im App Router, strikte Typen, die
        Marken-Tokens und die Sicherheits-Header. Die Seiten selbst entstehen
        im nächsten Arbeitspaket.
      </p>
      <p>
        Diese Seite ist ein Platzhalter aus M1 und trägt keine echten Inhalte.
      </p>
    </>
  );
}
