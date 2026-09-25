# Conflicts

## Purpose

The conflict register. `@leafcutter-strict/method-conflict-taxonomy` classifies
a detected contradiction by one of six types and derives from the type which
resolutions are open to it, *"because the type of the disagreement decides how
it can be resolved"*. One file per conflict, named for the artefact it holds
(DEC-0086 §4).

A conflict record is **not** a second copy of a decision. The decision record
says what was decided and why; the conflict record says what collided, on what
evidence, at what impact, and which outcomes the type permitted. Where a
`DEC-####` resolved the conflict, the record names it in `decision_record` and
stops there.

## What is in here

**25 conflicts.** DEC-0099 created 22 of them: 18 read out of the decision
records — contradictions this project actually had — and 4 found by the locator
run of DEC-0097. Two more, `CONF-0023` and `CONF-0024`, were found in the
installed contracts themselves and were missing from this index until
2026-09-25; `CONF-0025` was raised by the DEC-0013 amendment of the same day.
Twenty are `RESOLVED` and five are `OPEN`.

Most decisions are **not** conflicts. The method is explicit: *"A requirement
that is merely surprising, inconvenient, or expensive"* is not one, and *"a
conflict is a contradiction between two statements, not a disagreement with
one of them."* DEC-0059 says so about itself — "There was no contradiction to
resolve, only an imprecise sentence" — and it is not in here.

## The register

