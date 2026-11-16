// Guards for the second batch of fixes from the 16 Nov 2026 defect sweep.
// The sweep's baseline (tests/e2e/defect-baseline.json) catches a class coming back over the whole app;
// these catch the particular lines that were wrong, without a browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const rule = (css, selector) => {
  const at = css.indexOf(`${selector} {`);
  assert.ok(at >= 0, `${selector} is in styles.css`);
  return css.slice(at, css.indexOf('}', at));
};

test('what arrives late in the header sits left of search, and the account name has a fixed width', () => {
  const src = read('src/components/HeaderBar.jsx');
  const right = src.slice(src.indexOf('vmx-header-right'));
  const search = right.indexOf('vmx-cmdk-btn');
  for (const late of ['<XpChip', 'vmx-streak', 'vmx-saved-btn']) {
    assert.ok(right.indexOf(late) >= 0 && right.indexOf(late) < search, `${late} comes before the search button`);
  }
  assert.match(read('src/components/UserMenu.jsx'), /className="vmx-usermenu-name" style=\{\{ width: 100,/);
  assert.match(read('src/styles.css'), /\.vmx-header-right \{ display: flex; flex: 1 1 0; justify-content: flex-end;/);
});

test('the day plan holds its place while the account and the year\'s questions arrive', () => {
  assert.match(read('src/components/NextActionCard.jsx'), /waiting \? \(/);
  assert.match(read('src/views/HomeView.jsx'), /waiting=\{planWaiting\}/);
  assert.match(read('src/styles.css'), /\.vmx-next-actions-wait \{ min-height: \d+px;/);
});

test('a plan step keeps its count and "ข้อ" on one line', () => {
  const src = read('src/components/NextActionCard.jsx');
  const titles = src.slice(src.indexOf("title: step.kind === 'sr'"), src.indexOf('sub: `', src.indexOf("title: step.kind === 'sr'")));
  assert.equal((titles.match(/\$\{step\.count\}\\u00a0ข้อ`/g) || []).length, 5);
  assert.doesNotMatch(titles, /\$\{step\.count\} ข้อ/);
});

test('no text faded with opacity or a fixed colour where a token belongs', () => {
  assert.doesNotMatch(read('src/views/ScoresView.jsx'), /opacity: 0\.4/);
  assert.doesNotMatch(read('src/views/FacultyView.jsx'), /<span style=\{\{ opacity: 0\.6 \}\}>/);
  const roles = read('src/lib/contributions.js').match(/export const ROLE_META = \{[\s\S]*?\n\};/)[0];
  for (const m of roles.matchAll(/color: '([^']+)'/g)) assert.match(m[1], /^var\(--clr-[a-z]+-(text|soft)\)$/);
});

test('the error card writes its words in full ink', () => {
  const card = read('src/components/ErrorBoundary.jsx');
  assert.doesNotMatch(card, /<p style=\{\{ fontSize: 14, lineHeight: 1\.6, color: 'var\(--clr-ink-soft/);
});

test('rail rows, the account pill and the PDF tools are a finger tall', () => {
  const css = read('src/styles.css');
  assert.match(rule(css, '.vmx-pdf-tool'), /height: var\(--touch-min\);/);
  assert.match(rule(css, '  .vmx-nav-row.is-secondary'), /min-height: var\(--touch-min\);/);
  assert.match(read('src/components/UserMenu.jsx'), /minHeight: 'var\(--touch-min\)'/);
});

test('a month name is dropped when the next follows within four weeks', () => {
  assert.match(read('src/components/StreakHeatmap.jsx'), /monthLabels\[i \+ 1\]\.w - monthLabels\[i\]\.w < 4/);
});

test('opening the theme panel moves focus into it', () => {
  assert.match(read('src/components/ThemePicker.jsx'), /aria-pressed="true"\]'\) \|\| panel\?\.querySelector/);
});
