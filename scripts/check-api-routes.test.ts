import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { checkApiRoutes, checkAppHostname } from "./check-api-routes";

/**
 * F-1-3 (round 1): TS-WEB-0017-A10 and A11 held only because no `app/api/*`
 * route and no handover module existed yet to violate them — this suite
 * proves the checks actually fire, with fixtures built fresh per test
 * (never committed to the tree) and removed afterwards.
 */

let fixtureRoot: string | undefined;

function fixture(...segments: string[]): string {
  const path = join(fixtureRoot!, ...segments);
  mkdirSync(join(path, ".."), { recursive: true });
  return path;
}

afterEach(() => {
  if (fixtureRoot) rmSync(fixtureRoot, { recursive: true, force: true });
  fixtureRoot = undefined;
});

function newRoot(): string {
  fixtureRoot = mkdtempSync(join(tmpdir(), "check-api-routes-"));
  return fixtureRoot;
}

describe("TS-WEB-0017-A10: every app/**/route.ts exports GET and nothing else", () => {
  it("passes a route.ts that exports only GET", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "api", "places", "route.ts"),
      "export async function GET() { return new Response('ok'); }",
    );
    const result = checkApiRoutes(root);
    expect(result.errors).toEqual([]);
    expect(result.routeFileCount).toBe(1);
  });

  it("fails a route.ts that also exports POST", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "api", "leads", "route.ts"),
      [
        "export async function GET() { return new Response('ok'); }",
        "export async function POST() { return new Response('ok'); }",
      ].join("\n"),
    );
    const result = checkApiRoutes(root);
    expect(
      result.errors.some((e) => e.startsWith("A10") && e.includes("POST")),
    ).toBe(true);
  });

  it("fails a route.ts that re-exports POST via a named export list", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "api", "region", "route.ts"),
      'export { GET, POST } from "./handlers";',
    );
    const result = checkApiRoutes(root);
    expect(
      result.errors.some((e) => e.startsWith("A10") && e.includes("POST")),
    ).toBe(true);
  });

  it("fails a route.ts written with the const-arrow handler style exporting DELETE", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "api", "places", "route.ts"),
      [
        "export const GET = async () => new Response('ok');",
        "export const DELETE = async () => new Response('ok');",
      ].join("\n"),
    );
    const result = checkApiRoutes(root);
    expect(
      result.errors.some((e) => e.startsWith("A10") && e.includes("DELETE")),
    ).toBe(true);
  });

  it("fails a route.ts that exports no GET handler at all", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "api", "stats", "route.ts"),
      "export async function POST() { return new Response('ok'); }",
    );
    const result = checkApiRoutes(root);
    expect(
      result.errors.some((e) => e.startsWith("A10") && e.includes("no GET")),
    ).toBe(true);
  });

  it("ignores route-segment config exports (dynamic, revalidate, runtime)", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "api", "nearby", "route.ts"),
      [
        "export const dynamic = 'force-dynamic';",
        "export const revalidate = 60;",
        "export const runtime = 'nodejs';",
        "export async function GET() { return new Response('ok'); }",
      ].join("\n"),
    );
    const result = checkApiRoutes(root);
    expect(result.errors).toEqual([]);
  });

  it("passes an empty route tree (no app/api routes exist yet)", () => {
    const root = newRoot();
    mkdirSync(join(root, "app"), { recursive: true });
    const result = checkApiRoutes(root);
    expect(result.errors).toEqual([]);
    expect(result.routeFileCount).toBe(0);
  });
});

describe("TS-WEB-0017-A11: no code names the retired app host, and APP_URL lives in one module (DEC-0177)", () => {
  const HOME = join("src", "lib", "live", "app-handover.ts");
  const homeSource = [
    "/** `app.schafe-vorm-fenster.de` has no DNS record (DEC-0177). */",
    'export const APP_URL = "https://schafe-vorm-fenster.de/schlatkow.2838887";',
  ].join("\n");

  it("passes when APP_URL's literal sits in the handover module and the old host only in a comment", () => {
    const root = newRoot();
    writeFileSync(fixture("src", "lib", "live", "app-handover.ts"), homeSource);
    const result = checkAppHostname(root);
    expect(result.errors).toEqual([]);
    expect(result.occurrences).toEqual([]);
    expect(result.appUrlModules).toEqual([HOME]);
  });

  it("fails a module whose code still links the retired app host", () => {
    const root = newRoot();
    writeFileSync(fixture("src", "lib", "live", "app-handover.ts"), homeSource);
    writeFileSync(
      fixture("app", "[lang]", "dein-ort", "some-card.tsx"),
      'export const link = "https://app.schafe-vorm-fenster.de/beispieldorf";',
    );
    const result = checkAppHostname(root);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain("A11");
    expect(result.occurrences).toEqual([join("app", "[lang]", "dein-ort", "some-card.tsx")]);
  });

  it("fails a second copy of APP_URL's literal", () => {
    const root = newRoot();
    writeFileSync(fixture("src", "lib", "live", "app-handover.ts"), homeSource);
    writeFileSync(
      fixture("src", "lib", "routes", "redirect-map.ts"),
      'export const to = "https://schafe-vorm-fenster.de/schlatkow.2838887";',
    );
    const result = checkAppHostname(root);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain("outside");
  });

  it("does not count a module that only imports the APP_URL identifier", () => {
    const root = newRoot();
    writeFileSync(fixture("src", "lib", "live", "app-handover.ts"), homeSource);
    writeFileSync(
      fixture("src", "components", "gallery.tsx"),
      ['import { APP_URL } from "@/src/lib/live/app-handover";', "const demo = <HowtoBlock appHref={APP_URL} />;"].join("\n"),
    );
    const result = checkAppHostname(root);
    expect(result.errors).toEqual([]);
  });

  it("ignores the app/dev gallery page and test files", () => {
    const root = newRoot();
    writeFileSync(fixture("src", "lib", "live", "app-handover.ts"), homeSource);
    writeFileSync(
      fixture("app", "dev", "components", "page.tsx"),
      'export default function Page() { return "https://app.schafe-vorm-fenster.de"; }',
    );
    writeFileSync(
      fixture("src", "lib", "routes", "routing.integration.test.ts"),
      'expect(destination).not.toContain("app.schafe-vorm-fenster.de");',
    );
    const result = checkAppHostname(root);
    expect(result.errors).toEqual([]);
  });

  it("keeps a `//` inside a string as code", () => {
    const root = newRoot();
    writeFileSync(fixture("src", "lib", "live", "app-handover.ts"), homeSource);
    writeFileSync(fixture("src", "lib", "x.ts"), 'const a = 1; const u = "https://app.schafe-vorm-fenster.de";');
    expect(checkAppHostname(root).errors).toHaveLength(1);
  });

  it("passes when nobody mentions either literal at all", () => {
    const root = newRoot();
    mkdirSync(join(root, "src"), { recursive: true });
    const result = checkAppHostname(root);
    expect(result.errors).toEqual([]);
  });
});
