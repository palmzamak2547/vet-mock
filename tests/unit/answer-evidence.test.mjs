// Answer evidence (docs/ANSWER-EVIDENCE.md): the slide a revealed answer rests on.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { evidenceHash, keyText } from '../../src/lib/evidence-hash.js';
import { cropOf, evidenceBase, evidenceFor, forgetEvidenceBase, hasEvidence, knownBase, prefetchEvidence, resetEvidence, slideUrl } from '../../src/lib/evidence.js';
import { boxesOf, grounded, headingOf, numbersOf, settle, squash, tokens } from '../../scripts/evidence/build.mjs';
import { lintEvidence } from '../../scripts/lint-evidence.mjs';
import { resetChulaGate } from '../../api/_lib/chula-gate.js';

const mcq = { subject: 's', id: 7, type: 'mcq', q: 'เชื้อใดก่อโรค', options: ['ก', 'ข', 'ค', 'ง'], answer: 2 };
const GOOD = 'https://slides.vetmock.com/e/0123456789abcdef0123456789abcdef';
const store = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), removeItem: (k) => m.delete(k) }; };

test('the hash follows the stem and the key, nothing else', () => {
  const h = evidenceHash(mcq);
  assert.match(h, /^[0-9a-f]{8}$/);
  assert.equal(evidenceHash({ ...mcq, explain: 'เหตุผลใหม่', tags: ['x'] }), h, 'an edited explanation keeps the slide');
  assert.notEqual(evidenceHash({ ...mcq, q: 'เชื้อใดก่อโรคนี้' }), h, 'an edited stem drops it');
  assert.notEqual(evidenceHash({ ...mcq, answer: 1 }), h, 'a changed key drops it');
  assert.notEqual(evidenceHash({ ...mcq, options: ['ก', 'ข', 'ฮ', 'ง'] }), h, 'a reworded key drops it');
  assert.equal(evidenceHash({ ...mcq, options: ['ฮ', 'ข', 'ค', 'ง'] }), h, 'a reworded distractor keeps it');
  // A stem whose numbers moved into a passage table keeps the sentence it was in `say`: the same question, the same slide.
  assert.equal(evidenceHash({ ...mcq, q: 'จากตาราง เชื้อใดก่อโรค', say: mcq.q }), h, 'a stem laid out as a table keeps its slide');
  assert.notEqual(evidenceHash({ ...mcq, q: 'จากตาราง เชื้อใดก่อโรค', say: 'เชื้อใดก่อโรคนี้' }), h, 'an edited whole sentence drops it');
  assert.equal(keyText({ type: 'tf', answer: false }), 'ผิด');
  assert.equal(keyText({ type: 'tf', answer: true }), 'ถูก');
  assert.equal(keyText({ type: 'short', model_answer: 'คำตอบ' }), 'คำตอบ');
  assert.equal(keyText({ type: 'match', pairs: [] }), '', 'a matching set has no single key');
});

test('a slide is shown only for the question it was matched to', async () => {
  resetEvidence();
  const row = [0, 12, 960, 540, [[80, 300, 420, 60]], evidenceHash(mcq)];
  const loaders = { s: async () => ({ EVIDENCE: { docs: [['0123456789abcdef', 'deck-slug', 'Deck', 'slide']], q: { 7: row, 8: row } } }) };
  assert.equal(evidenceFor(mcq), undefined, 'not loaded yet');
  assert.equal(hasEvidence('s'), false);
  await prefetchEvidence('s', loaders);
  assert.equal(hasEvidence('s'), true);
  assert.deepEqual(evidenceFor(mcq), { sha16: '0123456789abcdef', slug: 'deck-slug', title: 'Deck', kind: 'slide', page: 12, w: 960, h: 540, boxes: [[80, 300, 420, 60]] });
  assert.equal(evidenceFor({ ...mcq, q: 'โจทย์ที่แก้แล้ว' }), null, 'a question edited since: no slide');
  assert.equal(evidenceFor({ ...mcq, id: 8, answer: 0 }), null, 'a row filed under another key: no slide');
  assert.equal(evidenceFor({ ...mcq, id: 99 }), null);
  await prefetchEvidence('none', loaders);
  assert.equal(evidenceFor({ subject: 'none', id: 1 }), null, 'a subject with no file settles as none');
  assert.equal(hasEvidence('none'), false);
});

