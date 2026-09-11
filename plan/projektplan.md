# Projektplan — Website-Komplettrealisierung

Five milestones, each closed by a three-strand quality gate. The
tactical specs (`specs/tactical/`) are the generation prompts; this
plan sequences them. Acceptance criteria stay where they are — the
gate references them by TS id, it never copies them.

## Milestones

### M0 — Durchstich (Setup-Test, wegwerfbar)

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

### M1 — Gerüst

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

### M2 — Struktur

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

### M3 — Inhalt

Texts, images, translations complete; the content pipeline runs.

| Work package | Spec anchor |
| --- | --- |
| Content pipeline: hub packages in, per-locale markdown out, schema + provenance, `TS-###` frontmatter field | TS-007 |
| Page copy DE + EN from go-to-market-os sources per communication principles and tone of voice | content playbook |
| Legal content via existing Google-Docs import, one page with anchor navigation | DEC-039, DEC-027 |
| Imagery per design system (photo surfaces, honest placeholders, "Foto gesucht") | design system |

Gate scope: TS-007 ACs, per-page content ACs; Content compliance
check (eight-point check from the communication principles).

### M4 — Verhalten

Interactions, live data, forms, conversion paths work.

| Work package | Spec anchor |
| --- | --- |
| Relevance engine: scoring, ordering, segmentation | TS-005 |
| Live modules + place search, widening chain, BFF, app handover | TS-008 |
| Personalization stages 0–3, geolocation | TS-010 |
| Forms and leads: envoy widget as mock behind its interface module (Q-022), briefing, order flow with mocked organizerId minting (Q-046), newsletter | TS-016 |
| Mock layer for every missing external system, dummy data labeled, per the mock rule (plan/leitplanken.md) | mock rule |
| Analytics cookieless, event registry, attribution | TS-012 |
| SEO: redirect map, structured data, sitemaps, landing pages | TS-011 |
| Rendering and resilience: static shell, cached islands, three-tier fallback | TS-009, DEC-045/046 |
| Privacy: closed client-request set verified | TS-013 |
| Locale detection algorithm complete | TS-001 |

Gate scope: the ACs of every TS in this table.

### M5 — Feinschliff

Exactly **one** round with a fixed budget. Everything discovered after
that round goes to `state/open.md` instead of being built. M5 ends
with the final Kundenabnahme across all milestones and the closing
run report.

## Das Ergebnis ist ein Prototyp

The run delivers the website as a **finished prototype**: every
function integrated and visible, missing external systems mocked with
labeled dummy data (mock rule, plan/leitplanken.md). It is ready for
reviews and user tests on the protected preview. Going live requires
the subsequent hardening round — real APIs swapped in, mocks removed,
clearances resolved — which is outside this run's scope.

## Quality gate — every milestone

A milestone closes when all three strands are through:

1. **QA** — the milestone's acceptance criteria checked one by one
   (playbook-qa-acceptance-run); no critical, no high finding open.
2. **Kunde** — acceptance protocol written
   (playbook-kundenabnahme): accepted, or rejected with reasons that
   then feed a fix round. The Kunde decides alone; Jan is not asked.
3. **UAT** — conversion paths walked, hesitation points recorded
   (playbook-uat-run). The UAT report is a **signal, not a verdict**;
   the Projektmanager decides what follows from it.

Between strands 1 and 2 the fix-deploy-retest loop from
[prozess.md](prozess.md) runs with its abort criterion.

## Milestone ↔ verification pyramid

The verification level distribution (static 71 · unit 27 ·
integration 67 · e2e 155 · tool 38 · manual 29) is built up over the
milestones: static+unit from M1 on, integration mainly M2/M4, e2e
grows with pages (M2) and behaviour (M4), tool checks (Lighthouse,
axe, bundle guard) enter at M2 and gate at M5. Manual-level criteria
are executed by QA as documented checks and logged in the QA
protocol.
