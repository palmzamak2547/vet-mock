// The bank as the build wrote it, read straight from public/bank (no network), for tests that
// look at what the site ships: a domain's index and the shards behind it, and a stand-in for
// fetch() that answers the loader's requests from those files and can be told to fail.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeIndex } from '../../src/lib/bank-index.js';

export const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const PUBLIC = path.join(APP, 'public');

export const readText = (url) => fs.readFileSync(path.join(PUBLIC, url), 'utf8');

const read = new Map();

/**
 * One domain as the files hold it: the index (raw and decoded), each shard's text, and the
 * questions in bank order, as the old single file for the domain listed them. Read once per
 * process, so a test file may ask for the same domain in every test.
 * @param {{ id: string, index: string }} card
 */
export function readDomain(card) {
  if (!read.has(card.index)) read.set(card.index, readDomainFiles(card));
  return read.get(card.index);
}

function readDomainFiles(card) {
  const indexText = readText(card.index);
  const raw = JSON.parse(indexText);
  const index = decodeIndex(raw, card.id);
  const shardTexts = index.shards.map((s) => readText(s.url));
  const questions = shardTexts.flatMap((text) => JSON.parse(text).questions);
  return { id: card.id, raw, index, indexText, shardTexts, questions, body: { domain: card.id, questions } };
}

/**
 * Replaces globalThis.fetch with one that answers /bank/... from public/ the way the host does.
 * `fail(url)` may return true to make a request throw as a dropped connection would, or a status
 * number to answer with it; `calls` records every url asked for.
 * @param {{ fail?: (url: string) => boolean | number | undefined }} [options]
 */
export function installBankFetch({ fail = () => false } = {}) {
  const real = globalThis.fetch;
  const state = { calls: [], fail, restore: () => { globalThis.fetch = real; } };
  globalThis.fetch = async (url) => {
    const asked = String(url);
    state.calls.push(asked);
    const verdict = state.fail(asked);
    if (verdict === true) throw new TypeError('network down');
    if (typeof verdict === 'number') return { ok: false, status: verdict, json: async () => null };
    const file = path.join(PUBLIC, asked);
    if (!fs.existsSync(file)) return { ok: false, status: 404, json: async () => null };
    const text = fs.readFileSync(file, 'utf8');
    return { ok: true, status: 200, json: async () => JSON.parse(text) };
  };
  return state;
}
