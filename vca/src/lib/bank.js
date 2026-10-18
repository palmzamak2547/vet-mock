// The question bank at run time. A domain is an index (every question's key, source, topic and
// place, no text: a few KB) and shards (the full text of 12 questions each); see lib/bank-index.js
// for the layout. Whatever draws a set reads the indexes, picks keys, and fetches only the shards
// that hold the picked questions, so ten questions cost tens of KB where a whole domain used to
// cost megabytes. The bank page reads the first shards for its first view and the rest after.
//
// Every file is content-hashed, so the browser cache and the service worker keep them until the
// bank actually changes. A file that fails is asked for again once, quietly; after that the
// failure reaches the caller, nothing about it is remembered, and the next call asks again.

import { BANK } from '../generated/bank.js';
import { getShuffledOptions } from '@vetmock/lib/option-shuffle.js';
import { lazyModule } from './lazy-module.js';
import { decodeIndex } from './bank-index.js';

export { BANK };
export const DOMAIN_CARDS = BANK.domains;
export const CARD_BY_ID = Object.fromEntries(BANK.domains.map((d) => [d.id, d]));
export const qKey = (q) => `${q.subject}:${q.id}`;

/** @typedef {import('./bank-index.js').Entry} Entry */

const indexes = new Map(); // domain id -> decoded index
const indexPending = new Map(); // domain id -> Promise<decoded index>
const shardPending = new Map(); // shard url -> Promise<void>, while it is on its way
const shardLoaded = new Set(); // shard urls whose questions are in byKey
const byKey = new Map(); // "subject:id" -> question (with key and domain), once its shard is in

async function fetchJson(url, attempt = 0) {
  try {
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error(`${url} answered ${res.status}`);
    return await res.json();
  } catch (err) {
    // One quiet retry covers a dropped connection; after that the page offers its own.
    if (attempt < 1) {
      await new Promise((r) => setTimeout(r, 600));
      return fetchJson(url, attempt + 1);
    }
    throw err;
  }
}

/** A domain's index: its entries in bank order, the shard each is in and a lookup by key. */
export function loadIndex(id) {
  if (indexes.has(id)) return Promise.resolve(indexes.get(id));
  if (indexPending.has(id)) return indexPending.get(id);
  const card = CARD_BY_ID[id];
  if (!card) return Promise.reject(new Error(`no domain ${id}`));
  // Whatever happens, the attempt stops being "pending": a failure (a network error, or a file that
  // is not this domain's index) is handed to the caller and not kept for the next one.
  const p = fetchJson(card.index).then((raw) => {
    const index = decodeIndex(raw, id);
    indexes.set(id, index);
    return index;
  }).finally(() => { indexPending.delete(id); });
  indexPending.set(id, p);
  return p;
}

/**
 * Every entry of some domains, in the order given and then bank order: all a set needs to filter
 * and draw. Loads the indexes, no question text.
 * @param {string[]} ids
 * @returns {Promise<Entry[]>}
 */
export async function loadEntries(ids) {
  const lists = await Promise.all([...new Set(ids)].map(loadIndex));
  return lists.flatMap((ix) => ix.entries);
}

/** Fetches one shard and files its questions under their keys. Shared by everything asking for it. */
function loadShard(ref, domain) {
  if (shardLoaded.has(ref.url)) return Promise.resolve();
  if (shardPending.has(ref.url)) return shardPending.get(ref.url);
  const p = fetchJson(ref.url).then((body) => {
    const list = body?.questions;
    if (!Array.isArray(list) || list.length !== ref.count) throw new Error(`${ref.url} is not shard ${ref.n} of ${domain}`);
    for (const q of list) {
      const question = { ...q, key: qKey(q), domain };
      byKey.set(question.key, question);
    }
    shardLoaded.add(ref.url);
  }).finally(() => { shardPending.delete(ref.url); });
  shardPending.set(ref.url, p);
  return p;
}

const shardOf = (entry) => indexes.get(entry.domain).shards[entry.shard];

/**
 * Brings the text of some entries in: fetches the distinct shards that hold them, all at once.
 * Resolves to the questions in the order of the entries; `onProgress(done, total)` counts entries
 * whose shard has arrived.
 * @param {Entry[]} entries
 * @param {(done: number, total: number) => void} [onProgress]
 */
export async function loadQuestions(entries, onProgress) {
  const wanted = new Map(); // shard url -> { ref, domain, count of entries asked for in it }
  for (const e of entries) {
    const ref = shardOf(e);
    if (shardLoaded.has(ref.url)) continue;
    const at = wanted.get(ref.url);
    if (at) at.n += 1; else wanted.set(ref.url, { ref, domain: e.domain, n: 1 });
  }
  const total = entries.length;
  let done = total - [...wanted.values()].reduce((sum, w) => sum + w.n, 0);
  onProgress?.(done, total);
  await Promise.all([...wanted.values()].map((w) => loadShard(w.ref, w.domain).then(() => {
    done += w.n;
    onProgress?.(done, total);
  })));
  return entries.map((e) => byKey.get(e.key) || null);
}

const knownDomains = (items) => [...new Set(items.map((it) => it.domain))].filter((id) => CARD_BY_ID[id]);

/** The entries behind some items ({ key, domain }) of a set or a result. Withdrawn keys have none. */
async function entriesOf(items) {
  await Promise.all(knownDomains(items).map(loadIndex));
  return items.map((it) => indexes.get(it.domain)?.byKey.get(it.key)).filter(Boolean);
}

