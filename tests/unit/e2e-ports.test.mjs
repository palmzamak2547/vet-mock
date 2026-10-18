// Every e2e server listens below every OS's ephemeral port range (Linux 32768-60999, Windows
// and macOS 49152-65535). An outgoing connection can be handed any port inside that range, and
// on 17 Oct 2026 one held 41732 just as CI started the connected preview: "Port 41732 is already
// in use", a red Smoke e2e on a docs-only commit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const EPHEMERAL_FROM = 32768;

test('e2e servers listen below the ephemeral port range', () => {
  const ports = [
    ['tests/e2e/local-port.js', Number(read('tests/e2e/local-port.js').match(/PLAYWRIGHT_PORT \|\| (\d+)/)?.[1])],
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
