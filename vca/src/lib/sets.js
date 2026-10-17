// Drawing a set from the bank: which questions qualify, how many from each domain, which ones.

import { mulberry32 } from '@vetmock/lib/option-shuffle.js';

export function seededRandom(seed) {
  if (Number.isFinite(seed)) return mulberry32(seed >>> 0);
  try {
    const buf = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buf);
    return mulberry32(buf[0]);
  } catch {
    return Math.random;
  }
}

/** Fisher-Yates on a copy. */
export function shuffle(list, rand = Math.random) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * How many to draw from each pool: in proportion to the weights (the pools' own sizes unless
 * given), never more than a pool holds, and every pool with something in it gets at least one
 * when n allows. What a full pool cannot take flows to the others by their weights, and a pool
 * weighted 0 is drawn from only when nothing else is left.
 * @param {Record<string, number>} sizes
 * @param {number} n
 * @param {Record<string, number>} [weights]
 * @returns {Record<string, number>}
 */
export function allocate(sizes, n, weights = sizes) {
  const ids = Object.keys(sizes).filter((id) => sizes[id] > 0);
  const available = ids.reduce((sum, id) => sum + sizes[id], 0);
  const want = Math.min(Math.max(0, Math.floor(n)), available);
  const out = Object.fromEntries(ids.map((id) => [id, 0]));
  if (!want) return out;
  if (want >= ids.length) for (const id of ids) out[id] = 1;
  const weight = (id) => Math.max(0, Number(weights[id]) || 0);
  const placed = () => Object.values(out).reduce((a, b) => a + b, 0);
  // Fill by largest remainder; a pool that fills up leaves the round, and the rest share again.
  for (let left = want - placed(); left > 0; left = want - placed()) {
    const open = ids.filter((id) => out[id] < sizes[id] && weight(id) > 0);
    if (!open.length) break;
    const total = open.reduce((sum, id) => sum + weight(id), 0);
    const shares = open.map((id) => {
      const exact = (weight(id) / total) * left;
      return { id, floor: Math.floor(exact), frac: exact - Math.floor(exact) };
    });
    let moved = 0;
    for (const sh of shares) {
      const take = Math.min(sh.floor, sizes[sh.id] - out[sh.id]);
      out[sh.id] += take; moved += take;
    }
    let rest = want - placed();
    shares.sort((a, b) => b.frac - a.frac || weight(b.id) - weight(a.id) || a.id.localeCompare(b.id));
    for (const sh of shares) {
      if (rest <= 0) break;
      if (out[sh.id] < sizes[sh.id]) { out[sh.id] += 1; rest -= 1; moved += 1; }
    }
    if (!moved) break;
  }
  // Pools weighted 0 last, largest first, until the set is full.
  const spare = ids.filter((id) => out[id] < sizes[id]).sort((a, b) => sizes[b] - sizes[a] || a.localeCompare(b));
  for (const id of spare) {
    const left = want - placed();
    if (left <= 0) break;
    out[id] += Math.min(left, sizes[id] - out[id]);
  }
  return out;
}

/**
 * The questions a set may use.
 * @param {Array} questions loaded questions (each with key and domain)
 * @param {{ source?: 'all'|'vca'|'paper', status?: 'all'|'unseen'|'wrong', topics?: string[]|null, keys?: string[]|null }} filter
 * @param {{ q: Record<string, { l: number }> }} progress
 */
export function eligible(questions, filter = {}, progress = { q: {} }) {
  const { source = 'all', status = 'all', topics = null, keys = null } = filter;
  const topicSet = topics && topics.length ? new Set(topics) : null;
  const keySet = keys && keys.length ? new Set(keys) : null;
  return questions.filter((q) => {
    if (keySet && !keySet.has(q.key)) return false;
    if (source === 'vca' && q.kind !== 'vca') return false;
    if (source === 'paper' && q.kind !== 'paper' && q.kind !== 'vca') return false;
    if (topicSet && !topicSet.has(`${q.subject}/${q.topic || ''}`)) return false;
    const seen = progress.q[q.key];
    if (status === 'unseen' && seen) return false;
    if (status === 'wrong' && (!seen || seen.l)) return false;
    return true;
  });
}

/**
 * Draw n questions spread across domains, in random order: in proportion to what each domain
 * can offer, or to the weights when given (lib/start.js passes how often the exam asks).
 * @param {Array} pool eligible questions
 * @param {number} n
 * @param {() => number} rand
 * @param {Record<string, number>} [weights]
 */
export function draw(pool, n, rand = Math.random, weights) {
  const byDomain = new Map();
  for (const q of pool) {
    if (!byDomain.has(q.domain)) byDomain.set(q.domain, []);
    byDomain.get(q.domain).push(q);
  }
  const sizes = Object.fromEntries([...byDomain].map(([id, list]) => [id, list.length]));
  const counts = allocate(sizes, n, weights || sizes);
  const picked = [];
  for (const [id, list] of byDomain) picked.push(...shuffle(list, rand).slice(0, counts[id] || 0));
  return shuffle(picked, rand);
}
