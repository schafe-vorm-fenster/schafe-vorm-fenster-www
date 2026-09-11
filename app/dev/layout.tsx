import "../styles/brand.css";
import "../styles/base.css";

import type { ReactNode } from "react";

/**
 * The root layout for `app/dev/**`.
 *
 * `app/[lang]/layout.tsx` is the site's root layout (TS-004 D2), but
 * `app/dev` is a sibling tree outside `[lang]` — the language segment is not
 * a language here, it is a development tool. Next.js requires exactly one
 * root layout per independent route subtree to render `<html>` and `<body>`;
 * without this file the subtree rendered neither, which surfaces only as a
 * runtime error in the browser (`renderToStaticMarkup(<ComponentGallery />)`
 * in `gallery.test.tsx` never exercises the page/layout tree, so `pnpm check`
 * stayed green while `/dev/components` itself was broken).
 *
 * Same two stylesheets as the real root layout — the token file and the
 * shell, never a copy — because the component gallery renders the same
 * components the real pages do and needs the same tokens to look right.
 */
export default function DevLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
