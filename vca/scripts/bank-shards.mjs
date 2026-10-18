// Cuts one domain of the bank into an index and shards (the layout is described in
// src/lib/bank-index.js). Pure: it returns file names and bodies, and build-bank.mjs writes them.
//
// SHARD_SIZE is chosen from what a practice set costs. A set picks its questions at random from a
// domain of hundreds, so each of them lands in a shard of its own: ten questions touch about nine
// shards, fifty about forty-six, and what they cost is shards x shard bytes. On the real bank
// (5,906 questions, 1.7 KB each), by simulating the draw on the built files, brotli level 5:
//
//   questions per shard         5      8     12     25     40
//   one shard                 2.2    3.2    4.5    8.4   12.6 KB
//   ten questions             20     28     38     67     93 KB   (four indexes add 3 to 5 KB)
//   a 50-question mock       100    142    192    334    468 KB   (nineteen indexes add 17 KB)
//   files for the whole bank 1,188    748    501    246    158
//
// And as a phone sees it (390 px, CPU 4x, 4G at 150 ms and 1.6 Mbps, HTTP/2, brotli 11), cold, the
// median of six runs taken in turns with the old build, which fetched whole domains:
//
//                          old              12 a shard       25 a shard
//   ten, from home         2.26 s  317 KB   1.20 s   36 KB   1.29 s   60 KB
//   ten, food-hygiene      1.83 s  225 KB   1.03 s   44 KB   1.07 s   75 KB
//   a 50-question mock     8.37 s 1436 KB   2.00 s  203 KB   2.63 s  314 KB
//
// A start costs about a second that bytes do not touch (two round trips, the page) and 5 ms for
// each KB on top. At 12 a ten-question start is nearly all fixed cost and a mock is a quarter faster
// than at 25. Below 12 a start gains under 10 ms while the whole bank (the bank page's search) costs
// more files and more bytes, since small files compress worse: 748 files at 8, and 2.0 MB at 12
// against 1.8 MB at 25 and 1.4 MB for the old whole-domain files.

import crypto from 'node:crypto';
import { KINDS, shardName } from '../src/lib/bank-index.js';

export const SHARD_SIZE = 12;

const sha = (text) => crypto.createHash('sha256').update(text).digest('hex');

/**
 * @param {string} domainId
 * @param {Array<{ id: number|string, subject: string, topic?: string, kind: string }>} items the domain's records, in bank order
 * @param {number} [size] questions per shard
 * @returns {{
 *   shards: Array<{ name: string, hash: string, body: string }>,
 *   indexName: string, indexBody: string, index: object,
 *   digest: string, bytes: number,
 * }}
 *   `digest` is the first 10 hex digits of the SHA-256 of the one file this domain used to be
 *   written as (`{ domain, questions }`, and the name that file carried), so that the shards can
 *   be proven to hold exactly the same questions: tests/unit/bank-shards.test.mjs does.
 */
export function shardDomain(domainId, items, size = SHARD_SIZE) {
  const digest = sha(JSON.stringify({ domain: domainId, questions: items })).slice(0, 10);

  const shards = [];
  for (let n = 0; n * size < items.length; n += 1) {
    const body = JSON.stringify({ domain: domainId, shard: n, questions: items.slice(n * size, (n + 1) * size) });
    const hash = sha(body).slice(0, 8);
    shards.push({ name: shardName(domainId, n, hash), hash, body });
  }

  const subjects = [];
  const topics = [];
  const subjectAt = new Map();
  const topicAt = new Map();
  const place = (list, at, value) => {
    if (!at.has(value)) { at.set(value, list.length); list.push(value); }
    return at.get(value);
  };
  const subj = [];
  const ids = [];
  const topic = [];
  let kinds = '';
  for (const q of items) {
    const kind = KINDS.indexOf(q.kind);
    if (kind < 0) throw new Error(`${domainId}: question ${q.subject}:${q.id} has the unknown source ${q.kind}`);
    subj.push(place(subjects, subjectAt, q.subject));
    ids.push(q.id);
    topic.push(place(topics, topicAt, q.topic || ''));
    kinds += kind;
  }
  const index = { v: 1, domain: domainId, n: items.length, size, shards: shards.map((s) => s.hash), digest, subjects, topics, subj, ids, kinds, topic };
  const indexBody = JSON.stringify(index);
  const indexName = `${domainId}.index.${sha(indexBody).slice(0, 8)}.json`;

  const bytes = shards.reduce((sum, s) => sum + Buffer.byteLength(s.body), 0);
  return { shards, indexName, indexBody, index, digest, bytes };
}
