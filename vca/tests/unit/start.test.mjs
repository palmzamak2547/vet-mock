// Starting a set end to end, against the bank files the generator wrote: the right size, the
// exam's spread across domains, timing at the exam's pace, retries and "new first".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public');
// The pages fetch /bank/<domain>.<hash>.json; here the files are read from public/.
globalThis.fetch = async (url) => {
  const file = path.join(PUBLIC, String(url));
  if (!fs.existsSync(file)) return { ok: false, status: 404, json: async () => null };
  return { ok: true, status: 200, json: async () => JSON.parse(fs.readFileSync(file, 'utf8')) };
};

const { startSet, quickStart, pickDomains, emptyReason, ALL_DOMAINS, EXAM_WEIGHTS, MOCK_SIZES, PER_QUESTION } = await import('../../src/lib/start.js');
const { allocate, seededRandom } = await import('../../src/lib/sets.js');
const { sessionStore } = await import('../../src/lib/session.js');
const { progressStore, emptyProgress } = await import('../../src/lib/progress.js');
const { BANK, CARD_BY_ID, loadDomain, questionByKey } = await import('../../src/lib/bank.js');
const { EXAM_SECONDS, FORMAT } = await import('../../src/data/exam.js');

const countBy = (items) => items.reduce((acc, it) => ({ ...acc, [it.domain]: (acc[it.domain] || 0) + 1 }), {});
const sizes = Object.fromEntries(BANK.domains.map((d) => [d.id, d.count]));

test('the builder offers a full part and the exam pace', () => {
  assert.equal(MOCK_SIZES.at(-1), FORMAT.perPart);
  assert.ok(PER_QUESTION.includes(EXAM_SECONDS));
  assert.ok(PER_QUESTION.includes(0), 'untimed stays an option');
  assert.deepEqual(ALL_DOMAINS, BANK.domains.map((d) => d.id));
});

test('a full mock part: 150 questions, three hours, spread as the exam asks', async () => {
  progressStore.set(emptyProgress());
  const res = await startSet({ mode: 'mock', size: FORMAT.perPart });
  assert.equal(res.ok, true);
  const { session } = res;
  assert.equal(session.items.length, 150);
  assert.equal(new Set(session.items.map((it) => it.key)).size, 150, 'no question twice');
  assert.equal(session.limitSec, 150 * 72, 'three hours');
  assert.equal(session.meta.mix, 'exam');
  assert.equal(sessionStore.get().id, session.id, 'the set is stored for the session page');
  const counts = countBy(session.items);
  assert.deepEqual(counts, Object.fromEntries(Object.entries(allocate(sizes, 150, EXAM_WEIGHTS)).filter(([, n]) => n)));
  for (const id of ALL_DOMAINS) assert.ok(counts[id] >= 1, `${id} is in the paper`);
  assert.ok(counts.ruminant > counts.imaging, 'ruminant, asked most, outweighs imaging');
  assert.ok(counts['micro-immuno'] <= CARD_BY_ID['micro-immuno'].count, 'never more than a domain holds');
});

test('mixing by the bank instead follows the domains\' sizes', async () => {
  const res = await startSet({ mode: 'mock', size: 100, mix: 'bank', perQuestion: 0 });
  const counts = countBy(res.session.items);
  assert.deepEqual(counts, Object.fromEntries(Object.entries(allocate(sizes, 100)).filter(([, n]) => n)));
  const largest = BANK.domains.slice().sort((a, b) => b.count - a.count)[0].id;
  assert.equal(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0], largest);
  assert.equal(res.session.limitSec, null, 'perQuestion 0 is untimed');
});

test('each item fixes its option order and keeps the original answer', async () => {
  const res = await startSet({ mode: 'practice', size: 20, domains: ['swine', 'equine'] });
  for (const it of res.session.items) {
    const q = questionByKey(it.key);
    assert.ok(q, `${it.key} is loaded`);
    assert.equal(it.answer, q.answer);
    assert.deepEqual(it.order.slice().sort((a, b) => a - b), q.options.map((_, i) => i));
    assert.ok(['swine', 'equine'].includes(it.domain));
  }
  assert.equal(res.session.limitSec, null, 'practice is never timed');
  assert.deepEqual(res.session.meta.domains, ['swine', 'equine']);
});

test('a quick start: ten questions from at most four domains', async () => {
  progressStore.set(emptyProgress());
  const res = await quickStart();
  assert.equal(res.ok, true);
  assert.equal(res.session.mode, 'practice');
  assert.equal(res.session.items.length, 10);
  assert.ok(new Set(res.session.items.map((it) => it.domain)).size <= 4);
  assert.equal(res.session.meta.label, 'quick');
});

test('new questions first, topped up from the rest when too few are new', async () => {
  const swine = await loadDomain('swine');
  const fresh = swine.slice(0, 3).map((q) => q.key);
  const seen = Object.fromEntries(swine.slice(3).map((q) => [q.key, { d: 'swine', n: 1, c: 1, l: 1, t: 1 }]));
  progressStore.set({ ...emptyProgress(), q: seen });
  const res = await startSet({ mode: 'practice', size: 10, prefer: 'unseen', domains: ['swine'] });
  const keys = res.session.items.map((it) => it.key);
  assert.equal(keys.length, 10);
  for (const k of fresh) assert.ok(keys.includes(k), `${k}, never answered, is drawn`);
  progressStore.set(emptyProgress());
});

test('a retry keeps exactly the questions asked for', async () => {
  const equine = await loadDomain('equine');
  const want = equine.slice(5, 8).map((q) => q.key);
  const res = await startSet({ mode: 'practice', size: want.length, keys: want, domains: ['equine'], label: 'missed' });
  assert.deepEqual(res.session.items.map((it) => it.key).sort(), want.slice().sort());
  assert.equal(res.session.meta.retry, true);
});

