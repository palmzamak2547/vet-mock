import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const audit = readFileSync(new URL('../../scripts/audit-contrast.mjs', import.meta.url), 'utf8');

test('contrast audit waits for the rendered view without depending on network silence', () => {
  assert.match(audit, /waitUntil:\s*['"]domcontentloaded['"]/);
  assert.match(audit, /aria-busy=[\\"]true[\\"]\]\[aria-live=[\\"]polite[\\"]\]/);
  assert.doesNotMatch(audit, /waitUntil:\s*['"]networkidle['"]/);
});
