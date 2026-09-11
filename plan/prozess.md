# Prozess — die Fix-Deploy-Retest-Schleife

The loop that closes every milestone gate. It runs without asking
anyone outside the team.

```
1. QA + Chaos personas run against the milestone scope
   → findings into state/findings/round-<n>.md,
     each with severity: critical / high / medium / low

2. Projektmanager priorisiert
   → decides what enters this round
   → everything left over goes to state/open.md with its severity

3. Developer works the round (feature branch → PR → next-2026)

4. Deploy preview (vercel deploy from next-2026)

5. QA retests exactly this round's findings
   + a short regression sweep over the milestone's ACs

6. Check the abort criterion
```

## Abort criterion

The loop ends as soon as **one** of these holds:

- no critical and no high findings open, **or**
- three rounds completed.

Chaos testing always finds something; without a hard stop the loop
spins forever. Whatever is open at abort goes to `state/open.md`.

## Severities

| Severity | Meaning | Handling |
| --- | --- | --- |
| critical | AC violated on a conversion path, data loss, build/deploy broken, a11y blocker | must enter the next round |
| high | AC violated elsewhere, page unusable on a reference viewport | must enter a round before gate close |
| medium | visible defect, spec deviation without AC | PM decides round or open list |
| low | polish | open list; M5 only within budget |

## Two test tracks

| | Lokal | Pipeline/Preview |
| --- | --- | --- |
| Gegenstand | behaviour, logic, content, acceptance criteria | only what cannot occur locally |
| Umfang | complete — all roundtrips, unit + integration + e2e against dev server | thin smoke on the preview URL |
| Prüft | function, rendering, conversion paths | build errors, env vars, preview deploy, domains, redirects |

**Hard rule:** nothing goes onto the preview that is not green
locally. Otherwise two environments are debugged at once.

## Browser mechanics

- **Repeatable e2e**: Playwright against `localhost` dev server and,
  for the smoke set, against the preview URL (deployment-protection
  bypass via the automation secret).
- **Chaos runs**: a local Chrome session driven directly by the agent
  against the dev server — unscripted, persona-guided. Preflight
  verifies Chrome access before any run starts; if it fails, chaos
  runs fall back to Playwright with persona scripts and the gap is
  recorded on the open list.

## Round bookkeeping

Each round appends to `state/findings/round-<n>.md` (findings, from
QA/Chaos) and updates `state/status.md` (round counter, gate state).
Fixes reference finding ids in their commit messages
(`fix(scope): … [F-<round>-<nr>]`), so the retest step can walk the
round's findings mechanically.