test('nothing left to draw says so', async () => {
  progressStore.set(emptyProgress());
  assert.deepEqual(await startSet({ mode: 'practice', size: 10, status: 'wrong', domains: ['juris'] }), { ok: false, reason: 'empty' });
});

test('a set that would be empty says why, in a line about this choice', () => {
  assert.equal(emptyReason({ status: 'wrong', count: 0 }), 'ยังไม่มีข้อที่เคยตอบผิด');
  assert.equal(emptyReason({ status: 'wrong', narrowed: true, count: 0 }), 'ยังไม่มีข้อที่เคยตอบผิดตามตัวเลือกนี้', 'missing nothing overall is not claimed of one domain');
  assert.equal(emptyReason({ status: 'unseen', count: 0 }), 'ทำครบทุกข้อแล้ว');
  assert.equal(emptyReason({ status: 'unseen', narrowed: true, count: 0 }), 'ทำครบทุกข้อตามตัวเลือกนี้แล้ว');
  assert.equal(emptyReason({ status: 'all', narrowed: true, count: 0 }), 'ไม่มีข้อที่ตรงกับตัวเลือกนี้');
  for (const status of ['all', 'unseen', 'wrong']) assert.equal(emptyReason({ status, narrowed: true, count: 3 }), null, `${status}: a set with questions needs no reason`);
});

test('quick-start domains come in proportion to how often the exam asks them', () => {
  const rand = seededRandom(11);
  const picks = {};
  for (let i = 0; i < 3000; i += 1) {
    const four = pickDomains(4, rand);
    assert.equal(new Set(four).size, 4);
    for (const id of four) {
      assert.ok(CARD_BY_ID[id], id);
      picks[id] = (picks[id] || 0) + 1;
    }
  }
  assert.ok(picks.ruminant > picks.zoonoses, `ruminant ${picks.ruminant} vs zoonoses ${picks.zoonoses}`);
  assert.ok(picks.theriogenology > picks.imaging, `therio ${picks.theriogenology} vs imaging ${picks.imaging}`);
  assert.equal(Object.keys(picks).length, ALL_DOMAINS.length, 'every domain turns up');
});

// ── the filters, which now read the index rather than the questions ───────────────────────────

const kindOf = (item) => questionByKey(item.key).kind;
const topicOf = (item) => { const q = questionByKey(item.key); return `${q.subject}/${q.topic || ''}`; };

test('a source cuts the pool by what each question came from', async () => {
  progressStore.set(emptyProgress());
  const vca = await startSet({ mode: 'practice', size: 40, source: 'vca' });
  assert.equal(vca.session.items.length, 40);
  assert.ok(vca.session.items.every((it) => kindOf(it) === 'vca'));
  const paper = await startSet({ mode: 'practice', size: 60, source: 'paper', domains: ['swine', 'equine', 'avian'] });
  assert.ok(paper.session.items.every((it) => ['vca', 'paper'].includes(kindOf(it))));
  assert.ok(paper.session.items.some((it) => kindOf(it) === 'paper'), 'past papers are in it');
});

test('a topic list cuts the pool to those topics', async () => {
  const { CATALOG } = await import('../../src/generated/catalog.js');
  const row = CATALOG.domains.swine.shown[0];
  const res = await startSet({ mode: 'practice', size: 10, domains: ['swine'], topics: row.keys });
  assert.ok(res.session.items.length >= 1 && res.session.items.length <= Math.min(10, row.n));
  assert.ok(res.session.items.every((it) => row.keys.includes(topicOf(it))), 'every question is on one of the topics');
});

test('wrong and unseen read the progress record by key', async () => {
  const swine = await loadDomain('swine');
  const missed = swine.slice(20, 25).map((q) => q.key);
  const right = swine.slice(25, 40).map((q) => q.key);
  const q = {};
  for (const k of missed) q[k] = { d: 'swine', n: 2, c: 1, l: 0, t: 5 };
  for (const k of right) q[k] = { d: 'swine', n: 1, c: 1, l: 1, t: 4 };
  progressStore.set({ ...emptyProgress(), q });
  const wrong = await startSet({ mode: 'practice', size: 20, status: 'wrong', domains: ['swine'] });
  assert.deepEqual(wrong.session.items.map((it) => it.key).sort(), missed.slice().sort(), 'exactly the questions last answered wrongly');
  const unseen = await startSet({ mode: 'practice', size: swine.length, status: 'unseen', domains: ['swine'] });
  const keys = unseen.session.items.map((it) => it.key);
  assert.equal(keys.length, swine.length - missed.length - right.length);
  assert.ok(keys.every((k) => !q[k]), 'none of the questions already answered');
  progressStore.set(emptyProgress());
});

test('asking for more than the pool holds gives the pool, each question once', async () => {
  progressStore.set(emptyProgress());
  const res = await startSet({ mode: 'practice', size: 500, domains: ['imaging'] });
  assert.equal(res.session.items.length, CARD_BY_ID.imaging.count);
  assert.equal(new Set(res.session.items.map((it) => it.key)).size, CARD_BY_ID.imaging.count);
});

test('a domain list keeps a set to those domains, and a card\'s count is the index\'s', async () => {
  for (const id of ['juris', 'pathology']) {
    const list = await loadDomain(id);
    assert.equal(list.length, CARD_BY_ID[id].count);
  }
  const res = await startSet({ mode: 'practice', size: 30, domains: ['juris', 'pathology'] });
  assert.ok(res.session.items.every((it) => ['juris', 'pathology'].includes(it.domain)));
  assert.ok(res.session.items.some((it) => it.domain === 'juris') && res.session.items.some((it) => it.domain === 'pathology'));
});
