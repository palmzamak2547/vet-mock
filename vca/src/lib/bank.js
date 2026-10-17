// The question bank at run time: one JSON file per domain, fetched when a set or a page needs
// it and kept for the page's life. The files are content-hashed, so the browser cache keeps them
// until the bank actually changes.

import { BANK } from '../generated/bank.js';
import { getShuffledOptions } from '@vetmock/lib/option-shuffle.js';

export { BANK };
export const DOMAIN_CARDS = BANK.domains;
export const CARD_BY_ID = Object.fromEntries(BANK.domains.map((d) => [d.id, d]));
export const qKey = (q) => `${q.subject}:${q.id}`;

const loaded = new Map(); // domain id -> questions[]
const pending = new Map(); // domain id -> Promise<questions[]>
const byKey = new Map(); // "subject:id" -> question

async function fetchDomain(card, attempt = 0) {
  try {
    const res = await fetch(card.file, { credentials: 'omit' });
    if (!res.ok) throw new Error(`${card.file} answered ${res.status}`);
    const body = await res.json();
    if (!Array.isArray(body?.questions)) throw new Error(`${card.file} is not a question list`);
    return body.questions;
  } catch (err) {
    // One quiet retry covers a dropped connection; after that the page offers its own.
    if (attempt < 1) {
      await new Promise((r) => setTimeout(r, 600));
      return fetchDomain(card, attempt + 1);
    }
    throw err;
  }
}

/** @returns {Promise<Array>} the domain's questions, each with key and domain */
export function loadDomain(id) {
  if (loaded.has(id)) return Promise.resolve(loaded.get(id));
  if (pending.has(id)) return pending.get(id);
  const card = CARD_BY_ID[id];
  if (!card) return Promise.reject(new Error(`no domain ${id}`));
  const p = fetchDomain(card).then((list) => {
    const questions = list.map((q) => ({ ...q, key: qKey(q), domain: id }));
    for (const q of questions) byKey.set(q.key, q);
    loaded.set(id, questions);
    pending.delete(id);
    return questions;
  }, (err) => {
    pending.delete(id);
    throw err;
  });
  pending.set(id, p);
  return p;
}

/**
 * Load several domains, reporting each one that arrives.
 * @param {string[]} ids
 * @param {(done: number, total: number) => void} [onProgress]
 */
export async function loadDomains(ids, onProgress) {
  const unique = [...new Set(ids)];
  let done = 0;
  onProgress?.(0, unique.length);
  const lists = await Promise.all(unique.map((id) => loadDomain(id).then((list) => {
    done += 1;
    onProgress?.(done, unique.length);
    return list;
  })));
  return lists.flat();
}

export const isLoaded = (id) => loaded.has(id);
export const questionByKey = (key) => byKey.get(key) || null;

/** A set item for a question: its key, domain, fixed option order and answer. */
export function toItem(q) {
  return { key: q.key, domain: q.domain, order: getShuffledOptions(q).displayToOriginal, answer: q.answer };
}

export const subjectName = (id) => BANK.subjects[id]?.th || id;

/** Topic names, per-domain topic lists and the bank's exclusions: a separate chunk. */
let catalog = null;
export function loadCatalog() {
  catalog ??= import('../generated/catalog.js').then((m) => m.CATALOG);
  return catalog;
}
