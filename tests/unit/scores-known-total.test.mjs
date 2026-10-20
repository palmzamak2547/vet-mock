// ============================================================
// scores-known-total.test.mjs — a score row says when it does not add up
// ============================================================
// OV-tools-42 (the copy half). The สัดส่วนคะแนน page showed a "รวม ~100%"
// badge only when a row added up to 95-105%. A row that did not (Eng Vet Prof
// II adds up to 90%, Practice Ruminant to 52.94%) showed no total and no
// remark, and the "unknown" note under it was labelled "จุดเน้น:" (focus).
// Such a row now says how much is known and that the rest has no data, and
// notes are labelled "หมายเหตุ:".
//
// No percentage is added or inferred anywhere: the missing shares need the
// faculty's score announcement, which is not in the repository.
//
// COPY-23 (ScheduleView). The reminder under the exam list spelled "check" as
// เช็ค; the Royal Institute spelling is เช็ก.
// ============================================================
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

import * as scores from '../../src/data/scores.js';

const { SCORE_BREAKDOWN } = scores;

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const dir = mkdtempSync(join(tmpdir(), 'scores-view-'));
after(() => rmSync(dir, { recursive: true, force: true }));
const outfile = join(dir, 'scores.cjs');
await build({
  stdin: {
    contents: [
      "import { createElement } from 'react';",
      "import { renderToStaticMarkup } from 'react-dom/server';",
      "import ScoresView from './src/views/ScoresView.jsx';",
      'export const render = (props) => renderToStaticMarkup(createElement(ScoresView, props));',
    ].join(String.fromCharCode(10)),
    resolveDir: repoRoot,
    loader: 'jsx',
  },
  bundle: true,
  format: 'cjs',
  platform: 'node',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  outfile,
  logLevel: 'silent',
});
const { render } = (await import(pathToFileURL(outfile).href)).default;

// The same sum written independently: a number counts as it is, a word that
// carries its percentage ('OSCE 50') counts that number, anything else is 0.
const percentOf = (cell) => {
  if (typeof cell === 'number') return cell;
  const m = typeof cell === 'string' ? /(\d+(?:\.\d+)?)\s*$/.exec(cell) : null;
  return m ? Number(m[1]) : 0;
};
const totalOf = (row) => percentOf(row.midterm) + percentOf(row.final) + percentOf(row.free) + percentOf(row.work);

test('the known total reads a percentage out of a word that carries one, and adds no number', () => {
  assert.equal(scores.knownScoreTotal({ midterm: 30, final: 30, free: 5, work: 25 }), 90);
  assert.equal(scores.knownScoreTotal({ midterm: 'OSCE 50', final: 20, free: 30, work: null }), 100);
  assert.equal(scores.knownScoreTotal({ midterm: 'Paper', final: 50, free: null, work: 50 }), 100);
  assert.ok(Math.abs(scores.knownScoreTotal({ midterm: 17.65, final: 23.53, free: 11.76, work: null }) - 52.94) < 1e-9);
  assert.equal(scores.knownScoreTotal({}), 0);
});

test('the remark appears outside 95-105% and says only what the data supports', () => {
  assert.equal(scores.scoreTotalNote(100), null);
  assert.equal(scores.scoreTotalNote(95), null);
  assert.equal(scores.scoreTotalNote(105), null);
  assert.equal(scores.scoreTotalNote(90), 'สัดส่วนที่ทราบรวม 90% ส่วนที่เหลือยังไม่มีข้อมูล');
  assert.equal(scores.scoreTotalNote(52.94), 'สัดส่วนที่ทราบรวม 52.9% ส่วนที่เหลือยังไม่มีข้อมูล');
  assert.equal(scores.scoreTotalNote(94.9), 'สัดส่วนที่ทราบรวม 94.9% ส่วนที่เหลือยังไม่มีข้อมูล');
  // Over 100 means the data disagrees with itself; "the rest has no data" would be false.
  const over = scores.scoreTotalNote(120);
  assert.ok(over.startsWith('สัดส่วนที่ทราบรวม 120%'));
  assert.ok(!over.includes('ส่วนที่เหลือยังไม่มีข้อมูล'));
});

const cards = (html) => html.split('class="vmx-dash-card"').slice(1);

test('the page flags exactly the rows whose shares do not add up, each in its own card', () => {
  const html = render({ goHome() {} });
  const rows = Object.values(SCORE_BREAKDOWN);
  const shown = cards(html);
  assert.equal(shown.length, rows.length);
  rows.forEach((row, i) => {
    const total = totalOf(row);
    const flagged = total < 95 || total > 105;
    assert.equal(shown[i].includes('สัดส่วนที่ทราบรวม'), flagged, `${row.name}: remark only when the total is outside 95-105`);
    if (total < 95) {
      const expected = `สัดส่วนที่ทราบรวม ${Number(total.toFixed(1))}% ส่วนที่เหลือยังไม่มีข้อมูล`;
      assert.ok(shown[i].includes(expected), `${row.name}: "${expected}"`);
    }
    assert.equal(shown[i].includes('รวม ~'), !flagged, `${row.name}: the badge shows only when the shares add up`);
  });
  assert.ok(rows.some((row) => totalOf(row) < 95), 'the data still has a row that does not add up');
});

test('rows that carry their percentage in a word are complete, not flagged', () => {
  const html = render({ goHome() {} });
  // Cards carry the course's own name (Vet Surg Lab II/III), the one its chip uses.
  const surg = cards(html).filter((c) => c.includes('Vet Surg Lab'));
  assert.equal(surg.length, 2);
  for (const card of surg) {
    assert.ok(!card.includes('สัดส่วนที่ทราบรวม'));
    assert.ok(card.includes('รวม ~100%'));
  }
});

test('notes are labelled as remarks', () => {
  const html = render({ goHome() {} });
  assert.ok(html.includes('หมายเหตุ:'));
  assert.ok(!html.includes('จุดเน้น:'));
});

test('ScheduleView spells "check" the Royal Institute way', () => {
  const src = readFileSync(new URL('../../src/views/ScheduleView.jsx', import.meta.url), 'utf8');
  assert.ok(src.includes('เช็กกับเพื่อนในห้องอีกครั้งก่อนสอบ'));
  assert.ok(!src.includes('เช็ค'));
});