test('an index that failed to load is asked for again', async () => {
  resetEvidence();
  let calls = 0;
  const loaders = { s: async () => { calls++; if (calls === 1) throw new Error('offline'); return { EVIDENCE: { docs: [], q: {} } }; } };
  await prefetchEvidence('s', loaders);
  assert.equal(evidenceFor(mcq), undefined, 'still unknown, not "none"');
  await prefetchEvidence('s', loaders);
  assert.equal(evidenceFor(mcq), null);
  assert.equal(calls, 2);
});

test('a malformed row or an odd id shows nothing rather than breaking the card', async () => {
  resetEvidence();
  const h = evidenceHash(mcq);
  const loaders = { s: async () => ({ EVIDENCE: { docs: [['0123456789abcdef', 'deck', 'Deck', 'slide']], q: { 7: [0, 3, 0, 540, [], h], 8: 'not a row', 9: [5, 3, 960, 540, [], h] } } }) };
  await prefetchEvidence('s', loaders);
  assert.equal(evidenceFor(mcq), null, 'a page with no width');
  assert.equal(evidenceFor({ ...mcq, id: 8 }), null, 'a row that is not a list');
  assert.equal(evidenceFor({ ...mcq, id: 9 }), null, 'a document the file does not hold');
  assert.equal(evidenceFor({ ...mcq, id: 'constructor' }), null, 'an id that names something every object has');
  assert.equal(evidenceFor({ ...mcq, id: '__proto__' }), null);
  assert.equal(evidenceFor(null), undefined);
  await prefetchEvidence('toString', loaders);
  assert.equal(hasEvidence('toString'), false, 'a subject named like an object method has no loader');
  resetEvidence();
});

test('the image address comes from the gate, is kept for the tab, and must be the slide host', async () => {
  resetEvidence();
  let asked = 0;
  const storage = store();
  const fetchImpl = async (url) => { asked++; assert.equal(url, '/api/evidence-pass'); return Response.json({ base: `${GOOD}/` }); };
  assert.equal(knownBase({ storage }), undefined, 'nobody has asked yet');
  const [a, b] = await Promise.all([evidenceBase({ fetchImpl, storage }), evidenceBase({ fetchImpl, storage })]);
  assert.equal(a, GOOD);
  assert.equal(b, GOOD);
  assert.equal(asked, 1, 'two rows asking at once make one request');
  assert.equal(knownBase({ storage }), GOOD, 'known without asking from then on');
  resetEvidence();
  assert.equal(await evidenceBase({ fetchImpl: async () => { throw new Error('not asked'); }, storage }), GOOD, 'a reload in the same tab reads it back');
  forgetEvidenceBase({ storage });
  assert.equal(knownBase({ storage }), undefined, 'forgotten in memory and in the tab');
  assert.equal(slideUrl(GOOD, { sha16: 'abcdefabcdefabcd', page: 7 }), `${GOOD}/abcdefabcdefabcd/p007.webp`);
  resetEvidence();
  assert.equal(await evidenceBase({ fetchImpl: async () => Response.json({ base: 'https://evil.example/e/x' }), storage: store() }), null, 'another host is refused');
  resetEvidence();
});

test('a visitor the wall refused is not asked about on every answer, and is asked again after signing in', async () => {
  resetEvidence();
  let n = 0;
  let clock = 1_000_000;
  const io = { storage: store(), now: () => clock, fetchImpl: async () => (++n === 1 ? new Response('{}', { status: 401 }) : Response.json({ base: GOOD })) };
  assert.equal(await evidenceBase(io), null, 'a guest gets none');
  assert.equal(knownBase({ storage: io.storage, now: clock }), null, 'and that is known, so a card draws no frame');
  assert.equal(await evidenceBase(io), null);
  assert.equal(await evidenceBase(io), null);
  assert.equal(n, 1, 'one request, not one per question');
  forgetEvidenceBase(io);   // what a sign-in does (vmx-auth-changed)
  assert.equal(await evidenceBase(io), GOOD, 'asked again after signing in');
  resetEvidence();
  n = 0;
  io.storage = store();   // another tab: nothing kept
  assert.equal(await evidenceBase(io), null);
  clock += 6 * 60_000;
  assert.equal(await evidenceBase(io), GOOD, 'and again by itself after five minutes');
  resetEvidence();
});

