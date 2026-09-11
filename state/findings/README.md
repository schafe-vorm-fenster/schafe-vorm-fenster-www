# Findings

One file per test round: `round-<n>.md`. Written by QA and the chaos
personas, read by the Projektmanager (prioritization) and the
Developer (fixes). Format per finding:

```markdown
## F-<round>-<nr> — <one-line title>

- Severity: critical | high | medium | low
- Source: qa | chaos:<persona> | uat
- Where: <route / component / AC id>
- Steps: <how to reproduce>
- Expected: <spec/AC reference>
- Observed: <what actually happened>
- Round decision: fix-now | open-list   (set by Projektmanager)
```

Fix commits reference the finding id (`[F-<round>-<nr>]`), so the
retest walks the list mechanically.
