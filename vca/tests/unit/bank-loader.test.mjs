// The loader that turns the index and the shards into questions (src/lib/bank.js): it asks the
// network for the least that answers the question put to it, asks for nothing twice, and a file
// that failed is asked for again and never remembered. Each test takes its own copy of the module
// (a fresh page), so what one has loaded does not answer for another; fetch is a stand-in that
// reads public/bank and counts what it is asked.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBankFetch, readDomain, readText } from '../support/bank-files.mjs';

let copies = 0;
/** A fresh copy of the loader, as a page just opened would have. */
const fresh = () => import(`../../src/lib/bank.js?page=${copies++}`);
const { BANK } = await import('../../src/generated/bank.js');
const card = (id) => BANK.domains.find((d) => d.id === id);
const files = (net) => ({ indexes: net.calls.filter((u) => u.includes('.index.')), shards: net.calls.filter((u) => !u.includes('.index.')) });
/** Domains by size, largest first: tests pick by size, never by an id whose size may change. */
const bySize = BANK.domains.slice().sort((a, b) => b.count - a.count);

test('entries cost one small file per domain and no question text', async () => {
  const net = installBankFetch();
  try {
    const bank = await fresh();
    const entries = await bank.loadEntries(['swine', 'equine', 'swine']);
    assert.equal(entries.length, card('swine').count + card('equine').count);
    assert.deepEqual(entries.slice(0, card('swine').count).map((e) => e.domain), Array(card('swine').count).fill('swine'));
    assert.equal(files(net).indexes.length, 2, 'a domain named twice is read once');
    assert.equal(files(net).shards.length, 0);
    const bytes = net.calls.reduce((n, u) => n + Buffer.byteLength(readText(u)), 0);
    assert.ok(bytes < 12_000, `two indexes are ${bytes} bytes`);
    await bank.loadEntries(['swine']);
    assert.equal(net.calls.length, 2, 'an index already read is not read again');
  } finally { net.restore(); }
});

test('the text of some entries is the shards that hold them, once each', async () => {
  const net = installBankFetch();
  try {
    const bank = await fresh();
    const entries = await bank.loadEntries(['avian']);
    // One from each end and one in the middle: three shards.
    const asked = [entries[0], entries[1], entries[Math.floor(entries.length / 2)], entries.at(-1)];
    const seen = [];
    const questions = await bank.loadQuestions(asked, (done, total) => seen.push([done, total]));
    assert.equal(files(net).shards.length, new Set(asked.map((e) => e.shard)).size);
    assert.deepEqual(questions.map((q) => q.key), asked.map((e) => e.key), 'in the order asked');
    assert.ok(questions.every((q) => q.domain === 'avian' && typeof q.q === 'string' && Array.isArray(q.options)));
    assert.deepEqual(seen.at(-1), [4, 4], 'progress counts the questions');
    assert.ok(seen.every(([done, total]) => total === 4 && done <= 4));
    assert.equal(bank.questionByKey(asked[3].key).q, questions[3].q);
    // The same again, and the neighbours that share a loaded shard, cost nothing.
    const before = net.calls.length;
    await bank.loadQuestions(asked);
    await bank.loadQuestions([entries[2], entries[3]]);
    assert.equal(net.calls.length, before);
  } finally { net.restore(); }
});

test('two callers asking for the same shard at once share one fetch', async () => {
  const net = installBankFetch();
  try {
    const bank = await fresh();
    const entries = await bank.loadEntries([bySize.find((d) => d.count >= 5).id]);
    await Promise.all([bank.loadQuestions(entries.slice(0, 3)), bank.loadQuestions(entries.slice(2, 5)), bank.loadQuestions(entries.slice(0, 1))]);
    assert.equal(files(net).shards.length, 1);
  } finally { net.restore(); }
});

test('a whole domain is its index and every shard, in bank order', async () => {
  const net = installBankFetch();
  try {
    const bank = await fresh();
    const list = await bank.loadDomain('juris');
    const want = readDomain(card('juris')).questions;
    assert.deepEqual(list.map(({ key, domain, ...q }) => q), want);
    assert.ok(list.every((q) => q.domain === 'juris' && q.key === `${q.subject}:${q.id}`));
    assert.equal(files(net).shards.length, card('juris').shards);
  } finally { net.restore(); }
});

