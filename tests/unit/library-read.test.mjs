// ============================================================
// library-read.test.mjs — scripts read the library past the Chula wall
// ============================================================
// Behind the wall the anon key reads no library row and /api/library-file signs
// only for a member, so the video pipeline's decks step and the provenance
// crops failed with HTTP 401 from 5.184.0. Both now read through
// scripts/lib/library-read.mjs (Management API + R2) or the same query, and only
// what a member is served: public, never held for personal data.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SERVED, librarySql, libraryCatalog, libraryFirstPages, libraryFileBytes } from '../../scripts/lib/library-read.mjs';

// A fetch that answers the Management API from a queue and records each call.
function fake(answers) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url: String(url), init, query: init.body ? JSON.parse(init.body).query : null });
    const next = answers.shift();
    if (next instanceof Uint8Array) return new Response(next, { status: 200 });
    return Response.json(next ?? [], { status: 200 });
  };
  return { calls, fetchImpl };
}
const env = { SUPABASE_ACCESS_TOKEN: 'test-token', R2_ACCOUNT_ID: 'acct', CLOUDFLARE_API_TOKEN: 'cf-token' };

test('without a Management API token the read says why instead of trying the anon key', async () => {
  await assert.rejects(librarySql('select 1', { env: {}, fetchImpl: async () => { throw new Error('no network expected'); } }), /behind the Chula wall: set SUPABASE_ACCESS_TOKEN/);
});

test('the catalog and first pages are served documents only', async () => {
  const { calls, fetchImpl } = fake([[{ id: 'a' }], [{ doc_id: 'a', body: 'x' }]]);
  assert.deepEqual(await libraryCatalog({ env, fetchImpl }), [{ id: 'a' }]);
  await libraryFirstPages(['11111111-1111-1111-1111-111111111111', "x'); drop table library_docs; --"], { env, fetchImpl });
  assert.ok(calls.every((c) => c.url.startsWith('https://api.supabase.com/v1/projects/') && c.init.headers.Authorization === 'Bearer test-token'));
  assert.ok(calls[0].query.includes(SERVED));
  assert.ok(calls[1].query.includes('p.page = 1') && calls[1].query.includes(SERVED));
  assert.ok(calls[1].query.includes("'x''); drop table library_docs; --'::uuid"), 'ids are quoted, never spliced');
  assert.equal(SERVED, "d.status = 'public' and d.text_status is distinct from 'pii_held'");
});

test('a file comes from R2 by its storage key, never through the member-only link', async () => {
  const pdf = new TextEncoder().encode('%PDF-1.7');
  const { calls, fetchImpl } = fake([[{ storage_provider: 'r2', storage_bucket: 'vetmock-library', storage_key: 'docs/abc/ตรี deck.pdf' }], pdf]);
  const bytes = await libraryFileBytes("o'brien-deck", { env, fetchImpl });
  assert.equal(bytes.toString('latin1'), '%PDF-1.7');
  assert.ok(calls[0].query.includes("d.slug = 'o''brien-deck'") && calls[0].query.includes(SERVED));
  assert.equal(calls[1].url, `https://api.cloudflare.com/client/v4/accounts/acct/r2/buckets/vetmock-library/objects/docs/abc/${encodeURIComponent('ตรี deck.pdf')}`);
  assert.equal(calls[1].init.headers.Authorization, 'Bearer cf-token');
  assert.ok(!calls.some((c) => c.url.includes('/api/library-file')));
});

test('a held, missing or non-R2 document is refused with a reason', async () => {
  await assert.rejects(libraryFileBytes('held-roster', { env, fetchImpl: fake([[]]).fetchImpl }), /not a served library document/);
  await assert.rejects(libraryFileBytes('in-storage', { env, fetchImpl: fake([[{ storage_provider: 'supabase', storage_key: 'k' }]]).fetchImpl }), /not R2/);
  await assert.rejects(libraryFileBytes('deck', { env: { SUPABASE_ACCESS_TOKEN: 't' }, fetchImpl: fake([[{ storage_provider: 'r2', storage_key: 'k' }]]).fetchImpl }), /R2_ACCOUNT_ID and CLOUDFLARE_API_TOKEN/);
});

test('the video pipeline and the provenance crops no longer read the library with the anon key', () => {
  const pipeline = fs.readFileSync(new URL('../../scripts/video-pipeline.mjs', import.meta.url), 'utf8');
  assert.match(pipeline, /from '\.\/lib\/library-read\.mjs'/);
  assert.doesNotMatch(pipeline, /VITE_SUPABASE_ANON_KEY|\/api\/library-file\?|rest\/v1\/library_/);
  const crops = fs.readFileSync(new URL('../../scripts/provenance/crops.py', import.meta.url), 'utf8');
  assert.doesNotMatch(crops, /rest\/v1\/library_docs/);
  assert.match(crops, /text_status is distinct from 'pii_held'/);
});
