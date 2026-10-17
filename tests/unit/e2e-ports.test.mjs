// Every e2e server listens below every OS's ephemeral port range (Linux 32768-60999, Windows
// and macOS 49152-65535). An outgoing connection can be handed any port inside that range, and
// on 17 Oct 2026 one held 41732 just as CI started the connected preview: "Port 41732 is already
// in use", a red Smoke e2e on a docs-only commit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const EPHEMERAL_FROM = 32768;

test('e2e servers listen below the ephemeral port range', () => {
  const ports = [
    ['playwright.config.js', Number(read('playwright.config.js').match(/PLAYWRIGHT_PORT \|\| (\d+)/)?.[1])],
    ['vca/playwright.config.js', Number(read('vca/playwright.config.js').match(/const PORT = (\d+)/)?.[1])],
  ];
  for (const m of read('.github/workflows/smoke-e2e.yml').matchAll(/--port (\d+)/g)) ports.push(['smoke-e2e.yml', Number(m[1])]);
  assert.ok(ports.length >= 3, `found ${ports.length} ports`);
  for (const [file, port] of ports) {
    assert.ok(Number.isInteger(port) && port > 1024 && port < EPHEMERAL_FROM, `${file} uses ${port}`);
  }
});
