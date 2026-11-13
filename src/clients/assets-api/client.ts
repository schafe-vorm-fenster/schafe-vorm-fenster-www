/**
 * assets-api client — a Wikimedia Commons file as a deliverable image, and
 * the attribution that comes with it (DEC-0167).
 *
 * Two facts about the service decide this module's shape (verified in the
 * service repository, 2026-10-14):
 *
 *  1. `GET /api/image?wikimediaCommonsId=<file>` answers the image as WebP,
 *     no token, CDN-cached. Only this parameter form carries the attribution:
 *     a `url=` pointing at Commons' `Special:FilePath/…` (what geo-api
 *     returns) is fetched as an anonymous URL and loses it. So every Commons
 *     reference is reduced to its **file name** first.
 *  2. The attribution exists **only as response headers** — `License` (the
 *     Commons `LicenseShortName`, e.g. `CC BY-SA 4.0`) and `Copyright`
 *     (`(C) <year> <author>`), plus `X-Image-Width`/`X-Image-Height`. There is
 *     no JSON metadata operation, so the lookup reads the headers of a `GET`
 *     of the same URL (a `HEAD` was answered from a separate CDN entry and
 *     claimed success for images whose `GET` fails — `http.ts`).
 *
 * The image URL is handed to the browser (it loads the picture itself, under
 * the CSP's `img-src`); the check happens here, server-side, and only its
 * parsed result crosses the BFF.
 */

import { callUpstreamImageHeaders } from "../http";

export interface AssetsApiConfig {
  readonly host: string;
  readonly timeoutMs: number;
}

/** What assets-api states about one Commons file. Every field may be missing upstream. */
export interface CommonsAttribution {
  /** `License` — the Commons short name, verbatim. */
  readonly licence?: string;
  /** The author out of `Copyright` (`(C) 2019 Jan-Henrik Hempel` → `Jan-Henrik Hempel`). */
  readonly author?: string;
  /** The year out of `Copyright`, where it carries one. */
  readonly year?: string;
  readonly width?: number;
  readonly height?: number;
}

const COMMONS_HOSTS = new Set(["commons.wikimedia.org", "upload.wikimedia.org"]);

/**
 * The Commons **file name** behind any reference the ecosystem hands out, or
 * `undefined` when the reference is not a Commons file:
 *
 *  - geo-api: `https://commons.wikimedia.org/wiki/Special:FilePath/Melkerschule%20Schlatkow.jpg`
 *  - Commons page: `https://commons.wikimedia.org/wiki/File:Melkerschule_Schlatkow.jpg`
 *  - upload host: `https://upload.wikimedia.org/wikipedia/commons/(thumb/)a/ab/<file>(/…px-<file>)`
 *  - the public calendar: `https://assets.api…/api/image?wikimediaCommonsId=Melkerschule%20Schlatkow.jpg`
 *
 * Underscores become spaces, as Commons itself treats them.
 */
export function commonsFileName(reference: string | null | undefined): string | undefined {
  if (!reference) return undefined;
  let url: URL;
  try {
    url = new URL(reference);
  } catch {
    return undefined;
  }

  const normalise = (raw: string): string | undefined => {
    let name: string;
    try {
      name = decodeURIComponent(raw);
    } catch {
      return undefined;
    }
    name = name.replace(/^File:/iu, "").replace(/_/gu, " ").trim();
    return name === "" || name.length > 500 ? undefined : name;
  };

  const viaAssets = url.searchParams.get("wikimediaCommonsId");
  if (viaAssets !== null && url.pathname.endsWith("/api/image")) return normalise(encodeURIComponent(viaAssets));

  if (!COMMONS_HOSTS.has(url.hostname)) return undefined;

  if (url.hostname === "commons.wikimedia.org") {
    const match = /^\/wiki\/(?:Special:FilePath\/|File:)(.+)$/u.exec(url.pathname);
    return match?.[1] === undefined ? undefined : normalise(match[1]);
  }

  // upload.wikimedia.org/wikipedia/commons/a/ab/<file> or …/thumb/a/ab/<file>/<n>px-<file>
  const parts = url.pathname.split("/").filter(Boolean);
  const commons = parts.indexOf("commons");
  if (commons === -1) return undefined;
  const rest = parts.slice(commons + 1);
  const file = rest[0] === "thumb" ? rest[3] : rest[2];
  return file === undefined ? undefined : normalise(file);
}

/** The deliverable image of one Commons file — the URL the browser loads. */
export function commonsImageUrl(config: Pick<AssetsApiConfig, "host">, fileName: string): string {
  const url = new URL(`${config.host}/api/image`);
  url.searchParams.set("wikimediaCommonsId", fileName);
  // `URLSearchParams` writes a space as `+`; `%20` is the form the service and
  // the public calendar use, and it keeps the URL free of characters a CSS
  // `url("…")` would have to escape (`photo-surface/url.ts`).
  return url.toString().replace(/\+/gu, "%20");
}

/** The Commons file page — where the full attribution, licence text and history live. */
export function commonsFilePage(fileName: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName.replace(/ /gu, "_"))}`;
}

function positive(value: string | undefined): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/** `(C) 2019 Jan-Henrik Hempel` / `© 2019 Name` / `Name` → year and author. */
export function parseCopyright(raw: string | undefined): { author?: string; year?: string } {
  const text = raw?.replace(/\s+/gu, " ").trim();
  if (!text) return {};
  const match = /^(?:\(c\)|©|copyright)?\s*(\d{4})?\s*(.*)$/iu.exec(text);
  const year = match?.[1];
  const author = match?.[2]?.trim();
  return { ...(author ? { author } : {}), ...(year ? { year } : {}) };
}

/** Header record → attribution. Exported so the parsing is tested without a network. */
export function attributionFromHeaders(headers: Readonly<Record<string, string>>): CommonsAttribution {
  const licence = headers["license"]?.replace(/\s+/gu, " ").trim();
  const width = positive(headers["x-image-width"]);
  const height = positive(headers["x-image-height"]);
  return {
    ...(licence ? { licence } : {}),
    ...parseCopyright(headers["copyright"]),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };
}

/** The image URL's own `GET` — whether it delivers, and the attribution assets-api states for the file. */
export async function commonsAttribution(config: AssetsApiConfig, fileName: string): Promise<CommonsAttribution> {
  const headers = await callUpstreamImageHeaders({
    service: "assets-api",
    url: commonsImageUrl(config, fileName),
    timeoutMs: config.timeoutMs,
  });
  return attributionFromHeaders(headers);
}
