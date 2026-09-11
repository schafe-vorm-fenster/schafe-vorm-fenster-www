import { notFound } from "next/navigation";

import { ComponentGallery } from "@/src/components/gallery";

// The app tree's root layout lives under `app/[lang]/` (TS-004 D2), so this
// route outside it brings the two stylesheets itself. They are the same two
// files the layout imports — the token file and the shell — never a copy.
import "../../styles/brand.css";
import "../../styles/base.css";

import type { Metadata } from "next";

/**
 * The visual check for the M2 foundation component set — every component in
 * every state it declares.
 *
 * This is **not** a production route. It answers 404 on production, it is
 * `noindex` everywhere (the layout's metadata and the proxy's `X-Robots-Tag`
 * both say so outside production, and this page says it on its own account),
 * and no page of the site links to it. It exists so the components can be
 * looked at in a browser rather than only in a render test — the test
 * (`src/components/gallery.test.tsx`) asserts the same tree.
 */
export const metadata: Metadata = {
  title: "Komponenten (dev)",
  robots: { index: false, follow: false },
};

export default function ComponentGalleryPage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <div className="container">
      <h1>Komponenten — M2</h1>
      <p>
        Jede Komponente der Inventar-Abschnitte 2.1, 2.2 und 2.6 mit allen
        Zuständen, die sie deklariert. Entwicklungsseite, nicht Teil der
        Website.
      </p>
      <ComponentGallery />
    </div>
  );
}