test('the inline crop stays inside the page and never magnifies past the image', () => {
  const cases = [
    { w: 960, h: 540, boxes: [[80, 300, 420, 60], [80, 372, 380, 58]] },
    { w: 960, h: 540, boxes: [[100, 500, 200, 50]] },
    { w: 960, h: 540, boxes: [[50, 100, 500, 700]] },
    { w: 595, h: 842, boxes: [[100, 300, 700, 40]] },
    { w: 960, h: 540, boxes: [[0, 0, 1000, 1000]] },
    { w: 960, h: 540, boxes: [[900, 950, 100, 50]] },
  ];
  for (const narrow of [false, true]) {
    for (const rec of cases) {
      const c = cropOf(rec, { narrow });
      assert.ok(c.cx >= 0 && c.cy >= 0 && c.cx + c.cw <= 1.0001 && c.cy + c.ch <= 1.0001, JSON.stringify([rec.boxes, c]));
      assert.ok(c.cw >= (narrow ? 0.45 : 0.62) - 1e-9, 'never magnified past what the image carries');
      assert.ok(c.shape >= 1.1 - 1e-9 || (c.cw === 1 && c.ch === 1), JSON.stringify(c));
      assert.ok(Math.abs(c.shape - (c.cw * (rec.w / rec.h)) / c.ch) < 1e-9, 'the frame has the shape of the crop');
      // Every highlighted line is inside the crop, unless the page is shown whole anyway.
      for (const [x, y, w, h] of rec.boxes) {
        if (c.cw === 1 && c.ch === 1) continue;
        assert.ok(x / 1000 >= c.cx - 1e-9 && (x + w) / 1000 <= c.cx + c.cw + 1e-9, 'x inside');
        assert.ok(y / 1000 >= c.cy - 1e-9 && (y + h) / 1000 <= c.cy + c.ch + 1e-9, 'y inside');
      }
    }
  }
  assert.deepEqual(cropOf({ w: 960, h: 540, boxes: [] }), { cx: 0, cy: 0, cw: 1, ch: 1, shape: 960 / 540 }, 'a fact in a figure: the whole slide');
});

const page = { w: 960, h: 540, lines: [
  [80, 60, 600, 100, 'Antibiotics select for MDR bacteria.', 30],
  [80, 200, 500, 226, '• Different resistance determinants are', 20],
  [80, 228, 520, 254, 'present on the same genetic element.', 20],
  [80, 280, 500, 306, '• A single antibiotic coselect for several', 20],
  [80, 308, 300, 334, 'resistance genes.', 20],
  [600, 200, 900, 226, '• The same mechanism responsible for', 20],
] };
const cands = [{ id: 'a:1', p: { page: { lines: [[0, 0, 10, 10, 'unrelated', 10]] }, doc: {} } }, { id: 'a:2', p: { page, doc: {} } }];

test('pointed lines are kept only when the copied words stand in them', () => {
  const ok = settle({ page: 'P2', lines: [2, 3], quote: 'Different resistance determinants are present on the same genetic element.' }, cands);
  assert.deepEqual(ok.idx, [1, 2]);
  const miscounted = settle({ page: 'P2', lines: [5, 6], quote: 'A single antibiotic coselect for several resistance genes.' }, cands);
  assert.deepEqual(miscounted.idx, [3, 4], 'the words decide, not the numbers');
  const pieces = settle({ page: 'P2', lines: [2], quote: 'Different resistance determinants are • resistance genes.' }, cands);
  assert.deepEqual(pieces.idx, [1, 4], 'bulleted pieces each stand in a line');
  assert.equal(settle({ page: 'P2', lines: [2, 3], quote: 'Plasmids always carry five resistance genes at once.' }, cands), null, 'words the page does not hold');
  assert.equal(settle({ page: 'P9', lines: [1], quote: 'Different resistance determinants are' }, cands), null, 'a page that was not offered');
  assert.equal(settle({ page: 'P2', lines: [1], quote: 'MDR' }, cands), null, 'too short to prove anything');
  assert.equal(squash('• Co-selection: ยา 1 ชนิด'), 'coselectionยา1ชนิด');
});

