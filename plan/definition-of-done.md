# Definition of Done

A work package is finished when every line holds. Without this list,
every agent delivers when it feels done.

- [ ] Every assigned acceptance criterion is satisfied and was
      checked **individually** (by id, not "the tests are green").
- [ ] `pnpm check` is green: specs guard, typecheck, lint, unit and
      integration tests.
- [ ] Local e2e for the touched routes passes against the dev
      server.
- [ ] The result lands where the plan says it lands (code via PR to
      `next-2026`; reports in their `reports/` folder; state updated).
- [ ] Assumptions made along the way are written down — in the code's
      ADR if structural, in `state/open.md` if a decision is still
      owed.
- [ ] Everything not finished is on `state/open.md` — a silent gap is
      a defect, an entry is not.
- [ ] New runtime dependencies passed the stack-harmony rule and are
      registered in `stack.allow.json` with their ADR.
