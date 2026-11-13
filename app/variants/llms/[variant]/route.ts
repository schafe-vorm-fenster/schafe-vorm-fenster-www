import { llmsTxtFor } from "@/src/lib/routes/llms-txt";
import { LLMS_VARIANTS, llmsVariantHost } from "@/src/lib/routes/static-variants";

/**
 * TS-WEB-0004 D1/A5 — `/llms.txt`, "per domain": one prerendered file per
 * domain of the matrix (DEC-0164).
 *
 * `proxy.ts` rewrites `/llms.txt` onto the variant of the request's domain
 * (`domainConfigFor`, whose fallback for `localhost` and `*.vercel.app` is
 * `.de`). The body is `llmsTxtFor()` of that domain's canonical host — the
 * same function, with the same input it would have computed per request.
 */
export function generateStaticParams(): { variant: string }[] {
  return LLMS_VARIANTS.map((variant) => ({ variant }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/variants/llms/[variant]">,
): Promise<Response> {
  const host = llmsVariantHost((await params).variant);
  if (!host) return new Response(null, { status: 404 });
  return new Response(llmsTxtFor(host), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
