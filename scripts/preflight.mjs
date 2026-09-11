#!/usr/bin/env node
/**
 * Preflight for the website realization run (plan/preflight.md).
 * Verifies access, tooling, material, and structure actively.
 * Exit code = number of RED items. YELLOW items belong on
 * state/open.md; the run may proceed with documented degradation.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const results = [];

const sh = (cmd, opts = {}) => {
  try {
    return { ok: true, out: execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: opts.timeout ?? 30000, ...opts }).trim() };
  } catch (e) {
    return { ok: false, out: (e.stdout || '') + (e.stderr || e.message || '') };
  }
};
const check = (name, level, detail) => results.push({ name, level, detail });
const envToken = (name) => {
  if (process.env[name]) return true;
  try {
    return readFileSync(join(root, '.env.local'), 'utf8').split('\n').some((l) => l.startsWith(`${name}=`) && l.split('=')[1]?.trim());
  } catch {
    return false;
  }
};

// ── Access ──────────────────────────────────────────────────────────
{
  const branch = sh('git rev-parse --abbrev-ref HEAD').out;
  if (branch === 'main') check('git branch', 'RED', 'on main — the run works on next-2026 only');
  else if (branch === 'next-2026' || branch.length) check('git branch', branch === 'next-2026' ? 'GREEN' : 'YELLOW', `on ${branch}`);
  const push = sh('git push --dry-run 2>&1');
  check('git push (dry-run)', push.ok ? 'GREEN' : 'RED', push.ok ? 'origin writable' : push.out.slice(0, 120));

  const gh = sh('GH_TOKEN="$(gh auth token --user schafevormfenster 2>/dev/null)" gh api user --jq .login 2>/dev/null');
  check('gh CLI (schafevormfenster)', gh.ok && gh.out ? 'GREEN' : 'YELLOW', gh.ok ? `authenticated as ${gh.out}` : 'not authenticated — PRs need it');

  check('GITHUB_TOKEN (registry)', envToken('GITHUB_TOKEN') ? 'GREEN' : 'RED', envToken('GITHUB_TOKEN') ? 'present' : 'missing — npm.pkg.github.com installs fail');

  const vercelWho = sh('vercel whoami 2>/dev/null');
  check('vercel CLI auth', vercelWho.ok && vercelWho.out ? 'GREEN' : 'RED', vercelWho.ok ? `logged in as ${vercelWho.out}` : 'vercel whoami failed — preview deploys impossible');
  check('vercel repo link', existsSync(join(root, '.vercel/repo.json')) ? 'GREEN' : 'RED', existsSync(join(root, '.vercel/repo.json')) ? 'repo.json present' : '.vercel/repo.json missing — run vercel link --repo');
  check('VERCEL_AUTOMATION_BYPASS_SECRET', envToken('VERCEL_AUTOMATION_BYPASS_SECRET') ? 'GREEN' : 'YELLOW', envToken('VERCEL_AUTOMATION_BYPASS_SECRET') ? 'present' : 'missing — e2e against protected preview blocked until M1 sets it');

  for (const host of ['https://events.api.schafe-vorm-fenster.de', 'https://geo.api-v2.schafe-vorm-fenster.de']) {
    const r = sh(`curl -s -o /dev/null -w "%{http_code}" -m 8 ${host}`);
    const up = r.ok && /^[2345]\d\d$/.test(r.out);
    check(`reachable: ${new URL(host).hostname}`, up ? 'GREEN' : 'YELLOW', up ? `HTTP ${r.out}` : 'no response — live modules degrade');
  }
}

// ── Tools ────────────────────────────────────────────────────────
{
  const node = process.versions.node;
  check('node >= 20', Number(node.split('.')[0]) >= 20 ? 'GREEN' : 'RED', `node ${node}`);
  const pnpm = sh('pnpm --version');
  check('pnpm', pnpm.ok ? 'GREEN' : 'RED', pnpm.ok ? `pnpm ${pnpm.out}` : 'pnpm missing');

  const hub = existsSync(join(root, 'node_modules/@schafe-vorm-fenster'));
  const hubCount = hub ? readdirSync(join(root, 'node_modules/@schafe-vorm-fenster')).length : 0;
  check('hub packages installed', hubCount >= 13 ? 'GREEN' : hubCount > 0 ? 'YELLOW' : 'RED', `${hubCount} @schafe-vorm-fenster packages`);

  const specs = sh('pnpm check 2>&1', { timeout: 120000 });
  check('pnpm check (specs guard)', specs.ok ? 'GREEN' : 'RED', specs.ok ? 'green' : 'red — fix before the run: ' + specs.out.split('\n').filter((l) => l.includes('✗') || l.toLowerCase().includes('error')).slice(0, 3).join(' | '));

  const chrome = existsSync('/Applications/Google Chrome.app') || sh('command -v google-chrome chromium 2>/dev/null').out.length > 0;
  check('Chrome for chaos runs', chrome ? 'GREEN' : 'YELLOW', chrome ? 'Chrome present' : 'no Chrome — chaos falls back to Playwright scripts');

  const port = sh('lsof -i :3000 -sTCP:LISTEN 2>/dev/null');
  check('port 3000', port.out ? 'YELLOW' : 'GREEN', port.out ? 'occupied — dev server needs another port' : 'free');

  const pw = existsSync(join(root, 'node_modules/@playwright')) || existsSync(join(root, 'node_modules/playwright'));
  check('Playwright', pw ? 'GREEN' : 'YELLOW', pw ? 'installed' : 'not installed — M1 work package');
}

// ── Material ─────────────────────────────────────────────────────────
{
  const mat = [
    ['design system', 'concept/website-design-system.md'],
    ['visual boards', 'concept/v2.0/Style Guide.dc.html'],
    ['verification strategy', 'specs/verification/verification-strategy.md'],
  ];
  for (const [name, p] of mat) check(name, existsSync(join(root, p)) ? 'GREEN' : 'RED', p);
  const tactical = existsSync(join(root, 'specs/tactical')) ? readdirSync(join(root, 'specs/tactical')).filter((f) => f.endsWith('.tactical.md')).length + readdirSync(join(root, 'specs/tactical/pages')).filter((f) => f.endsWith('.tactical.md')).length : 0;
  check('tactical specs', tactical >= 29 ? 'GREEN' : 'RED', `${tactical} of 29 expected`);
  check('go-to-market-os sibling', existsSync(join(root, '../go-to-market-os/concept')) ? 'GREEN' : 'RED', '../go-to-market-os');
  check('brand-design package', existsSync(join(root, 'node_modules/@schafe-vorm-fenster/brand-design/tokens/svf-tokens.json')) ? 'GREEN' : 'RED', 'tokens importable');
}

// ── Structure ─────────────────────────────────────────────────────────
{
  const struct = ['plan/projektplan.md', 'plan/prozess.md', 'plan/leitplanken.md', 'state/status.md', 'state/open.md', 'state/findings', 'reports/qa', 'reports/uat', 'reports/abnahme', '.agents/roles/orchestrator.md', '.agents/playbooks/playbook-website-foundation/SKILL.md', '.agents/dispatch/website-foundation.dispatch.yaml', '.claude/agents/developer.md'];
  const missing = struct.filter((p) => !existsSync(join(root, p)));
  check('run structure', missing.length === 0 ? 'GREEN' : 'RED', missing.length === 0 ? 'complete' : `missing: ${missing.join(', ')}`);
}

// ── Report ───────────────────────────────────────────────────────────
const pad = (s, n) => s.padEnd(n);
const colors = { GREEN: '\x1b[32m', YELLOW: '\x1b[33m', RED: '\x1b[31m' };
console.log('\nPreflight — website realization run\n');
for (const r of results) console.log(`  ${colors[r.level]}${pad(r.level, 6)}\x1b[0m ${pad(r.name, 36)} ${r.detail}`);
const count = (l) => results.filter((r) => r.level === l).length;
console.log(`\n  ${count('GREEN')} green · ${count('YELLOW')} yellow · ${count('RED')} red`);
if (count('RED') > 0) console.log('  RED blocks the start (plan/preflight.md).');
else if (count('YELLOW') > 0) console.log('  YELLOW items go to state/open.md; the run may proceed.');
process.exit(count('RED'));