| ID | Type | Status | Impact | Resolved in | Conflict |
| --- | --- | --- | --- | --- | --- |
| [CONF-0001](CONF-0001--a-requirement-carried-a-news-section-that-the.md) | direct_contradiction | RESOLVED | Medium | DEC-0022 | A requirement carried a news section that the authoritative information architecture has no page for |
| [CONF-0002](CONF-0002--two-tactical-specs-were-written-against-a-typeface.md) | dependency_conflict | RESOLVED | Medium | DEC-0043 | Two tactical specs were written against a typeface the brand package had already retired |
| [CONF-0003](CONF-0003--the-inline-newsletter-block-was-permitted-because-ueber.md) | dependency_conflict | RESOLVED | Medium | DEC-0052 | The inline newsletter block was permitted because /ueber-uns had no conversion of its own — and then it got one |
| [CONF-0004](CONF-0004--the-design-system-sets-display-type-at-weight.md) | value_conflict | RESOLVED | Low | DEC-0056 | The design system sets display type at weight 800 while the token package declares only 400 and 700 |
| [CONF-0005](CONF-0005--two-tactical-specs-disagreed-on-whether-ort-pages.md) | direct_contradiction | RESOLVED | Medium | DEC-0057 | Two tactical specs disagreed on whether ?ort= pages are indexable |
| [CONF-0006](CONF-0006--the-wireframes-address-the-verwaltung-as-sie-while.md) | direct_contradiction | RESOLVED | Medium | DEC-0066 | The wireframes address the Verwaltung as Sie while the communication principles require one sender across all four jobs |
| [CONF-0007](CONF-0007--the-copy-guide-fails-the-build-on-a.md) | direct_contradiction | RESOLVED | High | DEC-0066 | The copy guide fails the build on a Sie form while the legal page is imported verbatim in the formal register |
| [CONF-0008](CONF-0008--the-breakpoint-scale-six-token-values-against-the.md) | value_conflict | RESOLVED | High | DEC-0067 | The breakpoint scale: six token values against the spec's two, with the names md and lg reused for different pixel values |
| [CONF-0009](CONF-0009--the-dein-ort-starten-page-was-forbidden-to.md) | direct_contradiction | RESOLVED | Medium | DEC-0071 | The /dein-ort/starten page was forbidden to address the reader directly while the copy guide makes direct address the site-wide rule |
| [CONF-0010](CONF-0010--the-specs-said-name-search-was-blocked-and.md) | direct_contradiction | RESOLVED | High | DEC-0079 | The specs said name search was blocked and the field must ask for a postcode; the shipped site had been searching by name all along |
| [CONF-0011](CONF-0011--the-communication-principles-require-the-scene-opener-to.md) | direct_contradiction | RESOLVED | High | DEC-0080 | The communication principles require the scene opener to be the visitor's own question; the wording review rejects question openers |
| [CONF-0012](CONF-0012--the-design-and-copy-guides-say-there-is.md) | direct_contradiction | RESOLVED | High | DEC-0081 | The design and copy guides say there is no contact form; three spec statements required one in the footer |
| [CONF-0013](CONF-0013--contact-in-the-footer-the-information-architecture-requires.md) | direct_contradiction | RESOLVED | High | DEC-0081 | Contact in the footer: the information architecture requires it, the constraint forbids it |
| [CONF-0014](CONF-0014--the-ueber-uns-primary-conversion-the-information-architecture.md) | direct_contradiction | RESOLVED | High | DEC-0081 | The /ueber-uns primary conversion: the information architecture says it has none |
| [CONF-0015](CONF-0015--the-design-guide-gives-two-components-a-primary.md) | direct_contradiction | RESOLVED | High | DEC-0082 | The design guide gives two components a primary-treatment CTA while the spec allows exactly one primary per page |
| [CONF-0016](CONF-0016--two-equal-conversions-on-dein-kalender-against-one.md) | direct_contradiction | RESOLVED | Medium | DEC-0082 | Two equal conversions on /dein-kalender against one visually unrivalled primary |
| [CONF-0017](CONF-0017--a-spec-demanded-the-ueber-uns-headline-word.md) | direct_contradiction | RESOLVED | High | DEC-0083 | A spec demanded the /ueber-uns headline word for word while the copy guide put that same string on a build-failing avoid list |
| [CONF-0018](CONF-0018--the-tiers-block-must-carry-a-question-heading.md) | direct_contradiction | RESOLVED | Medium | DEC-0083 | The tiers block must carry a question heading while the copy guide fails the build on a question mark in a section title |
| [CONF-0019](CONF-0019--every-page-must-carry-a-live-module-but.md) | direct_contradiction | RESOLVED | Medium | DEC-0084 | Every page must carry a live module, but the only live figures a sender surface can show are the traction figures another rule forbids |
| [CONF-0020](CONF-0020--the-acceptance-test-contract-closes-its-item-at.md) | direct_contradiction | RESOLVED | High | DEC-0090 | The acceptance-test contract closes its item at four keys while every criterion here must carry a verification level |
| [CONF-0021](CONF-0021--interaction-to-next-paint-against-the-adopted-budget.md) | value_conflict | OPEN | Medium | UNKNOWN | Interaction to Next Paint against the adopted budget's First Input Delay |
| [CONF-0022](CONF-0022--the-web-font-budget-the-requirement-admits-50.md) | value_conflict | OPEN | Low | UNKNOWN | The web-font budget: the requirement admits 50 KB, the source excludes it |
| [CONF-0023](CONF-0023--the-sdr-identifier-two-contracts-two-patterns.md) | direct_contradiction | OPEN | Medium | UNKNOWN | The STRICT decision record's identifier: two installed contracts pattern it two different ways, and an id cannot satisfy both |
| [CONF-0024](CONF-0024--the-executor-mode-enum-two-contracts-disagree.md) | value_conflict | OPEN | Medium | UNKNOWN | The executor mode of a decision record: one contract knows four modes, the other two, and the policy in force uses one the narrower does not have |
| [CONF-0025](CONF-0025--the-registration-embed-against-a-banner-free-site.md) | direct_contradiction | OPEN | High | UNKNOWN | The registration embed against a banner-free site: a third-party iframe on one route, and a requirement that the site needs no consent UI anywhere |

## How to read a record

`positions` are the two sides, each with a locator and an excerpt of at most 25
words, exactly as a requirement's `source` carries one (DEC-0097). The method:
*"A conflict record that names only the new candidate is half a record; the
reviewer cannot see what it collides with."* `check:specs` E21 enforces both
sides.

`decision_point` is `DP-04`, which `POL-GRADED-BY-IMPACT` binds to the owner at
every impact level. The register does not change that: it removes one of the
two reasons DP-04 gave — *"this repository holds no conflict record to resolve
one against"* — and leaves the other, that the impact method gives no criterion
for a conflict resolution.

A conflict record may name a retired identifier, for the reason a decision
record may: it records a contradiction between the artefacts that had it, and
several of those were split by the decision that resolved it.
