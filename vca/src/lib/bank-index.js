// How a domain of the bank is laid out on disk, read from one place by the generator that writes
// it (scripts/bank-shards.mjs) and the loader that reads it (lib/bank.js), so the two cannot drift.
//
// A domain is two kinds of file under /bank/, all content-hashed and cached for good:
//
//   <domain>.index.<hash>.json   every question's key, source, topic and place, with no text
//   <domain>-<n>.<hash>.json     shard n: the full text of SHARD_SIZE consecutive questions
//
// Questions sit in the order the bank lists them (subject, then number), the shards cut that order
// into runs of `size`, and so question number `at` is in shard floor(at / size): the index does not
// have to say. A set picks its questions from the index and fetches only the shards that hold
// them; a search or the full list fetches the shards one after another.

/** The sources a question can come from, as the one-character codes the index stores. */
export const KINDS = ['vca', 'paper', 'aligned', 'lecture', 'course'];

/** The name of a shard's file; `hash` is the first 8 hex digits of its content's SHA-256. */
export const shardName = (domain, n, hash) => `${domain}-${n}.${hash}.json`;
export const shardUrl = (domain, n, hash) => `/bank/${shardName(domain, n, hash)}`;

/**
 * One question of the index: what a set needs to filter, count and draw it, and where its text is.
 * `subject`, `id`, `topic` and `kind` are the fields of the question itself, so the set builder
 * filters entries and loaded questions with the same code.
 * @typedef {{ key: string, domain: string, subject: string, id: number|string, kind: string, topic: string|undefined, at: number, shard: number }} Entry
 * @typedef {{ n: number, url: string, count: number }} ShardRef
 */

/**
 * The index as a page uses it: its entries in bank order, the shard each is in, and a lookup by key.
 * Throws on a file that is not an index for this domain, so a wrong answer from a cache or a proxy
 * is an error (and a retry) rather than a bank with nothing in it.
 * @param {any} raw the parsed index file
 * @param {string} domain the domain it was asked for
 */
export function decodeIndex(raw, domain) {
  if (!raw || raw.v !== 1 || raw.domain !== domain) throw new Error(`not the index of ${domain}`);
  const { n, size } = raw;
  const columns = ['subj', 'ids', 'topic'].every((c) => Array.isArray(raw[c]) && raw[c].length === n) && typeof raw.kinds === 'string' && raw.kinds.length === n;
  if (!Number.isInteger(n) || n < 0 || !Number.isInteger(size) || size < 1 || !columns || !Array.isArray(raw.shards) || raw.shards.length !== Math.ceil(n / size)) {
    throw new Error(`the index of ${domain} is damaged`);
  }
  /** @type {Entry[]} */
  const entries = new Array(n);
  const byKey = new Map();
  for (let at = 0; at < n; at += 1) {
    const subject = raw.subjects[raw.subj[at]];
    const kind = KINDS[Number(raw.kinds[at])];
    if (subject === undefined || kind === undefined) throw new Error(`the index of ${domain} is damaged`);
    const id = raw.ids[at];
    const entry = { key: `${subject}:${id}`, domain, subject, id, kind, topic: raw.topics[raw.topic[at]] || undefined, at, shard: Math.floor(at / size) };
    entries[at] = entry;
    byKey.set(entry.key, entry);
  }
  /** @type {ShardRef[]} */
  const shards = raw.shards.map((hash, i) => ({ n: i, url: shardUrl(domain, i, hash), count: Math.min(size, n - i * size) }));
  return { domain, n, size, digest: raw.digest, entries, byKey, shards };
}
