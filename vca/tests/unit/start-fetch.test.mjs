// What starting a set asks of the network. A set is drawn from the indexes and only the text of
// the questions drawn is fetched; it used to be every question of every domain it drew from
// (about 2 MB for a quick start, 10 MB for a mock). Cold, in one process, so the first test sees a
// page that has loaded nothing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBankFetch, readDomain, readText } from '../support/bank-files.mjs';

const net = installBankFetch();
const { startSet, quickStart, ALL_DOMAINS } = await import('../../src/lib/start.js');
const { BANK, loadEntries, questionByKey } = await import('../../src/lib/bank.js');
const { progressStore, emptyProgress } = await import('../../src/lib/progress.js');

const cards = Object.fromEntries(BANK.domains.map((d) => [d.id, d]));
/** Domains by size, largest first: the tests pick by size, never by an id whose size may change. */
const bySize = BANK.domains.slice().sort((a, b) => b.count - a.count);
const whole = BANK.domains.reduce((sum, d) => sum + d.bytes, 0);
const asked = () => ({ indexes: net.calls.filter((u) => u.includes('.index.')), shards: net.calls.filter((u) => !u.includes('.index.')) });
const bytesOf = (urls) => urls.reduce((sum, u) => sum + Buffer.byteLength(readText(u)), 0);

// The files as the build wrote them, read here without the loader under test.
const onDisk = {};
const disk = (card) => (onDisk[card.id] ??= readDomain(card));
/** The shard file that holds a question, by key. */
const shardOfKey = async (key) => {
  const ix = BANK.domains.map((d) => disk(d).index).find((index) => index.byKey.has(key));
  return ix.shards[ix.byKey.get(key).shard].url;
};

test('a quick start of ten reads four small indexes and the shards of its ten questions', async () => {
  progressStore.set(emptyProgress());
  const res = await quickStart();
  assert.equal(res.ok, true);
  const items = res.session.items;
  assert.equal(items.length, 10);
  const { indexes, shards } = asked();
  const domains = new Set(items.map((it) => it.domain));
  assert.equal(indexes.length, 4, 'one index for each of the four domains it draws from');
  assert.equal(domains.size <= 4, true);
  const wanted = new Set(await Promise.all(items.map((it) => shardOfKey(it.key))));
  assert.deepEqual(new Set(shards), wanted, 'exactly the shards that hold the ten questions');
  assert.ok(shards.length <= 10);
  // The most it could ever cost, whichever ten questions were drawn: the ten largest shards and the
  // four largest indexes. A domain whole is 2 MB and more, and a mock used to be the whole 9.9 MB.
  const sizes = (urls) => urls.map((u) => Buffer.byteLength(readText(u))).sort((a, b) => b - a);
  const everyFile = BANK.domains.flatMap((d) => [d.index, ...disk(d).index.shards.map((s) => s.url)]);
  const most = sizes(everyFile.filter((u) => u.includes('.index.'))).slice(0, 4).reduce((a, b) => a + b, 0)
    + sizes(everyFile.filter((u) => !u.includes('.index.'))).slice(0, 10).reduce((a, b) => a + b, 0);
  const bytes = bytesOf(net.calls);
  assert.ok(bytes <= most, `${bytes} bytes fetched, at most ${most} possible`);
  // Against the bank: never more than the ten largest shards and four largest indexes, which is a
  // part of the whole however large the bank grows (it was 7% of 9.9 MB when it held 5,906 questions).
  assert.ok(most < whole, `the worst start (${most}) is less than the whole bank (${whole})`);
});

test('a mock of fifty over every domain reads nineteen indexes and only the shards it uses', async () => {
  net.calls.length = 0;
  progressStore.set(emptyProgress());
  const progress = [];
  const res = await startSet({ mode: 'mock', size: 50, onProgress: (done, total) => progress.push([done, total]) });
  assert.equal(res.session.items.length, 50);
  assert.equal(new Set(res.session.items.map((it) => it.key)).size, 50);
  const { indexes, shards } = asked();
  assert.equal(indexes.length, ALL_DOMAINS.length - 4, 'the four indexes read before are not read again');
  const wanted = new Set(await Promise.all(res.session.items.map((it) => shardOfKey(it.key))));
  const fetched = new Set(shards);
  for (const url of fetched) assert.ok(wanted.has(url), `${url} holds none of the fifty`);
  assert.ok(fetched.size <= 50 && fetched.size <= BANK.domains.reduce((n, d) => n + d.shards, 0), `${fetched.size} shards`);
  assert.deepEqual(progress.at(-1), [50, 50], 'progress is counted in questions');
  assert.ok(progress.every(([done, total]) => done <= total));
});

test('retrying what was missed fetches the shards of those questions and no other', async () => {
  net.calls.length = 0;
  const two = [bySize[0].id, bySize.at(-1).id];
  const entries = await loadEntries(two);
  const missed = [entries[0], entries[Math.floor(entries.length / 2)], entries.at(-1)];
  const res = await startSet({ mode: 'practice', domains: two, keys: missed.map((e) => e.key), size: 3, label: 'ฝึกข้อที่พลาด' });
  assert.deepEqual(res.session.items.map((it) => it.key).sort(), missed.map((e) => e.key).sort());
  const { shards } = asked();
  const wanted = new Set(await Promise.all(missed.map((e) => shardOfKey(e.key))));
  for (const url of shards) assert.ok(wanted.has(url), `${url} was not asked for`);
});

test('a domain that was never asked for costs nothing', async () => {
  // One that no earlier test drew from: the smallest domain the quick start and the mock left alone.
  const read = new Set(net.calls.filter((u) => u.includes('.index.')).map((u) => u.split('/').pop().split('.')[0]));
  const card = bySize.slice().reverse().find((d) => !read.has(d.id)) || bySize.at(-1);
  const before = net.calls.length;
  const res = await startSet({ mode: 'practice', size: 10, domains: [card.id] });
  assert.equal(res.ok, true);
  const touched = net.calls.slice(before);
  assert.ok(touched.every((u) => u.includes(`/${card.id}`)), `only ${card.id} files`);
  assert.ok(touched.length <= 1 + Math.min(10, card.shards), 'its index and at most the shards of ten questions');
});

test('a start that cannot load says so and leaves no session behind', async () => {
  const { sessionStore } = await import('../../src/lib/session.js');
  sessionStore.set(null);
  // A question whose shard no earlier test has fetched, so there is something to fail.
  const entries = await loadEntries(bySize.map((d) => d.id));
  const fresh = entries.find((e) => !questionByKey(e.key));
  assert.ok(fresh, 'a question no earlier test loaded');
  const ask = () => startSet({ mode: 'practice', size: 1, domains: [fresh.domain], keys: [fresh.key] });
  net.fail = (u) => u.includes('/bank/') && !u.includes('.index.');
  try {
    await assert.rejects(ask(), /network down/);
    assert.equal(sessionStore.get(), null, 'nothing was stored');
  } finally {
    net.fail = () => false;
  }
  const again = await ask();
  assert.equal(again.ok, true, 'and the next try goes through');
  assert.deepEqual(again.session.items.map((it) => it.key), [fresh.key]);
});
