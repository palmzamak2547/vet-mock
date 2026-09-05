import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import worker, { authorizedPayload, byteRange } from '../../workers/library-archive.js';
import { mintBlobToken } from '../../api/_lib/blob-token.js';

const serverEnv = { CLOUDFLARE_API_TOKEN: 'test-only' };
const env = { ARCHIVE_BUCKET: 'test-bucket', BLOB_MAC_KEY: crypto.createHash('sha256').update('vetmock-library-blob:test-only').digest('base64') };
const doc = { storage_bucket: 'test-bucket', storage_key: 'archives/vca/objects/test.pdf', mime: 'application/pdf', byte_size: 10, file_name: 'เอกสาร.pdf' };
const urlFor = (data = doc, options = {}) => new URL('https://archive.test/?' + new URLSearchParams(mintBlobToken(data, { env: serverEnv, ...options })));

test('archive tokens reject expiry, signature changes, other buckets and non-archive objects', async () => {
  assert.equal((await authorizedPayload(urlFor(), env)).k, doc.storage_key);
  const changed = urlFor(); changed.searchParams.set('s', 'wrong');
  assert.equal(await authorizedPayload(changed, env), null);
  assert.equal(await authorizedPayload(urlFor(doc, { ttlSeconds: -1 }), env), null);
  assert.equal(await authorizedPayload(urlFor({ ...doc, storage_bucket: 'other' }), env), null);
  assert.equal(await authorizedPayload(urlFor({ ...doc, storage_key: 'docs/private.pdf' }), env), null);
  assert.equal(await authorizedPayload(urlFor({ ...doc, storage_key: 'archives/vca/../private' }), env), null);
});

test('archive byte ranges include suffixes, open ends and unsatisfiable ranges', () => {
  assert.equal(byteRange(null, 10), null);
  assert.deepEqual(byteRange('bytes=2-5', 10), { offset: 2, length: 4 });
  assert.deepEqual(byteRange('bytes=2-', 10), { offset: 2, length: 8 });
  assert.deepEqual(byteRange('bytes=-3', 10), { offset: 7, length: 3 });
  assert.deepEqual(byteRange('bytes=0-999', 10), { offset: 0, length: 10 });
  for (const range of ['bytes=10-', 'bytes=-0', 'bytes=5-2', 'bytes=0-1,3-4', 'garbage']) assert.equal(byteRange(range, 10), false);
});

test('the archive streams only the requested bytes, answers HEAD and denies anonymous reads', async () => {
  const reads = [];
  const storage = {
    head: async () => ({ size: 10, httpEtag: '"hash"', customMetadata: {} }),
    get: async (_key, options) => { reads.push(options); return { body: new TextEncoder().encode('2345') }; },
  };
  const runtime = { ...env, ARCHIVE: storage };
  const denied = await worker.fetch(new Request('https://archive.test/'), runtime);
  assert.equal(denied.status, 403);
  const response = await worker.fetch(new Request(urlFor(), { headers: { Range: 'bytes=2-5' } }), runtime);
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), 'bytes 2-5/10');
  assert.equal(response.headers.get('Content-Length'), '4');
  assert.equal(await response.text(), '2345');
  assert.deepEqual(reads, [{ range: { offset: 2, length: 4 } }]);
  assert.match(response.headers.get('Content-Disposition'), /filename\*=UTF-8''/);
  const head = await worker.fetch(new Request(urlFor(), { method: 'HEAD' }), runtime);
  assert.equal(head.headers.get('Content-Length'), '10');
  assert.equal(await head.text(), '');
  assert.equal(reads.length, 1);
  const unsatisfiable = await worker.fetch(new Request(urlFor(), { headers: { Range: 'bytes=100-' } }), runtime);
  assert.equal(unsatisfiable.status, 416);
  assert.equal(unsatisfiable.headers.get('Content-Range'), 'bytes */10');
  assert.equal(reads.length, 1);
  assert.equal((await worker.fetch(new Request(urlFor(), { method: 'PUT', body: 'change' }), runtime)).status, 405);
});
