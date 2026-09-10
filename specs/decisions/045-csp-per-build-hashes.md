---
id: DEC-045
title: The CSP uses per-build hashes; the shell stays static
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

`script-src` carries `'self'` plus per-build `'sha256-…'` hashes of the
inline scripts. **No per-request nonce.** A nonce would have to be
generated per request, which turns the prerendered shell into a function
invocation — the failure mode DEC-041 §8 forbids and the performance
budget cannot absorb.

## Consequences

- The build extracts and hashes every inline script; a new inline block
  that does not pass through that step breaks the policy loudly rather
  than silently weakening it.
- `'strict-dynamic'` still applies, so scripts loaded by a hashed script
  inherit trust; the host allowlist remains as the CSP2 fallback and as
  the written allowlist WEB-Q-030 requires.
- TS-004 D6 (static + ISR) is preserved unchanged. TS-014 D3's variant A
  is the chosen one; variant B is recorded as the rejected alternative.
- Resolves Q-035.
