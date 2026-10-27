// ============================================================
// ai-chat SSE + check — the wire format and the grounding report
// ============================================================
// The page parses `event:` / `data:` pairs, so one event must always be one
// data line. The `check` event names numbers the answer brought from nowhere;
// list markers, [n] markers and digits inside URLs are not claims and must
// never be reported as ungrounded.

import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

import { encodeEvent, openStream, STREAM_HEADERS } from '../../api/_lib/ai/sse.js';
import { computeCheck, citationsIn, answerForNumberCheck, citedSegments } from '../../api/_lib/ai/check.js';

test('an event is exactly one event line and one data line', () => {
  assert.equal(encodeEvent('status', { phase: 'plan', label: 'กำลังคิด' }), 'event: status\ndata: {"phase":"plan","label":"กำลังคิด"}\n\n');
  const multi = encodeEvent('delta', { text: 'บรรทัดแรก\nบรรทัดสอง' });
  assert.equal(multi.split('\n').filter((l) => l.startsWith('data:')).length, 1);
  assert.ok(multi.endsWith('\n\n'));
  assert.equal(encodeEvent('bad\nname', {}).split('\n')[0], 'event: badname');
});

function fakeRes() {
  const res = new EventEmitter();
  Object.assign(res, {
    statusCode: 0, headers: {}, chunks: [], ended: false, flushed: false,
    setHeader(k, v) { res.headers[k.toLowerCase()] = v; },
    flushHeaders() { res.flushed = true; },
    write(c) { res.chunks.push(c); return true; },
    end() { res.ended = true; res.emit('close'); },
  });
  return res;
}

test('openStream sets the stream headers, writes events, and ends once', () => {
  const res = fakeRes();
  const s = openStream(res);
  assert.equal(res.statusCode, 200);
  for (const [k, v] of Object.entries(STREAM_HEADERS)) assert.equal(res.headers[k.toLowerCase()], v);
  assert.equal(res.flushed, true);
  assert.equal(s.send('status', { phase: 'plan' }), true);
  s.end();
  assert.equal(s.signal.aborted, false, 'a normal end is not a reader who left');
  assert.equal(s.send('delta', { text: 'x' }), false, 'nothing is written after the end');
  assert.equal(res.chunks.length, 1);
});

test('a reader who leaves aborts the signal every upstream call listens to', () => {
  const res = fakeRes();
  const s = openStream(res);
  res.emit('close');
  assert.equal(s.signal.aborted, true);
  assert.equal(s.closed(), true);
});

const ctx = 'Incubation 4-14 วัน, shedding 10-12 วัน, ขนาด 2.5 mg/kg, WSAVA 2024, ๑๘๐ วัน';

test('numbers from the sources pass, invented numbers are reported', () => {
  const r = computeCheck('ระยะฟักตัว 4-14 วัน [1] และให้ยา 2.5 mg/kg [2] ส่วน booster ทุก 3 ปี [1]', { sourceCount: 2, context: ctx });
  assert.deepEqual(r.ungrounded, ['3']);
  assert.deepEqual(r.invalidCitations, []);
});

test('ordered-list markers, [n] markers and digits inside URLs are not claims', () => {
  const answer = [
    '### 1. Overview',
    '1. ข้อแรก [1]',
    '2) ข้อสอง [2]',
    '  3. ข้อสาม [1][2]',
    '- 4. แบบ bullet มีเลข',
    'ดูต่อ [ที่นี่](https://vetmock.com/wiki/com5/rabies#sec-99) หรือ https://pubmed.ncbi.nlm.nih.gov/42559914/',
  ].join('\n');
  const r = computeCheck(answer, { sourceCount: 2, context: ctx });
  assert.deepEqual(r.ungrounded, []);
  assert.ok(!answerForNumberCheck(answer).includes('42559914'));
  assert.ok(!answerForNumberCheck(answer).includes('99'));
});