test('the lines the page prints are taken before lines read from its pictures', () => {
  const mixed = { w: 960, h: 540, lines: [
    [80, 60, 600, 100, 'Last-line antibiotics', 30],
    [80, 200, 700, 226, 'Drugs reserved for treating serious infections', 20],
    [0, 180, 960, 225, 'Drugs reserved for treating serious infections caused by MDR bacteria', 0, 'v'],
  ] };
  const got = settle({ page: 'P1', lines: [3], quote: 'Drugs reserved for treating serious infections' }, [{ p: { page: mixed, doc: {} } }]);
  assert.deepEqual(got.idx, [1], 'the text line, with its exact box');
  const onlyPicture = settle({ page: 'P1', lines: [3], quote: 'caused by MDR bacteria' }, [{ p: { page: mixed, doc: {} } }]);
  assert.deepEqual(onlyPicture.idx, [2], 'words that stand only in the picture');
});

test('a reason must be words of the lines; numbers are compared as numbers; the heading is the big line on top', () => {
  const lines = ['Kill spores > formaldehyde: 2-8 times', 'pH dependent 7.4-8.5'];
  assert.equal(grounded('Kill spores > formaldehyde: 2-8 times', lines), true);
  assert.equal(grounded('kill spores formaldehyde 2-8 times, pH dependent 7.4-8.5', lines), true, 'pieces of the lines, joined');
  assert.equal(grounded('It is sporicidal at alkaline pH as every textbook says', lines), false, 'an answer from memory');
  assert.equal(grounded('pH', lines), false, 'too short to ground anything');
  assert.deepEqual(numbersOf('ให้ 1,500 มก. ทุก ๘ ชม. หรือ 2.5 mg/kg (50-70%)'), ['1500', '8', '2.5', '50', '70']);
  assert.equal(headingOf(page), 0);
  assert.equal(headingOf({ w: 960, h: 540, lines: [[0, 0, 960, 45, 'Title read from a picture', 0, 'v'], [0, 45, 960, 90, 'body', 0, 'v']] }), 0);
  assert.equal(headingOf({ w: 960, h: 540, lines: [[80, 400, 500, 420, 'only a footer line', 12]] }), -1);
});

test('highlight boxes are thousandths of the page, with touching lines joined and edges kept inside', () => {
  const boxes = boxesOf(page, [1, 2, 3, 4]);
  assert.equal(boxes.length, 2, 'two bullets, two boxes');
  for (const [x, y, w, h] of boxes) {
    assert.ok([x, y, w, h].every((v) => Number.isInteger(v) && v >= 0 && v <= 1000));
    assert.ok(x + w <= 1000 && y + h <= 1000);
  }
  assert.deepEqual(boxes[0], [80, 365, 465, 111]);
  const over = boxesOf({ w: 1440, h: 810, lines: [[445.7, 222.7, 1443.1, 257.7, 'a line that runs a point past the page', 25]] }, [0]);
  assert.ok(over[0][0] + over[0][2] <= 1000, 'a line running past the edge is cut at the edge');
});

test('search tokens: Thai by word, Latin lowercased with a plural folded, stop words gone', () => {
  const t = tokens('Resistance genes ของเชื้อ E. coli ที่ดื้อยา 3 ชนิด');
  assert.ok(t.includes('resistance') && t.includes('gene') && t.includes('coli') && t.includes('3'));
  assert.ok(t.some((x) => /ดื้อ/.test(x)));
  assert.ok(!t.includes('ที่') && !t.includes('ของ'));
});

