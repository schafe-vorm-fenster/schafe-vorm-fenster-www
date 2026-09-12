---
id: DEC-077
title: "Example imagery is model-generated, marked, and produced by a script — with `ai` and `sharp` as build-time tooling"
status: accepted
date: 2026-09-12
decided_by: jan-henrik.hempel (instruction) · run/developer (tooling)
---

## Context

DEC-068 filled every image gap with a flat, obviously graphic placeholder:
a brand-token colour field, a hatch, the slot label, the word PLATZHALTER.
That was the right answer to "the site must be buildable before the content
exists", and it is the wrong answer to the question this run now asks —
whether the site *works*. A hatch cannot show what a photo section looks
like with a photograph in it: not the gradient against real pixels, not the
contrast of white type over a bright sky, not whether the phone's 8:9 hero
still reads at 360 px. Eight of the eleven pages are photo-led by design
(`concept/website-design-system.md` § Page Rhythm), and eight hatches in a
row are not a prototype anybody can judge.

Jan's instruction for this workstream is explicit: generate the example
imagery with a model and place it. Alongside it, three photographs that are
actually ours became available through `@schafe-vorm-fenster/people`.

The tooling question that comes with it is the stack-harmony rule of
`plan/guardrails.md`: calling a model needs a client, and cropping and
encoding its output needs an image library.

## Sideways look

Read off `package.json` in the sibling repositories under `~/Projects/` on
2026-09-12:

| Repository | `ai` | `sharp` |
| --- | --- | --- |
| `envoy-api` | `^6.0.175` (Gemini client) | `^0.34.5` |
| `assets-api` | — | `^0.34.5` (image optimiser) |
| `eventification-dataset` | — | `^0.35.4` |
| `google-drive-api` | — | `jimp@^1.6.0` |
| `classification-api`, `events-api`, `geo-api`, `community-calendar` | — | — |

Both are established in the family; neither is a new kind of dependency. No
sibling generates images, so the model call itself is a first.

`sharp@0.35.4` is additionally already in this repository's lockfile —
Next.js 16.3.4's image optimiser resolves exactly that version — so
declaring it adds **no** package to the tree. It has to be declared all the
same: pnpm's layout keeps a transitive package off the root resolution path,
and a script cannot import what is not a direct dependency.

## Decision

**1 — Generated imagery is allowed as a marked placeholder, under DEC-068's
guardrails, not as an exception to them.**

`scripts/generate-images.mjs` (`pnpm images:generate`) renders the `images:`
entries of the page artifacts through the Vercel AI Gateway. The guardrails
that make it safe are the ones DEC-068 already wrote, applied to a
photographic rendition rather than a hatch:

- **Marked in the markup.** Every generated image carries
  `data-placeholder="generated:<model>"`, so a build enumerates them.
- **Marked on the page.** Every generated image carries the design system's
  placeholder badge — *"Nicht motivgenau · Platzhalter"* — because it does
  not depict what the copy claims. The badge text is the design system's
  [FIXED] string and is not reworded into a new one; the AI origin is
  carried by the markup and by the frontmatter entry (`model`,
  `prompt_hash`, `generated_at`), which is where a reviewer and a build can
  both read it.
- **No fabricated person, no fabricated record.** Every prompt carries, on
  top of its brief: no text, no lettering, no logos, no legible signage, no
  identifiable faces. **No portrait is ever generated** — a person's face
  comes from `@schafe-vorm-fenster/people` or the slot keeps its "Foto
  gesucht" hatch. No generated image enters a proof slot (DEC-068 rule 4
  stands untouched); the proof entries in the inventory stay
  `status: needed`.
- **Blocking for launch, not for build.** Unchanged. The register is
  `state/open.md`; replacing these with real photography is the follow-up
  workstream.

DEC-068 rule 3's sentence "no invented village" is the one this decision
narrows, and deliberately: a generated rural scene *is* an invented village.
It may stand only because it never claims to be a particular one — the badge
says so, the alt text describes a scene and not a place, no sign in frame is
legible, and the prototype does not go live. Where a picture would assert
something — a person, a record, a product screen, a testimonial — the hatch
stays.

**2 — The photograph is a CSS background in `photo-surface`, and `next/image`
everywhere else.**

