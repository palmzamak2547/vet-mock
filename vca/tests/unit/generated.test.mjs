// What scripts/build-bank.mjs wrote (npm test runs it first): counts that reconcile with the
// main bank, one content-hashed file per domain holding exactly its card's questions, and no
// address of the collection's private Drive copies anywhere the site ships.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { BANK, SAMPLES } from '../../src/generated/bank.js';
import { CATALOG } from '../../src/generated/catalog.js';
import { LIBRARY } from '../../src/generated/library.js';
import { MAPPED_SUBJECTS, EXCLUDED_SUBJECTS } from '../../src/data/domains.js';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PUBLIC = path.join(APP, 'public');
const KINDS = ['vca', 'paper', 'aligned', 'lecture', 'course'];
const sum = (xs) => xs.reduce((a, b) => a + b, 0);

const files = Object.fromEntries(BANK.domains.map((card) => {
  const text = fs.readFileSync(path.join(PUBLIC, card.file), 'utf8');
  return [card.id, { text, body: JSON.parse(text) }];
}));

test('the total is the sum of the domains and of the kinds', () => {
  assert.ok(BANK.total > 0);
  assert.equal(BANK.total, sum(BANK.domains.map((d) => d.count)));
  assert.equal(BANK.total, sum(Object.values(BANK.kinds)));
  assert.deepEqual(Object.keys(BANK.kinds), KINDS);
  for (const d of BANK.domains) assert.equal(sum(Object.values(d.kinds)), d.count, `${d.id} kinds`);
});

test('each domain file holds exactly its card\'s questions', () => {
  for (const card of BANK.domains) {
    const { body } = files[card.id];
    assert.equal(body.domain, card.id);
    assert.equal(body.questions.length, card.count, `${card.id} count`);
    const byKind = Object.fromEntries(KINDS.map((k) => [k, 0]));
    for (const q of body.questions) byKind[q.kind] += 1;
    assert.deepEqual(byKind, card.kinds, `${card.id} kinds`);
  }
});

test('every served question can be asked and graded', () => {
  for (const card of BANK.domains) {
    const keys = new Set();
    for (const q of files[card.id].body.questions) {
      const where = `${card.id} ${q.subject}:${q.id}`;
      assert.ok(String(q.q).trim(), `${where}: a stem`);
      assert.ok(Array.isArray(q.options) && q.options.length >= 2, `${where}: options`);
      for (const o of q.options) assert.ok(typeof o === 'string' && o.trim(), `${where}: an empty option`);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `${where}: answer ${q.answer}`);
      assert.ok(KINDS.includes(q.kind), `${where}: kind ${q.kind}`);
      assert.ok(MAPPED_SUBJECTS.includes(q.subject), `${where}: subject not mapped`);
      const key = `${q.subject}:${q.id}`;
      assert.ok(!keys.has(key), `${where}: twice in one domain`);
      keys.add(key);
      for (const fig of [q.image, q.explainImage]) {
        if (typeof fig === 'string' && fig.startsWith('/q/')) assert.ok(fs.existsSync(path.join(PUBLIC, fig)), `${where}: missing figure ${fig}`);
      }
    }
  }
});

test('a question is served from one domain only', () => {
  const owner = new Map();
  for (const card of BANK.domains) {
    for (const q of files[card.id].body.questions) {
      const key = `${q.subject}:${q.id}`;
      assert.ok(!owner.has(key), `${key} is in ${owner.get(key)} and ${card.id}`);
      owner.set(key, card.id);
    }
  }
});

test('bank files are named by their content, and nothing stale is left beside them', () => {
  const named = new Set();
  for (const card of BANK.domains) {
    const name = path.basename(card.file);
    const m = /^([a-z-]+)\.([0-9a-f]{10})\.json$/.exec(name);
    assert.ok(m, `${name}: domain.hash.json`);
    assert.equal(m[1], card.id);
    assert.equal(crypto.createHash('sha256').update(files[card.id].text).digest('hex').slice(0, 10), m[2], `${name}: hash`);
    assert.equal(Buffer.byteLength(files[card.id].text), card.bytes, `${name}: bytes`);
    named.add(name);
  }
  assert.deepEqual(new Set(fs.readdirSync(path.join(PUBLIC, 'bank'))), named);
});

test('no Drive address in anything the site ships', () => {
  const shipped = [
    ...fs.readdirSync(path.join(APP, 'src', 'generated')).map((f) => path.join(APP, 'src', 'generated', f)),
    ...fs.readdirSync(path.join(PUBLIC, 'bank')).map((f) => path.join(PUBLIC, 'bank', f)),
  ];
  for (const file of shipped) {
    const text = fs.readFileSync(file, 'utf8');
    assert.ok(!text.includes('drive.google.com'), `${path.relative(APP, file)} names drive.google.com`);
    assert.ok(!text.includes('docs.google.com'), `${path.relative(APP, file)} names docs.google.com`);
  }
});