test('/api/evidence-pass answers members only, wall on or off, and only with the slide host', async () => {
  const previous = { ...process.env };
  const realFetch = globalThis.fetch;
  const MEMBER = 'member.token.0123456789abcdef';
  const GMAIL = 'gmail.token.0123456789abcdef';
  let enforce = true;
  Object.assign(process.env, { VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-key-0123456789abcdef', EVIDENCE_BASE: `${GOOD}/` });
  globalThis.fetch = async (url, init) => {
    assert.ok(String(url).endsWith('/rpc/chula_access_state'));
    const bearer = init.headers.Authorization.slice(7);
    if (bearer === MEMBER) return Response.json({ enforce, signed_in: true, member: true, uid: 'u1' });
    if (bearer === GMAIL) return Response.json({ enforce, signed_in: true, member: false, uid: 'u2' });
    return Response.json({ enforce, signed_in: false, member: false, uid: null });
  };
  const call = async (method, token) => {
    const res = { headers: {}, statusCode: 0, body: null, setHeader(k, v) { this.headers[k] = v; }, end(b) { this.body = b ? JSON.parse(b) : null; return this; },
      status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; } };
    const { default: handler } = await import('../../api/evidence-pass.js');
    await handler({ method, headers: token ? { authorization: `Bearer ${token}` } : {} }, res);
    return res;
  };
  const refused = (res, status) => {
    assert.equal(res.statusCode, status);
    assert.equal(res.headers['Cache-Control'], 'no-store');
    assert.equal(JSON.stringify(res.body).includes('slides.vetmock.com'), false, 'a refusal never carries the address');
  };
  try {
    for (const wall of [true, false]) {
      enforce = wall;
      resetChulaGate();
      refused(await call('GET', null), wall ? 401 : 403);   // with the wall off the gate lets a guest through; this function does not
      resetChulaGate();
      refused(await call('GET', GMAIL), 403);
      resetChulaGate();
      const ok = await call('GET', MEMBER);
      assert.equal(ok.statusCode, 200, `a member, wall ${wall ? 'on' : 'off'}`);
      assert.equal(ok.body.base, GOOD);
      assert.equal(ok.headers['Cache-Control'], 'no-store', 'the next person at this device must ask for themselves');
    }
    refused(await call('POST', MEMBER), 405);
    delete process.env.EVIDENCE_BASE;
    refused(await call('GET', MEMBER), 503);
    process.env.EVIDENCE_BASE = 'https://elsewhere.example/e/abc';
    refused(await call('GET', MEMBER), 503);
  } finally {
    process.env = previous;
    globalThis.fetch = realFetch;
    resetChulaGate();
  }
});

test('the filed index is well formed, names no slide text, and the loader map lists every subject file', async () => {
  const dir = new URL('../../src/data/evidence/', import.meta.url);
  const files = readdirSync(dir).filter((f) => f.endsWith('.generated.js') && f !== 'loaders.generated.js');
  const loaders = readFileSync(new URL('loaders.generated.js', dir), 'utf8');
  for (const f of files) assert.ok(loaders.includes(`'./${f}'`), `${f} is missing from loaders.generated.js: run node scripts/evidence/build.mjs index`);
  const { EVIDENCE_LOADERS } = await import('../../src/data/evidence/loaders.generated.js');
  assert.deepEqual(Object.keys(EVIDENCE_LOADERS).sort(), files.map((f) => f.replace('.generated.js', '')).sort());
  const { problems } = await lintEvidence();
  assert.deepEqual(problems, []);
  for (const f of files) {
    const text = readFileSync(new URL(f, dir), 'utf8');
    assert.doesNotMatch(text, /slides\.vetmock\.com|[0-9a-f]{32}/, `${f} must not hold the image address`);
    const { EVIDENCE } = await import(new URL(f, dir).href);
    for (const row of Object.values(EVIDENCE.q)) assert.equal(row.length, 6, 'a row is document, page, width, height, boxes, hash: no words of the slide');
  }
});