test('items of a set: their shards only, a withdrawn key and an unknown domain skipped', async () => {
  const net = installBankFetch();
  try {
    const first = await fresh();
    const [a, b] = [bySize[0].id, bySize[1].id];
    const entries = await first.loadEntries([a, b]);
    const n = entries.length;
    const picked = [entries[3], entries[Math.floor(n / 3)], entries[Math.floor((2 * n) / 3)], entries.at(-1)];
    const items = picked.map((e) => ({ key: e.key, domain: e.domain }));
    const gone = { key: 'vca:0', domain: a };
    const lost = { key: 'vca:1', domain: 'not-a-domain' };

    // A page reopened on a set kept from before: nothing loaded, so it is not ready.
    net.calls.length = 0;
    const page = await fresh();
    assert.equal(page.itemsReady(items), false);
    await page.loadItems([...items, gone, lost]);
    assert.equal(page.itemsReady([...items, gone, lost]), true);
    assert.equal(files(net).indexes.length, 2, 'the indexes of the two domains it draws from');
    assert.equal(files(net).shards.length, new Set(picked.map((e) => `${e.domain}${e.shard}`)).size, 'and the shards holding its questions');
    for (const e of picked) assert.equal(page.questionByKey(e.key)?.key, e.key);
    // A key the bank no longer lists is gone; one in an unknown domain is not claimed to be.
    assert.equal(page.isWithdrawn(a, gone.key), true);
    assert.equal(page.isWithdrawn(items[3].domain, items[3].key), false);
    assert.equal(page.isWithdrawn('not-a-domain', lost.key), false);
    assert.equal(page.questionByKey(gone.key), null);
    // Ready is asked without a network: the pages read it for their first frame.
    const before = net.calls.length;
    assert.equal(page.itemsReady(items), true);
    assert.equal(net.calls.length, before);
  } finally { net.restore(); }
});

test('a question by its number, the way a community thread names it', async () => {
  const net = installBankFetch();
  try {
    const bank = await fresh();
    const { questions } = readDomain(card('swine'));
    // The old lookup: the first question of the domain whose id matches, whatever its subject.
    for (const want of [questions[0], questions[questions.length >> 1], questions.at(-1)]) {
      net.calls.length = 0;
      const got = await bank.loadQuestionByNumber('swine', String(want.id));
      assert.equal(got.q, questions.find((x) => String(x.id) === String(want.id)).q);
      assert.ok(files(net).shards.length <= 1, 'one shard at most');
    }
    net.calls.length = 0;
    assert.equal(await bank.loadQuestionByNumber('swine', 'no-such-number'), null);
    assert.equal(files(net).shards.length, 0, 'a number that is not there costs no shard');
    await assert.rejects(bank.loadQuestionByNumber('no-such-domain', 1), /no domain/);
  } finally { net.restore(); }
});

test('a shard that is not the one asked for, or short, is an error and is not remembered', async () => {
  const net = installBankFetch();
  try {
    const bank = await fresh();
    const entries = await bank.loadEntries(['exotic']);
    const url = (await bank.loadIndex('exotic')).shards[0].url;
    const real = globalThis.fetch;
    globalThis.fetch = async (u) => {
      if (String(u) !== url) return real(u);
      const body = JSON.parse(readText(url));
      return { ok: true, status: 200, json: async () => ({ ...body, questions: body.questions.slice(1) }) };
    };
    await assert.rejects(bank.loadQuestions([entries[0]]), /is not shard 0 of exotic/);
    globalThis.fetch = real;
    const [q] = await bank.loadQuestions([entries[0]]);
    assert.equal(q.key, entries[0].key, 'the next call asks again and gets the whole shard');
  } finally { net.restore(); }
});

// ── the bank page's two steps ───────────────────────────────────────────────────────────────

test('openBank: the first page from a few small shards, then everything in bank order', async () => {
  const net = installBankFetch();
  const inner = globalThis.fetch;
  // The rest of the shards wait for the test's say-so, so "not everything is in yet" is a fact, not a race.
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  let firstThree = [];
  globalThis.fetch = async (u) => {
    if (!String(u).includes('.index.') && !firstThree.includes(String(u))) await gate;
    return inner(u);
  };
  try {
    const bank = await fresh();
    // A first domain with more than three shards and a second one: picked by size.
    const [a, b] = [bySize[0], bySize.at(-1)];
    assert.ok(a.shards > 3 && a !== b, 'the bank has the sizes this needs');
    firstThree = (await bank.loadIndex(a.id)).shards.slice(0, 3).map((s) => s.url);
    const view = bank.openBank([a.id, b.id], { page: 30 });
    const first = await view.first;
    assert.equal(first.length, 30, 'the first page');
    assert.deepEqual(first.map((q) => q.key), (await bank.loadEntries([a.id])).slice(0, 30).map((e) => e.key));
    // The first page is asked for first, and from three shards of twelve; the rest follows it.
    assert.deepEqual(files(net).shards.slice(0, 3), firstThree);
    assert.equal(bank.peekBank([a.id, b.id]), null, 'not everything is in yet');
    release();
    const all = await view.all;
    const want = [...readDomain(card(a.id)).questions, ...readDomain(card(b.id)).questions];
    assert.deepEqual(all.map(({ key, domain, ...q }) => q), want);
    assert.equal(files(net).shards.length, a.shards + b.shards, 'each shard once');
    assert.equal(bank.peekBank([a.id, b.id]).length, want.length, 'and now a page opened again shows at once');
  } finally { release(); globalThis.fetch = inner; net.restore(); }
});