test('reference links are public https pages', () => {
  for (const card of BANK.domains) {
    for (const q of files[card.id].body.questions) {
      for (const r of q.refs || []) {
        assert.ok(r.title, `${q.subject}:${q.id}: a reference title`);
        if (r.url) assert.match(r.url, /^https:\/\//, `${q.subject}:${q.id}: ${r.url}`);
      }
    }
  }
});

test('hero samples: short, answerable, from known domains', () => {
  assert.ok(SAMPLES.length > 0);
  const ids = new Set(BANK.domains.map((d) => d.id));
  for (const s of SAMPLES) {
    assert.ok(ids.has(s.domain), `${s.id}: domain ${s.domain}`);
    assert.equal(s.subject, 'vca');
    assert.ok(s.q.length >= 24 && s.q.length <= 120, `${s.id}: stem length ${s.q.length}`);
    assert.ok(Number.isInteger(s.answer) && s.answer < s.options.length);
    assert.ok(s.explain && s.explain.length >= 40);
  }
});

test('cards carry what the wall shows', () => {
  for (const d of BANK.domains) {
    assert.match(d.art, /^\/art\/[^/]+\.(webp|png|jpg)$/, `${d.id} art`);
    assert.match(d.paper, /^#[0-9a-f]{6}$/i, `${d.id} paper`);
    assert.ok(!d.th.includes('|'), `${d.id}: plain Thai name`);
    assert.equal(d.th, d.thw.replace(/\|/g, ''));
  }
  assert.equal(BANK.families.length, 4);
});

test('the catalog explains everything left out', () => {
  assert.deepEqual(Object.keys(CATALOG.left).sort(), ['answer', 'empty', 'held', 'passage', 'type']);
  for (const x of CATALOG.excludedSubjects) {
    assert.ok(x.id in EXCLUDED_SUBJECTS, `${x.id} is excluded on purpose`);
    assert.ok(x.n > 0 && x.why && x.name);
  }
  for (const d of BANK.domains) {
    const detail = CATALOG.domains[d.id];
    assert.ok(detail, `${d.id}: topics and subjects`);
    assert.equal(sum(detail.subjects.map((s) => s.n)), d.count, `${d.id}: subjects add up`);
    assert.equal(sum(detail.topics.map((t) => t.n)), d.count, `${d.id}: topics add up`);
  }
  assert.ok(BANK.held >= CATALOG.left.held, 'held in scope covers the held questions left out');
});

test('the library summary matches the library module', () => {
  assert.equal(BANK.library.documents, LIBRARY.documents);
  assert.equal(LIBRARY.documents, LIBRARY.docs.length);
  assert.equal(LIBRARY.papers + LIBRARY.handouts, LIBRARY.documents);
  assert.equal(BANK.library.pages, LIBRARY.pages);
  assert.ok(LIBRARY.pages > 0);
  assert.equal(sum(LIBRARY.shelves.map((s) => s.count)), LIBRARY.documents, 'every document on one shelf');
  for (const d of LIBRARY.docs) {
    assert.ok(['paper', 'handout'].includes(d.kind));
    assert.ok(LIBRARY.shelves.some((s) => s.id === d.shelf), `${d.id}: shelf ${d.shelf}`);
    assert.ok(!/https?:\/\//.test(d.title), `${d.id}: a title, not an address`);
  }
});

test('counts reconcile with the main bank', async () => {
  const { BANK_REGISTRY } = await import('../../../src/data/bank-registry.generated.js');
  const { isQuestionDeliverable } = await import('../../../src/data/question-delivery.generated.js');
  let inScope = 0;
  const excluded = {};
  for (const bank of BANK_REGISTRY) {
    for (const q of await bank.load()) {
      if (MAPPED_SUBJECTS.includes(q.subject)) inScope += 1;
      else if (q.subject in EXCLUDED_SUBJECTS && isQuestionDeliverable(q)) excluded[q.subject] = (excluded[q.subject] || 0) + 1;
    }
  }
  const leftOut = sum(Object.values(CATALOG.left));
  const unplaced = sum(Object.entries(CATALOG.unmapped).filter(([k]) => k.includes('/')).map(([, n]) => n));
  assert.equal(BANK.total + leftOut + unplaced, inScope, 'every in-scope question is served or accounted for');
  assert.deepEqual(Object.fromEntries(CATALOG.excludedSubjects.map((x) => [x.id, x.n])), excluded);
});
