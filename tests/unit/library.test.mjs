import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import {
  LIBRARY_KINDS,
  canStream,
  cdnUrlFor,
  filterIndexed,
  formatBytes,
  indexDocs,
  isSafeStorageKey,
  kindLabel,
  normalizeCdnBase,
} from '../../src/lib/library.js';
import { hashFile } from '../../src/lib/pdf-annotations.js';

const doc = (over = {}) => ({
  id: 'id-1',
  slug: 'doc-1',
  title: 'Cardiac physiology handout',
  description: 'ระบบหัวใจและหลอดเลือด',
  kind: 'handout',
  subject: 'com5',
  year: 5,
  topics: ['cardio', 'ecg'],
  storage_provider: 'r2',
  storage_bucket: 'library-docs',
  storage_key: 'docs/5bc3744aa1c8635c/cardiac.pdf',
  mime: 'application/pdf',
  byte_size: 4 * 1024 * 1024,
  sha256_16: '5bc3744aa1c8635c',
  linearized: true,
  license: 'internal-original',
  status: 'public',
  ...over,
});

test('CDN base must be an absolute https origin', () => {
  assert.equal(normalizeCdnBase('https://files.example.com/'), 'https://files.example.com');
  assert.equal(normalizeCdnBase('https://files.example.com///'), 'https://files.example.com');
  // A base that silently became relative would resolve every object URL
  // against the app origin and 404 on each open.
  assert.equal(normalizeCdnBase('/files'), '');
  assert.equal(normalizeCdnBase('files.example.com'), '');
  // Plaintext http would downgrade every download on an HSTS-preloaded site.
  assert.equal(normalizeCdnBase('http://files.example.com'), '');
  assert.equal(normalizeCdnBase(''), '');
  assert.equal(normalizeCdnBase(undefined), '');
});

test('storage keys carrying traversal or whitespace are rejected', () => {
  assert.equal(isSafeStorageKey('docs/abc123/file.pdf'), true);
  assert.equal(isSafeStorageKey('/docs/abc/file.pdf'), false, 'leading slash escapes the prefix');
  assert.equal(isSafeStorageKey('docs/../../etc/passwd'), false);
  assert.equal(isSafeStorageKey('docs//file.pdf'), false);
  assert.equal(isSafeStorageKey('docs/a b.pdf'), false, 'space would break the URL');
  assert.equal(isSafeStorageKey('docs/a?x=1.pdf'), false, 'query separator is not part of a key');
  assert.equal(isSafeStorageKey(''), false);
  assert.equal(isSafeStorageKey(null), false);
});

test('CDN URLs are only built from a configured base and a safe key', () => {
  assert.equal(
    cdnUrlFor(doc(), 'https://files.example.com'),
    'https://files.example.com/docs/5bc3744aa1c8635c/cardiac.pdf',
  );
  // Unconfigured base must fail closed rather than produce a relative URL.
  assert.equal(cdnUrlFor(doc(), ''), null);
  assert.equal(cdnUrlFor(doc({ storage_key: '../secret.pdf' }), 'https://files.example.com'), null);
});

test('streaming is claimed only for linearized PDFs', () => {
  assert.equal(canStream(doc()), true);
  // Without a front-loaded hint table pdf.js would chase the cross-reference
  // table over dozens of ranges — slower than one sequential download.
  assert.equal(canStream(doc({ linearized: false })), false);
  assert.equal(canStream(doc({ mime: 'application/zip' })), false);
  assert.equal(canStream(null), false);
});

test('byte sizes render in the unit a student can judge', () => {
  assert.equal(formatBytes(0), '—');
  assert.equal(formatBytes(null), '—');
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(200 * 1024), '200 KB');
  assert.equal(formatBytes(4 * 1024 * 1024), '4.0 MB');
  assert.equal(formatBytes(240 * 1024 * 1024), '240 MB');
  assert.equal(formatBytes(3 * 1024 * 1024 * 1024), '3.0 GB');
});

test('every kind id has a label and unknown kinds fall back', () => {
  for (const k of LIBRARY_KINDS) assert.ok(kindLabel(k.id), `${k.id} needs a label`);
  assert.equal(kindLabel('not-a-kind'), kindLabel('other'));
});

test('the search haystack is lowered once, not per keystroke', () => {
  const index = indexDocs([doc()]);
  assert.equal(index.length, 1);
  assert.equal(index[0]._hayLc, index[0]._hayLc.toLowerCase());
  assert.ok(index[0]._hayLc.includes('cardio'), 'topics belong in the haystack');
  assert.ok(index[0]._hayLc.includes('ระบบหัวใจ'), 'Thai description belongs in the haystack');
  assert.equal(index[0].doc.id, 'id-1', 'the original row rides along, not a copy');
});

test('filters compose and every term must match', () => {
  const docs = [
    doc({ id: 'a', title: 'Cardiac handout', kind: 'handout', year: 5, subject: 'com5' }),
    doc({ id: 'b', title: 'Renal textbook', kind: 'textbook', year: 4, subject: 'com4', topics: ['renal'], description: null }),
  ];
  const index = indexDocs(docs);

  assert.deepEqual(filterIndexed(index, {}).map((d) => d.id), ['a', 'b']);
  assert.deepEqual(filterIndexed(index, { kind: 'textbook' }).map((d) => d.id), ['b']);
  assert.deepEqual(filterIndexed(index, { year: 5 }).map((d) => d.id), ['a']);
  assert.deepEqual(filterIndexed(index, { year: '5' }).map((d) => d.id), ['a'], 'chip values arrive as strings');
  assert.deepEqual(filterIndexed(index, { subject: 'com4' }).map((d) => d.id), ['b']);
  assert.deepEqual(filterIndexed(index, { query: 'renal' }).map((d) => d.id), ['b']);
  assert.deepEqual(filterIndexed(index, { query: 'CARDIAC' }).map((d) => d.id), ['a'], 'query is case-insensitive');
  // Multi-term search is AND, so a second word narrows instead of widening.
  assert.deepEqual(filterIndexed(index, { query: 'renal textbook' }).map((d) => d.id), ['b']);
  assert.deepEqual(filterIndexed(index, { query: 'renal cardiac' }).map((d) => d.id), []);
  assert.deepEqual(filterIndexed(index, { kind: 'textbook', year: 5 }).map((d) => d.id), []);
  assert.deepEqual(filterIndexed(null, {}), []);
});

// The ingest script writes library_docs.sha256_16 and the reader keys its
// strokes on hashFile(). If the two ever disagree on the digest or the slice,
// every annotation on every library document silently orphans.
test('catalog sha256_16 matches the annotation key the reader derives', async () => {
  const bytes = Buffer.from('VetMock library contract', 'utf8');
  const fromIngest = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const fromReader = await hashFile(new Blob([bytes]));

  assert.equal(fromReader, fromIngest);
  assert.match(fromIngest, /^[0-9a-f]{16}$/, 'must satisfy the schema CHECK constraint');
});
