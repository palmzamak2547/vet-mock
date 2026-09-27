// The chapter "what statistics CUVET papers use" [M1-DESIGN.md 15.3]: every count is read from the
// committed Europe PMC files through the catalogue's families, the bars are to scale from zero, each
// status is the catalogue's familyStatus (never typed), every family has a label in both languages,
// and the herd's dots end exactly on the bar lengths the table draws. OWNER: landing role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { FAMILIES, familyStatus } from '../../src/lib/runtime/catalog.js';
import { EVIDENCE_FILES, buildRows, evidenceAt, fileDate, joinEvidence, sharePercent } from '../../src/landing/chart/rows.js';
import { layoutBarDots } from '../../src/landing/chart/dots.js';
import landing from '../../src/i18n/landing.js';

const evidenceDir = new URL('../../src/landing/evidence/', import.meta.url);
const files = Object.fromEntries(EVIDENCE_FILES.map((f) => [f, JSON.parse(readFileSync(fileURLToPath(new URL(f, evidenceDir)), 'utf8'))]));
const committed = JSON.parse(readFileSync(fileURLToPath(new URL('../../src/data/cuvet-methods.json', import.meta.url)), 'utf8'));
const built = buildRows(committed, familyStatus);

test('src/data/cuvet-methods.json is exactly the join of the evidence files through the catalogue', () => {
  assert.deepEqual(committed, joinEvidence(FAMILIES, files), 'stale: run node src/landing/evidence/build-cuvet-methods.mjs');
  assert.equal(committed.denominator, 698);
  assert.deepEqual(committed.checked.map((c) => c.date), ['2026-09-25', '2026-09-27']);
  // A wrong count in the committed table is caught (the proof that this test can fail).
  const tampered = structuredClone(committed);
  tampered.families[0].count += 1;
  assert.notDeepEqual(tampered, joinEvidence(FAMILIES, files));
});

test('the denominator is the 698 full-text papers both files agree on, and the query is printed from the file', () => {
  assert.equal(built.denominator, 698);
  assert.equal(built.denominator, files['epmc-methods-2026-09-25.json'].cuvet.with_full_text);
  assert.equal(built.query, 'AFF:"Faculty of Veterinary Science, Chulalongkorn University" AND PUB_YEAR:[2021 TO 2026]');
  assert.deepEqual(built.checked, ['2026-09-25', '2026-09-27']);
  assert.equal(fileDate('epmc-methods-2026-09-27.json'), files['epmc-methods-2026-09-27.json'].checked);
});

test('every row count is the number in its evidence file', () => {
  assert.equal(built.rows.length, FAMILIES.length);
  for (const row of built.rows) {
    const fam = FAMILIES.find((f) => f.id === row.id);
    const e = fam.evidence[0];
    assert.equal(row.count, evidenceAt(files[e.file], e.path), `${row.id}`);
    assert.equal(row.file, e.file);
    assert.equal(row.share, row.count / 698);
  }
});

test('rows are sorted by count and the largest bar is ANOVA, 220 of 698', () => {
  for (let i = 1; i < built.rows.length; i++) assert.ok(built.rows[i - 1].count >= built.rows[i].count);
  assert.equal(built.rows[0].id, 'anova');
  assert.equal(built.max, 220);
  assert.equal(sharePercent(built.rows[0].share), '31.5');
});

test('each status is the catalogue\'s, never typed', () => {
  for (const row of built.rows) assert.equal(row.status, familyStatus(row.id));
  const fake = buildRows(committed, () => 'now');
  assert.ok(fake.rows.every((r) => r.status === 'now'), 'status follows the function it is given');
});

test('the two files must agree on the denominator', () => {
  const broken = { ...files, 'epmc-methods-2026-09-27.json': { ...files['epmc-methods-2026-09-27.json'], with_full_text: 699 } };
  assert.throws(() => joinEvidence(FAMILIES, broken), /disagree/);
});

test('every family and every status has a label in Thai and English', () => {
  for (const f of FAMILIES) {
    for (const lang of ['th', 'en']) assert.ok(landing[lang][`landing.family.${f.id}`], `${lang} landing.family.${f.id}`);
  }
  for (const s of ['now', 'M1', 'M2', 'M3', 'later']) {
    for (const lang of ['th', 'en']) assert.ok(landing[lang][`landing.papers.status.${s}`], `${lang} status ${s}`);
  }
});

test('dots start at each bar\'s zero and end exactly on its drawn length', () => {
  const trackW = 431.7;
  const bars = built.rows.slice(0, 16).map((r, i) => ({ x: 312.25, y: 20 + i * 38.5, length: (trackW * r.count) / built.max, height: 12, now: r.status === 'now' }));
  const plan = layoutBarDots(bars, { total: 728, pointPx: 6, pitch: 7.5 });
  assert.ok(plan.used <= 728);
  bars.forEach((b, i) => {
    const pb = plan.perBar[i];
    assert.ok(pb.count >= 1, `bar ${i} has dots`);
    assert.ok(Math.abs(pb.left - b.x) < 1e-3, `bar ${i} starts at its zero: ${pb.left} vs ${b.x}`);
    assert.ok(Math.abs(pb.right - (b.x + b.length)) < 1e-3, `bar ${i} ends at its length: ${pb.right} vs ${b.x + b.length}`);
    for (let k = pb.first; k < pb.first + pb.count; k++) {
      assert.equal(plan.use[k], 1);
      assert.equal(plan.grid[k * 2 + 1], Math.fround(b.y));
      assert.equal(plan.pos[k], b.now ? 1 : 0);
    }
  });
  for (let k = plan.used; k < 728; k++) assert.equal(plan.use[k], 0, 'leftover dots fade out');
});

test('a bar shorter than one dot gets one dot exactly as wide as the bar', () => {
  const plan = layoutBarDots([{ x: 10, y: 5, length: 2.7, height: 12, now: false }], { total: 20, pointPx: 6, pitch: 7.5 });
  assert.equal(plan.perBar[0].count, 1);
  assert.ok(Math.abs(plan.perBar[0].size - 2.7) < 1e-6);
  assert.ok(Math.abs(plan.perBar[0].left - 10) < 1e-5 && Math.abs(plan.perBar[0].right - 12.7) < 1e-5);
});

test('with more bar length than dots, the pitch widens and the ends still land exactly', () => {
  const bars = Array.from({ length: 38 }, (_, i) => ({ x: 0, y: i * 10, length: 900 - i * 10, height: 12, now: i % 2 === 0 }));
  const plan = layoutBarDots(bars, { total: 728, pointPx: 6, pitch: 3 });
  assert.ok(plan.used <= 728);
  assert.ok(plan.pitch > 3);
  bars.forEach((b, i) => assert.ok(Math.abs(plan.perBar[i].right - b.length) < 1e-3));
});