/**
 * Makes the questions behind a set's or a result's items readable with questionByKey. An item
 * whose key the bank no longer lists is skipped (questionByKey finds nothing for it); so is one
 * of a domain this build does not have.
 * @param {Array<{ key: string, domain: string }>} items
 */
export async function loadItems(items, onProgress) {
  await loadQuestions(await entriesOf(items), onProgress);
}

/** True when everything loadItems would fetch is already here, so a page can start ready. */
export function itemsReady(items) {
  return items.every((it) => {
    const ix = indexes.get(it.domain);
    if (!ix) return !CARD_BY_ID[it.domain];
    const entry = ix.byKey.get(it.key);
    return !entry || shardLoaded.has(ix.shards[entry.shard].url);
  });
}

/** True when the domain's index is here and no longer lists the key: withdrawn since a set was made. */
export const isWithdrawn = (domain, key) => {
  const ix = indexes.get(domain);
  return !!ix && !ix.byKey.has(key);
};

export const questionByKey = (key) => byKey.get(key) || null;

/** A question by its number in a domain, the way a community thread names it; null when it is not there. */
export async function loadQuestionByNumber(domain, no) {
  const index = await loadIndex(domain);
  const entry = index.entries.find((e) => String(e.id) === String(no));
  if (!entry) return null;
  const [q] = await loadQuestions([entry]);
  return q;
}

/** All of a domain's questions in bank order: its index, then every shard. Nothing in the pages needs a
 *  whole domain at once any more; the bank page reads it in two steps (openBank). */
export async function loadDomain(id) {
  const index = await loadIndex(id);
  return loadQuestions(index.entries);
}

/**
 * The questions of these domains in bank order when every one is already in memory, else null: a
 * page opened a second time in one visit shows at once.
 * @param {string[]} ids
 */
export function peekBank(ids) {
  const list = [];
  for (const id of ids) {
    const ix = indexes.get(id);
    if (!ix || !ix.shards.every((s) => shardLoaded.has(s.url))) return null;
    for (const e of ix.entries) list.push(byKey.get(e.key));
  }
  return list;
}

/**
 * The bank page's view of some domains: `first` is the questions of the first `page` entries that
 * pass `keep` (a few small shards, so the page can show something at once) and `all` every question
 * of the domains in bank order, fetched in that order `parallel` shards at a time after `first`.
 * Every index is asked for at once, but the first page waits only for those it needs, in bank
 * order: usually the first domain's, not the slowest of nineteen. A shard is 4.5 KB and a round trip
 * on a phone is 150 ms, so fetching the rest a few at a time leaves the line idle: on a 4G phone
 * profile 6 at once took 22 s to bring in the whole bank, 24 took 16 s (what its 2.1 MB cost there),
 * and 48 took no less.
 * `cancel()` stops fetching more; shards already on their way still land in the cache.
 * @param {string[]} ids
 * @param {{ page?: number, keep?: (entry: Entry) => boolean, parallel?: number }} [options]
 * @returns {{ first: Promise<object[]>, all: Promise<object[]>, cancel: () => void }}
 */
export function openBank(ids, { page = 30, keep = () => true, parallel = 24 } = {}) {
  let cancelled = false;
  const loading = [...new Set(ids)].map(loadIndex);
  const entries = Promise.all(loading).then((lists) => lists.flatMap((ix) => ix.entries));
  entries.catch(() => {}); // a failure reaches the caller through `all`; a page that left must not leave it loose
  const first = (async () => {
    const picked = [];
    for (const load of loading) {
      for (const e of (await load).entries) {
        if (!keep(e)) continue;
        picked.push(e);
        if (picked.length >= page) return loadQuestions(picked);
      }
    }
    return loadQuestions(picked);
  })();
  // `all` waits for `first`, which keeps the first view's shards at the front of the line.
  const all = first.then(() => entries).then(async (list) => {
    const refs = new Map(); // url -> { ref, domain }, in bank order
    for (const e of list) {
      const ref = shardOf(e);
      if (!shardLoaded.has(ref.url) && !refs.has(ref.url)) refs.set(ref.url, { ref, domain: e.domain });
    }
    const queue = [...refs.values()];
    let next = 0;
    let failed = false;
    const worker = async () => {
      while (!cancelled && !failed && next < queue.length) {
        const { ref, domain } = queue[next];
        next += 1;
        try { await loadShard(ref, domain); } catch (err) { failed = true; throw err; }
      }
    };
    await Promise.all(Array.from({ length: Math.min(parallel, queue.length) }, worker));
    if (cancelled) throw new Error('cancelled');
    return list.map((e) => byKey.get(e.key));
  });
  // A page that left no longer listens: its unfinished fetch must not become an unhandled rejection.
  all.catch(() => {});
  return { first, all, cancel: () => { cancelled = true; } };
}

/** A set item for a question: its key, domain, fixed option order and answer. */
export function toItem(q) {
  return { key: q.key, domain: q.domain, order: getShuffledOptions(q).displayToOriginal, answer: q.answer };
}

export const subjectName = (id) => BANK.subjects[id]?.th || id;

// The two generated modules the pages fetch on demand, each its own chunk. A failed load is not
// kept (a retry asks again, and in Chromium under a fresh address: see lazy-module.js).

/** The topics each domain page lists, the subjects behind each domain and the bank's exclusions. */
export const loadCatalog = lazyModule(() => import('../generated/catalog.js'), (m) => m.CATALOG);

/** The VCA documents, shelved by field: the library page and the domain pages both read it. */
export const loadLibrary = lazyModule(() => import('../generated/library.js'), (m) => m.LIBRARY);