test('Thai digits and thousands separators compare as numbers', () => {
  assert.deepEqual(computeCheck('กักไว้ 180 วัน [1]', { sourceCount: 1, context: ctx }).ungrounded, []);
  assert.deepEqual(computeCheck('ประมาณ 1,200 ตัว', { sourceCount: 0, context: 'พบ 1200 ตัว' }).ungrounded, []);
});

test('citations that point at no sent source are reported', () => {
  const r = computeCheck('ก [1] ข [3] ค [0] ง [2, 5] จ [1-2]', { sourceCount: 2, context: '' });
  assert.deepEqual(r.invalidCitations, [0, 3, 5]);
  assert.deepEqual(citationsIn('x [1][2] y [2-4]'), [1, 2, 3, 4]);
  assert.deepEqual(citationsIn('a range like [1-500] is not expanded past 20'), Array.from({ length: 20 }, (_, i) => i + 1));
});

test('numbers the student wrote count as grounded when given as context', () => {
  const r = computeCheck('นี่คือข้อสอบ 5 ข้อ', { sourceCount: 0, context: 'ขอข้อสอบ COM5 5 ข้อ' });
  assert.deepEqual(r.ungrounded, []);
});

// The case measured live: "2-3 เดือน" put on a source that says "1 ถึง 3
// เดือน" (about humans), while a 2 occurs in another source.
const sources = [
  'Rabies — Sample Collection | สถานการณ์ในคนของไทย\nปี 2568 คนป่วย 7 ราย หลังโดนกัด 1 ถึง 3 เดือนจึงมีอาการ และเมื่อมีอาการแล้วไม่เกิน 10 วัน',
  'Rabies | Clinical signs\n1. Prodromal (1-2 วัน) 2. Excitative (1-7 วัน)',
];

test('a number in a cited stretch must be in the source that stretch cites', () => {
  const r = computeCheck('ระยะฟักตัวในสุนัขอยู่ที่ 2-3 เดือน [1] ส่วน prodromal phase 1-2 วัน [2]', { sourceCount: 2, context: sources.join('\n'), sourceTexts: sources });
  assert.deepEqual(r.ungrounded, ['2'], 'the 2 exists only in source 2, not in the source the claim cites');
  const fine = computeCheck('หลังโดนกัด 1 ถึง 3 เดือนจึงมีอาการ [1] และ prodromal 1-2 วัน [2]', { sourceCount: 2, context: sources.join('\n'), sourceTexts: sources });
  assert.deepEqual(fine.ungrounded, []);
});

test('uncited text is checked against every source, and student numbers always pass', () => {
  const r = computeCheck('สรุปทั้งหมดมี 7 ราย และอีก 99 ราย', { sourceCount: 2, context: sources.join('\n'), sourceTexts: sources });
  assert.deepEqual(r.ungrounded, ['99']);
  const s = computeCheck('ได้ 5 ข้อ [2]', { sourceCount: 2, context: '', sourceTexts: sources, studentText: 'ขอ 5 ข้อ' });
  assert.deepEqual(s.ungrounded, []);
});

test('a number a source spells out in English counts as that number', () => {
  const papers = ['Isolation of three NADC30-like PRRSV variants', 'Six miRNAs were validated in vivo, twelve were proviral'];
  const r = computeCheck('NADC30-like 3 สายพันธุ์ [1] และ validated 6 ตัว จาก proviral 12 ตัว [2]', { sourceCount: 2, context: papers.join('\n'), sourceTexts: papers });
  assert.deepEqual(r.ungrounded, []);
  assert.deepEqual(computeCheck('มี 4 สายพันธุ์ [1]', { sourceCount: 2, context: '', sourceTexts: papers }).ungrounded, ['4']);
});

test('segments end at their citations; consecutive markers are one group', () => {
  assert.deepEqual(citedSegments('ก 1 [1][2] ข 2 [2]\nค 3'), [
    { text: 'ก 1 ', cites: [1, 2] },
    { text: 'ข 2 ', cites: [2] },
    { text: 'ค 3', cites: [] },
  ]);
});
