// The bank's layout on disk: an index and shards per domain (src/lib/bank-index.js,
// scripts/bank-shards.mjs). The shards must hold exactly the questions the single file per domain
// used to hold, in the same order and word for word, and the index must say truthfully what is in
// them: a question lost or changed here is lost or changed on every student's phone.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { KINDS, decodeIndex, shardName } from '../../src/lib/bank-index.js';
import { SHARD_SIZE, shardDomain } from '../../scripts/bank-shards.mjs';
import { BANK } from '../../src/generated/bank.js';
import { readDomain } from '../support/bank-files.mjs';

const sha10 = (text) => crypto.createHash('sha256').update(text).digest('hex').slice(0, 10);

// ── the real bank, rebuilt now ──────────────────────────────────────────────────────────────────

// Importing the generator runs it (it is a script) and hands over the records it wrote: what the
// per-domain file used to contain, built by the same code from the main app's banks.
process.env.VCA_BUILD_QUIET = '1';
const { DOMAIN_ITEMS } = await import('../../scripts/build-bank.mjs');

test('every domain was built, and the shards add up to the bank', () => {
  assert.deepEqual([...DOMAIN_ITEMS.keys()], BANK.domains.map((d) => d.id));
  let total = 0;
  for (const card of BANK.domains) {
    const { questions } = readDomain(card);
    assert.equal(questions.length, card.count, `${card.id}: shards hold ${questions.length} questions, the card says ${card.count}`);
    total += questions.length;
  }
  assert.equal(total, BANK.total);
});

test('the shards of a domain, put back in order, are exactly the questions its single file held', () => {
  for (const card of BANK.domains) {
    const items = DOMAIN_ITEMS.get(card.id);
    const domain = readDomain(card);
    // Same questions, same order, same text, field for field.
    assert.deepEqual(domain.questions, items, `${card.id}: the union of the shards differs from the records`);
    // And as the old file's bytes: its name carried this digest, and the index keeps it.
    const old = JSON.stringify({ domain: card.id, questions: domain.questions });
    assert.equal(sha10(old), domain.raw.digest, `${card.id}: digest`);
    assert.equal(sha10(JSON.stringify({ domain: card.id, questions: items })), domain.raw.digest, `${card.id}: digest of the records`);
  }
});

test('the index lists the questions of the shards, one for one, in order', () => {
  for (const card of BANK.domains) {
    const { index, questions, shardTexts } = readDomain(card);
    assert.equal(index.n, questions.length);
    questions.forEach((q, at) => {
      const e = index.entries[at];
      assert.equal(e.key, `${q.subject}:${q.id}`, `${card.id} #${at}: key`);
      assert.equal(e.subject, q.subject);
      assert.equal(e.id, q.id);
      assert.equal(e.kind, q.kind, `${e.key}: kind`);
      assert.equal(e.topic, q.topic || undefined, `${e.key}: topic`);
      assert.equal(e.domain, card.id);
      assert.equal(e.at, at);
      assert.equal(e.shard, Math.floor(at / index.size), `${e.key}: shard`);
      assert.equal(index.byKey.get(e.key), e);
    });
    // Each shard file holds exactly the run of questions the index puts in it.
    index.shards.forEach((ref, n) => {
      const body = JSON.parse(shardTexts[n]);
      assert.equal(body.domain, card.id);
      assert.equal(body.shard, n);
      assert.equal(body.questions.length, ref.count);
      assert.deepEqual(body.questions.map((q) => `${q.subject}:${q.id}`), index.entries.slice(n * index.size, (n + 1) * index.size).map((e) => e.key));
    });
  }
});

test('a shard stays small: at most SHARD_SIZE questions and well under 100 KB', () => {
  for (const card of BANK.domains) {
    const { index, shardTexts } = readDomain(card);
    assert.equal(index.size, SHARD_SIZE);
    shardTexts.forEach((text, n) => {
      assert.ok(index.shards[n].count <= SHARD_SIZE, `${card.id} #${n}`);
      assert.ok(Buffer.byteLength(text) < 100_000, `${card.id} #${n} is ${Buffer.byteLength(text)} bytes`);
    });
    // Only the last shard of a domain may be short.
    index.shards.slice(0, -1).forEach((s, n) => assert.equal(s.count, SHARD_SIZE, `${card.id} #${n}`));
  }
});

