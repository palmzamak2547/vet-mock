// Every e2e server listens below every OS's ephemeral port range (Linux 32768-60999, Windows
// and macOS 49152-65535). An outgoing connection can be handed any port inside that range, and
// on 17 Oct 2026 one held 41732 just as CI started the connected preview: "Port 41732 is already
// in use", a red Smoke e2e on a docs-only commit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const EPHEMERAL_FROM = 32768;

test('e2e servers listen below the ephemeral port range', async () => {
  const ports = [
    ['tests/e2e/local-port.js', (await import('../e2e/local-port.js')).LOCAL_E2E_PORT],
    // The default only: VCA_E2E_PORT may name another port for a second checkout's run.
    ['vca/playwright.config.js', Number(read('vca/playwright.config.js').match(/VCA_E2E_PORT \|\| (\d+)/)?.[1])],
  ];
  for (const m of read('.github/workflows/smoke-e2e.yml').matchAll(/--port (\d+)/g)) ports.push(['smoke-e2e.yml', Number(m[1])]);
  assert.ok(ports.length >= 3, `found ${ports.length} ports`);
  for (const [file, port] of ports) {
    assert.ok(Number.isInteger(port) && port > 1024 && port < EPHEMERAL_FROM, `${file} uses ${port}`);
  }
});

// One place says which port the local preview uses. On 18 Oct the config moved to a new port
// while origin-move.spec.js kept its own copy of the old default, and all its runs failed.
test('specs read the local e2e port from tests/e2e/local-port.js, never a default of their own', () => {
  const dir = new URL('../e2e/', import.meta.url);
  const own = readdirSync(dir).filter((f) => /\.(m?js)$/.test(f) && f !== 'local-port.js')
    .filter((f) => /PLAYWRIGHT_PORT\s*\|\|/.test(readFileSync(new URL(f, dir), 'utf8')));
  assert.deepEqual(own, []);
  assert.match(read('playwright.config.js'), /from '\.\/tests\/e2e\/local-port\.js'/);
});

// Six worktrees on one machine all used 24731 on 20 Oct; a second gate failed at once.
test('each checkout gets its own stable ports, all below the ephemeral range', async () => {
  const { e2ePorts } = await import('../e2e/local-port.js');
  const a = e2ePorts('C:/dev/vmu/wiki4');
  assert.deepEqual(e2ePorts('c:/DEV/vmu/WIKI4/'), a, 'same checkout, same ports on every spelling of its path');
  const seen = new Set();
  for (const dir of ['C:/Users/palmz/Desktop/vet-mock', 'C:/dev/vmu/wiki4', 'C:/dev/vetmock-library', 'C:/dev/vetmock-nodemo',
    'C:/dev/vetmock-polish-1020', 'C:/dev/vetmock-pipeline-v2', '/home/runner/work/vet-mock/vet-mock']) {
    const p = e2ePorts(dir);
    seen.add(p.local);
    for (const port of Object.values(p)) assert.ok(port > 1024 && port < EPHEMERAL_FROM, `${dir}: ${port}`);
    assert.equal(p.concurrent - p.local, 1000);
    assert.equal(p.contrast - p.local, 2000);
  }
  assert.equal(seen.size, 7, 'the known worktrees do not share a port');
});
