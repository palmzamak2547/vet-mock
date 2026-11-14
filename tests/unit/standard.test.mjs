// The VetMock Standard's measure (scripts/standard.mjs): its clauses, the shape of its report, and that
// docs/VETMOCK-STANDARD.md and the script name the same clauses. Runs read-only (--no-run): no lint is
// spawned and no network is asked, so this stays a fast contract test.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { CLAUSES, SECTIONS, STATUSES, measureAll, cssRules, jsxTags, contrast } from '../../scripts/standard.mjs';

const FIELDS = ['id', 'section', 'text', 'check', 'good', 'best', 'target', 'doc'];

test('every clause carries an id, a section, a sentence, a check, three figures and a document', () => {
  const ids = new Set();
  for (const c of CLAUSES) {
    for (const f of FIELDS) assert.equal(typeof c[f], 'string', `${c.id || '?'} lacks ${f}`);
    for (const f of FIELDS) assert.ok(c[f].trim().length > 0, `${c.id} has an empty ${f}`);
    assert.equal(typeof c.measure, 'function', `${c.id} has no measure`);
    assert.ok(SECTIONS.includes(c.section), `${c.id} names an unknown section ${c.section}`);
    assert.ok(!ids.has(c.id), `${c.id} is used twice`);
    ids.add(c.id);
  }
  for (const s of SECTIONS) assert.ok(CLAUSES.some((c) => c.section === s), `section ${s} has no clause`);
});

test('the report has one result per clause, each met, not met or not measured, and totals that add up', async () => {
  const r = await measureAll({ run: false });
  assert.equal(r.clauses.length, CLAUSES.length);
  assert.deepEqual(r.clauses.map((c) => c.id), CLAUSES.map((c) => c.id));
  for (const c of r.clauses) {
    assert.ok(STATUSES.includes(c.status), `${c.id}: ${c.status}`);
    if (c.status === 'not measured') assert.ok(c.note, `${c.id} is not measured without saying why`);
    if (c.status === 'not met') assert.ok(c.value !== null && c.value !== '', `${c.id} is not met without its number`);
  }
  assert.equal(STATUSES.reduce((s, k) => s + r.totals[k], 0), CLAUSES.length);
  for (const s of SECTIONS) assert.deepEqual(Object.keys(r.bySection[s]).sort(), [...STATUSES].sort());
  assert.equal(r.ran, false);
});

test('the page and the script name the same clauses', () => {
  const page = readFileSync(new URL('../../docs/VETMOCK-STANDARD.md', import.meta.url), 'utf8');
  const rows = [...page.matchAll(/^\|\s*([A-Z]\d+)\s*\|/gm)].map((m) => m[1]);
  assert.deepEqual([...new Set(rows)].sort(), CLAUSES.map((c) => c.id).sort(), 'docs/VETMOCK-STANDARD.md measure table and CLAUSES differ');
});

test('the static readers: CSS rules, JSX tags, contrast', () => {
  const rules = cssRules('.a{color:red}/* x */@media (prefers-reduced-motion: reduce){.b{animation:none}}@keyframes k{from{width:0}to{width:1px}}');
  assert.deepEqual(rules.map((r) => r.selector), ['.a', '.b', '@keyframes k']);
  assert.match(rules[1].media, /prefers-reduced-motion/);
  const tags = jsxTags('<div onClick={() => a > b} role="button">x</div><img src={s} />', ['div', 'img']);
  assert.equal(tags.length, 2);
  assert.match(tags[0].attrs, /role="button"/);
  assert.equal(Math.round(contrast('#ffffff', '#000000')), 21);
});
