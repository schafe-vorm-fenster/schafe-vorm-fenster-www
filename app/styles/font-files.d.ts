/**
 * `import url from "….woff2" with { turbopackModuleType: "asset" }` — the
 * asset module type hands back the emitted URL (`font-preload.ts`).
 */
declare module "*.woff2" {
  const url: string;
  export default url;
}