test('openBank: the first page waits only for the indexes it needs', async () => {
  const net = installBankFetch();
  const inner = globalThis.fetch;
  // The second domain's index is held back. A page that the first domain fills does not wait for it;
  // one that needs more than the first domain has does. Picked by size: the held domain is the
  // largest, the filling one holds 30 or more, the short one fewer than 50.
  const held = bySize[0];
  const filling = bySize.find((d) => d !== held && d.count >= 30);
  const short = bySize.slice().reverse().find((d) => d !== held && d.count < 50);
  assert.ok(filling && short && held.count >= 50 - short.count, 'the bank has the sizes this needs');
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  globalThis.fetch = async (u) => {
    if (String(u).includes(`/${held.id}.index.`)) await gate;
    return inner(u);
  };
  const state = (promise) => Promise.race([promise.then(() => 'done'), new Promise((resolve) => setTimeout(() => resolve('waiting'), 40))]);
  try {
    const bank = await fresh();
    const small = bank.openBank([filling.id, held.id], { page: 30 });
    assert.equal(await state(small.first), 'done', `${filling.id} alone fills the page`);
    assert.equal((await small.first).length, 30);
    small.cancel();
    small.all.catch(() => {});

    const large = bank.openBank([short.id, held.id], { page: 50 });
    assert.equal(await state(large.first), 'waiting', `${short.id} has ${short.count} questions, so the page needs ${held.id}'s index`);
    release();
    const first = await large.first;
    assert.deepEqual(first.map((q) => q.domain), [...Array(short.count).fill(short.id), ...Array(50 - short.count).fill(held.id)], 'in bank order');
    const all = await large.all;
    assert.equal(all.length, short.count + held.count);
  } finally { release(); globalThis.fetch = inner; net.restore(); }
});

test('openBank: the first page of a source is the first questions of that source', async () => {
  const net = installBankFetch();
  try {
    const bank = await fresh();
    const withVca = BANK.domains.find((d) => d.kinds.vca >= 10).id;
    const view = bank.openBank([withVca], { page: 10, keep: (e) => e.kind === 'vca' });
    const first = await view.first;
    assert.equal(first.length, 10);
    const wantKeys = (await bank.loadEntries([withVca])).filter((e) => e.kind === 'vca').slice(0, 10).map((e) => e.key);
    assert.deepEqual(first.map((q) => q.key), wantKeys, 'exactly the entries asked for');
    assert.ok(first.every((q) => q.kind === 'vca'));
    view.cancel();
    await view.all.catch(() => {});
  } finally { net.restore(); }
});

test('openBank: a few shards at a time, and cancelling stops the rest', async () => {
  let open = 0;
  let most = 0;
  const net = installBankFetch();
  const inner = globalThis.fetch;
  globalThis.fetch = async (u) => {
    if (String(u).includes('.index.')) return inner(u);
    open += 1;
    most = Math.max(most, open);
    await new Promise((r) => setTimeout(r, 4));
    open -= 1;
    return inner(u);
  };
  try {
    const bank = await fresh();
    const big = bySize[0].id;
    const view = bank.openBank([big], { page: 30, parallel: 4 });
    await view.first;
    const asked = () => net.calls.filter((u) => !u.includes('.index.')).length;
    const at = asked();
    view.cancel();
    await assert.rejects(view.all, /cancelled/);
    await new Promise((r) => setTimeout(r, 50));
    assert.ok(asked() < card(big).shards, `stopped after ${asked()} of ${card(big).shards} shards`);
    assert.ok(asked() - at <= 4, 'at most the ones already on their way');
    assert.ok(most <= 4, `${most} at once`);
    // The next page picks up what the cancelled one did not get to.
    const again = bank.openBank([big], { page: 30, parallel: 4 });
    const all = await again.all;
    assert.equal(all.length, card(big).count);
    assert.ok(most <= 4);
  } finally { globalThis.fetch = inner; net.restore(); }
});

test('openBank: a shard that fails fails the rest only, keeps the first page, and the next try finishes', async () => {
  let broken = true;
  let target = null;
  const net = installBankFetch({ fail: (u) => broken && u === target });
  try {
    const bank = await fresh();
    // The largest domain, with its last shard broken: past the three the first page reads.
    const other = bySize[0].id;
    const ix = await bank.loadIndex(other);
    assert.ok(ix.shards.length > 3, `${other} has more shards than a first page reads`);
    target = ix.shards.at(-1).url;
    const view = bank.openBank([other], { page: 30 });
    assert.equal((await view.first).length, 30, 'the first page does not need the broken shard');
    await assert.rejects(view.all, /network down/);
    assert.equal(bank.peekBank([other]), null);
    broken = false;
    const again = await bank.openBank([other], { page: 30 }).all;
    assert.equal(again.length, card(other).count);
    assert.equal(net.calls.filter((u) => u === ix.shards[0].url).length, 1, 'what had arrived is not fetched again');
  } finally { net.restore(); }
});

test('openBank: a domain that is not there fails both steps', async () => {
  const net = installBankFetch();
  try {
    const bank = await fresh();
    const view = bank.openBank(['nowhere']);
    await assert.rejects(view.first, /no domain/);
    await assert.rejects(view.all, /no domain/);
  } finally { net.restore(); }
});
