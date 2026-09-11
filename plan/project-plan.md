# Project Plan — Full Website Realization

Five milestones plus a setup probe, each closed by a three-strand
quality gate. The tactical specs (`specs/tactical/`) are the
generation prompts; this plan sequences them. Acceptance criteria
stay where they are — the gate references them by TS id, it never
copies them.

## Milestones

### M0 — Tracer bullet (setup test, disposable)

Before any real work: prove the whole toolchain end to end with a
throwaway tracer bullet, so environment friction surfaces in the
first half hour, not inside M1.

| Proof | How |
| --- | --- |
| Scaffold works | `create-next-app` (current major) into a scratch directory |
| Dev server + MCP | `next dev` runs; the `next-devtools` MCP (`.mcp.json`) answers `get_routes` |
| Playwright | browsers install; one trivial spec passes against the scratch app |
| Agent-driven Chrome | the agent opens the scratch app in a local Chrome session and reads the page (chaos-run mechanics) |
| Preview deploy | `vercel deploy` of the scratch app succeeds; URL reachable (protection bypass if set) |
| Teardown | scratch directory deleted; nothing of M0 lands in the repo |

Gate: all six proofs green, recorded in `state/status.md`. A failed
proof is an environment fix (or a `state/open.md` entry with its
degradation — e.g. Chrome fails → chaos falls back to Playwright),
never a reason to start M1 blind. Budget: one hour; M0 produces no
reusable code by design.

### M1 — Scaffold

The repository becomes a deployable Next.js project; the delivery
chain is proven once end to end.

| Work package | Spec anchor |
| --- | --- |
| Technical foundation: Next.js (current major, App Router), root `tsconfig.json` `strict: true`, `pnpm typecheck` wired into `pnpm check`, `stack.allow.json` | TS-017 D1, D5 |
| Test harness: Vitest (unit + integration), Playwright (e2e), real `pnpm test` | verification-strategy, TS-017 |
| Brand binding: single token-import file, brand package pinned exact, no colour/font literal elsewhere | TS-017 D3 |
| Layout shell: mobile-first base, breakpoints `md:768`/`lg:1024`, security headers + CSP scaffold | TS-017 D2, TS-014 |
| Preview chain: `vercel deploy` (preview) from `next-2026`, deployment protection respected, e2e smoke against the preview URL | TS-015, DEC-031 Stage 1 |

Gate scope: TS-017, TS-015 ACs plus one deployed, reachable preview.

### M2 — Structure

Every page and component exists with placeholder content.

| Work package | Spec anchor |
| --- | --- |
| Route tree, translation map (`de` bare, `/en/…`), error pages, redirects skeleton | TS-004 |
| Component library per design system: the six specified components plus the derived set (header, context band, proof card, live-module shells) marked [PROPOSED] | design-system contract, Q-044 assumption |
| All 11 pages composed per page spec, placeholder copy, reserved-space/skeleton discipline | TS-019–TS-029, TS-006 |
| Accessibility foundations: landmarks, focus ring, keyboard order, contrast pairs from the category table | TS-002 |
| Locale routing skeleton: domain matrix, `<html lang>`, hreflang | TS-001 |

Gate scope: TS-004, TS-006, TS-002 structural ACs, page-spec
composition ACs (placeholder level).

### M3 — Content

Texts, images, translations complete; the content pipeline runs.

| Work package | Spec anchor |
| --- | --- |
| Content pipeline: hub packages in, per-locale markdown out, schema + provenance, `TS-###` frontmatter field | TS-007 |
| Page copy DE + EN from go-to-market-os sources per communication principles and tone of voice; missing slots per the dummy-content rule | content playbook |
| Legal content via existing Google-Docs import, one page with anchor navigation | DEC-039, DEC-027 |
| Imagery per design system (photo surfaces, honest placeholders, generated images marked) | design system, dummy-content rule |

Gate scope: TS-007 ACs, per-page content ACs; content compliance
check (eight-point check from the communication principles).

### M4 — Behaviour

Interactions, live data, forms, conversion paths work.

| Work package | Spec anchor |
| --- | --- |
| Relevance engine: scoring, ordering, segmentation | TS-005 |
| Live modules + place search, widening chain, BFF, app handover | TS-008 |
| Personalization stages 0–3, geolocation | TS-010 |
| Forms and leads: envoy widget as mock behind its interface module (Q-022), briefing, order flow with mocked organizerId minting (Q-046), newsletter | TS-016 |
| Mock layer for every missing external system, dummy data labeled, per the mock rule (plan/guardrails.md) | mock rule |
| Analytics cookieless, event registry, attribution | TS-012 |
| SEO: redirect map, structured data, sitemaps, landing pages | TS-011 |
| Rendering and resilience: static shell, cached islands, three-tier fallback | TS-009, DEC-045/046 |
| Privacy: closed client-request set verified | TS-013 |
| Locale detection algorithm complete | TS-001 |

Gate scope: the ACs of every TS in this table.

### M5 — Final acceptance

**Two to three full roundtrips over the complete prototype** — not
per milestone this time, but end to end: QA acceptance sweep + all
four chaos personas + UAT walks over every conversion path, PM
prioritization, fix round, deploy, retest, customer acceptance. The
loop's abort criterion applies (no critical/high open, or three
rounds). Findings beyond the third round go to `state/open.md`. M5
closes with the final customer acceptance
(`reports/acceptance/final.md`) and the run report — that
acceptance **is** the prototype milestone.

## The result is a prototype — complete

The run delivers the website as a **complete prototype**: every
route, every element, full web design, full copy, full images.
Missing external systems are mocked (mock rule), missing content is
generated and marked (dummy-content rule) — completeness beats
emptiness everywhere; both registers live in `state/open.md`. The
prototype runs as preview deployment on Vercel and is fully tested
locally through the roundtrips. It is ready for reviews and user
tests on the protected preview; it does not go live.

## After the prototype (not part of this run)

After the prototype milestone comes a **deliberate manual break**;
the next phases are planned together with Jan, not by this run. The
known workstreams, fed by the run's registers:

1. **Content follow-up** — replace every `Dummy-Content` row with
   real, sourced content.
2. **Content review and tone sharpening** — editorial pass over all
   copy against tone of voice and communication principles.
3. **Usability and feature feedback** — human reviews and user
   tests on the prototype, fed back as change requests.
4. **Finish the mocks** — every `Mock aktiv` row against the real
   systems (hardening round), plus clearances; only then production.

## Quality gate — every milestone

A milestone closes when all three strands are through:

1. **QA** — the milestone's acceptance criteria checked one by one
   (playbook-qa-acceptance-run); no critical, no high finding open.
2. **Customer** — acceptance protocol written
   (playbook-customer-acceptance): accepted, or rejected with reasons that
   then feed a fix round. The Customer decides alone; Jan is not asked.
3. **UAT** — conversion paths walked, hesitation points recorded
   (playbook-uat-run). The UAT report is a **signal, not a verdict**;
   the Project Manager decides what follows from it.

Between strands 1 and 2 the fix-deploy-retest loop from
[process.md](process.md) runs with its abort criterion.

## Milestones and the verification pyramid

The verification level distribution (static 71 · unit 27 ·
integration 67 · e2e 155 · tool 38 · manual 29) is built up over the
milestones: static+unit from M1 on, integration mainly M2/M4, e2e
grows with pages (M2) and behaviour (M4), tool checks (Lighthouse,
axe, bundle guard) enter at M2 and gate at M5. Manual-level criteria
are executed by QA as documented checks and logged in the QA
protocol.
