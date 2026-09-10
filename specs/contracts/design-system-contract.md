---
artefact: contract
id: SRC-013
status: DRAFT
date: 2026-09-10
decisions: [DEC-044, DEC-054]
---

# Design System Contract

What the website needs from the mobile-first styleguide in order to
generate its visual layer. Written as an expectation against
`@schafe-vorm-fenster/brand-design`, not as a design brief.

## The shape: keep the one you already have

The package already does the right thing — one authored source, two
outputs: machine-readable tokens (`tokens.json`, `tokens.css`,
`tokens.tailwind.js`) and a human-readable kit (`kit/…​.html`). **The
styleguide should extend that shape, not introduce a second one.** A
generator reads the manifest; a person reviews the kit; both come from
the same source, so they cannot drift.

Delivered as a versioned package like everything else (DEC-042), so the
website consumes it as a dependency and a change arrives as a version
bump with a changelog.

## What already suffices

Read from v2.6.0 — the specs consume these and restate none of them:

`color` (incl. `dark`, `category`, semantic `roles`) · `font`
(family, weight, size with `clamp()`, lineHeight, letterSpacing, usage) ·
`space` · `breakpoint` (xs…2xl) · `radius` · `border` · `shadow` ·
`target` · `measure` · `logo` · `button` · `categoryDisplay` · `print`.

## What is still missing

### 1. A component manifest — the piece that unblocks generation

One machine-readable entry per component:

| Field | Meaning |
| --- | --- |
| `id` | stable name, referenced from page specs |
| `variants` | the named forms it takes |
| `states` | see §3 — which of them this component implements |
| `slots` | named content holes, each required or optional |
| `tokens` | which token groups it consumes |
| `renders` | which website content type(s) it can render (§4) |

Components reference tokens; they never carry a colour, size or spacing
value of their own. That rule is what lets the linter check it.

### 2. Composition rules

- Container width per breakpoint, and the outer gutter.
- Section rhythm: which `space` token separates blocks, and whether it
  changes by breakpoint.
- The mobile-first rule stated normatively: `min-width` queries only, one
  component tree, no separate desktop layout.
- How the block order every page carries — focus · argument · context
  band · closing CTA (TS-006 D2) — maps onto layout.

### 3. States, named and specified

These are not decoration; the specs require them and the acceptance
criteria test them:

| State | Why it is required |
| --- | --- |
| skeleton | WEB-F-106 — must reserve the final space, no layout shift (CLS < 0.1) |
| empty | WEB-F-044/045 — a conversion occasion, never an error |
| stale | DEC-019 — carries the "Stand: …" freshness label |
| focus-visible | WCAG 2.4.7/2.4.11 (TS-002 D5) |
| hover · active · disabled · loading | ordinary interaction |
| `prefers-reduced-motion` · `prefers-contrast` · dark | TS-002 D4 — three themes, browser-selected, no toggle |

### 4. The binding to content types

Every website content type (TS-007 D5's Zod hierarchy) needs a component
that can render it, and the manifest's `renders` field is where that
binding is declared. This is the layer that turns *specs plus content*
into a page — without it, generation has blocks and text but no rule for
which renders which.

## What is explicitly not needed

Pixel-perfect mockups, an exhaustive Figma library, or documentation
prose. The kit is the visual reference; the manifest is the contract.
Anything not in the manifest is [FREE] for the generator, within TS-002
and TS-017.

## Consequence for the specs

Once the manifest lands, the page specs reference component ids, and
`check:specs` can verify that every component a page names exists — the
same closure the requirement → acceptance criterion → test matrix already
provides.