test('no key is in two domains, and every key is unique', () => {
  const owner = new Map();
  for (const card of BANK.domains) {
    for (const e of readDomain(card).index.entries) {
      assert.ok(!owner.has(e.key), `${e.key} is in ${owner.get(e.key)} and ${card.id}`);
      owner.set(e.key, card.id);
    }
  }
  assert.equal(owner.size, BANK.total);
});

// ── the layout, on a domain made up here ────────────────────────────────────────────────────────

// Records as the generator makes them: JSON, so a field that is undefined is simply not there.
const q = (subject, id, kind, topic) => JSON.parse(JSON.stringify({ id, subject, kind, topic, q: `stem ${id}`, options: ['a', 'b'], answer: 0 }));
const made = Array.from({ length: 30 }, (_, i) => q(i < 20 ? 'anat' : 'vca', 100 + i, KINDS[i % KINDS.length], i % 7 === 0 ? undefined : `t${i % 3}`));

test('a domain is cut into runs of the shard size, the last one shorter', () => {
  const out = shardDomain('demo', made, 12);
  assert.equal(out.shards.length, 3);
  assert.deepEqual(out.shards.map((s) => JSON.parse(s.body).questions.length), [12, 12, 6]);
  assert.deepEqual(out.shards.flatMap((s) => JSON.parse(s.body).questions), made);
  out.shards.forEach((s, n) => assert.equal(s.name, shardName('demo', n, s.hash)));
  assert.match(out.indexName, /^demo\.index\.[0-9a-f]{8}\.json$/);
});

test('the index decodes to the fields a set filters and draws by', () => {
  const out = shardDomain('demo', made, 12);
  const ix = decodeIndex(JSON.parse(out.indexBody), 'demo');
  assert.equal(ix.n, 30);
  assert.equal(ix.entries[0].key, 'anat:100');
  assert.equal(ix.entries[0].topic, undefined, 'a question with no topic has none');
  assert.equal(ix.entries[1].topic, 't1');
  assert.equal(ix.entries[20].subject, 'vca');
  assert.deepEqual(ix.entries.map((e) => e.kind), made.map((m) => m.kind));
  assert.deepEqual(ix.entries.map((e) => e.shard), made.map((_, i) => Math.floor(i / 12)));
  assert.deepEqual(ix.shards.map((s) => s.count), [12, 12, 6]);
  assert.match(ix.shards[2].url, /^\/bank\/demo-2\.[0-9a-f]{8}\.json$/);
});

test('changing one question renames its shard and the index, and no other shard', () => {
  const before = shardDomain('demo', made, 12);
  const changed = made.map((m, i) => (i === 15 ? { ...m, q: 'a corrected stem' } : m));
  const after = shardDomain('demo', changed, 12);
  assert.equal(after.shards[0].name, before.shards[0].name);
  assert.notEqual(after.shards[1].name, before.shards[1].name);
  assert.equal(after.shards[2].name, before.shards[2].name);
  assert.notEqual(after.indexName, before.indexName);
  assert.notEqual(after.digest, before.digest);
  assert.equal(shardDomain('demo', made, 12).indexName, before.indexName, 'the same questions give the same names');
});

test('an index that is not this domain\'s, or is damaged, is refused', () => {
  const raw = JSON.parse(shardDomain('demo', made, 12).indexBody);
  assert.throws(() => decodeIndex(raw, 'other'), /not the index of other/);
  assert.throws(() => decodeIndex(null, 'demo'), /not the index/);
  assert.throws(() => decodeIndex({ ...raw, v: 2 }, 'demo'), /not the index/);
  assert.throws(() => decodeIndex({ ...raw, ids: raw.ids.slice(1) }, 'demo'), /damaged/);
  assert.throws(() => decodeIndex({ ...raw, kinds: raw.kinds.slice(1) }, 'demo'), /damaged/);
  assert.throws(() => decodeIndex({ ...raw, shards: raw.shards.slice(1) }, 'demo'), /damaged/);
  assert.throws(() => decodeIndex({ ...raw, kinds: '9'.repeat(30) }, 'demo'), /damaged/);
  // An HTML page where a JSON file should be (a host's fallback) is just as wrong.
  assert.throws(() => decodeIndex('<!doctype html>', 'demo'), /not the index/);
});

test('a domain with no questions is an index with no shards', () => {
  const out = shardDomain('empty', [], 12);
  assert.equal(out.shards.length, 0);
  assert.equal(decodeIndex(JSON.parse(out.indexBody), 'empty').entries.length, 0);
});

test('a source the index cannot code is refused at build time', () => {
  assert.throws(() => shardDomain('demo', [q('anat', 1, 'rumour')], 12), /unknown source/);
});