`media-frame` (portraits, scenes, path images, feature images) renders
through `next/image` with an explicit ratio box, `sizes`, real `alt` text,
and `fetchpriority="high"` on the one declared LCP image per page. The
`photo-surface` heroes keep the background-image the design system requires
("the photograph is the section's first background layer with a
`linear-gradient` above it *in the same declaration*"), because that rule is
what makes the scrim scale with the image and it is [FIXED]. Two
consequences follow, and both are handled rather than accepted:

- A background carries no `loading`/`fetchpriority`. The declared image LCP
  that sits on a `photo-surface` (`/mitmachen`, TS-003 D2) gets a
  `<link rel="preload" as="image" fetchpriority="high">` per rendition
  instead, behind the media query that decides which rendition is painted.
- A single 21:9 frame centre-cropped into the phone's 8:9 hero box loses its
  motif. So a `ratio: hero` entry gets **two** renditions — the upright one
  is the base (mobile-first, TS-017 D2), the landscape one is swapped in at
  48rem, the same width at which `--ratio-hero` turns landscape.

**3 — `ai@7.0.99` and `sharp@0.35.4` are devDependencies, pinned exact.**

Both are build-time tooling: they run in `pnpm images:generate` on a
developer machine, never in a request. Neither goes into `dependencies`, so
neither reaches the deployed bundle, and `stack.allow.json` (which registers
*runtime* dependencies, TS-017 D1) does not gain a row.

Exact pins, not ranges: `ai` publishes several times a day across three
concurrent majors, and a range would make a rebuild non-reproducible.

**4 — The model is `bfl/flux-pro-1.1` through the Vercel AI Gateway, on the
project's OIDC token.**

No API key is created and none is stored: the token comes from `.env.local`,
which the script reads and never writes (it carries a hand-added secret that
`vercel env pull` would drop), and an expired token is refreshed into a
scratch file under the OS temp directory. Credentials never reach the
repository (`plan/guardrails.md`).

The gateway's own pricing — $0.04 per image — is what the script quotes in
its dry run. Aspect ratio is passed as `size`, which flux honours; the exact
design-system ratio is then cut by sharp, because the box on the page
declares that ratio before the image arrives and a rendition a few pixels
off is the one thing that reflows a page after paint. Every file is encoded
to WebP down a quality ladder until it clears TS-003 D1's 100 KB budget.

## Supply-chain audit

Run before adoption (`supply-chain-risk-auditor`, 2026-09-12): two direct
packages and 41 registry-verified transitive packages, at their resolved
versions.

| | `ai@7.0.99` | `sharp@0.35.4` |
| --- | --- | --- |
| Advisories (direct + tree) | none | none |
| Install-time scripts | none | none (prebuilt libvips since 0.33) |
| Lockfile delta | 9 entries | 0 — already resolved via `next` |
| Upstream | `vercel/ai`, active, Apache-2.0 | `lovell/sharp`, active, Apache-2.0 |
| Weekly downloads | 18.2 M | 74.0 M |

Unassessable in both cases: publisher concentration — both publish from CI
with provenance, so the effective publisher set is whoever can merge, which
is not observable from outside. `vercel/ai` has no Scorecard report; sharp's
code-review score is 3/10 against a single-maintainer upstream. Both risks
are carried rather than mitigated, and both are bounded by the packages
being devDependencies that never run in production.

## Consequences

- `pnpm images:generate` is idempotent: an entry already `generated` is
  skipped, a rendition already on disk is reused rather than paid for twice,
  `--force <id>` re-renders one, `--dry-run` prints every prompt and the
  cost and calls nothing. A rate limit is waited out, not crashed on, and
  the frontmatter is written after every entry so an interrupted run keeps
  what it produced.
- The frontmatter entry **is** the provenance record. There is no sidecar
  file: `file`, `width`, `height`, `model`, `generated_at` and `prompt_hash`
  live in the same `images:` list the brief lives in, in both locale files.
  A changed brief is a changed hash, which is what makes a re-render
  visible in a diff.
- `placeholders.manifest.json` and `src/generated/placeholders/` stay as
  they are. The flat hatch is still what a slot with no entry falls back to,
  and the OG fallback image is still generated from it.
- Three real photographs now ship in `public/images/real/`, cropped and
  re-encoded from `go-to-market-os`. The npm packages publish the
  `.asset.md` descriptor but not the binary, so a package subpath import
  cannot resolve one yet — `state/open.md` carries the row that would let
  the import replace the copy.
