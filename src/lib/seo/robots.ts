/**
 * The `robots.txt` body — TS-WEB-0015 D3, surface 2 of 3.
 *
 * Kept beside the predicate rather than inside `app/robots.ts` so the rule is
 * one pure function: the route is the wiring, this is the decision.
 */

import type { MetadataRoute } from "next";

import { isIndexable } from "@/src/lib/seo/indexable";

/**
 * The AI crawlers `robots.txt` allows by name in production (FUN-WEB-0169,
 * DEC-0018: "AI crawlers are explicitly permitted"). DEC-0018 names no list;
 * these are the vendors' documented user-agent tokens for training, search
 * and user-triggered fetching. One place: add or remove an agent here only.
 */
export const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
] as const;

export function robotsFor(
  vercelEnv: string | undefined,
  host: string | null | undefined,
): MetadataRoute.Robots {
  if (!isIndexable(vercelEnv, host)) {
    // Non-production: disallow everything, and no sitemap reference.
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `https://${normalise(host)}/sitemap.xml`,
  };
}

/**
 * The `robots.txt` text of a `Robots` object, in the exact form Next's own
 * `app/robots.ts` metadata route writes it (`resolveRobots` in
 * `next/dist/build/webpack/loaders/metadata/resolve-route-data.js`) for the
 * fields this site uses. The robots surface is now a prerendered route
 * handler per variant (DEC-0164), so the serialisation that metadata route did
 * for us is done here — byte-for-byte the same body.
 */
export function robotsTxt(robots: MetadataRoute.Robots): string {
  const list = (value: string | string[] | undefined): string[] =>
    value === undefined ? [] : Array.isArray(value) ? value : [value];
  let content = "";
  for (const rule of Array.isArray(robots.rules) ? robots.rules : [robots.rules]) {
    for (const agent of list(rule.userAgent ?? "*")) content += `User-Agent: ${agent}\n`;
    for (const item of list(rule.allow)) content += `Allow: ${item}\n`;
    for (const item of list(rule.disallow)) content += `Disallow: ${item}\n`;
    content += "\n";
  }
  for (const item of list(robots.sitemap)) content += `Sitemap: ${item}\n`;
  return content;
}

function normalise(host: string | null | undefined): string {
  return (host ?? "").toLowerCase().split(":")[0] ?? "";
}
