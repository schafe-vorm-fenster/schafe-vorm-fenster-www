/**
 * Post-deploy guard (issue 216): every generated image route answers 200 with
 * an `image/*` content type on a *deployed* site. Local `pnpm start` hides the
 * bug this catches — files read with `fs` at request time that output file
 * tracing left out of the serverless bundle.
 *
 * Usage: `tsx scripts/check-image-routes.ts <base-url>`; the optional
 * `VERCEL_AUTOMATION_BYPASS_SECRET` is sent as the protection-bypass header.
 * The route list comes from the same sources the page metadata uses.
 */
import { LOCALES } from "../src/lib/i18n/locales";
import { ROUTE_IDS } from "../src/lib/routes/routes";
import { APP_ICON_SIZES } from "../src/lib/seo/app-icons";

const base = process.argv[2]?.replace(/\/$/, "");
if (!base) {
  console.error("usage: check-image-routes.ts <base-url>");
  process.exit(2);
}
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

const paths = [
  "/favicon.ico",
  ...APP_ICON_SIZES.map((size) => `/api/icon/${size}`),
  ...LOCALES.flatMap((lang) => ROUTE_IDS.map((route) => `/api/og/${lang}/${route}`)),
];

let failures = 0;
for (const path of paths) {
  const response = await fetch(`${base}${path}`, {
    headers: bypass ? { "x-vercel-protection-bypass": bypass } : {},
  });
  const type = response.headers.get("content-type") ?? "";
  const ok = response.status === 200 && type.startsWith("image/");
  if (!ok) failures += 1;
  console.log(`${ok ? "ok  " : "FAIL"} ${response.status} ${type.padEnd(12)} ${path}`);
}
if (failures > 0) {
  console.error(`${failures} of ${paths.length} image routes failed on ${base}`);
  process.exit(1);
}
console.log(`all ${paths.length} image routes ok on ${base}`);
