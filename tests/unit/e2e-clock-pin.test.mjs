// STAB-CLOCK: the e2e suite reads one pinned calendar (tests/e2e/fixtures.js).
// Before this, specs imported @playwright/test directly and saw the real date,
// so a release could fail CI because a paper had started or a phase had ended:
// exam-scope on 23 Sep, four specs on every project on 26 Sep.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const E2E = resolve('tests/e2e');

test('every spec imports test and expect from the pinned fixtures', () => {
  const specs = readdirSync(E2E).filter((f) => /\.spec\.[cm]?js$/.test(f));
  assert.ok(specs.length > 20, 'the e2e folder was found');
  const direct = specs.filter((f) => /from\s+['"]@playwright\/test['"]/.test(readFileSync(join(E2E, f), 'utf8')));
  assert.deepEqual(direct, [], 'these specs bypass the pinned calendar');
  const unpinned = specs.filter((f) => {
    const src = readFileSync(join(E2E, f), 'utf8');
    return /\btest\s*\(/.test(src) && !/from\s+['"]\.\/fixtures\.js['"]/.test(src);
  });
  assert.deepEqual(unpinned, [], 'these specs define tests without the pinned fixtures');
});

test('only a spec that drives page.clock may opt out of the pinned calendar', () => {
  const specs = readdirSync(E2E).filter((f) => /\.spec\.[cm]?js$/.test(f));
  const loose = specs.filter((f) => {
    const src = readFileSync(join(E2E, f), 'utf8');
    return /pinCalendar:\s*false/.test(src) && !/page\.clock\./.test(src);
  });
  assert.deepEqual(loose, [], 'these specs read the real calendar without setting their own clock');
});

test('the fixtures pin an explicit instant and every project reads Bangkok time', () => {
  const fixtures = readFileSync(join(E2E, 'fixtures.js'), 'utf8');
  const pinned = fixtures.match(/PINNED_NOW = '([^']+)'/)?.[1];
  assert.ok(pinned && !Number.isNaN(Date.parse(pinned)), 'PINNED_NOW is a parseable instant');
  assert.match(pinned, /[+-]\d\d:\d\d$|Z$/, 'the instant carries its zone');
  assert.match(fixtures, /context\.addInitScript\(installPinnedCalendar/);
  const config = readFileSync(resolve('playwright.config.js'), 'utf8');
  assert.match(config, /timezoneId: 'Asia\/Bangkok'/);
});
